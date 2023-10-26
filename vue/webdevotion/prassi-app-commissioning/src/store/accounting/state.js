export default {
  summary: {
    margin: 0,
    previousMargin: 0,
    percentageMargin: 0,
    in: 0,
    previousIn: 0,
    percentageIn: 0,
    out: 0,
    previousOut: 0,
    percentageOut: 0,
    transactions: 0,
    previousTransactions: 0,
    percentageTransactions: 0,
  },
  summaryForecast: {
    margin: 0,
    previousMargin: 0,
    percentageMargin: 0,
    in: 0,
    previousIn: 0,
    percentageIn: 0,
    out: 0,
    previousOut: 0,
    percentageOut: 0,
    transactions: 0,
    previousTransactions: 0,
    percentageTransactions: 0,
  },
  transactions: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  transaction: {
    item: {},
  },
  products: {
    items: [],
  },
  installments: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  transactionsForecast: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  filter: {
    time: {
      selected: 'month',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      quarter: 1,
    },
    type: {
      selected: 'all',
    },
    fields: {
      searchContract: '',
      type: 'no-selection',
      company: 'no-selection',
      product: 'no-selection',
    },
  },
  filterForecast: {
    time: {
      selected: 'month',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      quarter: 1,
    },
    type: {
      selected: 'all',
    },
    fields: {
      searchContract: '',
      type: 'no-selection',
      company: 'no-selection',
      product: 'no-selection',
    },
  },
  filterOverdue: {
    time: {
      selected: 'month',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      quarter: 1,
    },
    fields: {
      searchContract: '',
      company: 'no-selection',
      product: 'no-selection',
    },
  },
};
