import Vue from 'vue';

const initialState = {
  survey: {},
  sections: [],
  results: [],
  extraQuestions: [],
  person: undefined,
  personRelated: undefined,
  signature: undefined,
  inquiryList: [],
  inquirySummary: {},
};

const actions = {
  fetchSections(store) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/survey/sections`,
      receive: 'receiveSections',
    });
  },
  fetchSurveyResults(store, { customerId, userId, type }) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/survey/result?${customerId ? `customerId=${customerId}` : ''}${
        userId ? `userId=${userId}` : ''
      }${type ? `&type=${type}` : ''}&count=0`,
      receive: 'receiveSurveyResults',
    });
  },
  fetchSurvey(store, { surveyId }) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/survey/${surveyId}`, // inquiry
      receive: 'receiveSurvey',
    });
  },
  fetchSingleSurveyResult(store, { resultId }) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/survey/result/${resultId}`,
      receive: 'receiveSingleSurveyResult',
    });
  },
  fetchSurveyExtraQuestions(store) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/survey/extra-questions`,
      receive: 'receiveSurveyExtraQuestions',
    });
  },
  saveSurvey(store, { survey, resultId, customerId, userId, practiceId, dossierId }) {
    const qs = new URLSearchParams({
      customerId,
      userId,
      practiceId,
      dossierId,
    });

    const path = resultId ? `/${resultId}` : '';

    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/survey/result${path}?${qs.toString()}`,
      action: 'put',
      body: survey,
      receive: 'receiveSurveyResultResponse',
    });
  },

  fetchPerson(store, personId) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/persons/${personId}`,
      receive: 'receivePerson',
    });
  },
  fetchPersonRelated(store, personId) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/persons/${personId}`,
      receive: 'receivePersonRelated',
    });
  },
  savePerson(store, person) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/persons`,
      action: 'put',
      body: { item: person },
      receive: 'receivePerson',
    });
  },
  signPdf(store, data) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/survey/sign-pdf/${data.resultId}`,
      action: 'post',
      body: data,
      receive: 'receiveSignature',
    });
  },
  updatePdfSignature(store, data) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/survey/update-pdf-signature/${data.resultId}`,
      action: 'post',
      body: data,
      receive: 'receiveSignature',
    });
  },
  storeMatchingProducts(store, data) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/survey/matching-products/${data.resultId}`,
      action: 'post',
      body: data,
    });
  },

  fetchInquirySurveyResults(store, { customerId, time }) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/survey/result/inquiry-list-new/${customerId || ''}?${
        time ? `time=${JSON.stringify(time)}` : ''
      }`,
      receive: 'receiveInquirySurveyResults',
    });
  },

  fetchInquirySurveySummary(store, { time }) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/survey/result/inquiry-list-new/?time=${JSON.stringify(time)}&mode=summary`,
      receive: 'receiveInquirySurveySummary',
    });
  },
  deleteSurvey(store, { surveyId }) {
    return Vue.prototype.$utils.getApiCall(store, {
      url: `/v1/survey/result/delete/${surveyId}`,
      action: 'delete',
    });
  },
};

const mutations = {
  receiveSurvey(state, data) {
    state.survey = data.item;
  },
  receiveSingleSurveyResult(state, data) {
    state.survey = data.item;
    state.signature = data.item.signature;
  },
  receiveSurveyExtraQuestions(state, data) {
    state.extraQuestions = data.items;
  },
  receiveSections(state, data) {
    state.sections = data.items;
  },
  receiveSurveyResults(state, data) {
    state.results = data.items;
  },
  receivePerson(state, { item }) {
    state.person = { ...item };
  },
  receivePersonRelated(state, { item }) {
    state.personRelated = { ...item };
  },
  receiveSurveyResultResponse(state, { item }) {
    state.survey = item;
  },
  receiveSignature(state, { item }) {
    state.signature = { ...item };
  },
  resetSurvey(state) {
    state.survey = {};
    state.person = undefined;
    state.signature = undefined;
  },
  receiveInquirySurveyResults(state, { items }) {
    state.inquiryList = items;
  },
  receiveInquirySurveySummary(state, { item }) {
    state.inquirySummary = item;
  },
  receiveDeleteSurvey(state, { item }) {
    state.recentDeletedSurvey = item;
  },
};

export default {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
};
