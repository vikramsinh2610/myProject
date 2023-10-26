import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { createI18n } from "vue-i18n";
import router from "./router";
import globalComponents from "./global-components";
import utils from "./utils";
import "./assets/css/app.css";
import messages from "@intlify/unplugin-vue-i18n/messages";

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "IT",
    fallbackLocale: "IT",
    availableLocales: ["IT","EN", "ES"],
    messages: messages,
  });

const app = createApp(App).use(router).use(createPinia());
app.use(i18n);
globalComponents(app);
utils(app);

app.mount("#app");
