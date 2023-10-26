<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column fill-available">
    <div class="row q-mb-sm">
      <prassi-header-summary
        :blocks="summary"
        class="col q-mr-sm"
        :pending-summary="pendingSummary"
        :pending-summary-previous="pendingSummaryPrevious"
      />
      <prassi-date-range-block
        only-month
        :filter="filter.time"
        @changed="filterDateChange"
        :disabled="pendingSummary || pendingSummaryPrevious || pendingList"
      />
    </div>

    <prassi-filter
      :menus="menuFilter"
      overdue
      @changed="filterTypeChange"
      @changedOption="filterOptionChange"
    />
    <prassi-dossier-filter
      :company-types="companyList"
      :product-types="productsList"
      :promoters="promoters"
      :network="network"
      :roles="roles"
      :disabled="pending"
      @changed="
        filterDossierChange($event);
        setProductsFilter($event);
      "
    />

    <prassi-accounting-overdue-list
      ref="accountingList"
      :is-fetching="isFetching || pendingList"
      :transactions="dossiers"
      @loadMore="loadMoreTransactions"
      @viewClick="viewDossier($event)"
    />
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiDateRangeBlock from '../components/base/prassi-date-range-block';
import PrassiHeaderSummary from '../components/base/prassi-header-summary';
import PrassiAccountingOverdueList from '../components/accounting/prassi-accounting-overdue-list';
import PrassiFilter from '../components/base/prassi-filter';
import PrassiDossierFilter from '../components/dossier/prassi-dossier-filter';
import useProducts from '../compositions/base/products';

