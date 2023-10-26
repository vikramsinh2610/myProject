const Boom = require('boom');
const InvoicingFlowService = require("../../services/invoicing-flow-srv");
const invoicingStateSchema = require('./invoicing-state-schema');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoicing Confirm Invoice',
      description: 'Confirm invoice in invoicing session',
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
          invoiceId: {
            type: 'string',
            description: 'The ID of invoice to confirm',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
          properties: {
            _meta: { type: 'object' },
            item: invoicingStateSchema,
          },
        },
      },
    },
  };

  fastify.post('/', options, (request, reply) => {
    const invoicingFlowService = new InvoicingFlowService(fastify.mongo.db, fastify.edition, fastify.log, fastify.knex);
    invoicingFlowService
      .confirmInvoice(request.params.invoicingId, request.query.invoiceId)
      .then((state) => reply.send({ _meta: {}, item: state }))
      .catch((error) => reply.send(Boom.conflict(error.message)));
  });
  next();
};
