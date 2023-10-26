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
        :filter="filter.time"
        @changed="filterDateChange"
        :disabled="pendingSummary || pendingSummaryPrevious || pendingList || allPeriods"
      />
    </div>

    <prassi-filter
      toggle
      :toggle-label="$t('dossiers.fullDossierSearch')"
      toggle2
      :toggle-label2="$t('dossiers.solarDossierSearch')"
      :menus="menuFilter"
      @changed="filterTypeChange"
      @changedToggle="filterToggleChange"
      @changedToggle2="filterToggleChange2"
    />
    <prassi-dossier-filter
      :company-types="companyList"
      :product-types="productsList"
      :status-list="statusList"
      :promoters="promoters"
      :network="network"
      :roles="roles"
      :disabled="pending"
      multiple-types
      multiple-states
      @changed="
        filterDossierChange($event);
        setProductsFilter($event);
      "
    />

    <prassi-dossier-list
      ref="dossierList"
      :is-fetching="isFetching || pendingList"
      :dossiers="dossiers"
      :roles="roles"
      @loadMore="loadMoreDossiers"
      @viewDossier="viewDossier($event)"
    />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="downloadExport()"
        icon="fa fa-download"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import download from 'getfile-rename-js';
import PrassiDateRangeBlock from '../components/base/prassi-date-range-block';
import PrassiHeaderSummary from '../components/base/prassi-header-summary';
import PrassiDossierList from '../components/dossier/prassi-dossier-list';
import PrassiDossierFilter from '../components/dossier/prassi-dossier-filter';
import PrassiFilter from '../components/base/prassi-filter';
import useProducts from '../compositions/base/products';

