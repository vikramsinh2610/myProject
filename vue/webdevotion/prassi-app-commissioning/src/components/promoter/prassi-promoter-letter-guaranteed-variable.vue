<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section">
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
            class="p-pc-micro-field"
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
            class="p-pc-micro-field"
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

        <div class="row justify-between q-my-xs">
          <q-select
            class="full-width"
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="form.detailType"
            :label="$t('promoterInsertLetter.detailType')"
            :error-message="$t('default.selectError')"
            :options="detailTypeList"
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
              </div>
            </q-th>
          </q-tr>

          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <q-input
                style="max-width: 100px"
                class="table-input"
                :type="col.currency ? 'number' : 'text'"
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
          </div>
        </q-table>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="form.amountTarget"
            type="number"
            suffix="€"
            :label="`${$t('promoterInsertLetter.amountTarget')}`"
            :error-message="$t('promoterInsertLetter.amountError')"
            :hint="`${$t('promoterInsertLetter.amountHelper')} ${name}`"
            :error="$v.form.amountTarget.$error"
            @blur="$v.form.amountTarget.$touch"
            @keyup.enter="submit"
          />
          <div class="col-5 row">
            <q-btn-toggle
              class="col self-center"
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="form.kpiSelected"
              no-caps
              rounded
              unelevated
              toggle-color="primary"
              color="white"
              text-color="primary"
              :options="[
                { label: $t('dossiers.all'), value: 'MONTHLY-ADJUSTED-PREMIUM' },
                {
                  label: $t('dossiers.direct'),
                  value: 'MONTHLY-ADJUSTED-PREMIUM-DIRECT',
                },
                {
                  label: $t('dossiers.indirect'),
                  value: 'MONTHLY-ADJUSTED-PREMIUM-INDIRECT',
                },
              ]"
            />
          </div>
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="form.amount"
            type="number"
            suffix="€"
            :label="`${$t('promoterInsertLetter.amount')} ${name}`"
            :error-message="$t('promoterInsertLetter.amountError')"
            :hint="`${$t('promoterInsertLetter.amountHelper')} ${name}`"
            :error="$v.form.amount.$error"
            @blur="$v.form.amount.$touch"
            @keyup.enter="submit"
          />
          <q-select
            class="col-5"
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="form.paymentFrequency"
            :label="$t('promoterInsertLetter.frequency')"
            :hint="$t('promoterInsertLetter.frequencyHelper')"
            :options="frequencyList"
          />
        </div>

        <div
          class="row justify-between q-my-xs"
          v-if="guaranteedVariableBonuses.absorbability !== undefined"
        >
          <q-input
            class="col-5"
            readonly
            :label="$t('promoterInsertLetter.directProductionPercentage')"
            :value="$t('promoterInsertLetter.directProductionPercentage')"
            type="text"
          />
          <q-input
            class="col-5"
            :readonly="status !== 'wip' || $user.roleID < 7"
            hide-bottom-space
            v-model="form.directProductionPercentage"
            type="number"
            suffix="%"
            :label="$t('promoterInsertLetter.productionPercentage')"
            :error-message="$t('promoterInsertLetter.productionPercentageError')"
            :error="$v.form.directProductionPercentage.$error"
            @blur="$v.form.directProductionPercentage.$touch"
            @keyup.enter="submit"
          />
        </div>

        <div
          class="row justify-between q-my-xs"
          v-if="guaranteedVariableBonuses.absorbability !== undefined"
        >
          <q-input
            class="col-5"
            readonly
            :label="$t('promoterInsertLetter.indirectProductionPercentage')"
            :value="$t('promoterInsertLetter.indirectProductionPercentage')"
            type="text"
          />
          <q-input
            class="col-5"
            :readonly="status !== 'wip' || $user.roleID < 7"
            hide-bottom-space
            v-model="form.indirectProductionPercentage"
            type="number"
            suffix="%"
            :label="$t('promoterInsertLetter.productionPercentage')"
            :error-message="$t('promoterInsertLetter.productionPercentageError')"
            :error="$v.form.indirectProductionPercentage.$error"
            @blur="$v.form.indirectProductionPercentage.$touch"
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
import { required, between, minValue } from 'vuelidate/lib/validators';

