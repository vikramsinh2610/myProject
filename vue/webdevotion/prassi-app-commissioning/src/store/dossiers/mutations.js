export const setDossiersFilterAll = (
  state,
  {
    promoterId,
    customerId,
    searchCustomer,
    searchContract,
    product,
    company,
    type,
    status,
    networkId,
    confirmed,
    paid,
  },
) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: {
      ...state.filter.fields,
      promoterId,
      customerId,
      searchCustomer,
      searchContract,
      product,
      company,
      type: JSON.stringify(type),
      status: JSON.stringify(status),
      networkId,
      confirmed,
      paid,
    },
  };
};

export const setDossiersFilterPromoter = (state, value) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: { ...state.filter.fields, promoterId: value },
  };
};

export const setDossiersFilterBirthday = (state, value) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: { ...state.filter.fields, birthday: value },
  };
};

export const setDossiersFilterLegalPerson = (state, value) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: { ...state.filter.fields, lr: value },
  };
};

export const setCustomerFilterFiscalCode = (state, value) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: { ...state.filter.fields, isFiscalCodeSearch: value },
  };
};

export const setDossiersFilterIdExpired = (state, value) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: { ...state.filter.fields, expired: value },
  };
};

export const setDossiersFilterIdComplete = (state, value) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: { ...state.filter.fields, complete: value },
  };
};

export const setDossiersFilterSolar = (state, value) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: { ...state.filter.fields, solarSearch: value },
  };
};

export const setDossiersFilterFullSearch = (state, value) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: { ...state.filter.fields, fullSearch: value },
  };
};

export const setDossiersFilterOption = (state, value) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: { ...state.filter.fields, option: value },
  };
};

export const setDossiersFilterDate = (state, filter) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time, ...filter },
    type: { ...state.filter.type },
    fields: { ...state.filter.fields },
  };
};

export const setDossiersFilterPreviousDate = (state, filter) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime, ...filter },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: { ...state.filter.fields },
  };
};

export const setDossiersFilterSelected = (state, selected) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type, selected },
    fields: { ...state.filter.fields },
  };
};

export const resetDossiersSummary = (state) => {
  state.summary = {
    nodes: undefined,
    previousNodes: undefined,
    percentageNodes: undefined,
    consultants: undefined,
    previousConsultants: undefined,
    percentageConsultants: undefined,
    customers: undefined,
    previousCustomers: undefined,
    percentageCustomers: undefined,
    insured: undefined,
    previousInsured: undefined,
    percentageInsured: undefined,
    premiums: undefined,
    previousPremiums: undefined,
    percentagePremiums: undefined,
    IV: undefined,
    previousIV: undefined,
    percentageIV: undefined,
    PZ: undefined,
    previousPZ: undefined,
    percentagePZ: undefined,
  };
};

export const receiveDossiersSummary = (state, { item }) => {
  state.summary.nodes = item.nodes;
  state.summary.percentageNodes = Math.round(
    (100 / state.summary.previousNodes) * state.summary.nodes - 100,
  );

  state.summary.consultants = item.consultants;
  state.summary.percentageConsultants = Math.round(
    (100 / state.summary.previousConsultants) * item.consultants - 100,
  );
  state.summary.customers = item.customers;
  state.summary.percentageCustomers = Math.round(
    (100 / state.summary.previousCustomers) * item.customers - 100,
  );
  state.summary.insured = item.insured;
  state.summary.percentageInsured = Math.round(
    (100 / state.summary.previousInsured) * item.insured - 100,
  );
  state.summary.premiums = item.premiums;
  state.summary.percentagePremiums = Math.round(
    (100 / state.summary.previousPremiums) * item.premiums - 100,
  );
  state.summary.iv = item.iv;
  state.summary.percentageIV = Math.round((100 / state.summary.previousIV) * item.iv - 100);
  state.summary.pc = item.pc;
  state.summary.percentagePC = Math.round((100 / state.summary.previousPC) * item.pc - 100);
};

