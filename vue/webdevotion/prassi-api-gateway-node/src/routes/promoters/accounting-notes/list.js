const Boom = require('boom');
const AccountingService = require("../../../services/accounting-srv");
const NetworkService = require("../../../services/network-srv");
const errorHandler = require("../../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Promoter Accounting Notes List',
      description: 'Get all unsettled accounting notes for a promoter',
      tags: ['accounting'],
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
                  'createDate',
                  'productivePeriodYear',
                  'productivePeriodMonth',
                  'amount',
                  'origin',
                  'type',
                  'additionalData',
                ],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'ID of accounting note',
                  },
                  productivePeriodYear: {
                    type: 'integer',
                    description: 'Productive period year of accounting note',
                  },
                  productivePeriodMonth: {
                    type: 'integer',
                    description: 'Productive period month of accounting note',
                  },
                  amount: {
                    type: 'integer',
                    description: 'Amount of accounting note',
                  },
                  origin: {
                    type: 'string',
                    description: 'Origin ID',
                  },
                  type: {
                    type: 'string',
                    description: 'Type',
                  },
                  netToPay: {
                    type: 'boolean',
                    description: 'Amount is net to pay',
                  },
                  additionalData: {
                    type: 'object',
                    additionalProperties: true,
                  },
                  description: {
                    type: 'string',
                    description: 'Optional description of accounting note',
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
      const accountingService = new AccountingService(fastify.mongo.db);

      const networkService = new NetworkService(fastify.mongo.db);
      const promoterCanSee = await networkService.userCanSee(
        request.identity.roleId,
        request.identity._id,
        request.params.promoterId,
      );
      if (!promoterCanSee) return reply.send(Boom.badRequest('Utente non autorizzato'));

      const filter = {
        promoterId: request.params.promoterId,
        settled: false,
        invoiceId: null,
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

      return accountingService
        .getAccountingNotes(filter)
        .then((accountingNotes) => reply.send({ _meta: {}, items: accountingNotes }))
        .catch((error) => reply.send(Boom.badRequest(error.message)));
    }),
  );
  next();
};
