const Boom = require('boom');
const ProductConfigurationService = require("../../services/product-configuration-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Product Configuration Add',
      description: 'Add a Product Configuration',
      tags: ['product-configuration'],
      params: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            description: 'Product ID',
          },
        },
      },
      body: {
        type: 'object',
        required: ['premiumType', 'advance', '_id'], // 'retrocessionFee', 'options',
        properties: {
          _id: {
            type: 'string',
            description: 'Product configuration ID',
          },
          premiumType: {
            type: 'string',
            enum: ['net', 'gross'],
            description: 'Premium type',
          },
          advance: {
            type: 'boolean',
            description: 'True if the first year commissions are on advance',
          },
          promoter100: {
            type: 'boolean',
          },
          companyAdvance: {
            type: 'boolean',
            description: 'True if the first year commissions are on advance',
          },
          retrocessionFee: {
            type: 'number',
            description: 'Broker fee percentage',
          },
          surveyTypePerson: {
            type: 'string',
            description: 'Survey type if person',
          },
          surveyTypeCompany: {
            type: 'string',
            description: 'Survey type if company',
          },
          adjustedBrackets: {},
          adjustedAdvance: {},
          options: {
            type: 'array',
            description: 'Configuration options',
            minItems: 1,
            items: {
              type: 'object',
              required: [
                '_id',
                'fromYear',
                'toYear',
                'fromPremiumAmount',
                'toPremiumAmount',
                'fixedAmount',
                'percentage',
                'retrocessionFee',
              ],
              properties: {
                _id: {
                  type: 'string',
                  description: 'Option ID',
                },
                fromYear: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 99,
                  description: 'From Year',
                },
                toYear: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 99,
                  description: 'To Year',
                },
                fromPremiumAmount: {
                  type: 'integer',
                  minimum: 0,
                  description: 'From premium amount',
                },
                toPremiumAmount: {
                  type: 'integer',
                  minimum: 0,
                  description: 'To premium amount',
                },
                fixedAmount: {
                  type: 'integer',
                  description: 'Fixed amount',
                },
                percentage: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 99999,
                  description: 'Percentage for variable amount',
                },
                retrocessionFee: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 99999,
                  description: 'Percentage for variable amount',
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.put('/', options, (request, reply) => {
    const productConfigurationService = new ProductConfigurationService(fastify.mongo.db);

    fastify.log.info(request.body);
    productConfigurationService
      .addProductConfiguration(request.body)
      .then((configuration) => reply.send({ _meta: {}, item: configuration }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