export default {
  name: 'Contracts',
  setup() {
    const { productsList, setProductsFilter } = useProducts();
    return { productsList, setProductsFilter };
  },
  data() {
    return {
      allPeriods: false,
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
      statusList: [
        {
          label: 'Approvata',
          value: 3,
        },
        {
          label: 'In vigore',
          value: 6,
        },
        {
          label: 'In elaborazione',
          value: 4,
        },
      ],
    };
  },
  components: {
    PrassiDossierFilter,
    PrassiHeaderSummary,
    PrassiDateRangeBlock,
    PrassiDossierList,
    PrassiFilter,
  },
  mounted() {
    this.resetDossiersSummary();
    this.pendingList = true;
    this.pendingSummary = true;
    this.pendingSummaryPrevious = true;
    this.resetDossiersSearch();
    const filterPreviousDate = this.$utils.subtractDate(this.filter.time, 'all');
    this.setDossiersFilterPreviousDate(filterPreviousDate);
    this.fetchProductionSummary(this.filter.fields.promoterId || this.loginId).finally(
      // eslint-disable-next-line no-return-assign
      () => (this.pendingSummary = false),
    );
    this.fetchProductionSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
      // eslint-disable-next-line no-return-assign
      () => (this.pendingSummaryPrevious = false),
    );
    this.resetPromoterSearch();
    this.filterCurrentNetwork();
    this.filterCurrentPromoters();
    this.resetDossiers();
    this.$refs.dossierList.resumeScrolling();
    this.$refs.dossierList.forceScrolling();
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      loginId: (state) => state.login._id,
      token: (state) => state.login.token,
      summary: (state) => [
        {
          _id: 'consultants',
          title: 'dossiers.consultants',
          value: state.dossiers.summary.consultants / 100,
          previousValue: state.dossiers.summary.previousConsultants / 100,
          percentage: state.dossiers.summary.percentageConsultants,
        },
        {
          _id: 'insured',
          title: 'dossiers.insured',
          value: state.dossiers.summary.insured ? state.dossiers.summary.insured : undefined,
          previousValue: state.dossiers.summary.previousInsured
            ? state.dossiers.summary.previousInsured
            : undefined,
          percentage: state.dossiers.summary.percentageInsured,
        },
        {
          _id: 'premiums',
          title: 'dossiers.premiums',
          value: state.dossiers.summary.premiums / 100,
          previousValue: state.dossiers.summary.previousPremiums / 100,
          percentage: state.dossiers.summary.percentagePremiums,
          currency: true,
          flickr: true,
        },
        {
          _id: 'iv',
          title: 'dossiers.iv',
          value: state.dossiers.summary.iv / 100,
          previousValue: state.dossiers.summary.previousIV / 100,
          percentage: state.dossiers.summary.percentageIV,
        },
        {
          _id: 'pc',
          title: 'dossiers.pc',
          value: state.dossiers.summary.pc / 100,
          previousValue: state.dossiers.summary.previousPC / 100,
          percentage: state.dossiers.summary.percentagePC,
        },
      ],
      dossiers: (state) => state.dossiers.dossiers.items,
      promoters: (state) => state.promoters.promoters.items,
      network: (state) => state.promoters.network.items,
      last: (state) => state.dossiers.dossiers.lastRecord,
      filter: (state) => state.dossiers.filter,
      isFetching: (state) => state.error.isFetching,
      companies: (state) => state.acquittance.companies.items,
      report: (state) => state.dossiers.report.item,
      document: (state) => state.documents.document.item,
      documents: (state) => state.invoicing.documents.items,
      roles: (state) => state.promoters.roles.items,
      exportId: (state) => state.dossiers.exportId,
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
      fetchProductionSummary: 'dossiers/fetchProductionSummary',
      fetchProductionSummaryPrevious: 'dossiers/fetchProductionSummaryPrevious',
      fetchProduction: 'dossiers/fetchProduction',
      fetchAllPromotersPeriod: 'promoters/fetchAllPromotersPeriod',
      fetchAllPromoters: 'promoters/fetchAllPromoters',
      fetchNetworkPeriod: 'promoters/fetchNetworkPeriod',
      fetchNetwork: 'promoters/fetchNetwork',
      fetchAllProducts: 'accounting/fetchAllProducts',
      fetchProductionExcelReport: 'dossiers/fetchProductionExcelReport',
      fetchProductionSheltiaExcelReport: 'dossiers/fetchProductionSheltiaExcelReport',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
      fetchExportUrl: 'documents/fetchExportUrl',
    }),
    ...mapMutations({
      resetDossiersSearch: 'dossiers/resetDossiersSearch',
      resetPromoterSearch: 'promoters/resetPromoterSearch',
      resetDossiersSummary: 'dossiers/resetDossiersSummary',
      resetDossiers: 'dossiers/resetDossiers',
      setDossiersFilterDate: 'dossiers/setDossiersFilterDate',
      setDossiersFilterPreviousDate: 'dossiers/setDossiersFilterPreviousDate',
      setDossiersFilterSelected: 'dossiers/setDossiersFilterSelected',
      setDossiersFilterPromoter: 'dossiers/setDossiersFilterPromoter',
      setDossiersFilterAll: 'dossiers/setDossiersFilterAll',
      setDossiersFilterFullSearch: 'dossiers/setDossiersFilterFullSearch',
      setDossiersFilterSolar: 'dossiers/setDossiersFilterSolar',
      changeExportInProgressState: 'documents/changeExportInProgressState',
      changeExportCompletedState: 'documents/changeExportCompletedState',
    }),
    downloadExport() {
      this.$q.loading.show({ delay: 200 });
      if (this.$env.edition === 'sheltia') {
        this.$q.loading.show({ delay: 200 });
        this.fetchProductionSheltiaExcelReport(this.filter.fields.promoterId || this.loginId)
          .then(() => {
            this.changeExportInProgressState(true);
            this.changeExportCompletedState(false);
            this.myExportTimer = setInterval(() => {
              this.fetchExportUrl(this.exportId).then(async () => {
                if (this.document.found) {
                  this.changeExportInProgressState(false);
                  this.changeExportCompletedState(true);
                  clearInterval(this.myExportTimer);
                }
              });
            }, 5000);
          })
          .finally(() => {
            this.$q.loading.hide();
          });
      } else {
        // eslint-disable-next-line sonarjs/no-identical-functions
        this.fetchProductionExcelReport(this.filter.fields.promoterId || this.loginId).then(() => {
          this.fetchDocumentUrl(this.report.documentId)
            .then(() => {
              download(this.document.url, this.document.displayName);
            })
            .finally(() => {
              this.$q.loading.hide();
            });
        });
      }
    },
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
    filterDossierChange(value) {
      this.$utils.logobj('DOSSIERS', 'filterDossierChange', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.resetDossiers();
      this.resetDossiersSummary();
      this.setDossiersFilterAll({
        ...value,
        promoterId: value.promoterId === 'no-selection' ? this.loginId : value.promoterId,
      });
      this.fetchProductionSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchProductionSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentPromoters();
      this.fetchAllProducts(this.filter.fields.company);
      this.$refs.dossierList.resumeScrolling();
      this.$refs.dossierList.forceScrolling();
    },
    filterToggleChange(value) {
      this.$utils.logobj('CUSTOMERS', 'filterToggleChange', value);
      this.allPeriods = value;
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.resetDossiers();
      this.resetDossiersSummary();
      this.setDossiersFilterFullSearch(value);
      this.fetchProductionSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchProductionSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.$refs.dossierList.resumeScrolling();
      this.$refs.dossierList.forceScrolling();
    },
    filterToggleChange2(value) {
      this.$utils.logobj('CUSTOMERS', 'filterToggleChange2', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.resetDossiers();
      this.resetDossiersSummary();
      this.setDossiersFilterSolar(value);
      this.fetchProductionSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchProductionSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.$refs.dossierList.resumeScrolling();
      this.$refs.dossierList.forceScrolling();
    },
    filterTypeChange(value) {
      this.$utils.logobj('DOSSIERS', 'filterDossierChange', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.resetDossiers();
      this.resetDossiersSummary();
      this.setDossiersFilterSelected(value.selected);
      this.fetchProductionSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchProductionSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.$refs.dossierList.resumeScrolling();
      this.$refs.dossierList.forceScrolling();
    },
    filterDateChange(filterDate) {
      this.$utils.logobj('DOSSIERS', 'filterDate', filterDate);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.resetDossiers();
      this.resetDossiersSummary();
      this.setDossiersFilterDate(filterDate);
      const filterPreviousDate = this.$utils.subtractDate(filterDate, 'all');
      this.setDossiersFilterPreviousDate(filterPreviousDate);
      this.fetchProductionSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchProductionSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentNetwork();
      this.filterCurrentPromoters();
      this.$refs.dossierList.resumeScrolling();
      this.$refs.dossierList.forceScrolling();
    },
    viewDossier(dossier) {
      this.$utils.logobj('PRODUCTION', 'viewDossier', dossier);
      const id = dossier.originalPracticeId;
      const msId = id.split('-');
      const msId1 =
        msId[0].slice(6, 8) + msId[0].slice(4, 6) + msId[0].slice(2, 4) + msId[0].slice(0, 2);
      const msId2 = msId[1].slice(2, 4) + msId[1].slice(0, 2);
      const msId3 = msId[2].slice(2, 4) + msId[2].slice(0, 2);
      if (dossier.type === 'special') {
        window.open(
          `${this.$env.legacyBaseUrl}/#/dettaglioPropostaEsterna/${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}?token=${this.token}`,
          '_self',
        );
      } else {
        window.open(
          `${this.$env.legacyBaseUrl}/#/contratto/${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}?token=${this.token}`,
          '_self',
        );
      }
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreDossiers({ index, done }) {
      if (this.last || this.error) {
        this.$refs.dossierList.stopScrolling();
        this.pendingList = false;
      } else {
        this.fetchProduction(this.filter.fields.promoterId || this.loginId).finally(() => {
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
  min-width 1240px
  max-width fit-content
.center-spinner
  display block
  margin auto
</style>
