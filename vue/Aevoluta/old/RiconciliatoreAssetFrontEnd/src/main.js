import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios';
import store from './store';




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
        await store.dispatch('auth/LogOut')
        await store.commit('auth/setIsLoading', false)
        
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

Vue.config.productionTip = false


Vue.filter('formatDateShort', function(aDateString) {
  if (aDateString) {
    var aDate = new Date(aDateString);
    var curr_date = aDate.getDate();
    var curr_month = aDate.getMonth() + 1; //Months are zero based
    var curr_year = aDate.getFullYear().toString().substring(2,4);
    return curr_date + "/" + curr_month + "/" + curr_year;
  }
});

Vue.filter('formatDateLong', function(aDateString) {
  if (aDateString) {
    var aDate = new Date(aDateString);
    var curr_date = aDate.getDate();
    var curr_month = aDate.getMonth() + 1; //Months are zero based
    var curr_year = aDate.getFullYear();
    return curr_date + "/" + curr_month + "/" + curr_year;
  }
});

Vue.filter('formatDateTime', function(aDateString) {
  if (aDateString) {
    var aDate = new Date(aDateString);
    var curr_date = aDate.getDate();
    var curr_month = aDate.getMonth() + 1; //Months are zero based
    var curr_year = aDate.getFullYear();
    var curr_hr = aDate.getHours();
    var curr_min = aDate.getMinutes();
    
    return curr_date + "/" + curr_month + "/" + curr_year + " " + curr_hr + ":" + curr_min;
  }
});

Vue.filter('formatTruncate', function(aText, numChars, suffix) {
  if  (aText && (aText.length  >  numChars))  {
    return  aText.substring(0,  numChars)  +  suffix;
  }  else  {
    return  aText;
  }
});

Vue.filter('formatTruncateDecimal', function(aNumber, numDecimal) {
  if  (aNumber && !isNaN(aNumber))  {
    return  aNumber.toFixed(numDecimal);
  }  else  {
    return  aNumber;
  }
});

Vue.mixin({
  methods: {
    globalRounderToTwoDecimals: function (num) {
      var m = Number((Math.abs(num) * 100).toPrecision(15));
      return Math.round(m) / 100 * Math.sign(num);
    }
  },
})

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
