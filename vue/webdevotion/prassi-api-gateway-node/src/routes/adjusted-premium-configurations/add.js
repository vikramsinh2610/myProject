const Boom = require('boom');
const AdjustedPremiumConfigurationService = require('../../services/adjusted-premium-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Adjusted Premium Configuration Add',
      description: 'Add a Adjusted Premium Configuration',
      tags: ['adjusted-premium-configuration'],
      params: {
        type: 'object',
        properties: {
          commissioningId: {
            type: 'string',
            description: 'Adjusted Premium ID',
          },
        },
      },
      body: {
        type: 'object',
        required: ['_id'], // 'retrocessionFee', 'options',
        properties: {
          _id: {
            type: 'string',
            description: 'Adjusted Premium Configuration ID',
          },
          products : {
            type: 'array',
            items: {
              type: 'object',
              properties : {
                productId: { type: 'string' },
                productName: { type: 'string' },
                adjustedPercentageSubscription: { type: 'number' },
                adjustedPercentageAdditionalIncome: { type: 'number' },
                adjustedBonus: { type: 'number' },
              }
            }
          },
        },
      },
    },
  };

  fastify.put('/', options, (request, reply) => {
    const adjustedPremiumConfigurationService = new AdjustedPremiumConfigurationService(fastify.mongo.db);

    fastify.log.info(request.body);
    adjustedPremiumConfigurationService
      .addOrUpdateConfiguration(request.body)
      .then((configuration) => reply.send({ _meta: {}, item: configuration }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
