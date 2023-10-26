import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import globalComponents from "./global-components";
import utils from "./utils";
import "./assets/css/app.css";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem("lang") || "English",
  fallbackLocale: "English",
  availableLocales: ["English", "Espanol", "Italiano"],
  messages: messages,
});
const pinia = createPinia();
axios.defaults.withCredentials = true;
console.log("base url: " + window.location.origin);

if (window.location.origin.indexOf("localhost") >= 0) {
  axios.defaults.baseURL = "http://aevoriconciliatoredemo.aevoluta.eu/api/";
  // axios.defaults.baseURL = "http://ricondev2.aevoluta.eu/api/";
  //axios.defaults.baseURL = "http://riconanon.aevoluta.eu/api/";
  //axios.defaults.baseURL = "http://localhost:2343";
} else {
  axios.defaults.baseURL = window.location.origin + "/api/";
}

axios.interceptors.response.use(undefined, async function (error) {
  if (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await useAuthStore().LogOut();

      return router.push("/login");
    }
    console.log("non e' un 401 o retry fallito, dai errore");
  }
  return Promise.reject(error); // MISSING THIS ---------
});

// const token = localStorage.getItem("user-token");
const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  axios.defaults.headers.common["Authorization"] = user?.token;
}
const app = createApp(App)
  .use(router)
  .use(i18n)
  .use(createPinia(piniaPluginPersistedState));

globalComponents(app);
utils(app);

app.mount("#app");
