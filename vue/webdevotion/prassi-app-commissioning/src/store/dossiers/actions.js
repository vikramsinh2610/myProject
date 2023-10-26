import Vue from 'vue';

// eslint-disable-next-line import/prefer-default-export
export const fetchContractsSummary = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/contracts/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiersSummary',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchContractsSummaryPrevious = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/contracts/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.previousTime.year,
      store.state.filter.previousTime.month,
      store.state.filter.previousTime.quarter,
      store.state.filter.previousTime.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiersSummaryPrevious',
  });

export const fetchContracts = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/contracts?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }
    ${
      store.state.filter.fields.customerId
        ? // eslint-disable-next-line prefer-template
          '&customerId=' + store.state.filter.fields.customerId
        : ''
    }
    ${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiers',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchProductionSummary = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/production/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiersSummary',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchProductionSummaryPrevious = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/production/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.previousTime.year,
      store.state.filter.previousTime.month,
      store.state.filter.previousTime.quarter,
      store.state.filter.previousTime.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiersSummaryPrevious',
  });

export const fetchProduction = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/production?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiers',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchProposalsSummary = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/proposals/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiersSummary',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchProposalsSummaryPrevious = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/proposals/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.previousTime.year,
      store.state.filter.previousTime.month,
      store.state.filter.previousTime.quarter,
      store.state.filter.previousTime.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiersSummaryPrevious',
  });

export const fetchProposals = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/proposals?count=100000000&skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerId
        ? // eslint-disable-next-line prefer-template
          '&customerId=' + store.state.filter.fields.customerId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiers',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchPackageSummary = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/package/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiersSummary',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchPackageSummaryPrevious = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/package/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.previousTime.year,
      store.state.filter.previousTime.month,
      store.state.filter.previousTime.quarter,
      store.state.filter.previousTime.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiersSummaryPrevious',
  });

export const fetchPackage = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/package?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerId
        ? // eslint-disable-next-line prefer-template
          '&customerId=' + store.state.filter.fields.customerId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiers',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchOverdueSummary = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/overdue/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerId
        ? // eslint-disable-next-line prefer-template
          '&customerId=' + store.state.filter.fields.customerId
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.option
        ? // eslint-disable-next-line prefer-template
          '&option=' + store.state.filter.fields.option
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiersOverdueSummary',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchOverdueSummaryPrevious = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/overdue/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.previousTime.year,
      store.state.filter.previousTime.month,
      store.state.filter.previousTime.quarter,
      store.state.filter.previousTime.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerId
        ? // eslint-disable-next-line prefer-template
          '&customerId=' + store.state.filter.fields.customerId
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.option
        ? // eslint-disable-next-line prefer-template
          '&option=' + store.state.filter.fields.option
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiersOverdueSummaryPrevious',
  });

export const fetchOverdue = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/overdue?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerId
        ? // eslint-disable-next-line prefer-template
          '&customerId=' + store.state.filter.fields.customerId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.option
        ? // eslint-disable-next-line prefer-template
          '&option=' + store.state.filter.fields.option
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiers',
  });

// eslint-disable-next-line sonarjs/cognitive-complexity
export const fetchInstallmentsSummary = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/installments/summary-pg?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerId
        ? // eslint-disable-next-line prefer-template
          '&customerId=' + store.state.filter.fields.customerId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.option
        ? // eslint-disable-next-line prefer-template
          '&option=' + store.state.filter.fields.option
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }${
      store.state.filter.fields.confirmed && store.state.filter.fields.confirmed !== 'all'
        ? // eslint-disable-next-line prefer-template
          '&confirmed=' + store.state.filter.fields.confirmed
        : ''
    }${
      store.state.filter.fields.paid && store.state.filter.fields.paid !== 'all'
        ? // eslint-disable-next-line prefer-template
          '&paid=' + store.state.filter.fields.paid
        : ''
    }`,
    receive: 'receiveDossiersOverdueSummary',
  });

// eslint-disable-next-line sonarjs/cognitive-complexity
export const fetchInstallmentsSummaryPrevious = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/installments/summary-pg?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.previousTime.year,
      store.state.filter.previousTime.month,
      store.state.filter.previousTime.quarter,
      store.state.filter.previousTime.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerId
        ? // eslint-disable-next-line prefer-template
          '&customerId=' + store.state.filter.fields.customerId
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.option
        ? // eslint-disable-next-line prefer-template
          '&option=' + store.state.filter.fields.option
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }${
      store.state.filter.fields.confirmed && store.state.filter.fields.confirmed !== 'all'
        ? // eslint-disable-next-line prefer-template
          '&confirmed=' + store.state.filter.fields.confirmed
        : ''
    }${
      store.state.filter.fields.paid && store.state.filter.fields.paid !== 'all'
        ? // eslint-disable-next-line prefer-template
          '&paid=' + store.state.filter.fields.paid
        : ''
    }`,
    receive: 'receiveDossiersOverdueSummaryPrevious',
  });

