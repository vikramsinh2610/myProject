const Boom = require('boom');
const ManagementFeeConfigurationService = require("../../services/management-fee-configuration-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Management Fee Configuration Add',
      description: 'Add a Management Fee Configuration',
      tags: ['management-fee-configuration'],
      params: {
        type: 'object',
        properties: {
          managementFeeId: {
            type: 'string',
            description: 'Management Fee ID',
          },
        },
      },
      body: {
        type: 'object',
        required: ['roleId', '_id'], // 'retrocessionFee', 'options',
        properties: {
          _id: {
            type: 'string',
            description: 'Management Fee configuration ID',
          },
          roleId: {
            type: 'string',
            description: 'Role type',
          },
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
          percentage: {
            type: 'number',
            description: '',
          },
        },
      },
    },
  };

  fastify.put('/', options, (request, reply) => {
    const managementFeeConfigurationService = new ManagementFeeConfigurationService(fastify.mongo.db);

    fastify.log.info(request.body);
    managementFeeConfigurationService
      .addOrUpdateConfiguration(request.body)
      .then((configuration) => reply.send({ _meta: {}, item: configuration }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
