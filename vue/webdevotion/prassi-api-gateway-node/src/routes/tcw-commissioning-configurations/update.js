const Boom = require('boom');
const TcwCommissioningConfigurationService = require('../../services/tcw-commissioning-configuration-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Tcw Commissioning Configuration Update',
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
        required: ['roleId', '_id'],
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
  };

  fastify.put('/', options, (request, reply) => {
    const tcwCommissioningConfigurationService = new TcwCommissioningConfigurationService(fastify.mongo.db);

    fastify.log.info(request.body);
    tcwCommissioningConfigurationService
      .addOrUpdateConfiguration(request.body)
      .then((configuration) => reply.send({ _meta: {}, item: configuration }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
