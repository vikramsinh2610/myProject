<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-title-section">
        {{ $t('promoterInsertLetter.detailData') }} {{ name }} - {{ indexBonus + 1 }}
        <prassi-round-button
          class="float-right"
          icon="fa fa-chevron-up"
          @click="$emit('previousStep')"
        />
      </div>
      <div>
        <div class="row justify-between q-my-xs">
          <q-field :helper="$t('promoterInsertLetter.fromProductivePeriodMonthHelper')">
            <q-select
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="form.fromProductivePeriodMonth"
              :float-label="$t('promoterInsertLetter.monthLabel')"
              :options="$utils.productivePeriodMonthList($t.bind(this))"
            />
          </q-field>
          <q-field
            class="p-micro-field"
            :error-label="$t('promoterInsertLetter.productivePeriodYearError')"
          >
            <q-input
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="form.fromProductivePeriodYear"
              type="number"
              :float-label="$t('promoterInsertLetter.productivePeriodYear')"
              :error="$v.form.fromProductivePeriodYear.$error"
              @blur="$v.form.fromProductivePeriodYear.$touch"
              @keyup.enter="submit"
            />
          </q-field>
          <q-field :helper="$t('promoterInsertLetter.toProductivePeriodMonthHelper')">
            <q-select
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="form.toProductivePeriodMonth"
              :float-label="$t('promoterInsertLetter.monthLabel')"
              :options="$utils.productivePeriodMonthList($t.bind(this))"
            />
          </q-field>
          <q-field
            class="p-micro-field"
            :error-label="$t('promoterInsertLetter.productivePeriodYearError')"
          >
            <q-input
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="form.toProductivePeriodYear"
              type="number"
              :float-label="$t('promoterInsertLetter.productivePeriodYear')"
              :error="$v.form.toProductivePeriodYear.$error"
              @blur="$v.form.toProductivePeriodYear.$touch"
              @keyup.enter="submit"
            />
          </q-field>
        </div>

        <div
          class="row justify-between q-my-xs"
          v-if="showKpi || conditionedBonus.paymentTime === 'prepayment'"
        >
          <q-field
            class="col-5"
            v-if="conditionedBonus.paymentTime === 'prepayment'"
            :error-label="$t('default.selectError')"
          >
            <q-select
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="form.definedTargets"
              :options="definedTargetsList"
            />
          </q-field>
          <q-field
            :class="conditionedBonus.paymentTime === 'prepayment' ? 'col-5' : 'full-width'"
            v-if="showKpi"
            :error-label="$t('default.selectError')"
          >
            <q-select
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="form.kpiSelected"
              multiple
              :float-label="$t('promoterInsertLetter.kpiSelected')"
              :options="kpiList"
            />
          </q-field>
        </div>

        <div class="row justify-between q-my-xs">
          <q-field
            class="col-5"
            :helper="$t('promoterInsertLetter.amountConditionedHelper')"
            :error-label="$t('promoterInsertLetter.amountError')"
          >
            <q-input
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="form.amount"
              type="number"
              suffix="€"
              :float-label="`${$t('promoterInsertLetter.amount')} ${name}`"
              :error="$v.form.amount.$error"
              @blur="$v.form.amount.$touch"
              @keyup.enter="submit"
            />
          </q-field>
        </div>

        <div class="row justify-between q-my-xs">
          <q-field class="full-width" v-if="showInheritFreq">
            <q-input
              readonly
              :float-label="$t('promoterInsertLetter.frequency')"
              :value="$t('promoterInsertLetter.inheritFrequencyPayment')"
              type="text"
            />
          </q-field>
          <q-field
            class="full-width"
            v-if="!showInheritFreq"
            :helper="$t('promoterInsertLetter.frequencyHelper')"
          >
            <q-select
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="form.paymentFrequency"
              :float-label="$t('promoterInsertLetter.frequency')"
              :options="frequencyList"
            />
          </q-field>
        </div>

        <div class="row justify-between q-my-xs" v-if="useThreshold">
          <q-field class="col-5" :error-label="$t('promoterInsertLetter.thresholdError')">
            <q-input
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="form.threshold"
              type="number"
              suffix="%"
              :float-label="$t('promoterInsertLetter.threshold')"
              :error="$v.form.threshold.$error"
              @blur="$v.form.threshold.$touch"
              @keyup.enter="submit"
            />
          </q-field>
          <q-field class="col-5" :helper="$t('promoterInsertLetter.thresholdApplicationHelper')">
            <q-select
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="form.thresholdApplication"
              :float-label="$t('promoterInsertLetter.thresholdApplication')"
              :options="thresholdAppList"
            />
          </q-field>
        </div>

        <div
          class="row justify-between q-my-xs"
          v-if="conditionedBonus.paymentTime !== 'prepayment'"
        >
          <q-field class="col-5" :helper="$t('promoterInsertLetter.paymentPeriodHelper')">
            <q-select
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="form.paymentPeriod"
              :float-label="$t('promoterInsertLetter.paymentPeriod')"
              :options="paymentPeriodList"
            />
          </q-field>
          <q-field class="col-5">
            <q-input
              :readonly="true"
              v-model="paymentPeriodDescription"
              type="text"
              :float-label="$t('promoterInsertLetter.paymentPeriodComputed')"
            />
          </q-field>
        </div>

        <div
          class="row justify-between q-my-xs"
          v-if="conditionedBonus.paymentTime === 'prepayment'"
        >
          <q-field class="col-5" :helper="$t('promoterInsertLetter.maxRecoveryPercentageHelper')">
            <q-input
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="form.maxRecoveryPercentage"
              type="number"
              suffix="%"
              :float-label="$t('promoterInsertLetter.maxRecoveryPercentage')"
              :error="$v.form.maxRecoveryPercentage.$error"
              @blur="$v.form.maxRecoveryPercentage.$touch"
              @keyup.enter="submit"
            />
          </q-field>
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
import { required, between, minValue } from 'vuelidate/lib/validators';

