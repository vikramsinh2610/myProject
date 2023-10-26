// const Boom = require('boom');
// const InvoicingFlowService = require('../../services/invoicing-flow-srv');
const Xlsx = require('xlsx');
const Boom = require('boom');
const InvoiceService = require('../../services/invoice-srv');
const AccountingNoteEntry = require('../../services/invoice-srv/accounting-note-entry');
const InvoicingFlowService = require('../../services/invoicing-flow-srv');
const PromoterService = require('../../services/promoter-srv');

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
      body: {
        type: 'object',
        properties: {
          file: { type: 'string' },
        },
        required: ['file'],
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
    const file = Xlsx.read(request.body.file, { type: 'base64', dense: true });
    const invoiceService = new InvoiceService(fastify.mongo.db);
    const promoterService = new PromoterService(fastify.mongo.db);
    const firstSheet = file.SheetNames[0];
    const { invoicingId } = request.params;

    // Prepare Data
    // eslint-disable-next-line security/detect-object-injection
    const data = Xlsx.utils.sheet_to_json(file.Sheets[firstSheet], { header: 1 });
    data.shift();

    // Get list of invoices in invoicing
    const { db } = fastify.mongo;

    const invoicingFlowService = new InvoicingFlowService(fastify.mongo.db, fastify.edition, fastify.log, fastify.knex);
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
        // For all records in the excel
        // Get (promoterId, productivePeriodYear, productivePeriodMonth) of data
        const dataInNoteFormat = data.map((d) => ({
          productivePeriodMonth: d[1],
          productivePeriodYear: d[2],
          type: d[3],
          origin: d[4],
          description: d[5],
          invoiceAmount: d[6],
          amount: d[6] * 100,
          additionalData: {},
          serialNumber: d[0],
        }));

        // Get invoice of that (promoterId, productivePeriodYear, productivePeriodMonth)
        const notesToAdd = [];
        // @ts-ignore
        await dataInNoteFormat.forEachAsync(async (datum) => {
          const { serialNumber } = datum;
          const promoter = await promoterService.getPromoterBySerialNumber(serialNumber);
          const invoiceFound = invoices.find((invoice) => invoice.promoterId === promoter._id);

          if (invoiceFound) {
            // notesToAdd.push(invoiceService.addAccountingNotes(invoiceFound._id, [new AccountingNoteEntry(datum)]));
            notesToAdd.push({ invoiceId: invoiceFound._id, data: [new AccountingNoteEntry(datum)] });
          }
        });

        // eslint-disable-next-line unicorn/no-for-loop, no-plusplus
        for (let i = 0; i < notesToAdd.length; i++) {
          // eslint-disable-next-line no-await-in-loop,security/detect-object-injection
          await invoiceService.addAccountingNotes(notesToAdd[i].invoiceId, notesToAdd[i].data);
        }

        return reply.send();
      })
      .catch((error) => reply.send(Boom.badRequest(error.message || `Import Failed: ${JSON.stringify(error)}`)));
  });
  next();
};
