const Boom = require('boom');
const SurveyService = require('../../../services/survey-srv');
const Survey = require('../../../services/survey-srv/survey');
const dateRegex = require('../../../utils/iso-6801-date');
const errorHandler = require("../../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Survey Add',
      description: 'Add a Survey',
      tags: ['survey'],
      body: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Question ID',
          },
          creationDate: {
            type: 'string',
            pattern: dateRegex,
          },
          type: {
            type: 'string',
          },
          sections: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
              },
            },
          },
        },
      },
    },
  };

  fastify.put(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);

      fastify.log.info(request.body);
      surveyService
        .addOrUpdateSurvey(new Survey(request.body))
        .then((survey) => reply.send({ _meta: {}, item: { ...survey } }))
        .catch((error) => reply.send(Boom.badRequest(error.message)));
    }),
  );
  next();
};
