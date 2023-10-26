const Boom = require('boom');
// eslint-disable-next-line max-len
const TcwCommissioningConfigurationDynamicService = require('../../services/tcw-commissioning-configuration-dynamic-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Tcw Commissioning Configuration Dynamic Update',
      description: 'Add a Commissioning Fee Configuration Dynamic',
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
        required: ['_id'],
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
  };

  fastify.put('/', options, (request, reply) => {
    const tcwCommissioningConfigurationDynamicService = new TcwCommissioningConfigurationDynamicService(
      fastify.mongo.db,
    );

    fastify.log.info(request.body);
    tcwCommissioningConfigurationDynamicService
      .addOrUpdateConfiguration(request.body)
      .then((configuration) => reply.send({ _meta: {}, item: configuration }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
