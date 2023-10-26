<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section">
        {{ $t('promoterInsertLetter.targets') }} {{ name }} - {{ indexBonus + 1 }}
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
            class="p-pc-micro-field"
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
            class="p-pc-micro-field"
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
          v-for="target in form.targets"
          :key="target._id"
          class="row justify-between no-wrap q-my-xs"
        >
          <q-field
            class="col-5"
            :helper="$t(`promoterInsertLetter.${target._id}-HELPER`)"
            :error-label="$t('promoterInsertLetter.amountError')"
          >
            <q-input
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="target.amount"
              type="number"
              :float-label="$t(`promoterInsertLetter.${target._id}`)"
              :error="target.amount.$error"
              @keyup.enter="submit"
            />
          </q-field>
          <q-field class="col-5" :error-label="$t('promoterInsertLetter.thresholdError')">
            <q-input
              :readonly="status !== 'wip' || $user.roleID < 7"
              v-model="target.threshold"
              type="number"
              suffix="%"
              :float-label="thresholdLabel"
              :error="$v.form.threshold.$error"
              @keyup.enter="submit"
            />
          </q-field>
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
import { minValue, between, required } from 'vuelidate/lib/validators';

export default {
  name: 'PrassiPromoterLetterTargets',
  data() {
    return {
      form: {
        fromProductivePeriodMonth: 1,
        fromProductivePeriodYear: 2018,
        toProductivePeriodMonth: 1,
        toProductivePeriodYear: 2018,
        targets: [],
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
    indexBonus: {
      type: Number,
      default: 0,
    },
    conditionedBonus: {
      type: Object,
      default: () => ({}),
    },
    conditionedBonuses: {
      type: Array,
      default: () => [],
    },
    productivePeriod: {
      type: Object,
      default: () => ({}),
    },
  },
  validations: {
    form: {
      amount: {
        between: minValue(0),
      },
      threshold: {
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
    },
  },
  watch: {
    conditionedBonus: {
      immediate: true,
      handler(conditionedBonus) {
        this.$utils.logobj('PRASSI-PROMOTER-LETTER-TARGETS', 'watch targets', conditionedBonus);
        if (!this.conditionedBonus.conditions || this.conditionedBonus.conditions.length === 0) {
          // eslint-disable-next-line vue/no-mutating-props
          this.conditionedBonus.conditions = [
            {
              targets: [],
              thresholds: [],
            },
          ];
        }

        this.form.targets = [];
        conditionedBonus.conditions.forEach((cond) => {
          cond.targets.forEach((el) => {
            this.form.targets.push({
              _id: el.kpi._id,
              amount: el.targetValue / 100,
              threshold: el.weightPercentage / 100,
            });
          });
        });
      },
    },
    productivePeriod: {
      immediate: true,
      handler(productivePeriod) {
        this.form.fromProductivePeriodMonth = productivePeriod.fromProductivePeriodMonth;
        this.form.fromProductivePeriodYear = productivePeriod.fromProductivePeriodYear;
        this.form.toProductivePeriodMonth = productivePeriod.toProductivePeriodMonth;
        this.form.toProductivePeriodYear = productivePeriod.toProductivePeriodYear;
      },
    },
  },
  computed: {
    thresholdLabel() {
      if (this.useThreshold) return this.$t('promoterInsertLetter.thresholdTargets');
      return this.$t('promoterInsertLetter.thresholdPlain');
    },
    useThreshold() {
      return (
        this.conditionedBonus.conditions[0].thresholds &&
        this.conditionedBonus.conditions[0].thresholds.length !== 0
      );
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
    submit() {
      this.$v.form.$touch();

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

      let totalTargets = 0;
      this.form.targets.forEach((el) => {
        totalTargets += el.threshold;
      });

      if (totalTargets > 100) {
        this.$q.notify(this.$t('promoterInsertLetter.errorTotalTargets'));
        return;
      }

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-PROMOTER-LETTER-TARGETS', 'submit letter targets', this.form);
        const newConditions = [];
        this.conditionedBonus.conditions.forEach((cond) => {
          const newTargets = [];
          newConditions.push({
            ...cond,
            targets: newTargets,
          });
          cond.targets.forEach((el) => {
            const found = this.form.targets.find((fEl) => fEl._id === el.kpi._id);
            newTargets.push({
              kpi: { _id: found._id },
              targetValue: found.amount * 100,
              weightPercentage: found.threshold * 100,
            });
          });
        });

        const changedConditionedBonus = {
          ...this.conditionedBonus,
          conditions: [...newConditions],
        };
        const changedConditionedBonuses = [...this.conditionedBonuses];
        changedConditionedBonuses[this.indexBonus] = changedConditionedBonus;

        const productivePeriod = {
          fromProductivePeriodMonth: this.form.fromProductivePeriodMonth,
          fromProductivePeriodYear: this.form.fromProductivePeriodYear,
          toProductivePeriodMonth: this.form.toProductivePeriodMonth,
          toProductivePeriodYear: this.form.toProductivePeriodYear,
        };

        this.$emit('changeData', {
          conditionedBonuses: changedConditionedBonuses,
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
.p-pc-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  margin-bottom 20px
.p-pc-large-field
  min-width 270px
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
