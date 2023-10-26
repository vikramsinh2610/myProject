import Vue from 'vue';

import constants from '../../constants';

export const receivePromoters = (state, { items }) => {
  if (items && items.length !== 0) {
    state.promoters.skip += 20;
    state.promoters.items = [...state.promoters.items, ...items];
  } else {
    state.promoters.lastRecord = true;
  }
};

export const receivePromoter = (state, { item }) => {
  state.promoter = { ...item };
};

export const receiveNetwork = (state, { items }) => {
  state.network.items = [...items];
};

export const receivePromoterCompanyProfile = (state, { item }) => {
  state.companyProfile = { ...item };
};

export const receivePromoterLetters = (state, { items }) => {
  state.letters.items = [...items];
  state.letters.lastRecord = true;

  state.letters.items.forEach((el) => {
    for (let i = 0; i < state.letters.items.length; i += 1) {
      // eslint-disable-next-line no-continue
      if (el._id === state.letters.items[i]._id) continue;
      if (
        el.status !== 'inactive' &&
        state.letters.items[i].status !== 'inactive' &&
        Vue.prototype.$utils.overlap(el, state.letters.items[i])
      ) {
        el.overlap = true;
        state.letters.items[i].overlap = true;
        break;
      }
    }
  });
};

export const receiveLetters = (state, { items }) => {
  if (items && items.length !== 0) {
    state.letters.skip += constants.skipDefault;
    state.letters.items = [...state.letters.items, ...items];
  } else {
    state.letters.lastRecord = true;
  }
};

export const receivePromoterLetter = (state, { item }) => {
  state.letter = { ...item };
};

export const receivePromoterLetterAttachments = (state, { items }) => {
  state.attachments.items = [...items];
};

export const resetPromoterLetterAttachments = (state) => {
  state.attachments.items = [];
};

export const receivePromoterDocuments = (state, { items }) => {
  if (items && items.length !== 0) {
    state.documents.skip += 20;
    state.documents.items = [...state.documents.items, ...items];
  } else {
    state.documents.lastRecord = true;
  }
};

export const resetPromoterDocuments = (state) => {
  state.documents.lastRecord = false;
  state.documents.skip = 0;
  state.documents.items = [];
};

export const receivePromoterInvoices = (state, { items }) => {
  if (items && items.length !== 0) {
    state.invoices.skip += 20;
    state.invoices.items = [...state.invoices.items, ...items];
    if (items.length < 20) state.invoices.lastRecord = true;
  } else {
    state.invoices.lastRecord = true;
  }
};

export const resetPromoterInvoices = (state) => {
  state.invoices.lastRecord = false;
  state.invoices.skip = 0;
  state.invoices.items = [];
};

export const resetPromoters = (state) => {
  state.promoters.lastRecord = false;
  state.promoters.skip = 0;
  state.promoters.items = [];
};

export const resetPromoterLetters = (state) => {
  state.letters.lastRecord = false;
  state.letters.skip = 0;
  state.letters.items = [];
};

export const setPromotersFilterYear = (state, year) => {
  state.filter = {
    time: { ...state.filter.time, selected: 'year', year },
    type: { ...state.filter.type },
  };
};

export const setPromotersFilterSelected = (state, selected) => {
  state.filter = {
    time: { ...state.filter.time },
    type: { ...state.filter.type, selected },
  };
};

export const resetPromoterLetter = (state) => {
  state.letter = {
    _id: '',
    type: '',
    status: '',
    promoterId: '',
    promoterSerialNumber: '',
    promoterDisplayName: '',
    description: '',
    signatureDate: '',
  };
};

export const receivePromoterLetterSettings = (state, { item }) => {
  state.letterSettings.types = { ...item.types };
};

export const setPromotersChecked = (state, { id, checked }) => {
  state.promoters.items.find((el) => el._id === id).checked = checked;
};

export const setPromotersCheckedAll = (state, { checked }) => {
  state.promoters.items.forEach((el) => {
    el.checked = checked;
  });

  const newPromoters = [...state.promoters.items];
  state.promoters.items = [];
  Vue.nextTick(() => {
    state.promoters.items = [...newPromoters];
  });
};

export const resetRoles = (state) => {
  state.roles.items = [];
};

export const receiveRoles = (state, { items }) => {
  state.roles.items = [...items];
};

export const receiveAllPromoters = (state, { items }) => {
  state.promoters.items = [...items];
  state.promoters.lastRecord = true;
};

export const resetcopyStatus = (state) => {
  state.copyStatus.items = [];
};

export const receiveCopyStatus = (state, { items }) => {
  state.copyStatus.items = [...items];
};

export const receiveLetterTypes = (state, { items = [] }) => {
  state.letters.types = [...items];
};

export const setLettersFilterType = (state, type) => {
  state.letters.filter = { ...state.letters.filter, type };
};

export const setLettersFilterPromoter = (state, promoterDisplayName) => {
  state.letters.filter = { ...state.letters.filter, promoterDisplayName };
};

export const setLetterSorting = (state, field) => {
  let direction = constants.lettersSortDefault.directionASC;
  if (state.letters.sort.type === field) direction = !state.letters.sort.directionASC;
  state.letters.sort = { ...state.letters.sort, type: field, directionASC: direction };
};

export const setPromotersSorting = (state, field) => {
  let direction = constants.promotersSortDefault.directionASC;
  if (state.promoters.sort.type === field) direction = !state.promoters.sort.directionASC;
  state.promoters.sort = { ...state.promoters.sort, type: field, directionASC: direction };
};

export const setPromoterFilterRoleType = (state, roleType) => {
  state.filter = {
    time: { ...state.filter.time },
    type: { ...state.filter.type, roleType },
  };
};

export const setPromoterFilterSearch = (state, searchPromoter) => {
  state.filter = {
    time: { ...state.filter.time },
    type: { ...state.filter.type, searchPromoter },
  };
};

export const resetPromoterSearch = (state) => {
  state.filter = {
    time: {
      selected: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      quarter: 1,
    },
    type: {
      selected: 'all',
      searchPromoter: '',
      roleType: constants.noSelection,
    },
  };
};

export const receivePromoterTarget = (state, { item }) => {
  state.targets.item = item;
};

export const receivePromoterTargets = (state, { items }) => {
  state.targets.items = items;
};

export const receiveNoteTypes = (state, { items }) => {
  state.noteTypes.items = items;
};

export const receivePromotersExcelReport = (state, { item }) => {
  state.report.item = { ...item };
};
export const receiveBranch = (state, { item }) => {
  state.branch = { ...item };
};
