import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import globalComponents from "./global-components";
import utils from "./utils";
import "./assets/css/app.css";
import { useAuthStore } from "@/stores/auth";
import axios from 'axios';
import {createI18n} from 'vue-i18n'

const i18n = createI18n({
  //legacy: false, // you must set `false`, to use Composition API
  locale: 'it', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {}, // set locale messages
  globalInjection: true,
  // If you need to specify other options, you can set other options
  // ...
})

axios.defaults.withCredentials = true
console.log("base url: " + window.location.origin);

if(window.location.origin.indexOf("localhost")>=0) {
  // axios.defaults.baseURL = 'http://ricondev2.aevoluta.eu/api/';
  axios.defaults.baseURL = 'http://riconanon.aevoluta.eu/api/';
} else {
  axios.defaults.baseURL = window.location.origin + "/api/";
}

axios.interceptors.response.use(undefined, async function (error) {
  if (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {

        originalRequest._retry = true;
        await useAuthStore().LogOut()
        
        return router.push('/login')
    }
    console.log("non e' un 401 o retry fallito, dai errore")
  }
  return Promise.reject(error); // MISSING THIS ---------
})

const token = localStorage.getItem('user-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = token
}

const app = createApp(App).use(router).use(i18n).use(createPinia());

globalComponents(app);
utils(app);

app.mount("#app");