// eslint-disable-next-line sonarjs/cognitive-complexity
export const fetchInstallments = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/installments-pg?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.customerId
        ? // eslint-disable-next-line prefer-template
          '&customerId=' + store.state.filter.fields.customerId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.option
        ? // eslint-disable-next-line prefer-template
          '&option=' + store.state.filter.fields.option
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }${
      store.state.filter.fields.confirmed && store.state.filter.fields.confirmed !== 'all'
        ? // eslint-disable-next-line prefer-template
          '&confirmed=' + store.state.filter.fields.confirmed
        : ''
    }${
      store.state.filter.fields.paid && store.state.filter.fields.paid !== 'all'
        ? // eslint-disable-next-line prefer-template
          '&paid=' + store.state.filter.fields.paid
        : ''
    }`,
    receive: 'receiveDossiers',
  });

export const setInstallmentConfirmed = (store, practiceId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/installment/${practiceId}/confirmed`,
    action: 'post',
  });

export const setInstallmentPaid = (store, practiceId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/installment/${practiceId}/paid`,
    action: 'post',
  });

export const setInstallmentUnConfirmed = (store, practiceId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/installment/${practiceId}/unconfirmed`,
    action: 'post',
  });

export const setInstallmentUnPaid = (store, practiceId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/installment/${practiceId}/unpaid`,
    action: 'post',
  });

export const updatePayin = (store, data) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/installment/${data.practiceId}/update-payin`,
    action: 'post',
    body: data,
  });

export const fetchNegativeSummary = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/negative/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiersSummary',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchNegativeSummaryPrevious = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/negative/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.previousTime.year,
      store.state.filter.previousTime.month,
      store.state.filter.previousTime.quarter,
      store.state.filter.previousTime.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiersSummaryPrevious',
  });

export const fetchNegative = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/negative?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveDossiers',
  });

export const fetchTree = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/network/tree?${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}`,
    receive: 'receiveTree',
  });

export const createTree = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/network/create?${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}`,
    action: 'put',
    receive: 'receiveTree',
  });

export const createTreeCopyPrevious = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/network/create-copy?${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}`,
    action: 'put',
    receive: 'receiveTree',
  });

export const saveTreeNode = (store, { nodeId, nodeBody }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/network/${nodeId}/save?${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}`,
    action: 'put',
    body: nodeBody,
    receive: 'receiveTree',
  });

export const moveCustomerNode = (store, { nodeTargetId, nodeDestinationId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/network/${nodeTargetId}/move-customer/${nodeDestinationId}?${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}`,
    action: 'put',
  });

export const createTreeNode = (store, { nodeId, addSibling, nodeBody }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/network/${nodeId}/create?sibling=${addSibling}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}`,
    action: 'post',
    body: nodeBody,
    receive: 'receiveTree',
  });

export const deleteTreeNode = (store, nodeId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/network/${nodeId}/delete?${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}`,
    action: 'delete',
    receive: 'receiveTree',
  });

export const orderTreeNode = (store, nodeId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/network/${nodeId}/order?${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}`,
    action: 'put',
    receive: 'receiveTree',
  });

