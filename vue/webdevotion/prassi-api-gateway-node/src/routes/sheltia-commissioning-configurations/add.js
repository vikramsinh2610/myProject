const Boom = require('boom');
const SheltiaCommissioningConfigurationService = require('../../services/sheltia-commissioning-configuration-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Sheltia Commissioning Configuration Add',
      description: 'Add a Commissioning Fee Configuration',
      tags: ['commissioning-configuration'],
      params: {
        type: 'object',
        properties: {
          commissioningId: {
            type: 'string',
            description: 'Commissioning ID',
          },
        },
      },
      body: {
        type: 'object',
        required: ['roleId', '_id'], // 'retrocessionFee', 'options',
        properties: {
          _id: {
            type: 'string',
            description: 'Commissioning Configuration ID',
          },
          roleId: {
            type: 'string',
            description: 'Role type',
          },
          fromProductivePeriodYear: {
            type: 'number',
            description: '',
          },
          advanceDirectProductionPercentage: { type: 'number' },
          advanceIndirectProductionPercentage: { type: 'number' },
          fromProductivePeriodMonth: {
            type: 'number',
            description: '',
          },
          directIrpefStyle: {
            type: 'boolean',
          },
          indirectIrpefStyle: {
            type: 'boolean',
          },
          fromProductivePeriod: {
            type: 'number',
            description: '',
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
  };

  fastify.put('/', options, (request, reply) => {
    const sheltiaCommissioningConfigurationService = new SheltiaCommissioningConfigurationService(fastify.mongo.db);

    fastify.log.info(request.body);
    sheltiaCommissioningConfigurationService
      .addOrUpdateConfiguration(request.body)
      .then((configuration) => reply.send({ _meta: {}, item: configuration }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
