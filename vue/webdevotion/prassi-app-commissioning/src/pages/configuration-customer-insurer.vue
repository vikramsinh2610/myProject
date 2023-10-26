<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-customer-insurer-filter
      style="width: 100%"
      :network="network"
      :promoters="promoters"
      :customers="customers"
      :roles="roles"
      @changed="filterCustomerChange"
    />

    <prassi-configuration-customer-insurer-list
      class="fill-available"
      ref="configurationCustomerInsurerList"
      :customers="customersInsurer"
      :is-fetching="isFetching"
      @loadMore="loadMoreCustomers"
      @addCustomerInsurer="addCustomerInsurerDialog"
      @deleteCustomerInsurer="deleteCustomerInsurerClicked"
      @sort="sortCustomers"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />

    <q-dialog v-model="showDelDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            {{ $t('configurationHeader.confirmDelete') + ' ' + this.dossierToDelete }}
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button
            color="red"
            :label="$t('configurationProduct.delete')"
            @click="deleteDossierInsurerConfirmed"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddDialog">
      <q-card style="max-width: 800px; width: 800px">
        <q-card-section class="bg-secondary text-white q-mb-md">
          <div class="text-h6">{{ $t('configurationHeader.addDossierInsurerTitle') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="column justify-between">
            <q-select
              style="width: 100%"
              use-input
              clearable
              v-model="form.networkId"
              :label="$t('default.tree')"
              :options="optionsNetworkList"
              @filter="filterNetwork"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="column justify-between">
            <q-select
              style="width: 100%"
              use-input
              clearable
              v-model="form.promoterId"
              :label="$t('configurationHeader.promoter')"
              :options="optionsPromoterList"
              @filter="filterPromoter"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <q-select
            class="col select-ellipsis"
            use-input
            clearable
            v-model="form.customerId"
            :label="$t('configurationHeader.customerDescription')"
            :options="optionsCustomerList"
            @filter="filterCustomer"
          />
        </q-card-section>

        <q-card-section class="row">
          <q-input
            class="col"
            v-model="form.productivePeriodMonth"
            type="number"
            min="1"
            max="12"
            step="1"
            :label="$t('configurationJobs.fromProductivePeriodMonth')"
          />
          <q-input
            class="col q-ml-lg"
            v-model="form.productivePeriodYear"
            type="number"
            min="2000"
            step="1"
            :label="$t('configurationJobs.fromProductivePeriodYear')"
          />
        </q-card-section>

        <q-card-section>
          <prassi-standard-button
            :label="$t('default.addButton')"
            @click="comfirmAddCustomerInsurer"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiConfigurationCustomerInsurerList from '../components/configuration/prassi-configuration-customer-insurer-list';
import PrassiCustomerInsurerFilter from '../components/dossier/prassi-customer-insurer-filter';

export default {
  name: 'ConfigurationCustomerInsurer',
  components: {
    PrassiConfigurationCustomerInsurerList,
    PrassiCustomerInsurerFilter,
  },
  data() {
    return {
      showAddDialog: false,
      form: {
        networkId: undefined,
        promoterId: undefined,
        customerId: undefined,
        productivePeriodMonth: new Date().getMonth() + 1,
        productivePeriodYear: new Date().getFullYear(),
      },
      optionsNetworkList: this.networkList,
      optionsPromoterList: this.promoterList,
      optionsCustomerList: this.CustomerList,
      showDelDialog: false,
      dossierToDelete: '',
      dossier: '',
      dossierList: [],
    };
  },
  created() {
    this.resetPromoterSearch();
    this.resetDossiersSearch();
  },
  mounted() {
    this.setCustomerFilter({
      customerId: undefined,
      networkId: undefined,
      promoterId: undefined,
    });
    this.resetCustomerInsurer();
    this.fetchNetwork();
    this.fetchAllPromoters();
    this.fetchAllCustomers(this.loginId);
  },
  computed: {
    ...mapState({
      loginId: (state) => state.login._id,
      rootId: (state) => state.login._id,
      customersInsurer: (state) => state.configuration.customerInsurer.items,
      last: (state) => state.configuration.customerInsurer.lastRecord,
      isFetching: (state) => state.error.isFetching,
      filter: (state) => state.configuration.filterCustomer,
      network: (state) => state.promoters.network.items,
      promoters: (state) => state.promoters.promoters.items,
      customers: (state) => state.dossiers.customersSimple.items,
      roles: (state) => state.promoters.roles.items,
    }),
    customerList() {
      const customerList = [];

      this.customers.forEach((el) => {
        customerList.push({
          label: el.displayName,
          value: el._id,
        });
      });

      Object.freeze(customerList);
      return customerList;
    },
    promoterList() {
      const promoterList = [];

      this.promoters.forEach((el) => {
        const roleName = this.$utils.getRoleName(this.roles, el.roleId);
        promoterList.push({
          label: `${el.displayName} - ${roleName} - ${el.displayHierarchy}`,
          value: el._id,
        });
      });

      return promoterList;
    },
    networkList() {
      const networkList = [];

      this.network.forEach((el) => {
        networkList.push({
          label: `${el.displayHierarchy}`,
          value: el._id,
        });
      });

      return networkList;
    },
  },
  methods: {
    ...mapActions({
      fetchNetwork: 'promoters/fetchNetwork',
      fetchAllPromoters: 'promoters/fetchAllPromoters',
      fetchCustomerInsurers: 'configuration/fetchCustomerInsurers',
      saveCustomerInsurer: 'configuration/saveCustomerInsurer',
      deleteCustomerInsurer: 'configuration/deleteCustomerInsurer',
      fetchAllCustomers: 'dossiers/fetchAllCustomers',
    }),
    ...mapMutations({
      resetPromoterSearch: 'promoters/resetPromoterSearch',
      resetDossiersSearch: 'dossiers/resetDossiersSearch',
      resetCustomerInsurer: 'configuration/resetCustomerInsurer',
      setCustomerFilter: 'configuration/setCustomerFilter',
      setCustomerInsurerSorting: 'configuration/setCustomerInsurerSorting',
    }),
    filterNetwork(value, update) {
      update(() => {
        const needle = value.toLowerCase();
        this.optionsNetworkList = this.networkList.filter((v) =>
          v.label.toLowerCase().includes(needle),
        );
      });
    },
    filterPromoter(value, update) {
      update(() => {
        const needle = value.toLowerCase();
        this.optionsPromoterList = this.promoterList.filter((v) =>
          v.label.toLowerCase().includes(needle),
        );
      });
    },
    filterCustomer(value, update) {
      update(() => {
        const needle = value.toLowerCase();
        this.optionsCustomerList = this.customerList.filter((v) =>
          v.label.toLowerCase().includes(needle),
        );
      });
    },
    sortCustomers(sort) {
      this.$utils.logobj('CONFIG-DOSSIER-INSURER', 'sortCustomers', sort);
      this.setCustomerInsurerSorting(sort);
      this.resetCustomerInsurer();
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreCustomers({ index, done }) {
      if (this.last || this.error) {
        this.$refs.configurationCustomerInsurerList.stopScrolling();
      } else {
        this.$utils.logobj('CONFIG-DOSSIER-INSURER', 'loadMoreCustomers', index);
        this.fetchCustomerInsurers(this.filter.fields).finally(() => done());
      }
    },
    addCustomerInsurerDialog() {
      this.$utils.log('CONFIG-DOSSIER-INSURER', 'addCustomerInsurerDialog');
      this.showAddDialog = true;
    },
    comfirmAddCustomerInsurer() {
      if (this.form.networkId && this.form.promoterId && this.form.customerId) {
        this.showAddDialog = false;

        const customer = {
          networkNodeId: this.form.networkId.value,
          promoterId: this.form.promoterId.value,
          customerId: this.form.customerId.value,
          productivePeriodMonth: this.form.productivePeriodMonth,
          productivePeriodYear: this.form.productivePeriodYear,
        };

        this.saveCustomerInsurer(customer).then(() => {
          this.$q.notify({
            message: this.$t('configurationProduct.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
          this.resetCustomerInsurer();
          this.$refs.configurationCustomerInsurerList.forceScrolling();
        });
      } else {
        this.error = true;
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    deleteCustomerInsurerClicked(customer) {
      this.$utils.logobj('CONFIG-DOSSIER-INSURER', 'deleteCustomerInsurerClicked', customer);
      this.customerToDelete = customer.id;
      this.showDelDialog = true;
    },
    deleteDossierInsurerConfirmed() {
      this.$utils.log('CONFIG-DOSSIER-INSURER', 'deleteDossierInsurerConfirmed');
      this.deleteCustomerInsurer(this.customerToDelete).then(() => {
        this.$q.notify({
          message: this.$t('default.deleteOk'),
          color: 'secondary',
          timeout: 300,
        });
        this.resetCustomerInsurer();
      });
      this.dossierToDelete = '';
      this.showDelDialog = false;
    },
    filterCustomerChange(value) {
      this.$utils.logobj('CONFIG-CUSTOMER-INSURER', 'filterCustomerChange', value);
      this.resetCustomerInsurer();
      this.setCustomerFilter({
        ...value,
        customerId: value.customerId === 'no-selection' ? this.loginId : value.customerId,
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
.center-spinner
  display block
  margin auto
.q-field
  font-size 16px
</style>
