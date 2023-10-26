import Vue from 'vue';

export const fetchProposalsSummary = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/proposals/summary?promoterId=${rootId}&year=${store.state.filter.time.year}`,
    receive: 'receiveProposalsSummary',
  });

export const fetchProposalsDirect = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/proposals?promoterId=${rootId}&skip=${store.state.direct.skip}`,
    receive: 'receiveProposalsDirect',
  });

export const fetchProposalsIndirect = (store, rootId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/proposals/promoters/${rootId}`,
    receive: 'receiveProposalsIndirect',
  });

export const fetchProposalsIndirectItems = (store, promoterId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/proposals?promoterId=${promoterId}`,
    receive: 'receiveProposalsIndirectItems',
  });
