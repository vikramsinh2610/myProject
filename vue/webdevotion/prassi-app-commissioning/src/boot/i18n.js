import VueI18n from 'vue-i18n';
import messages from 'src/i18n';
import numberFormats from 'src/i18n/numbers';
import dateFormats from 'src/i18n/dates';

export default ({ app, Vue }) => {
  Vue.use(VueI18n);

  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: 'it',
    fallbackLocale: 'en',
    messages,
    numberFormats,
    dateFormats,
  });
};