export default {
  name: 'Overdue',
  components: {
    PrassiAccountingOverdueList,
    PrassiDateRangeBlock,
    PrassiHeaderSummary,
    PrassiFilter,
    PrassiDossierFilter,
  },
  setup() {
    const { productsList, setProductsFilter } = useProducts();
    return { productsList, setProductsFilter };
  },
  data() {
    return {
      pendingSummary: false,
      pendingSummaryPrevious: false,
      pendingList: false,
      menuFilter: [
        {
          _id: 'all',
          label: this.$t('dossiers.all'),
        },
        {
          _id: 'direct',
          label: this.$t('dossiers.direct'),
        },
        {
          _id: 'indirect',
          label: this.$t('dossiers.indirect'),
        },
      ],
    };
  },
  created() {
    this.resetPromoterSearch();
    this.resetDossiersSearch();
  },
  mounted() {
    this.resetDossiersSummary();
    this.pendingList = true;
    this.pendingSummary = true;
    this.pendingSummaryPrevious = true;
    const filterPreviousDate = this.$utils.subtractDate(this.filter.time, 'all');
    this.setDossiersFilterPreviousDate(filterPreviousDate);
    this.fetchOverdueSummary(this.filter.fields.promoterId || this.loginId).finally(
      // eslint-disable-next-line no-return-assign
      () => (this.pendingSummary = false),
    );
    this.fetchOverdueSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
      // eslint-disable-next-line no-return-assign
      () => (this.pendingSummaryPrevious = false),
    );
    this.filterCurrentNetwork();
    this.filterCurrentPromoters();
    this.resetDossiers();
  },
  computed: {
    ...mapState({
      filter: (state) => state.dossiers.filter,
      loginId: (state) => state.login._id,
      isFetching: (state) => state.error.isFetching,
      error: (state) => state.error.error,
      last: (state) => state.dossiers.dossiers.lastRecord,
      companies: (state) => state.acquittance.companies.items,
      summary: (state) => [
        {
          _id: 'insured',
          title: 'dossiers.insured',
          value: state.dossiers.summaryOverdue.insured
            ? state.dossiers.summaryOverdue.insured
            : undefined,
          previousValue: state.dossiers.summaryOverdue.previousInsured
            ? state.dossiers.summaryOverdue.previousInsured
            : undefined,
          percentage: state.dossiers.summaryOverdue.percentageInsured,
        },
        {
          _id: 'premiums',
          title: 'dossiers.premiums',
          value: state.dossiers.summaryOverdue.premiums / 100,
          previousValue: state.dossiers.summaryOverdue.previousPremiums / 100,
          percentage: state.dossiers.summaryOverdue.percentagePremiums,
          currency: true,
          flickr: true,
        },
        {
          _id: 'iv',
          title: 'dossiers.iv',
          value: state.dossiers.summaryOverdue.iv / 100,
          previousValue: state.dossiers.summaryOverdue.previousIV / 100,
          percentage: state.dossiers.summaryOverdue.percentageIV,
        },
        {
          _id: 'pc',
          title: 'dossiers.installments',
          value: state.dossiers.summaryOverdue.pc / 100,
          previousValue: state.dossiers.summaryOverdue.previousPC / 100,
          percentage: state.dossiers.summaryOverdue.percentagePC,
        },
        {
          _id: 'dossiers',
          title: 'dossiers.dossiers',
          value: state.dossiers.summaryOverdue.dossiers / 100,
          previousValue: state.dossiers.summaryOverdue.previousDossiers / 100,
          percentage: state.dossiers.summaryOverdue.percentageDossiers,
        },
      ],
      dossiers: (state) => state.dossiers.dossiers.items,
      promoters: (state) => state.promoters.promoters.items,
      network: (state) => state.promoters.network.items,
      token: (state) => state.login.token,
      roles: (state) => state.promoters.roles.items,
    }),
    pending() {
      return this.pendingSummary || this.pendingSummaryPrevious || this.pendingList;
    },
    companyList() {
      return this.companies.map((el) => ({
        label: el.name,
        value: el._id,
      }));
    },
  },
  methods: {
    ...mapActions({
      fetchOverdue: 'dossiers/fetchOverdue',
      fetchOverdueSummary: 'dossiers/fetchOverdueSummary',
      fetchOverdueSummaryPrevious: 'dossiers/fetchOverdueSummaryPrevious',
      fetchAllPromotersPeriod: 'promoters/fetchAllPromotersPeriod',
      fetchAllPromoters: 'promoters/fetchAllPromoters',
      fetchNetworkPeriod: 'promoters/fetchNetworkPeriod',
      fetchNetwork: 'promoters/fetchNetwork',
      fetchAllProducts: 'accounting/fetchAllProducts',
    }),
    ...mapMutations({
      resetDossiersSearch: 'dossiers/resetDossiersSearch',
      resetPromoterSearch: 'promoters/resetPromoterSearch',
      resetDossiers: 'dossiers/resetDossiers',
      resetDossiersSummary: 'dossiers/resetDossiersSummary',
      setDossiersFilterDate: 'dossiers/setDossiersFilterDate',
      setDossiersFilterPreviousDate: 'dossiers/setDossiersFilterPreviousDate',
      setDossiersFilterSelected: 'dossiers/setDossiersFilterSelected',
      setDossiersFilterPromoter: 'dossiers/setDossiersFilterPromoter',
      setDossiersFilterOption: 'dossiers/setDossiersFilterOption',
      setDossiersFilterAll: 'dossiers/setDossiersFilterAll',
    }),
    filterCurrentNetwork() {
      if (this.filter.time.selected === 'year') {
        this.fetchNetwork();
      } else {
        this.fetchNetworkPeriod({
          year: this.filter.time.year,
          month: this.filter.time.month,
          quarter: this.filter.time.quarter,
          selected: this.filter.time.selected,
        });
      }
    },
    filterCurrentPromoters() {
      if (this.filter.time.selected === 'year') {
        this.fetchAllPromoters();
      } else {
        this.fetchAllPromotersPeriod({
          year: this.filter.time.year,
          month: this.filter.time.month,
          quarter: this.filter.time.quarter,
          selected: this.filter.time.selected,
          networkId: this.filter.fields.networkId,
        });
      }
    },
    filterTypeChange(value) {
      this.$utils.logobj('DOSSIERS', 'filterTypeChange', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.resetDossiersSummary();
      this.resetDossiers();
      this.setDossiersFilterSelected(value.selected);
      this.fetchOverdueSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchOverdueSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
    },
    filterOptionChange(value) {
      this.$utils.logobj('DOSSIERS', 'filterOptionChange', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.resetDossiersSummary();
      this.resetDossiers();
      this.setDossiersFilterOption(value);
      this.fetchOverdueSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchOverdueSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
    },
    filterDateChange(filterDate) {
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.resetDossiers();
      this.resetDossiersSummary();
      this.setDossiersFilterDate(filterDate);
      const filterPreviousDate = this.$utils.subtractDate(filterDate, 'all');
      this.setDossiersFilterPreviousDate(filterPreviousDate);
      this.fetchOverdueSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchOverdueSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentNetwork();
      this.filterCurrentPromoters();
    },
    filterDossierChange(value) {
      this.$utils.logobj('ACCOUNTING', 'filterDossierChange', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.setDossiersFilterAll(value);
      this.resetDossiersSummary();
      this.resetDossiers();
      this.setDossiersFilterAll({
        ...value,
        promoterId: value.promoterId === 'no-selection' ? this.loginId : value.promoterId,
      });
      this.fetchOverdueSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchOverdueSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentPromoters();
      this.fetchAllProducts(this.filter.fields.company);
    },
    viewDossier(id) {
      this.$utils.logobj('ACCOUNTING', 'viewDossier', id);
      const msId = id.split('-');
      const msId1 =
        msId[0].slice(6, 8) + msId[0].slice(4, 6) + msId[0].slice(2, 4) + msId[0].slice(0, 2);
      const msId2 = msId[1].slice(2, 4) + msId[1].slice(0, 2);
      const msId3 = msId[2].slice(2, 4) + msId[2].slice(0, 2);
      window.open(
        `${this.$env.legacyBaseUrl}/#/contratto/${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}?token=${this.token}`,
        '_self',
      );
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreTransactions({ index, done }) {
      this.$utils.log('ACCOUNTING', `loadMoreTransactions called: ${index}`);
      if (this.last || this.error) {
        this.pendingList = false;
        this.$refs.accountingList.stopScrolling();
      } else {
        this.fetchOverdue(this.filter.fields.promoterId || this.loginId).finally(() => {
          this.pendingList = false;
          done();
        });
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
</style>
