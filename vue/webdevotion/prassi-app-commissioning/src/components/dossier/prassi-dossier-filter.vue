<template>
  <div>
    <q-card style="width: 100%" inline flat color="white" text-color="primary">
      <q-card-actions style="width: 100%" class="row q-px-lg">
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
        <q-input
          class="col q-ml-lg"
          v-model="filterInternal.searchCustomer"
          debounce="500"
          clearable
          :placeholder="$t('filterPromoterBlock.searchCustomer')"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-actions>
    </q-card>
    <q-card style="width: 100%" inline flat color="white" text-color="primary">
      <q-card-actions class="row q-px-lg">
        <q-input
          class="col"
          v-model="filterInternal.searchContract"
          debounce="500"
          clearable
          :placeholder="$t('accounting.searchContract')"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select
          class="col-2 q-ml-lg select-ellipsis"
          clearable
          v-model="company"
          :loading="disabled"
          :disable="disabled"
          :label="$t('accounting.companyLabel')"
          :options="companyList"
        />
        <q-select
          class="col-2 q-ml-lg select-ellipsis"
          clearable
          :loading="disabled"
          :disable="disabled"
          v-model="product"
          filter
          :label="$t('accounting.productLabel')"
          :options="productList"
        />
        <q-select
          v-if="typeList.length > 0"
          :class="`${smallColumns ? 'col-1' : 'col-2'} q-ml-lg select-ellipsis`"
          clearable
          v-model="type"
          :loading="disabled"
          :disable="disabled"
          :multiple="multipleTypes"
          :label="$t('accounting.typeLabel')"
          :options="typeList"
        />
        <q-select
          v-if="statusList.length > 0"
          :class="`${smallColumns ? 'col-1' : 'col-2'} q-ml-lg select-ellipsis`"
          clearable
          v-model="status"
          :loading="disabled"
          :disable="disabled"
          :multiple="multipleStates"
          :label="$t('accounting.statusLabel')"
          :options="statusList"
        />
        <q-select
          v-if="confirmedChoice"
          :class="`${smallColumns ? 'col-1' : 'col-2'} q-ml-lg select-ellipsis`"
          :loading="disabled"
          clearable
          v-model="confirmed"
          :label="$t('dossierHeader.confirmed')"
          :options="confirmedList"
        />
        <q-select
          v-if="paidChoice"
          :class="`${smallColumns ? 'col-1' : 'col-2'} q-ml-lg select-ellipsis`"
          :loading="disabled"
          clearable
          v-model="paid"
          :label="$t('dossierHeader.paid')"
          :options="paidList"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import constants from '../../constants';

