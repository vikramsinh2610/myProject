const Boom = require('boom');
const SurveyService = require('../../../services/survey-srv');
const errorHandler = require("../../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Survey Get',
      description: 'Get a Survey',
      tags: ['survey'],
    },
  };

  fastify.get(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);

      surveyService
        .getSurveyById(request.params.surveyId)
        .then((survey) => reply.send({ _meta: {}, item: { ...survey } }))
        .catch((error) => {
          fastify.log.error(error);
          reply.send(Boom.badRequest(error.message));
        });
    }),
  );
  next();
};
