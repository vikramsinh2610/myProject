<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-configuration-product-list
      class="fill-available"
      ref="ConfigurationProductsList"
      :products="products"
      :is-fetching="isFetching"
      @loadMore="loadMoreProducts"
      @searchProduct="searchProduct"
      @copyProduct="doCopyProduct"
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
import PrassiConfigurationProductList from '../components/configuration/prassi-configuration-products-list';

export default {
  name: 'ConfigurationProducts',
  components: {
    PrassiConfigurationProductList,
  },
  data() {
    return {
      showAddDialog: false,
      product: undefined,
      productToCopy: '',
    };
  },
  mounted() {
    this.setProductsSearchText('');
    this.resetProducts();
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      products: (state) => state.configuration.products.items,
      productsBase: (state) => state.accounting.products.items,
      last: (state) => state.configuration.products.lastRecord,
      isFetching: (state) => state.error.isFetching,
    }),
    productList() {
      return this.productsBase.map((el) => ({
        label: el.name,
        value: el._id,
      }));
    },
  },
  methods: {
    ...mapActions({
      fetchProducts: 'configuration/fetchProducts',
      copyProduct: 'configuration/copyProduct',
    }),
    ...mapMutations({
      resetProducts: 'configuration/resetProducts',
      setProductsSearchText: 'configuration/setProductsSearchText',
    }),
    comfirmAddProduct() {
      if (this.product) {
        this.showAddDialog = false;
        this.copyProduct({ confId: this.productToCopy, confIdtoAdd: this.product.value }).then(
          () => {
            this.resetProducts();
            this.$q.notify({
              message: this.$t('configurationProduct.saveOk'),
              color: 'secondary',
              timeout: 300,
            });
          },
        );
      } else {
        this.error = true;
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    doCopyProduct(product) {
      this.$utils.logobj('CONFIGURATION-PRODUCTS', 'copyProduct', product);
      this.productToCopy = product;
      this.showAddDialog = true;
    },
    searchProduct(search) {
      this.$utils.logobj('CONFIGURATION-PRODUCTS', 'searchProduct', search);
      this.setProductsSearchText(search);
      this.resetProducts();
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreProducts({ index, done }) {
      if (this.last || this.error) {
        this.$refs.ConfigurationProductsList.stopScrolling();
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
