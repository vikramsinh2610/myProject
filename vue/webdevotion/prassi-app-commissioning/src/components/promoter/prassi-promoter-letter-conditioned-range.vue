<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-title-section">
        {{ $t('promoterInsertLetter.detailData') }} {{ name }}
        <prassi-round-button
          class="float-right"
          icon="fa fa-chevron-up"
          @click="$emit('previousStep')"
        />
      </div>
      <div>
        <div class="row justify-between q-my-xs q-gutter-xs">
          <q-select
            class="col"
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="form.fromProductivePeriodMonth"
            :label="$t('promoterInsertLetter.monthLabel')"
            :hint="$t('promoterInsertLetter.fromProductivePeriodMonthHelper')"
            :options="$utils.productivePeriodMonthList($t.bind(this))"
          />
          <q-input
            class="p-micro-field"
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="form.fromProductivePeriodYear"
            type="number"
            :label="$t('promoterInsertLetter.productivePeriodYear')"
            :error-message="$t('promoterInsertLetter.productivePeriodYearError')"
            :error="$v.form.fromProductivePeriodYear.$error"
            @blur="$v.form.fromProductivePeriodYear.$touch"
            @keyup.enter="submit"
          />
          <q-select
            class="col"
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="form.toProductivePeriodMonth"
            :label="$t('promoterInsertLetter.monthLabel')"
            :hint="$t('promoterInsertLetter.toProductivePeriodMonthHelper')"
            :options="$utils.productivePeriodMonthList($t.bind(this))"
          />
          <q-input
            class="p-micro-field"
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="form.toProductivePeriodYear"
            type="number"
            :label="$t('promoterInsertLetter.productivePeriodYear')"
            :error-message="$t('promoterInsertLetter.productivePeriodYearError')"
            :error="$v.form.toProductivePeriodYear.$error"
            @blur="$v.form.toProductivePeriodYear.$touch"
            @keyup.enter="submit"
          />
        </div>

        <q-table
          v-if="status !== 'wip' || $user.roleID < 7"
          class="q-my-lg"
          :pagination.sync="pagination"
          :data="tableData"
          :columns="columns"
          row-key="name"
        >
          <q-tr slot="header" slot-scope="props" :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              <div>{{ col.label }}</div>
              <div>{{ col.option ? computeProduct(col.option) : '' }}</div>
            </q-th>
          </q-tr>
        </q-table>

        <q-table
          v-if="status === 'wip' && $user.roleID >= 7"
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
                <q-btn
                  round
                  dense
                  flat
                  size="xs"
                  v-if="col.name !== 'premium'"
                  icon="fas fa-times"
                  @click.stop="removeColumn(col)"
                />
              </div>
              <div>{{ col.option ? computeProduct(col.option) : '' }}</div>
            </q-th>
          </q-tr>

          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <q-input
                style="max-width: 100px"
                class="table-input"
                type="number"
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
              :label="$t('promoterInsertLetter.addRow')"
              @click="addRow"
            />
            <q-btn
              rounded
              flat
              icon-right="fa fa-plus"
              class="p-btn-icon block"
              color="secondary"
              text-color="secondary"
              :label="$t('promoterInsertLetter.addColumn')"
            >
              <q-popup-edit
                v-model="form.kpiSelected"
                persistent
                buttons
                :validate="validateKpi"
                @save="addColumn"
              >
                <q-select
                  v-model="form.kpiSelected"
                  :label="$t('promoterInsertLetter.selectKpi')"
                  :options="kpiList"
                />
                <q-select
                  v-if="
                    form.kpiSelected &&
                    (form.kpiSelected.value.includes('PRODUCT') ||
                      form.kpiSelected.value.includes('ADJUSTED-PREMIUM'))
                  "
                  v-model="form.productSelected"
                  :label="$t('promoterInsertLetter.selectProduct')"
                  :options="productList"
                />
              </q-popup-edit>
            </q-btn>
          </div>
        </q-table>

        <div class="row justify-between q-my-xs">
          <q-checkbox
            class="p-pc-toggle col-12"
            :readonly="status !== 'wip' || $user.roleID < 7"
            left-label
            v-model="form.cumulateConditionedBonuses"
            :label="$t('promoterInsertLetter.cumulateConditionedBonuses')"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            v-if="showInheritFreq"
            class="full-width"
            readonly
            :label="$t('promoterInsertLetter.frequency')"
            :value="$t('promoterInsertLetter.inheritFrequencyPayment')"
            type="text"
          />
          <q-select
            v-if="!showInheritFreq"
            class="full-width"
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="form.paymentFrequency"
            :label="$t('promoterInsertLetter.frequency')"
            :options="frequencyList"
            :hint="$t('promoterInsertLetter.frequencyHelper')"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-select
            class="full-width"
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="form.paymentTime"
            :label="$t('promoterInsertLetter.paymentTime')"
            :options="paymentTimeList"
            :hint="$t('promoterInsertLetter.paymentTimeHelper')"
          />
        </div>

        <div class="row justify-between q-my-xs" v-if="form.paymentTime !== 'prepayment'">
          <q-select
            class="col-5"
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="form.paymentPeriod"
            :label="$t('promoterInsertLetter.paymentPeriod')"
            :options="paymentPeriodList"
            :hint="$t('promoterInsertLetter.paymentPeriodHelper')"
          />
          <q-input
            class="col-5"
            :readonly="true"
            v-model="paymentPeriodDescription"
            type="text"
            :label="$t('promoterInsertLetter.paymentPeriodComputed')"
          />
        </div>

        <div class="row justify-between q-my-xs" v-if="form.paymentTime === 'prepayment'">
          <q-input
            class="col-5"
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="form.maxRecoveryPercentage"
            type="number"
            suffix="%"
            :label="$t('promoterInsertLetter.maxRecoveryPercentage')"
            :hint="$t('promoterInsertLetter.maxRecoveryPercentageHelper')"
            :error="$v.form.maxRecoveryPercentage.$error"
            @blur="$v.form.maxRecoveryPercentage.$touch"
            @keyup.enter="submit"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-10"
            :readonly="status !== 'wip' || $user.roleID < 7"
            :label="$t('promoterInsertLetter.invoiceDescription')"
            v-model="form.invoiceDescription"
            type="text"
            @blur="$v.form.invoiceDescription.$touch"
            @keyup.enter="submit"
          />
        </div>
      </div>
      <prassi-standard-button
        class="q-my-lg"
        v-if="status === 'wip' && $user.roleID >= 7"
        :loading="isFetching"
        :label="$t('promoterCompany.save')"
        @click="submit"
      />
      <prassi-round-button
        class="q-mb-md float-right"
        icon="fa fa-chevron-down"
        @click="nextStep"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import arrayMove from 'array-move';
