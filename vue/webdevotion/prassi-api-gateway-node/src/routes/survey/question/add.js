const Boom = require('boom');
const SurveyService = require('../../../services/survey-srv');
const dateRegex = require('../../../utils/iso-6801-date');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Question Add',
      description: 'Add a Question',
      tags: ['question'],
      body: {
        type: 'object',
        required: ['_id'],
        properties: {
          _id: {
            type: 'string',
            description: 'Question ID',
          },
          creationDate: {
            type: 'string',
            pattern: dateRegex,
          },
          multiple: {
            type: 'boolean',
          },
          multipleObligatory: {
            type: 'boolean',
          },
          multipleQuestion: {
            type: 'boolean',
          },
          dontCopy: {
            type: 'boolean',
          },
          required: {
            type: 'boolean',
          },
          texts : {
            type: 'array',
            items: {
              type: 'object',
              properties : {
                id: { type: 'string' },
                text: { type: 'string' },
                description: { type: 'string' },
              }
            }
          },
          responses : {
            type: 'array',
            items: {
              type: 'object',
              properties : {
                id: { type: 'string' },
                text: { type: 'string' },
              }
            }
          },
        },
      },
    },
  };

  fastify.put('/', options, (request, reply) => {
    const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);

    fastify.log.info(request.body);
    surveyService
      .addOrUpdateQuestion(request.body)
      .then((question) => reply.send({ _meta: {}, item: question }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
