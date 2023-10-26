import Vue from 'vue';
import Vuex from 'vuex';
import { debounce } from 'quasar';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

import version from './version';
import env from '../boot/env/env';
import error from './error';
import login from './login';
import proposals from './proposals';
import commissioning from './commissioning';
import invoicing from './invoicing';
import configuration from './configuration';
import accounting from './accounting';
import acquittance from './acquittance';
import promoters from './promoters';
import documents from './documents';
import dossiers from './dossiers';
import surveys from './surveys';
import consulting from './consulting';

if (!env.development) {
  Raven.config('https://7761c47391c9422db43e1547a5b181d9@sentry.io/1279932', {
    release: env.version,
    environment: env.production ? 'prod' : 'dev',
  })
    .addPlugin(RavenVue, Vue)
    .install();
}

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    version,
    error,
    login,
    promoters,
    commissioning,
    invoicing,
    configuration,
    accounting,
    acquittance,
    proposals,
    documents,
    dossiers,
    surveys,
    consulting,
  },
});

const initialState = global.localStorage.getItem('prassi');

if (initialState) {
  const state = JSON.parse(initialState);

  if (state.version !== undefined && state.version.version === store.state.version.version) {
    store.state.login = state.login;
    Vue.prototype.$user = store.state.login;
  } else {
    try {
      global.localStorage.removeItem('prassi');
      // eslint-disable-next-line unicorn/prefer-optional-catch-binding
    } catch (error_) {
      global.localStorage.clear();
      global.caches.keys().then((keyList) => {
        keyList.forEach((key) => {
          global.caches.delete(key);
        });
      });
    }
  }
}

// eslint-disable-next-line function-paren-newline
store.subscribe(
  debounce(() => {
    global.localStorage.setItem(
      'prassi',
      JSON.stringify({ login: store.state.login, version: store.state.version }),
    );
  }, 2000),
  // eslint-disable-next-line function-paren-newline
);

export default store;
