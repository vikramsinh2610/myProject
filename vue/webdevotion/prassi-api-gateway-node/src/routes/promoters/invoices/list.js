const Mongo = require('mongodb');
const Boom = require('boom');
const dateRegex = require('../../../utils/iso-6801-date');
const NetworkService = require('../../../services/network-srv');
const errorHandler = require('../../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Promoter Invoice List',
      description: 'Get invoice list for specified promoter',
      tags: ['invoicing'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
          },
        },
      },
      querystring: {
        type: 'object',
        properties: {
          skip: {
            type: 'integer',
            default: 0,
            description: 'Number of items to skip',
          },
          count: {
            type: 'integer',
            default: 20,
            description: 'Number of items to return',
          },
          productivePeriodYear: {
            type: 'integer',
            description: 'From productive period - year',
          },
          productivePeriodMonth: {
            type: 'integer',
            description: 'From productive period - month',
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
                required: [
                  '_id',
                  'promoterId',
                  'promoterDisplayName',
                  'promoterRoleId',
                  'promoterNetworkPath',
                  'productivePeriodMonth',
                  'productivePeriodYear',
                  'number',
                  'createDate',
                  'issued',
                  'grossAmount',
                  'amount',
                ],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Invoice ID',
                  },
                  documentId: {
                    type: 'string',
                    description: 'Document ID',
                  },
                  promoterId: {
                    type: 'string',
                    description: 'Promoter ID',
                  },
                  promoterDisplayName: {
                    type: 'string',
                    description: 'Disaplay name of promoter',
                  },
                  promoterRoleId: {
                    type: 'string',
                    description: 'Promoter role ID',
                  },
                  promoterNetworkPath: {
                    type: 'string',
                    description: 'Network position of promover',
                  },
                  productivePeriodMonth: {
                    type: 'integer',
                    description: 'Productive period month',
                    minimum: 1,
                    maximum: 12,
                  },
                  productivePeriodYear: {
                    type: 'integer',
                    description: 'Productive period year',
                    minimum: 2010,
                    maximum: 2099,
                  },
                  number: {
                    type: 'string',
                    description: 'The progressive number of invoice',
                  },
                  createDate: {
                    type: 'string',
                    pattern: dateRegex,
                    description: 'The creation date of the invoice',
                  },
                  issued: {
                    type: 'boolean',
                    description: 'Is invoice issued',
                  },
                  grossAmount: {
                    type: 'integer',
                    default: 0,
                    description: 'Gross amount of invoice',
                  },
                  directCommissionsAmount: {
                    type: 'integer',
                    default: 0,
                  },
                  indirectCommissionsAmount: {
                    type: 'integer',
                    default: 0,
                  },
                  otherAmount: {
                    type: 'integer',
                    default: 0,
                  },
                  amount: {
                    type: 'integer',
                    default: 0,
                  },
                  commissioning: {
                    type: 'boolean',
                  },
                  heading: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
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

  fastify.get(
    '/',
    options,
    errorHandler(async (request, reply) => {
      /** @type {Mongo.Db} */
      // eslint-disable-next-line prefer-destructuring
      const db = fastify.mongo.db;

      const networkService = new NetworkService(fastify.mongo.db);
      const promoterCanSee = await networkService.userCanSee(
        request.identity.roleId,
        request.identity._id,
        request.params.promoterId,
      );
      if (!promoterCanSee) return reply.send(Boom.badRequest('Utente non autorizzato'));

      const filter = {
        promoterId: request.params.promoterId,
        ...(request.query.productivePeriodYear && request.query.productivePeriodMonth
          ? {
              $or: [
                { productivePeriodYear: { $gt: request.query.productivePeriodYear } },
                {
                  $and: [
                    { productivePeriodYear: { $eq: request.query.productivePeriodYear } },
                    { productivePeriodMonth: { $gte: request.query.productivePeriodMonth } },
                  ],
                },
              ],
            }
          : {}),
      };

      return db
        .collection('invoice')
        .find(filter)
        .sort({ issueDate: -1 })
        .skip(request.query.skip)
        .limit(request.query.count)
        .toArray()
        .then((list) => reply.send({ _meta: {}, items: list }))
        .catch((error) => reply.send(Boom.badRequest(error.message)));
    }),
  );
  next();
};
