<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <q-card inline flat class="bg-white text-primary">
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
          <div class="row justify-between q-my-xs">
            <q-select
              class="col-5"
              :label="$t('configurationProduct.surveyTypePerson')"
              v-model="form.surveyTypePerson"
              :options="typeList"
            />
            <q-select
              class="col-5"
              :label="$t('configurationProduct.surveyTypeCompany')"
              v-model="form.surveyTypeCompany"
              :options="typeList"
            />
          </div>

          <div class="row justify-between q-my-xs">
            <q-input
              class="p-pc-small-field"
              v-model="form.monthsOnSubscription"
              type="number"
              :label="$t('configurationProduct.monthsOnSubscription')"
              :error-message="$t('configurationProduct.errorLabel')"
              @keyup.enter="submit"
            />
            <q-input
              class="p-pc-small-field"
              v-model="form.subscriptionYears"
              type="number"
              :label="$t('configurationProduct.subscriptionYears')"
              :error-message="$t('configurationProduct.errorLabel')"
              @keyup.enter="submit"
            />
          </div>
          <div class="row justify-between q-ma-lg">
            <q-checkbox
              class="p-pc-toggle"
              left-label
              v-model="form.advance"
              :label="$t('configurationProduct.advance')"
            />
            <q-checkbox
              class="p-pc-toggle"
              left-label
              v-model="form.companyAdvance"
              :label="$t('configurationProduct.companyAdvance')"
            />
          </div>
          <div class="row justify-between q-ma-lg">
            <q-toggle
              class="p-pc-toggle"
              left-label
              v-model="form.premiumType"
              true-value="net"
              false-value="gross"
              :label="$t('configurationProduct.premiumType')"
              color="secondary"
            />
            <q-checkbox
              class="p-pc-toggle"
              left-label
              v-model="form.promoter100"
              :label="$t('configurationProduct.promoter100')"
            />
          </div>

          <div>
            <q-list bordered>
              <q-expansion-item
                group="somegroup"
                icon="fas fa-funnel-dollar"
                :label="$t(`configurationProduct.tableTitle`)"
                default-opened
                header-class="text-primary"
              >
                <q-table
                  :title="$t(`configurationProduct.tableTitle`)"
                  class="q-my-lg"
                  :pagination.sync="pagination"
                  :data="tableData"
                  :columns="columns"
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
                      <q-input
                        v-if="col.currency !== 'float'"
                        class="table-input"
                        :style="`width: ${col.length}px;`"
                        :type="col.currency !== 'text' ? 'number' : 'text'"
                        :suffix="computeCurrencySymbol(col.currency)"
                        v-model="props.row[col.field]"
                      />
                      <q-input
                        v-if="col.currency === 'float'"
                        class="table-input"
                        v-model="props.row[col.field]"
                        mask="#.##"
                        fill-mask="0"
                        reverse-fill-mask
                        input-class="text-right"
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
                        <q-btn
                          round
                          dense
                          flat
                          icon="fas fa-times"
                          @click.stop="removeRow(props.row)"
                        />
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
                      @click="addRow"
                    />
                  </div>
                </q-table>
              </q-expansion-item>

              <q-separator />

              <q-expansion-item
                group="somegroup"
                icon="fas fa-funnel-dollar"
                :label="$t(`configurationProduct.tableAdjustedAdvanceTable`)"
                header-class="text-primary"
              >
                <q-table
                  class="q-my-lg"
                  :pagination.sync="paginationAdvance"
                  :data="tableDataAdvance"
                  :columns="columnsAdvance"
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
                      <q-input
                        v-if="col.currency !== 'float'"
                        class="table-input"
                        :style="`width: ${col.length}px;`"
                        :type="col.currency !== 'text' ? 'number' : 'text'"
                        :suffix="computeCurrencySymbol(col.currency)"
                        v-model="props.row[col.field]"
                      />
                      <q-input
                        v-if="col.currency === 'float'"
                        class="table-input"
                        v-model="props.row[col.field]"
                        mask="#.##"
                        fill-mask="0"
                        reverse-fill-mask
                        input-class="text-right"
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
                            @click.stop="moveRowUpAdvance(props.row)"
                          />
                          <q-btn
                            round
                            dense
                            flat
                            size="sm"
                            icon="fa fa-chevron-down"
                            @click.stop="moveRowDownAdvance(props.row)"
                          />
                        </div>
                        <q-btn
                          round
                          dense
                          flat
                          icon="fas fa-times"
                          @click.stop="removeRowAdvance(props.row)"
                        />
                      </div>
                    </q-td>
                  </q-tr>
                </q-table>
                <q-btn
                  rounded
                  flat
                  icon="fa fa-plus"
                  class="p-btn-icon block"
                  color="secondary"
                  text-color="secondary"
                  :label="$t('configurationProduct.addRow')"
                  @click="addRowAdvance"
                />
              </q-expansion-item>

              <q-separator />

              <q-expansion-item
                group="somegroup"
                icon="fas fa-funnel-dollar"
                :label="$t(`configurationProduct.tableAdjustedBracketsTable`)"
                header-class="text-primary"
              >
                <q-table
                  class="q-my-lg"
                  :pagination.sync="paginationBrackets"
                  :data="tableDataBrackets"
                  :columns="columnsBrackets"
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
                      <q-input
                        v-if="col.currency !== 'float'"
                        class="table-input"
                        :style="`width: ${col.length}px;`"
                        :type="col.currency !== 'text' ? 'number' : 'text'"
                        mask="#.##"
                        :suffix="computeCurrencySymbol(col.currency)"
                        v-model="props.row[col.field]"
                      />
                      <q-input
                        v-if="col.currency === 'float'"
                        class="table-input"
                        v-model="props.row[col.field]"
                        mask="#.##"
                        fill-mask="0"
                        reverse-fill-mask
                        input-class="text-right"
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
                            @click.stop="moveRowUpBrackets(props.row)"
                          />
                          <q-btn
                            round
                            dense
                            flat
                            size="sm"
                            icon="fa fa-chevron-down"
                            @click.stop="moveRowDownBrackets(props.row)"
                          />
                        </div>
                        <q-btn
                          round
                          dense
                          flat
                          icon="fas fa-times"
                          @click.stop="removeRowBrackets(props.row)"
                        />
                      </div>
                    </q-td>
                  </q-tr>
                </q-table>
                <q-btn
                  rounded
                  flat
                  icon="fa fa-plus"
                  class="p-btn-icon block"
                  color="secondary"
                  text-color="secondary"
                  :label="$t('configurationProduct.addRow')"
                  @click="addRowBrackets"
                />
              </q-expansion-item>
            </q-list>
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
import arrayMove from 'array-move';

