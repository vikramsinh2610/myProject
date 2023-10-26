const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Configuration Detail',
      description: 'Get Configuration Detail',
      tags: ['configuration'],
      querystring: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Product ID',
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
                  description: 'Product ID',
                },
                premiumType: {
                  type: 'string',
                  enum: ['net', 'gross'],
                  description: 'Premium type',
                },
                promoter100: {
                  type: 'boolean',
                },
                advance: {
                  type: 'boolean',
                  description: 'True if the first year commissions are on advance',
                },
                companyAdvance: {
                  type: 'boolean',
                  description: 'True if the first year commissions are on advance',
                },
                productName: {
                  type: 'string',
                  description: 'Product Name',
                },
                productCode: {
                  type: 'string',
                  description: 'Product Code',
                },
                surveyTypePerson: {
                  type: 'string',
                  description: 'Survey type if person',
                },
                surveyTypeCompany: {
                  type: 'string',
                  description: 'Survey type if company',
                },
                monthsOnSubscription: {
                  type: 'number',
                  description: 'Months on Subscription',
                },
                subscriptionYears: {
                  type: 'number',
                  description: 'Subscription Years',
                },
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
        },
      },
    },
  };

  fastify.delete('/', options, (request, reply) => {
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    db.collection('product-configuration')
      .deleteOne({ _id: request.params.productId })
      .then((product) => reply.send({ _meta: {}, item: product }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
