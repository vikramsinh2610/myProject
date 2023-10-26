export const receiveAcquittances = (state, { items }) => {
  if (items && items.length !== 0) {
    state.acquittances.skip += 20;
    state.acquittances.items = [...state.acquittances.items, ...items];
    if (items.length < 20) state.acquittances.lastRecord = true;
  } else {
    state.acquittances.lastRecord = true;
  }
};

export const resetAcquittances = (state) => {
  state.acquittances.lastRecord = false;
  state.acquittances.skip = 0;
  state.acquittances.items = [];
};

export const receiveAcquittance = (state, { item }) => {
  state.acquittance.item = { ...item };
};

export const resetAcquittance = (state) => {
  state.acquittance.item = {};
};

export const receiveAcquittanceReport = (state, { item }) => {
  state.report.item = { ...item };
};

export const receiveCompanies = (state, { items }) => {
  state.companies.items = [...items];
};

export const receiveSignedUrl = (state, { item }) => {
  state.signedUrl.item = { ...item };
};
