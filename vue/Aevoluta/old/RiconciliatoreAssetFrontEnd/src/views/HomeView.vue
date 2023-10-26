<template>
<div id="prova">
 
    <RobotHome></RobotHome>
</div>
     
</template>

<script>

import RobotHome from '@/components/RobotHome.vue'


  
  export default {
    // eslint-disable-next-line
    name: 'Home',

    components: {
      RobotHome,
    },
    async created() {
      await this.$store.commit('auth/setIsLoading', false);
    }
  }
</script>

<style>
</style>
