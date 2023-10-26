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
      :menus="menuFilter"
      @changed="filterTypeChange"
      @changedToggle="filterToggleChange"
    />
    <prassi-dossier-filter
      confirmed-choice
      paid-choice
      small-columns
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

    <prassi-installments-list
      ref="accountingList"
      :is-fetching="isFetching || pendingList"
      :transactions="dossiers"
      :roles="roles"
      @menuClick="menuClick"
      @loadMore="loadMoreTransactions"
      @viewDossier="viewDossier($event)"
    />
    <q-dialog v-model="payinPayoutModal">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            {{
              this.$env.edition === 'tcw'
                ? this.$t('dossiers.menuPayinPayout')
                : this.$t('dossiers.menuPayinIv')
            }}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-between q-my-xs">
            <q-input v-model="payin" class="col-4" type="number" label="Payin" />
            <q-input
              v-if="this.$env.edition === 'tcw'"
              v-model="payout"
              class="col-4"
              type="number"
              :label="this.$env.edition === 'tcw' ? 'Payout' : 'IV'"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.applyButton')" @click="updatePayin" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiDateRangeBlock from '../components/base/prassi-date-range-block';
import PrassiHeaderSummary from '../components/base/prassi-header-summary';
import PrassiInstallmentsList from '../components/commissioning/prassi-installments-list';
import PrassiFilter from '../components/base/prassi-filter';
import PrassiDossierFilter from '../components/dossier/prassi-dossier-filter';
import useProducts from '../compositions/base/products';

