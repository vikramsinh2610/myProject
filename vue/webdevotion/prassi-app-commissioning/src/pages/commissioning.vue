<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <router-view />
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'Commissioning',
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  watch: {
    '$route.name': {
      immediate: true,
      handler(name) {
        this.$utils.logobj('COMMISSIONING', `ROUTE ${name}`, this.$route.matched);
        if (!name) return;

        switch (name) {
          case 'commissionings':
            this.resetCommissionings();
            this.fetchCommissionings();
            break;
          case 'commissioning':
            this.resetCommissioning();
            this.fetchCommissioning(this.$route.params.id);
            break;
          default:
            break;
        }
      },
    },
  },
  methods: {
    ...mapActions({
      fetchCommissioningSummary: 'commissioning/fetchCommissioningSummary',
      fetchCommissionings: 'commissioning/fetchCommissionings',
      fetchCommissioning: 'commissioning/fetchCommissioning',
    }),
    ...mapMutations({
      resetCommissionings: 'commissioning/resetCommissionings',
      resetCommissioning: 'commissioning/resetCommissioning',
      setCommissioningFilterYear: 'commissioning/setCommissioningFilterYear',
      setCommissioningFilterSelected: 'commissioning/setCommissioningFilterSelected',
    }),
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 960px
  max-width fit-content
.center-spinner
  display block
  margin auto
</style>
