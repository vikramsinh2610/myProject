<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <q-card inline flat color="white" text-color="primary">
      <q-card-section>
        <div class="p-pc-title-section">{{ $t('configurationAdjustedPremium.title') }}</div>
        <div>
          <q-table
            :title="$t(`configurationAdjustedPremium.tableTitleProducts`)"
            class="q-my-lg"
            :pagination.sync="pagination"
            :data="tableDataProducts"
            :columns="columnsProducts"
            row-key="name"
          >
            <q-tr slot="header" slot-scope="props" :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <div>
                  {{ col.label }}
                </div>
              </q-th>
            </q-tr>

            <q-tr slot="body" slot-scope="props" :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <q-select
                  v-if="col.field == 'productId'"
                  v-model="props.row[col.field]"
                  :options="productsBaseList"
                  @input="updateProductsList()"
                />
                <q-input
                  v-if="col.field != 'productId'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  :type="col.currency !== 'text' ? 'number' : 'text'"
                  :suffix="computeCurrencySymbol(col.currency)"
                  v-model="props.row[col.field]"
                />
              </q-td>
              <q-td>
                <div class="row items-center" style="min-width: 60px">
                  <div class="column">
                    <q-btn
                      round
                      dense
                      flat
                      size="sm"
                      icon="fa fa-chevron-up"
                      @click.stop="moveRowUp(props.row)"
                    />
                    <q-btn
                      round
                      dense
                      flat
                      size="sm"
                      icon="fa fa-chevron-down"
                      @click.stop="moveRowDown(props.row)"
                    />
                  </div>
                  <q-btn round dense flat icon="fas fa-times" @click.stop="removeRow(props.row)" />
                </div>
              </q-td>
            </q-tr>

            <!--eslint-disable-next-line vue/no-unused-vars-->
            <div slot="bottom" slot-scope="props" class="row fit">
              <q-btn
                rounded
                flat
                icon="fa fa-plus"
                class="p-btn-icon block"
                color="secondary"
                text-color="secondary"
                :label="$t('configurationProduct.addRow')"
                @click="addRowProducts"
              />
            </div>
          </q-table>
        </div>
        <prassi-standard-button
          class="q-mb-lg"
          color="red"
          :loading="isFetching"
          :label="$t('configurationAdjustedPremium.delete')"
          @click="cancel"
        />
        <prassi-standard-button
          class="q-mb-lg"
          :loading="isFetching"
          :label="$t('configurationAdjustedPremium.save')"
          @click="submit"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions } from 'vuex';
import arrayMove from 'array-move';

