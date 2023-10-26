const Boom = require('boom');
const SurveyService = require('../../../services/survey-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Survey Questions List',
      description: 'Get Questions list',
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
          fullTextSearch: {
            type: 'string',
            description: 'Free text for full text search',
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);

    const $regex = request.query.fullTextSearch
      ? decodeURIComponent(request.query.fullTextSearch)
          .split(' ')
          .join('|')
      : undefined;
    const filters = {
      ...(request.query.fullTextSearch
        ? {
            $or: [{ _id: { $regex, $options: 'i' } }, { texts: { $elemMatch: { text: { $regex, $options: 'i' } } } }],
          }
        : {}),
    };

    surveyService
      .getQuestions(filters, request.query.skip, request.query.count)
      .then((questions) => reply.send({ _meta: {}, items: questions }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
