const Mongo = require('mongodb');
const Boom = require('boom');
const dateRegex = require('../../../utils/iso-6801-date');
const InvoiceService = require('../../../services/invoice-srv');
const DocumentService = require('../../../services/document-srv');
const InvoicePDFService = require('../../../services/invoice-pdf-srv');
const PromoterService = require('../../../services/promoter-srv');
const errorHandler = require('../../../utils/error-handler');
const AccountingService = require('../../../services/accounting-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoice Create',
      description: 'Create an invoice',
      tags: ['invoice'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
          },
          invoiceId: {
            type: 'string',
            description: 'Invoice ID',
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
            },
            item: {
              type: 'object',
              required: [
                '_id',
                'promoterId',
                'promoterDisplayName',
                'promoterRoleId',
                'promoterNetworkPath',
                'productivePeriodMonth',
                'productivePeriodYear',
                'number',
                'createDate',
                'issued',
                'accountingNotes',
              ],
              properties: {
                _id: {
                  type: 'string',
                  description: 'Invoice ID',
                },
                promoterId: {
                  type: 'string',
                  description: 'Promoter ID',
                },
                promoterDisplayName: {
                  type: 'string',
                  description: 'Disaplay name of promoter',
                },
                promoterRoleId: {
                  type: 'string',
                  description: 'Promoter role ID',
                },
                promoterNetworkPath: {
                  type: 'string',
                  description: 'Network position of promover',
                },
                productivePeriodMonth: {
                  type: 'integer',
                  description: 'Productive period month',
                  minimum: 1,
                  maximum: 12,
                },
                productivePeriodYear: {
                  type: 'integer',
                  description: 'Productive period year',
                  minimum: 2010,
                  maximum: 2099,
                },
                number: {
                  type: 'string',
                  description: 'The progressive number of invoice',
                },
                createDate: {
                  type: 'string',
                  pattern: dateRegex,
                  description: 'The creation date of the invoice',
                },
                issued: {
                  type: 'boolean',
                  description: 'Is invoice issued',
                },
                documentId: {
                  type: 'string',
                  description: 'Document ID',
                },
                grossAmount: {
                  type: 'integer',
                  description: 'Gross amount of invoice',
                },
                directCommissionsAmount: {
                  type: 'integer',
                  default: 0,
                },
                indirectCommissionsAmount: {
                  type: 'integer',
                  default: 0,
                },
                otherAmount: {
                  type: 'integer',
                  default: 0,
                },
                taxRegimeType: {
                  type: 'string',
                  default: '',
                },
                accountingNotes: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: [
                      '_id',
                      'createDate',
                      'productivePeriodYear',
                      'productivePeriodMonth',
                      'amount',
                      'origin',
                      'type',
                      'additionalData',
                      'invoiceAmount',
                    ],
                    properties: {
                      _id: {
                        type: 'string',
                        description: 'ID of accounting note',
                      },
                      productivePeriodYear: {
                        type: 'integer',
                        description: 'Productive period year of accounting note',
                      },
                      productivePeriodMonth: {
                        type: 'integer',
                        description: 'Productive period month of accounting note',
                      },
                      amount: {
                        type: 'integer',
                        default: 0,
                        description: 'Amount of accounting note',
                      },
                      origin: {
                        type: 'string',
                        description: 'Origin ID',
                      },
                      type: {
                        type: 'string',
                        description: 'Type',
                      },
                      additionalData: {
                        type: 'object',
                        additionalProperties: true,
                      },
                      description: {
                        type: 'string',
                        description: 'Optional description of accounting note',
                      },
                      invoiceAmount: {
                        type: 'integer',
                        description: 'Amount in invoice',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.post('/', options, errorHandler(async (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;
    const invoiceService = new InvoiceService(db);
    const promoterService = new PromoterService(db);
    const documentService = new DocumentService(db, fastify.s3.buckets.documents, fastify.s3.client);
    const invoicePDFService = new InvoicePDFService(db, documentService, fastify.edition);
    const accountingService = new AccountingService(db);

    try {
      const invoice = await invoiceService.issueInvoice(request.params.invoiceId, fastify.edition);
      let { documentId } = invoice;
      if (!documentId) {
        const promoter = await promoterService.getPromoterById(invoice.promoterId);
        const doc = await invoicePDFService.saveInvoicePDF(invoice, promoter);
        documentId = doc._id;
        await invoiceService.attachDocument(invoice._id, documentId);
        await Promise.all(
          invoice.accountingNotes.map((a) => {
            const newAccountingNote = { ...a };
            delete newAccountingNote.invoiceAmount;
            return accountingService.settleAccountingNote(newAccountingNote, a.invoiceAmount, invoice._id);
          }),
        );
      }
      reply.send({ _meta: {}, item: { ...invoice, documentId } });
    } catch (error) {
      reply.send(Boom.badRequest(error.message));
    }
  }));
  next();
};
