/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import constants from '../../constants';

export const fetchPromoters = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters?skip=${store.state.promoters.skip}${
      store.state.filterPromoters.searchText
        ? `&fullTextSearch=${store.state.filterPromoters.searchText}`
        : ''
    }`,
    receive: 'receivePromoterConfigurations',
  });

export const fetchPromoter = (store, promoterId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}`,
    receive: 'receivePromoterConfiguration',
  });

export const fetchJobs = (store, promoterId) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/jobs`,
    receive: 'receivePromoterJobs',
  });
};

export const fetchProducts = (store, options = {}) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/product-configurations?skip=${store.state.products.skip}${
      store.state.filterProducts.searchText
        ? `&fullTextSearch=${store.state.filterProducts.searchText}`
        : ''
    }${store.state.filterProducts.count ? `&count=${store.state.filterProducts.count}` : ''}${
      store.state.filterProducts.surveyResponses
        ? `&surveyResponses=${store.state.filterProducts.surveyResponses.join(',')}`
        : ''
    }${
      store.state.filterProducts.productIds
        ? `&productIds=${store.state.filterProducts.productIds.join(',')}`
        : ''
    }`,
    receive: options.skipReceive ? undefined : `receiveProductConfigurations`,
  });

export const fetchQuestions = (store) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/survey/questions?skip=${store.state.questions.skip}${
      store.state.filterQuestions.searchText
        ? `&fullTextSearch=${store.state.filterQuestions.searchText}`
        : ``
    }`,
    receive: 'receiveQuestions',
  });
};

export const fetchRoles = (store) =>
  Vue.prototype.$utils.getApiCallList(store, {
    url: `/v1/promoters/roleIds?skip=${store.state.roles.skip}${
      store.state.filterRoles.searchText
        ? `&fullTextSearch=${store.state.filterRoles.searchText}`
        : ''
    }`,
    receive: 'receiveRoles',
  });

export const fetchRole = (store, roleId) =>
  Vue.prototype.$utils.getApiCallList(store, {
    url: `/v1/promoters/role/${roleId}`,
    receive: 'receiveRole',
  });

export const saveRole = (store, { body }) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/role`,
    action: 'put',
    body,
    receive: 'receiveRole',
  });
};

export const deleteRole = (store, roleId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/role/${roleId}`,
    action: 'delete',
    receive: 'receiveRole',
  });

export const fetchAllQuestions = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/survey/questions?skip=0&count=0`,
    receive: 'receiveQuestions',
    request: 'resetQuestions',
  });

export const fetchSurveys = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/survey?skip=${store.state.surveys.skip}${
      store.state.filterSurveys.searchText
        ? `&fullTextSearch=${store.state.filterSurveys.searchText}`
        : ''
    }`,
    receive: 'receiveSurveys',
  });

export const fetchSignalerProducts = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/product-configurations/signaler?skip=${store.state.signalerProducts.skip}${
      store.state.filterProducts.searchText
        ? `&fullTextSearch=${store.state.filterProducts.searchText}`
        : ''
    }`,
    receive: 'receiveSignalerProductConfigurations',
  });

export const fetchAllSignalerProducts = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/product-configurations/signaler?count=0`,
    receive: 'receiveAllSignalerProductConfigurations',
  });

export const fetchDossierInsurers = (store, filter) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/dossier-insurer?skip=${store.state.dossierInsurer.skip}${
      filter.networkId ? `&networkid=${filter.networkId}` : ''
    }${filter.promoterId ? `&promoterid=${filter.promoterId}` : ''}${
      filter.searchContract ? `&searchcontract=${filter.searchContract}` : ''
    }${
      store.state.dossierInsurer.sort.type ? `&sortBy=${store.state.dossierInsurer.sort.type}` : ''
    }${
      store.state.dossierInsurer.sort.type
        ? `&sortDirection=${store.state.dossierInsurer.sort.directionASC ? '1' : '-1'}`
        : ''
    }`,
    receive: 'receiveDossierInsurer',
  });

export const fetchProduct = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/product-configurations/${confId}`,
    receive: 'receiveProductConfiguration',
  });

export const fetchQuestion = (store, questionId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/survey/questions/${questionId}`,
    receive: 'receiveQuestion',
  });

export const fetchSurvey = (store, questionId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/survey/${questionId}`,
    receive: 'receiveSurvey',
  });

export const deleteSurvey = (store, questionId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/survey/${questionId}`,
    action: 'delete',
    receive: 'receiveSurvey',
  });

export const deleteQuestion = (store, questionId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/survey/questions/${questionId}`,
    action: 'delete',
    receive: 'receiveQuestion',
  });

export const fetchSections = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/survey/sections`,
    receive: 'receiveSections',
  });

export const fetchBuckets = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/survey/buckets`,
    receive: 'receiveBuckets',
  });

export const fetchTypes = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/survey/types`,
    receive: 'receiveTypes',
  });

export const fetchSignalerProduct = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/product-configurations/signaler/${confId}`,
    receive: 'receiveSignalerProductConfiguration',
  });

export const copyProduct = (store, { confId, confIdtoAdd }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/product-configurations/${confId}/copy?productIdToAdd=${confIdtoAdd}`,
    action: 'put',
    receive: 'receiveProductConfiguration',
  });

