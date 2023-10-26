const Mongo = require('mongodb');
const Boom = require('boom');
const DocumentService = require('../../../services/document-srv');
const PromoterService = require('../../../services/promoter-srv');
const { excelReport } = require('../../../services/excel-report-srv');
const { types: documentTypes } = require("../../../services/document-srv/document-types");
require('../../../utils/foreach');
const translateEntryOrigin = require('../../../services/invoice-pdf-srv/translate-types');
const productivePeriodHelper = require('../../../utils/productive-period-helper');

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
    const { productivePeriodMonth, productivePeriodYear } = productivePeriodHelper.unparse(request.params.invoicingId);

    db.collection('invoice')
      .find({ productivePeriodYear, productivePeriodMonth: { $lte: productivePeriodMonth } })
      .toArray()
      .then(async (excelList) => {
        const data = [];
        // @ts-ignore
        await excelList.forEachAsync(async (invoice) => {
          let promoter;
          try {
            promoter = await promoterService.getPromoterById(invoice.promoterId);
          } catch {
            promoter = { tax: { iban: 'promotore-non-trovato' } };
            fastify.log.error(`promoter not found: ${invoice.promoterId}`);
          }
          await invoice.accountingNotes.forEachAsync((note) => {
            if (note.invoiceAmount) {
              data.push({
                promoterDisplayName: invoice.promoterDisplayName,
                serialNumber: invoice.serialNumber,
                promoterRoleId: invoice.promoterRoleId,
                promoterNetworkPath: invoice.promoterNetworkPath,
                promoterIban: promoter.tax.iban,
                number: invoice.number,
                period: productivePeriodHelper.parse(invoice.productivePeriodYear, invoice.productivePeriodMonth),
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
              number: invoice.number,
              period: productivePeriodHelper.parse(invoice.productivePeriodYear, invoice.productivePeriodMonth),
              ...tax,
            });
          });
          data.push({
            ...invoice,
            promoterIban: promoter.tax.iban,
            period: productivePeriodHelper.parse(invoice.productivePeriodYear, invoice.productivePeriodMonth),
          });
        });
        return {
          headers: [
            { field: 'promoterDisplayName', position: 0, translation: 'Nome' },
            { field: 'serialNumber', position: 1, translation: 'Matricola' },
            { field: 'promoterIban', position: 2, translation: 'Iban' },
            { field: 'promoterRoleId', position: 3, translation: 'Ruolo' },
            { field: 'promoterNetworkPath', position: 4, translation: 'Gerarchia' },
            { field: 'number', position: 5, translation: 'Numero Fattura' },
            { field: 'period', position: 6, translation: 'Periodo Produttivo' },
            { field: 'description', position: 7, translation: 'Descrizione' },
            ...(fastify.edition === 'sheltia' ? [{ field: 'totalIV', position: 8, translation: 'Totale IV' }] : []),
            { field: 'grossAmount', position: 9, translation: 'Totale' },
          ],
          data: data.map((p) => ({
            promoterDisplayName: p.promoterDisplayName,
            serialNumber: p.serialNumber ? p.serialNumber : '',
            promoterIban: p.promoterIban ? p.promoterIban : '',
            promoterRoleId: p.promoterRoleId,
            promoterNetworkPath: p.promoterNetworkPath,
            number: p.number,
            period: p.period,
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