export const receiveDossiersSummaryPrevious = (state, { item }) => {
  state.summary.previousCustomers = item.customers;
  state.summary.percentageCustomers = Math.round(
    (100 / state.summary.previousCustomers) * state.summary.customers - 100,
  );

  state.summary.previousConsultants = item.consultants;
  state.summary.percentageConsultants = Math.round(
    (100 / state.summary.previousConsultants) * state.summary.consultants - 100,
  );

  state.summary.previousNodes = item.nodes;
  state.summary.percentageNodes = Math.round(
    (100 / state.summary.previousNodes) * state.summary.nodes - 100,
  );

  state.summary.previousInsured = item.insured;
  state.summary.percentageInsured = Math.round(
    (100 / state.summary.previousInsured) * state.summary.insured - 100,
  );
  state.summary.previousPremiums = item.premiums;
  state.summary.percentagePremiums = Math.round(
    (100 / state.summary.previousPremiums) * state.summary.premiums - 100,
  );
  state.summary.previousIV = item.iv;
  state.summary.percentageIV = Math.round(
    (100 / state.summary.previousIV) * state.summary.iv - 100,
  );
  state.summary.previousPC = item.pc;
  state.summary.percentagePC = Math.round(
    (100 / state.summary.previousPC) * state.summary.pc - 100,
  );
};

export const receiveDossiersOverdueSummary = (state, { item }) => {
  state.summaryOverdue.customers = item.customers;
  state.summaryOverdue.percentageCustomers = Math.round(
    (100 / state.summaryOverdue.previousCustomers) * item.customers - 100,
  );
  state.summaryOverdue.insured = item.insured;
  state.summaryOverdue.percentageInsured = Math.round(
    (100 / state.summaryOverdue.previousInsured) * item.insured - 100,
  );
  state.summaryOverdue.premiums = item.premiums;
  state.summaryOverdue.percentagePremiums = Math.round(
    (100 / state.summaryOverdue.previousPremiums) * item.premiums - 100,
  );
  state.summaryOverdue.iv = item.iv;
  state.summaryOverdue.percentageIV = Math.round(
    (100 / state.summaryOverdue.previousIV) * item.iv - 100,
  );
  state.summaryOverdue.pc = item.pc;
  state.summaryOverdue.percentagePC = Math.round(
    (100 / state.summaryOverdue.previousPC) * item.pc - 100,
  );
  state.summaryOverdue.dossiers = item.dossiers;
  state.summaryOverdue.percentageDossiers = Math.round(
    (100 / state.summaryOverdue.previousDossiers) * item.dossiers - 100,
  );
};

export const receiveDossiersOverdueSummaryPrevious = (state, { item }) => {
  state.summaryOverdue.previousCustomers = item.customers;
  state.summaryOverdue.percentageCustomers = Math.round(
    (100 / state.summaryOverdue.previousCustomers) * state.summaryOverdue.customers - 100,
  );
  state.summaryOverdue.previousInsured = item.insured;
  state.summaryOverdue.percentageInsured = Math.round(
    (100 / state.summaryOverdue.previousInsured) * state.summaryOverdue.insured - 100,
  );
  state.summaryOverdue.previousPremiums = item.premiums;
  state.summaryOverdue.percentagePremiums = Math.round(
    (100 / state.summaryOverdue.previousPremiums) * state.summaryOverdue.premiums - 100,
  );
  state.summaryOverdue.previousIV = item.iv;
  state.summaryOverdue.percentageIV = Math.round(
    (100 / state.summaryOverdue.previousIV) * state.summaryOverdue.iv - 100,
  );
  state.summaryOverdue.previousPC = item.pc;
  state.summaryOverdue.percentagePC = Math.round(
    (100 / state.summaryOverdue.previousPC) * state.summaryOverdue.pc - 100,
  );
  state.summaryOverdue.previousDossiers = item.dossiers;
  state.summaryOverdue.percentageDossiers = Math.round(
    (100 / state.summaryOverdue.previousDossiers) * state.summaryOverdue.dossiers - 100,
  );
};

export const receiveDossiers = (state, { items }) => {
  if (items && items.length !== 0) {
    state.dossiers.skip += 20;
    state.dossiers.items = [...state.dossiers.items, ...items];
    if (items.length < 20) state.dossiers.lastRecord = true;
  } else {
    state.dossiers.lastRecord = true;
  }
};

