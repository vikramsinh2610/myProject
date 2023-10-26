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
          :title="$t(`promoterInsertLetter.tableMonthly`)"
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
          :title="$t(`promoterInsertLetter.tableMonthly`)"
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
                v-if="col.currency !== 'mode'"
                class="table-input"
                :style="col.name === 'targetIv' ? 'width: 100px;' : 'max-width: 100px;'"
                type="number"
                :suffix="computeCurrencySymbol(col.currency)"
                v-model="props.row[col.field]"
              />
              <q-btn
                v-if="col.currency === 'mode'"
                dense
                flat
                size="md"
                :label="$t(`promoterInsertLetter.mode${props.row[col.field]}`)"
                @click.stop="changeFixed(props.row, col.field)"
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
              :label="$t('promoterInsertLetter.addRowMonthlyBonus')"
              @click="addRow"
            />
          </div>
        </q-table>

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
  name: 'PrassiPromoterLetterBonusPa',
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
          name: 'targetIv',
          currency: false,
          required: true,
          label: this.$t(`promoterInsertLetter.guaranteedTargetIv`),
          align: 'left',
          field: 'targetIv',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
        },
        {
          name: 'guaranteedBonusAmount',
          currency: 'currency',
          required: true,
          label: this.$t(`promoterInsertLetter.guaranteedBonusAmount`),
          align: 'left',
          field: 'guaranteedBonusAmount',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
        },
        {
          name: 'guaranteedBonusThreshold',
          currency: 'percentage',
          required: true,
          label: this.$t(`promoterInsertLetter.guaranteedBonusThreshold`),
          align: 'left',
          field: 'guaranteedBonusThreshold',
          format: (value) => `${this.$n(value, 'nodecimals')}%`,
        },
        {
          name: 'guaranteedBonusMode',
          currency: 'mode',
          required: true,
          label: this.$t(`promoterInsertLetter.guaranteedBonusMode`),
          align: 'left',
          field: 'guaranteedBonusMode',
          format: (value) => this.$t(`promoterInsertLetter.mode${value}`),
        },
        {
          name: 'targetBonusAmount',
          currency: 'currency',
          required: true,
          label: this.$t(`promoterInsertLetter.targetBonusAmount`),
          align: 'left',
          field: 'targetBonusAmount',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
        },
        {
          name: 'targetBonusThreshold',
          currency: 'percentage',
          required: true,
          label: this.$t(`promoterInsertLetter.targetBonusThreshold`),
          align: 'left',
          field: 'targetBonusThreshold',
          format: (value) => `${this.$n(value, 'nodecimals')}%`,
        },
        {
          name: 'targetBonusMode',
          currency: 'mode',
          required: true,
          label: this.$t(`promoterInsertLetter.targetBonusMode`),
          align: 'left',
          field: 'targetBonusMode',
          format: (value) => this.$t(`promoterInsertLetter.mode${value}`),
        },
      ],
      tableData: [],
      form: {
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
        _id: '',
        invoiceDescription: '',
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
    selectedSettings: {
      type: Object,
      default: () => ({}),
    },
    invoiceDescription: {
      type: String,
      default: '',
    },
    bonusPa: {
      type: Object,
      default: () => ({}),
    },
    productivePeriod: {
      type: Object,
      default: () => ({}),
    },
  },
  validations: {
    form: {
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
  watch: {
    invoiceDescription: {
      immediate: true,
      handler(invoiceDescription) {
        this.form.invoiceDescription = invoiceDescription;
      },
    },
    bonusPa: {
      immediate: true,
      handler(bonusPa) {
        this.$utils.logobj('PRASSI-LETTER-COMMISSIONING-PA', 'bonusPa', bonusPa);

        // eslint-disable-next-line sonarjs/cognitive-complexity
        bonusPa.bonusMonths
          .sort((a, b) => a.month - b.month)
          .forEach((cb) => {
            const rowBonus = {
              targetIv: cb.targetIv / 100,
              guaranteedBonusAmount: cb.guaranteedBonusAmount / 100,
              targetBonusAmount: cb.targetBonusAmount / 100,
              targetBonusThreshold: cb.targetBonusThreshold / 100,
              guaranteedBonusThreshold: cb.guaranteedBonusThreshold / 100,
              guaranteedBonusMode: cb.guaranteedBonusMode,
              targetBonusMode: cb.targetBonusMode,
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
    addRow() {
      const rowBonus = {
        targetIv: 0,
        guaranteedBonusAmount: 0,
        targetBonusAmount: 0,
        targetBonusThreshold: 0,
        guaranteedBonusThreshold: 0,
        guaranteedBonusMode: 'fixed',
        targetBonusMode: 'fixed',
      };
      this.tableData.push(rowBonus);
    },
    changeFixed(row, field) {
      if (row[field] !== 'fixed') {
        row[field] = 'fixed';
      } else {
        row[field] = 'proportional';
      }
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
        `${this.form.toProductivePeriodYear}${this.form.toProductivePeriodMonth
          .toString()
          .padStart(2, '0')}`
      ) {
        this.$q.notify(this.$t('promoterInsertLetter.checkPeriod'));
        return;
      }

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-PROMOTER-LETTER-CONDITIONED', 'submit conditioned', this.form);

        const changedBonusPaBonusMonthly = [];
        this.tableData.forEach((row, index) => {
          const bonusMonthly = {
            month: index,
            targetIv: Math.trunc(row.targetIv * 100),
            guaranteedBonusAmount: Math.trunc(row.guaranteedBonusAmount * 100),
            guaranteedBonusMode: row.guaranteedBonusMode,
            guaranteedBonusThreshold: Math.trunc(row.guaranteedBonusThreshold * 100),
            targetBonusAmount: Math.trunc(row.targetBonusAmount * 100),
            targetBonusMode: row.targetBonusMode,
            targetBonusThreshold: Math.trunc(row.targetBonusThreshold * 100),
          };
          changedBonusPaBonusMonthly.push(bonusMonthly);
        });

        const productivePeriod = {
          fromProductivePeriodMonth: this.form.fromProductivePeriodMonth.value,
          fromProductivePeriodYear: this.form.fromProductivePeriodYear,
          toProductivePeriodMonth: this.form.toProductivePeriodMonth.value,
          toProductivePeriodYear: this.form.toProductivePeriodYear,
        };

        this.$emit('changeData', {
          invoiceDescription: this.form.invoiceDescription,
          bonusPa: {
            bonusMonths: changedBonusPaBonusMonthly,
          },
          productivePeriod,
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
</style>
