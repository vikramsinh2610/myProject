<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-configuration-signaler-product-list
      class="fill-available"
      ref="ConfigurationSignalerProductsList"
      :products="products"
      :is-fetching="isFetching"
      @loadMore="loadMoreProducts"
      @searchProduct="searchProduct"
      @addSignalerProduct="addSignalerProduct"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />

    <q-dialog v-model="showAddDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('configurationHeader.addDialogTitle') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="column justify-between">
            <q-select
              class="col-6"
              v-model="product"
              :label="$t('configurationHeader.products')"
              :options="productList"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.addButton')" @click="comfirmAddProduct" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiConfigurationSignalerProductList from '../components/configuration/prassi-configuration-signaler-products-list';

export default {
  name: 'ConfigurationSignalerProducts',
  components: {
    PrassiConfigurationSignalerProductList,
  },
  data() {
    return {
      showAddDialog: false,
      product: '',
      productList: [],
    };
  },
  mounted() {
    this.setProductsSearchText('');
    this.resetProducts();
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      products: (state) => state.configuration.signalerProducts.items,
      productsBase: (state) => state.accounting.products.items,
      allSignalerProducts: (state) => state.configuration.allSignalerProducts.items,
      last: (state) => state.configuration.signalerProducts.lastRecord,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  methods: {
    ...mapActions({
      fetchProducts: 'configuration/fetchSignalerProducts',
      fetchAllSignalerProducts: 'configuration/fetchAllSignalerProducts',
    }),
    ...mapMutations({
      resetProducts: 'configuration/resetSignalerProducts',
      setProductsSearchText: 'configuration/setProductsSearchText',
    }),
    async addSignalerProduct() {
      await this.fetchAllSignalerProducts();
      const ids = new Set(this.allSignalerProducts.map((el) => el._id));
      const productsMap = this.productsBase
        .filter((el) => !ids.has(el._id))
        .map((el) => ({
          label: el.name,
          value: el._id,
        }));
      this.$utils.log('CONFIGURATION-SIGNALER-PRODUCTS', 'addSignalerProduct');
      this.productList = productsMap;
      this.showAddDialog = true;
    },
    comfirmAddProduct() {
      if (this.product) {
        this.showAddDialog = false;
        this.$utils.logobj('CONF-SIGNALER-PRODUCTS', 'comfirmAddProduct', this.product.value);
        this.$router.push({ path: `/configuration/signaler-products/${this.product.value}` });
      } else {
        this.error = true;
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    searchProduct(search) {
      this.$utils.logobj('CONFIGURATION-SIGNALER-PRODUCTS', 'searchProduct', search);
      this.setProductsSearchText(search);
      this.resetProducts();
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreProducts({ index, done }) {
      if (this.last || this.error) {
        this.$refs.ConfigurationSignalerProductsList.stopScrolling();
      } else {
        this.fetchProducts().finally(() => done());
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
.center-spinner
  display block
  margin auto
</style>
