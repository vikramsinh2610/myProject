const Boom = require('boom');
const CompanyAcquittanceService = require('../../services/company-acquittance-srv');
const DocumentService = require('../../services/document-srv');
const { excelReport } = require('../../services/excel-report-srv');
const { types: paymentTypes } = require("../../services/company-acquittance-srv/payment-types");
const { types: documentTypes } = require("../../services/document-srv/document-types");

const list = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Create Acquittance Report',
      description: 'Create company acquittance report and get the document',
      tags: ['acquittances'],
      params: {
        type: 'object',
        properties: {
          acquittanceId: {
            type: 'string',
            description: 'Acquittance ID',
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
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
    const companyAcquittanceService = new CompanyAcquittanceService(fastify.mongo.db, documentService, fastify.knex);

    companyAcquittanceService
      .getAcquittance(request.params.acquittanceId)
      .then((acquittance) => ({
        headers: [
          { field: 'contractId', position: 0, translation: 'ID Contratto' },
          { field: 'type', position: 1, translation: 'Tipo' },
          { field: 'premiumNet', position: 2, translation: 'Premio Netto' },
          { field: 'premiumGross', position: 3, translation: 'Premio Lordo' },
          { field: 'installment', position: 4, translation: 'N° Pagamento' },
          { field: 'productivePeriod', position: 5, translation: 'Periodo Produttivo' },
          { field: 'payin', position: 6, translation: 'Payin da Compagnia' },
          { field: 'calculatedPayin', position: 7, translation: 'Payin da Calcolo' },
          { field: 'installmentDate', position: 8, translation: 'Data di incasso' },
          { field: 'status', position: 9, translation: 'Stato' },
          { field: 'notFoundBase', position: 10, translation: 'Inesistente' },
          { field: 'notFoundPractice', position: 11, translation: 'Non trovata' },
          { field: 'alreadyConfirmed', position: 12, translation: 'Già confermata' },
          { field: 'errorPayin', position: 13, translation: 'Errore nel calcolo' },
        ],
        data: acquittance.payments.map((p) => ({
          ...p,
          premiumNet: p.premiumNet / 100,
          premiumGross: p.premiumGross / 100,
          payin: p.payin / 100,
          calculatedPayin: p.calculatedPayin / 100,
          type: ((type) => {
            switch (type) {
              case paymentTypes.ADDITIONAL_INCOME:
                return 'Versamento Aggiuntivo';
              case paymentTypes.INCOME:
                return 'Incasso';
              case paymentTypes.SUBSCRIPTION:
                return 'Sottoscrizione';
              default:
                return '';
            }
          })(p.type),
          productivePeriod: `${p.productivePeriodYear}/${p.productivePeriodMonth}`,
          installmentDate: p.installmentDate || '',
        })),
      }))
      .then((data) => Promise.resolve(excelReport(data)))
      .then((buffer) =>
        documentService.addDocument(
          {
            type: documentTypes.COMPANY_ACQUITTANCE_REPORT,
            ownerId: 'SYSTEM',
            additionalData: {
              acquittanceId: request.params.acquittanceId,
            },
            displayName: `Report quietanza ${new Date().toString()}.xlsx`,
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

module.exports = list;
