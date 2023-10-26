import Vue from 'vue';
import VueRouter from 'vue-router';
import env from '../boot/env/env';

import routes from './routes';
import store from '../store';

Vue.use(VueRouter);

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * When going with "history" mode, please also make sure "build.publicPath"
   * is set to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: () => ({ y: 0 }),
  routes,
});

// eslint-disable-next-line sonarjs/cognitive-complexity
Router.beforeEach((to, from, next) => {
  if (to.query.token) {
    store.commit('login/receiveToken2fact', {
      item: { token: to.query.token, identity: { _id: '', userName: '' } },
    });
    store.dispatch('login/verifyToken');
  }

  if (store.state.login.logged && to.path === '/') {
    if (store.state.login.roleID !== 0) {
      next(env.edition === 'sheltia' ? '/persons' : '/customers');
    } else {
      next();
    }
  } else if (store.state.login.logged && to.path !== '/login') {
    next();
    // eslint-disable-next-line sonarjs/no-duplicated-branches
  } else if (store.state.login.logged && to.path === '/login') {
    if (store.state.login.roleID !== 0) {
      next(env.edition === 'sheltia' ? '/persons' : '/customers');
    } else {
      next('/');
    }
  } else if (!store.state.login.logged && to.path === '/login') {
    next();
  } else if (!store.state.login.logged && to.path !== '/login') {
    next('/login');
  }
});

export default Router;
