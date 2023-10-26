const dateRegex = require('../../utils/iso-6801-date');

module.exports = {
  description: 'State of invoicing for a certain productive period',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      description: 'Invoicing ID',
    },
    status: {
      type: 'string',
      description: 'Invoicing Status',
    },
    productivePeriodYear: {
      type: 'integer',
      description: 'Year of productive period',
    },
    productivePeriodMonth: {
      type: 'integer',
      description: 'Month of productive period',
    },
    didOpenedDate: {
      type: 'string',
      pattern: dateRegex,
      description: 'Date when invoicing was opened',
    },
    didCompletedDate: {
      type: 'string',
      pattern: dateRegex,
      description: 'Date when invoicing was completed',
    },
    didClosedDate: {
      type: 'string',
      pattern: dateRegex,
      description: 'Date when invoicing was closed',
    },
    invoices: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Invoice ID',
          },
          confirmed: {
            type: 'boolean',
            description: 'Invoice is confirmed',
          },
        },
      },
    },
  },
};
