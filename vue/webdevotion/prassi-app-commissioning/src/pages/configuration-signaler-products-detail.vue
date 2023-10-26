<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <q-card inline flat color="white" text-color="primary">
      <q-card-section>
        <div class="p-pc-title-section">{{ $t('configurationProduct.title') }}</div>
        <div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-5"
              v-model="form.productCode"
              type="text"
              :label="$t('configurationProduct.productCode')"
              :error-message="$t('configurationProduct.errorLabel')"
              :error="$v.form.productCode.$error"
              @blur="$v.form.productCode.$touch"
              @keyup.enter="submit"
            />
            <q-input
              class="col-5"
              v-model="form.productName"
              type="text"
              :label="$t('configurationProduct.productName')"
              :error-message="$t('configurationProduct.errorLabel')"
              :error="$v.form.productName.$error"
              @blur="$v.form.productName.$touch"
              @keyup.enter="submit"
            />
          </div>
          <div class="row justify-center">
            <q-input
              class="p-pc-small-field"
              v-model="form.amount"
              type="number"
              prefix="€"
              max-decimals="2"
              min="0"
              max="1"
              step="0.01"
              :label="$t('configurationProduct.amount')"
              :error-message="$t('configurationProduct.errorLabel')"
              @keyup.enter="submit"
            />
          </div>
        </div>
        <prassi-standard-button
          class="q-mb-lg"
          color="red"
          :loading="isFetching"
          :label="$t('configurationProduct.delete')"
          @click="cancel"
        />
        <prassi-standard-button
          class="q-mb-lg"
          :loading="isFetching"
          :label="$t('configurationProduct.save')"
          @click="submit"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'ConfigurationSignalerProductsDetail',
  data() {
    return {
      form: {
        productCode: '',
        productName: '',
        amount: 0,
        _id: this.$route.params.id,
      },
    };
  },
  computed: {
    ...mapState({
      product: (state) => state.configuration.signalerProduct,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  created() {
    this.resetConfigurationProduct();
    this.fetchSignalerProduct(this.$route.params.id);
  },
  validations: {
    form: {
      productCode: {
        required,
      },
      productName: {
        required,
      },
      amount: {
        required,
      },
      _id: {
        required,
      },
    },
  },
  watch: {
    product: {
      immediate: true,
      handler(product) {
        this.$utils.logobj('CONFIGURATION-SIGNALER-PRODUCTS-DETAIL', 'product', product);
        this.form.productCode = product.productCode;
        this.form.productName = product.productName;
        this.form.amount = product.amount / 100;
      },
    },
  },
  methods: {
    ...mapActions({
      fetchSignalerProduct: 'configuration/fetchSignalerProduct',
      saveSignalerProduct: 'configuration/saveSignalerProduct',
      deleteSignalerProduct: 'configuration/deleteSignalerProduct',
    }),
    ...mapMutations({
      resetConfigurationProduct: 'configuration/resetSignalerProduct',
    }),
    submit() {
      this.$v.form.$touch();
      if (!this.$v.form.$error) {
        this.$utils.logobj('CONF-SIGNALER-PRODUCTS-DETAIL', 'submit product conf', this.form);

        const changedProduct = {
          ...this.product,
          productCode: this.form.productCode,
          productName: this.form.productName,
          amount: Math.round(this.form.amount * 100),
        };
        this.$utils.logobj('CONF-SIGNALER-PRODUCTS-DETAIL', 'submit product conf', changedProduct);
        this.saveSignalerProduct({ productId: changedProduct._id, body: changedProduct }).then(
          () => {
            this.$q.notify({
              message: this.$t('configurationProduct.saveOk'),
              color: 'secondary',
              timeout: 300,
            });
          },
        );
      } else {
        this.$q.notify(this.$t('configurationProduct.cantSave'));
      }
    },
    cancel() {
      this.$utils.logobj('CONFIGURATION-SIGNALER-PRODUCTS-DETAIL', 'delete product', this.form._id);
      this.deleteSignalerProduct(this.form._id).then(() => {
        this.$q.notify({
          message: this.$t('configurationProduct.deleteOk'),
          color: 'secondary',
          timeout: 300,
        });
        this.$router.push('/configuration/signaler-products');
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 660px
  max-width 1100px
.q-card
  border-radius 2px
  border solid 2px $card-border
  min-height 280px
.q-card-main
  padding 10px 15px 0
  min-height 34px
.p-pc-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  margin-bottom 20px
.p-pc-toggle
  width 45%
  justify-content space-between
  font-size 22px
</style>
