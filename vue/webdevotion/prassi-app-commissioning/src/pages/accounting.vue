<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column fill-available">
    <div class="row q-mb-sm">
      <prassi-header-summary :blocks="summary" class="col q-mr-sm" />
      <prassi-date-range-block
        :filter="filter.time"
        date-flow="onlyBackward"
        @changed="filterDateChange"
      />
    </div>

    <prassi-filter :menus="menuFilter" :filter="filter.type" @changed="filterTypeChange" />

    <prassi-accounting-filter
      show-type
      :company-types="companyList"
      :product-types="productsList"
      :type-list="filterTypeList"
      :filter="filter.fields"
      @changed="
        filterFieldsChange($event);
        setProductsFilter($event);
      "
    />

    <prassi-accounting-list
      ref="accountingList"
      :is-fetching="isFetching"
      :transactions="transactions"
      @loadMore="loadMoreTransactions"
    />

    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiDateRangeBlock from '../components/base/prassi-date-range-block';
import PrassiHeaderSummary from '../components/base/prassi-header-summary';
import PrassiFilter from '../components/base/prassi-filter';
import PrassiAccountingFilter from '../components/accounting/prassi-accounting-filter';
import PrassiAccountingList from '../components/accounting/prassi-accounting-list';
import useProducts from '../compositions/base/products';

export default {
  name: 'Accounting',
  components: {
    PrassiHeaderSummary,
    PrassiDateRangeBlock,
    PrassiFilter,
    PrassiAccountingList,
    PrassiAccountingFilter,
  },
  setup() {
    const { productsList, setProductsFilter } = useProducts();
    return { productsList, setProductsFilter };
  },
  data() {
    return {
      menuFilter: [
        {
          _id: 'in',
          label: this.$t('accounting.incomes'),
        },
        {
          _id: 'out',
          label: this.$t('accounting.outcomes'),
        },
        {
          _id: 'all',
          label: this.$t('accounting.all'),
        },
      ],
      filterTypeList: [
        {
          label: 'Tutti',
          value: 'no-selection',
        },
        {
          label: 'Acquisto',
          value: 'purchase',
        },
        {
          label: 'Incasso',
          value: 'cash-in',
        },
        {
          label: 'Anticipo',
          value: 'advance',
        },
        {
          label: 'Management fee',
          value: 'management-fee',
        },
      ],
    };
  },
  mounted() {
    this.resetTransactions();
  },
  computed: {
    ...mapState({
      summary: (state) => [
        {
          _id: 'margin',
          title: 'accounting.margin',
          value: state.accounting.summary.margin / 100,
          previousValue: state.accounting.summary.previousMargin / 100,
          percentage: state.accounting.summary.percentageMargin,
          currency: true,
        },
        {
          _id: 'in',
          title: 'accounting.in',
          value: state.accounting.summary.in / 100,
          previousValue: state.accounting.summary.previousIn / 100,
          percentage: state.accounting.summary.percentageIn,
          currency: true,
          flickr: true,
        },
        {
          _id: 'out',
          title: 'accounting.out',
          value: state.accounting.summary.out / 100,
          previousValue: state.accounting.summary.previousOut / 100,
          percentage: state.accounting.summary.percentageOut,
          currency: true,
        },
        {
          _id: 'transactions',
          title: 'accounting.transactions',
          value: state.accounting.summary.transactions,
          previousValue: state.accounting.summary.previousTransactions,
          percentage: state.accounting.summary.percentageTransactions,
        },
      ],
      filter: (state) => state.accounting.filter,
      isFetching: (state) => state.error.isFetching,
      error: (state) => state.error.error,
      transactions: (state) => state.accounting.transactions.items,
      last: (state) => state.accounting.transactions.lastRecord,
      companies: (state) => state.acquittance.companies.items,
    }),
    companyList() {
      return this.companies.map((el) => ({
        label: el.name,
        value: el._id,
      }));
    },
  },
  methods: {
    ...mapActions({
      fetchTransactions: 'accounting/fetchTransactions',
    }),
    ...mapMutations({
      resetTransactions: 'accounting/resetTransactions',
      setAccountingFilterDate: 'accounting/setAccountingFilterDate',
      setAccountingFilterSelected: 'accounting/setAccountingFilterSelected',
      setAccountingFilterFields: 'accounting/setAccountingFilterFields',
    }),
    filterDateChange(filterDate) {
      this.$utils.logobj('ACCOUNTING', 'filterDate', filterDate);
      this.setAccountingFilterDate(filterDate);
      this.resetTransactions();
      this.$refs.accountingList.resumeScrolling();
      this.$refs.accountingList.forceScrolling();
    },
    filterTypeChange(filterType) {
      this.$utils.logobj('ACCOUNTING', 'filterTypeChange', filterType);
      this.setAccountingFilterSelected(filterType.selected);
      this.resetTransactions();
      this.$refs.accountingList.resumeScrolling();
      this.$refs.accountingList.forceScrolling();
    },
    filterFieldsChange(filterFields) {
      this.$utils.logobj('ACCOUNTING', 'filterFieldsChange', filterFields);
      this.setAccountingFilterFields(filterFields);
      this.resetTransactions();
      this.$refs.accountingList.resumeScrolling();
      this.$refs.accountingList.forceScrolling();
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreTransactions({ index, done }) {
      this.$utils.log('ACCOUNTING', `loadMoreTransactions called: ${index}`);
      if (this.last || this.error) {
        this.$refs.accountingList.stopScrolling();
      } else {
        this.fetchTransactions().finally(() => done());
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