export const moveTreeNode = (store, { sourceNodeId, destinationNodeId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/network/${sourceNodeId}/move?destinationNodeId=${destinationNodeId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}`,
    action: 'put',
    receive: 'receiveTree',
  });

export const createCustomer = (store, { body }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customers`,
    action: 'post',
    body,
    receive: 'receiveCustomer',
  });

export const fetchCustomer = (store, customerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customers/${customerId}`,
    receive: 'receiveCustomer',
  });

export const fetchPerson = (store, customerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons/${customerId}`,
    receive: 'receiveCustomer',
  });

export const fetchPersonLinked = (store, customerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons/${customerId}`,
    receive: 'receiveCustomerRelated',
  });

// eslint-disable-next-line sonarjs/no-identical-functions
export const fetchPersonPrecontractual = (store, precontractualId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-precontractual/${precontractualId}`,
    receive: 'receiveCustomer',
  });

export const fetchPersonRelated = (store, precontractualId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-precontractual/${precontractualId}`,
    receive: 'receiveCustomerRelated',
  });

export const fetchPersonRelatedByPersonId = (store, customerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-precontractual-id/${customerId}`,
    receive: 'receiveCustomerRelated',
  });

export const savePerson = (store, { body }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons`,
    action: 'put',
    body,
    receive: 'receiveCustomer',
  });

export const syncCustomerPractices = (store, customerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/dossiers/sync-customer?customerId=${customerId}`,
    action: 'post',
  });

export const savePersonRelated = (store, { body }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons`,
    action: 'put',
    body,
    receive: 'receiveCustomerRelated',
  });

export const createPersonRelated = (store, { body }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons`,
    action: 'post',
    body,
    receive: 'receiveCustomerRelated',
  });

export const createPrecontractual = (store, customerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual/${customerId}`,
    action: 'post',
    receive: 'receivePrecontractual',
  });

export const fetchPrecontractual = (store, precontractualId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual/${precontractualId}`,
    receive: 'receivePrecontractual',
  });

export const fetchPrecontractualSummmary = (store, precontractualId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual/${precontractualId}/summary`,
    receive: 'receivePrecontractuals',
  });

export const fetchPrecontractualRelated = (store, customerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual-related/${customerId}`,
    receive: 'receivePrecontractualRelated',
  });

export const signPdfDocuments = (store, data) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual/sign-pdf-documents/${data.precontractualId}`,
    action: 'post',
    body: data,
    receive: 'receiveSignatureDocuments',
  });

export const signPdfDocumentsCompany = (store, data) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual/sign-pdf-documents-company/${data.precontractualId}`,
    action: 'post',
    body: data,
    receive: 'receiveSignatureDocuments',
  });

export const updatePdfSignatureDocuments = (store, data) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual/update-sign-pdf-documents/${data.precontractualId}`,
    action: 'post',
    body: data,
    receive: 'receiveSignatureDocuments',
  });

export const savePrecontractual = (store, { body }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual`,
    action: 'put',
    body,
    receive: 'receivePrecontractual',
  });

export const savePrecontractualRelated = (store, { body }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual`,
    action: 'put',
    body,
    receive: 'receivePrecontractualRelated',
  });

export const saveIdentityCard = (store, { body }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual/update-identity-card`,
    action: 'put',
    body,
  });

export const fetchIdentityCard = (store, precontractualId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual/identity-card/${precontractualId}`,
    receive: 'receivePersonIdentityCard',
  });

export const fetchIdentityCardByCustomerId = (store, customerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/last-identity-card/${customerId}`,
    receive: 'receivePersonIdentityCard',
  });

export const deleteCustomer = (store, customerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customers/${customerId}`,
    action: 'delete',
    receive: 'receiveCustomer',
  });

export const deletePerson = (store, { personId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons/${personId}`,
    action: 'delete',
    receive: 'receiveCustomer',
  });

