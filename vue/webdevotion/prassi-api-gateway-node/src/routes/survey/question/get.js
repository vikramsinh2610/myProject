const Boom = require('boom');
const SurveyService = require('../../../services/survey-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Question Get',
      description: 'Get a Question',
      tags: ['question'],
    },
  };

  fastify.get('/', options, (request, reply) => {
    const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);
    surveyService
      .getQuestionById(request.params.questionId)
      .then((question) => reply.send({ _meta: {}, item: question }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
