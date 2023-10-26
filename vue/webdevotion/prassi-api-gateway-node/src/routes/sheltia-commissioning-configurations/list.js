const Mongo = require('mongodb');
const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning  Configuration List',
      description: 'Get Commissioning Configuration list',
      tags: ['configuration'],
      querystring: {
        type: 'object',
        properties: {
          skip: {
            type: 'integer',
            mimimum: 0,
            default: 0,
            description: 'Number of items to skip',
          },
          count: {
            type: 'integer',
            default: 0,
            description: 'Number of items to return',
          },
          fullTextSearch: {
            type: 'string',
            description: 'Free text for full text search',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'items'],
          properties: {
            _meta: {
              type: 'object',
            },
            items: {
              type: 'array',
              items: {
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
    },
  };

  fastify.get('/', options, (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const $regex = request.query.fullTextSearch
      ? decodeURIComponent(request.query.fullTextSearch)
          .split(' ')
          .join('|')
      : undefined;

    const filter = {
      ...($regex ? {} : {}),
    };

    const projection = {
      _id: true,
      roleId: true,
      fromProductivePeriodYear: true,
      fromProductivePeriodMonth: true,
      fromProductivePeriod: true,
      purchase: true,
      cashIn: true,
      directIrpefStyle: true,
      indirectIrpefStyle: true,
    };
    db.collection('sheltia-commissioning-configuration')
      .find(filter, { projection })
      .sort({ _id: -1 })
      .skip(request.query.skip)
      .limit(request.query.count)
      .toArray()
      .then((commissioning) => reply.send({ _meta: {}, items: commissioning }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
