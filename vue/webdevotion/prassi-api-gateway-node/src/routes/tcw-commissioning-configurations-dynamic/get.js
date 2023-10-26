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
            description: 'Commissioning Configuration Dynamic ID',
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
                  description: 'Commissioning Configuration Dynamic ID',
                },
                config: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      roles: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            roleId: { type: 'string' },
                            directProductionPercentage: { type: 'number' },
                            indirectProductionPercentage: { type: 'number' },
                            isIndirectProductionCombinable: { type: 'boolean' },
                            directProductionForfait: { type: 'number' },
                          },
                        },
                      },
                    },
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
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    db.collection('tcw-commissioning-configuration-dynamic')
      .findOne({ _id: request.params.commissioningId })
      .then((commissioning) => reply.send({ _meta: {}, item: commissioning }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
