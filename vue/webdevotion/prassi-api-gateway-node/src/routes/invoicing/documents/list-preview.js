const Mongo = require('mongodb');
const Boom = require('boom');
const InvoicingFlowService = require("../../../services/invoicing-flow-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoicing Document List Preview',
      description: 'Get invoice documents  list preview',
      tags: ['document'],
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
        required: ['skip', 'count'],
        properties: {
          skip: {
            type: 'integer',
            mimimum: 0,
            default: 0,
            description: 'Pagination skip items',
          },
          count: {
            type: 'integer',
            default: 20,
            mimumum: 1,
            maximum: 25,
            description: 'Page size',
          },
          fullTextSearch: {
            type: 'string',
            description: 'Free text for full text search',
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
              properties: {},
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['_id', 'type', 'createDate', 'additionalData'],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Attachment ID',
                  },
                  type: {
                    type: 'string',
                    description: 'Attachment Type',
                  },
                  createDate: {
                    type: 'string',
                    description: 'Attachment creation date',
                  },
                  displayName: {
                    type: 'string',
                    description: 'File name for the user',
                  },
                  additionalData: {
                    type: 'object',
                    additionalProperties: true,
                    description: 'Document additional properties',
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

    const $regex = request.query.fullTextSearch
      ? decodeURIComponent(request.query.fullTextSearch)
          .split(' ')
          .join('|')
      : undefined;

    const invoicingFlowService = new InvoicingFlowService(fastify.mongo.db, fastify.edition, fastify.log, fastify.knex);
    invoicingFlowService
      .getState(request.params.invoicingId)
      .then((state) =>
        db
          .collection('document')
          .find(
            $regex
              ? {
                  _id: { $in: state.documentIdsPreview },
                  'additionalData.promoterDisplayName': { $regex, $options: 'i' },
                }
              : { _id: { $in: state.documentIdsPreview } },
          )
          .sort({ _id: 1 })
          .skip(request.query.skip)
          .limit(request.query.count)
          .toArray(),
      )
      .then((items) =>
        reply.send({
          _meta: {},
          items,
        }),
      )
      .catch((error) => reply.send(Boom.badRequest(error)));
  });
  next();
};
