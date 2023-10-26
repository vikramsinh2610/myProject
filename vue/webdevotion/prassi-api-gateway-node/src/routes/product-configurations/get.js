const Boom = require('boom');
const { uuidToBinary } = require('../../utils/uuid-to-binary');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
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
                advance: {
                  type: 'boolean',
                  description: 'True if the first year commissions are on advance',
                },
                companyAdvance: {
                  type: 'boolean',
                  description: 'True if the first year commissions are on advance',
                },
                promoter100: {
                  type: 'boolean',
                },
                allowedSubscription: {
                  type: 'boolean',
                },
                productName: {
                  type: 'string',
                  description: 'Product Name',
                },
                surveyTypePerson: {
                  type: 'string',
                  description: 'Survey type if person',
                },
                surveyTypeCompany: {
                  type: 'string',
                  description: 'Survey type if company',
                },
                productCode: {
                  type: 'string',
                  description: 'Product Code',
                },
                company: {
                  type: 'object',
                  description: 'Company',
                  properties: {
                    name: { type: 'string' },
                    code: { type: 'string' },
                  },
                },
                category: {
                  type: 'object',
                  description: 'Category',
                  properties: {},
                },
                monthsOnSubscription: {
                  type: 'number',
                  description: 'Months on Subscription',
                },
                subscriptionYears: {
                  type: 'number',
                  description: 'Subscription Years',
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
        },
      },
    },
  };

  fastify.get('/', options, async (request, reply) => {
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const el = await db.collection('product-configuration').findOne({ _id: request.params.productId });

    if (!el) return reply.send(Boom.badRequest('Product not found'));

    const product = await fastify.mongo.db
      .collection('Product')
      .findOne({ _id: uuidToBinary(el._id) })
      .then((result) => result)
      .catch((error) => error);

    const productAvailable = product && product.message === undefined;
    const category = productAvailable ? product.AnagraficaProdotto.CategoriaProdotto : '';

    const company = await fastify.mongo.db
      .collection('CompanyConfiguration')
      .findOne({ _id: product.AnagraficaProdotto.CodiceSocieta.Identifier });

    const item = {
      ...el,
      productAvailable,
      category,
      company: {
        name: company.NomeCompagnia,
        code: company.CodiceCompagnia,
      },
    };

    return reply.send({ _meta: {k:'kkk'}, item });
  });
  next();
};
