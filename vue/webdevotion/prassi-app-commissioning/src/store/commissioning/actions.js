import Vue from 'vue';
import constants from '../../constants';

export const fetchCommissionings = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: '/v1/commissioning',
    receive: 'receiveCommissionings',
  });

export const fetchCommissioning = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}`,
    receive: 'receiveCommissioning',
  });

export const openCommissioning = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}`,
    action: 'put',
    receive: 'receiveCommissioning',
  });

export const fetchInstallmentsPurchase = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/installments-pg?types=purchase,advance`,
    receive: 'receiveInstallmentsPurchase',
  });

export const fetchInstallmentsCashIn = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/installments-pg?types=cash-in`,
    receive: 'receiveInstallmentsCashIn',
  });

export const fetchInstallmentsIncluded = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/installments-pg?filterByIncluded=true`,
    receive: 'receiveInstallmentsIncluded',
  });

export const fetchTotalNetwork = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/result`,
    receive: 'receiveTotalNetwork',
  });

export const fetchMFees = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/management-fees`,
    receive: 'receiveMFees',
  });

export const setCommissioningConfirm = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/confirm`,
    action: 'post',
    receive: 'receiveCommissioning',
  });

export const setCommissioningReopen = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/reopen`,
    action: 'post',
    receive: 'receiveCommissioning',
  });

export const setCommissioningReopenError = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/reopenerror`,
    action: 'post',
    receive: 'receiveCommissioning',
  });

export const setCommissioningReset = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/reset`,
    action: 'post',
    receive: 'receiveCommissioning',
  });

export const setCommissioningRollback = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/rollback`,
    action: 'post',
    receive: 'receiveCommissioning',
  });

export const setCommissioningRollbackClose = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/rollback-close`,
    action: 'post',
    receive: 'receiveCommissioning',
  });

export const setCommissioningClose = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/close`,
    action: 'post',
    receive: 'receiveCommissioning',
  });

export const addSelectedInstallments = (store, { id, filter }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${id}/add-installment`,
    action: 'post',
    body: filter
      .filter((el) => el.checked)
      .map(({ practiceId, dossierId, installment }) => ({
        practiceId,
        dossierId,
        installment,
      })),
  });

export const removeSelectedInstallments = (store, { id, filter }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${id}/remove-installment`,
    action: 'post',
    body: filter
      .filter((el) => el.checked)
      // eslint-disable-next-line sonarjs/no-identical-functions
      .map(({ practiceId, dossierId, installment }) => ({
        practiceId,
        dossierId,
        installment,
      })),
  });

export const fetchResultExcelInstallmentsReport = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/result-excel-installments-report`,
    receive: 'receiveExportId',
    action: 'post',
  });

export const fetchResultExcelReport = (store, commissioningId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/result-excel-report`,
    receive: 'receiveExportId',
    action: 'post',
  });

export const fetchLogEvents = (store, { commissioningId, invoicingId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/log-events?commissioningId=${commissioningId}&invoicingId=${invoicingId}&skip=
    ${store.state.logEvents.skip}&count=${constants.skipDefault}`,
    receive: 'receiveLogEvents',
  });

export const fetchSyncPractice = (store, { commissioningId, override }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/${commissioningId}/sync?override=${override}`,
    action: 'post',
  });

export const fetchSyncPracticeSingle = (store, { practiceId, override, productivePeriod }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/practices/${practiceId}?productivePeriod=${productivePeriod}&override=${override}`,
    action: 'put',
  });

export const fetchSyncContractSingle = (store, { contractId, override, productivePeriod }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/commissioning/contracts/${contractId}?productivePeriod=${productivePeriod}&override=${override}`,
    action: 'put',
  });
