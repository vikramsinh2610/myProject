<template>
  <q-layout>
    <q-page-container> <router-view /> </q-page-container>

    <offline @detected-condition="handleConnectivityChange" />
    <q-page-sticky position="bottom-left" :offset="[23, 23]" v-if="!network">
      <q-btn color="red" :label="$t('main.network')" />
    </q-page-sticky>
  </q-layout>
</template>

<script>
import offline from 'v-offline';
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'LoginLayout',
  components: {
    offline,
  },
  data() {
    return {
      leftDrawer: true,
    };
  },
  computed: {
    ...mapState({
      network: (state) => state.error.network,
    }),
  },
  methods: {
    ...mapMutations({
      setNetwork: 'error/setNetwork',
    }),
    handleConnectivityChange(status) {
      this.setNetwork(status);
    },
  },
};
</script>

<style lang="stylus" scoped>
.slogo
  max-width: 300px
</style>
