import Vue from 'vue';

export const fetchTransactions = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/transactions?${Vue.prototype.$utils.calcPeriodString(
      store.state.filter.time.year,
      store.state.filter.time.month,
      store.state.filter.time.quarter,
      store.state.filter.time.selected,
    )}&skip=${store.state.transactions.skip}${
      // eslint-disable-next-line prefer-template
      store.state.filter.type.selected === 'all' ? '' : '&type=' + store.state.filter.type.selected
    }${
      store.state.filter.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractId=' + store.state.filter.fields.searchContract
        : ''
    }${
      store.state.filter.fields.type && store.state.filter.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filter.fields.type
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
    receive: 'receiveTransactions',
  });

export const fetchTransaction = (store, transactionId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/transactions/${transactionId}`,
    receive: 'receiveTransaction',
  });

export const fetchAllProducts = (store, companyId) =>
  Vue.prototype.$utils.getApiCallList(store, {
    url: `/v1/products${
      companyId && companyId !== 'no-selection' ? `?companyId=${companyId}` : ''
    }`,
    receive: 'receiveProducts',
  });

export const fetchTransactionsForecast = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/countability/forecast?${Vue.prototype.$utils.calcPeriodString(
      store.state.filterForecast.time.year,
      store.state.filterForecast.time.month,
      store.state.filterForecast.time.quarter,
      store.state.filterForecast.time.selected,
    )}&skip=${store.state.transactionsForecast.skip}${
      store.state.filterForecast.type.selected === 'all'
        ? ''
        : // eslint-disable-next-line prefer-template
          '&type=' + store.state.filterForecast.type.selected
    }${
      store.state.filterForecast.fields.searchContract
        ? // eslint-disable-next-line prefer-template
          '&contractId=' + store.state.filterForecast.fields.searchContract
        : ''
    }${
      store.state.filterForecast.fields.type &&
      store.state.filterForecast.fields.type !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&commissionType=' + store.state.filterForecast.fields.type
        : ''
    }${
      store.state.filterForecast.fields.company &&
      store.state.filterForecast.fields.company !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&companyId=' + store.state.filterForecast.fields.company
        : ''
    }${
      store.state.filterForecast.fields.product &&
      store.state.filterForecast.fields.product !== 'no-selection'
        ? // eslint-disable-next-line prefer-template
          '&productId=' + store.state.filterForecast.fields.product
        : ''
    }`,
    receive: 'receiveTransactionsForecast',
  });