export const fetchPersons = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons?promoterId=${rootId}&skip=${
      store.state.customers.skip
    }&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.fiscalCode
        ? // eslint-disable-next-line prefer-template
          '&fiscalCode=' + store.state.filter.fields.fiscalCode
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.birthday ? '&birthday=true' : ''
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerType &&
      store.state.filter.fields.customerType !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&customerType=' + store.state.filter.fields.customerType
        : ''
    }${
      store.state.filter.fields.customerStatus &&
      store.state.filter.fields.customerStatus !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.customerStatus
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${store.state.customers.sort.type ? `&sortBy=${store.state.customers.sort.type}` : ''}${
      store.state.customers.sort.type
        ? `&sortDirection=${store.state.customers.sort.directionASC ? '1' : '-1'}`
        : ''
    }`,
    receive: 'receiveCustomers',
  });

export const fetchPersonsDuplicated = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons?promoterId=${rootId}&skip=${
      store.state.customersDuplicated.skip
    }&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.fiscalCode
        ? // eslint-disable-next-line prefer-template
          '&fiscalCode=' + store.state.filter.fields.fiscalCode
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.birthday ? '&birthday=true' : ''
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerType &&
      store.state.filter.fields.customerType !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&customerType=' + store.state.filter.fields.customerType
        : ''
    }${
      store.state.filter.fields.customerStatus &&
      store.state.filter.fields.customerStatus !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.customerStatus
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.customersDuplicated.sort.type
        ? `&sortBy=${store.state.customersDuplicated.sort.type}`
        : ''
    }${
      store.state.customersDuplicated.sort.type
        ? `&sortDirection=${store.state.customersDuplicated.sort.directionASC ? '1' : '-1'}`
        : ''
    }`,
    receive: 'receiveCustomersDuplicated',
  });

export const fetchPersonsUnified = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-unified?promoterId=${rootId}&skip=${
      store.state.customers.skip
    }&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.birthday ? '&birthday=true' : ''
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerType &&
      store.state.filter.fields.customerType !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&customerType=' + store.state.filter.fields.customerType
        : ''
    }${
      store.state.filter.fields.customerStatus &&
      store.state.filter.fields.customerStatus !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.customerStatus
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${store.state.customers.sort.type ? `&sortBy=${store.state.customers.sort.type}` : ''}${
      store.state.customers.sort.type
        ? `&sortDirection=${store.state.customers.sort.directionASC ? '1' : '-1'}`
        : ''
    }`,
    receive: 'receiveCustomers',
  });

export const fetchPersonsSelect = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-select?${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }&skip=${store.state.customers.skip}&isCompany=false`,
    receive: 'receiveCustomers',
  });

export const fetchPersonsFilter = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-filter?${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.isFiscalCodeSearch ? '&isFiscalCodeSearch=true' : ''
    }&skip=${store.state.customers.skip}&isCompany=false`,
    receive: 'receiveCustomers',
  });

export const fetchPersonsSelectCompany = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-select?${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }&skip=${store.state.customers.skip}&isCompany=true`,
    receive: 'receiveCustomers',
  });

export const fetchPersonDocuments = (store, customerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-documents?customerId=${customerId}&skip=${store.state.personDocuments.skip}`,
    receive: 'receivePersonDocuments',
  });

export const deletePersonDocument = (store, { id }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-documents/${id}`,
    action: 'delete',
  });

export const savePersonDocument = (store, item) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-documents/${item.id}`,
    action: 'put',
    body: item,
  });

export const deletePersonPersons = (store, { id }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-persons/${id}`,
    action: 'delete',
  });

export const savePersonPersons = (store, item) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-persons`,
    action: 'put',
    body: item,
  });

export const savePersonPersonsLegal = (store, item) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-persons-legal`,
    action: 'put',
    body: item,
  });

export const fetchPersonPersons = (store, customerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-persons?customerId=${customerId}${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.lr ? '&lr=true' : ''
    }&skip=${store.state.personPersons.skip}`,
    receive: 'receivePersonPersons',
  });

export const fetchPersonRelations = (store, customerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-relations?customerId=${customerId}&skip=${store.state.personRelations.skip}`,
    receive: 'receivePersonRelations',
  });

