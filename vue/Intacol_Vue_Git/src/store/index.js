import Vuex from "vuex";
import Vue from "vue";
import { alert } from './modules/alert.module';
import { account } from './modules/account.module';
import { users } from './modules/users.module';
import { compactSidebar } from './modules/compactSidebar';
import { largeSidebar } from './modules/largeSidebar';
import { verticalSidebar } from './modules/verticalSidebar';

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: {
    alert,
    account,
    users,
    compactSidebar,
    largeSidebar,
    verticalSidebar
  },
});
