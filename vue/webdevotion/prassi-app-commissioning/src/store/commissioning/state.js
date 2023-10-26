export default {
  exportId: undefined,
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
    consultants: 0,
    previousConsultants: 0,
    percentageConsultants: 0,
  },
  installmentsPurchase: {
    items: [],
  },
  installmentsCashIn: {
    items: [],
  },
  installmentsIncluded: {
    items: [],
  },
  totalNetwork: {
    items: [],
  },
  mfees: {
    items: [],
  },
  commissionings: {
    items: [],
  },
  commissioning: {
    item: {},
  },
  report: {
    item: {},
  },
  logEvents: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  filter: {
    time: {
      selected: 'year',
      year: 2018,
      quarter: '',
      month: '',
    },
    type: {
      selected: 'all',
    },
  },
};