export const savePersonCompanies = (store, item) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-companies`,
    action: 'put',
    body: item,
  });

export const deletePersonCompanies = (store, { id }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-companies/${id}`,
    action: 'delete',
  });

export const fetchPersonCompanies = (store, customerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-companies?customerId=${customerId}&skip=${store.state.personCompanies.skip}`,
    receive: 'receivePersonCompanies',
  });

export const fetchPersonDossiers = (store, options = {}) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons-dossiers?customerId=${options.customerId}&skip=${store.state.dossiers.skip}${
      // eslint-disable-next-line prefer-template
      options.promoterId ? '&promoterId=' + options.promoterId : ''
    }${
      // eslint-disable-next-line prefer-template
      options.practiceType ? '&practiceType=' + options.practiceType : ''
    }`,
    receive: options.skipReceive ? undefined : 'receiveDossiers',
  });

export const fetchCustomers = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customers?promoterId=${rootId}&skip=${
      store.state.customers.skip
    }&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.birthday ? '&birthday=true' : ''
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerType &&
      store.state.filter.fields.customerType !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&contactType=' + store.state.filter.fields.customerType
        : ''
    }${
      store.state.filter.fields.customerStatus &&
      store.state.filter.fields.customerStatus !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.customerStatus
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${store.state.customers.sort.type ? `&sortBy=${store.state.customers.sort.type}` : ''}${
      store.state.customers.sort.type
        ? `&sortDirection=${store.state.customers.sort.directionASC ? '1' : '-1'}`
        : ''
    }`,
    receive: 'receiveCustomers',
  });

export const fetchCustomersIdentityCards = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customers-identity-cards?promoterId=${rootId}&skip=${
      store.state.customers.skip
    }&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.birthday ? '&birthday=true' : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.expired ? '&expired=' + store.state.filter.fields.expired : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.complete ? '&complete=' + store.state.filter.fields.complete : ''
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerType &&
      store.state.filter.fields.customerType !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&contactType=' + store.state.filter.fields.customerType
        : ''
    }${
      store.state.filter.fields.customerStatus &&
      store.state.filter.fields.customerStatus !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.customerStatus
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${store.state.customers.sort.type ? `&sortBy=${store.state.customers.sort.type}` : ''}${
      store.state.customers.sort.type
        ? `&sortDirection=${store.state.customers.sort.directionASC ? '1' : '-1'}`
        : ''
    }`,
    receive: 'receiveCustomers',
  });

export const fetchAllCustomers = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customers-simple?skip=${
      store.state.customers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.type.searchCustomer
        ? `&fullTextSearch=${store.state.filter.type.searchCustomer}`
        : ''
    }${store.state.customers.sort.type ? `&sortBy=${store.state.customers.sort.type}` : ''}${
      store.state.customers.sort.type
        ? `&sortDirection=${store.state.customers.sort.directionASC ? '1' : '-1'}`
        : ''
    }&count=0`,
    request: 'resetCustomersSimple',
    receive: 'receiveAllCustomersSimple',
  });

export const fetchCustomerExport = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customers/export-customers?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.birthday ? '&birthday=true' : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.expired ? '&expired=' + store.state.filter.fields.expired : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.complete ? '&complete=' + store.state.filter.fields.complete : ''
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerType &&
      store.state.filter.fields.customerType !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&contactType=' + store.state.filter.fields.customerType
        : ''
    }${
      store.state.filter.fields.customerStatus &&
      store.state.filter.fields.customerStatus !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.customerStatus
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${store.state.customers.sort.type ? `&sortBy=${store.state.customers.sort.type}` : ''}${
      store.state.customers.sort.type
        ? `&sortDirection=${store.state.customers.sort.directionASC ? '1' : '-1'}`
        : ''
    }`,
    receive: 'receiveCustomerExportId',
    action: 'post',
  });

