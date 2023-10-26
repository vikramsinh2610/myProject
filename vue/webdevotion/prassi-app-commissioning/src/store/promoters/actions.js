import Vue from 'vue';
import constants from '../../constants';

export const fetchPromoters = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters?skip=${store.state.promoters.skip}${
      store.state.filter.type.searchPromoter
        ? `&fullTextSearch=${store.state.filter.type.searchPromoter}`
        : ''
    }${
      store.state.filter.type.roleType && store.state.filter.type.roleType !== constants.noSelection
        ? `&roleId=${store.state.filter.type.roleType}`
        : ''
    }${store.state.promoters.sort.type ? `&sortBy=${store.state.promoters.sort.type}` : ''}${
      store.state.promoters.sort.type
        ? `&sortDirection=${store.state.promoters.sort.directionASC ? '1' : '-1'}`
        : ''
    }`,
    receive: 'receivePromoters',
  });

export const fetchNetwork = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/network/list`,
    receive: 'receiveNetwork',
  });

export const fetchNetworkPeriod = (store, { month, year, quarter, selected }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/network/list-period?${Vue.prototype.$utils.calcPeriodString(
      year,
      month,
      quarter,
      selected,
    )}`,
    receive: 'receiveNetwork',
  });

export const fetchAllPromoters = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters?skip=${store.state.promoters.skip}${
      store.state.filter.type.searchPromoter
        ? `&fullTextSearch=${store.state.filter.type.searchPromoter}`
        : ''
    }${
      store.state.filter.type.roleType && store.state.filter.type.roleType !== constants.noSelection
        ? `&roleId=${store.state.filter.type.roleType}`
        : ''
    }${store.state.promoters.sort.type ? `&sortBy=${store.state.promoters.sort.type}` : ''}${
      store.state.promoters.sort.type
        ? `&sortDirection=${store.state.promoters.sort.directionASC ? '1' : '-1'}`
        : ''
    }&count=0`,
    request: 'resetPromoters',
    receive: 'receiveAllPromoters',
  });

export const fetchAllPromotersPeriod = (store, { month, year, quarter, selected, networkId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/period?skip=${store.state.promoters.skip}${
      networkId ? `&networkId=${networkId}` : ''
    }${
      store.state.filter.type.searchPromoter
        ? `&fullTextSearch=${store.state.filter.type.searchPromoter}`
        : ''
    }&${Vue.prototype.$utils.calcPeriodString(year, month, quarter, selected)}${
      store.state.filter.type.roleType && store.state.filter.type.roleType !== constants.noSelection
        ? `&roleId=${store.state.filter.type.roleType}`
        : ''
    }${store.state.promoters.sort.type ? `&sortBy=${store.state.promoters.sort.type}` : ''}${
      store.state.promoters.sort.type
        ? `&sortDirection=${store.state.promoters.sort.directionASC ? '1' : '-1'}`
        : ''
    }&count=0`,
    request: 'resetPromoters',
    receive: 'receiveAllPromoters',
  });

export const fetchPromoter = (store, promoterId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}`,
    receive: 'receivePromoter',
  });

export const fetchPromoterCompanyProfile = (store, promoterId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/company-profile`,
    receive: 'receivePromoterCompanyProfile',
  });

export const fetchPromoterLetters = (store, promoterId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/letters`,
    receive: 'receivePromoterLetters',
  });

export const fetchPromoterLetter = (store, { promoterId, letterId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/letters/${letterId}`,
    receive: 'receivePromoterLetter',
  });

export const fetchPromoterLetterAttachments = (store, { promoterId, letterId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/letters/${letterId}/attachments`,
    receive: 'receivePromoterLetterAttachments',
  });

export const fetchPromoterDocuments = (store, { promoterId, types }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/documents?skip=${store.state.documents.skip}${
      types
        ? // eslint-disable-next-line prefer-template
          '&types=' + types
        : ''
    }`,
    receive: 'receivePromoterDocuments',
  });

export const fetchPromoterDownloads = (store, { promoterId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/downloads?skip=${store.state.documents.skip}`,
    receive: 'receivePromoterDocuments',
  });

