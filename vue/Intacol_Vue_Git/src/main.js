// import "babel-polyfill";
import Vue from "vue";
window.Vue = Vue;
import Vuex from 'vuex';
Vue.use(Vuex);


import App from "./App.vue";
import router from "./router";


import './assets/custom.css';


import { BootstrapVue, BVToastPlugin, IconsPlugin } from 'bootstrap-vue';
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
Vue.use(BVToastPlugin)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)


// import VueRouter from "vue-router";
import GullKit from "./plugins/gull.kit";
// import "babel-polyfill";
// import es6Promise from "es6-promise";
// es6Promise.polyfill();
import store from "./store";
import Breadcumb from "./components/breadcumb";


import axios from "axios";
import VueAxios from "vue-axios";
// Vue.use(VueAxios, axios);
// global variable
Vue.prototype.$axios = axios;

import moment from 'moment';
Vue.prototype.moment = moment

global.jQuery = require('jquery');
var $ = global.jQuery;
window.$ = $

// un comment these  if you use firebase
// import firebase from "firebase/app";
// import "firebase/auth";
// import {firebaseSettings} from "@/data/config";
import i18n from "./lang/lang";

Vue.component("breadcumb", Breadcumb);
// Vue.use(VueRouter);

Vue.use(GullKit);
// firebase.initializeApp(firebaseSettings);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
