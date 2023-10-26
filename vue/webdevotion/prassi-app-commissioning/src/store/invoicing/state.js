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
    consultants: 0,
    previousConsultants: 0,
    percentageConsultants: 0,
  },
  invoicings: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  invoicing: {
    item: {},
  },
  invoices: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  documents: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  previewDocuments: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  report: {
    item: {},
  },
  invoicesConfirmed: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  invoicesUnconfirmed: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  invoice: {
    item: {},
  },
  note: {
    item: {},
  },
  notes: {
    items: [],
  },
  filter: {
    time: {
      selected: 'year',
      year: 2018,
      quarter: '',
      month: '',
    },
    fullTextSearch: '',
    type: {
      selected: 'all',
    },
  },
};
