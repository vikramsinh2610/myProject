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
      toggle
      :toggle-label="$t('dossiers.birthday')"
      :menus="menuFilter"
      @changed="filterTypeChange"
      @changedToggle="filterToggleChange"
    />
    <prassi-customer-filter
      :type-list="typeList"
      :status-list="statusList"
      :promoters="promoters"
      :network="network"
      :roles="roles"
      @changed="filterCustomerChange"
    />
    <prassi-person-list
      ref="customerList"
      :customers="customers"
      :roles="roles"
      :is-fetching="isFetching || pendingList"
      :show-progress="pendingList"
      @sort="sortCustomers"
      @loadMore="loadMoreCustomers"
      @detailClick="viewCustomerLegacy"
      @viewClick="duplicateCustomer"
      @emailClick="emailCustomer"
      @downloadCustomer="downloadCustomer"
      @addCustomer="addCustomer"
    />
    <q-dialog v-model="addCustomerDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            {{ $t('customer.addCustomer') }}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="justify-between">
            <q-radio v-model="customerType" val="1" :label="$t('customer.person')" />
            <q-radio v-model="customerType" val="2" :label="$t('customer.company')" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="customerType === '1'">
          <div class="column justify-between">
            <q-select
              class="col-6"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              v-model="customerData.name"
              @input-value="setModel"
              :label="$t('customer.name')"
              :error-message="errorMessage.name"
              :error="errorName"
              :options="optionsNamesList"
              @filter="filterNames"
            />
            <q-input
              class="col-6"
              v-model="customerData.surname"
              type="text"
              :label="$t('customer.surname')"
              :error-message="errorMessage.surname"
              :error="$v.customerData.surname.$error"
              @blur="$v.customerData.surname.$touch"
            />
            <q-input
              class="col-6"
              v-model="customerData.email"
              type="email"
              :label="$t('customer.email')"
              :error="$v.customerData.email.$error"
              @blur="$v.customerData.email.$touch"
            />
            <q-input
              class="col-6"
              v-model="customerData.mobilePhone"
              type="email"
              :label="$t('customer.cellPhone')"
              :error-message="errorMessage.mobilePhone"
              :error="$v.customerData.mobilePhone.$error"
              @blur="$v.customerData.mobilePhone.$touch"
            />
            <q-input
              class="col-6"
              v-model="customerData.fiscalCode"
              type="text"
              :label="$t('customer.fiscalCode')"
              :error="$v.customerData.fiscalCode.$error"
              @blur="$v.customerData.fiscalCode.$touch"
              mask="XXXXXXXXXXXXXXXX"
            />
          </div>
        </q-card-section>
        <q-card-section v-if="customerType === '2'">
          <div class="column justify-between">
            <q-input
              class="col-6"
              v-model="customerDataCompany.companyName"
              type="text"
              :label="$t('customer.companyName')"
              :error-message="errorMessage.companyName"
              :error="$v.customerDataCompany.companyName.$error"
              @blur="$v.customerDataCompany.companyName.$touch"
            />
            <q-input
              class="col-6"
              v-model="customerDataCompany.fiscalCode"
              type="text"
              :label="$t('customer.vatCode')"
              :error="$v.customerDataCompany.fiscalCode.$error"
              @blur="$v.customerDataCompany.fiscalCode.$touch"
            />
            <q-select
              class="col-6"
              v-model="customerDataCompany.companyType"
              :label="$t('customer.companyType')"
              :options="companyTypeList"
              :error="$v.customerDataCompany.companyType.$error"
              @blur="$v.customerDataCompany.companyType.$touch"
            />
            <q-input
              class="col-6"
              v-model="customerDataCompany.phone"
              type="email"
              :label="$t('customer.workPhone')"
              :error-message="errorMessage.workPhone"
              :error="$v.customerDataCompany.phone.$error"
              @blur="$v.customerDataCompany.phone.$touch"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.addButton')" @click="comfirmAddCustomer" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="duplicateCustomerDialog">
      <q-card style="max-width: none">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            {{ $t('customer.duplicatedCustomer') }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="column fill-available">
            <prassi-person-list-duplicates
              ref="customerDuplicatedList"
              :customers="customersDuplicated"
              :roles="roles"
              :is-fetching="isFetching || pendingList"
              :show-progress="pendingList"
              @loadMore="loadMoreCustomersDuplicated"
              @detailClick="viewCustomerLegacy"
              @viewClick="duplicateCustomer"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { required, email, requiredIf } from 'vuelidate/lib/validators';
import PrassiCustomerFilter from '../components/customer/prassi-customer-filter';
import PrassiPersonList from '../components/customer/prassi-person-list';
import PrassiDateRangeBlock from '../components/base/prassi-date-range-block';
import PrassiHeaderSummary from '../components/base/prassi-header-summary';
import PrassiFilter from '../components/base/prassi-filter';
import PrassiPersonListDuplicates from '../components/customer/prassi-person-list-duplicates';

const checkFiscalCodeCompany = (pi) => {
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

const checkFiscalCode = (cfins) => {
  if (!cfins) return true;

  const cf = cfins.toUpperCase();
  const cfReg = /^[A-Z]{6}(?:\d{2}[A-Z]){2}\d{3}[A-Z]$/;
  if (!cfReg.test(cf)) {
    return false;
  }

  const set1 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const set2 = 'ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const setpari = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const setdisp = 'BAKPLCQDREVOSFTGUHMINJWZYX';
  let s = 0;

  for (let i = 1; i <= 13; i += 2) s += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
  for (let i = 0; i <= 14; i += 2) s += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
  if (s % 26 !== cf.charCodeAt(15) - 'A'.charCodeAt(0)) return false;
  return true;
};

export default {
  name: 'Customers',
  components: {
    PrassiPersonList,
    PrassiCustomerFilter,
    PrassiDateRangeBlock,
    PrassiHeaderSummary,
    PrassiFilter,
    PrassiPersonListDuplicates,
  },
  data() {
    return {
      myExportTimer: {},
      addCustomerDialog: false,
      duplicateCustomerDialog: false,
      pendingSummary: false,
      pendingSummaryPrevious: false,
      pendingList: false,
      searchPromoters: '',
      roleId: '',
      allPeriods: false,
      currentFilterDate: undefined,
      customerType: '1',
      optionsNamesList: this.namesList,
      errorName: undefined,
      customerData: {
        name: undefined,
        surname: '',
        email: '',
        mobilePhone: '',
        fiscalCode: '',
      },
      customerDataCompany: {
        companyName: '',
        fiscalCode: '',
        companyType: 'srl',
        phone: '',
      },
      errorMessage: {
        mobilePhone: '',
        workPhone: '',
        name: '',
        surname: '',
        companyName: '',
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
          value: 2,
        },
        {
          label: 'Contatto',
          value: 1,
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
        {
          label: 'Collegato ad Azienda',
          value: 10,
        },
      ],
    };
  },
  validations: {
    customerData: {
      name: {
        checkName(value) {
          if (!/^[ 'a-z]+$/i.test(value) && value !== '') {
            this.errorMessage.name = 'Ci sono dei caratteri speciali non ammessi.';
            return false;
          }
          if (value === '') {
            this.errorMessage.name = 'Il campo è richiesto';
            return false;
          }
          return true;
        },
      },
      surname: {
        checkSurname(value) {
          if (!/^[ 'a-z]+$/i.test(value) && value !== '') {
            this.errorMessage.surname = 'Ci sono dei caratteri speciali non ammessi.';
            return false;
          }
          if (value === '') {
            this.errorMessage.surname = 'Il campo è richiesto';
            return false;
          }
          return true;
        },
      },
      email: {
        required: requiredIf(function () {
          return !this.customerData.mobilePhone;
        }),
        email,
      },
      mobilePhone: {
        checkPhone(value) {
          if (!/^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,7}$/i.test(value) && value !== '') {
            this.errorMessage.mobilePhone = 'Il numero di cellulare non è corretto.';
            return false;
          }
          if (value === '') {
            this.errorMessage.mobilePhone = 'Il campo è richiesto';
            return false;
          }
          return true;
        },
      },
      fiscalCode: { required: false, checkFiscalCode },
    },
    customerDataCompany: {
      companyName: {
        checkCompanyName(value) {
          if (!/^[\d &'.@a-z-]+$/i.test(value) && value !== '') {
            this.errorMessage.companyName = 'Ci sono dei caratteri speciali non ammessi.';
            return false;
          }
          if (value === '') {
            this.errorMessage.companyName = 'Il campo è richiesto';
            return false;
          }
          return true;
        },
      },
      fiscalCode: {
        required,
        checkFiscalCodeCompany,
      },
      phone: {
        checkFixedPhone(value) {
          if (!/^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,7}$/i.test(value) && value !== '') {
            this.errorMessage.workPhone = 'Il numero di telefono non è corretto.';
            return false;
          }
          this.errorMessage.workPhone = '';
          return true;
        },
      },
      companyType: {},
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
    this.fetchPersonsSummary({ promoterId: this.filter.fields.promoterId || this.loginId }).finally(
      // eslint-disable-next-line no-return-assign
      () => (this.pendingSummary = false),
    );
    this.fetchPersonsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
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
      customersDuplicated: (state) => state.dossiers.customersDuplicated.items,
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
      fetchPerson: 'dossiers/fetchPerson',
      fetchPersons: 'dossiers/fetchPersons',
      fetchPersonsDuplicated: 'dossiers/fetchPersonsDuplicated',
      fetchPersonsUnified: 'dossiers/fetchPersonsUnified',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
      fetchPromotersExcelReport: 'promoters/fetchPromotersExcelReport',
      fetchAllPromoters: 'promoters/fetchAllPromoters',
      fetchAllPromotersPeriod: 'promoters/fetchAllPromotersPeriod',
      fetchNetworkPeriod: 'promoters/fetchNetworkPeriod',
      fetchNetwork: 'promoters/fetchNetwork',
      fetchPersonsSummary: 'dossiers/fetchPersonsSummary',
      fetchPersonsSummaryPrevious: 'dossiers/fetchPersonsSummaryPrevious',
      fetchCustomerExport: 'dossiers/fetchCustomerExport',
      fetchExportUrl: 'documents/fetchExportUrl',
    }),
    ...mapMutations({
      resetCustomers: 'dossiers/resetCustomers',
      resetCustomersDuplicated: 'dossiers/resetCustomersDuplicated',
      resetPromoterSearch: 'promoters/resetPromoterSearch',
      resetDossiersSearch: 'dossiers/resetDossiersSearch',
      setPromotersSorting: 'promoters/setPromotersSorting',
      setDossiersFilterSelected: 'dossiers/setDossiersFilterSelected',
      setCustomerFilterAll: 'dossiers/setCustomerFilterAll',
      resetDossiersSummary: 'dossiers/resetDossiersSummary',
      setDossiersFilterDate: 'dossiers/setDossiersFilterDate',
      setDossiersFilterPreviousDate: 'dossiers/setDossiersFilterPreviousDate',
      setDossiersFilterBirthday: 'dossiers/setDossiersFilterBirthday',
      changeExportInProgressState: 'documents/changeExportInProgressState',
      changeExportCompletedState: 'documents/changeExportCompletedState',
      setCustomerId: 'dossiers/setCustomerId',
    }),
    filterNames(value, update) {
      update(() => {
        const needle = value.toLowerCase();
        this.optionsNamesList = this.names
          .filter((v) => v.name.toLowerCase().includes(needle))
          .map((el) => el.name);
      });
    },
    setModel(value) {
      this.customerData.name = value;
      this.errorName = !!(!/^(?!\s)(?![\S\s]*\s$)[ 'a-z]+$/i.test(value) && value !== '');
      if (this.errorName) {
        this.errorMessage.name = 'Ci sono dei caratteri speciali non ammessi.';
      }
    },
    emailCustomer(customer) {
      this.$utils.logobj('PERSONS', 'emailCustomer', customer);
      window.location.href = `mailto:${customer.email}`;
    },
    duplicateCustomer(customer) {
      this.$utils.logobj('PERSONS', 'duplicateCustomer', customer);
      if (customer.fiscalCode && Number.parseInt(customer.duplicated, 10) > 1) {
        this.setCustomerFilterAll({
          ...this.filter,
          promoterId:
            this.filter.promoterId === 'no-selection' ? this.loginId : this.filter.promoterId,
          fiscalCode: customer.fiscalCode,
        });
        this.resetCustomersDuplicated();
        this.fetchPersonsDuplicated(this.filter.fields.promoterId || this.loginId).then(() => {
          // this.$refs.customerDuplicatedList.forceScrolling();
        });
        this.duplicateCustomerDialog = true;
      } else {
        this.$router.push(`/persons/${customer._id}`);
      }
    },
    viewCustomerLegacy(customer) {
      this.$utils.logobj('PERSONS', 'viewCustomerLegacy', customer);
      if (customer.fiscalCode && Number.parseInt(customer.duplicated, 10) > 1) {
        this.setCustomerFilterAll({
          ...this.filter,
          promoterId:
            this.filter.promoterId === 'no-selection' ? this.loginId : this.filter.promoterId,
          fiscalCode: customer.fiscalCode,
        });
        this.resetCustomersDuplicated();
        this.fetchPersonsDuplicated(this.filter.fields.promoterId || this.loginId).then(() => {
          // this.$refs.customerDuplicatedList.forceScrolling();
        });
        this.duplicateCustomerDialog = true;
      } else {
        window.open(`${window.location.origin}/persons/${customer._id}/history`, '_blank');
      }
    },
    sortCustomers(sort) {
      this.$utils.logobj('PERSONS', 'sortCustomers', sort);
      this.pendingList = true;
      this.setPromotersSorting(sort);
      this.resetCustomers();
    },
    filterToggleChange(value) {
      this.$utils.logobj('PERSONS', 'filterToggleChange', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.setDossiersFilterBirthday(value);
      this.resetDossiersSummary();
      this.fetchPersonsSummary({
        promoterId: this.filter.fields.promoterId || this.loginId,
      }).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchPersonsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentNetwork();
      this.filterCurrentPromoters();
      this.resetCustomers();
    },
    filterTypeChange(value) {
      this.$utils.logobj('PERSONS', 'filterDossierChange', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.setDossiersFilterSelected(value.selected);
      this.resetDossiersSummary();
      this.fetchPersonsSummary({
        promoterId: this.filter.fields.promoterId || this.loginId,
      }).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchPersonsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.filterCurrentNetwork();
      this.filterCurrentPromoters();
      this.resetCustomers();
    },
    filterCustomerChange(filter) {
      this.$utils.logobj('PERSONS', 'filterCustomerChange', filter);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.setCustomerFilterAll({
        ...filter,
        promoterId: filter.promoterId === 'no-selection' ? this.loginId : filter.promoterId,
      });
      this.resetDossiersSummary();
      this.fetchPersonsSummary({
        promoterId: this.filter.fields.promoterId || this.loginId,
      }).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchPersonsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
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
        this.fetchPersonsSummary({
          promoterId: this.filter.fields.promoterId || this.loginId,
        }).finally(
          // eslint-disable-next-line no-return-assign
          () => (this.pendingSummary = false),
        );
        this.fetchPersonsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
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
      this.$utils.log('PERSONS', `loadMoreCustomers called: ${index}`);
      if (this.last || this.error) {
        this.$refs.customerList.stopScrolling();
        this.pendingList = false;
      } else {
        this.fetchPersonsUnified(this.filter.fields.promoterId || this.loginId).finally(() => {
          this.pendingList = false;
          done();
        });
      }
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreCustomersDuplicated({ index, done }) {
      this.$utils.log('PERSONS', `loadMoreCustomersDuplicated called: ${index}`);
      if (this.last || this.error) {
        this.$refs.customerDuplicatedList.stopScrolling();
        this.pendingList = false;
      } else {
        this.fetchPersonsDuplicated(this.filter.fields.promoterId || this.loginId).finally(() => {
          this.pendingList = false;
          done();
        });
      }
    },
    downloadCustomer() {
      this.$utils.log('PERSONS-DETAIL', 'downloadCustomer');
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
      this.$utils.log('PERSONS-DETAIL', 'addCustomer');
      this.addCustomerDialog = true;
    },
    comfirmAddCustomer() {
      if (this.customerType === '1') {
        this.$utils.logobj('PERSONS-DETAIL', 'comfirmAddCustomer', this.customerData);
        this.$v.customerData.$touch();

        if (!this.$v.customerData.$error) {
          this.$utils.logobj('PERSONS-DETAIL', 'comfirmAddCustomer', this.customerData);
          this.executeAddCustomer();
          this.addCustomerDialog = false;
        } else {
          this.$q.notify(this.$t('default.cantSave'));
        }
      } else {
        this.$v.customerDataCompany.$touch();

        if (!this.$v.customerDataCompany.$error) {
          this.$utils.logobj('PERSONS-DETAIL', 'comfirmAddCustomer', this.customerDataCompany);
          this.executeAddCustomer();
          this.addCustomerDialog = false;
        } else {
          this.$q.notify(this.$t('default.cantSave'));
        }
      }
    },
    executeAddCustomer() {
      this.$utils.log('PERSONS-DETAIL', 'executeAddCustomer');
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
          this.$utils.logobj('PERSONS-DETAIL', 'executeAddCustomer', this.customer);
          this.$utils.logobj('PERSONS-DETAIL', 'executeAddCustomer', this.customer._id);
          this.setCustomerId(this.customer._id);
          this.fetchPerson(this.customer._id);
          this.$router.push(`/persons/${this.customer._id}`);
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
