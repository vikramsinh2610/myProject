import Vue from 'vue';

export const fetchLogin2fact = ({ commit }, login) => {
  commit('requestLogin2fact');

  return new Promise((resolve) => {
    Vue.prototype.$axios
      .post(
        Vue.prototype.$utils.apiUrl(
          `/v1/users/login?username=${login.username}&password=${login.password}`,
        ),
      )
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          commit('receiveLogin2fact', response.data);
          resolve();
        } else if (response.status >= 400 && response.status <= 499) {
          Vue.prototype.$utils.errobj('LOGIN_ACTIONS', 'login response status 400', response);
          commit('errorLoginCredentials');
          resolve();
        } else {
          Vue.prototype.$utils.errobj('LOGIN_ACTIONS', 'login response status error', response);
          commit('errorLoginInternal', response.data.message);
          resolve();
        }
      })
      .catch((error) => {
        if (error.response) {
          Vue.prototype.$utils.errobj('LOGIN_ACTIONS', 'login error response', error.response);
          if (error.response.status >= 400 && error.response.status <= 499) {
            Vue.prototype.$utils.errobj(
              'LOGIN_ACTIONS',
              'login error response 400',
              error.response.status,
            );
            commit('errorLoginCredentials');
            resolve();
          } else {
            commit('errorLoginInternal', error.response.data.message);
            resolve();
          }
        } else if (error.request) {
          Vue.prototype.$utils.errobj('LOGIN_ACTIONS', 'login error request', error.request);
          commit('errorLoginConnection');
          resolve();
        } else {
          Vue.prototype.$utils.errobj('LOGIN_ACTIONS', 'network error', error.message);
          resolve();
          commit('errorLoginConnection');
        }
      });
  });
};

export const fetchVerify2fact = ({ commit, rootState }, token) => {
  commit('requestToken2fact');

  return new Promise((resolve) => {
    Vue.prototype.$axios
      .post(
        Vue.prototype.$utils.apiUrl(`/v1/users/verify2fact?token2fact=${token.token2fact}`),
        { token: token.token2fact },
        { headers: { Authorization: `Bearer ${rootState.login.token2fact}` } },
      )
      .then((response) => {
        if (response.status < 200 || response.status > 299) {
          Vue.prototype.$utils.errobj('LOGIN_ACTIONS', 'login response error status', response);
          commit('errorLoginCredentials');
          resolve();
        } else {
          commit('receiveToken2fact', response.data);
          resolve();
        }
      })
      .catch((error) => {
        if (error.response) {
          Vue.prototype.$utils.errobj('LOGIN_ACTIONS', 'login error response', error.response);
          commit('errorLoginCredentials');
        } else if (error.request) {
          Vue.prototype.$utils.errobj('LOGIN_ACTIONS', 'login error response', error.request);
          commit('errorLoginConnection');
          resolve();
        } else {
          Vue.prototype.$utils.errobj('LOGIN_ACTIONS', 'network error', error.message);
          commit('errorLoginConnection');
          resolve();
        }
      });
  });
};

export const verifyToken = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: '/v1/users/verifytoken',
    receive: 'receiveVerifyToken',
  });

export const recoverQrCode = (store, { username, password }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/users/recover-qr-code?username=${username}&password=${password}`,
    action: 'post',
  });
