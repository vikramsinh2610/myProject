const { typesResponse } = require('../../services/survey-srv/response-types');

const list = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Get Response List',
      description: 'Get Response list',
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
                type: 'string',
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    reply.send({ _meta: {}, items: Object.values(typesResponse) });
  });
  next();
};

module.exports = list;
