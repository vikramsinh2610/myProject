import { defineStore } from "pinia";
/*import axios from 'axios';
import router from "@/router";*/

export const useUtilsStore = defineStore("utils", {
  state: () => ({
    isLoading: false,
    languageList: [],
  }),
  getters: {
    getLanguageList: state => state.languageList,
    getIsLoading: state => state.isLoading
  },
  actions: {
    setLanguageList(languageList) {
      this.languageList = languageList
    },
    setIsLoading(anIsLoading){
      console.log("IS LOADING : " + anIsLoading);
      this.isLoading = anIsLoading
    },
  },
})