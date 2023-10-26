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
      btn-toggle
      btn-toggle2
      :menus="menuFilter"
      :btn-toggle-options="[
        { label: $t('default.all'), value: 'all' },
        {
          label: $t('default.expiring'),
          value: 'expiring',
        },
        {
          label: $t('default.expired'),
          value: 'expired',
        },
      ]"
      :btn-toggle-options2="[
        { label: $t('default.all'), value: 'all' },
        {
          label: $t('default.incomplete'),
          value: 'incomplete',
        },
        {
          label: $t('default.complete'),
          value: 'complete',
        },
      ]"
      :disabled="pendingSummary || pendingSummaryPrevious || pendingList"
      @changed="filterTypeChange"
      @changedBtnToggle="btnToggleChange"
      @changedBtnToggle2="btnToggleChange2"
    />
    <prassi-customer-filter
      :type-list="typeList"
      :status-list="statusList"
      :promoters="promoters"
      :network="network"
      :roles="roles"
      @changed="filterCustomerChange"
    />
    <prassi-customer-identity-card-list
      ref="customerList"
      :customers="customers"
      :roles="roles"
      :is-fetching="isFetching || pendingList"
      :show-progress="pendingList"
      @sort="sortCustomers"
      @loadMore="loadMoreCustomers"
      @viewClick="viewCustomerLegacy"
      @detailClick="gotoCustomer"
      @emailClick="emailCustomer"
      @downloadCustomer="downloadCustomer"
      @addCustomer="addCustomer"
    />
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { required, email, requiredIf } from 'vuelidate/lib/validators';
import PrassiCustomerFilter from '../components/customer/prassi-customer-filter';
import PrassiCustomerIdentityCardList from '../components/customer/prassi-customer-identity-card-list';
import PrassiDateRangeBlock from '../components/base/prassi-date-range-block';
import PrassiHeaderSummary from '../components/base/prassi-header-summary';
import PrassiFilter from '../components/base/prassi-filter';

const checkFiscalCode = (pi) => {
  if (!pi) return false;
  if (pi.length !== 11) return false;
  const validi = '0123456789';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 11; i++) {
    if (!validi.includes(pi.charAt(i))) return false;
  }
  let s = 0;
  let c = 0;
  for (let i = 0; i <= 9; i += 2) s += pi.charCodeAt(i) - '0'.charCodeAt(0);
  for (let i = 1; i <= 9; i += 2) {
    c = 2 * (pi.charCodeAt(i) - '0'.charCodeAt(0));
    if (c > 9) c -= 9;
    s += c;
  }
  if ((10 - (s % 10)) % 10 !== pi.charCodeAt(10) - '0'.charCodeAt(0)) return false;
  return true;
};

