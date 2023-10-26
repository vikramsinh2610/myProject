<template>
  <div class="fill-available column">
    <prassi-configuration-customer-insurer-list
      class="fill-available"
      ref="configurationCustomerInsurerList"
      delete-button
      :customers="customersInsurer"
      :is-fetching="isFetching"
      @loadMore="loadMoreCustomers"
      @viewClick="changeCustomerInsurerDialog"
      @addCustomerInsurer="addCustomerInsurerDialog"
      @addCustomer="addCustomer"
      @deleteCustomerInsurer="deleteCustomerInsurerClicked"
      @deleteCustomer="deleteCustomerClicked"
      @sort="sortCustomers"
    />

    <q-dialog v-model="showDelCustomerDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            {{ $t('configurationHeader.confirmDeleteCustomer') }}
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button
            color="red"
            :label="$t('configurationProduct.delete')"
            @click="deleteCustomerConfirmed"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

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
          <div class="text-h6">{{ $t('configurationHeader.changeCustomerInsurerTitle') }}</div>
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
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import PrassiConfigurationCustomerInsurerList from '../components/configuration/prassi-configuration-customer-insurer-list';

export default {
  name: 'CustomersDetailHistory',
  components: {
    PrassiConfigurationCustomerInsurerList,
  },
  data() {
    return {
      customerSelected: undefined,
      showAddDialog: false,
      showDelCustomerDialog: false,
      form: {
        networkId: undefined,
        productivePeriodMonth: new Date().getMonth() + 1,
        productivePeriodYear: new Date().getFullYear(),
      },
      optionsNetworkList: this.networkList,
      optionsPromoterList: this.promoterList,
      optionsCustomerList: this.CustomerList,
      showDelDialog: false,
      dossierToDelete: '',
    };
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      customersInsurer: (state) => state.configuration.customerInsurer.items,
      filter: (state) => state.configuration.filterCustomer,
      last: (state) => state.configuration.customerInsurer.lastRecord,
      isFetching: (state) => state.error.isFetching,
      network: (state) => state.promoters.network.items,
      roles: (state) => state.promoters.roles.items,
    }),
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
        const roleName = this.$utils.getRoleName(this.roles, el.roleId);
        networkList.push({
          label: `${el.displayHierarchy} - ${roleName} - ${el.validPromoterName} ${
            el.inherited ? '(*)' : ''
          }`,
          value: el._id,
        });
      });

      return networkList;
    },
  },
  watch: {
    'form.productivePeriodMonth': {
      immediate: true,
      handler() {
        this.fetchNetworkPeriod({
          year: this.form.productivePeriodYear,
          month: this.form.productivePeriodMonth,
          quarter: 1,
          selected: 'month',
        }).then(() => {
          if (this.customerSelected) {
            this.form.networkId = {
              value: this.customerSelected.networkNodeId,
              label: `${this.customerSelected.displayHierarchy}`,
            };
            const networkNode = this.network.find(
              (elNetwork) => elNetwork._id === this.customerSelected.networkNodeId,
            );
            if (networkNode) {
              const roleName = this.$utils.getRoleName(this.roles, networkNode.roleId);
              this.form.networkId = {
                value: this.customerSelected.networkNodeId,
                label: `${networkNode.displayHierarchy} - ${roleName} - ${
                  networkNode.validPromoterName
                } ${networkNode.inherited ? '(*)' : ''}`,
              };
            }
          }
        });
      },
    },
    'form.productivePeriodYear': {
      immediate: true,
      // eslint-disable-next-line sonarjs/no-identical-functions
      handler() {
        this.fetchNetworkPeriod({
          year: this.form.productivePeriodYear,
          month: this.form.productivePeriodMonth,
          quarter: 1,
          selected: 'month',
          // eslint-disable-next-line sonarjs/no-identical-functions
        }).then(() => {
          if (this.customerSelected) {
            this.form.networkId = {
              value: this.customerSelected.networkNodeId,
              label: `${this.customerSelected.displayHierarchy}`,
            };
            const networkNode = this.network.find(
              (elNetwork) => elNetwork._id === this.customerSelected.networkNodeId,
            );
            if (networkNode) {
              const roleName = this.$utils.getRoleName(this.roles, networkNode.roleId);
              this.form.networkId = {
                value: this.customerSelected.networkNodeId,
                label: `${networkNode.displayHierarchy} - ${roleName} - ${
                  networkNode.validPromoterName
                } ${networkNode.inherited ? '(*)' : ''}`,
              };
            }
          }
        });
      },
    },
  },
  methods: {
    ...mapActions({
      fetchNetwork: 'promoters/fetchNetwork',
      fetchCustomerInsurers: 'configuration/fetchCustomerInsurers',
      saveCustomerInsurer: 'configuration/saveCustomerInsurer',
      deleteCustomerInsurer: 'configuration/deleteCustomerInsurer',
      deleteCustomer: 'dossiers/deleteCustomer',
      fetchNetworkPeriod: 'promoters/fetchNetworkPeriod',
    }),
    ...mapMutations({
      setCustomerInsurerSorting: 'configuration/setCustomerInsurerSorting',
      resetCustomerInsurer: 'configuration/resetCustomerInsurer',
    }),
    filterNetwork(value, update) {
      update(() => {
        const needle = value.toLowerCase();
        this.optionsNetworkList = this.networkList.filter((v) =>
          v.label.toLowerCase().includes(needle),
        );
      });
    },
    sortCustomers(sort) {
      this.$utils.logobj('CUSTOMER-DETAIL-HISTORY', 'sortCustomers', sort);
      this.setCustomerInsurerSorting(sort);
      this.resetCustomerInsurer();
    },
    addCustomerInsurerDialog() {
      this.$utils.log('CUSTOMER-DETAIL-HISTORY', 'addCustomerInsurerDialog');
      this.customerSelected = undefined;
      this.fetchNetwork().then(() => {
        this.form.networkId = undefined;
        this.showAddDialog = true;
      });
    },
    addCustomer() {
      this.$utils.log('CUSTOMER-DETAIL-HISTORY', 'viewCustomerLegacy');
      const { id } = this.$route.params;
      const msId = id.split('-');
      const msId1 =
        msId[0].slice(6, 8) + msId[0].slice(4, 6) + msId[0].slice(2, 4) + msId[0].slice(0, 2);
      const msId2 = msId[1].slice(2, 4) + msId[1].slice(0, 2);
      const msId3 = msId[2].slice(2, 4) + msId[2].slice(0, 2);
      window.open(
        `${this.$env.legacyBaseUrl}/#/nuovaProposta/${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}`,
        '_self',
      );
    },
    changeCustomerInsurerDialog(customer) {
      this.$utils.logobj('CUSTOMER-DETAIL-HISTORY', 'changeCustomerInsurerDialog', customer);
      this.customerSelected = customer;
      this.form.networkId = {
        value: customer.networkNodeId,
        label: `${customer.displayHierarchy}`,
      };
      this.fetchNetworkPeriod({
        year: this.form.productivePeriodYear,
        month: this.form.productivePeriodMonth,
        quarter: 1,
        selected: 'month',
      }).then(() => {
        const networkNode = this.network.find(
          (elNetwork) => elNetwork._id === customer.networkNodeId,
        );
        if (networkNode) {
          const roleName = this.$utils.getRoleName(this.roles, networkNode.roleId);
          this.form.networkId = {
            value: customer.networkNodeId,
            label: `${networkNode.displayHierarchy} - ${roleName} - ${
              networkNode.validPromoterName
            } ${networkNode.inherited ? '(*)' : ''}`,
          };
        }
        this.form.productivePeriodMonth = customer.productivePeriodMonth;
        this.form.productivePeriodYear = customer.productivePeriodYear;
        this.showAddDialog = true;
      });
    },
    comfirmAddCustomerInsurer() {
      if (this.form.networkId) {
        this.showAddDialog = false;
        const networkNode = this.network.find(
          (elNetwork) => elNetwork._id === this.form.networkId.value,
        ) || { promoterId: undefined };

        const customer = {
          networkNodeId: this.form.networkId.value,
          promoterId: networkNode.promoterId,
          customerId: this.$route.params.id,
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
      this.$utils.logobj('CUSTOMER-DETAIL-HISTORY', 'deleteCustomerInsurerClicked', customer);
      this.customerToDelete = customer.id;
      this.showDelDialog = true;
    },
    deleteCustomerClicked() {
      this.$utils.log('CUSTOMER-DETAIL-HISTORY', 'deleteCustomerClicked');
      this.showDelCustomerDialog = true;
    },
    deleteCustomerConfirmed() {
      this.$utils.log('CUSTOMER-DETAIL-HISTORY', 'deleteCustomerConfirmed');
      this.deleteCustomer(this.$route.params.id).then(() => {
        this.$router.back();
        this.$q.notify({
          message: this.$t('default.deleteOk'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    deleteDossierInsurerConfirmed() {
      this.$utils.log('CUSTOMER-DETAIL-HISTORY', 'deleteDossierInsurerConfirmed');
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
    // eslint-disable-next-line no-unused-vars
    loadMoreCustomers({ index, done }) {
      if (this.last || this.error) {
        this.$refs.configurationCustomerInsurerList.stopScrolling();
      } else {
        this.$utils.logobj('CUSTOMER-DETAIL-HISTORY', 'loadMoreCustomers', index);
        this.fetchCustomerInsurers(this.filter.fields).finally(() => done());
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