export default {
  name: 'PrassiPromoterLetterConditioned',
  data() {
    return {
      paymentPeriodDescription: 'descr',
      form: {
        amount: 0,
        threshold: 0,
        thresholdApplication: '',
        paymentPeriod: 0,
        paymentFrequency: '',
        definedTargets: 'defined',
        fromProductivePeriodMonth: 1,
        fromProductivePeriodYear: 2018,
        toProductivePeriodMonth: 1,
        toProductivePeriodYear: 2018,
        kpiSelected: [],
        maxRecoveryPercentage: 0,
        invoiceDescription: '',
        _id: '',
      },
      thresholdAppList: [
        {
          label: 'fissa',
          value: 'fixed',
        },
        {
          label: 'calcolata',
          value: 'calculated',
        },
      ],
      definedTargetsList: [
        {
          label: 'Obiettivi definiti',
          value: 'defined',
        },
        // {
        //   label: 'Da perfezionare',
        //   value: 'perfectable',
        // },
      ],
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
    indexBonus: {
      type: Number,
      default: 0,
    },
    invoiceDescription: {
      type: String,
      default: '',
    },
    conditionedBonus: {
      type: Object,
      default: () => ({}),
    },
    conditionedBonuses: {
      type: Array,
      default: () => [],
    },
    selectedSettings: {
      type: Object,
      default: () => ({}),
    },
    showInheritFreq: {
      type: Boolean,
      default: false,
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
        minValue: minValue(0),
        required,
      },
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
    showKpi() {
      return (
        Object.entries(this.selectedSettings.targets || {}).length !== 0 &&
        (this.conditionedBonus.paymentTime !== 'prepayment' ||
          this.form.definedTargets === 'defined')
      );
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
    useThreshold() {
      return (
        this.conditionedBonus.conditions[0].thresholds &&
        this.conditionedBonus.conditions[0].thresholds.length !== 0
      );
    },
    thresholds() {
      return this.conditionedBonus.conditions[0].thresholds;
    },
    targets() {
      return this.conditionedBonus.conditions[0].targets;
    },
  },
  watch: {
    invoiceDescription: {
      immediate: true,
      handler(invoiceDescription) {
        this.form.invoiceDescription = invoiceDescription;
      },
    },
    conditionedBonus: {
      immediate: true,
      handler(conditionedBonus) {
        this.$utils.logobj('PRASSI-LETTER-CONDITIONED', 'watch letter', conditionedBonus);
        if (!this.conditionedBonus.conditions || this.conditionedBonus.conditions.length === 0) {
          // eslint-disable-next-line vue/no-mutating-props
          this.conditionedBonus.conditions = [
            {
              targets: [],
              thresholds: [],
            },
          ];
        }

        // this.form.definedTargets = this.targets.length !== 0 ? 'defined' : 'perfectable';
        this.form.definedTargets = 'defined';

        this.form.kpiSelected = [];
        this.targets.forEach((el) => {
          this.form.kpiSelected.push(el.kpi._id);
        });

        this.form.amount = conditionedBonus.amount / 100;
        this.form.maxRecoveryPercentage = conditionedBonus.maxRecoveryPercentage / 100;
        this.form.paymentPeriod = conditionedBonus.productivePeriodPaymentDelay;

        if (this.useThreshold) {
          this.form.threshold = this.thresholds[0].fixedPercentage / 100;
          this.form.thresholdApplication = this.thresholds[0].valueMode;
        }
      },
    },
    'form.definedTargets': {
      immediate: true,
      handler(definedTargets) {
        this.$emit('needTargets', definedTargets === 'defined');
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
        this.form.fromProductivePeriodMonth = productivePeriod.fromProductivePeriodMonth;
        this.form.fromProductivePeriodYear = productivePeriod.fromProductivePeriodYear;
        this.form.toProductivePeriodMonth = productivePeriod.toProductivePeriodMonth;
        this.form.toProductivePeriodYear = productivePeriod.toProductivePeriodYear;
        this.computePeriod();
      },
    },
    paymentFrequency: {
      immediate: true,
      handler(paymentFrequency) {
        this.form.paymentFrequency = paymentFrequency;
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
    computePeriod() {
      let newPeriod;
      switch (this.form.paymentPeriod) {
        case 0:
          this.paymentPeriodDescription = `${this.form.toProductivePeriodYear} ${this.form.toProductivePeriodMonth}`;
          break;
        case 1:
          newPeriod = this.$utils.addProductivePeriod(
            this.form.toProductivePeriodYear,
            this.form.toProductivePeriodMonth,
          );
          this.paymentPeriodDescription = `${newPeriod.year} ${newPeriod.month}`;
          break;
        case 2:
          newPeriod = this.$utils.addProductivePeriod(
            this.form.toProductivePeriodYear,
            this.form.toProductivePeriodMonth,
          );
          newPeriod = this.$utils.addProductivePeriod(newPeriod.year, newPeriod.month);
          this.paymentPeriodDescription = `${newPeriod.year} ${newPeriod.month}`;
          break;
        case 3:
          newPeriod = this.$utils.addProductivePeriod(
            this.form.toProductivePeriodYear,
            this.form.toProductivePeriodMonth,
          );
          newPeriod = this.$utils.addProductivePeriod(newPeriod.year, newPeriod.month);
          newPeriod = this.$utils.addProductivePeriod(newPeriod.year, newPeriod.month);
          this.paymentPeriodDescription = `${newPeriod.year} ${newPeriod.month}`;
          break;
        default:
          break;
      }
    },
    submit() {
      this.$v.form.$touch();

      if (this.showKpi && Object.entries(this.form.kpiSelected).length === 0) {
        this.$q.notify(this.$t('promoterInsertLetter.minimumTargets'));
        return;
      }

      if (
        `${this.form.fromProductivePeriodYear}${this.form.fromProductivePeriodMonth
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
        let targets = [];
        if (this.showKpi) {
          Object.entries(this.selectedSettings.targets || {})
            .filter((key) => this.form.kpiSelected.includes(key[0]))
            .forEach((key) => {
              const foundEl = this.targets.find((el) => el.kpi._id === key[1].kpi._id);
              targets.push(foundEl || key[1]);
            });
        } else {
          targets = [...this.targets];
        }

        let changedConditionedBonus = {
          ...this.conditionedBonus,
          amount: Math.round(this.form.amount * 100),
          maxRecoveryPercentage: Math.round(this.form.maxRecoveryPercentage * 100),
          productivePeriodPaymentDelay: this.form.paymentPeriod,
          conditions: [
            {
              ...this.conditionedBonus.conditions[0],
              targets,
            },
            // eslint-disable-next-line vue/no-mutating-props
            ...this.conditionedBonus.conditions.splice(1),
          ],
        };

        if (this.useThreshold) {
          changedConditionedBonus = {
            ...changedConditionedBonus,
            amount: Math.round(this.form.amount * 100),
            maxRecoveryPercentage: Math.round(this.form.maxRecoveryPercentage * 100),
            productivePeriodPaymentDelay: this.form.paymentPeriod,
            conditions: [
              {
                ...this.conditionedBonus.conditions[0],
                targets,
                thresholds: [
                  {
                    ...this.thresholds[0],
                    fixedPercentage: this.form.threshold * 100,
                    valueMode: this.form.thresholdApplication,
                  },
                  ...this.thresholds.splice(1),
                ],
              },
              // eslint-disable-next-line vue/no-mutating-props
              ...this.conditionedBonus.conditions.splice(1),
            ],
          };
        }

        const productivePeriod = {
          fromProductivePeriodMonth: this.form.fromProductivePeriodMonth,
          fromProductivePeriodYear: this.form.fromProductivePeriodYear,
          toProductivePeriodMonth: this.form.toProductivePeriodMonth,
          toProductivePeriodYear: this.form.toProductivePeriodYear,
        };

        const changedConditionedBonuses = [...this.conditionedBonuses];
        changedConditionedBonuses[this.indexBonus] = changedConditionedBonus;

        this.$emit('changeData', {
          invoiceDescription: this.form.invoiceDescription,
          conditionedBonuses: changedConditionedBonuses,
          productivePeriod,
          paymentFrequency: this.form.paymentFrequency,
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
