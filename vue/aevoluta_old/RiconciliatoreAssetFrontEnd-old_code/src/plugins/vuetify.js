import Vue from 'vue';
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vuetify from 'vuetify/lib/framework';


Vue.use(Vuetify,{
    icofont:'md',
    theme:{
        primary: '#9652ff',

    }
});

export default new Vuetify({
    icons: {
        iconfont: 'mdi', // default - only for display purposes
      },
});
