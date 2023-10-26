import Vue from 'vue';

export const setInvoicingFilterYear = (state, year) => {
  state.filter = {
    fullTextSearch: state.filter.fullTextSearch,
    time: { ...state.filter.time, selected: 'year', year },
    type: { ...state.filter.type },
  };
};

export const setInvoicingFilterFullTextSearch = (state, fullTextSearch) => {
  state.filter = {
    fullTextSearch,
    time: { ...state.filter.time },
    type: { ...state.filter.type },
  };
};

export const setInvoicingFilterSelected = (state, selected) => {
  state.filter = {
    fullTextSearch: state.filter.fullTextSearch,
    time: { ...state.filter.time },
    type: { ...state.filter.type, selected },
  };
};

export const receiveInvoicings = (state, { items }) => {
  if (items && items.length !== 0) {
    state.invoicings.skip += 20;
    state.invoicings.items = [...state.invoicings.items, ...items];
    // TODO [>=2.0.0]: delete this when skip management is redy on API
    state.invoicings.lastRecord = true;
  } else {
    state.invoicings.lastRecord = true;
  }
};

export const receiveInvoices = (state, { items }) => {
  if (items && items.length !== 0) {
    state.invoices.skip += 20;
    state.invoices.items = [...state.invoices.items, ...items];
    // TODO [>=2.0.0]: delete this when skip management is redy on API
    state.invoices.lastRecord = true;
  } else {
    state.invoices.lastRecord = true;
  }
};

export const receiveInvoicesConfirmed = (state, { items }) => {
  if (items && items.length !== 0) {
    state.invoicesConfirmed.skip += 20;
    state.invoicesConfirmed.items = [...state.invoicesConfirmed.items, ...items];
    // TODO [>=2.0.0]: delete this when skip management is redy on API
    state.invoicesConfirmed.lastRecord = true;
  } else {
    state.invoicesConfirmed.lastRecord = true;
  }
};

export const receiveInvoicesUnconfirmed = (state, { items }) => {
  if (items && items.length !== 0) {
    state.invoicesUnconfirmed.skip += 20;
    state.invoicesUnconfirmed.items = [...state.invoicesUnconfirmed.items, ...items];
    // TODO [>=2.0.0]: delete this when skip management is redy on API
    state.invoicesUnconfirmed.lastRecord = true;
  } else {
    state.invoicesUnconfirmed.lastRecord = true;
  }
};

export const resetInvoices = (state) => {
  state.invoices.lastRecord = false;
  state.invoices.skip = 0;
  state.invoices.items = [];
};

export const resetInvoicesConfirmed = (state) => {
  state.invoicesConfirmed.lastRecord = false;
  state.invoicesConfirmed.skip = 0;
  state.invoicesConfirmed.items = [];
};

export const resetInvoicesUnconfirmed = (state) => {
  state.invoicesUnconfirmed.lastRecord = false;
  state.invoicesUnconfirmed.skip = 0;
  state.invoicesUnconfirmed.items = [];
};

export const resetInvoicings = (state) => {
  state.invoicings.lastRecord = false;
  state.invoicings.skip = 0;
  state.invoicings.items = [];
};

export const receiveInvoicing = (state, { item }) => {
  state.invoicing.item = { ...item };
};

export const receiveInvoice = (state, { item }) => {
  state.invoice.item = { ...item };
};

export const resetInvoicing = (state) => {
  state.invoicing.item = {};
};

export const receiveDocuments = (state, { items }) => {
  if (items && items.length !== 0) {
    state.documents.skip += 20;
    state.documents.items = [...state.documents.items, ...items];
    if (items.length < 20) state.documents.lastRecord = true;
  } else {
    state.documents.lastRecord = true;
  }
};

export const receivePreviewDocuments = (state, { items }) => {
  if (items && items.length !== 0) {
    state.previewDocuments.skip += 20;
    state.previewDocuments.items = [...state.previewDocuments.items, ...items];
    if (items.length < 20) state.previewDocuments.lastRecord = true;
  } else {
    state.previewDocuments.lastRecord = true;
  }
};

export const resetDocuments = (state) => {
  state.documents.lastRecord = false;
  state.documents.skip = 0;
  state.documents.items = [];
};

export const resetPreviewDocuments = (state) => {
  state.previewDocuments.lastRecord = false;
  state.previewDocuments.skip = 0;
  state.previewDocuments.items = [];
};

export const receivePromoterNotes = (state, { items }) => {
  state.notes.items = [...items];
};

export const setInvoiceConfirmedChecked = (state, { id, checked }) => {
  state.invoicesConfirmed.items.find((el) => el._id === id).checked = checked;
};

export const setInvoiceUnconfirmedChecked = (state, { id, checked }) => {
  state.invoicesUnconfirmed.items.find((el) => el._id === id).checked = checked;
};

export const setAllInvoiceChecked = (state, { checked, filter }) => {
  filter.forEach((el) => {
    el.checked = checked;
  });
  const newConfirmed = [...state.invoicesConfirmed.items];
  const newUnconfirmed = [...state.invoicesUnconfirmed.items];
  state.invoicesConfirmed.items = [];
  state.invoicesUnconfirmed.items = [];
  Vue.nextTick(() => {
    state.invoicesConfirmed.items = [...newConfirmed];
    state.invoicesUnconfirmed.items = [...newUnconfirmed];
  });
};

export const receiveNote = (state, item) => {
  state.note.item = { ...item };
};

export const receiveInvoicingReport = (state, { item }) => {
  state.report.item = { ...item };
};
