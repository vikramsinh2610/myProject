const AccountingNoteTypes = require('../../../services/accounting-srv/note-type');
const translateEntryOrigin = require('../../../services/invoice-pdf-srv/translate-types');

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Promoter Accounting Notes List types',
      description: 'Get all types of accounting notes',
      tags: ['accounting'],
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'items'],
          properties: {
            _meta: {
              type: 'object',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['_id', 'description'],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'ID of accounting note type',
                  },
                  description: {
                    type: 'string',
                    description: 'Description of accounting note type',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    reply.send({
      _meta: {},
      items: [
        { _id: AccountingNoteTypes.ADVANCE, description: translateEntryOrigin(AccountingNoteTypes.ADVANCE) },
        { _id: AccountingNoteTypes.DEBIT, description: translateEntryOrigin(AccountingNoteTypes.DEBIT) },
        {
          _id: AccountingNoteTypes.COMMISSIONING,
          description: translateEntryOrigin(AccountingNoteTypes.COMMISSIONING),
        },
        {
          _id: AccountingNoteTypes.COMMISSIONING_DAMAGE,
          description: translateEntryOrigin(AccountingNoteTypes.COMMISSIONING_DAMAGE),
        },
        {
          _id: AccountingNoteTypes.COMMISSIONING_CASHIN,
          description: translateEntryOrigin(AccountingNoteTypes.COMMISSIONING_CASHIN),
        },
        {
          _id: AccountingNoteTypes.COMMISSIONING_MFEE,
          description: translateEntryOrigin(AccountingNoteTypes.COMMISSIONING_MFEE),
        },
        {
          _id: AccountingNoteTypes.RAPPEL_QUARTER,
          description: translateEntryOrigin(AccountingNoteTypes.RAPPEL_QUARTER),
        },
        {
          _id: AccountingNoteTypes.RAPPEL_SEMESTER,
          description: translateEntryOrigin(AccountingNoteTypes.RAPPEL_SEMESTER),
        },
        {
          _id: AccountingNoteTypes.RAPPEL_YEARLY,
          description: translateEntryOrigin(AccountingNoteTypes.RAPPEL_YEARLY),
        },
        {
          _id: AccountingNoteTypes.BONUS_GUARANTEED,
          description: translateEntryOrigin(AccountingNoteTypes.BONUS_GUARANTEED),
        },
        {
          _id: AccountingNoteTypes.RECRUITING_PRIZE,
          description: translateEntryOrigin(AccountingNoteTypes.RECRUITING_PRIZE),
        },
        {
          _id: AccountingNoteTypes.PRODUCTION_PRIZE,
          description: translateEntryOrigin(AccountingNoteTypes.PRODUCTION_PRIZE),
        },
        { _id: AccountingNoteTypes.BALANCE, description: translateEntryOrigin(AccountingNoteTypes.BALANCE) },
        { _id: AccountingNoteTypes.WRITE_OFF, description: translateEntryOrigin(AccountingNoteTypes.WRITE_OFF) },
        {
          _id: AccountingNoteTypes.WRITE_OFF_COMMISSION_PURCHASE,
          description: translateEntryOrigin(AccountingNoteTypes.WRITE_OFF_COMMISSION_PURCHASE),
        },
        {
          _id: AccountingNoteTypes.WRITE_OFF_COMMISSION_DAMAGE,
          description: translateEntryOrigin(AccountingNoteTypes.WRITE_OFF_COMMISSION_DAMAGE),
        },
        {
          _id: AccountingNoteTypes.WRITE_OFF_COMMISSION_MF,
          description: translateEntryOrigin(AccountingNoteTypes.WRITE_OFF_COMMISSION_MF),
        },
        {
          _id: AccountingNoteTypes.WRITE_OFF_RAPPEL,
          description: translateEntryOrigin(AccountingNoteTypes.WRITE_OFF_RAPPEL),
        },
        {
          _id: AccountingNoteTypes.WRITE_OFF_PRODUCTION_PRIZE,
          description: translateEntryOrigin(AccountingNoteTypes.WRITE_OFF_PRODUCTION_PRIZE),
        },
        {
          _id: AccountingNoteTypes.WRITE_OFF_RECTRUITING_PRIZE,
          description: translateEntryOrigin(AccountingNoteTypes.WRITE_OFF_RECTRUITING_PRIZE),
        },
        {
          _id: AccountingNoteTypes.WRITE_OFF_GUARANTEED_BONUS,
          description: translateEntryOrigin(AccountingNoteTypes.WRITE_OFF_GUARANTEED_BONUS),
        },
        {
          _id: AccountingNoteTypes.WRITE_OFF_BALANCE,
          description: translateEntryOrigin(AccountingNoteTypes.WRITE_OFF_BALANCE),
        },
        { _id: AccountingNoteTypes.OTHER, description: translateEntryOrigin(AccountingNoteTypes.OTHER) },
      ],
    });
  });
  next();
};
