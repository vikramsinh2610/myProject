<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <router-view />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'Invoicing',
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
        this.$utils.logobj('INVOICING', `ROUTE ${name}`, this.$route.matched);
        if (!name) return;

        switch (name) {
          case 'invoicings':
            this.resetInvoicings();
            this.fetchInvoicings();
            break;
          case 'invoicing':
            this.resetInvoicing();
            this.fetchInvoicing(this.$route.params.id);
            break;
          default:
            break;
        }
      },
    },
  },
  methods: {
    ...mapActions({
      fetchInvoicings: 'invoicing/fetchInvoicings',
      fetchInvoicing: 'invoicing/fetchInvoicing',
    }),
    ...mapMutations({
      resetInvoicings: 'invoicing/resetInvoicings',
      resetInvoicing: 'invoicing/resetInvoicing',
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
