<template>
  <div class="text-center">
                <v-snackbar
                top
                :color=snackbarColor
                v-model="snackbar"
                style="margin-top:70px"
                :timeout=timeout
            >
                {{ snackbarMessage }}

        <template v-slot:action="{ attrs }">
            <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="snackbar = false"
            >
            Close
            </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>


<script>
import EventBus, { ACTIONS } from './Helpers/EventBus.js';

  export default {
    props:{
    },
    data () {
      return {
        snackbar: false,
        snackbarColor: "success",
        snackbarMessage: "",
        timeout: 3000,
      }
    },
    mounted() {
        EventBus.$on(ACTIONS.SNACKBAR_OK, message => {
          this.snackbarMessage = message;
          this.snackbarColor = "success";
          this.timeout = 3000;
          this.snackbar = true;
        });
        EventBus.$on(ACTIONS.SNACKBAR_KO, message => {
          this.snackbarMessage = message;
          this.snackbarColor = "warning";
          this.timeout = 10000;
          this.snackbar = true;
        });
    },
    watch: { 
    }
  }
</script>
