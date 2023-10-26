const Boom = require('boom');
const errorHandler = require('../../../utils/error-handler');
const SurveyService = require('../../../services/survey-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Survey delete',
      description: 'Delete a Survey',
      tags: ['survey'],
    },
  };

  fastify.delete(
    '/',
    options,
    errorHandler(async (request, reply) => {
      // eslint-disable-next-line prefer-destructuring
      const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);
      const sql = fastify.knex;

      const surveyResult = await surveyService.getSurveyById(request.params.surveyResultId);

      sql('survey_result')
        .del()
        .where('id', request.params.surveyResultId)
        .then(() => reply.send({ _meta: {}, item: surveyResult }))
        .catch((error) => reply.send(Boom.badRequest(error.message)));
    }),
  );
  next();
};
