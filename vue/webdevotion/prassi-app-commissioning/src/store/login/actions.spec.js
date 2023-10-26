import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { cloneDeep } from 'lodash';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import * as types from '../const';
import { fetchLogin2fact, fetchVerify2fact } from './actions';
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

const mock = new MockAdapter(axios);

const storeConfig = {
  state: {
    logged: false,
    error: false,
    errorType: types.NO_ERROR,
    isFetching: false,
    username: '',
    token: '',
    token2fact: '',
  },
  mutations: {
    requestLogin2fact,
    receiveLogin2fact,
    requestToken2fact,
    receiveToken2fact,
    requestLogout,
    errorLoginConnection,
    errorLoginCredentials,
    errorLoginInternal,
  },
};

describe('async actions', () => {
  it('creates receiveLogin2fact when fetching user has been done', () => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Vuex.Store(cloneDeep(storeConfig));

    mock
      .onPost(
        'http://tcw-api-dev.eu-west-1.elasticbeanstalk.com/v1/users/login2fact?username=ippo&password=pippo',
      )
      .reply(200, { item: { token2fact: 'token123455' } });

    fetchLogin2fact(store, { username: 'ippo', password: 'pippo' }).then(() => {
      expect(store.state.token2fact).toEqual('token123455');
    });
  });
});

describe('async actions', () => {
  const loginConfig = {
    state: {
      login: {
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
      },
    },
  };

  it('creates fetchVerify2fact when fetching user has been done', () => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Vuex.Store(cloneDeep(storeConfig));

    mock
      .onPost(
        'http://tcw-api-dev.eu-west-1.elasticbeanstalk.com/v1/users/verify2fact?token2fact=1234567',
      )
      .reply(200, {
        item: { token: 'token123455', logged: true, identity: { userName: 'pippo' } },
      });

    fetchVerify2fact(
      { commit: store.commit, rootState: loginConfig.state },
      { token2fact: '1234567' },
    ).then(() => {
      expect(store.state.logged).toEqual(true);
    });
  });
});
