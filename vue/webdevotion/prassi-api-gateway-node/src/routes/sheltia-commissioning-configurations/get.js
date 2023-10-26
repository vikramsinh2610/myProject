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
                advanceDirectProductionPercentage: { type: 'number' },
                advanceIndirectProductionPercentage: { type: 'number' },
                fromProductivePeriodYear: {
                  type: 'number',
                  description: '',
                },
                fromProductivePeriodMonth: {
                  type: 'number',
                  description: '',
                },
                fromProductivePeriod: {
                  type: 'number',
                  description: '',
                },
                directIrpefStyle: {
                  type: 'boolean',
                },
                indirectIrpefStyle: {
                  type: 'boolean',
                },
                purchase: {
                  type: 'object',
                  properties: {
                    basis: {
                      type: 'object',
                      properties: {
                        directProductionPercentage: { type: 'number' },
                        indirectProductionPercentage: { type: 'number' },
                      }
                    },
                    range: {
                      type: 'object',
                      properties: {
                        directProductionSlots: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties : {
                              fromIv: { type: 'number' },
                              toIv: { type: 'number' },
                              percentage: { type: 'number' },
                            }
                          }
                        },
                        indirectProductionSlots: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties : {
                              fromIv: { type: 'number' },
                              toIv: { type: 'number' },
                              percentage: { type: 'number' },
                              roleId: { type: 'string' },
                            }
                          }
                        },
                      }
                    },
                    target: {
                      type: 'object',
                      properties: {
                        slots: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties : {
                              fromIv: { type: 'number' },
                              toIv: { type: 'number' },
                              percentage: { type: 'number' },
                            }
                          }
                        },
                      }
                    },
                  },
                },
                cashIn : {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties : {
                      productId: { type: 'string' },
                      amount: { type: 'number' },
                    }
                  }
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

    db.collection('sheltia-commissioning-configuration')
      .findOne({ _id: request.params.commissioningId })
      .then((commissioning) => reply.send({ _meta: {}, item: commissioning }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