export const resetDossiers = (state) => {
  state.dossiers.lastRecord = false;
  state.dossiers.skip = 0;
  state.dossiers.items = [];
};

export const resetDossiersSearch = (state) => {
  state.filter = {
    time: {
      selected: 'month',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      quarter: 1,
    },
    previousTime: {
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
      type: undefined,
      status: undefined,
      company: 'no-selection',
      product: 'no-selection',
      customerType: 'no-selection',
      customerStatus: 'no-selection',
      promoterId: undefined,
      customerId: undefined,
      networkId: undefined,
      birthday: undefined,
      expired: undefined,
      complete: undefined,
    },
  };
};

export const receiveTree = (state, { item }) => {
  state.tree.item = item;
};

export const receiveCustomer = (state, { item }) => {
  state.customer = { ...item };
};

export const receivePersonIdentityCard = (state, { item }) => {
  state.personIdentityCard = { ...item };
};

export const resetPersonIdentityCard = (state) => {
  state.personIdentityCard = {};
};

export const receiveCustomerRelated = (state, { item }) => {
  state.customerRelated = { ...item };
};

export const resetCustomerRelated = (state) => {
  state.customerRelated = {};
};

export const receivePrecontractual = (state, { item }) => {
  state.precontractual = { ...item };
  state.signatureMandate = item.signatureMandate;
  state.signaturePrivacy = item.signaturePrivacy;
  state.signatureOtp = item.signatureOtp;
  state.signatureDocuments = item.signatureDocuments;
};

export const receivePrecontractuals = (state, { items }) => {
  if (items && items.length !== 0) {
    state.precontractuals.items = [...state.precontractuals.items, ...items];
  } else {
    state.precontractuals.lastRecord = true;
  }
};

export const resetPrecontractuals = (state) => {
  state.precontractuals.lastRecord = false;
  state.precontractuals.skip = 0;
  state.precontractuals.items = [];
};

export const resetPrecontractual = (state) => {
  state.precontractual = {};
};

export const receivePrecontractualRelated = (state, { item }) => {
  state.precontractualRelated = { ...item };
};

export const receiveSignatureMandate = (state, { item }) => {
  state.signatureMandate = { ...item };
};

export const receiveSignatureOtp = (state, { item }) => {
  state.signatureOtp = { ...item };
};

export const receiveSignaturePrivacy = (state, { item }) => {
  state.signaturePrivacy = { ...item };
};

export const receiveSignatureDocuments = (state, { item }) => {
  state.signatureDocuments = { ...item };
};

export const receiveCustomers = (state, { items }) => {
  if (items && items.length !== 0) {
    state.customers.skip += 20;
    state.customers.items = [...state.customers.items, ...items];
    if (items.length < 20) state.customers.lastRecord = true;
  } else {
    state.customers.lastRecord = true;
  }
};

export const receiveCustomersDuplicated = (state, { items }) => {
  if (items && items.length !== 0) {
    state.customersDuplicated.skip += 20;
    state.customersDuplicated.items = [...state.customersDuplicated.items, ...items];
    if (items.length < 20) state.customersDuplicated.lastRecord = true;
  } else {
    state.customersDuplicated.lastRecord = true;
  }
};

export const resetCustomersDuplicated = (state) => {
  state.customersDuplicated.lastRecord = false;
  state.customersDuplicated.skip = 0;
  state.customersDuplicated.items = [];
};

export const receivePersonDocuments = (state, { items }) => {
  if (items && items.length !== 0) {
    state.personDocuments.skip += 20;
    state.personDocuments.items = [...state.personDocuments.items, ...items];
    if (items.length < 20) state.personDocuments.lastRecord = true;
  } else {
    state.personDocuments.lastRecord = true;
  }
};

export const resetPersonDocuments = (state) => {
  state.personDocuments.lastRecord = false;
  state.personDocuments.skip = 0;
  state.personDocuments.items = [];
};

