/* eslint-disable security/detect-object-injection, no-param-reassign */
const Mongo = require('mongodb');
const Knex = require('knex');
const Boom = require('boom');
const moment = require('moment');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { CONSULTING, replaceOneConsulting, findOneConsulting } = require('./constants');
const { SEPA_NUMBERS } = require('../numbers/constants');
const config = require('../../config');
const personRepository = require('../../services/person-srv/person-repository');
const DocumentService = require('../../services/document-srv');
const surveyResultRepository = require('../../services/survey-srv/survey-result-repository');

const nomeRagioneSociale = (data) => {
  if (data.isCompany && data.companyName) return data.companyName;
  return `${data.name} ${data.surname}`;
};

const withAddress = (address, cb) => {
  cb({
    indirizzo: `${address.route} ${address.streetNumber}`,
    cap: `${address.postalCode} ${address.city} (${address.province})`,
  });
};

const signedBy = (doc) => {
  if (doc.isCompany && doc.companyName) {
    return `Firmato per conto di ${doc.companyName}`;
  }
  if (doc.signature) {
    return `Firmato da ${doc.signature.customer.info.name} ${doc.signature.customer.info.surname}`;
  }
  return `${doc.name} ${doc.surname}`;
};

const today = () => moment().format('DD/MM/YYYY').toString();

const populatePrevidenzaProtezioneInvestimento = ({ form, doc }) => {
  form.getTextField('Consulente_cognome_nome').setText(`${doc.promoter.name} ${doc.promoter.surname}`);
  form.getTextField('N_iscrizione_RUI').setText(doc.promoter.ivassCode);
  form.getTextField('N_proposta').setText(doc.proposalNumber);
  form
    .getTextField('Cliente_cognome_nome')
    .setText(`${doc.signature.customer.info.name} ${doc.signature.customer.info.surname}`);
  form.getTextField('Prodotto_nome').setText(doc.product.name);
  form.getTextField('Azienda_prodotto_nome').setText(doc.product.company);
  form.getTextField('Altre_info').setText(doc.extraInfo.extraInfo);
  form.getTextField('Luogo').setText(doc.extraInfo.place);
  form.getTextField('Data').setText(today());
};

const populateSepa = ({ form, doc, person }) => {
  form.getTextField('Numero_sepa').setText(doc.sepa.number);

  // consulting
  form.getTextField('Nome_cognome_ragione_sociale').setText(doc.sepa.customer.name);
  withAddress(doc.sepa.address, ({ indirizzo, cap }) => {
    form.getTextField('indirizzo_completo').setText(indirizzo);
    form.getTextField('cap_localita_provincia').setText(cap);
  });
  form.getTextField('codice_fiscale_partita_iva').setText(doc.sepa.customer.fiscalCode);
  form.getTextField('iban').setText(doc.sepa.iban.iban);
  form.getTextField('swift').setText(doc.sepa.iban.swift);

  // person
  form.getTextField('Nome_cognome_ragione_sociale_pagatore').setText(nomeRagioneSociale(person));
  withAddress(person.address, ({ indirizzo, cap }) => {
    form.getTextField('indirizzo_completo_pagatore').setText(indirizzo);
    form.getTextField('cap_localita_provincia_pagatore').setText(cap);
  });
  form.getTextField('codice_fiscale_pagatore').setText(person.fiscalCode);

  form.getTextField('Luogo').setText(doc.extraInfo.place);
  form.getTextField('Data').setText(today());
};

