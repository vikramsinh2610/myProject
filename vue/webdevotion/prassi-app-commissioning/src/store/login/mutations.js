import Vue from 'vue';
import * as types from '../const';

export const requestLogin2fact = (state) => {
  state.logged = false;
  state._id = '';
  state.roleID = 0;
  state.username = '';
  state.token = '';
  global.token = '';
  state.error = false;
  state.errorType = types.NO_ERROR;
  state.errorMessage = '';
  state.isFetching = true;
  state.step = 'login';
};

export const receiveLogin2fact = (state, { item }) => {
  state.logged = false;
  state.error = false;
  state.errorType = types.NO_ERROR;
  state.errorMessage = '';
  state.isFetching = false;
  state.token2fact = item.token2fact;
  state.secret = item.secret !== undefined ? item.secret : state.secret;
  state.qrcode = item.qrcode !== undefined ? item.qrcode : state.qrcode;
  state.step = item.secret !== undefined ? 'qrcode' : 'token2fact';
};

export const requestToken2fact = (state) => {
  state.logged = false;
  state._id = '';
  state.roleID = 0;
  state.username = '';
  state.token = '';
  global.token = '';
  state.error = false;
  state.errorType = types.NO_ERROR;
  state.errorMessage = '';
  state.isFetching = true;
  state.step = 'token2fact';
};

export const receiveToken2fact = (state, { item }) => {
  state.logged = true;
  state.error = false;
  state.errorType = types.NO_ERROR;
  state.errorMessage = '';
  state.isFetching = false;
  state.token = item.token;
  global.token = item.token;
  state.token2fact = '';
  state._id = item.identity._id;
  state.roleID = Number.parseInt(item.identity.roleId, 10);
  state.username = item.identity.userName;
  Vue.prototype.$user = state;
};

export const receiveVerifyToken = (state, { item }) => {
  state.username = item.userName;
  state._id = item._id;
  state.roleID = Number.parseInt(item.roleId, 10);
  Vue.prototype.$user = state;
};

export const errorLoginConnection = (state) => {
  state.logged = false;
  state._id = '';
  state.roleID = 0;
  state.username = '';
  state.token = '';
  global.token = '';
  state.error = true;
  state.errorType = types.ERROR_CONNECTION;
  state.errorMessage = '';
  state.isFetching = false;
};

export const errorLoginCredentials = (state) => {
  state.logged = false;
  state._id = '';
  state.roleID = 0;
  state.username = '';
  state.token = '';
  global.token = '';
  state.error = true;
  state.errorType = types.ERROR_CREDENTIALS;
  state.errorMessage = '';
  state.isFetching = false;
};

export const errorLoginInternal = (state, message) => {
  state.logged = false;
  state._id = '';
  state.roleID = 0;
  state.username = '';
  state.token = '';
  global.token = '';
  state.error = true;
  state.errorType = types.ERROR_INTERNAL;
  state.errorMessage = message;
  state.isFetching = false;
};

export const requestLogout = (state) => {
  state.logged = false;
  state._id = '';
  state.roleID = 0;
  state.username = '';
  state.token2fact = '';
  state.token = '';
  global.token = '';
  state.error = false;
  state.errorType = types.NO_ERROR;
  state.errorMessage = '';
  state.isFetching = false;
};
