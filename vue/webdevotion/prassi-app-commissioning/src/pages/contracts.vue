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
        :disabled="pending || allPeriods"
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
      <q-fab icon="fa fa-chevron-up" active-icon="fa fa-times" direction="up" color="secondary">
        <q-fab-action @click="downloadExport()" color="secondary" icon="fa fa-download">
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('default.downloadExport') }}
          </q-tooltip>
        </q-fab-action>
        <q-fab-action
          @click="downloadAdvisoryFeePromotersExport()"
          color="secondary"
          icon="fa fa-download"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('default.downloadAdvisoryFeePromotersExport') }}
          </q-tooltip>
        </q-fab-action>
        <q-fab-action
          @click="downloadAdvisoryFeeInvoiceExport()"
          color="secondary"
          icon="fa fa-download"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('default.downloadAdvisoryFeeInvoiceExport') }}
          </q-tooltip>
        </q-fab-action>
        <q-fab-action
          v-if="$user.roleID >= 7"
          @click="newContract()"
          color="primary"
          icon="fa fa-plus-white"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('default.newContract') }}
          </q-tooltip>
        </q-fab-action>
      </q-fab>
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
          label: 'In vigore',
          value: 6,
        },
        {
          label: 'In elaborazione',
          value: 4,
        },
        {
          label: 'Chiusa',
          value: 7,
        },
        {
          label: 'Sospesa',
          value: 9,
        },
        {
          label: 'Al corrente',
          value: 10,
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
    this.fetchContractsSummary(this.filter.fields.promoterId || this.loginId).finally(
      // eslint-disable-next-line no-return-assign
      () => (this.pendingSummary = false),
    );
    this.fetchContractsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
      // eslint-disable-next-line no-return-assign
      () => (this.pendingSummaryPrevious = false),
    );
    this.filterCurrentNetwork();
    this.filterCurrentPromoters();
    this.resetDossiers();
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
      fetchContractsSummary: 'dossiers/fetchContractsSummary',
      fetchContractsSummaryPrevious: 'dossiers/fetchContractsSummaryPrevious',
      fetchContracts: 'dossiers/fetchContracts',
      fetchAllPromotersPeriod: 'promoters/fetchAllPromotersPeriod',
      fetchAllPromoters: 'promoters/fetchAllPromoters',
      fetchNetworkPeriod: 'promoters/fetchNetworkPeriod',
      fetchNetwork: 'promoters/fetchNetwork',
      fetchContractsExcelReport: 'dossiers/fetchContractsExcelReport',
      fetchAdvisoryFeePromotersCsvReport: 'dossiers/fetchAdvisoryFeePromotersCsvReport',
      fetchAdvisoryFeeInvoiceCsvReport: 'dossiers/fetchAdvisoryFeeInvoiceCsvReport',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
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
    }),
    downloadExport() {
      this.$q.loading.show({ delay: 200 });
      this.fetchContractsExcelReport(this.filter.fields.promoterId || this.loginId).then(() => {
        this.fetchDocumentUrl(this.report.documentId)
          .then(() => {
            download(this.document.url, this.document.displayName);
          })
          .finally(() => {
            this.$q.loading.hide();
          });
      });
    },
    downloadAdvisoryFeePromotersExport() {
      this.$q.loading.show({ delay: 200 });
      this.fetchAdvisoryFeePromotersCsvReport(this.filter.fields.promoterId || this.loginId).then(
        // eslint-disable-next-line sonarjs/no-identical-functions
        () => {
          this.fetchDocumentUrl(this.report.documentId)
            .then(() => {
              download(this.document.url, this.document.displayName);
            })
            .finally(() => {
              this.$q.loading.hide();
            });
        },
      );
    },
    downloadAdvisoryFeeInvoiceExport() {
      this.$q.loading.show({ delay: 200 });
      this.fetchAdvisoryFeeInvoiceCsvReport(this.filter.fields.promoterId || this.loginId).then(
        // eslint-disable-next-line sonarjs/no-identical-functions
        () => {
          this.fetchDocumentUrl(this.report.documentId)
            .then(() => {
              download(this.document.url, this.document.displayName);
            })
            .finally(() => {
              this.$q.loading.hide();
            });
        },
      );
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
      this.fetchContractsSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchContractsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentPromoters();
    },
    filterTypeChange(value) {
      this.$utils.logobj('DOSSIERS', 'filterTypeChange', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.resetDossiers();
      this.resetDossiersSummary();
      this.setDossiersFilterSelected(value.selected);
      this.fetchContractsSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchContractsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
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
      this.fetchContractsSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchContractsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
    },
    filterToggleChange2(value) {
      this.$utils.logobj('CUSTOMERS', 'filterToggleChange2', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.resetDossiers();
      this.resetDossiersSummary();
      this.setDossiersFilterSolar(value);
      this.fetchContractsSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchContractsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
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
      this.fetchContractsSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchContractsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentNetwork();
      this.filterCurrentPromoters();
    },
    viewDossier(dossier) {
      this.$utils.logobj('CONTRACTS', 'viewDossier', dossier);
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
    newContract() {
      window.open(`${this.$env.legacyBaseUrl}/#/contratto/nuovo`, '_self');
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreDossiers({ index, done }) {
      if (this.last || this.error) {
        this.$refs.dossierList.stopScrolling();
        this.pendingList = false;
      } else {
        this.fetchContracts(this.filter.fields.promoterId || this.loginId).finally(() => {
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
</style>
