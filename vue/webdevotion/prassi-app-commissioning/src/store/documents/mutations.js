export const receiveDocument = (state, { item }) => {
  state.document.item = { ...item };
};

export const resetDocument = (state) => {
  state.document.item = {};
};

export const changeExportInProgressState = (state, active) => {
  state.exportInProgress = active;
};

export const changeExportCompletedState = (state, active) => {
  state.exportCompleted = active;
};

export const receiveExportId = (state, { item }) => {
  state.exportId = item.exportId;
};