export const fetchCustomerExportIdentityCards = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customers/export-customers-identity-cards?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.birthday ? '&birthday=true' : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.expired ? '&expired=' + store.state.filter.fields.expired : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.complete ? '&complete=' + store.state.filter.fields.complete : ''
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerType &&
      store.state.filter.fields.customerType !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&contactType=' + store.state.filter.fields.customerType
        : ''
    }${
      store.state.filter.fields.customerStatus &&
      store.state.filter.fields.customerStatus !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.customerStatus
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${store.state.customers.sort.type ? `&sortBy=${store.state.customers.sort.type}` : ''}${
      store.state.customers.sort.type
        ? `&sortDirection=${store.state.customers.sort.directionASC ? '1' : '-1'}`
        : ''
    }`,
    receive: 'receiveCustomerExportId',
    action: 'post',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchCustomersSummary = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customers/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? // eslint-disable-next-line prefer-template
          '&searchCustomer=' + store.state.filter.fields.searchCustomer
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.birthday ? '&birthday=true' : ''
    }${
      store.state.filter.fields.customerType &&
      store.state.filter.fields.customerType !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&contactType=' + store.state.filter.fields.customerType
        : ''
    }${
      store.state.filter.fields.customerStatus &&
      store.state.filter.fields.customerStatus !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.customerStatus
        : ''
    }`,
    receive: 'receiveDossiersSummary',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchPersonsSummary = (store, options = {}) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons/summary?promoterId=${
      options.promoterId
    }&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.customerId
        ? // eslint-disable-next-line prefer-template
          '&customerId=' + store.state.filter.fields.customerId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? // eslint-disable-next-line prefer-template
          '&searchCustomer=' + store.state.filter.fields.searchCustomer
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.birthday ? '&birthday=true' : ''
    }${
      store.state.filter.fields.customerType &&
      store.state.filter.fields.customerType !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&customerType=' + store.state.filter.fields.customerType
        : ''
    }${
      store.state.filter.fields.customerStatus &&
      store.state.filter.fields.customerStatus !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.customerStatus
        : ''
    }${
      store.state.filter.fields.allPeriods
        ? // eslint-disable-next-line prefer-template
          '&allPeriods=true'
        : ''
    }${
      options.practiceStatus
        ? // eslint-disable-next-line prefer-template
          '&practiceStatus=' + options.practiceStatus
        : ''
    }`,
    receive: options.skipReceive ? undefined : 'receiveDossiersSummary',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchCustomersSummaryIdentityCards = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customers/summary-identity-cards?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? // eslint-disable-next-line prefer-template
          '&searchCustomer=' + store.state.filter.fields.searchCustomer
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.birthday ? '&birthday=true' : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.expired ? '&expired=' + store.state.filter.fields.expired : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.complete ? '&complete=' + store.state.filter.fields.complete : ''
    }${
      store.state.filter.fields.customerType &&
      store.state.filter.fields.customerType !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&contactType=' + store.state.filter.fields.customerType
        : ''
    }${
      store.state.filter.fields.customerStatus &&
      store.state.filter.fields.customerStatus !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.customerStatus
        : ''
    }`,
    receive: 'receiveDossiersSummary',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchCustomersSummaryPrevious = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customers/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.previousTime.year,
      store.state.filter.previousTime.month,
      store.state.filter.previousTime.quarter,
      store.state.filter.previousTime.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? // eslint-disable-next-line prefer-template
          '&searchCustomer=' + store.state.filter.fields.searchCustomer
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.birthday ? '&birthday=true' : ''
    }${
      store.state.filter.fields.customerType &&
      store.state.filter.fields.customerType !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&contactType=' + store.state.filter.fields.customerType
        : ''
    }${
      store.state.filter.fields.customerStatus &&
      store.state.filter.fields.customerStatus !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.customerStatus
        : ''
    }`,
    receive: 'receiveDossiersSummaryPrevious',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchPersonsSummaryPrevious = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/persons/summary?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.previousTime.year,
      store.state.filter.previousTime.month,
      store.state.filter.previousTime.quarter,
      store.state.filter.previousTime.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? // eslint-disable-next-line prefer-template
          '&searchCustomer=' + store.state.filter.fields.searchCustomer
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.birthday ? '&birthday=true' : ''
    }${
      store.state.filter.fields.customerType &&
      store.state.filter.fields.customerType !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&customerType=' + store.state.filter.fields.customerType
        : ''
    }${
      store.state.filter.fields.customerStatus &&
      store.state.filter.fields.customerStatus !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.customerStatus
        : ''
    }`,
    receive: 'receiveDossiersSummaryPrevious',
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchCustomersSummaryPreviousIdentityCards = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customers/summary-identity-cards?promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.previousTime.year,
      store.state.filter.previousTime.month,
      store.state.filter.previousTime.quarter,
      store.state.filter.previousTime.selected,
    )}${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? // eslint-disable-next-line prefer-template
          '&searchCustomer=' + store.state.filter.fields.searchCustomer
        : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.birthday ? '&birthday=true' : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.expired ? '&expired=' + store.state.filter.fields.expired : ''
    }${
      // eslint-disable-next-line prefer-template
      store.state.filter.fields.complete ? '&complete=' + store.state.filter.fields.complete : ''
    }${
      store.state.filter.fields.customerType &&
      store.state.filter.fields.customerType !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&contactType=' + store.state.filter.fields.customerType
        : ''
    }${
      store.state.filter.fields.customerStatus &&
      store.state.filter.fields.customerStatus !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.customerStatus
        : ''
    }`,
    receive: 'receiveDossiersSummaryPrevious',
  });

export const fetchContractsExcelReport = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/contracts/export?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveContractsExcelReport',
  });

export const fetchAdvisoryFeePromotersCsvReport = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/advisory-fee/export-csv-promoters-registry?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveAdvisoryFeePromotersCsvReport',
  });

export const fetchAdvisoryFeeInvoiceCsvReport = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/advisory-fee/export-csv-invoices?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveAdvisoryFeeInvoiceCsvReport',
  });

export const fetchProposalsExcelReport = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/proposals/export?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveProposalsExcelReport',
  });

export const fetchPackageExcelReport = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/package/export?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receivePackageExcelReport',
  });

export const fetchOverdueExcelReport = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/overdue/export?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveOverdueExcelReport',
  });

export const fetchProductionExcelReport = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/production/export?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveProductionExcelReport',
  });

export const fetchProductionSheltiaExcelReport = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/production/sheltia-export?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveCustomerExportId',
  });

export const fetchNegativeExcelReport = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/negative/export?skip=${
      store.state.dossiers.skip
    }&promoterId=${rootId}&${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.networkId
        ? // eslint-disable-next-line prefer-template
          '&networkId=' + store.state.filter.fields.networkId
        : ''
    }${
      store.state.filter.fields.searchCustomer
        ? `&searchCustomer=${store.state.filter.fields.searchCustomer}`
        : ''
    }${
      store.state.filter.fields.fullSearch
        ? `&fullSearch=${store.state.filter.fields.fullSearch}`
        : ''
    }${
      store.state.filter.fields.solarSearch
        ? `&solarSearch=${store.state.filter.fields.solarSearch}`
        : ''
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractSearch=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
        : ''
    }${
      store.state.filter.fields.status && store.state.filter.fields.status !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&status=' + store.state.filter.fields.status
        : ''
    }${
      store.state.filter.fields.company && store.state.filter.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filter.fields.company
        : ''
    }${
      store.state.filter.fields.product && store.state.filter.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filter.fields.product
        : ''
    }`,
    receive: 'receiveNegativeExcelReport',
  });

export const fetchPrecontractualList = (store, { time }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual-list/?time=${JSON.stringify(time)}`,
    receive: 'receivePrecontractualListResults',
  });

export const fetchPrecontractualSummary = (store, { time }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual-list/?time=${JSON.stringify(time)}&mode=summary`,
    receive: 'receivePrecontractualSummary',
  });

export const deletePrecontractual = (store, { id }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/precontractual/delete/${id}`,
  });
