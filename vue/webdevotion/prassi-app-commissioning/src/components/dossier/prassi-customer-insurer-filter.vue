<template>
  <div style="width: 100%">
    <q-card style="width: 100%" inline flat color="white" text-color="primary">
      <q-card-actions class="row q-px-md">
        <q-select
          class="col select-ellipsis"
          use-input
          clearable
          v-model="customerId"
          :label="$t('filterPromoterBlock.searchCustomer')"
          :options="optionsCustomerList"
          @filter="filterCustomer"
        />
        <q-select
          class="col q-ml-lg select-ellipsis"
          use-input
          clearable
          v-model="promoterId"
          :label="$t('filterPromoterBlock.searchPromoter')"
          :options="optionsPromoterList"
          @filter="filterPromoter"
        />
        <q-select
          class="col q-ml-lg select-ellipsis"
          use-input
          clearable
          v-model="networkId"
          :label="$t('filterPromoterBlock.searchNetwork')"
          :options="optionsNetworkList"
          @filter="filterNetwork"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import constants from '../../constants';

export default {
  name: 'PrassiDossierInsurerFilter',
  data() {
    return {
      promoterId: undefined,
      networkId: undefined,
      customerId: undefined,
      filterInternal: { ...this.filter },
      optionsNetworkList: this.networkList,
      optionsPromoterList: this.promoterList,
      optionsCustomerList: this.CustomerList,
    };
  },
  props: {
    filter: {
      type: Object,
      default: () => ({
        promoterId: '',
        networkId: '',
        searchContract: '',
      }),
    },
    customers: {
      type: Array,
      default: () => [],
    },
    promoters: {
      type: Array,
      default: () => [],
    },
    network: {
      type: Array,
      default: () => [],
    },
    roles: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
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
  },
  computed: {
    customerList() {
      const customerList = [];

      this.customers.forEach((el) => {
        customerList.push({
          label: el.displayName,
          value: el._id,
        });
      });

      customerList.unshift({
        label: this.$t(`default.${constants.noSelection}`),
        value: constants.noSelection,
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

      promoterList.unshift({
        label: this.$t(`default.${constants.noSelection}`),
        value: constants.noSelection,
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
  watch: {
    filter(filter) {
      this.$utils.logobj('PRASSI-DOSSIER-INSURER-FILTER', 'filter changed', filter);
      this.filterInternal = { ...filter };
    },
    customerId(value) {
      this.$utils.logobj('PRASSI-DOSSIER-INSURER-FILTER', 'searchByCustomer', value);
      this.filterInternal = { ...this.filterInternal, customerId: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
    promoterId(value) {
      this.$utils.logobj('PRASSI-DOSSIER-INSURER-FILTER', 'searchByPromoter', value);
      this.filterInternal = { ...this.filterInternal, promoterId: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
    networkId(value) {
      this.$utils.logobj('PRASSI-DOSSIER-INSURER-FILTER', 'searchByNetwork', value);
      this.filterInternal = { ...this.filterInternal, networkId: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
    'filterInternal.searchContract': function (value) {
      this.$utils.logobj('PRASSI-DOSSIER-INSURER-FILTER', 'searchContract', value);
      this.$emit('changed', { ...this.filterInternal, searchContract: value });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  margin-bottom 3px
  border-radius 4px
  border solid 1px $card-border
.q-separator
  background-color $card-border
.p-pf-plus
  margin auto 0 auto auto
.p-pf-plus:hover
  border-color $secondary
</style>
