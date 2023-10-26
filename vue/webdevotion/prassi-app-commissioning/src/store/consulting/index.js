import Vue from 'vue';

const initialState = {
  result: undefined,
  adequacyResultId: undefined,
  list: [], // all documents by customer (dashboard)
  consultingList: [], // all documents (global)
  consultingSummary: {},
};

// TODO
const api = (...args) => Vue.prototype.$utils.getApiCall(...args);

// const api = async (...args) => {
//   const orig = Vue.prototype.$env.apiUrl;
//   Vue.prototype.$env.apiUrl = `http://localhost:3001`;
//   const res = await Vue.prototype.$utils.getApiCall(...args);
//   Vue.prototype.$env.apiUrl = orig;
//   return res;
// };

const actions = {
  fetchResult(store, { resultId }) {
    return api(store, {
      url: `/v1/consulting/${resultId}`,
      receive: 'receiveResult',
    });
  },

  fetchList(store, { customerId }) {
    return api(store, {
      url: `/v1/consulting/list/${customerId}`,
      receive: 'receiveList',
    });
  },

  storeResult(store, { resultId, data }) {
    return api(store, {
      url: `/v1/consulting/${resultId}`,
      action: 'put',
      body: data,
      receive: 'receiveResult',
    });
  },

  createPdf(store, { resultId, customer, promoter, thirdPayer }) {
    return api(store, {
      url: `/v1/consulting/${resultId}/create-pdf`,
      action: 'put',
      body: { customer, promoter, thirdPayer },
      receive: 'receiveResult',
    });
  },

  updatePdfSignature(store, { resultId, signature }) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/consulting/${resultId}/update-pdf-signature`,
      action: 'post',
      body: { signature },
      receive: 'receiveResult',
    });
  },

  fetchConsultingResults(store, { time }) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/consulting-list?${time ? `time=${JSON.stringify(time)}` : ''}`,
      receive: 'receiveConsultingResults',
    });
  },

  fetchConsultingSummary(store, { time }) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/consulting-list/?time=${JSON.stringify(time)}&mode=summary`,
      receive: 'receiveConsultingSummary',
    });
  },
  deleteConsulting(store, { id }) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/consulting/delete/${id}`,
    });
  },
};

const mutations = {
  receiveResult(state, data) {
    state.result = data.item;
  },
  receiveList(state, data) {
    state.list = data.items;
  },
  setAdequacySurveyResultId(state, resultId) {
    state.adequacyResultId = resultId;
  },
  receiveConsultingResults(state, { items }) {
    state.consultingList = items;
  },
  receiveConsultingSummary(state, { item }) {
    state.consultingSummary = item;
  },
};

export default {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
};
