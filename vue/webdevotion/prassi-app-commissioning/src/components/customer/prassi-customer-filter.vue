<template>
  <div style="width: 100%">
    <q-card inline flat color="white" text-color="primary">
      <q-card-actions class="row q-px-lg">
        <q-select
          class="col select-ellipsis"
          use-input
          clearable
          v-model="networkId"
          :label="$t('filterPromoterBlock.searchNetwork')"
          :options="optionsNetworkList"
          @filter="filterNetwork"
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
      </q-card-actions>
    </q-card>
    <q-card style="width: 100%" inline flat color="white" text-color="primary">
      <q-card-actions class="row q-px-lg">
        <q-input
          class="col"
          v-model="filterInternal.searchCustomer"
          debounce="500"
          clearable
          :placeholder="$t('filterPromoterBlock.searchCustomer')"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select
          class="col-3 q-ml-lg select-ellipsis"
          clearable
          v-model="customerType"
          :label="$t('accounting.typeLabel')"
          :options="typeList"
        />
        <q-select
          class="col-3 q-ml-lg select-ellipsis"
          clearable
          v-model="customerStatus"
          :label="$t('accounting.statusLabel')"
          :options="statusList"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import constants from '../../constants';

export default {
  name: 'PrassiCustomerFilter',
  data() {
    return {
      filterInternal: { ...this.filter },
      promoterId: undefined,
      networkId: undefined,
      customerType: undefined,
      customerStatus: undefined,
      optionsNetworkList: this.networkList,
      optionsPromoterList: this.promoterList,
    };
  },
  props: {
    filter: {
      type: Object,
      default: () => ({
        selected: '',
        customerId: '',
        searchCustomer: '',
        promoterId: '',
        networkId: '',
        customerType: constants.noSelection,
        customerStatus: constants.noSelection,
      }),
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    promoters: {
      type: Array,
      default: () => [],
    },
    network: {
      type: Array,
      default: () => [],
    },
    typeList: {
      type: Array,
      default: () => [],
    },
    statusList: {
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
  },
  computed: {
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
      this.$utils.logobj('PRASSI-CUSTOMER-FILTER', 'filter changed', filter);
      this.filterInternal = { ...filter };
    },
    'filterInternal.searchCustomer': function (value) {
      this.$utils.logobj('PRASSI-CUSTOMER-FILTER', 'searchCustomerModel', value);
      this.$emit('changed', { ...this.filterInternal, searchCustomer: value });
    },
    'filterInternal.selected': function (selected) {
      this.$utils.logobj('PRASSI-CUSTOMER-FILTER', 'filterInternal.selected', selected);
      this.$emit('changed', { ...this.filterInternal, selected });
    },
    'filterInternal.roleType': function (value) {
      this.$utils.logobj('PRASSI-CUSTOMER-FILTER', 'roles changed', value);
      this.$emit('changed', { ...this.filterInternal, roleType: value });
    },
    promoterId(value) {
      this.$utils.logobj('PRASSI-CUSTOMER-FILTER', 'searchByPromoter', value);
      this.filterInternal = { ...this.filterInternal, promoterId: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
    networkId(value) {
      this.$utils.logobj('PRASSI-CUSTOMER-FILTER', 'searchByNetwork', value);
      this.filterInternal = { ...this.filterInternal, networkId: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
    customerType(value) {
      this.$utils.logobj('PRASSI-CUSTOMER-FILTER', 'customerType changed', value);
      this.filterInternal = {
        ...this.filterInternal,
        customerType: value ? value.value : undefined,
      };
      this.$emit('changed', { ...this.filterInternal });
    },
    customerStatus(value) {
      this.$utils.logobj('PRASSI-CUSTOMER-FILTER', 'customerStatus changed', value);
      this.filterInternal = {
        ...this.filterInternal,
        customerStatus: value ? value.value : undefined,
      };
      this.$emit('changed', { ...this.filterInternal });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-top-left-radius 4px
  border-top-right-radius 4px
  border-bottom-right-radius 0
  border-bottom-left-radius 0
  border-top solid 1px $card-border
  border-left solid 1px $card-border
  border-right solid 1px $card-border
.q-separator
  background-color $card-border
.p-pf-plus
  margin auto 0 auto auto
.p-pf-plus:hover
  border-color $secondary
</style>
