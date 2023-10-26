const Boom = require('boom');
const SurveyService = require('../../services/survey-srv');

const list = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Get Sections List',
      description: 'Get Sections list',
      tags: ['sections'],
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'items'],
          properties: {
            _meta: {
              type: 'object',
              properties: {},
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['_id', 'description'],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Section ID',
                  },
                  description: {
                    type: 'string',
                    description: 'Section name',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);

    surveyService
      .getBuckets()
      .then((sections) => reply.send({ _meta: {}, items: sections }))
      .catch((error) => reply.send(Boom.badRequest(error)));
  });

  next();
};

module.exports = list;
