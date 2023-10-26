const Boom = require('boom');
const puppeteer = require('puppeteer');
const DocumentService = require('../../../services/document-srv');
const { types: documentTypes } = require('../../../services/document-srv/document-types');
const SurveyService = require('../../../services/survey-srv');
const PromoterService = require('../../../services/promoter-srv');
const { translateSurveyType } =  require('../../../services/survey-srv/survey-types');
const errorHandler = require("../../../utils/error-handler");

const list = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Get PDF document',
      description: 'Get PDF document',
      tags: ['pdf', 'survey'],
      querystring: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'Survey type',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
          properties: {
            _meta: {
              type: 'object',
              properties: {
                getPresignedUrl: {
                  type: 'string',
                  description: 'API link to get presigned url',
                },
              },
            },
            item: {
              type: 'object',
              properties: {
                documentId: {
                  type: 'string',
                  description: 'Survey document ID',
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get(
      '/',
      options,
      errorHandler(async (req, reply) => {
        const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);
        const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
        const promoterService = new PromoterService(fastify.mongo.db);

        try {
          const surveyResult = await surveyService.getSurveyResultById(req.params.surveyResultId);
          const customerInfo = await promoterService.getPromoterById(surveyResult.userId);
          const survey = await surveyService.getSurveyById(surveyResult.idSurvey);

          const browser = await puppeteer.launch({
            ...(process.env.PUPPETEER ? { executablePath: process.env.PUPPETEER } : {}),
            headless: true,
            args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox'],
          });
          const page = await browser.newPage();

          await page.setRequestInterception(true);
          await page.setExtraHTTPHeaders ({
            'Authorization': req.headers.authorization,
          });

          page.on('request', (request) => {
            if (!request.isNavigationRequest()) {
              request.continue();
              return;
            }
            const headers = request.headers();
            request.continue({ headers });
          });

          await page.goto(
              `${req.secure ? 'https://' : 'http://'}${req.headers.host}/v1/survey/autocert-per-fisica-to-html/${
                  req.params.surveyResultId
              }`,
              {
                waitUntil: 'networkidle0',
              },
          );

          // await page.waitFor(100000);

          const pdf = await page.pdf({
            // @ts-ignore
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: false,
          });

          await browser.close();

          const name = customerInfo.name.trim().toLowerCase();
          const surname = customerInfo.surname.trim().toLowerCase();
          const translateSurveyTypeId =  translateSurveyType(survey.type);

          documentService
              .addDocument(
                  {
                    type: documentTypes.SURVEYS,
                    ownerId: 'SYSTEM',
                    displayName: `autocert-per-fisica-${name}-${surname}-${translateSurveyTypeId}.pdf`,
                    locked: true,
                  },
                  pdf,
              )
              .then((doc) => {
                const getPresignedUrl = `/v1/documents/${doc._id}/presigned-download`;
                return reply.header('Link', getPresignedUrl).send({
                  _meta: { getPresignedUrl },
                  item: { documentId: doc._id },
                });
              })
              .catch((error) => reply.send(Boom.badRequest(error)));

        } catch (error) {
          fastify.log.error(error);
          reply.send(Boom.badRequest(error.message));
        }
      }),
  );

  next();
};

module.exports = list;
