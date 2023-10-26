import constants from '../../constants';

export default {
  promoters: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  menu: [],
  menuPermissions: {
    lastRecord: false,
    skip: 0,
    items: [],
    promoters: [],
    menuIds: [],
  },
  filterMenuPermissions: {
    searchText: '',
  },
  menuPermission: {
    _id: '',
    roleId: 0,
    userId: '',
    menuId: '',
    enabled: false,
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
    username: '',
  },
  jobs: [],
  filterPromoters: {
    searchText: '',
  },
  products: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  product: {
    _id: '',
    premiumType: '',
    advance: false,
    companyAdvance: false,
    productCode: '',
    productName: '',
    monthsOnSubscription: 0,
    subscriptionYears: 0,
    options: [],
  },
  dossierInsurer: {
    lastRecord: false,
    skip: 0,
    items: [],
    sort: {
      type: constants.dossiersSortDefault.field,
      directionASC: constants.dossiersSortDefault.directionASC,
    },
  },
  customerInsurer: {
    lastRecord: false,
    skip: 0,
    items: [],
    sort: {
      type: constants.customersSortDefault.field,
      directionASC: constants.customersSortDefault.directionASC,
    },
  },
  signalerProducts: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  allSignalerProducts: {
    items: [],
  },
  signalerProduct: {
    _id: '',
    productCode: '',
    productName: '',
    amount: 0,
  },
  filterProducts: {
    searchText: '',
    surveyResponses: [],
    productIds: [],
    count: 20,
  },
  filterSurveys: {
    searchText: '',
  },
  filterQuestions: {
    searchText: '',
  },
  filterRoles: {
    searchText: '',
  },
  managementFees: {
    items: [],
  },
  managementFee: {
    _id: '',
    roleId: '',
    fromProductivePeriodYear: 0,
    fromProductivePeriodMonth: 0,
    fromProductivePeriod: 0,
    percentage: 0,
  },
  filtermanagementFees: {
    searchText: '',
  },
  sheltiaCommissionings: {
    items: [],
  },
  sheltiaCommissioning: {
    _id: '',
    roleId: '',
    fromProductivePeriodYear: 0,
    fromProductivePeriodMonth: 0,
    fromProductivePeriod: 0,
    purchase: {
      basis: {
        directProductionPercentage: 0,
        indirectProductionPercentage: 0,
      },
      range: {
        directProductionSlots: [],
        indirectProductionSlots: [],
      },
      target: {
        slots: [],
      },
    },
    cashIn: [],
  },
  tcwCommissionings: {
    items: [],
  },
  tcwCommissioning: {
    _id: '',
    roleId: '',
    directProductionPercentage: 0,
    indirectProductionPercentage: 0,
    isIndirectProductionCombinable: false,
    directProductionForfait: 0,
  },
  tcwCommissioningDynamic: {
    _id: '',
    config: [],
  },
  filterSheltiaCommissioning: {
    searchText: '',
  },
  adjustedPremiums: {
    items: [],
  },
  adjustedPremium: {
    _id: '',
    products: [],
  },
  filteradjustedPremium: {
    searchText: '',
  },
  filterCustomer: {
    fields: {
      promoterId: undefined,
      networkId: undefined,
      customerId: undefined,
    },
  },
  questions: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  roles: {
    items: [],
    skip: 0,
    lastRecord: false,
  },
  role: {
    items: [],
  },
  question: {
    _id: '',
    creationDate: new Date(),
    multiple: false,
    multipleObligatory: false,
    multipleQuestion: false,
    section: '',
    texts: [{ _id: 'default', text: '', description: '' }],
    responses: [
      {
        _id: 'default',
        text: '',
        selected: false,
        values: [{ _id: 'default', points: 0, reason: '', conditionedQuestionId: '' }],
      },
    ],
  },
  surveys: {
    lastRecord: false,
    skip: 0,
    items: [],
  },
  survey: {
    _id: '',
    creationDate: new Date(),
    type: '',
    texts: [{ _id: 'default', text: '' }],
    questions: [
      {
        _id: '',
        creationDate: new Date(),
        multiple: false,
        multipleObligatory: false,
        multipleQuestion: false,
        section: '',
        texts: [{ _id: 'default', text: '', description: '' }],
        responses: [
          {
            _id: 'default',
            text: '',
            selected: false,
            values: [{ _id: 'default', points: 0, reason: '', conditionedQuestionId: '' }],
          },
        ],
      },
    ],
  },
  sections: [],
  types: [],
  buckets: [],
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
