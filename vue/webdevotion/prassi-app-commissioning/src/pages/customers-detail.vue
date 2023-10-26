<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <div class="row q-mb-sm no-wrap">
      <prassi-customer-data-main
        class="col-9 q-mr-sm"
        :customer="customer"
        :menu="menuCustomer"
        @changeMenu="changeMenuCustomer"
      />
      <prassi-customer-data-small class="col" :customer="customer" />
    </div>

    <router-view />

    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiCustomerDataMain from '../components/customer/prassi-customer-data-main';
import PrassiCustomerDataSmall from '../components/customer/prassi-customer-data-small';

export default {
  name: 'CustomersDetail',
  components: {
    PrassiCustomerDataMain,
    PrassiCustomerDataSmall,
  },
  data() {
    return {
      menuCustomer: 'history',
    };
  },
  computed: {
    ...mapState({
      customer: (state) => state.dossiers.customer,
      isFetching: (state) => state.error.isFetching,
      errorNotFound: (state) => state.error.errorNotFound,
    }),
  },
  watch: {
    errorNotFound(error) {
      this.$utils.log('CUSTOMERS-DETAIL', `not found ${error}`);
      if (error) this.$router.replace('/promoters');
    },
    '$route.path': {
      immediate: true,
      // eslint-disable-next-line no-unused-vars
      handler(path) {
        this.$utils.logobj('CUSTOMERS-DETAIL', `ROUTE ${this.$route.path}`, this.$route.name);
        if (!this.$route.name) return;

        if (this.$route.params.id && this.$route.params.id !== this.customer._id) {
          this.fetchCustomer(this.$route.params.id);
        }

        // eslint-disable-next-line sonarjs/no-all-duplicated-branches,sonarjs/no-small-switch
        switch (this.$route.name) {
          case 'history':
            this.$utils.log('CUSTOMERS-DETAIL', `history`);
            this.setCustomerFilter({
              ...this.filter,
              customerId: this.$route.params.id,
            });
            this.resetCustomerInsurer();
            break;
          default:
            break;
        }

        this.menuCustomer = this.$route.name;
      },
    },
  },
  methods: {
    ...mapActions({
      fetchCustomer: 'dossiers/fetchCustomer',
    }),
    ...mapMutations({
      resetError: 'error/resetError',
      resetCustomerInsurer: 'configuration/resetCustomerInsurer',
      setCustomerFilter: 'configuration/setCustomerFilter',
    }),
    changeMenuCustomer(menu) {
      this.$utils.log('CUSTOMERS-DETAIL', `menuCustomer ${menu}`);
      switch (menu) {
        case 'history':
          this.$router.push(`/customers/${this.$route.params.id}/history`);
          break;
        case 'details':
          this.$router.push(`/customers/${this.$route.params.id}/details`);
          break;
        default:
          break;
      }
    },
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