export default {
  name: 'ConfigurationAdjustedPremiumDetail',
  data() {
    return {
      pagination: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      productsBaseList: [],
      columnsProducts: [
        {
          name: 'productId',
          currency: 'text',
          required: true,
          label: this.$t(`configurationAdjustedPremium.productId`),
          align: 'left',
          field: 'productId',
          length: '300',
        },
        {
          name: 'adjustedPercentageSubscription',
          currency: true,
          required: true,
          label: this.$t(`configurationAdjustedPremium.adjustedPercentageSubscription`),
          align: 'left',
          field: 'adjustedPercentageSubscription',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
          length: '70',
        },
        {
          name: 'adjustedPercentageAdditionalIncome',
          currency: true,
          required: true,
          label: this.$t(`configurationAdjustedPremium.adjustedPercentageAdditionalIncome`),
          align: 'left',
          field: 'adjustedPercentageAdditionalIncome',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
          length: '70',
        },
        {
          name: 'adjustedBonus',
          currency: true,
          required: true,
          label: this.$t(`configurationAdjustedPremium.adjustedBonus`),
          align: 'left',
          field: 'adjustedBonus',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
          length: '70',
        },
      ],
      tableDataProducts: [
        {
          productId: {
            label: '',
            value: 0,
          },
          adjustedPercentageSubscription: 0,
          adjustedPercentageAdditionalIncome: 0,
          adjustedBonus: 0,
        },
      ],
      form: {
        idAdjustedPremium: this.$route.params.id,
      },
    };
  },
  props: {
    products: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState({
      productsBase: (state) => state.accounting.products.items,
      adjustedPremium: (state) => state.configuration.adjustedPremium,
      isFetching: (state) => state.error.isFetching,
    }),
    productList() {
      return this.productsBase.map((el) => ({
        label: el.name,
        value: el._id,
      }));
    },
  },
  created() {
    this.fetchConfigurationAdjustedPremium(this.$route.params.id);
  },
  validations: {
    tableDataProducts: {
      required,
    },
  },
  watch: {
    adjustedPremium: {
      immediate: true,
      handler(adjustedPremium) {
        this.form.idAdjustedPremium = adjustedPremium._id;
        this.tableDataProducts =
          adjustedPremium.products.length > 0
            ? []
            : [
                {
                  productId: {
                    label: '',
                    value: 0,
                  },
                  adjustedPercentageSubscription: 0,
                  adjustedPercentageAdditionalIncome: 0,
                  adjustedBonus: 0,
                },
              ];
        const ids = new Set(this.adjustedPremium.products.map((el) => el.productId));
        this.productsBaseList = this.productsBase
          .filter((el) => !ids.has(el._id))
          .map((el) => ({
            label: el.name,
            value: el._id,
          }));
        adjustedPremium.products.forEach((cb) => {
          const productSelected = this.productList.find((el) => cb.productId === el.value);
          const rowColumn = {
            productId: {
              label: productSelected ? productSelected.label : `(*) ${cb.productName}`,
              value: cb.productId,
            },
            adjustedPercentageSubscription: cb.adjustedPercentageSubscription / 100,
            adjustedPercentageAdditionalIncome: cb.adjustedPercentageAdditionalIncome / 100,
            adjustedBonus: cb.adjustedBonus / 100,
          };
          this.tableDataProducts.push(rowColumn);
        });
      },
    },
  },
  methods: {
    ...mapActions({
      fetchConfigurationAdjustedPremium: 'configuration/fetchAdjustedPremium',
      saveConfigurationAdjustedPremium: 'configuration/saveAdjustedPremium',
      deleteConfigurationAdjustedPremium: 'configuration/deleteAdjustedPremium',
    }),
    updateProductsList() {
      const ids = new Set(this.tableDataProducts.map((el) => el.productId.value));
      this.productsBaseList = this.productsBase
        .filter((el) => !ids.has(el._id))
        .map((el) => ({
          label: el.name,
          value: el._id,
        }));
    },
    computeCurrencySymbol(symbol) {
      switch (symbol) {
        case 'currency':
          return '€';
        case 'percentage':
          return '%';
        default:
          return '';
      }
    },
    addRowProducts() {
      const rowBonus = {
        productId: {
          label: '',
          value: 0,
        },
        adjustedPercentageSubscription: 0,
        adjustedPercentageAdditionalIncome: 0,
        adjustedBonus: 0,
      };
      this.tableDataProducts.push(rowBonus);
    },
    removeRow(row) {
      const position = this.tableData.indexOf(row);
      if (this.tableData.length > 1) {
        this.tableData.splice(position, 1);
      } else {
        this.tableDataProducts = [
          {
            productId: {
              label: '',
              value: 0,
            },
            adjustedPercentageSubscription: 0,
            adjustedPercentageAdditionalIncome: 0,
            adjustedBonus: 0,
          },
        ];
      }
      this.updateProductsList();
    },
    moveRowUp(row) {
      const position = this.tableData.indexOf(row);
      if (position >= 1) {
        arrayMove.mutate(this.tableData, position, position - 1);
      }
    },
    moveRowDown(row) {
      const position = this.tableData.indexOf(row);
      if (position < this.tableData.length - 1) {
        arrayMove.mutate(this.tableData, position, position + 1);
      }
    },
    submit() {
      this.$v.$touch();
      if (!this.$v.$error) {
        const changedTableDataProducts = [];
        this.tableDataProducts.forEach((row) => {
          const rowOptions = {
            productId: row.productId.value,
            productName: row.productId.label.replace('(*) ', ''),
            adjustedPercentageSubscription: Math.trunc(row.adjustedPercentageSubscription * 100),
            adjustedPercentageAdditionalIncome: Math.trunc(
              row.adjustedPercentageAdditionalIncome * 100,
            ),
            adjustedBonus: Math.trunc(row.adjustedBonus * 100),
          };
          if (rowOptions.productId !== 0) {
            changedTableDataProducts.push(rowOptions);
          }
        });

        const changedAdjustedPremium = {
          ...this.adjustedPremium,
          products: changedTableDataProducts,
        };
        this.saveConfigurationAdjustedPremium({
          idAdjustedPremium: this.form.idAdjustedPremium,
          body: changedAdjustedPremium,
        }).then(() => {
          this.$q.notify({
            message: this.$t('configurationProduct.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
        });
      } else {
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    cancel() {
      this.deleteConfigurationAdjustedPremium(this.form.idAdjustedPremium).then(() => {
        this.$q.notify({
          message: this.$t('default.deleteOk'),
          color: 'secondary',
          timeout: 300,
        });
        this.$router.push('/configuration/adjusted-premium');
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
