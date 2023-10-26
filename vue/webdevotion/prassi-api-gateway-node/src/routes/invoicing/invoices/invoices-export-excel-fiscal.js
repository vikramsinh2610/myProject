const Mongo = require('mongodb');
const Boom = require('boom');
const InvoicingFlowService = require("../../../services/invoicing-flow-srv");
const DocumentService = require('../../../services/document-srv');
const { excelReport } = require('../../../services/excel-report-srv');
const { types: documentTypes } = require("../../../services/document-srv/document-types");
require('../../../utils/foreach');
const translateEntryOrigin = require('../../../services/invoice-pdf-srv/translate-types');

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
          required: ['_meta', 'item'],
          properties: {
            _meta: {
              type: 'object',
              properties: {
                getPresignedUrl: {
                  type: 'string',
                  description: 'API link to get presigned url',
                },
              },
            },
            item: {
              type: 'object',
              properties: {
                documentId: {
                  type: 'string',
                  description: 'Report document ID',
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.post('/', options, (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);

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
      .then(async (excelList) => {
        const data = [];
        const notes = [];
        const taxes = [];
        const totals = [];
        // @ts-ignore
        await excelList.forEachAsync(async (invoice) => {
          await invoice.accountingNotes.forEachAsync((note) => {
            notes.push({
              ...note,
            });
          });
          await invoice.taxes.forEachAsync((tax) => {
            taxes.push({
              ...tax,
            });
          });
          totals.push(invoice);
        });

        // eslint-disable-next-line unicorn/no-reduce, unicorn/prefer-object-from-entries
        const notesReduced = notes.reduce((acc, value) => {
          acc[value.origin] = acc[value.origin] ? acc[value.origin] + value.amount : value.amount;
          return { ...acc };
        }, {});
        Object.entries(notesReduced).forEach((key) => {
          data.push({
            origin: key[0],
            amount: key[1],
          });
        });

        // eslint-disable-next-line unicorn/no-reduce
        const totalGross = totals.reduce((acc, value) => acc + value.grossAmount, 0);
        data.push({
          description: 'Totale Lordo',
          origin: 'Totale Lordo',
          amount: totalGross,
        });

        // eslint-disable-next-line unicorn/no-reduce, unicorn/prefer-object-from-entries
        const taxesReduced = taxes.reduce((acc, value) => {
          acc[value.origin] = acc[value.origin] ? acc[value.origin] + value.amount : value.amount;
          return { ...acc };
        }, {});
        // eslint-disable-next-line sonarjs/no-identical-functions
        Object.entries(taxesReduced).forEach((key) => {
          data.push({
            origin: key[0],
            amount: key[1],
          });
        });

        // eslint-disable-next-line unicorn/no-reduce
        const totalNet = totals.reduce((acc, value) => acc + value.amount, 0);
        data.push({
          description: 'Totale Netto',
          origin: 'Totale Netto',
          amount: totalNet,
        });

        return {
          headers: [
            { field: 'description', position: 1, translation: 'Causali di spesa' },
            { field: 'amount', position: 2, translation: 'Elaborazione ordinaria' },
          ],
          data: data.map((p) => ({
            description: p.description || translateEntryOrigin(p.origin),
            amount: p.amount / 100,
          })),
        };
      })
      .then((data) => Promise.resolve(excelReport(data)))
      .then((buffer) =>
        documentService.addDocument(
          {
            type: documentTypes.INVOICING_NETWORK_REPORT,
            ownerId: 'SYSTEM',
            additionalData: {
              invoicingId: request.params.invoicingId,
            },
            displayName: `Report invoicing ${new Date().toString()}.xlsx`,
            locked: true,
          },
          buffer,
        ),
      )
      .then((doc) => {
        const getPresignedUrl = `/v1/documents/${doc._id}/presigned-download`;
        return reply.header('Link', getPresignedUrl).send({
          _meta: { getPresignedUrl },
          item: { documentId: doc._id },
        });
      })
      .catch((error) => reply.send(Boom.badRequest(error)));
  });
  next();
};
