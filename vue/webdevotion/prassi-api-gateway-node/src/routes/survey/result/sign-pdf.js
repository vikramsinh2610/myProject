const fetch = require('node-fetch');
const Boom = require('boom');
const { PDFDocument } = require('pdf-lib');
const DocumentService = require('../../../services/document-srv');
const SurveyService = require('../../../services/survey-srv');
const PromoterService = require('../../../services/promoter-srv');
const personRepository = require('../../../services/person-srv/person-repository');
const config = require('../../../config');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Generate pdf for a survey of type inquiry so that it can be signed',
      tags: ['survey'],
      params: {
        type: 'object',
        properties: {
          surveyResultId: {
            type: 'string',
            description: 'Survey ID',
          },
        },
      },
    },
  };

  fastify.post('/', options, async (req, reply) => {
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
    const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);
    const promoterService = new PromoterService(fastify.mongo.db);
    const sql = fastify.knex;

    const { surveyResultId } = req.params;

    // generate pdf
    const json = await fetch(
      `${req.secure ? 'https://' : 'http://'}${req.headers.host}/v1/survey/survey-to-pdf/${surveyResultId}`,
      {
        headers: {
          Authorization: req.headers.authorization,
          'Content-Type': 'application/json',
        },
      },
    ).then((res) => res.json());

    if (json.item === undefined) {
      return reply.send(Boom.badRequest(`Failed to create PDF ${json.message}`));
    }

    const docId = json.item.documentId;

    // const docId = 'ab2348d8-3d86-4550-8021-8540ca7dbdc3';

    if (!docId) {
      return reply.send(Boom.badRequest('Missing document id in response'));
    }

    const doc = await documentService.getDocument(docId);
    const url = await documentService.getPresignedDownloadUrl(doc);

    const pdfResponse = await fetch(url);
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();

    // call /files endpoint with pdf payload in base64
    const youSignPdf = await fetch(`${config.yousign.endpoint}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.yousign.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `analisi-bisogni-${docId}.pdf`,
        content: Buffer.from(pdfArrayBuffer).toString('base64'),
      }),
    }).then((res) => res.json());

    const { customer: customerInfo, promoter: promoterInfo } = req.body;

    // Signature is always on last page
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
    const page = pdfDoc.getPageCount();

    await promoterService.updateMobilePhone(promoterInfo);

    const surveyResult = await surveyService.getSurveyResultById(surveyResultId);
    const person = await personRepository.getbyUuid(sql, surveyResult.customerId);

    const mention = person.isCompany
      ? `Firmato per conto di ${person.companyName}`
      : `Firmato da ${customerInfo.name} ${customerInfo.surname}`;
    const customer = {
      firstname: customerInfo.name,
      lastname: customerInfo.surname,
      email: customerInfo.email,
      phone: customerInfo.mobilePhone,
      fileObjects: [
        {
          file: youSignPdf.id,
          page,
          position: '59,486,284,554',
          mention: 'Read and approved',
          mention2: mention,
        },
      ],
    };

    const promoter = {
      firstname: promoterInfo.name,
      lastname: promoterInfo.surname,
      email: promoterInfo.email,
      phone: promoterInfo.mobilePhone,
      fileObjects: [
        {
          file: youSignPdf.id,
          page,
          position: '59,578,284,646',
          mention: 'Read and approved',
          mention2: `Firmato da ${promoterInfo.name} ${promoterInfo.surname}`,
        },
      ],
    };

    const body = {
      name: 'Analisi dei Bisogni',
      description: 'Analisi dei Bisogni',
      members: [customer, promoter],
    };

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
      return reply.send(Boom.badRequest(`Errore nel creare procedura su yousign. ${JSON.stringify(youSignProcedure)}`));
    }

    const getSignature = (index) => {
      const member = youSignProcedure.members[Number(index)];

      return {
        memberId: member.id,
        status: member.status, // pending
        email: member.email,
      };
    };

    // Update survey result with signature
    const signature = {
      procedureCompleted: false,
      procedureId: youSignProcedure.id,
      fileId: youSignPdf.id,
      customer: { ...getSignature(0), customerId: customerInfo.id, info: customerInfo },
      promoter: { ...getSignature(1), promoterId: promoterInfo.id, info: promoterInfo },
    };

    await surveyService.updateSignature(surveyResultId, signature);

    const survey = await surveyService.getInquirySurveyById(surveyResultId);
    survey.signature = signature;
    await surveyService.replaceInquirySurvey(survey);

    return reply.send({
      item: signature,
    });
  });

  next();
};
