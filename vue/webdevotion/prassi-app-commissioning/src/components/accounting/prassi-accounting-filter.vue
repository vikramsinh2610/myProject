<template>
  <q-card inline flat color="white" text-color="primary">
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
        v-if="showType"
        class="col-3 q-ml-lg"
        clearable
        v-model="type"
        :label="$t('accounting.typeLabel')"
        :options="typeList"
      />
      <q-select
        class="col-3 q-ml-lg"
        clearable
        v-model="product"
        filter
        :label="$t('accounting.productLabel')"
        :options="productList"
      />
      <q-select
        class="col-3 q-ml-lg"
        clearable
        v-model="company"
        :label="$t('accounting.companyLabel')"
        :options="companyList"
      />
    </q-card-actions>
    <q-card-actions />
  </q-card>
</template>

<script>
import constants from '../../constants';

export default {
  name: 'PrassiAccountingFilter',
  data() {
    return {
      product: undefined,
      company: undefined,
      type: undefined,
      filterInternal: { ...this.filter },
    };
  },
  props: {
    filter: {
      type: Object,
      default: () => ({
        searchContract: '',
        type: constants.noSelection,
        product: constants.noSelection,
        company: constants.noSelection,
      }),
    },
    showType: {
      type: Boolean,
      default: false,
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
      default: () => [],
    },
  },
  computed: {
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
    'filterInternal.searchContract': function (value) {
      this.$utils.logobj('PRASSI-ACCOUNTING-FILTER', 'searchContract', value);
      this.$emit('changed', { ...this.filterInternal, searchContract: value });
    },
    filter(filter) {
      this.$utils.logobj('PRASSI-ACCOUNTING-FILTER', 'filter changed', filter);
      this.filterInternal = { ...filter };
    },
    type(value) {
      this.$utils.logobj('PRASSI-ACCOUNTING-FILTER', 'type changed', value);
      this.filterInternal = { ...this.filterInternal, type: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
    product(value) {
      this.$utils.logobj('PRASSI-ACCOUNTING-FILTER', 'product changed', value);
      this.filterInternal = { ...this.filterInternal, product: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
    company(value) {
      this.$utils.logobj('PRASSI-ACCOUNTING-FILTER', 'company changed', value);
      this.filterInternal = { ...this.filterInternal, company: value ? value.value : undefined };
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
