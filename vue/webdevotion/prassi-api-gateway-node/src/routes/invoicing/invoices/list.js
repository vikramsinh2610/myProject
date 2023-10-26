const Mongo = require('mongodb');
const Boom = require('boom');
const dateRegex = require('../../../utils/iso-6801-date');
const InvoicingFlowService = require("../../../services/invoicing-flow-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoicing Invoice List',
      description: 'Get invoice list for specified invoicing',
      tags: ['invoicing'],
      params: {
        type: 'object',
        properties: {
          invoicingId: {
            type: 'string',
            pattern: '([0-9]{4})([0-1][0-9])+',
            description: 'Invoicing ID as productive period as YYYYMM',
          },
        },
      },
      querystring: {
        type: 'object',
        properties: {
          filterByConfirmed: {
            type: 'boolean',
            description: 'If present, filter invoices by confirmation value. Else all invoices are returned',
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
                ],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Invoice ID',
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
                    description: 'Network position of promoter',
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
                  taxRegimeType: {
                    type: 'string',
                    default: '',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const invoicingFlowService = new InvoicingFlowService(fastify.mongo.db, fastify.edition, fastify.log, fastify.knex);
    invoicingFlowService
      .getState(request.params.invoicingId)
      .then((state) =>
        state.invoices
          .filter(({ confirmed }) =>
            request.query.filterByConfirmed != null ? confirmed === request.query.filterByConfirmed : true,
          )
          .map(({ _id }) => _id),
      )
      .then((ids) =>
        db
          .collection('invoice')
          .find({ _id: { $in: ids } })
          .toArray(),
      )
      .then((list) => reply.send({ _meta: {}, items: list }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
