/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const Mongo = require('mongodb');
const fetch = require('node-fetch');
const Boom = require('boom');
const { PDFDocument } = require('pdf-lib');
const DocumentService = require('../../services/document-srv');
const { types: documentTypes } = require('../../services/document-srv/document-types');
const config = require('../../config');
const { replaceOneConsulting, findOneConsulting } = require('./constants');
const PracticeService = require('../../services/practice-srv');
const DossierInsurerConfigurationService = require('../../services/dossier-insurer-srv');
const NetworkService = require('../../services/network-srv');
const DossierInsurerSrv = require('../../services/dossier-insurer-srv');
const { dateToPeriod, unparse } = require('../../utils/productive-period-helper');
const precontractualRepository = require('../../services/precontractual-srv/precontractual-repository');
const documentRepository = require('../../services/document-srv/document-repository');
const LogEvent = require('../../services/commissioning-flow-srv/log-event');
require('../../utils/foreach');

function translateDocumentName(name) {
  switch (name) {
    case 'atf':
      return `Attestato Di Fine Consulenza`;
    case 'allegato4':
      return `Allegato 4-4-Bis Firmato`;
    case 'adequacy':
      return `Adeguatezza`;
    case 'fiscal':
      return `Codice Fiscale`;
    case 'sepa':
      return `Sepa`;
    default:
      return `Attestato Di Fine Consulenza`;
  }
}
const MailService = require('../../services/mail-srv');
const logRepository = require('../../services/commissioning-flow-srv/log-repository');

