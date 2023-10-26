<template>
  <span>
      <v-btn 
        color="primary"
        dark
        block
        style="margin-left:5px; margin-right:5px"
        @click="btnClickedHandler()">{{(this.params.value) ? "Attiva" : "Disattiva" }}</v-btn>
  </span>
</template>


<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
      btnClickedHandler() {
        this.params.clicked(this.params);
      }
    }
  }
</script>