import { required, between } from 'vuelidate/lib/validators';

export default {
  name: 'PrassiPromoterLetterConditionedRange',
  data() {
    return {
      pagination: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      selectedRows: [],
      columns: [
        {
          name: 'premium',
          currency: 'currency',
          required: true,
          label: this.$t(`promoterInsertLetter.premium`),
          align: 'left',
          field: 'premium',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
        },
      ],
      tableData: [],
      paymentPeriodDescription: 'descr',
      form: {
        paymentPeriod: undefined,
        paymentFrequency: undefined,
        paymentTime: undefined,
        definedTargets: 'defined',
        invoiceDescription: '',
        fromProductivePeriodMonth: {
          label: this.$utils.numberToMonth(new Date().getMonth() + 1, this.$t.bind(this)),
          value: new Date().getMonth() + 1,
        },
        fromProductivePeriodYear: new Date().getFullYear(),
        toProductivePeriodMonth: {
          label: this.$utils.numberToMonth(new Date().getMonth() + 1, this.$t.bind(this)),
          value: new Date().getMonth() + 1,
        },
        toProductivePeriodYear: new Date().getFullYear(),
        kpiSelected: undefined,
        productSelected: undefined,
        maxRecoveryPercentage: 0,
        cumulateConditionedBonuses: true,
        _id: '',
      },
      paymentPeriodList: [
        {
          label: '+0',
          value: 0,
        },
        {
          label: '+1',
          value: 1,
        },
        {
          label: '+2',
          value: 2,
        },
        {
          label: '+3',
          value: 3,
        },
      ],
      paymentTimeList: [
        {
          label: this.$t(`promoterInsertLetter.prepaymentTime`),
          value: 'prepayment',
        },
        {
          label: this.$t(`promoterInsertLetter.paymentDelayed`),
          value: 'payment-delayed',
        },
      ],
    };
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    invoiceDescription: {
      type: String,
      default: '',
    },
    conditionedBonuses: {
      type: Array,
      default: () => [],
    },
    selectedSettings: {
      type: Object,
      default: () => ({}),
    },
    products: {
      type: Array,
      default: () => [],
    },
    showInheritFreq: {
      type: Boolean,
      default: false,
    },
    cumulateConditionedBonuses: {
      type: Boolean,
      default: true,
    },
    productivePeriod: {
      type: Object,
      default: () => ({}),
    },
    paymentFrequency: {
      type: String,
      default: 'monthly',
    },
  },
  validations: {
    form: {
      threshold: {
        required: false,
        integer: true,
        between: between(0, 100),
      },
      thresholdApplication: {
        required: false,
      },
      paymentPeriod: {
        required,
      },
      maxRecoveryPercentage: {
        required: false,
        integer: true,
        between: between(0, 100),
      },
      fromProductivePeriodMonth: {
        required,
      },
      fromProductivePeriodYear: {
        required,
        integer: true,
        between: between(0, 2200),
      },
      toProductivePeriodMonth: {
        required,
      },
      toProductivePeriodYear: {
        required,
        integer: true,
        between: between(0, 2200),
      },
      invoiceDescription: {},
    },
  },
  computed: {
    frequencyList() {
      const frequencyList = [];

      Object.entries(this.selectedSettings.paymentFrequency || {}).forEach((key) => {
        frequencyList.push({
          label: this.$t(`promoterInsertLetter.${key[1]}`),
          value: key[1],
        });
      });

      return frequencyList;
    },
    kpiList() {
      const detailTypeList = [];

      Object.entries(this.selectedSettings.targets || {}).forEach((key) => {
        detailTypeList.push({
          label: this.$t(`promoterInsertLetter.${key[0]}-SMALL`),
          value: key[0],
        });
      });

      return detailTypeList;
    },
    productList() {
      const productList = [];

      productList.push({
        label: this.$t(`promoterInsertLetter.allProducts`),
        value: 'all-products',
      });

      this.products.forEach((el) => {
        productList.push({
          label: el.name,
          value: el._id,
        });
      });

      return productList;
    },
  },
  watch: {
    invoiceDescription: {
      immediate: true,
      handler(invoiceDescription) {
        this.form.invoiceDescription = invoiceDescription;
      },
    },
    conditionedBonuses: {
      immediate: true,
      handler(conditionedBonuses) {
        this.$utils.logobj('PRASSI-LETTER-CONDITIONED', 'conditionedBonuses', conditionedBonuses);

        // eslint-disable-next-line sonarjs/cognitive-complexity
        conditionedBonuses.forEach((cb) => {
          this.form.paymentTime = {
            label: this.paymentTimeList.find((el) => cb.paymentTime === el.value).label,
            value: cb.paymentTime,
          };
          this.form.paymentPeriod = {
            label: this.paymentPeriodList.find((el) => cb.productivePeriodPaymentDelay === el.value)
              .label,
            value: cb.productivePeriodPaymentDelay,
          };
          this.form.maxRecoveryPercentage = cb.maxRecoveryPercentage / 100;
          const rowBonus = {
            premium: cb.amount / 100,
            maxRecoveryPercentage: cb.maxRecoveryPercentage,
            paymentTime: {
              label: this.paymentTimeList.find((el) => cb.paymentTime === el.value).label,
              value: cb.paymentTime,
            },
            productivePeriodPaymentDelay: cb.productivePeriodPaymentDelay,
            type: cb.type,
          };
          cb.conditions.forEach((cc) => {
            if (cc.targets[0]) {
              const columnName =
                cc.targets[0].kpi._id +
                (cc.targets[0].kpi.options && cc.targets[0].kpi.options.productId
                  ? cc.targets[0].kpi.options.productId
                  : '');

              rowBonus[columnName] = cc.targets[0].targetValue / 100;

              if (this.columns.findIndex((col) => col.name === columnName) === -1) {
                this.columns.unshift({
                  name: columnName,
                  currency: this.selectedSettings.targets[cc.targets[0].kpi._id]
                    ? this.selectedSettings.targets[cc.targets[0].kpi._id].kpi.type
                    : 'currency',
                  originalName: cc.targets[0].kpi._id,
                  required: true,
                  label: this.$t(`promoterInsertLetter.${cc.targets[0].kpi._id}-SMALL`),
                  option: cc.targets[0].kpi.options
                    ? cc.targets[0].kpi.options.productId
                    : undefined,
                  align: 'left',
                  field: columnName,
                  format: (value) =>
                    `${this.$n(value, 'nodecimals')}${
                      this.selectedSettings.targets[cc.targets[0].kpi._id] &&
                      this.computeCurrencySymbol(
                        this.selectedSettings.targets[cc.targets[0].kpi._id].kpi.type,
                      )
                    }`,
                });
              }
            }
          });
          this.tableData.push(rowBonus);
        });
      },
    },
    'form.paymentPeriod': {
      immediate: true,
      handler() {
        this.computePeriod();
      },
    },
    'form.toProductivePeriodMonth': {
      immediate: true,
      handler() {
        this.computePeriod();
      },
    },
    'form.toProductivePeriodYear': {
      immediate: true,
      handler() {
        this.computePeriod();
      },
    },
    productivePeriod: {
      immediate: true,
      handler(productivePeriod) {
        this.form.fromProductivePeriodMonth = {
          label: this.$utils.numberToMonth(
            productivePeriod.fromProductivePeriodMonth,
            this.$t.bind(this),
          ),
          value: productivePeriod.fromProductivePeriodMonth,
        };
        this.form.fromProductivePeriodYear = productivePeriod.fromProductivePeriodYear;
        this.form.toProductivePeriodMonth = {
          label: this.$utils.numberToMonth(
            productivePeriod.toProductivePeriodMonth,
            this.$t.bind(this),
          ),
          value: productivePeriod.toProductivePeriodMonth,
        };
        this.form.toProductivePeriodYear = productivePeriod.toProductivePeriodYear;
        this.computePeriod();
      },
    },
    paymentFrequency: {
      immediate: true,
      handler(paymentFrequency) {
        this.form.paymentFrequency = {
          label: this.frequencyList.find((el) => paymentFrequency === el.value).label,
          value: paymentFrequency,
        };
      },
    },
    cumulateConditionedBonuses: {
      immediate: true,
      handler(cumulateConditionedBonuses) {
        this.form.cumulateConditionedBonuses = cumulateConditionedBonuses;
      },
    },
  },
  methods: {
    nextStep() {
      if (this.status === 'wip' && this.$user.roleID >= 7) {
        this.submit();
      } else {
        this.$emit('nextStep');
      }
    },
    computeProduct(id) {
      const product = this.products.find((el) => el._id === id);
      this.$utils.logobj('PRASSI-PROMOTER-LETTER-CONDITIONED', 'computeProduct', product);
      return product ? product.name : '';
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
    computePeriod() {
      let newPeriod;
      switch (this.form.paymentPeriod.value) {
        case 0:
          this.paymentPeriodDescription = `${this.form.toProductivePeriodYear} ${this.form.toProductivePeriodMonth.value}`;
          break;
        case 1:
          newPeriod = this.$utils.addProductivePeriod(
            this.form.toProductivePeriodYear,
            this.form.toProductivePeriodMonth.value,
          );
          this.paymentPeriodDescription = `${newPeriod.year} ${newPeriod.month}`;
          break;
        case 2:
          newPeriod = this.$utils.addProductivePeriod(
            this.form.toProductivePeriodYear,
            this.form.toProductivePeriodMonth.value,
          );
          newPeriod = this.$utils.addProductivePeriod(newPeriod.year, newPeriod.month);
          this.paymentPeriodDescription = `${newPeriod.year} ${newPeriod.month}`;
          break;
        case 3:
          newPeriod = this.$utils.addProductivePeriod(
            this.form.toProductivePeriodYear,
            this.form.toProductivePeriodMonth.value,
          );
          newPeriod = this.$utils.addProductivePeriod(newPeriod.year, newPeriod.month);
          newPeriod = this.$utils.addProductivePeriod(newPeriod.year, newPeriod.month);
          this.paymentPeriodDescription = `${newPeriod.year} ${newPeriod.month}`;
          break;
        default:
          break;
      }
    },
    addRow() {
      const rowBonus = {
        maxRecoveryPercentage: 10000,
        paymentTime: {
          label: this.paymentTimeList.find((el) => el.value === 'payment-delayed').label,
          value: 'payment-delayed',
        },
        productivePeriodPaymentDelay: 0,
        type: 'conditioned',
      };
      this.columns.forEach((col) => {
        rowBonus[col.field] = 0;
      });
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
    addColumn() {
      const columnName =
        this.form.kpiSelected.value +
        ((this.form.kpiSelected.value.includes('PRODUCT') ||
          this.form.kpiSelected.value.includes('ADJUSTED-PREMIUM')) &&
        this.form.productSelected &&
        this.form.productSelected.value !== 'all-products'
          ? this.form.productSelected.value
          : '');
      this.columns.unshift({
        name: columnName,
        currency: this.selectedSettings.targets[this.form.kpiSelected.value]
          ? this.selectedSettings.targets[this.form.kpiSelected.value].kpi.type
          : 'currency',
        originalName: this.form.kpiSelected.value,
        required: true,
        label: this.$t(`promoterInsertLetter.${this.form.kpiSelected.value}-SMALL`),
        option:
          (this.form.kpiSelected.value.includes('PRODUCT') ||
            this.form.kpiSelected.value.includes('ADJUSTED-PREMIUM')) &&
          this.form.productSelected &&
          this.form.productSelected.value !== 'all-products'
            ? this.form.productSelected.value
            : undefined,
        align: 'left',
        field: columnName,
        format: (value) =>
          `${this.$n(value, 'nodecimals')}${
            this.selectedSettings.targets[this.form.kpiSelected.value] &&
            this.computeCurrencySymbol(
              this.selectedSettings.targets[this.form.kpiSelected.value].kpi.type,
            )
          }`,
      });
      this.form.kpiSelected = undefined;
      this.form.productSelected = {
        label: this.productList.find((el) => el.value === 'all-products').label,
        value: 'all-products',
      };
    },
    validateKpi() {
      this.$utils.log('PRASSI-PROMOTER-LETTER-CONDITIONED', 'validateKpi');
      const columnName =
        this.form.kpiSelected.value +
        ((this.form.kpiSelected.value.includes('PRODUCT') ||
          this.form.kpiSelected.value.includes('ADJUSTED-PREMIUM')) &&
        this.form.productSelected &&
        this.form.productSelected.value !== 'all-products'
          ? this.form.productSelected.value
          : '');
      const kpiColumn = this.columns.find((el) => el.name === columnName);
      if (!kpiColumn) return true;
      this.$q.notify({
        message: this.$t('promoterInsertLetter.kpiExists'),
        color: 'secondary',
        timeout: 300,
      });
      return false;
    },
    removeColumn(column) {
      this.columns.splice(
        this.columns.findIndex((el) => el.name === column.name),
        1,
      );
    },
    submit() {
      this.$v.form.$touch();

      if (
        `${this.form.fromProductivePeriodYear}${this.form.fromProductivePeriodMonth.value
          .toString()
          .padStart(2, '0')}` >
        `${this.form.toProductivePeriodYear}${this.form.toProductivePeriodMonth
          .toString()
          .padStart(2, '0')}`
      ) {
        this.$q.notify(this.$t('promoterInsertLetter.checkPeriod'));
        return;
      }

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-PROMOTER-LETTER-CONDITIONED', 'submit conditioned', this.form);

        const changedConditionedBonuses = [];
        this.tableData.forEach((row) => {
          const conditionedBonus = {
            amount: row.premium * 100,
            maxRecoveryPercentage: this.form.maxRecoveryPercentage * 100,
            paymentTime: this.form.paymentTime.value,
            productivePeriodPaymentDelay: this.form.paymentPeriod.value,
            type: row.type,
            conditions: [],
          };

          this.columns.forEach((col) => {
            if (col.name !== 'premium' && row[col.name]) {
              conditionedBonus.conditions.push({
                targets: [
                  {
                    kpi: {
                      _id: col.originalName,
                      options: col.option ? { productId: col.option } : {},
                    },
                    targetValue: row[col.name] * 100,
                    weightPercentage: 10000,
                  },
                ],
              });
            }
          });
          changedConditionedBonuses.push(conditionedBonus);
        });

        const productivePeriod = {
          fromProductivePeriodMonth: this.form.fromProductivePeriodMonth.value,
          fromProductivePeriodYear: this.form.fromProductivePeriodYear,
          toProductivePeriodMonth: this.form.toProductivePeriodMonth.value,
          toProductivePeriodYear: this.form.toProductivePeriodYear,
        };

        this.$emit('changeData', {
          invoiceDescription: this.form.invoiceDescription,
          conditionedBonuses: changedConditionedBonuses,
          productivePeriod,
          paymentFrequency: this.form.paymentFrequency.value,
          cumulateConditionedBonuses: this.form.cumulateConditionedBonuses,
        });
      } else {
        this.$q.notify(this.$t('promoterInsertLetter.cantSave'));
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-radius 4px
  border solid 1px $card-border
  min-height 280px
.q-card-main
  padding 10px 15px 0
  min-height 34px
.p-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  margin-bottom 20px
.p-small-field
  width 135px
.p-micro-field
  width 75px
.p-toggle
  width 45%
  justify-content space-between
  font-size 22px
.p-date
  width 200px
.p-pc-toggle
  justify-content flex-end
  font-size 22px
</style>