export default {
  name: 'CustomersIdentityCards',
  components: {
    PrassiCustomerIdentityCardList,
    PrassiCustomerFilter,
    PrassiDateRangeBlock,
    PrassiHeaderSummary,
    PrassiFilter,
  },
  data() {
    return {
      addCustomerDialog: false,
      pendingSummary: false,
      pendingSummaryPrevious: false,
      pendingList: false,
      searchPromoters: '',
      roleId: '',
      allPeriods: false,
      currentFilterDate: undefined,
      customerType: '1',
      optionsNamesList: this.namesList,
      customerData: {
        name: undefined,
        surname: '',
        email: '',
        mobilePhone: '',
        housePhone: '',
        workPhone: '',
      },
      customerDataCompany: {
        companyName: '',
        fiscalCode: '',
        companyType: 'srl',
        name: undefined,
        surname: '',
        email: '',
        phone: '',
      },
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
        {
          _id: 'inherited',
          label: this.$t('dossiers.inherited'),
        },
      ],
      companyTypeList: [
        {
          label: 'Srl',
          value: 'srl',
        },
        {
          label: 'Srls',
          value: 'srls',
        },
        {
          label: 'Snc',
          value: 'snc',
        },
        {
          label: 'Sas',
          value: 'sas',
        },
        {
          label: 'Spa',
          value: 'spa',
        },
        {
          label: 'Sapa',
          value: 'sapa',
        },
        {
          label: 'Scarl',
          value: 'scarl',
        },
        {
          label: 'Onlus',
          value: 'onlus',
        },
        {
          label: 'Altro',
          value: 'other',
        },
      ],
      typeList: [
        {
          label: 'Tutti',
          value: 'no-selection',
        },
        {
          label: 'Cliente',
          value: 'customer',
        },
        {
          label: 'Contatto',
          value: 'contact',
        },
      ],
      statusList: [
        {
          label: 'Tutti',
          value: 'no-selection',
        },
        {
          label: 'Potenziale',
          value: 1,
        },
        {
          label: 'Prospect',
          value: 2,
        },
        {
          label: 'Contattato interessato',
          value: 3,
        },
        {
          label: 'Contattato non interessato',
          value: 4,
        },
        {
          label: 'Proposta in corso',
          value: 5,
        },
        {
          label: 'Contraente',
          value: 6,
        },
        {
          label: 'Da campagna online',
          value: 7,
        },
        {
          label: 'Revocato mandato',
          value: 8,
        },
        {
          label: 'Revocata privacy',
          value: 9,
        },
      ],
    };
  },
  validations: {
    customerData: {
      name: {
        required,
      },
      surname: {
        required,
      },
      email: {
        required: requiredIf(function () {
          return (
            !this.customerData.mobilePhone &&
            !this.customerData.housePhone &&
            !this.customerData.workPhone
          );
        }),
        email,
      },
      mobilePhone: {
        required: requiredIf(function () {
          return (
            !this.customerData.email &&
            !this.customerData.housePhone &&
            !this.customerData.workPhone
          );
        }),
      },
      housePhone: {
        required: requiredIf(function () {
          return (
            !this.customerData.mobilePhone &&
            !this.customerData.email &&
            !this.customerData.workPhone
          );
        }),
      },
      workPhone: {
        required: requiredIf(function () {
          return (
            !this.customerData.mobilePhone &&
            !this.customerData.housePhone &&
            !this.customerData.email
          );
        }),
      },
    },
    customerDataCompany: {
      companyName: {
        required,
      },
      fiscalCode: {
        required,
        checkFiscalCode,
      },
      phone: {
        required: requiredIf(function () {
          return !this.customerDataCompany.email;
        }),
      },
      companyType: {},
      name: {
        required,
      },
      surname: {
        required,
      },
      email: {
        required: requiredIf(function () {
          return this.customerDataCompany.phone;
        }),
        email,
      },
    },
  },
  created() {
    this.resetPromoterSearch();
    this.resetDossiersSearch();
  },
  mounted() {
    this.$utils.log('CUSTOMERS', 'mounted');
    this.resetPromoterSearch();
    this.resetDossiersSearch();
    this.resetDossiersSummary();
    this.pendingList = true;
    this.pendingSummary = true;
    this.pendingSummaryPrevious = true;
    this.currentFilterDate = this.filter.time;
    const filterPreviousDate = this.$utils.subtractDate(this.filter.time, 'all');
    this.setDossiersFilterPreviousDate(filterPreviousDate);
    this.fetchCustomersSummary(this.filter.fields.promoterId || this.loginId).finally(
      // eslint-disable-next-line no-return-assign
      () => (this.pendingSummary = false),
    );
    this.fetchCustomersSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
      // eslint-disable-next-line no-return-assign
      () => (this.pendingSummaryPrevious = false),
    );
    this.filterCurrentNetwork();
    this.filterCurrentPromoters();
    this.resetCustomers();
  },
  props: {
    closed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      summary: (state) => [
        {
          _id: 'customers',
          title: 'dossiers.customers',
          value: state.dossiers.summary.customers / 100,
          previousValue: state.dossiers.summary.previousCustomers / 100,
          percentage: state.dossiers.summary.percentageCustomers,
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
      error: (state) => state.error.error,
      loginId: (state) => state.login._id,
      token: (state) => state.login.token,
      rootId: (state) => state.login._id,
      customer: (state) => state.dossiers.customer,
      names: (state) => state.dossiers.names,
      customers: (state) => state.dossiers.customers.items,
      promoters: (state) => state.promoters.promoters.items,
      network: (state) => state.promoters.network.items,
      last: (state) => state.dossiers.customers.lastRecord,
      filter: (state) => state.dossiers.filter,
      isFetching: (state) => state.error.isFetching,
      report: (state) => state.dossiers.report.item,
      document: (state) => state.documents.document.item,
      exportId: (state) => state.dossiers.exportId,
      roles: (state) => state.promoters.roles.items,
    }),
    namesList() {
      return this.names ? this.names.map((el) => el.name) : [];
    },
  },
  methods: {
    ...mapActions({
      createCustomer: 'dossiers/createCustomer',
      fetchCustomers: 'dossiers/fetchCustomersIdentityCards',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
      fetchPromotersExcelReport: 'promoters/fetchPromotersExcelReport',
      fetchAllPromoters: 'promoters/fetchAllPromoters',
      fetchAllPromotersPeriod: 'promoters/fetchAllPromotersPeriod',
      fetchNetworkPeriod: 'promoters/fetchNetworkPeriod',
      fetchNetwork: 'promoters/fetchNetwork',
      fetchCustomersSummary: 'dossiers/fetchCustomersSummaryIdentityCards',
      fetchCustomersSummaryPrevious: 'dossiers/fetchCustomersSummaryPreviousIdentityCards',
      fetchCustomerExport: 'dossiers/fetchCustomerExportIdentityCards',
      fetchExportUrl: 'documents/fetchExportUrl',
    }),
    ...mapMutations({
      resetCustomers: 'dossiers/resetCustomers',
      resetPromoterSearch: 'promoters/resetPromoterSearch',
      resetDossiersSearch: 'dossiers/resetDossiersSearch',
      setPromotersSorting: 'promoters/setPromotersSorting',
      setDossiersFilterSelected: 'dossiers/setDossiersFilterSelected',
      setCustomerFilterAll: 'dossiers/setCustomerFilterAll',
      resetDossiersSummary: 'dossiers/resetDossiersSummary',
      setDossiersFilterDate: 'dossiers/setDossiersFilterDate',
      setDossiersFilterPreviousDate: 'dossiers/setDossiersFilterPreviousDate',
      setDossiersFilterBirthday: 'dossiers/setDossiersFilterBirthday',
      setDossiersFilterIdExpired: 'dossiers/setDossiersFilterIdExpired',
      setDossiersFilterIdComplete: 'dossiers/setDossiersFilterIdComplete',
      changeExportInProgressState: 'documents/changeExportInProgressState',
      changeExportCompletedState: 'documents/changeExportCompletedState',
    }),
    filterNames(value, update) {
      update(() => {
        const needle = value.toLowerCase();
        this.optionsNamesList = this.names
          .filter((v) => v.name.toLowerCase().includes(needle))
          .map((el) => el.name);
      });
    },
    emailCustomer(customer) {
      this.$utils.logobj('CUSTOMERS', 'emailCustomer', customer);
      window.location.href = `mailto:${customer.email}`;
    },
    gotoCustomer(customer) {
      this.$utils.logobj('CUSTOMERS', 'gotoCustomer', customer);
      this.$router.push(`/customers/${customer._id}`);
    },
    viewCustomerLegacy(id) {
      this.$utils.logobj('CONTRACTS', 'viewCustomerLegacy', id);
      const msId = id.split('-');
      const msId1 =
        msId[0].slice(6, 8) + msId[0].slice(4, 6) + msId[0].slice(2, 4) + msId[0].slice(0, 2);
      const msId2 = msId[1].slice(2, 4) + msId[1].slice(0, 2);
      const msId3 = msId[2].slice(2, 4) + msId[2].slice(0, 2);
      window.open(
        `${this.$env.legacyBaseUrl}/#/clienti/${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}/dashboard?token=${this.token}`,
        '_self',
      );
    },
    sortCustomers(sort) {
      this.$utils.logobj('CUSTOMERS', 'sortPromoters', sort);
      this.pendingList = true;
      this.setPromotersSorting(sort);
      this.resetCustomers();
    },
    btnToggleChange(value) {
      this.$utils.logobj('CUSTOMERS', 'btnToggleChange', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.setDossiersFilterIdExpired(value);
      this.resetDossiersSummary();
      this.fetchCustomersSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchCustomersSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentNetwork();
      this.filterCurrentPromoters();
      this.resetCustomers();
    },
    btnToggleChange2(value) {
      this.$utils.logobj('CUSTOMERS', 'btnToggleChange2', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.setDossiersFilterIdComplete(value);
      this.resetDossiersSummary();
      this.fetchCustomersSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchCustomersSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentNetwork();
      this.filterCurrentPromoters();
      this.resetCustomers();
    },
    filterTypeChange(value) {
      this.$utils.logobj('CUSTOMERS', 'filterDossierChange', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.setDossiersFilterSelected(value.selected);
      this.resetDossiersSummary();
      this.fetchCustomersSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchCustomersSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentNetwork();
      this.filterCurrentPromoters();
      this.resetCustomers();
    },
    filterCustomerChange(filter) {
      this.$utils.logobj('CUSTOMERS', 'filterCustomerChange', filter);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.setCustomerFilterAll({
        ...filter,
        promoterId: filter.promoterId === 'no-selection' ? this.loginId : filter.promoterId,
      });
      this.resetDossiersSummary();
      this.fetchCustomersSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchCustomersSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentNetwork();
      this.filterCurrentPromoters();
      this.resetCustomers();
    },
    filterDateChange(filterDate) {
      this.$utils.logobj('DOSSIERS', 'filterDate', filterDate);
      if (filterDate.selected !== 'allPeriod') {
        this.currentFilterDate = filterDate;
        this.pendingList = true;
        this.pendingSummary = true;
        this.pendingSummaryPrevious = true;
        this.resetDossiersSummary();
        this.setDossiersFilterDate(filterDate);
        const filterPreviousDate = this.$utils.subtractDate(filterDate, 'all');
        this.setDossiersFilterPreviousDate(filterPreviousDate);
        this.fetchCustomersSummary(this.filter.fields.promoterId || this.loginId).finally(
          // eslint-disable-next-line no-return-assign
          () => (this.pendingSummary = false),
        );
        this.fetchCustomersSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
          // eslint-disable-next-line no-return-assign
          () => (this.pendingSummaryPrevious = false),
        );
        this.filterCurrentNetwork();
        this.filterCurrentPromoters();
        this.resetCustomers();
      }
    },
    filterCurrentNetwork() {
      if (this.filter.time.selected === 'year' || this.filter.time.selected === 'allPeriods') {
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
      if (this.filter.time.selected === 'year' || this.filter.time.selected === 'allPeriods') {
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
    // eslint-disable-next-line no-unused-vars
    loadMoreCustomers({ index, done }) {
      this.$utils.log('CUSTOMERS', `loadMoreCustomers called: ${index}`);
      if (this.last || this.error) {
        this.$refs.customerList.stopScrolling();
        this.pendingList = false;
      } else {
        this.fetchCustomers(this.filter.fields.promoterId || this.loginId).finally(() => {
          this.pendingList = false;
          done();
        });
      }
    },
    downloadCustomer() {
      this.$utils.log('CUSTOMERS-DETAIL', 'downloadCustomer');
      this.$q.loading.show({ delay: 200 });
      this.fetchCustomerExport(this.filter.fields.promoterId || this.loginId)
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
    },
    addCustomer() {
      this.$utils.log('CUSTOMERS-DETAIL', 'addCustomer');
      this.addCustomerDialog = true;
    },
    comfirmAddCustomer() {
      if (this.customerType === '1') {
        this.$utils.logobj('CUSTOMERS-DETAIL', 'comfirmAddCustomer', this.customerData);
        this.$v.customerData.$touch();

        if (!this.$v.customerData.$error) {
          this.$utils.logobj('CUSTOMERS-DETAIL', 'comfirmAddCustomer', this.customerData);
          this.executeAddCustomer();
          this.addCustomerDialog = false;
        } else {
          this.$q.notify(this.$t('default.cantSave'));
        }
      } else {
        this.$v.customerDataCompany.$touch();

        if (!this.$v.customerDataCompany.$error) {
          this.$utils.logobj('CUSTOMERS-DETAIL', 'comfirmAddCustomer', this.customerDataCompany);
          this.executeAddCustomer();
          this.addCustomerDialog = false;
        } else {
          this.$q.notify(this.$t('default.cantSave'));
        }
      }
    },
    executeAddCustomer() {
      this.$utils.log('CUSTOMER-DETAIL', 'executeAddCustomer');
      const thisCustomerToInsert = {
        ...(this.customerType === '1' ? this.customerData : this.customerDataCompany),
        type: this.customerType,
      };
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.createCustomer({
        body: thisCustomerToInsert,
      })
        .then(() => {
          this.$q.notify({
            message: this.$t('customer.notifyCustomerAdded'),
            color: 'secondary',
            timeout: 300,
          });
          this.viewCustomerLegacy(this.customer._id);
        })
        .finally(() => {
          this.pendingList = false;
          this.pendingSummary = false;
          this.pendingSummaryPrevious = false;
        });
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
