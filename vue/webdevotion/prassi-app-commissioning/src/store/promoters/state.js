import constants from '../../constants';

export default {
  summary: {
    count: 0,
    previousCount: 0,
    percentageCount: 0,
    network: 0,
    previousNetwork: 0,
    percentageNetwork: 0,
    enabled: 0,
    previousEnabled: 0,
    percentageEnabled: 0,
    gone: 0,
    previousGone: 0,
    percentageGone: 0,
  },
  promoters: {
    lastRecord: false,
    skip: 0,
    items: [],
    sort: {
      type: constants.promotersSortDefault.field,
      directionASC: constants.promotersSortDefault.directionASC,
    },
  },
  report: {
    item: {},
  },
  network: {
    items: [],
  },
  letters: {
    lastRecord: false,
    skip: 0,
    items: [],
    types: [],
    filter: {
      type: constants.noSelection,
      promoterDisplayName: '',
    },
    sort: {
      type: constants.lettersSortDefault.field,
      directionASC: constants.lettersSortDefault.directionASC,
    },
  },
  copyStatus: {
    items: [],
  },
  attachments: {
    items: [],
  },
  documents: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  invoices: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  letter: {
    _id: '',
    type: '',
    status: '',
    promoterId: '',
    promoterSerialNumber: '',
    promoterDisplayName: '',
    description: '',
    signatureDate: '',
  },
  letterSettings: {
    types: {},
  },
  noteTypes: {
    items: {},
  },
  companyProfile: {
    approvationDate: '',
    approved: false,
    director: false,
    employed: false,
    enabled: false,
    guest: false,
    ivassCode: '',
    networkEnterDate: '',
    networkExitDate: '',
  },
  promoter: {
    _id: '',
    birthDate: '',
    displayAddress: '',
    displayHierarchy: '',
    displayName: '',
    fixedPhone: '',
    lastLoginDate: '',
    mobilePhone: '',
    roleName: '',
    name: '',
    surname: '',
  },
  roles: {
    items: [],
  },
  targets: {
    item: {},
    items: [],
  },
  branch: {},
  filter: {
    time: {
      selected: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      quarter: 1,
    },
    type: {
      selected: 'all',
      searchCustomer: '',
      roleType: constants.noSelection,
    },
  },
};
