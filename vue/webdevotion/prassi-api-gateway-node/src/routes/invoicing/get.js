const Boom = require('boom');
const InvoicingFlowService = require("../../services/invoicing-flow-srv");
const invoicingStateSchema = require('./invoicing-state-schema');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoicing Details Get',
      description: 'Get invoicing state for the specified productive period',
      tags: ['commissioning'],
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

  fastify.get('/', options, (request, reply) => {
    const invoicingFlowService = new InvoicingFlowService(fastify.mongo.db, fastify.edition, fastify.log, fastify.knex);
    invoicingFlowService
      .getState(request.params.invoicingId)
      .then((state) => reply.send({ _meta: {}, item: state }))
      .catch((error) => reply.send(Boom.notFound(error.message)));
  });
  next();
};