const populateAllegato4Impresa = ({ form, doc }) => {
  form.getTextField('Azienda_distributrice').setText(doc.distribution.company.name);
  form.getTextField('Azienda_n_iscrizione_RUI').setText(doc.distribution.company.ivass);
  form.getTextField('Cellualre_consulente').setText(doc.promoter.mobilePhone);
  form.getTextField('Data_iscrizione_RUI').setText(doc.promoter.ruiSignupDate);
  form.getTextField('Data').setText(today());
  form.getTextField('Email_consulente').setText(doc.promoter.email);

  withAddress(doc.promoter.address, ({ indirizzo, cap }) => {
    form.getTextField('Indirizzo_filiale').setText(`${indirizzo} ${cap}`);
  });

  form.getTextField('Intermediario_nome_cognome').setText(`${doc.promoter.name} ${doc.promoter.surname}`);
  form.getTextField('Luogo').setText(doc.extraInfo.place);

  form.getTextField('N_iscrizione_RUI').setText(doc.promoter.ivassCode);

  form.getTextField('Riferimento1').setText(doc.distribution.riskText);
  // form.getTextField('Riferimento2').setText('asdf');
  // form.getTextField('Riferimento3').setText('asdf');
};

const populateAllegato4Intermediari = ({ form, doc }) => {
  form.getTextField('Azienda_assicurazioni_collocate').setText(doc.distribution.company.principalCompany);
  form.getTextField('Azienda_intermediaria').setText(doc.distribution.company.name);
  form.getTextField('Azienda_n_iscrizione_RUI').setText(doc.distribution.company.rui);

  form.getTextField('Cellualre_consulente').setText(doc.promoter.mobilePhone);
  form.getTextField('Consulente_nome_cognome').setText(`${doc.promoter.name} ${doc.promoter.surname}`);

  form.getTextField('Data_iscrizione_RUI').setText(doc.promoter.ruiSignupDate);
  form.getTextField('Data').setText(today());
  form.getTextField('Email_consulente').setText(doc.promoter.email);

  withAddress(doc.promoter.address, ({ indirizzo, cap }) => {
    form.getTextField('Indirizzo_filiale').setText(`${indirizzo} ${cap}`);
  });

  form.getTextField('Luogo').setText(doc.extraInfo.place);

  form.getTextField('N_iscrizione_RUI').setText(doc.promoter.ivassCode);

  form.getTextField('Riferimento1').setText(doc.distribution.riskText);

  // form.getTextField('Riferiemnto2').setText('asdf');
};

const documentForCategory = async (doc, sql) => {
  const protezioneFileObjects = {
    customer: [
      {
        page: 2,
        position: '57,416,267,468',
        mention: 'Read and approved',
        mention2: signedBy(doc),
      },
    ],
    promoter: [
      {
        page: 2,
        position: '57,495,267,548',
        mention: 'Read and approved',
        mention2: `Firmato da ${doc.signature.promoter.info.name} ${doc.signature.promoter.info.surname}`,
      },
    ],
    thirdPayer: [],
  };

  const investimentoFileObjects = {
    customer: [
      {
        page: 2,
        position: '56,128,268,232',
        mention: 'Read and approved',
        mention2: signedBy(doc),
      },
    ],
    promoter: [
      {
        page: 2,
        position: '57,248,268,302',
        mention: 'Read and approved',
        mention2: `Firmato da ${doc.signature.promoter.info.name} ${doc.signature.promoter.info.surname}`,
      },
    ],
    thirdPayer: [],
  };

  const category = doc.product.category.toLowerCase();

  if (category === 'previdenza') {
    return {
      source: 'previdenza.pdf',
      fileObjects: protezioneFileObjects,
      populate: populatePrevidenzaProtezioneInvestimento,
    };
  }

  if (category === 'protezione') {
    return {
      source: 'protezione.pdf',
      fileObjects: protezioneFileObjects,
      populate: populatePrevidenzaProtezioneInvestimento,
    };
  }

  if (category.includes('investimento')) {
    const survey = await surveyResultRepository.getById(sql, doc.adequacy.resultId);
    const question = survey.questions.find(
      (el) => el._id === '18-ad-sostenibilita' || el._id === 'g18-ad-sostenibilita',
    );
    const response = question ? question.responses.find((el) => el.selected) : undefined;

    let source = 'investimento.pdf';
    source = response && response._id === '01-si' ? 'investimento._si.pdf' : 'investimento._no.pdf';

    return {
      source,
      fileObjects: investimentoFileObjects,
      populate: populatePrevidenzaProtezioneInvestimento,
    };
  }

  throw new Error(`Invalid category ${category}`);
};

