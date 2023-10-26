import {
  requestLogin2fact,
  receiveLogin2fact,
  requestToken2fact,
  receiveToken2fact,
  requestLogout,
  errorLoginConnection,
  errorLoginCredentials,
  errorLoginInternal,
} from './mutations';
import * as types from '../const';

test('requestLogin2fact change isFetching to true', () => {
  const state = {
    logged: false,
    error: false,
    errorType: types.NO_ERROR,
    errorMessage: '',
    isFetching: false,
    username: '',
    token: '',
    token2fact: '',
    secret: '',
    qrcode: '',
    step: 'login',
  };

  requestLogin2fact(state);
  expect(state.isFetching).toBe(true);
});

test('requestToken2fact change isFetching to true', () => {
  const state = {
    logged: false,
    error: false,
    errorType: types.NO_ERROR,
    errorMessage: '',
    isFetching: false,
    username: '',
    token: '',
    token2fact: '12345678',
    secret: '',
    qrcode: '',
    step: 'login',
  };

  requestToken2fact(state);
  expect(state.isFetching).toBe(true);
});

test('requestLogout change isFetching to true', () => {
  const state = {
    logged: true,
    error: false,
    errorType: types.NO_ERROR,
    errorMessage: '',
    isFetching: false,
    token2fact: '',
    secret: '',
    qrcode: '',
    step: 'login',
    username: 'pippo',
    token: '12345678',
  };

  requestLogout(state);
  expect(state.logged).toBe(false);
});

test('errorLoginCredentials change error to true', () => {
  const state = {
    logged: true,
    error: false,
    errorType: types.NO_ERROR,
    errorMessage: '',
    isFetching: false,
    token2fact: '',
    secret: '',
    qrcode: '',
    step: 'login',
    username: 'pippo',
    token: '12345678',
  };

  errorLoginCredentials(state);
  expect(state.errorType).toBe(types.ERROR_CREDENTIALS);
});

test('errorLoginConnection change error to true', () => {
  const state = {
    logged: true,
    error: false,
    errorType: types.NO_ERROR,
    errorMessage: '',
    isFetching: false,
    token2fact: '',
    secret: '',
    qrcode: '',
    step: 'login',
    username: 'pippo',
    token: '12345678',
  };

  errorLoginConnection(state);
  expect(state.errorType).toBe(types.ERROR_CONNECTION);
});

test('errorLoginInternal change error to true', () => {
  const state = {
    logged: true,
    error: false,
    errorType: types.NO_ERROR,
    errorMessage: '',
    isFetching: false,
    token2fact: '',
    secret: '',
    qrcode: '',
    step: 'login',
    username: 'pippo',
    token: '12345678',
  };

  errorLoginInternal(state, 'messaggio custom');
  expect(state.errorType).toBe(types.ERROR_INTERNAL);
  expect(state.errorMessage).toBe('messaggio custom');
});

test('receiveLogin2fact log user', () => {
  const stateStart = {
    logged: false,
    error: false,
    errorType: types.NO_ERROR,
    errorMessage: '',
    isFetching: false,
    username: '',
    token: '',
    token2fact: '',
    secret: '',
    qrcode: '',
    step: 'login',
  };

  const loginReceive = {
    item: {
      token2fact: '12345678',
    },
  };

  receiveLogin2fact(stateStart, loginReceive);
  expect(stateStart.token2fact).toEqual('12345678');
});

test('receiveToken2fact log user', () => {
  const stateStart = {
    logged: false,
    error: false,
    errorType: types.NO_ERROR,
    errorMessage: '',
    isFetching: false,
    username: '',
    token: '12345678',
    token2fact: '',
    secret: '',
    qrcode: '',
    step: 'login',
  };

  const loginReceive = {
    item: {
      token: '12345678',
      logged: true,
      identity: {
        userName: 'pippo',
      },
    },
  };

  receiveToken2fact(stateStart, loginReceive);
  expect(stateStart.token).toEqual('12345678');
  expect(stateStart.username).toEqual('pippo');
});