export const deleteProduct = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/product-configurations/${confId}`,
    action: 'delete',
    receive: 'receiveProductConfiguration',
  });

export const saveProduct = (store, { productId, body }) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/product-configurations/${productId}`,
    action: 'put',
    body,
    receive: 'receiveProductConfiguration',
  });
};

export const saveSurvey = (store, { body }) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/survey`,
    action: 'put',
    body,
    receive: 'receiveSurvey',
  });
};

export const saveQuestion = (store, { body }) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/survey/questions`,
    action: 'put',
    body,
    receive: 'receiveQuestion',
  });
};

export const saveSignalerProduct = (store, { productId, body }) => {
  // eslint-disable-next-line no-console
  console.log('CONFIGURATION-ACTIONS', 'saveSignalerProduct', body);
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/product-configurations/signaler/${productId}`,
    action: 'put',
    body,
    receive: 'receiveSignalerProductConfiguration',
  });
};

export const deleteSignalerProduct = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/product-configurations/signaler/${confId}`,
    action: 'delete',
    receive: 'receiveSignalerProductConfiguration',
  });

export const saveJobs = (store, { promoterId, jobs }) => {
  // eslint-disable-next-line no-console
  console.log('CONFIGURATION-ACTIONS', 'saveJobs', jobs);
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/jobs`,
    action: 'put',
    body: jobs,
  });
};

export const fetchManagementFees = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/management-fee-configurations`,
    receive: 'receiveManagementFeeConfigurations',
    request: 'resetManagementFeeConfigurations',
  });

export const fetchManagementFee = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/management-fee-configurations/${confId}`,
    receive: 'receiveManagementFeeConfiguration',
  });

export const saveManagementFee = (store, { idManagementFee, body }) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/management-fee-configurations/${idManagementFee}`,
    action: 'put',
    body,
    receive: 'receiveManagementFeeConfiguration',
  });
};

export const deleteManagementFee = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/management-fee-configurations/${confId}`,
    action: 'delete',
    receive: 'receiveManagementFeeConfiguration',
  });

export const saveDossierInsurer = (store, { dossier }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/dossier-insurer/`,
    action: 'put',
    body: dossier,
  });

export const deleteDossierInsurer = (store, dossierInsurerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/dossier-insurer/${dossierInsurerId}`,
    action: 'delete',
  });

export const fetchSheltiaCommissionings = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/sheltia-commissioning-configurations`,
    receive: 'receiveCommissioningConfigurations',
    request: 'resetCommissioningConfigurations',
  });

export const fetchSheltiaCommissioning = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/sheltia-commissioning-configurations/${confId}`,
    receive: 'receiveCommissioningConfiguration',
  });

export const saveSheltiaCommissioning = (store, { idCommissioning, body }) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/sheltia-commissioning-configurations/${idCommissioning}`,
    action: 'put',
    body,
    receive: 'receiveCommissioningConfiguration',
  });
};

export const deleteSheltiaCommissioning = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/sheltia-commissioning-configurations/${confId}`,
    action: 'delete',
    receive: 'receiveCommissioningConfiguration',
  });

export const fetchTcwCommissionings = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/tcw-commissioning-configurations`,
    receive: 'receiveTcwCommissioningConfigurations',
    // request: 'resetTcwCommissioningConfigurations',
  });

export const fetchTcwCommissioning = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/tcw-commissioning-configurations/${confId}`,
    receive: 'receiveTcwCommissioningConfiguration',
  });

export const saveTcwCommissioning = (store, { idCommissioning, body }) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/tcw-commissioning-configurations/${idCommissioning}`,
    action: 'put',
    body,
    receive: 'receiveTcwCommissioningConfiguration',
  });
};

export const addTcwCommissioning = (store, { idCommissioning, body }) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/tcw-commissioning-configurations/add/${idCommissioning}`,
    action: 'put',
    body,
  });
};

export const deleteTcwCommissioning = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/tcw-commissioning-configurations/${confId}`,
    action: 'delete',
  });

export const fetchTcwCommissioningsDynamic = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/tcw-commissioning-configurations-dynamic`,
    receive: 'receiveTcwCommissioningConfigurationsDynamic',
  });

export const fetchTcwCommissioningDynamic = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/tcw-commissioning-configurations-dynamic/${confId}`,
    receive: 'receiveTcwCommissioningConfigurationDynamic',
  });

export const saveTcwCommissioningDynamic = (store, { idCommissioning, body }) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/tcw-commissioning-configurations-dynamic/${idCommissioning}`,
    action: 'put',
    body,
    receive: 'receiveTcwCommissioningConfigurationDynamic',
  });
};

export const addTcwCommissioningDynamic = (store, { idCommissioning, body }) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/tcw-commissioning-configurations-dynamic/add/${idCommissioning}`,
    action: 'put',
    body,
  });
};

