//store/modules/auth.js

import axios from 'axios';

const state = {
  user: null,
  requestedPage: "home",
  isLoading: null,
  preferences: null,
};
const getters = {
  isAuthenticated: state => !!state.user,    
  StateUser: state => state.user,
  getRequestedPage(state) {
    return state.requestedPage;      
  },
  getIsLoading(state) {
    return state.isLoading;      
  },
  getPreferences(state) {
    return state.preferences;
  },
};
const actions = {
  async LogIn({commit}, User) {
    let response = await axios.post('token', User);
    const token = "Bearer " + response.data.access_token
    localStorage.setItem('user-token', token)
    // Add the following line:
    axios.defaults.headers.common['Authorization'] = token;
    await commit('setUser', User.get('username'))
  },
  async LogOut({commit}){
    console.log("logging out");
    let user = null
    commit('LogOut', user)
  },
  async LoadPreferences({commit}){
    console.log("Loading Preferences out");
    let params = new URLSearchParams();
    params.set('preference_type_code', 1);
    let response = await axios.get('get-preference', { params });

    let preferences = response.data[0].json_payload;
    console.log("Preferences Loaded: ", preferences)
    commit('setPreferences', preferences)
  },
  async SavePreferences({commit, getters}){
    let prefs = getters.getPreferences;
    console.log("Save Preferences", prefs);
    let params = new URLSearchParams();
    params.set('preference_type_code', 1);
    params.set('preference_json', JSON.stringify(prefs));
    let response = await axios.put('post-preference/?' + params.toString());
    console.log("Preferences Saved::");
    console.log(commit);
    console.log(response);

  }
};
const mutations = {

  setRequestedPage(state, aRequestedPage) {
    state.requestedPage = aRequestedPage
  },
  setUser(state, username){
    state.user = username
  },
  LogOut(state){
    state.user = null
  },
  setIsLoading(state, anIsLoading){
    console.log("IS LOADING : " + anIsLoading);
    state.isLoading = anIsLoading
  },
  setPreferences(state, aPreferences) {
    state.preferences = aPreferences;
  },

};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};



