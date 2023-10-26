import Vue from 'vue';

export const fetchAcquittances = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/acquittances?skip=${store.state.acquittances.skip}`,
    receive: 'receiveAcquittances',
  });

export const fetchAcquittance = (store, acquittancesId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/acquittances/${acquittancesId}`,
    receive: 'receiveAcquittance',
  });

export const refreshAcquittance = (store, acquittancesId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/acquittances/${acquittancesId}/refresh`,
    receive: 'receiveAcquittance',
    action: 'post',
  });

export const confirmAcquittance = (store, acquittancesId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/acquittances/${acquittancesId}/confirm`,
    receive: 'receiveAcquittance',
    action: 'post',
  });

export const unconfirmAcquittance = (store, acquittancesId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/acquittances/${acquittancesId}/unconfirm`,
    receive: 'receiveAcquittance',
    action: 'post',
  });

export const fetchAllCompanies = (store) =>
  Vue.prototype.$utils.getApiCallList(store, {
    url: '/v1/companies',
    receive: 'receiveCompanies',
  });

export const fetchCompanySignedUrl = (store, companyId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/companies/${companyId}/acquittances/presigned-upload`,
    receive: 'receiveSignedUrl',
  });

export const addAcquittance = (store, { companyId, documentId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/companies/${companyId}/acquittances/${documentId}`,
    action: 'put',
  });

export const fetchAcquittanceReport = (store, acquittancesId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/acquittances/${acquittancesId}/create-report`,
    receive: 'receiveAcquittanceReport',
    action: 'post',
  });

export const deleteAcquittance = (store, acquittancesId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/acquittances/${acquittancesId}/delete`,
    action: 'post',
  });

export const updateAcquittance = (store, { acquittancesId, payment }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/acquittances/${acquittancesId}/update`,
    action: 'post',
    body: payment,
    receive: 'receiveAcquittance',
  });

export const updateAcquittanceSelectExcelValue = (store, { acquittancesId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/acquittances/${acquittancesId}/select-excel-value`,
    action: 'post',
    receive: 'receiveAcquittance',
  });

export const updateAcquittanceSelectCalculatedValue = (store, { acquittancesId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/acquittances/${acquittancesId}/select-calculated-value`,
    action: 'post',
    receive: 'receiveAcquittance',
  });
