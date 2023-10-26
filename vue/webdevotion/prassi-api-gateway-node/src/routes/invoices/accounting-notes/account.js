const Boom = require('boom');
const InvoiceService = require("../../../services/invoice-srv");
const AccountingService = require("../../../services/accounting-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoice Account Entry',
      description: 'Account an invoice entry',
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
    const accountingService = new AccountingService(fastify.mongo.db);

    accountingService
      .getAccountingNote(request.params.accountingNoteId)
      .then((accountingNote) => invoiceService.addAccountingNotes(request.params.invoiceId, [accountingNote]))
      .then(() => reply.send())
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
