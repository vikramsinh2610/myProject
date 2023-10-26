<template>
  <div>
    <router-view></router-view>

    <!-- <customizer></customizer> -->
  </div>
</template>


<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    // ...mapGetters(["getThemeMode"]),
    // themeName() {
    //   return this.getThemeMode.dark ? "dark-theme" : " ";
    // },
    // rtl() {
    //   return this.getThemeMode.rtl ? "rtl" : " ";
    // }
  },
  metaInfo() {
    return {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: "Intacol",
      // all titles will be injected into this template
      titleTemplate: "%s | Intacol - Admin Dashboard",
      // bodyAttrs: {
      //   class: [this.themeName, "text-left"]
      // },
      htmlAttrs: {
        dir: this.rtl
      }
    };
  }
};
</script>

<style>
</style>


