const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Configuration Detail',
      description: 'Get Commissioning Configuration Detail',
      tags: ['configuration'],
      querystring: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Commissioning Configuration ID',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            _meta: {
              type: 'object',
            },
            item: {
              type: 'object',
              properties: {
                _id: {
                  type: 'string',
                  description: 'Commissioning Configuration ID',
                },
                roleId: {
                  type: 'string',
                  description: 'Role type',
                },
                directProductionPercentage: { type: 'number' },
                indirectProductionPercentage: { type: 'number' },
                isIndirectProductionCombinable: {
                  type: 'boolean',
                  description: '',
                },
                directProductionForfait: {
                  type: 'number',
                  description: '',
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    db.collection('tcw-commissioning-configuration')
      .findOne({ _id: request.params.commissioningId })
      .then((commissioning) => reply.send({ _meta: {}, item: commissioning }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
