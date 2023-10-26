/* eslint-disable security/detect-object-injection, no-continue */
const Mongo = require('mongodb');
const Boom = require('boom');
const { unparse } = require('uuid-parse');
const { uuidToBinary } = require('../../utils/uuid-to-binary');
const { PRODUCT_CONFIGURATION, ID } = require('./constants');
require('../../utils/foreach');

// There are currently 2 questions in investimento (06-18, 06-19)
const INVESTIMENTO_QUESTIONS_COUNT = 2;
// There are no questions for Previdenza
const PREVIDENZA_QUESTIONS_COUNT = 0;

// Instead of looking at the product category in the database,
// we pick the category by looking at which response in the survey matches the expected category.
const categoryByProduct = (product) => {
  if (!product) return null;

  if (product['03-14-01-persone'] === true || product['03-14-02-cose'] === true) return 'Protezione';
  if (product['03-14-03-risparmio'] === true) return 'Risparmio/Investimento';
  if (product['03-14-04-previdenza'] === true) return 'Previdenza';

  return null;
};

const getResponses = async (db) => {
  const existing = await db.collection(PRODUCT_CONFIGURATION).findOne({ _id: ID });
  return (existing && existing.data) || [];
};

const filterProductsBySurveyResponse = async (db, list) => {
  const responses = await getResponses(db);

  // ['02-medio', '03-oltre20000']
  const match = list.split(',').map((x) => x.trim());

  return responses
    .filter((product) => {
      // For each column in the csv, count how many ticks we get for this product
      let matching = 0;

      const isInvestimento = product['03-14-03-risparmio'] === true && match.includes('03-14-03-risparmio');
      const isPrevidenza = product['03-14-04-previdenza'] === true && match.includes('03-14-04-previdenza');
      const isProtezione =
        product['03-14-01-persone'] === true ||
        match.includes('03-14-01-persone') ||
        (product['03-14-02-cose'] === true && match.includes('03-14-02-cose'));

      // eslint-disable-next-line no-restricted-syntax
      for (const response of match) {
        // ignore category
        if (response.startsWith('03-14')) continue;

        if (product[response] === true) {
          matching += 1;
        }
      }

      let productMatchesResponses = false;

      // for investimento, all answers must be ticked
      if (isInvestimento) {
        productMatchesResponses = matching === INVESTIMENTO_QUESTIONS_COUNT;
      }

      // for previdenza, all answers must be ticked
      if (!productMatchesResponses && isPrevidenza) {
        productMatchesResponses = matching === PREVIDENZA_QUESTIONS_COUNT;
      }

      // for protezione, at least one is ticked
      if (!productMatchesResponses && isProtezione) {
        productMatchesResponses = matching > 0;
      }

      return productMatchesResponses;
    })
    .map((product) => product.id);
};

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Configuration List',
      description: 'Get Configuration list',
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
            default: 20,
            description: 'Number of items to return',
          },
          fullTextSearch: {
            type: 'string',
            description: 'Free text for full text search',
          },
          surveyResponses: {
            type: 'string',
            description: 'A comma-separated list of survey responses',
          },
          productIds: {
            type: 'string',
            description: 'A comma-separated list of product ids',
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
                    description: 'Configuration ID',
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
                  productAvailable: {
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
                  category: {
                    type: 'string',
                    description: 'Product Category',
                  },
                  company: {
                    type: 'string',
                    description: 'Societa',
                  },
                  companyId: {
                    type: 'string',
                    description: 'Codice Societa',
                  },
                  versamentoAggiuntivoAllowed: {
                    type: 'boolean',
                    description: 'True if versamento aggiuntivo is allowed',
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
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const $regex = request.query.fullTextSearch
      ? decodeURIComponent(request.query.fullTextSearch).split(' ').join('|')
      : undefined;

    let products;

    if (request.query.surveyResponses) {
      products = await filterProductsBySurveyResponse(db, request.query.surveyResponses);
    }

    if (request.query.productIds) {
      products = request.query.productIds.split(',');
    }

    const filter = {
      ...($regex
        ? {
            $or: [{ productName: { $regex, $options: 'i' } }, { productCode: { $regex, $options: 'i' } }],
          }
        : {}),
      ...(products
        ? {
            _id: { $in: products },
          }
        : {}),
    };

    const responses = await getResponses(db);

    const projection = {
      _id: true,
      premiumType: true,
      advance: true,
      companyAdvance: true,
      productName: true,
      productCode: true,
      monthsOnSubscription: true,
      subscriptionYears: true,
      surveyTypePerson: true,
      surveyTypeCompany: true,
    };
    db.collection('product-configuration')
      .find(filter, { projection })
      .sort({ _id: -1 })
      .skip(request.query.skip)
      .limit(request.query.count)
      .toArray()
      .then(async (list) => {
        const mappedList = [];

        // @ts-ignore
        await list.forEachAsync(async (el) => {
          // eslint-disable-next-line promise/no-nesting
          const product = await fastify.mongo.db
            .collection('Product')
            .findOne({ _id: uuidToBinary(el._id) })
            .then((result) => result)
            .catch((error) => error);

          const category = categoryByProduct(responses.find((p) => p.id === el._id));
          const productAvailable = product && product.message === undefined && product.Enabled && category;
          const company = productAvailable ? product.AnagraficaProdotto.CodiceSocieta.Nome : '';
          const companyId = productAvailable ? unparse(product.AnagraficaProdotto.CodiceSocieta.Identifier.buffer) : '';
          const versamentoAggiuntivoAllowed = productAvailable
            ? product.AnagraficaProdotto.HasPagamentiAggiuntivi
            : false;

          mappedList.push({
            ...el,
            productAvailable,
            category,
            company,
            companyId,
            versamentoAggiuntivoAllowed,
          });
        });

        return reply.send({ _meta: {}, items: mappedList });
      })
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
