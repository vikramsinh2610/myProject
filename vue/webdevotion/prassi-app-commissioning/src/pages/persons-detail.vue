<template>
  <q-page v-if="customer.id" class="q-px-sm q-pt-sm p-centered-container column">
    <div class="row q-mb-sm no-wrap">
      <prassi-person-data-main
        class="col-9 q-mr-sm"
        :customer="customer"
        :menu="menuCustomer"
        @changeMenu="changeMenuCustomer"
      />
      <div class="col" v-if="summary">
        <prassi-person-data-small class="col" :customer="customer" :summary="summary" />
      </div>
    </div>

    <router-view />

    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiPersonDataMain from '../components/customer/prassi-person-data-main';
import PrassiPersonDataSmall from '../components/customer/prassi-person-data-small';

export default {
  name: 'PersonsDetail',
  components: {
    PrassiPersonDataMain,
    PrassiPersonDataSmall,
  },
  data() {
    return {
      menuCustomer: 'dashboard',
    };
  },
  computed: {
    ...mapState({
      token: (state) => state.login.token,
      loginId: (state) => state.login._id,
      customer: (state) => state.dossiers.customer,
      summary: (state) => state.dossiers.summary,
      isFetching: (state) => state.error.isFetching,
      errorNotFound: (state) => state.error.errorNotFound,
    }),
  },
  watch: {
    errorNotFound(error) {
      this.$utils.log('PERSONS-DETAIL', `not found ${error}`);
      if (error) this.$router.replace('/persons');
    },
    '$route.path': {
      immediate: true,
      // eslint-disable-next-line no-unused-vars
      handler(path) {
        this.$utils.logobj('PERSONS-DETAIL', `ROUTE ${this.$route.path}`, this.$route.name);
        if (!this.$route.name) return;

        if (this.$route.params.id && this.$route.params.id !== this.customer._id) {
          const customerId = this.$route.params.id;
          this.setCustomerId(customerId);
          this.setAllPeriods(true);
          this.fetchPerson(customerId);
          this.fetchPersonsSummary({
            promoterId: this.loginId,
          });
        }

        // eslint-disable-next-line sonarjs/no-all-duplicated-branches,sonarjs/no-small-switch
        switch (this.$route.name) {
          case 'dashboard':
            this.$utils.log('PERSONS-DETAIL', `dashboard`);
            this.resetDossiers();
            break;
          case 'history':
            this.$utils.log('PERSONS-DETAIL', `history`);
            this.setCustomerFilter({
              ...this.filter,
              customerId: this.$route.params.id,
            });
            this.resetCustomerInsurer();
            break;
          case 'identity':
            this.$utils.log('PERSONS-DETAIL', `identity`);
            this.resetPersonDocuments();
            break;
          case 'persons':
            this.$utils.log('PERSONS-DETAIL', `persons`);
            this.resetPersonPersons();
            break;
          case 'companies':
            this.$utils.log('PERSONS-DETAIL', `companies`);
            this.resetPersonCompanies();
            break;
          case 'dossiers':
            this.$utils.log('PERSONS-DETAIL', `dossiers`);
            this.resetDossiers();
            break;
          case 'relations':
            this.$utils.log('PERSONS-DETAIL', `relations`);
            this.resetPersonRelations();
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
      fetchPerson: 'dossiers/fetchPerson',
      fetchPersonsSummary: 'dossiers/fetchPersonsSummary',
    }),
    ...mapMutations({
      resetError: 'error/resetError',
      resetCustomerInsurer: 'configuration/resetCustomerInsurer',
      resetPersonDocuments: 'dossiers/resetPersonDocuments',
      resetPersonPersons: 'dossiers/resetPersonPersons',
      resetPersonCompanies: 'dossiers/resetPersonCompanies',
      resetPersonRelations: 'dossiers/resetPersonRelations',
      resetDossiers: 'dossiers/resetDossiers',
      setCustomerFilter: 'configuration/setCustomerFilter',
      setCustomerId: 'dossiers/setCustomerId',
      setAllPeriods: 'dossiers/setAllPeriods',
    }),
    changeMenuCustomer(menu) {
      this.$utils.log('CUSTOMERS-DETAIL', `menuCustomer ${menu}`);
      // eslint-disable-next-line prefer-destructuring
      const id = this.$route.params.id;
      const msId = id.split('-');
      const msId1 =
        msId[0].slice(6, 8) + msId[0].slice(4, 6) + msId[0].slice(2, 4) + msId[0].slice(0, 2);
      const msId2 = msId[1].slice(2, 4) + msId[1].slice(0, 2);
      const msId3 = msId[2].slice(2, 4) + msId[2].slice(0, 2);

      switch (menu) {
        case 'dashboard':
          this.$router.push(`/persons/${this.$route.params.id}/dashboard`);
          break;
        case 'dashboard-legacy':
          window.open(
            `${this.$env.legacyBaseUrl}/#/clienti/${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}/dashboard-new?token=${this.token}`,
            '_self',
          );
          break;
        case 'history':
          this.$router.push(`/persons/${this.$route.params.id}/history`);
          break;
        case 'detail':
          this.$router.push(`/persons/${this.$route.params.id}/detail`);
          break;
        case 'precontractual-list':
          this.$router.push(`/persons/${this.$route.params.id}/precontractual-list`);
          break;
        case 'inquiry-survey-list':
          this.$router.push(`/persons/${this.$route.params.id}/inquiry-survey`);
          break;
        case 'consulting-list':
          this.$router.push(`/persons/${this.$route.params.id}/consulting`);
          break;
        case 'identity':
          this.$router.push(`/persons/${this.$route.params.id}/identity`);
          break;
        case 'persons':
          this.$router.push(`/persons/${this.$route.params.id}/persons`);
          break;
        case 'companies':
          this.$router.push(`/persons/${this.$route.params.id}/companies`);
          break;
        case 'dossiers':
          this.$router.push(`/persons/${this.$route.params.id}/dossiers`);
          break;
        case 'relations':
          this.$router.push(`/persons/${this.$route.params.id}/relations`);
          break;
        case 'duplicates':
          this.$router.push(`/persons/${this.$route.params.id}/duplicates`);
          break;
        case 'survey-results':
          this.$router.push(`/persons/${this.$route.params.id}/survey-results`);
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
  min-width 1240px
  max-width fit-content
.center-spinner
  display block
  margin auto
</style>
