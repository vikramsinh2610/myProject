import Vue from 'vue';

export const setCommissioningFilterYear = (state, year) => {
  state.filter = {
    time: { ...state.filter.time, selected: 'year', year },
    type: { ...state.filter.type },
  };
};

export const setCommissioningFilterSelected = (state, selected) => {
  state.filter = {
    time: { ...state.filter.time },
    type: { ...state.filter.type, selected },
  };
};

export const receiveCommissionings = (state, { items }) => {
  state.commissionings.items = [...items];
};

export const resetCommissionings = (state) => {
  state.commissionings.items = [];
};

export const receiveCommissioning = (state, { item }) => {
  state.commissioning.item = { ...item };
};

export const resetCommissioning = (state) => {
  state.commissioning.item = {};
};

export const receiveInstallmentsPurchase = (state, { items }) => {
  state.installmentsPurchase.items = [...items];
};

export const resetInstallmentsPurchase = (state) => {
  state.installmentsPurchase.items = [];
};

export const receiveInstallmentsCashIn = (state, { items }) => {
  state.installmentsCashIn.items = [...items];
};

export const receiveInstallmentsIncluded = (state, { items }) => {
  state.installmentsIncluded.items = [...items];
};

export const receiveTotalNetwork = (state, { items }) => {
  state.totalNetwork.items = [...items];
};

export const receiveMFees = (state, { items }) => {
  state.mfees.items = [...items];
};

export const resetTotalNetwork = (state) => {
  state.totalNetwork.items = [];
};

export const resetInstallmentsCashIn = (state) => {
  state.installmentsCashIn.items = [];
};

export const setInstallmentsPurchaseChecked = (state, { id, checked }) => {
  const element = state.installmentsPurchase.items.find((el) => el._id === id);
  element.checked = checked;

  if (Vue.prototype.$env.edition === 'sheltia' && element.type === 'purchase') {
    state.installmentsPurchase.items
      .filter((el) => el.practiceId === element.practiceId && el.type === 'advance')
      .forEach((elFiltered) => {
        elFiltered.checked = checked;
      });
  }
};

export const setAllInstallmentsPurchaseChecked = (state, { checked, filter }) => {
  filter.forEach((el) => {
    el.checked = checked;
  });
  const newInstallments = [...state.installmentsPurchase.items];
  state.installmentsPurchase.items = [];
  Vue.nextTick(() => {
    state.installmentsPurchase.items = [...newInstallments];
  });
};

export const setInstallmentsCashInChecked = (state, { id, checked }) => {
  state.installmentsCashIn.items.find((el) => el._id === id).checked = checked;
};

export const setAllInstallmentsCashInChecked = (state, { checked, filter }) => {
  filter.forEach((el) => {
    el.checked = checked;
  });
  const newInstallments = [...state.installmentsCashIn.items];
  state.installmentsCashIn.items = [];
  Vue.nextTick(() => {
    state.installmentsCashIn.items = [...newInstallments];
  });
};

export const receiveCommissioningReport = (state, { item }) => {
  state.report.item = { ...item };
};

export const receiveLogEvents = (state, { items }) => {
  if (items && items.length !== 0) {
    state.logEvents.skip += 20;
    state.logEvents.items = [...state.logEvents.items, ...items];
    if (items.length < 20) state.logEvents.lastRecord = true;
  } else {
    state.logEvents.lastRecord = true;
  }
};

export const resetLogEvents = (state) => {
  state.logEvents.lastRecord = false;
  state.logEvents.skip = 0;
  state.logEvents.items = [];
};

export const receiveExportId = (state, { item }) => {
  state.exportId = item.exportId;
};
