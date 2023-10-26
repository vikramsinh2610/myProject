const Mongo = require('mongodb');
const Boom = require('boom');
const InvoicingFlowService = require("../../../services/invoicing-flow-srv");
const DocumentService = require('../../../services/document-srv');
const PromoterService = require('../../../services/promoter-srv');
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

  // eslint-disable-next-line sonarjs/cognitive-complexity
  fastify.post('/', options, (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
    const promoterService = new PromoterService(fastify.mongo.db);

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
        // @ts-ignore
        await excelList.forEachAsync(async (invoice) => {
          const promoter = await promoterService.getPromoterById(invoice.promoterId);
          await invoice.accountingNotes.forEachAsync((note) => {
            if (note.invoiceAmount) {
              data.push({
                promoterDisplayName: invoice.promoterDisplayName,
                serialNumber: invoice.serialNumber,
                promoterRoleId: invoice.promoterRoleId,
                promoterNetworkPath: invoice.promoterNetworkPath,
                promoterIban: promoter.tax.iban,
                ...note,
              });
            }
          });
          await invoice.taxes.forEachAsync((tax) => {
            data.push({
              promoterDisplayName: invoice.promoterDisplayName,
              serialNumber: invoice.serialNumber,
              promoterRoleId: invoice.promoterRoleId,
              promoterNetworkPath: invoice.promoterNetworkPath,
              promoterIban: promoter.tax.iban,
              ...tax,
            });
          });
          data.push({ ...invoice, promoterIban: promoter.tax.iban });
        });
        return {
          headers: [
            { field: 'promoterDisplayName', position: 0, translation: 'Nome' },
            { field: 'serialNumber', position: 0, translation: 'Matricola' },
            { field: 'promoterIban', position: 0, translation: 'Iban' },
            { field: 'promoterRoleId', position: 1, translation: 'Ruolo' },
            { field: 'promoterNetworkPath', position: 2, translation: 'Gerarchia' },
            { field: 'description', position: 2, translation: 'Descrizione' },
            { field: 'totalIV', position: 5, translation: 'Totale IV' },
            { field: 'grossAmount', position: 5, translation: 'Totale' },
          ],
          data: data.map((p) => ({
            promoterDisplayName: p.promoterDisplayName,
            serialNumber: p.serialNumber ? p.serialNumber : '',
            promoterIban: p.promoterIban ? p.promoterIban : '',
            promoterRoleId: p.promoterRoleId,
            promoterNetworkPath: p.promoterNetworkPath,
            description: p.grossAmount ? 'Totale' : p.description || translateEntryOrigin(p.origin),
            totalIV: p.totalIV ? p.totalIV / 100 : 0,
            grossAmount: p.invoiceAmount || p.invoiceAmount === 0 ? p.invoiceAmount / 100 : p.amount / 100,
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
