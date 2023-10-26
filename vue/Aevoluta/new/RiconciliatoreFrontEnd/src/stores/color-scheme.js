import { defineStore } from "pinia";

export const useColorSchemeStore = defineStore("colorScheme", {
  state: () => ({
    colorSchemeValue: "default",
      /*localStorage.getItem("colorScheme") === null
        ? "default"
        : localStorage.getItem("colorScheme"),*/
  }),
  getters: {
    colorScheme(state) {
      /*if (localStorage.getItem("colorScheme") === null) {
        localStorage.setItem("colorScheme", "default");
      }

      return state.colorSchemeValue;*/
      return "default";
    },
  },
  actions: {
    setColorScheme(colorScheme) {
      localStorage.setItem("colorScheme", colorScheme);
      this.colorSchemeValue = colorScheme;
    },
  },
});
