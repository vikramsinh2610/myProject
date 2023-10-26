const Boom = require('boom');
const InvoiceService = require("../../../services/invoice-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoice Unaccount Entry',
      description: 'Unaccount an invoice entry',
      tags: ['invoice'],
      params: {
        type: 'object',
        properties: {
          invoiceId: {
            type: 'string',
            description: 'Invoice ID',
          },
          accountingNoteId: {
            type: 'string',
            description: 'Accounting Note ID',
          },
        },
      },
    },
  };

  fastify.post('/', options, (request, reply) => {
    const invoiceService = new InvoiceService(fastify.mongo.db);

    invoiceService
      .removeAccountingNote(request.params.invoiceId, request.params.accountingNoteId)
      .then(() => reply.send())
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