export default {
  name: 'ConfigurationProductsDetail',
  data() {
    return {
      pagination: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      paginationAdvance: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      paginationBrackets: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      typeList: [],
      columns: [
        {
          name: '_id',
          currency: 'text',
          required: true,
          label: this.$t(`configurationProduct._id`),
          align: 'left',
          field: '_id',
          length: '150',
        },
        {
          name: 'fixedAmount',
          currency: 'float',
          required: true,
          label: this.$t(`configurationProduct.fixedAmount`),
          align: 'left',
          field: 'fixedAmount',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
          length: '70',
        },
        {
          name: 'fromPremiumAmount',
          currency: 'float',
          required: true,
          label: this.$t(`configurationProduct.fromPremiumAmount`),
          align: 'left',
          field: 'fromPremiumAmount',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
          length: '70',
        },
        {
          name: 'toPremiumAmount',
          currency: 'float',
          required: true,
          label: this.$t(`configurationProduct.toPremiumAmount`),
          align: 'left',
          field: 'toPremiumAmount',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
          length: '70',
        },
        {
          name: 'fromYear',
          currency: false,
          required: true,
          label: this.$t(`configurationProduct.fromYear`),
          align: 'left',
          field: 'fromYear',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
        },
        {
          name: 'toYear',
          currency: false,
          required: true,
          label: this.$t(`configurationProduct.toYear`),
          align: 'left',
          field: 'toYear',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
        },
        {
          name: 'percentage',
          currency: 'float',
          required: true,
          label: this.$t(`configurationProduct.percentage`),
          align: 'left',
          field: 'percentage',
          format: (value) => `${this.$n(value, 'nodecimals')}%`,
          length: '50',
        },
        {
          name: 'retrocessionFee',
          currency: 'float',
          required: true,
          label: this.$t(`configurationProduct.retrocessionFee`),
          align: 'left',
          field: 'retrocessionFee',
          format: (value) => `${this.$n(value, 'nodecimals')}%`,
        },
      ],
      tableData: [],
      columnsAdvance: [
        {
          name: 'Year',
          type: 'number',
          currency: false,
          required: true,
          label: this.$t(`configurationJobs.fromProductivePeriodYear`),
          align: 'left',
          field: 'fromProductivePeriodYear',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
          length: '140',
        },
        {
          name: 'Month',
          type: 'number',
          currency: false,
          required: true,
          label: this.$t(`configurationJobs.fromProductivePeriodMonth`),
          align: 'left',
          field: 'fromProductivePeriodMonth',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
          length: '140',
        },
        {
          name: 'advanceYears',
          type: 'number',
          currency: false,
          required: true,
          label: this.$t(`configurationProduct.advanceYears`),
          align: 'left',
          field: 'advanceYears',
          length: '140',
        },
        {
          name: 'advancePremium',
          type: 'number',
          currency: 'float',
          required: true,
          label: this.$t(`configurationProduct.advancePremium`),
          align: 'left',
          field: 'advancePremium',
          length: '140',
        },
        {
          name: 'yearly',
          type: 'number',
          required: true,
          label: this.$t(`configurationProduct.yearly`),
          align: 'left',
          field: 'yearly',
          length: '140',
        },
        {
          name: 'yearlyPremium',
          type: 'number',
          currency: 'float',
          required: true,
          label: this.$t(`configurationProduct.yearlyPremium`),
          align: 'left',
          field: 'yearlyPremium',
          length: '140',
        },
      ],
      tableDataAdvance: [],
      columnsBrackets: [
        {
          name: 'Year',
          type: 'number',
          currency: false,
          required: true,
          label: this.$t(`configurationJobs.fromProductivePeriodYear`),
          align: 'left',
          field: 'fromProductivePeriodYear',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
          length: '140',
        },
        {
          name: 'Month',
          type: 'number',
          currency: false,
          required: true,
          label: this.$t(`configurationJobs.fromProductivePeriodMonth`),
          align: 'left',
          field: 'fromProductivePeriodMonth',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
          length: '140',
        },
        {
          name: 'amount',
          type: 'number',
          currency: 'float',
          required: true,
          label: this.$t(`configurationProduct.amountUpTo`),
          align: 'left',
          field: 'amount',
          length: '140',
        },
        {
          name: 'duration',
          type: 'number',
          required: true,
          label: this.$t(`configurationProduct.durationUpTo`),
          align: 'left',
          field: 'duration',
          length: '140',
        },
        {
          name: 'advanceYears',
          type: 'number',
          currency: false,
          required: true,
          label: this.$t(`configurationProduct.advanceYearsBrackets`),
          align: 'left',
          field: 'advanceYears',
          length: '140',
        },
        {
          name: 'yearly',
          type: 'number',
          required: true,
          label: this.$t(`configurationProduct.yearlyBrackets`),
          align: 'left',
          field: 'yearly',
          length: '140',
        },
        {
          name: 'amountPremium',
          type: 'number',
          currency: 'float',
          required: true,
          label: this.$t(`configurationProduct.amountPremium`),
          align: 'left',
          field: 'amountPremium',
          length: '140',
        },
      ],
      tableDataBrackets: [],
      form: {
        productCode: '',
        productName: '',
        monthsOnSubscription: 0,
        subscriptionYears: 0,
        advance: 0,
        companyAdvance: 0,
        surveyTypePerson: undefined,
        surveyTypeCompany: undefined,
        premiumType: 'net',
        promoter100: false,
        _id: this.$route.params.id,
      },
    };
  },
  computed: {
    ...mapState({
      product: (state) => state.configuration.product,
      isFetching: (state) => state.error.isFetching,
      types: (state) => state.configuration.types,
    }),
  },
  created() {
    this.resetConfigurationProduct();
    this.fetchConfigurationProduct(this.$route.params.id);
  },
  validations: {
    form: {
      productCode: {
        required,
      },
      productName: {
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
        this.$utils.logobj('CONFIGURATION-PRODUCTS-DETAIL', 'product', product);
        if (!product.options) return;
        this.form.productCode = product.productCode;
        this.form.productName = product.productName;
        this.form.monthsOnSubscription = product.monthsOnSubscription;
        this.form.subscriptionYears = product.subscriptionYears;
        this.form.advance = product.advance;
        this.form.companyAdvance = product.companyAdvance;
        this.form.premiumType = product.premiumType;
        this.form.promoter100 = product.promoter100;

        let type = this.types.find((el) => el._id === product.surveyTypePerson);
        this.form.surveyTypePerson = type
          ? {
              label: type.description,
              value: type._id,
            }
          : {
              label: 'Generico',
              value: 'default',
            };

        type = this.types.find((el) => el._id === product.surveyTypeCompany);
        this.form.surveyTypeCompany = type
          ? {
              label: type.description,
              value: type._id,
            }
          : {
              label: 'Generico',
              value: 'default',
            };

        this.tableData = [];
        product.options.forEach((cb) => {
          const rowColumn = {
            _id: cb._id,
            fixedAmount: Number.parseFloat(cb.fixedAmount / 100, 10).toFixed(2),
            fromPremiumAmount: Number.parseFloat(cb.fromPremiumAmount / 100, 10).toFixed(2),
            toPremiumAmount: Number.parseFloat(cb.toPremiumAmount / 100, 10).toFixed(2),
            fromYear: cb.fromYear,
            toYear: cb.toYear,
            percentage: Number.parseFloat(cb.percentage / 100, 10).toFixed(2),
            retrocessionFee: Number.parseFloat(cb.retrocessionFee / 100, 10).toFixed(2),
          };
          this.tableData.push(rowColumn);
        });

        this.tableDataAdvance = [];
        if (product.adjustedAdvance && product.adjustedAdvance.length > 0) {
          product.adjustedAdvance.forEach((cb) => {
            const rowColumn = {
              fromProductivePeriodYear: cb.fromProductivePeriodYear,
              fromProductivePeriodMonth: cb.fromProductivePeriodMonth,
              advanceYears: cb.advanceYears / 100,
              advancePremium: Number.parseFloat(cb.advancePremium / 100, 10).toFixed(2),
              yearly: cb.yearly / 100,
              yearlyPremium: Number.parseFloat(cb.yearlyPremium / 100, 10).toFixed(2),
            };
            this.tableDataAdvance.push(rowColumn);
          });
        }

        this.tableDataBrackets = [];
        if (product.adjustedBrackets && product.adjustedBrackets.length > 0) {
          product.adjustedBrackets.forEach((cb) => {
            const rowColumn = {
              fromProductivePeriodYear: cb.fromProductivePeriodYear,
              fromProductivePeriodMonth: cb.fromProductivePeriodMonth,
              amount: Number.parseFloat(cb.amount / 100, 10).toFixed(2),
              amountPremium: Number.parseFloat(cb.amountPremium / 100, 10).toFixed(2),
              duration: cb.duration / 100,
              advanceYears: cb.advanceYears / 100,
              yearly: cb.yearly / 100,
            };
            this.tableDataBrackets.push(rowColumn);
          });
        }
      },
    },
    types: {
      immediate: true,
      handler(types) {
        this.$utils.logobj('CONFIGURATION-SURVEY-DETAIL', 'types', types);
        this.typeList = types.map((el) => ({
          label: el.description,
          value: el._id,
        }));
      },
    },
  },
  methods: {
    ...mapActions({
      fetchConfigurationProduct: 'configuration/fetchProduct',
      saveConfigurationProduct: 'configuration/saveProduct',
      deleteProduct: 'configuration/deleteProduct',
    }),
    ...mapMutations({
      resetConfigurationProduct: 'configuration/resetProduct',
    }),
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
    addRow() {
      const rowBonus = {
        _id: 'DEFAULT',
        fixedAmount: 0,
        fromPremiumAmount: 0,
        toPremiumAmount: 0,
        fromYear: 0,
        toYear: 0,
        percentage: 0,
        retrocessionFee: 0,
      };
      this.tableData.push(rowBonus);
    },
    removeRow(row) {
      const position = this.tableData.indexOf(row);
      if (this.tableData.length > 1) {
        this.tableData.splice(position, 1);
      }
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
    addRowAdvance() {
      const today = new Date();
      const rowBonus = {
        fromProductivePeriodYear: today.getFullYear(),
        fromProductivePeriodMonth: today.getMonth() + 1,
        advanceYears: 3,
        advancePremium: 20,
        yearly: 1,
        yearlyPremium: 10,
      };
      this.tableDataAdvance.push(rowBonus);
    },
    removeRowAdvance(row) {
      const position = this.tableDataAdvance.indexOf(row);
      if (this.tableDataAdvance.length > 0) {
        this.tableDataAdvance.splice(position, 1);
      }
    },
    moveRowUpAdvance(row) {
      const position = this.tableDataAdvance.indexOf(row);
      if (position >= 1) {
        arrayMove.mutate(this.tableDataAdvance, position, position - 1);
      }
    },
    moveRowDownAdvance(row) {
      const position = this.tableDataAdvance.indexOf(row);
      if (position < this.tableDataAdvance.length - 1) {
        arrayMove.mutate(this.tableDataAdvance, position, position + 1);
      }
    },
    addRowBrackets() {
      const today = new Date();
      const rowBonus = {
        fromProductivePeriodYear: today.getFullYear(),
        fromProductivePeriodMonth: today.getMonth() + 1,
        amount: 5000,
        amountPremium: 20,
        duration: 10,
        advanceYears: 3,
        yearly: 1,
      };
      this.tableDataBrackets.push(rowBonus);
    },
    removeRowBrackets(row) {
      const position = this.tableDataBrackets.indexOf(row);
      if (this.tableDataBrackets.length > 0) {
        this.tableDataBrackets.splice(position, 1);
      }
    },
    moveRowUpBrackets(row) {
      const position = this.tableDataBrackets.indexOf(row);
      if (position >= 1) {
        arrayMove.mutate(this.tableDataBrackets, position, position - 1);
      }
    },
    moveRowDownBrackets(row) {
      const position = this.tableDataBrackets.indexOf(row);
      if (position < this.tableDataBrackets.length - 1) {
        arrayMove.mutate(this.tableDataBrackets, position, position + 1);
      }
    },
    submit() {
      this.$v.form.$touch();
      if (!this.$v.form.$error) {
        this.$utils.logobj('CONFIGURATION-PRODUCTS-DETAIL', 'submit product conf', this.form);
        this.$utils.logobj('CONFIGURATION-PRODUCTS-DETAIL', 'Data', this.tableData);
        this.$utils.logobj('CONFIGURATION-PRODUCTS-DETAIL', 'DataAdvance', this.tableDataAdvance);
        this.$utils.logobj('CONFIGURATION-PRODUCTS-DETAIL', 'DataBrackets', this.tableDataBrackets);

        const changedOptions = [];
        this.tableData.forEach((row) => {
          const rowOptions = {
            _id: row._id,
            fixedAmount: Math.trunc(Number.parseFloat(row.fixedAmount, 10) * 100),
            fromPremiumAmount: Math.trunc(Number.parseFloat(row.fromPremiumAmount, 10) * 100),
            toPremiumAmount: Math.trunc(Number.parseFloat(row.toPremiumAmount, 10) * 100),
            fromYear: Number.parseInt(row.fromYear, 10),
            toYear: Number.parseInt(row.toYear, 10),
            percentage: Math.trunc(Number.parseFloat(row.percentage, 10) * 100),
            retrocessionFee: Math.trunc(Number.parseFloat(row.retrocessionFee, 10) * 100),
          };
          changedOptions.push(rowOptions);
        });

        const changedAdjustedAdvance = [];
        this.tableDataAdvance.forEach((row) => {
          const rowOptions = {
            fromProductivePeriodYear: Number.parseInt(row.fromProductivePeriodYear, 10),
            fromProductivePeriodMonth: Number.parseInt(row.fromProductivePeriodMonth, 10),
            advanceYears: Math.trunc(Number.parseInt(row.advanceYears, 10) * 100),
            advancePremium: Math.trunc(Number.parseFloat(row.advancePremium, 10) * 100),
            yearly: Math.trunc(Number.parseInt(row.yearly, 10) * 100),
            yearlyPremium: Math.trunc(Number.parseFloat(row.yearlyPremium, 10) * 100),
          };
          changedAdjustedAdvance.push(rowOptions);
        });

        const changedAdjustedBrackets = [];
        this.tableDataBrackets.forEach((row) => {
          const rowOptions = {
            fromProductivePeriodYear: Number.parseInt(row.fromProductivePeriodYear, 10),
            fromProductivePeriodMonth: Number.parseInt(row.fromProductivePeriodMonth, 10),
            amount: Math.trunc(Number.parseFloat(row.amount, 10) * 100),
            amountPremium: Math.trunc(Number.parseFloat(row.amountPremium, 10) * 100),
            duration: Math.trunc(Number.parseInt(row.duration, 10) * 100),
            advanceYears: Math.trunc(Number.parseInt(row.advanceYears, 10) * 100),
            yearly: Math.trunc(Number.parseInt(row.yearly, 10) * 100),
          };
          changedAdjustedBrackets.push(rowOptions);
        });

        const changedProduct = {
          ...this.product,
          productCode: this.form.productCode,
          productName: this.form.productName,
          monthsOnSubscription: this.form.monthsOnSubscription,
          subscriptionYears: this.form.subscriptionYears,
          advance: this.form.advance,
          companyAdvance: this.form.companyAdvance,
          premiumType: this.form.premiumType,
          promoter100: this.form.promoter100,
          options: changedOptions,
          adjustedAdvance: changedAdjustedAdvance,
          adjustedBrackets: changedAdjustedBrackets,
          surveyTypeCompany: this.form.surveyTypeCompany.value,
          surveyTypePerson: this.form.surveyTypePerson.value,
        };
        this.$utils.logobj('CONFIGURATION-PRODUCTS-DETAIL', 'submit product conf', changedProduct);
        this.saveConfigurationProduct({ productId: changedProduct._id, body: changedProduct }).then(
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
      this.$utils.logobj('CONFIGURATION-PRODUCTS-DETAIL', 'delete product', this.form._id);
      this.deleteProduct(this.form._id).then(() => {
        this.$q.notify({
          message: this.$t('configurationProduct.deleteOk'),
          color: 'secondary',
          timeout: 300,
        });
        this.$router.push('/configuration/products');
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