export const receivePersonPersons = (state, { items }) => {
  if (items && items.length !== 0) {
    state.personPersons.skip += 20;
    state.personPersons.items = [...state.personPersons.items, ...items];
    if (items.length < 20) state.personPersons.lastRecord = true;
  } else {
    state.personPersons.lastRecord = true;
  }
};

export const receivePersonRelations = (state, { items }) => {
  if (items && items.length !== 0) {
    state.personRelations.skip += 20;
    state.personRelations.items = [...state.personRelations.items, ...items];
    if (items.length < 20) state.personRelations.lastRecord = true;
  } else {
    state.personRelations.lastRecord = true;
  }
};

export const resetPersonPersons = (state) => {
  state.personPersons.lastRecord = false;
  state.personPersons.skip = 0;
  state.personPersons.items = [];
};

export const resetPersonRelations = (state) => {
  state.personRelations.lastRecord = false;
  state.personRelations.skip = 0;
  state.personRelations.items = [];
};

export const receivePersonCompanies = (state, { items }) => {
  if (items && items.length !== 0) {
    state.personCompanies.skip += 20;
    state.personCompanies.items = [...state.personCompanies.items, ...items];
    if (items.length < 20) state.personCompanies.lastRecord = true;
  } else {
    state.personCompanies.lastRecord = true;
  }
};

export const resetPersonCompanies = (state) => {
  state.personCompanies.lastRecord = false;
  state.personCompanies.skip = 0;
  state.personCompanies.items = [];
};

export const setCustomerFilterAll = (
  state,
  { promoterId, searchCustomer, customerType, customerStatus, networkId, fiscalCode },
) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: {
      ...state.filter.fields,
      promoterId,
      searchCustomer,
      customerType,
      customerStatus,
      networkId,
      fiscalCode,
    },
  };
};

export const setCustomerSearchFilter = (state, searchCustomer) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: {
      ...state.filter.fields,
      searchCustomer,
    },
  };
};

export const setCustomerId = (state, customerId) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: {
      ...state.filter.fields,
      customerId,
    },
  };
};

export const setAllPeriods = (state, allPeriods) => {
  state.filter = {
    ...state.filter,
    fields: {
      ...state.filter.fields,
      allPeriods,
    },
  };
};

export const setTime = (state, time) => {
  state.filter = {
    previousTime: { ...state.filter.previousTime },
    time: { ...state.filter.time, ...time },
    type: { ...state.filter.type },
    fields: {
      ...state.filter.fields,
    },
  };
};

export const resetCustomers = (state) => {
  state.customers.lastRecord = false;
  state.customers.skip = 0;
  state.customers.items = [];
};

export const resetCustomersSimple = (state) => {
  state.customersSimple.lastRecord = false;
  state.customersSimple.skip = 0;
  state.customersSimple.items = [];
};

export const receiveAllCustomersSimple = (state, { items }) => {
  state.customersSimple.items = [...items];
  state.customersSimple.lastRecord = true;
};

export const receiveContractsExcelReport = (state, { item }) => {
  state.report.item = { ...item };
};

export const receiveAdvisoryFeePromotersCsvReport = (state, { item }) => {
  state.report.item = { ...item };
};

export const receiveAdvisoryFeeInvoiceCsvReport = (state, { item }) => {
  state.report.item = { ...item };
};

export const receiveProposalsExcelReport = (state, { item }) => {
  state.report.item = { ...item };
};

export const receivePackageExcelReport = (state, { item }) => {
  state.report.item = { ...item };
};

export const receiveOverdueExcelReport = (state, { item }) => {
  state.report.item = { ...item };
};

export const receiveProductionExcelReport = (state, { item }) => {
  state.report.item = { ...item };
};

export const receiveNegativeExcelReport = (state, { item }) => {
  state.report.item = { ...item };
};

export const receiveCustomersReport = (state, { item }) => {
  state.report.item = { ...item };
};

export const receiveCustomerExportId = (state, { item }) => {
  state.exportId = item.exportId;
};

export const receivePrecontractualListResults = (state, { items }) => {
  state.precontractualList = items;
};

export const receivePrecontractualSummary = (state, { item }) => {
  state.precontractualSummary = item;
};
