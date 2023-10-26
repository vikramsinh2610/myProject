const dateRegex = require('../../utils/iso-6801-date');

module.exports = {
  description: 'State of commissioning for a certain productive period',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      description: 'Commissioning ID',
    },
    status: {
      type: 'string',
      description: 'Commissioning Status',
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
      description: 'Date when commissioning was opened',
    },
    didConfirmedDate: {
      type: 'string',
      pattern: dateRegex,
      description: 'Date when custom practices was confirmed',
    },
    didClosedDate: {
      type: 'string',
      pattern: dateRegex,
      description: 'Date when commissioning was closed',
    },
    income: {
      type: 'integer',
      description: 'Total income of commissioning',
    },
    outcome: {
      type: 'integer',
      description: 'Total outcome of commissioning',
    },
    margin: {
      type: 'integer',
      description: 'Total margin of commissioning',
    },
  },
};