export default {
  name: 'PrassiPromoterLetterGuaranteedVariable',
  data() {
    return {
      pagination: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      columns: [
        {
          name: 'adjustedPercentage',
          currency: 'percentage',
          required: true,
          label: this.$t(`promoterInsertLetter.adjustedPercentage`),
          align: 'left',
          field: 'adjustedPercentage',
          format: (value) => `${this.$n(value, 'nodecimals')}%`,
        },
        {
          name: 'formula',
          currency: false,
          required: true,
          label: this.$t(`promoterInsertLetter.formula`),
          align: 'left',
          field: 'formula',
        },
      ],
      tableData: [],
      form: {
        amount: 0,
        kpiSelected: 'MONTHLY-ADJUSTED-PREMIUM',
        paymentFrequency: undefined,
        directProductionPercentage: 0,
        indirectProductionPercentage: 0,
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
        detailType: { label: 'Supplementare', value: 'SUPPLEMENTARY' },
        _id: '',
      },
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
    guaranteedVariableBonuses: {
      type: Object,
      default: () => ({}),
    },
    conditionedBonuses: {
      type: Object,
      default: () => ({}),
    },
    selectedSettings: {
      type: Object,
      default: () => ({}),
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
      amount: {
        between: minValue(0),
        required,
      },
      amountTarget: {
        between: minValue(0),
        required,
      },
      paymentFrequency: {
        required,
      },
      directProductionPercentage: {
        required,
        integer: true,
        between: between(0, 100),
      },
      indirectProductionPercentage: {
        required,
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
      invoiceDescription: {},
      toProductivePeriodYear: {
        required,
        integer: true,
        between: between(0, 2200),
      },
    },
  },
  computed: {
    detailTypeList() {
      const detailTypeList = [];

      Object.entries(this.selectedSettings.absorbabilities || {}).forEach((key) => {
        detailTypeList.push({
          label: this.$t(`promoterInsertLetter.${key[0]}`),
          value: key[0],
        });
      });

      return detailTypeList;
    },
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
        this.form.amountTarget = conditionedBonuses.conditions[0].targets[0].targetValue / 100;
        this.form.kpiSelected = conditionedBonuses.conditions[0].targets[0].kpi._id;
      },
    },
    guaranteedVariableBonuses: {
      immediate: true,
      handler(guaranteedVariableBonuses) {
        this.form.amount = guaranteedVariableBonuses.amount / 100;
        if (guaranteedVariableBonuses.absorbability !== undefined) {
          this.form.directProductionPercentage =
            guaranteedVariableBonuses.absorbability.directProductionPercentage / 100;
          this.form.indirectProductionPercentage =
            guaranteedVariableBonuses.absorbability.indirectProductionPercentage / 100;
        }

        guaranteedVariableBonuses.variableBonus.forEach((cb) => {
          const rowBonus = {
            adjustedPercentage: cb.adjustedPercentage / 100,
            formula: cb.formula,
          };
          this.tableData.push(rowBonus);
        });
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
      },
    },
    paymentFrequency: {
      immediate: true,
      handler(paymentFrequency) {
        this.form.paymentFrequency = {
          label: this.frequencyList.find((el) => el.value === paymentFrequency).label,
          value: paymentFrequency,
        };
      },
    },
    'form.detailType': {
      immediate: false,
      handler(type) {
        this.$utils.logobj('PRASSI-PROMOTER-LETTER-DETAIL', 'watch detailType', type);
        const defaults = Object.entries(this.selectedSettings.absorbabilities).find(
          (key) => key[0] === type.value,
        )[1];

        this.form.directProductionPercentage = defaults.directProductionPercentage / 100;
        this.form.indirectProductionPercentage = defaults.indirectProductionPercentage / 100;
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
        adjustedPercentage: 100,
        formula: 'x',
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
    submit() {
      this.$v.form.$touch();

      if (
        `${this.form.fromProductivePeriodYear}${this.form.fromProductivePeriodMonth.value
          .toString()
          .padStart(2, '0')}` >
        `${this.form.toProductivePeriodYear}${this.form.toProductivePeriodMonth.value
          .toString()
          .padStart(2, '0')}`
      ) {
        this.$q.notify(this.$t('promoterInsertLetter.checkPeriod'));
        return;
      }

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-PROMOTER-LETTER-DETAIL', 'submit letter DETAIL', this.form);
        const changedConditionedBonuses = [];
        const conditionedBonus = {
          ...this.conditionedBonuses,
        };
        conditionedBonus.conditions[0].targets[0].targetValue = this.form.amountTarget * 100;
        conditionedBonus.conditions[0].targets[0].kpi._id = this.form.kpiSelected;
        changedConditionedBonuses.push(conditionedBonus);

        let changedGuaranteedVariableBonuses = {
          ...this.guaranteedVariableBonuses,
          amount: Math.round(this.form.amount * 100),
        };

        const changedVariableBonuses = [];
        this.tableData.forEach((row) => {
          const variableBonus = {
            adjustedPercentage: Math.round(row.adjustedPercentage * 100),
            formula: row.formula,
          };
          changedVariableBonuses.push(variableBonus);
        });
        changedGuaranteedVariableBonuses = {
          ...changedGuaranteedVariableBonuses,
          variableBonus: changedVariableBonuses,
        };

        if (this.guaranteedVariableBonuses.absorbability !== undefined) {
          changedGuaranteedVariableBonuses = {
            ...changedGuaranteedVariableBonuses,
            absorbability: {
              directProductionPercentage: Math.round(this.form.directProductionPercentage * 100),
              indirectProductionPercentage: Math.round(
                this.form.indirectProductionPercentage * 100,
              ),
            },
          };
        }

        const productivePeriod = {
          fromProductivePeriodMonth: this.form.fromProductivePeriodMonth.value,
          fromProductivePeriodYear: this.form.fromProductivePeriodYear,
          toProductivePeriodMonth: this.form.toProductivePeriodMonth.value,
          toProductivePeriodYear: this.form.toProductivePeriodYear,
        };

        this.$emit('changeData', {
          invoiceDescription: this.form.invoiceDescription,
          guaranteedVariableBonuses: changedGuaranteedVariableBonuses,
          conditionedBonuses: changedConditionedBonuses,
          productivePeriod,
          paymentFrequency: this.form.paymentFrequency.value,
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
.p-pc-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  margin-bottom 20px
.p-pc-small-field
  width 135px
.p-pc-micro-field
  width 75px
.p-pc-toggle
  width 45%
  justify-content space-between
  font-size 22px
.p-pc-date
  width 200px
</style>
