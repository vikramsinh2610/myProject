<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <router-view />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'PayIn',
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      summary: (state) => [
        {
          _id: 'company',
          title: 'payIn.company',
          value: state.accounting.summary.margin,
          previousValue: state.accounting.summary.previousMargin,
          percentage: state.accounting.summary.percentageMargin,
          currency: true,
        },
        {
          _id: 'calculated',
          title: 'payIn.calculated',
          value: state.accounting.summary.in,
          previousValue: state.accounting.summary.previousIn,
          percentage: state.accounting.summary.percentageIn,
          currency: true,
          flickr: true,
        },
        {
          _id: 'difference',
          title: 'payIn.difference',
          value: state.accounting.summary.out,
          previousValue: state.accounting.summary.previousOut,
          percentage: state.accounting.summary.percentageOut,
          currency: true,
        },
        {
          _id: 'number',
          title: 'payIn.number',
          value: state.accounting.summary.transactions,
          previousValue: state.accounting.summary.previousTransactions,
          percentage: state.accounting.summary.percentageTransactions,
        },
      ],
      filter: (state) => state.accounting.filter,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  watch: {
    '$route.name': {
      immediate: true,
      handler(name) {
        this.$utils.logobj('PAY-IN', `ROUTE ${name}`, this.$route.matched);
        if (!name) return;

        // eslint-disable-next-line sonarjs/no-small-switch
        switch (name) {
          case 'payins':
            this.resetAcquittances();
            break;
          case 'payin':
            this.resetAcquittance();
            this.fetchAcquittance(this.$route.params.id);
            break;
          default:
            break;
        }
      },
    },
  },
  methods: {
    ...mapActions({
      fetchAccountingSummary: 'accounting/fetchAccountingSummary',
      fetchAcquittance: 'acquittance/fetchAcquittance',
      fetchAcquittances: 'acquittance/fetchAcquittances',
    }),
    ...mapMutations({
      resetAcquittance: 'acquittance/resetAcquittance',
      resetAcquittances: 'acquittance/resetAcquittances',
      setAccountingFilterYear: 'accounting/setAccountingFilterYear',
      setAccountingFilterSelected: 'accounting/setAccountingFilterSelected',
    }),
    filterDateChange(filterDate) {
      this.$utils.logobj('ACCOUNTING', 'filterDate', filterDate);
      this.setAccountingFilterYear(filterDate.year);
      this.fetchAccountingSummary(this.rootId).then(async () => {
        await this.resetAcquittances();
        await this.fetchAcquittances();
      });
    },
    filterTypeChange(filterType) {
      this.$utils.logobj('ACCOUNTING', 'filterTypeChange', filterType);
      this.setAccountingFilterSelected(filterType.selected);
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
  margin 0 auto
</style>