/*
const useSepaNumber = async (db, productId, promoterId) => {
  const number = await db
    .collection(PRODUCT_NUMBERS)
    .find({ productId, available: true })
    .sort({ counter: 1 })
    .limit(1)
    .toArray()
    .then((res) => res[0]);

  if (!number) {
    throw new Error('Nessuna numerica disponibile per AdFee SEPA');
  }

  const update = { available: false, promoterId, dateUsed: new Date() };
  await db.collection(PRODUCT_NUMBERS).updateOne({ _id: number._id }, { $set: update }, { upsert: true });
  return number.counter;
};
*/

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Update pdf signature for consulting procedure',
      tags: ['survey'],
      params: {
        type: 'object',
        properties: {
          resultId: {
            type: 'string',
            description: 'Consulting ID',
          },
        },
      },
    },
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  fastify.post('/', options, async (req, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;
    const sql = fastify.knex;
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
    const practiceService = new PracticeService(fastify.mongo.db, fastify.s3.client);
    const dossierInsurerConfigurationService = new DossierInsurerConfigurationService(fastify.mongo.db);
    const networkService = new NetworkService(fastify.mongo.db);
    const dossierInsurerSrv = new DossierInsurerSrv(fastify.mongo.db, sql);
    const mailService = new MailService(fastify.mandrill, fastify.url, fastify.edition, fastify.env);

    const { productivePeriodYear, productivePeriodMonth } = unparse(dateToPeriod());

    const { resultId } = req.params;

    let doc = await findOneConsulting(sql, resultId);
    if (!doc) {
      return reply.send(Boom.badRequest('consulenza non trovata'));
    }

    try {
      doc.signature = req.body.signature;
      await replaceOneConsulting(sql, doc);

      let isThirdPayerCompleted = true;
      if (doc.sepa.isThirdPayer) isThirdPayerCompleted = doc.signature.thirdPayer.status === 'done';
      // check that all files have been signed
      if (
        doc.signature.customer.status === 'done' &&
        doc.signature.promoter.status === 'done' &&
        isThirdPayerCompleted
      ) {
        doc.signature.procedureCompleted = true;
        doc.signature.signedDate = new Date();
      }

      if (!doc.signature.procedureCompleted) {
        return reply.send({ item: doc });
      }

      // When both parties have signed, download all PDFs and store them in S3

      const documents = [];
      for (const file of doc.signature.files) {
        // fetch pdf from yousign
        const base64 = await fetch(`${config.yousign.endpoint}${file.fileId}/download`, {
          headers: {
            Authorization: `Bearer ${config.yousign.token}`,
            'Content-Type': 'application/json',
          },
        }).then((res) => res.json());

        if (typeof base64 !== 'string') {
          return reply.send(Boom.badRequest(`Failed to download PDF`));
        }

        // flatten the pdf before storing it
        const pdfDoc = await PDFDocument.load(base64);
        pdfDoc.getForm().flatten();
        const pdfBuffer = await pdfDoc.save();
        const buffer = Buffer.from(pdfBuffer);

        // store pdf
        const storedPdf = await documentService.addDocument(
          {
            type: documentTypes.SIGNED_SURVEYS,
            ownerId: 'SYSTEM',
            displayName: `${resultId}-${file.fileId}-firmato.pdf`,
            locked: true,
          },
          buffer,
        );

        documents.push({
          type: 'application/pdf',
          name: `${resultId}-${file.fileId}-firmato.pdf`,
          content: buffer.toString('base64'),
        });

        file.documentId = storedPdf._id;
      }

      if (doc.signature && doc.signature.procedureCompleted) {
        const networkNodeId = await networkService.getNetworkNodeIdByPromoterAndPeriod(doc.promoter.promoterId);

        const insured = await sql
          .select()
          .from('person')
          .where('uuid', doc.customerId)
          .then((results) => results[0]);

        const precontractual = await precontractualRepository.getbyPersonId(sql, insured.id);
        let document = await precontractualRepository.getDocumentByPersonId(sql, insured.id);

        let legalPerson;
        if (insured.isCompany) {
          const legalPersonPerson = await sql
            .select()
            .from('person_person')
            .where('personId', insured.id)
            .andWhere('personTypeKey', 5)
            .then((results) => results[0]);

          legalPerson = await sql
            .select()
            .from('person')
            .where('id', legalPersonPerson.linkedPersonId)
            .then((results) => results[0]);

          document = await precontractualRepository.getDocumentByPersonId(sql, legalPersonPerson.linkedPersonId);
        }

        // 4. upsert
        const attachments = [];
        const attachmentsSepa = [];
        await doc.signature.files.forEachAsync(async (file) => {
          const thisDocument = await documentRepository.get(db, file.documentId);
          const attachment = await practiceService.createAttachment({
            promoterId: doc.promoter.promoterId,
            bucket: thisDocument.bucket,
            path: thisDocument.path,
            fileName: `${translateDocumentName(file.fileType)}.pdf`,
          });
          if (file.fileType !== 'sepa') {
            attachments.push({
              AttachmentIdentifier: attachment._id,
              Tipo: translateDocumentName(file.fileType),
              Descrizione: file.fileType,
              DataScadenza: null,
              ModifiedOn: null,
              CheckDirezione: null,
              NomeFile: file.fileType,
              DataEmissioneDocumento: null,
              NumeroDocumento: null,
              TipoDocumento: null,
              ClienteIdentifier: null,
            });
          }
          attachmentsSepa.push({
            AttachmentIdentifier: attachment._id,
            Tipo: translateDocumentName(file.fileType),
            Descrizione: `${file.fileType}.pdf`,
            DataScadenza: null,
            ModifiedOn: null,
            CheckDirezione: null,
            NomeFile: `${file.fileType}.pdf`,
            DataEmissioneDocumento: null,
            NumeroDocumento: null,
            TipoDocumento: null,
            ClienteIdentifier: null,
          });
        });
        const fiscalDocument = await documentRepository.get(db, precontractual.fiscalCodeFile.attachmentId);
        const attachmentCodiceFiscale = await practiceService.createAttachment({
          promoterId: doc.promoter.promoterId,
          bucket: fiscalDocument.bucket,
          path: fiscalDocument.path,
          fileName: `Codice Fiscale.pdf`,
        });
        if (insured.isCompany) {
          attachments.push({
            AttachmentIdentifier: attachmentCodiceFiscale._id,
            Tipo: translateDocumentName('fiscal'),
            Descrizione: 'fiscal',
            DataScadenza: null,
            ModifiedOn: null,
            CheckDirezione: null,
            NomeFile: 'visura-camerale',
            DataEmissioneDocumento: null,
            NumeroDocumento: null,
            TipoDocumento: null,
            ClienteIdentifier: null,
          });
        }
        const identityDocument = await documentRepository.get(db, document.attachmentObj.attachmentId);
        const attachmentIdentity = await practiceService.createAttachment({
          promoterId: doc.promoter.promoterId,
          bucket: identityDocument.bucket,
          path: identityDocument.path,
          fileName: `Identità.pdf`,
        });
        const mandatoDocument = await documentRepository.get(db, precontractual.signatureDocuments.documentIdMandate);
        const attachmentMandato = await practiceService.createAttachment({
          promoterId: doc.promoter.promoterId,
          bucket: mandatoDocument.bucket,
          path: mandatoDocument.path,
          fileName: `Mandato.pdf`,
        });
        const privacyDocument = await documentRepository.get(db, precontractual.signatureDocuments.documentIdPrivacy);
        const attachmentPrivacy = await practiceService.createAttachment({
          promoterId: doc.promoter.promoterId,
          bucket: privacyDocument.bucket,
          path: privacyDocument.path,
          fileName: `Privacy.pdf`,
        });
        const mandato = await practiceService.createMandatoCliente({
          insured,
          promoterId: doc.promoter.promoterId,
          attachmentCodiceFiscale,
          attachmentIdentity,
          attachmentMandato,
          identity: document,
        });
        const privacy = await practiceService.createPrivacyCliente({
          insured,
          promoterId: doc.promoter.promoterId,
          attachmentPrivacy,
        });
        const isSubscription = doc.proposalNumber.slice(0, 3) === 'SUB';
        const originalSubPractice = !isSubscription
          ? await practiceService.getPracticeSubscriptionByIdLegacy(doc.product.practiceId.slice(3))
          : undefined;

        const practice = isSubscription
          ? await practiceService.createPractice({
              _t: 'PraticaSottoscrizione',
              customerId: doc.customerId,
              promoterId: doc.promoter.promoterId,
              productId: doc.product.productId,
              productName: doc.product.name,
              companyId: doc.product.companyId,
              companyName: doc.product.company,
              productivePeriodYear,
              productivePeriodMonth,
              practiceId: doc.proposalNumber.slice(3),
              dossierId: doc.proposalNumber.slice(3),
              customerName: `${insured.name} ${insured.surname}`,
              insured,
              identity: document,
              attachments,
              mandato,
              privacy,
              legalPerson,
              email: doc.signature.customer.email,
            })
          : await practiceService.createPracticeAdditionalIncome({
              _t: 'PraticaVersamentoAggiuntivo',
              customerId: doc.customerId,
              promoterId: doc.promoter.promoterId,
              productId: doc.product.productId,
              productName: doc.product.name,
              companyId: doc.product.companyId,
              companyName: doc.product.company,
              productivePeriodYear,
              productivePeriodMonth,
              practiceId: doc.proposalNumber,
              dossierId: doc.product.practiceId.slice(3),
              contractId: doc.product.contractId,
              customerName: `${insured.name} ${insured.surname}`,
              insured,
              identity: document,
              attachments,
              mandato,
              privacy,
              legalPerson,
              originalSubPractice,
            });

        if (doc.sepa.hasAdvisoryFee) {
          const sepaNumber = `ADF${doc.proposalNumber.slice(isSubscription ? 3 : 2)}`;

          const sepaPractice = await practiceService.createPractice({
            _t: 'PraticaSottoscrizione',
            customerId: doc.customerId,
            promoterId: doc.promoter.promoterId,
            productId: '3da39010-1692-4e9a-a58c-df8f5ad85129',
            productName: 'ADfee',
            companyId: 'db70a2e5-81d8-9046-9b9c-aa2c008d0a1e',
            companyName: 'SHELTIA',
            productivePeriodYear,
            productivePeriodMonth,
            practiceId: sepaNumber,
            dossierId: sepaNumber,
            customerName: `${insured.name} ${insured.surname}`,
            insured,
            identity: document,
            attachments: attachmentsSepa,
            mandato,
            privacy,
            legalPerson,
            sepa: doc.sepa,
            email: doc.signature.customer.email,
          });

          await dossierInsurerConfigurationService.addDossierInsurer({
            dossierId: sepaNumber,
            productivePeriodYear,
            productivePeriodMonth,
            promoterId: doc.promoter.promoterId,
            networkNodeId,
          });

          const newPractice = {
            ...sepaPractice,
            uuid: sepaPractice._id,
            practiceType: sepaPractice.type,
            paymentMode: sepaPractice.paymentMode ? sepaPractice.paymentMode : {},
            customer: sepaPractice.customer ? { customers: sepaPractice.customer } : {},
            premiumNet: sepaPractice.premiumNet / 100,
            premiumGross: sepaPractice.premiumGross / 100,
            recurringPremium: sepaPractice.recurringPremium / 100,
            uniquePremium: sepaPractice.uniquePremium / 100,
            amountPaid: sepaPractice.amountPaid / 100,
            legacy: sepaPractice,
          };
          // @ts-ignore
          delete newPractice._id;
          delete newPractice.type;

          await sql('practice').insert(newPractice);

          const dossierInsurer = await dossierInsurerSrv.getDossierInsurer(
            sepaNumber,
            productivePeriodYear,
            productivePeriodMonth,
          );

          await sql('practice_owner').insert({
            uuid: dossierInsurer._id,
            legacy: dossierInsurer,
            dossierId: dossierInsurer.dossierId,
            networkNodeId: dossierInsurer.networkNodeId,
            ownerId: dossierInsurer.promoterId,
            productivePeriodMonth: dossierInsurer.productivePeriodMonth,
            productivePeriodYear: dossierInsurer.productivePeriodYear,
          });
        }
        if (doc.proposalNumber.slice(0, 3) === 'SUB') {
          await dossierInsurerConfigurationService.addDossierInsurer({
            dossierId: doc.proposalNumber.slice(3),
            productivePeriodYear,
            productivePeriodMonth,
            promoterId: doc.promoter.promoterId,
            networkNodeId,
          });
        }

        const newPractice = {
          ...practice,
          uuid: practice._id,
          practiceType: practice.type,
          paymentMode: practice.paymentMode ? practice.paymentMode : {},
          customer: practice.customer ? { customers: practice.customer } : {},
          premiumNet: practice.premiumNet / 100,
          premiumGross: practice.premiumGross / 100,
          recurringPremium: practice.recurringPremium / 100,
          uniquePremium: practice.uniquePremium / 100,
          amountPaid: practice.amountPaid / 100,
          legacy: practice,
        };
        // @ts-ignore
        delete newPractice._id;
        delete newPractice.type;

        await sql('practice').insert(newPractice);
        if (doc.proposalNumber.slice(0, 3) === 'SUB') {
          const dossierInsurer = await dossierInsurerSrv.getDossierInsurer(
            doc.proposalNumber.slice(3),
            productivePeriodYear,
            productivePeriodMonth,
          );

          await sql('practice_owner').insert({
            uuid: dossierInsurer._id,
            legacy: dossierInsurer,
            dossierId: dossierInsurer.dossierId,
            networkNodeId: dossierInsurer.networkNodeId,
            ownerId: dossierInsurer.promoterId,
            productivePeriodMonth: dossierInsurer.productivePeriodMonth,
            productivePeriodYear: dossierInsurer.productivePeriodYear,
          });
        }

        doc = { ...doc, practiceUuid: practice._id };
      }

      await replaceOneConsulting(sql, doc);

      const params = {
        attachments: documents,
        emailClientTo: doc.signature.customer.email,
        emailConsulenteTo: doc.signature.promoter.email,
      };

      if (doc.signature.thirdPayer.email) params.emailThirdPayerTo = doc.signature.thirdPayer.email;

      await mailService.sendSignedDocs(params);

      return reply.send({ item: doc });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error.message);
      // eslint-disable-next-line no-console
      console.log(error.stack);
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE UPDATE PDF SIGNATURE CONSULENZA ${resultId} ${error.message} `,
        }),
      );
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE UPDATE PDF SIGNATURE CONSULENZA ${resultId} ${error.stack} `,
        }),
      );
      return reply.send(Boom.badRequest(error.stack));
    }
  });

  next();
};
