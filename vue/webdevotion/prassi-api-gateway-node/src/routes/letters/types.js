const { types } = require("../../services/letter-srv/letter-types");

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Letter Types',
      description: 'Get letters Types',
      tags: ['letter'],
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
    reply.send({ _meta: {}, items: Object.values(types) });
  });
  next();
};
