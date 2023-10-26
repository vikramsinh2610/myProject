const Boom = require('boom');
const AccountingService = require('../../../services/accounting-srv');
const AccountingNoteTypes = require('../../../services/accounting-srv/note-type');
const AccountingNote = require('../../../services/accounting-srv/accounting-note');
const DebitAdditionalData = require('../../../services/accounting-srv/note-additional-data/debit-additional-data');
const productivePeriodHelper = require('../../../utils/productive-period-helper');

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
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
          },
        },
      },
      body: {
        type: 'object',
        required: ['type', 'amount', 'productivePeriodYear', 'productivePeriodMonth', 'additionalData'],
        properties: {
          type: {
            type: 'string',
            enum: [
              AccountingNoteTypes.WRITE_OFF,
              AccountingNoteTypes.WRITE_OFF_COMMISSION_PURCHASE,
              AccountingNoteTypes.WRITE_OFF_COMMISSION_DAMAGE,
              AccountingNoteTypes.WRITE_OFF_COMMISSION_MF,
              AccountingNoteTypes.WRITE_OFF_RAPPEL,
              AccountingNoteTypes.WRITE_OFF_PRODUCTION_PRIZE,
              AccountingNoteTypes.WRITE_OFF_RECTRUITING_PRIZE,
              AccountingNoteTypes.WRITE_OFF_GUARANTEED_BONUS,
              AccountingNoteTypes.RECRUITING_PRIZE,
              AccountingNoteTypes.PRODUCTION_PRIZE,
              AccountingNoteTypes.BALANCE,
              AccountingNoteTypes.OTHER,
              AccountingNoteTypes.ADVANCE,
              AccountingNoteTypes.DEBIT,
              AccountingNoteTypes.COMMISSIONING_DAMAGE,
              AccountingNoteTypes.COMMISSIONING_CASHIN,
              AccountingNoteTypes.COMMISSIONING_MFEE,
              AccountingNoteTypes.RAPPEL_QUARTER,
              AccountingNoteTypes.RAPPEL_SEMESTER,
              AccountingNoteTypes.RAPPEL_YEARLY,
              AccountingNoteTypes.BONUS_GUARANTEED,
              AccountingNoteTypes.WRITE_OFF_BALANCE,
              AccountingNoteTypes.COMMISSIONING,
            ],
          },
          amount: {
            type: 'integer',
          },
          productivePeriodYear: {
            type: 'integer',
            description: 'Productive period year of note',
          },
          productivePeriodMonth: {
            type: 'integer',
            description: 'Productive period month of note',
          },
          description: {
            type: 'string',
            default: '',
          },
          netToPay: {
            type: 'boolean',
            default: false,
          },
          additionalData: {
            type: 'object',
            properties: {
              dossierId: {
                type: 'string',
              },
              contractId: {
                type: 'string',
              },
              practiceId: {
                type: 'string',
              },
              recoveryInstallmentsNumber: {
                type: 'integer',
                minimum: 1,
              },
            },
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
                'createDate',
                'productivePeriodYear',
                'productivePeriodMonth',
                'amount',
                'origin',
                'type',
                'additionalData',
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
                  description: 'Amount of accounting note',
                },
                origin: {
                  type: 'string',
                  description: 'Origin ID',
                },
                netToPay: {
                  type: 'boolean',
                  default: false,
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
              },
            },
          },
        },
      },
    },
  };

  fastify.post('/', options, (request, reply) => {
    if (request.body.type === AccountingNoteTypes.ADVANCE && !request.body.additionalData.recoveryInstallmentsNumber) {
      reply.send(Boom.badRequest('recoveryInstallmentsNumber is missing'));
      return;
    }

    const accountingService = new AccountingService(fastify.mongo.db);
    accountingService
      .addAccountingNote(
        new AccountingNote({
          ...request.body,
          promoterId: request.params.promoterId,
          origin: request.body.type,
        }),
      )
      .then(async (note) => {
        if (note.type === AccountingNoteTypes.ADVANCE) {
          const { recoveryInstallmentsNumber } = note.additionalData;
          const debitAccountingNotesPromises = [];
          const productivePeriod = productivePeriodHelper.parse(
            request.body.productivePeriodYear,
            request.body.productivePeriodMonth,
          );

          for (let i = 0; i < recoveryInstallmentsNumber; i += 1) {
            const { productivePeriodYear, productivePeriodMonth } = productivePeriodHelper.unparse(
              productivePeriodHelper.addMonths(productivePeriod, i + 1),
            );
            debitAccountingNotesPromises.push(
              accountingService.addAccountingNote(
                new AccountingNote({
                  ...request.body,
                  productivePeriodYear,
                  productivePeriodMonth,
                  promoterId: request.params.promoterId,
                  origin: AccountingNoteTypes.DEBIT,
                  type: AccountingNoteTypes.DEBIT,
                  amount: -Math.round(note.amount / recoveryInstallmentsNumber),
                  additionalData: new DebitAdditionalData({
                    letterId: '',
                    accruedAmount: -Math.round(note.amount / recoveryInstallmentsNumber),
                    supplyPercentage: 10000,
                  }),
                }),
              ),
            );
          }

          await Promise.all(debitAccountingNotesPromises);
        }
        return reply.code(201).send(note);
      })
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
