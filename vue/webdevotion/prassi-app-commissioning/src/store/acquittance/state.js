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
  acquittances: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  acquittance: {
    item: {},
  },
  report: {
    item: {},
  },
  companies: {
    items: [],
  },
  signedUrl: {
    item: {},
  },
  filter: {
    time: {
      selected: 'year',
      year: 2018,
      quarter: '',
      month: '',
    },
    type: {
      selected: 'error',
    },
  },
};