const loadDocument = async (source) => {
  const file = await fs.readFileSync(path.resolve(__dirname, './documents/', source));
  const pdfDoc = await PDFDocument.load(file);
  const form = pdfDoc.getForm();

  // touch all fields
  form.getFields().forEach((field) => form.getTextField(field.getName()).setText(''));

  return { pdfDoc, form };
};

const storeDocument = async (filename, pdfDoc /* PdfDocument | ArrayBuffer */) => {
  let pdfBuffer;

  if (pdfDoc instanceof PDFDocument) {
    const finalDoc = await pdfDoc.save();
    pdfBuffer = finalDoc;
  } else {
    pdfBuffer = pdfDoc;
  }

  // call /files endpoint with pdf payload in base64
  return fetch(`${config.yousign.endpoint}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.yousign.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: filename,
      content: Buffer.from(pdfBuffer).toString('base64'),
    }),
  }).then((res) => res.json());
};

const startProcedure = async ({ doc, customerFileObjects, promoterFileObjects, thirdPayerFileObjects }) => {
  const customerInfo = doc.signature.customer.info;
  const promoterInfo = doc.signature.promoter.info;
  const thirdPayerInfo = doc.signature.thirdPayer.info;

  const customer = {
    firstname: customerInfo.name,
    lastname: customerInfo.surname,
    email: customerInfo.email,
    phone: customerInfo.mobilePhone,
    fileObjects: customerFileObjects,
  };

  const promoter = {
    firstname: promoterInfo.name,
    lastname: promoterInfo.surname,
    email: promoterInfo.email,
    phone: promoterInfo.mobilePhone,
    fileObjects: promoterFileObjects,
  };

  const thirdPayer = {
    firstname: thirdPayerInfo.name,
    lastname: thirdPayerInfo.surname,
    email: thirdPayerInfo.email,
    phone: thirdPayerInfo.mobilePhone,
    fileObjects: thirdPayerFileObjects,
  };

  const body = {
    name: 'Consulenza',
    description: 'Consulenza',
    members: [customer, promoter],
  };

  if (doc.sepa.isThirdPayer) {
    body.members.push(thirdPayer);
  }

  // call /procedures endpoint with members info
  const youSignProcedure = await fetch(`${config.yousign.endpoint}/procedures`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.yousign.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

  if (youSignProcedure.members === undefined) {
    throw new Error(`Errore nel creare procedura su yousign. ${JSON.stringify(youSignProcedure)}`);
  }

  return youSignProcedure;
};

const getNextSepaNumber = async (db, customerId) => {
  // Find free number
  const number = await db
    .collection(SEPA_NUMBERS)
    .find({ available: true })
    .sort({ counter: 1 })
    .limit(1)
    .toArray()
    .then((res) => res[0]);

  if (!number) {
    throw new Error('Nessuna numerica SEPA disponibile');
  }

  // Set number as unavailable
  const update = { available: false, customerId, dateUsed: new Date() };
  await db.collection(SEPA_NUMBERS).updateOne({ _id: number._id }, { $set: update }, { upsert: true });

  return number.counter;
};

const createAndStoreAllegato4 = async (doc) => {
  const isImpresa = doc.distribution.company.type === 'impresa';

  const variant = isImpresa ? 'impresa' : 'intermediari';
  const source = `allegato4/${doc.type}-${variant}.pdf`;
  const populateFunction = isImpresa ? populateAllegato4Impresa : populateAllegato4Intermediari;

  const { pdfDoc, form } = await loadDocument(source);
  populateFunction({ form, doc });

  const youSignPdf = await storeDocument(`ALLEGATO4-${doc.customerId}`, pdfDoc);

  const positions = {
    'inv-impresa': '56,99,289,148',
    'inv-intermediari': '56,99,289,148',
    'noninv-impresa': '56,300,290,350',
    'noninv-intermediari': '56,255,291,307',
  };

  return {
    file: youSignPdf.id,
    position: positions[`${doc.type}-${variant}`],
  };
};

const createAndStoreAdequacySurvey = async (fastify, req, doc) => {
  const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);

  // generate pdf
  const json = await fetch(
    `${req.secure ? 'https://' : 'http://'}${req.headers.host}/v1/survey/survey-to-pdf/${doc.adequacy.resultId}`,
    {
      headers: {
        Authorization: req.headers.authorization,
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json());

  if (json.item === undefined) {
    throw new Error(`Failed to create PDF ${json.message}`);
  }

  const docId = json.item.documentId;

  if (!docId) {
    throw new Error('Missing document id in response');
  }

  const storedDocument = await documentService.getDocument(docId);
  const url = await documentService.getPresignedDownloadUrl(storedDocument);

  const pdfResponse = await fetch(url);
  const pdfArrayBuffer = await pdfResponse.arrayBuffer();
  const youSignPdf = await storeDocument(`ADEQUACY-${doc.customerId}`, pdfArrayBuffer);

  // Signature is always on last page
  const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
  const page = pdfDoc.getPageCount();

  return {
    file: youSignPdf.id,
    page,
    position: {
      promoter: '59,578,284,646',
      customer: '59,486,284,554',
    },
  };
};

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Create PDF for consulting document',
      tags: ['consulting'],
    },
  };

  fastify.put('/', options, async (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;
    /** @type {Knex} */
    const sql = fastify.knex;

    const { resultId } = request.params;

    // await (async () => {
    //   const { form } = await loadDocument('allegato4/inv-intermediari.pdf');
    //   const fields = form.getFields();
    //   let res = [];
    //   fields.forEach((field) => {
    //     const type = field.constructor.name;
    //     const name = field.getName();
    //     res.push(`${name}`);
    //     // res.push(`${type}: ${name}`);
    //   });
    //   return reply.send(res);
    // })();

    const doc = await findOneConsulting(sql, resultId);
    // const doc = await db.collection(CONSULTING).findOne({ _id: resultId });
    if (!doc) {
      return reply.send(Boom.badRequest('consulenza non trovata'));
    }

    // update signature
    doc.signature = {
      procedureId: undefined, // yousign procedure
      procedureCompleted: false,

      /*
        {
          fileId: "/files/...", // yousign file id for all files involved
          fileType: 'afc' | 'sepa' | 'allegato4',
          documentId: "uuid" // stored document with signatures
        }
      */
      files: [],

      customer: {
        memberId: undefined,
        status: 'pending',
        info: request.body.customer,
      },
      promoter: {
        memberId: undefined,
        status: 'pending',
        info: request.body.promoter,
      },
      thirdPayer: {
        memberId: undefined,
        status: 'pending',
        info: request.body.thirdPayer,
      },
    };

    // mapping fileId -> fileType
    const fileTypes = {};

    // load related person
    const person = await personRepository.getbyUuid(fastify.knex, doc.customerId);

    /// ------------------------------------
    /// ATTESTATO FINE CONSULENZA
    /// ------------------------------------
    const { source, fileObjects, populate } = await documentForCategory(doc, sql);
    const { pdfDoc, form } = await loadDocument(source);
    populate({ form, doc });

    const youSignPdf = await storeDocument(`AFC-${doc.customerId}`, pdfDoc);

    const customerFileObjects = fileObjects.customer;
    customerFileObjects[0].file = youSignPdf.id;

    const thirdPayerFileObjects = fileObjects.thirdPayer;

    const promoterFileObjects = fileObjects.promoter;
    promoterFileObjects[0].file = youSignPdf.id;

    fileTypes[youSignPdf.id] = 'afc';

    /// ------------------------------------
    /// SEPA
    /// ------------------------------------
    if (doc.sepa.hasAdvisoryFee) {
      // get number and update availability
      const number = await getNextSepaNumber(db, doc.customerId);
      doc.sepa.number = number;

      // load related person
      // eslint-disable-next-line max-len
      const payer = doc.sepa.isThirdPayer
        ? await personRepository.getbyUuid(fastify.knex, doc.sepa.linkedCustomerId)
        : person;

      const sepaDoc = await loadDocument('sepa.pdf');
      // @ts-ignore
      populateSepa({ form: sepaDoc.form, doc, person });

      const sepaPdfYouSign = await storeDocument(`SEPA-${doc.customerId}`, sepaDoc.pdfDoc);

      if (doc.sepa.isThirdPayer) {
        thirdPayerFileObjects.push({
          file: sepaPdfYouSign.id,
          page: 2,
          position: '222,274,433,328',
          mention: 'Read and approved',
          mention2: `Firmato da ${nomeRagioneSociale(payer)}`,
        });
      } else {
        customerFileObjects.push({
          file: sepaPdfYouSign.id,
          page: 2,
          position: '222,274,433,328',
          mention: 'Read and approved',
          mention2: `Firmato da ${nomeRagioneSociale(payer)}`,
        });
      }

      fileTypes[sepaPdfYouSign.id] = 'sepa';
    }

    /// ------------------------------------
    /// Allegato 4 impresa / intermediari
    /// ------------------------------------
    const allegato4 = await createAndStoreAllegato4(doc);
    customerFileObjects.push({
      file: allegato4.file,
      page: doc.type === 'inv' ? 3 : 2,
      position: allegato4.position,
      mention: 'Read and approved',
      mention2: signedBy(person),
    });
    fileTypes[allegato4.file] = 'allegato4';

    /// ------------------------------------
    /// ADEQUACY
    /// ------------------------------------
    if (doc.adequacy && doc.adequacy.resultId) {
      const adequacy = await createAndStoreAdequacySurvey(fastify, request, doc);

      customerFileObjects.push({
        file: adequacy.file,
        page: adequacy.page,
        position: adequacy.position.customer,
        mention: 'Read and approved',
        mention2: signedBy(person),
      });

      promoterFileObjects.push({
        file: adequacy.file,
        page: adequacy.page,
        position: adequacy.position.promoter,
        mention: 'Read and approved',
        mention2: `Firmato da ${doc.signature.promoter.info.name} ${doc.signature.promoter.info.surname}`,
      });

      fileTypes[adequacy.file] = 'adequacy';
    }

    /// ------------------------------------

    // eslint-disable-next-line max-len
    const youSignProcedure = await startProcedure({
      doc,
      customerFileObjects,
      promoterFileObjects,
      thirdPayerFileObjects,
    });

    const getSignature = (index) => {
      const member = youSignProcedure.members[Number(index)];

      return {
        memberId: member.id,
        status: member.status, // pending
        email: member.email,
      };
    };

    // Store signature
    doc.signature.procedureId = youSignProcedure.id;
    doc.signature.files = customerFileObjects.map((object) => ({
      fileId: object.file,
      fileType: fileTypes[object.file],
      documentId: undefined,
    }));

    if (thirdPayerFileObjects.length > 0) {
      doc.signature.files.push({
        fileId: thirdPayerFileObjects[0].file,
        fileType: fileTypes[thirdPayerFileObjects[0].file],
        documentId: undefined,
      });
    }
    doc.signature.customer = { ...doc.signature.customer, ...getSignature(0) };
    doc.signature.promoter = { ...doc.signature.promoter, ...getSignature(1) };
    if (doc.sepa.isThirdPayer) {
      doc.signature.thirdPayer = { ...doc.signature.thirdPayer, ...getSignature(2) };
    }

    await replaceOneConsulting(sql, doc);
    await db.collection(CONSULTING).replaceOne({ _id: resultId }, doc, { upsert: true });

    return reply.send({ item: doc });
  });

  next();
};
