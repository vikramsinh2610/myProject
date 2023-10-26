const fetch = require('node-fetch');
const Boom = require('boom');
const SurveyService = require('../../../services/survey-srv');
const DocumentService = require('../../../services/document-srv');
const WorkflowService = require('../../../services/workflow-srv');
const { typesState: workflowState } = require('../../../services/workflow-srv/state-types');
const { types: documentTypes } = require('../../../services/document-srv/document-types');
const config = require('../../../config');
const MailService = require('../../../services/mail-srv');
const logRepository = require('../../../services/commissioning-flow-srv/log-repository');
const LogEvent = require('../../../services/commissioning-flow-srv/log-event');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Update pdf for a survey of type inquiry with signature status',
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
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;
    const sql = fastify.knex;
    const surveyService = new SurveyService(fastify.mongo.db, sql);
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
    const mailService = new MailService(fastify.mandrill, fastify.url, fastify.edition, fastify.env);
    const workflowService = new WorkflowService(fastify.mongo.db);

    const { signature } = req.body;
    const { surveyResultId } = req.params;

    try {
      const survey = await surveyService.getInquirySurveyById(surveyResultId);
      survey.signature = signature;
      await surveyService.replaceInquirySurvey(survey);

      await surveyService.updateSignature(surveyResultId, signature);

      if (signature.customer.status !== 'done' || signature.promoter.status !== 'done') {
        return reply.send({
          item: signature,
        });
      }

      // When both parties have signed, download the PDF and store it in S3

      // fetch pdf from yousign
      const json = await fetch(`${config.yousign.endpoint}${signature.fileId}/download`, {
        headers: {
          Authorization: `Bearer ${config.yousign.token}`,
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());

      if (typeof json !== 'string') {
        return reply.send(Boom.badRequest(`Failed to download PDF`));
      }

      const buffer = Buffer.from(json, 'base64');

      // store pdf
      const doc = await documentService.addDocument(
        {
          type: documentTypes.SIGNED_SURVEYS,
          ownerId: 'SYSTEM',
          displayName: `${surveyResultId}-firmato.pdf`,
          locked: true,
        },
        buffer,
      );

      const params = {
        attachments: [
          {
            type: 'application/pdf',
            name: `${surveyResultId}-firmato.pdf`,
            content: buffer.toString('base64'),
          },
        ],
        emailClientTo: signature.customer.email,
        emailConsulenteTo: signature.promoter.email,
      };

      await mailService.sendSignedDocs(params);

      signature.procedureCompleted = true;
      signature.signedDate = new Date();
      signature.documentId = doc._id;

      await surveyService.updateSignature(surveyResultId, signature);

      survey.signature = signature;
      await surveyService.replaceInquirySurvey(survey);

      // update workflow
      const workflow = await workflowService.getLastByEntityId(surveyResultId);
      workflow.state = workflowState.APPROVED;
      await workflowService.updateWorkflow(workflow);

      const getPresignedUrl = `/v1/documents/${doc._id}/presigned-download`;
      return reply.header('Link', getPresignedUrl).send({
        _meta: { getPresignedUrl },
        item: signature,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error.message);
      // eslint-disable-next-line no-console
      console.log(error.stack);
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE UPDATE PDF SIGNATURE INQUIRY ${surveyResultId} ${error.message} `,
        }),
      );
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE UPDATE PDF SIGNATURE INQUIRY ${surveyResultId} ${error.stack} `,
        }),
      );
      return reply.send(Boom.badRequest(error.stack));
    }
  });

  next();
};
