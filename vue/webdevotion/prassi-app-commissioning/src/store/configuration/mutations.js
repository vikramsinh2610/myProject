import constants from '../../constants';

export const resetPromoters = (state) => {
  state.promoters.lastRecord = false;
  state.promoters.skip = 0;
  state.promoters.items = [];
};

export const resetPromoter = (state) => {
  state.promoter = {};
  state.jobs.items = [];
};

export const resetProducts = (state) => {
  state.products.lastRecord = false;
  state.products.skip = 0;
  state.products.items = [];
};

export const resetSurveys = (state) => {
  state.surveys.lastRecord = false;
  state.surveys.skip = 0;
  state.surveys.items = [];
};

export const resetQuestions = (state) => {
  state.questions.lastRecord = false;
  state.questions.skip = 0;
  state.questions.items = [];
};

export const resetRoles = (state) => {
  state.roles.lastRecord = false;
  state.roles.skip = 0;
  state.roles.items = [];
};

export const resetRole = (state) => {
  state.roles.item = [];
};

export const receiveRoles = (state, { items }) => {
  if (items && items.length !== 0) {
    state.roles.skip += 20;
    state.roles.items = [...state.roles.items, ...items];
    // state.roles.items = [...items];
  } else {
    state.roles.lastRecord = true;
  }
};

export const receiveRole = (state, { items }) => {
  state.role = [...items];
};

export const resetQuestionsFilter = (state) => {
  state.filterQuestions.searchText = '';
};

export const resetRolesFilter = (state) => {
  state.filterRoles.searchText = '';
};

export const resetBaserolesFilter = (state) => {
  state.filterBaseroles.searchText = '';
};

export const resetSurveysFilter = (state) => {
  state.filterSurveys.searchText = '';
};

export const resetProduct = (state) => {
  state.product = {};
};