export default {
  name: 'Installments',
  components: {
    PrassiInstallmentsList,
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
      payinPayoutModal: false,
      currentId: '',
      payin: 0,
      payout: 0,
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
    this.fetchInstallmentsSummary(this.filter.fields.promoterId || this.loginId).finally(
      // eslint-disable-next-line no-return-assign
      () => (this.pendingSummary = false),
    );
    this.fetchInstallmentsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
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
      fetchInstallments: 'dossiers/fetchInstallments',
      fetchInstallmentsSummary: 'dossiers/fetchInstallmentsSummary',
      fetchInstallmentsSummaryPrevious: 'dossiers/fetchInstallmentsSummaryPrevious',
      fetchAllPromotersPeriod: 'promoters/fetchAllPromotersPeriod',
      fetchAllPromoters: 'promoters/fetchAllPromoters',
      fetchNetworkPeriod: 'promoters/fetchNetworkPeriod',
      fetchNetwork: 'promoters/fetchNetwork',
      fetchAllProducts: 'accounting/fetchAllProducts',
      setInstallmentConfirmed: 'dossiers/setInstallmentConfirmed',
      setInstallmentPaid: 'dossiers/setInstallmentPaid',
      setInstallmentUnConfirmed: 'dossiers/setInstallmentUnConfirmed',
      setInstallmentUnPaid: 'dossiers/setInstallmentUnPaid',
      updatePayinPayout: 'dossiers/updatePayin',
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
      setDossiersFilterFullSearch: 'dossiers/setDossiersFilterFullSearch',
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
      this.fetchInstallmentsSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchInstallmentsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
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
      this.fetchInstallmentsSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchInstallmentsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
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
      this.fetchInstallmentsSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchInstallmentsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentNetwork();
      this.filterCurrentPromoters();
    },
    filterDossierChange(value) {
      this.$utils.logobj('INSTALLMENTS', 'filterDossierChange', value);
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
      this.fetchInstallmentsSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchInstallmentsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentPromoters();
      this.fetchAllProducts(this.filter.fields.company);
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreTransactions({ index, done }) {
      this.$utils.log('INSTALLMENTS', `loadMoreTransactions called: ${index}`);
      if (this.last || this.error) {
        this.pendingList = false;
        this.$refs.accountingList.stopScrolling();
      } else {
        this.fetchInstallments(this.filter.fields.promoterId || this.loginId).finally(() => {
          this.pendingList = false;
          done();
        });
      }
    },
    viewDossier(id) {
      this.$utils.logobj('INSTALLMENTS', 'viewDossier', id);
      const msId = id.split('-');
      const msId1 =
        msId[0].slice(6, 8) + msId[0].slice(4, 6) + msId[0].slice(2, 4) + msId[0].slice(0, 2);
      const msId2 = msId[1].slice(2, 4) + msId[1].slice(0, 2);
      const msId3 = msId[2].slice(2, 4) + msId[2].slice(0, 2);
      window.open(
        `${this.$env.legacyBaseUrl}/#/contratto/${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}`,
        '_self',
      );
    },
    updatePayin() {
      // this.$utils.logobj('INSTALLMENTS', 'updatePayin', id);
      const currentId = this.currentId.split('-');
      let data = this.dossiers.findIndex((e) => e.practiceId === currentId[0]);
      if (this.$env.edition === 'sheltia') {
        data = this.dossiers.findIndex((e) => e._id === this.currentId);
      }
      data = this.dossiers[data];
      const { practiceId, installment, margin } = data;
      // eslint-disable-next-line no-console
      console.log(data);

      const payinPayout = {
        payin: this.payin * 100,
        payout: this.payout * 100,
      };
      this.updatePayinPayout({ practiceId, installment, ...payinPayout, margin }).then(() => {
        // eslint-disable-next-line sonarjs/no-identical-functions
        this.$nextTick().then(() => {
          this.payinPayoutModal = false;
          this.payin = 0;
          this.payout = 0;

          this.$q.notify({
            message: this.$t('dossiers.payinSuccessMessage'),
            color: 'secondary',
            timeout: 300,
          });
        });
        this.resetDossiers();
      });
    },
    menuClick(param, transaction) {
      this.$utils.logobj('INSTALLMENTS', 'menuClick', param);
      this.currentId = param;
      const actions = [
        {
          label: this.$t('dossiers.setConfirmed'),
          icon: 'fa fa-check',
          color: 'green',
          handler: () => {
            this.setInstallmentConfirmed(param).then(() => {
              this.$nextTick().then(() => {
                this.$q.notify({
                  message: this.$t('dossiers.installmentActionOk'),
                  color: 'secondary',
                  timeout: 300,
                });
              });
              this.resetDossiers();
            });
          },
        },
        {
          label: this.$t('dossiers.setPaid'),
          icon: 'fa fa-check',
          color: 'black',
          handler: () => {
            // eslint-disable-next-line sonarjs/no-identical-functions
            this.setInstallmentPaid(param).then(() => {
              // eslint-disable-next-line no-console
              console.log(param);
              // eslint-disable-next-line sonarjs/no-identical-functions
              this.$nextTick().then(() => {
                this.$q.notify({
                  message: this.$t('dossiers.installmentActionOk'),
                  color: 'secondary',
                  timeout: 300,
                });
              });
              this.resetDossiers();
            });
          },
        },
        {
          label: this.$t('dossiers.setUnConfirmed'),
          icon: 'fa fa-times',
          color: 'red',
          handler: () => {
            // eslint-disable-next-line sonarjs/no-identical-functions
            this.setInstallmentUnConfirmed(param).then(() => {
              // eslint-disable-next-line sonarjs/no-identical-functions
              this.$nextTick().then(() => {
                this.$q.notify({
                  message: this.$t('dossiers.installmentActionOk'),
                  color: 'secondary',
                  timeout: 300,
                });
              });
              this.resetDossiers();
            });
          },
        },
        {
          label: this.$t('dossiers.setUnPaid'),
          icon: 'fa fa-times',
          color: 'black',
          handler: () => {
            // eslint-disable-next-line sonarjs/no-identical-functions
            this.setInstallmentUnPaid(param).then(() => {
              // eslint-disable-next-line sonarjs/no-identical-functions
              this.$nextTick().then(() => {
                this.$q.notify({
                  message: this.$t('dossiers.installmentActionOk'),
                  color: 'secondary',
                  timeout: 300,
                });
              });
              this.resetDossiers();
            });
          },
        },
        {
          label:
            this.$env.edition === 'tcw'
              ? this.$t('dossiers.menuPayinPayout')
              : this.$t('dossiers.menuPayinIv'),
          icon: 'fa fa-edit',
          color: 'black',
          handler: () => {
            this.payin = (transaction.payin || 0) / 100;
            this.payout = (transaction.payout || 0) / 100;
            // this.payout =
            //   this.$env.edition === 'tcw'
            //     ? (transaction.payout || 0) / 100
            //     : (transaction.iv || 0) / 100;
            this.payinPayoutModal = true;
          },
        },
      ];

      this.$q
        .bottomSheet({
          title: `${this.$t('dossiers.menuInstallments')}: ${param}`,
          dismissLabel: 'Quit',
          actions,
        })
        .onOk((action) => {
          action.handler();
        });
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