export const deleteTcwCommissioningDynamic = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/tcw-commissioning-configurations-dynamic/${confId}`,
    action: 'delete',
  });

export const fetchAdjustedPremiums = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/adjusted-premium-configurations`,
    receive: 'receiveAdjustedPremiumConfigurations',
    request: 'resetAdjustedPremiumConfigurations',
  });

export const fetchAdjustedPremium = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/adjusted-premium-configurations/${confId}`,
    receive: 'receiveAdjustedPremiumConfiguration',
  });

export const saveAdjustedPremium = (store, { idAdjustedPremium, body }) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/adjusted-premium-configurations/${idAdjustedPremium}`,
    action: 'put',
    body,
    receive: 'receiveAdjustedPremiumConfiguration',
  });
};

export const deleteAdjustedPremium = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/adjusted-premium-configurations/${confId}`,
    action: 'delete',
    receive: 'receiveAdjustedPremiumConfiguration',
  });

export const fetchCustomerInsurers = (store, filter) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customer-insurer?skip=${store.state.customerInsurer.skip}${
      filter.networkId ? `&networkid=${filter.networkId}` : ''
    }${filter.promoterId ? `&promoterid=${filter.promoterId}` : ''}${
      filter.customerId ? `&customerId=${filter.customerId}` : ''
    }${
      store.state.customerInsurer.sort.type
        ? `&sortBy=${store.state.customerInsurer.sort.type}`
        : ''
    }${
      store.state.customerInsurer.sort.type
        ? `&sortDirection=${store.state.customerInsurer.sort.directionASC ? '1' : '-1'}`
        : ''
    }`,
    receive: 'receiveCustomerInsurer',
  });

// eslint-disable-next-line sonarjs/no-identical-functions
export const fetchPersonOwners = (store, filter) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/person-owner?skip=${store.state.customerInsurer.skip}${
      filter.networkId ? `&networkid=${filter.networkId}` : ''
    }${filter.promoterId ? `&promoterid=${filter.promoterId}` : ''}${
      filter.customerId ? `&customerId=${filter.customerId}` : ''
    }${
      store.state.customerInsurer.sort.type
        ? `&sortBy=${store.state.customerInsurer.sort.type}`
        : ''
    }${
      store.state.customerInsurer.sort.type
        ? `&sortDirection=${store.state.customerInsurer.sort.directionASC ? '1' : '-1'}`
        : ''
    }`,
    receive: 'receiveCustomerInsurer',
  });

export const saveCustomerInsurer = (store, customer) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customer-insurer/`,
    action: 'put',
    body: customer,
  });

export const savePersonOwner = (store, customer) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/person-owner/`,
    action: 'put',
    body: customer,
  });

export const deleteCustomerInsurer = (store, customerInsurerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/customer-insurer/${customerInsurerId}`,
    action: 'delete',
  });

export const deletePersonOwner = (store, customerInsurerId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/person-owner/${customerInsurerId}`,
    action: 'delete',
  });

export const fetchMenuPermissions = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/menu-permissions`,
    receive: 'receiveMenuPermissions',
  });

export const fetchMenuPermissionsConfigurations = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/menu-permissions-configurations?skip=${store.state.menuPermissions.skip}${
      store.state.filterMenuPermissions.searchText
        ? `&fullTextSearch=${store.state.filterMenuPermissions.searchText}`
        : ''
    }${
      store.state.filter.type.roleType && store.state.filter.type.roleType !== constants.noSelection
        ? `&roleId=${store.state.filter.type.roleType}`
        : ''
    }${
      store.state.filter.type.promoterId &&
      store.state.filter.type.promoterId !== constants.noSelection
        ? `&promoterId=${store.state.filter.type.promoterId}`
        : ''
    }`,
    receive: 'receiveMenuPermissionsConfigurations',
  });

export const fetchUsersFromMenuPermissionsConfigurations = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/menu-permissions-configurations-users`,
    receive: 'receiveMenuPermissionsConfigurationsUser',
  });

export const fetchMenuIds = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/menu-ids`,
    receive: 'receiveMenuIds',
  });

export const fetchAllMenuPermissionsConfigurations = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/menu-permissions-configurations?skip=${store.state.menuPermissions.skip}${
      store.state.filterMenuPermissions.searchText
        ? `&fullTextSearch=${store.state.filterMenuPermissions.searchText}`
        : ''
    }${
      store.state.filter.type.roleType && store.state.filter.type.roleType !== constants.noSelection
        ? `&roleId=${store.state.filter.type.roleType}`
        : ''
    }`,
    request: 'resetMenuPermissionsConfigurations',
    receive: 'receiveAllMenuPermissionsConfigurations',
  });

export const fetchMenuPermissionsConfiguration = (store, confId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/menu-permissions-configurations/${confId}`,
    receive: 'receiveMenuPermissionsConfiguration',
  });

export const deleteMenuPermissions = (store, menuPermissionsId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/menu-permissions-configurations/${menuPermissionsId}`,
    action: 'delete',
  });

export const saveMenuPermissions = (store, { body }) => {
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/menu-permissions-configurations`,
    action: 'put',
    body,
    receive: 'receiveMenuPermissionsConfigurations',
  });
};