export const fetchPromoterInvoices = (store, { promoterId, year, month }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/invoices?skip=${store.state.invoices.skip}${
      year
        ? // eslint-disable-next-line prefer-template
          '&productivePeriodYear=' + year
        : ''
    }${
      month
        ? // eslint-disable-next-line prefer-template
          '&productivePeriodMonth=' + month
        : ''
    }`,
    receive: 'receivePromoterInvoices',
  });

export const deleteDocument = (store, id) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/documents/${id}`,
    action: 'delete',
  });

export const savePromoterCompanyProfile = (store, { promoterId, body }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/company-profile`,
    action: 'patch',
    body,
  });

export const createPromoterLetter = (store, promoterId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/letters`,
    action: 'post',
    receive: 'receivePromoterLetter',
  });

export const savePromoterLetter = (store, { promoterId, letterId, body }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/letters/${letterId}`,
    action: 'patch',
    body,
    receive: 'receivePromoterLetter',
  });

export const savePromoterLetterAttachment = (
  store,
  // eslint-disable-next-line object-curly-newline
  { promoterId, letterId, type, attachmentId, displayName },
) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/letters/${letterId}/attachments/${attachmentId}?letterType=${type}&attachmentName=${displayName}`,
    action: 'put',
  });

export const fetchPromoterLetterSettings = (store, promoterId) =>
  Vue.prototype.$utils.getApiCallList(store, {
    url: `/v1/promoters/${promoterId}/letters/settings`,
    receive: 'receivePromoterLetterSettings',
  });

export const activatePromoterLetter = (store, { promoterId, letterId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/letters/${letterId}/active`,
    action: 'post',
    receive: 'receivePromoterLetter',
  });

export const deletePromoterLetter = (store, { promoterId, letterId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/letters/${letterId}/delete`,
    action: 'post',
  });

export const disablePromoterLetter = (store, { promoterId, letterId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/letters/${letterId}/inactivate`,
    action: 'post',
    receive: 'receivePromoterLetter',
  });

export const fetchLetters = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/letters?skip=${store.state.letters.skip}&count=${constants.skipDefault}${
      store.state.letters.filter.promoterDisplayName
        ? `&promoterDisplayName=${store.state.letters.filter.promoterDisplayName}`
        : ''
    }${
      store.state.letters.filter.type && store.state.letters.filter.type !== constants.noSelection
        ? `&type=${store.state.letters.filter.type}`
        : ''
    }${store.state.letters.sort.type ? `&sortBy=${store.state.letters.sort.type}` : ''}${
      store.state.letters.sort.type
        ? `&sortDirection=${store.state.letters.sort.directionASC ? '1' : '-1'}`
        : ''
    }`,
    receive: 'receiveLetters',
  });

export const fetchLetterTypes = (store) =>
  Vue.prototype.$utils.getApiCallList(store, {
    url: `/v1/letters/types`,
    receive: 'receiveLetterTypes',
  });

export const fetchAllLetters = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: '/v1/letters',
    receive: 'receivePromoterLetters',
  });

export const copyPromoterLetter = (store, { promoterId, letterId, body, activate }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/letters/${letterId}/copy?activate=${activate}`,
    action: 'post',
    body,
    receive: 'receiveCopyStatus',
  });

export const fetchRoles = (store) =>
  Vue.prototype.$utils.getApiCallList(store, {
    url: `/v1/promoters/roleIds`,
    receive: 'receiveRoles',
  });

export const fetchPromoterTarget = (
  store,
  { promoterId, productivePeriodYear, productivePeriodMonth },
) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/targets?productivePeriodYear=${productivePeriodYear}&productivePeriodMonth=${productivePeriodMonth}`,
    receive: 'receivePromoterTarget',
  });

export const fetchPromoterTargets = (store, { promoterId, productivePeriodYear }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/targets/${productivePeriodYear}`,
    receive: 'receivePromoterTargets',
  });

export const savePromoterTarget = (store, { promoterId, body }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/targets`,
    action: 'post',
    body,
  });

export const savePromoterTargets = (store, { promoterId, body, year }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/targets/${year}`,
    action: 'put',
    body,
  });

export const fetchNoteTypes = (store) =>
  Vue.prototype.$utils.getApiCallList(store, {
    url: `/v1/promoters/accounting-notes/list-types`,
    receive: 'receiveNoteTypes',
  });

export const fetchPromotersExcelReport = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/promoters-excel-report`,
    receive: 'receivePromotersExcelReport',
    action: 'post',
  });

export const fetchBranch = (store, promoterId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/branches`,
    receive: 'receiveBranch',
  });