export const resetSurvey = (state) => {
  state.survey = {
    _id: '',
    creationDate: new Date(),
    type: '',
    texts: [{ _id: 'default', text: '', description: '' }],
    questions: [
      {
        _id: '',
        creationDate: new Date(),
        multiple: false,
        multipleObligatory: false,
        multipleQuestion: false,
        section: '',
        texts: [{ _id: 'default', text: '' }],
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
  };
};

export const resetQuestion = (state) => {
  state.question = {
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
  };
};

export const resetSignalerProducts = (state) => {
  state.signalerProducts.lastRecord = false;
  state.signalerProducts.skip = 0;
  state.signalerProducts.items = [];
};

export const resetSignalerProduct = (state) => {
  state.signalerProduct = {};
};

export const resetMenuPermissions = (state) => {
  state.menu.items = [];
};

export const receivePromoterConfigurations = (state, { items }) => {
  if (items && items.length !== 0) {
    state.promoters.skip += 20;
    state.promoters.items = [...state.promoters.items, ...items];
  } else {
    state.promoters.lastRecord = true;
  }
};

export const receivePromoterConfiguration = (state, { item }) => {
  state.promoter = { ...item };
};

export const receivePromoterJobs = (state, { items }) => {
  state.jobs = [...items];
};

export const receiveSections = (state, { items }) => {
  state.sections = [...items];
};

export const receiveTypes = (state, { items }) => {
  state.types = [...items];
};

export const receiveBuckets = (state, { items }) => {
  state.buckets = [...items];
};

export const receiveProductConfigurations = (state, { items }) => {
  if (items && items.length !== 0) {
    state.products.skip += 20;
    state.products.items = [...state.products.items, ...items];
  } else {
    state.products.lastRecord = true;
  }
};

export const receiveSurveys = (state, { items }) => {
  if (items && items.length !== 0) {
    state.surveys.skip += 20;
    state.surveys.items = [...state.surveys.items, ...items];
  } else {
    state.surveys.lastRecord = true;
  }
};

export const receiveQuestions = (state, { items }) => {
  if (items && items.length !== 0) {
    state.questions.skip += 20;
    state.questions.items = [...state.questions.items, ...items];
  } else {
    state.questions.lastRecord = true;
  }
};

export const receiveProductConfiguration = (state, { item }) => {
  state.product = { ...item };
};

export const receiveSurvey = (state, { item }) => {
  state.survey = { ...item };
};

export const receiveQuestion = (state, { item }) => {
  state.question = { ...item };
};

export const receiveSignalerProductConfigurations = (state, { items }) => {
  if (items && items.length !== 0) {
    state.signalerProducts.skip += 20;
    state.signalerProducts.items = [...state.signalerProducts.items, ...items];
  } else {
    state.signalerProducts.lastRecord = true;
  }
};

export const receiveDossierInsurer = (state, { items }) => {
  if (items && items.length !== 0) {
    state.dossierInsurer.skip += 20;
    state.dossierInsurer.items = [...state.dossierInsurer.items, ...items];
  } else {
    state.dossierInsurer.lastRecord = true;
  }
};

export const receiveCustomerInsurer = (state, { items }) => {
  if (items && items.length !== 0) {
    state.customerInsurer.skip += 20;
    state.customerInsurer.items = [...state.customerInsurer.items, ...items];
  } else {
    state.customerInsurer.lastRecord = true;
  }
};

export const resetDossiers = (state) => {
  state.dossierInsurer.lastRecord = false;
  state.dossierInsurer.skip = 0;
  state.dossierInsurer.items = [];
};

export const resetCustomerInsurer = (state) => {
  state.customerInsurer.lastRecord = false;
  state.customerInsurer.skip = 0;
  state.customerInsurer.items = [];
};

export const receiveAllSignalerProductConfigurations = (state, { items }) => {
  state.allSignalerProducts.items = [...items];
};

export const receiveSignalerProductConfiguration = (state, { item }) => {
  state.signalerProduct = { ...item };
};

export const setPromotersSearchText = (state, text) => {
  state.filterPromoters = {
    searchText: text,
  };
};

export const setProductsSearchText = (state, text) => {
  state.filterProducts = {
    searchText: text,
  };
};

export const setProductSurveyResponses = (state, responses) => {
  state.filterProducts = {
    surveyResponses: responses,
    count: 500,
  };
};

export const setProductIds = (state, productIds) => {
  state.filterProducts = {
    productIds,
    count: 500,
  };
};

export const setSurveysSearchText = (state, text) => {
  state.filterSurveys = {
    searchText: text,
  };
};

export const setQuestionsSearchText = (state, text) => {
  state.filterQuestions = {
    searchText: text,
  };
};

export const setRolesSearchText = (state, text) => {
  state.filterRoles = {
    searchText: text,
  };
};

export const receiveManagementFeeConfigurations = (state, { items }) => {
  state.managementFees.items = [...items];
};

export const receiveManagementFeeConfiguration = (state, { item }) => {
  state.managementFee = { ...item };
};

export const resetManagementFeeConfigurations = (state) => {
  state.managementFees.items = [];
};

export const receiveCommissioningConfigurations = (state, { items }) => {
  state.sheltiaCommissionings.items = [...items];
};

export const receiveCommissioningConfiguration = (state, { item }) => {
  state.sheltiaCommissioning = { ...item };
};

export const resetCommissioningConfigurations = (state) => {
  state.sheltiaCommissionings.items = [];
};

export const receiveTcwCommissioningConfigurations = (state, { items }) => {
  state.tcwCommissionings.items = [...items];
};

export const receiveTcwCommissioningConfigurationsDynamic = (state, { items }) => {
  state.tcwCommissionings.items = [...items];
};

export const receiveTcwCommissioningConfiguration = (state, { item }) => {
  state.tcwCommissioning = { ...item };
};

export const receiveTcwCommissioningConfigurationDynamic = (state, { item }) => {
  state.tcwCommissioningDynamic = { ...item };
};

export const receiveAdjustedPremiumConfigurations = (state, { items }) => {
  state.adjustedPremiums.items = [...items];
};

export const receiveAdjustedPremiumConfiguration = (state, { item }) => {
  state.adjustedPremium = { ...item };
};

export const resetAdjustedPremiumConfigurations = (state) => {
  state.adjustedPremiums.items = [];
};

export const setDossierInsurerSorting = (state, field) => {
  let direction = constants.dossiersSortDefault.directionASC;
  if (state.dossierInsurer.sort.type === field) direction = !state.dossierInsurer.sort.directionASC;
  state.dossierInsurer.sort = {
    ...state.dossierInsurer.sort,
    type: field,
    directionASC: direction,
  };
};

export const setCustomerInsurerSorting = (state, field) => {
  let direction = constants.customersSortDefault.directionASC;
  if (state.customerInsurer.sort.type === field)
    direction = !state.customerInsurer.sort.directionASC;
  state.customerInsurer.sort = {
    ...state.customerInsurer.sort,
    type: field,
    directionASC: direction,
  };
};

export const setCustomerFilter = (state, { promoterId, customerId, networkId }) => {
  state.filterCustomer = {
    fields: {
      ...state.filterCustomer.fields,
      promoterId,
      customerId,
      networkId,
    },
  };
};

export const receiveMenuPermissions = (state, { items }) => {
  state.menu = [...items];
};

export const receiveMenuPermissionsConfigurations = (state, { items }) => {
  if (items && items.length !== 0) {
    state.menuPermissions.skip += 20;
    state.menuPermissions.items = [...state.menuPermissions.items, ...items];
  } else {
    state.menuPermissions.lastRecord = true;
  }
};

export const receiveMenuPermissionsConfigurationsUser = (state, { items }) => {
  state.menuPermissions.promoters = [...items];
};

export const receiveMenuIds = (state, { items }) => {
  state.menuPermissions.menuIds = [...items];
};

export const receiveAllMenuPermissionsConfigurations = (state, { items }) => {
  state.menuPermissions.items = [...items];
  state.menuPermissions.lastRecord = true;
};

export const resetMenuPermissionsConfigurations = (state) => {
  state.menuPermissions.lastRecord = false;
  state.menuPermissions.skip = 0;
  state.menuPermissions.items = [];
};

export const resetMenuPermissionsConfigurationsFilter = (state) => {
  state.menuPermissions.searchText = '';
};

export const setMenuPermissionsConfigurationsSearchText = (state, text) => {
  state.menuPermissions = {
    searchText: text,
  };
};

export const setMenuPermissionsConfigurationsFilterRoleType = (state, roleType) => {
  state.filter = {
    time: { ...state.filter.time },
    type: { ...state.filter.type, roleType },
  };
};

export const setMenuPermissionsConfigurationsFilterPromoterId = (state, promoterId) => {
  state.filter = {
    time: { ...state.filter.time },
    type: { ...state.filter.type, promoterId },
  };
};

export const receiveMenuPermissionsConfiguration = (state, { item }) => {
  state.menuPermission = { ...item };
};
