import { defineStore } from "pinia";
import axios from 'axios';
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    requestedPage: "side-menu",
  }),
  getters: {
    isAuthenticated: state => !!state.user,    
    StateUser: state => state.user,
    getRequestedPage(state) {
      return state.requestedPage;      
    },
  },
  actions: {
    async LogIn(User) {
      let response = await axios.post('token/', User);
      const token = "Bearer " + response.data.access_token
      localStorage.setItem('user-token', token)
      // Add the following line:
      axios.defaults.headers.common['Authorization'] = token;
      this.user = User.get('username')
    },
    /* versione con promise
    LogIn(User) {
      axios.post('token', User)
        .then((response) => {
            const token = "Bearer " + response.data.access_token
            localStorage.setItem('user-token', token)
            axios.defaults.headers.common['Authorization'] = token;
            this.user = User.get('username')
          })
        .catch((error) => error)//TODO error handling
    },*/
    async LogOut(){
      console.log("logging out");
      this.user = null
      localStorage.removeItem('user-token')
      router.push({name: "login"});
    },
    setRequestedPage(aRequestedPage) {
      this.requestedPage = aRequestedPage
    },
  },
  /*const mutations = {

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

  }*/
})