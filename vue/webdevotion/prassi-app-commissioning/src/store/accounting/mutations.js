export const setAccountingFilterDate = (state, filter) => {
  state.filter = {
    time: { ...state.filter.time, ...filter },
    type: { ...state.filter.type },
    fields: { ...state.filter.fields },
  };
};

export const setAccountingFilterSelected = (state, selected) => {
  state.filter = {
    time: { ...state.filter.time },
    type: { ...state.filter.type, selected },
    fields: { ...state.filter.fields },
  };
};

export const setAccountingFilterFields = (state, fields) => {
  state.filter = {
    time: { ...state.filter.time },
    type: { ...state.filter.type },
    fields: { ...fields },
  };
};

export const receiveTransactions = (state, { _meta, items }) => {
  state.summary.margin = _meta.currentMargin;
  state.summary.previousMargin = _meta.previousMargin;
  state.summary.percentageMargin = Math.round(_meta.varMarginPercentage / 100);
  state.summary.in = _meta.currentIncome;
  state.summary.previousIn = _meta.previousIncome;
  state.summary.percentageIn = Math.round(_meta.varIncomePercentage / 100);
  state.summary.out = _meta.currentOutcome;
  state.summary.previousOut = _meta.previousOutcome;
  state.summary.percentageOut = Math.round(_meta.varOutcomePercentage / 100);
  state.summary.transactions = _meta.currentCount;
  state.summary.previousTransactions = _meta.previousCount;
  state.summary.percentageTransactions = Math.round(_meta.varCountPercentage / 100);

  if (items && items.length !== 0) {
    state.transactions.skip += 20;
    state.transactions.items = [...state.transactions.items, ...items];
  } else {
    state.transactions.lastRecord = true;
  }
};

export const resetTransactions = (state) => {
  state.transactions.lastRecord = false;
  state.transactions.skip = 0;
  state.transactions.items = [];
};

export const receiveTransaction = (state, { item }) => {
  state.transaction.item = { ...item };
};

export const resetTransaction = (state) => {
  state.transaction.item = {};
};

export const receiveProducts = (state, { items }) => {
  state.products.items = [...items];
};

export const receiveInstallments = (state, { items }) => {
  if (items && items.length !== 0) {
    state.installments.skip += 20;
    state.installments.items = [...state.installments.items, ...items];
  } else {
    state.installments.lastRecord = true;
  }
};

export const resetInstallments = (state) => {
  state.installments.lastRecord = false;
  state.installments.skip = 0;
  state.installments.items = [];
};

export const setAccountingFilterFieldsOverdue = (state, fields) => {
  state.filterOverdue = {
    fields: { ...fields },
  };
};

export const receiveTransactionsForecast = (state, { _meta, items }) => {
  state.summaryForecast.margin = _meta.currentMargin;
  state.summaryForecast.previousMargin = _meta.previousMargin;
  state.summaryForecast.percentageMargin = Math.round(_meta.varMarginPercentage / 100);
  state.summaryForecast.in = _meta.currentIncome;
  state.summaryForecast.previousIn = _meta.previousIncome;
  state.summaryForecast.percentageIn = Math.round(_meta.varIncomePercentage / 100);
  state.summaryForecast.out = _meta.currentOutcome;
  state.summaryForecast.previousOut = _meta.previousOutcome;
  state.summaryForecast.percentageOut = Math.round(_meta.varOutcomePercentage / 100);
  state.summaryForecast.transactions = _meta.currentCount;
  state.summaryForecast.previousTransactions = _meta.previousCount;
  state.summaryForecast.percentageTransactions = Math.round(_meta.varCountPercentage / 100);

  if (items && items.length !== 0) {
    state.transactionsForecast.skip += 20;
    state.transactionsForecast.items = [...state.transactionsForecast.items, ...items];
  } else {
    state.transactionsForecast.lastRecord = true;
  }
};

export const resetTransactionsForecast = (state) => {
  state.transactionsForecast.lastRecord = false;
  state.transactionsForecast.skip = 0;
  state.transactionsForecast.items = [];
};

export const setAccountingFilterDateForecast = (state, filter) => {
  state.filterForecast = {
    time: { ...state.filterForecast.time, ...filter },
    type: { ...state.filterForecast.type },
    fields: { ...state.filterForecast.fields },
  };
};

export const setAccountingFilterSelectedForecast = (state, selected) => {
  state.filterForecast = {
    time: { ...state.filterForecast.time },
    type: { ...state.filterForecast.type, selected },
    fields: { ...state.filterForecast.fields },
  };
};

export const setAccountingFilterFieldsForecast = (state, fields) => {
  state.filterForecast = {
    time: { ...state.filterForecast.time },
    type: { ...state.filterForecast.type },
    fields: { ...fields },
  };
};
