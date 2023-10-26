const Boom = require('boom');
const SurveyService = require('../../../services/survey-srv');
const errorHandler = require("../../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Survey List',
      description: 'Get Surveys list',
      tags: ['survey'],
      querystring: {
        type: 'object',
        properties: {
          skip: {
            type: 'integer',
            default: 0,
            description: 'Number of items to skip',
          },
          count: {
            type: 'integer',
            default: 20,
            description: 'Number of items to return',
          },
        },
      },
    },
  };

  fastify.get(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);

      const $regex = request.query.fullTextSearch
        ? decodeURIComponent(request.query.fullTextSearch)
            .split(' ')
            .join('|')
        : undefined;
      const filters = {
        ...(request.query.fullTextSearch ? { type: { $regex, $options: 'i' } } : {}),
      };

      surveyService
        .getSurveys(filters, request.query.skip, request.query.count)
        .then((surveys) => reply.send({ _meta: {}, items: surveys }))
        .catch((error) => reply.send(Boom.badRequest(error.message)));
    }),
  );
  next();
};
