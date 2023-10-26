<template>
  <q-page class="flex flex-center">
    <img
      v-if="$env.edition === 'tcw'"
      class="animated bounce slogo"
      alt="Tcw logo"
      src="~assets/tcw-logo-login.png"
    />
    <img
      v-if="$env.edition === 'sheltia'"
      class="animated bounce slogo"
      alt="Sheltia logo"
      src="~assets/sheltia-logo-login.png"
    />
  </q-page>
</template>

<script>
export default {
  name: 'Index',
};
</script>

<style lang="stylus" scoped>
.slogo
  max-width: 90%
</style>