export default {
  name: 'PrassiDossierFilter',
  data() {
    return {
      promoterId: undefined,
      networkId: undefined,
      product: undefined,
      company: undefined,
      type: undefined,
      status: undefined,
      confirmed: undefined,
      paid: undefined,
      filterInternal: { ...this.filter },
      optionsNetworkList: this.networkList,
      optionsPromoterList: this.promoterList,
      confirmedList: [
        {
          label: 'tutte',
          value: 'all',
        },
        {
          label: 'confermate',
          value: 'confirmed',
        },
        {
          label: 'non confermate',
          value: 'not-confirmed',
        },
      ],
      paidList: [
        {
          label: 'tutte',
          value: 'all',
        },
        {
          label: 'pagate alla rete',
          value: 'paid',
        },
        {
          label: 'non pagate alla rete',
          value: 'not-paid',
        },
      ],
    };
  },
  props: {
    filter: {
      type: Object,
      default: () => ({
        promoterId: '',
        customerId: '',
        networkId: '',
        searchContract: '',
        product: constants.noSelection,
        company: constants.noSelection,
        type: undefined,
        status: undefined,
      }),
    },
    promoters: {
      type: Array,
      default: () => [],
    },
    network: {
      type: Array,
      default: () => [],
    },
    companyTypes: {
      type: Array,
      default: () => [],
    },
    productTypes: {
      type: Array,
      default: () => [],
    },
    typeList: {
      type: Array,
      default: () => [
        {
          label: 'Sottoscrizione',
          value: 5,
        },
        {
          label: 'Versamento aggiuntivo',
          value: 2,
        },
        {
          label: 'Fuori Sacco',
          value: 9,
        },
        {
          label: 'Incasso',
          value: 7,
        },
        {
          label: 'Recesso',
          value: 6,
        },
        {
          label: 'Rinnovo',
          value: 16,
        },
        {
          label: 'Riscatto totale',
          value: 1,
        },
        {
          label: 'Riscatto parziale',
          value: 3,
        },
        {
          label: 'Scadenza',
          value: 12,
        },
        {
          label: 'Scadenza con rendita',
          value: 13,
        },
        {
          label: 'Sinistro',
          value: 11,
        },
        {
          label: 'Storno',
          value: 8,
        },
        {
          label: 'Storno Per Insolvenza',
          value: 10,
        },
        {
          label: 'Trasferimento Fondo',
          value: 14,
        },
        {
          label: 'Disdetta',
          value: 17,
        },
        {
          label: 'Annullamento',
          value: 15,
        },
      ],
    },
    statusList: {
      type: Array,
      default: () => [],
    },
    confirmedChoice: {
      type: Boolean,
      default: false,
    },
    smallColumns: {
      type: Boolean,
      default: false,
    },
    paidChoice: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: () => [],
    },
    multipleTypes: {
      type: Boolean,
      default: false,
    },
    multipleStates: {
      type: Boolean,
      default: false,
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
    productList() {
      const productList = [];

      this.productTypes.forEach((el) => {
        productList.unshift({
          label: el.label,
          value: el.value,
        });
      });

      productList.unshift({
        label: this.$t(`default.${constants.noSelection}`),
        value: constants.noSelection,
      });

      return productList;
    },
    companyList() {
      const companyList = [];

      this.companyTypes.forEach((el) => {
        companyList.unshift({
          label: el.label,
          value: el.value,
        });
      });

      companyList.unshift({
        label: this.$t(`default.${constants.noSelection}`),
        value: constants.noSelection,
      });

      return companyList;
    },
  },
  watch: {
    filter(filter) {
      this.$utils.logobj('PRASSI-DOSSIER-FILTER', 'filter changed', filter);
      this.filterInternal = { ...filter };
    },
    promoterId(value) {
      this.$utils.logobj('PRASSI-DOSSIER-FILTER', 'searchByPromoter', value);
      this.filterInternal = { ...this.filterInternal, promoterId: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
    customerId(value) {
      this.$utils.logobj('PRASSI-DOSSIER-FILTER', 'searchByCustomer', value);
      this.filterInternal = { ...this.filterInternal, customerId: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
    networkId(value) {
      this.$utils.logobj('PRASSI-DOSSIER-FILTER', 'searchByNetwork', value);
      this.filterInternal = { ...this.filterInternal, networkId: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
    'filterInternal.searchContract': function (value) {
      this.$utils.logobj('PRASSI-DOSSIER-FILTER', 'searchContract', value);
      this.$emit('changed', { ...this.filterInternal, searchContract: value });
    },
    'filterInternal.searchCustomer': function (value) {
      this.$utils.logobj('PRASSI-DOSSIER-FILTER', 'searchCustomerModel', value);
      this.$emit('changed', { ...this.filterInternal, searchCustomer: value });
    },
    type(value) {
      this.$utils.logobj('PRASSI-DOSSIER-FILTER', 'type changed', value);
      if (this.multipleTypes) {
        this.filterInternal = {
          ...this.filterInternal,
          type: value && value.length > 0 ? value.map((el) => el.value) : undefined,
        };
        this.$emit('changed', { ...this.filterInternal });
      } else {
        this.filterInternal = { ...this.filterInternal, type: value ? value.value : undefined };
        this.$emit('changed', { ...this.filterInternal });
      }
    },
    status(value) {
      this.$utils.logobj('PRASSI-DOSSIER-FILTER', 'status changed', value);
      if (this.multipleStates) {
        this.filterInternal = {
          ...this.filterInternal,
          status: value && value.length > 0 ? value.map((el) => el.value) : undefined,
        };
        this.$emit('changed', { ...this.filterInternal });
      } else {
        this.filterInternal = { ...this.filterInternal, status: value ? value.value : undefined };
        this.$emit('changed', { ...this.filterInternal });
      }
    },
    product(value) {
      this.$utils.logobj('PRASSI-DOSSIER-FILTER', 'product changed', value);
      this.filterInternal = { ...this.filterInternal, product: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
    company(value) {
      this.$utils.logobj('PRASSI-DOSSIER-FILTER', 'company changed', value);
      this.filterInternal = { ...this.filterInternal, company: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
    confirmed(value) {
      this.$utils.logobj('PRASSI-DOSSIER-FILTER', 'confirmed changed', value);
      this.filterInternal = { ...this.filterInternal, confirmed: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
    paid(value) {
      this.$utils.logobj('PRASSI-DOSSIER-FILTER', 'paid changed', value);
      this.filterInternal = { ...this.filterInternal, paid: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
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
