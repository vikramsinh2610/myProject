/* eslint-disable no-await-in-loop */

// const Boom = require('boom');
// const InvoicingFlowService = require('../../services/invoicing-flow-srv');
const Boom = require('boom');
const InvoiceService = require('../../services/invoice-srv');
const InvoicingFlowService = require('../../services/invoicing-flow-srv');

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
            description: 'Invoicing ID as productive period as YYYYMM',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          required: [],
          properties: {
            // _meta: { type: 'object' },
            item: { type: 'string' },
          },
        },
      },
    },
  };

  fastify.post('/', options, (request, reply) => {
    try {
      const { invoicingId } = request.params;
      const { db } = fastify.mongo;
      const invoiceService = new InvoiceService(fastify.mongo.db);

      const invoicingFlowService = new InvoicingFlowService(
        fastify.mongo.db,
        fastify.edition,
        fastify.log,
        fastify.knex,
      );
      invoicingFlowService
        .getState(invoicingId)
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
        .then(async (invoices) => {
          const notesToRemove = [];

          invoices.forEach((invoice) => {
            const { accountingNotes } = invoice;
            while (accountingNotes.length > 0) {
              const accountingNote = accountingNotes.pop();
              if (accountingNote.origin && accountingNote.origin === 'manual-import') {
                notesToRemove.push({ invoiceId: invoice._id, noteId: accountingNote._id });
              }
            }
          });

          // eslint-disable-next-line unicorn/no-for-loop, no-plusplus
          for (let i = 0; i < notesToRemove.length; i++) {
            // eslint-disable-next-line no-await-in-loop,security/detect-object-injection
            await invoiceService.removeAccountingNote(notesToRemove[i].invoiceId, notesToRemove[i].noteId);
          }

          return reply.send();
        })
        .catch((error) => reply.send(Boom.badRequest(error.message || `Rollback Failed: {JSON.stringify(error)}`)));
    } catch (error) {
      reply.send(Boom.badRequest(error.message));
    }
  });

  next();
};
