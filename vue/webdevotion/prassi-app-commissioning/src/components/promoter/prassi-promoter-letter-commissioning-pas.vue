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
          v-if="status === 'wip'"
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
                class="table-input"
                style="max-width: 100px"
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
              :label="$t('promoterInsertLetter.addRowQuarter')"
              @click="addRow"
            />
          </div>
        </q-table>

        <q-table
          v-if="status !== 'wip' || $user.roleID < 7"
          :title="$t(`promoterInsertLetter.tableQuarter`)"
          class="q-my-lg"
          :pagination.sync="pagination"
          :data="tableDataQuarter"
          :columns="columnsQuarter"
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
          :title="$t(`promoterInsertLetter.tableQuarter`)"
          class="q-my-lg"
          :pagination.sync="pagination"
          :data="tableDataQuarter"
          :columns="columnsQuarter"
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
                class="table-input"
                style="max-width: 100px"
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
                    @click.stop="moveRowUpQuarter(props.row)"
                  />
                  <q-btn
                    round
                    dense
                    flat
                    size="sm"
                    icon="fa fa-chevron-down"
                    @click.stop="moveRowDownQuarter(props.row)"
                  />
                </div>
                <q-btn
                  round
                  dense
                  flat
                  icon="fas fa-times"
                  @click.stop="removeRowQuarter(props.row)"
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
              :label="$t('promoterInsertLetter.addRowQuarter')"
              @click="addRowQuarter"
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
  name: 'PrassiPromoterLetterCommissioningPas',
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
          name: 'from',
          currency: false,
          required: true,
          label: this.$t(`promoterInsertLetter.fromIV`),
          align: 'left',
          field: 'from',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
        },
        {
          name: 'to',
          currency: false,
          required: true,
          label: this.$t(`promoterInsertLetter.toIV`),
          align: 'left',
          field: 'to',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
        },
        {
          name: 'amount',
          currency: 'currency',
          required: true,
          label: this.$t(`promoterInsertLetter.amount`),
          align: 'left',
          field: 'amount',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
        },
      ],
      columnsQuarter: [
        {
          name: 'from',
          currency: false,
          required: true,
          label: this.$t(`promoterInsertLetter.fromIV`),
          align: 'left',
          field: 'from',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
        },
        {
          name: 'to',
          currency: false,
          required: true,
          label: this.$t(`promoterInsertLetter.toIV`),
          align: 'left',
          field: 'to',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
        },
        {
          name: 'percentage',
          currency: 'percentage',
          required: true,
          label: this.$t(`promoterInsertLetter.percentageQuarter`),
          align: 'left',
          field: 'percentage',
          format: (value) => `${this.$n(value, 'nodecimals')}%`,
        },
      ],
      tableData: [],
      tableDataQuarter: [],
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
    commissioningPa: {
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
    commissioningPa: {
      immediate: true,
      handler(commissioningPa) {
        this.$utils.logobj('PRASSI-LETTER-COMMISSIONING-PA', 'commissioningPa', commissioningPa);

        // eslint-disable-next-line sonarjs/cognitive-complexity
        commissioningPa.bonusTableRows.forEach((cb) => {
          const rowBonus = {
            from: cb.from / 100,
            to: cb.to / 100,
            amount: cb.amount / 100,
          };
          this.tableData.push(rowBonus);
        });

        // eslint-disable-next-line sonarjs/cognitive-complexity
        commissioningPa.quarterTargetTableRows.forEach((cb) => {
          const rowBonusQuarter = {
            from: cb.from / 100,
            to: cb.to / 100,
            percentage: cb.percentage / 100,
          };
          this.tableDataQuarter.push(rowBonusQuarter);
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
        from: 0,
        to: 0,
        amount: 0,
      };
      this.tableData.push(rowBonus);
    },
    addRowQuarter() {
      const rowBonus = {
        from: 0,
        to: 0,
        percentage: 0,
      };
      this.tableDataQuarter.push(rowBonus);
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
    removeRowQuarter(row) {
      const position = this.tableDataQuarter.indexOf(row);
      if (this.tableDataQuarter.length > 1) {
        this.tableDataQuarter.splice(position, 1);
      }
    },
    moveRowUpQuarter(row) {
      const position = this.tableDataQuarter.indexOf(row);
      if (position >= 1) {
        arrayMove.mutate(this.tableDataQuarter, position, position - 1);
      }
    },
    moveRowDownQuarter(row) {
      const position = this.tableDataQuarter.indexOf(row);
      if (position < this.tableDataQuarter.length - 1) {
        arrayMove.mutate(this.tableDataQuarter, position, position + 1);
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

        const changedCommissioningPaBonusMonthly = [];
        this.tableData.forEach((row) => {
          const bonusMonthly = {
            from: Math.trunc(row.from * 100),
            to: Math.trunc(row.to * 100),
            amount: Math.trunc(row.amount * 100),
          };
          changedCommissioningPaBonusMonthly.push(bonusMonthly);
        });

        const changedCommissioningPaQuarter = [];
        this.tableDataQuarter.forEach((row) => {
          const bonusQuarter = {
            from: Math.trunc(row.from * 100),
            to: Math.trunc(row.to * 100),
            percentage: Math.trunc(row.percentage * 100),
          };
          changedCommissioningPaQuarter.push(bonusQuarter);
        });

        const productivePeriod = {
          fromProductivePeriodMonth: this.form.fromProductivePeriodMonth.value,
          fromProductivePeriodYear: this.form.fromProductivePeriodYear,
          toProductivePeriodMonth: this.form.toProductivePeriodMonth.value,
          toProductivePeriodYear: this.form.toProductivePeriodYear,
        };

        this.$emit('changeData', {
          invoiceDescription: this.form.invoiceDescription,
          commissioningPas: {
            bonusTableRows: changedCommissioningPaBonusMonthly,
            quarterTargetTableRows: changedCommissioningPaQuarter,
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
