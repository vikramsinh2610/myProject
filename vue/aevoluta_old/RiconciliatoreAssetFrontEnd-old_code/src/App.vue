<template>
  <v-app>
    <AevoSnackbar/>
    <v-dialog v-model="loading" fullscreen>
      <v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
        <v-layout justify-center align-center>
          <v-progress-circular
            indeterminate
            color="primary">
          </v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
    <Topbar title="Home"></Topbar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Topbar from "./components/Topbar.vue";
import AevoSnackbar from "./components/AevoSnackbar.vue";

export default {
    name: "App",
    data: () => ({
      
    }),
    components: { Topbar, AevoSnackbar},
    computed: {
        loading: function() {
          return this.$store.getters["auth/getIsLoading"]
        },
    },

};
</script>

<style >
#app{
  background-image: url('./assets/img-background.jpg');
 
}
.CellWithAevoTooltip{
  position:relative;
}

.AevoTooltip{
  display:none;
  position:absolute; 
  z-index:1000;
  border:1px;
  background-color:white; 
  border-style:solid;
  border-width:1px;
  padding:3px;
  top:20px; 
  left:20px;
  width: 30em;
}

.CellWithAevoTooltip:hover span.AevoTooltip{
  display:block;
  word-wrap: break-word;
}

</style>