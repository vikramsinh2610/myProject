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

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="form.amount"
            type="number"
            suffix="€"
            :label="`${$t('promoterInsertLetter.amountGuaranteed')}`"
            :error-message="$t('promoterInsertLetter.amountError')"
            :hint="`${$t('promoterInsertLetter.amountGuaranteedHelper')}`"
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
          v-if="guaranteedBonuses.absorbability !== undefined"
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
          v-if="guaranteedBonuses.absorbability !== undefined"
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
import { required, between, minValue } from 'vuelidate/lib/validators';

export default {
  name: 'PrassiPromoterLetterGuaranteed',
  data() {
    return {
      form: {
        amount: 0,
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
    guaranteedBonuses: {
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
      toProductivePeriodYear: {
        required,
        integer: true,
        between: between(0, 2200),
      },
      invoiceDescription: {},
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
    guaranteedBonuses: {
      immediate: true,
      handler(guaranteedBonuses) {
        this.$utils.logobj('PRASSI-LETTER-DETAIL', 'watch guaranteedBonuses', guaranteedBonuses);
        this.form.amount = guaranteedBonuses.amount / 100;
        if (guaranteedBonuses.absorbability !== undefined) {
          this.form.directProductionPercentage =
            guaranteedBonuses.absorbability.directProductionPercentage / 100;
          this.form.indirectProductionPercentage =
            guaranteedBonuses.absorbability.indirectProductionPercentage / 100;
        }
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
        let changedGuaranteedBonuses = {
          ...this.guaranteedBonuses,
          amount: Math.round(this.form.amount * 100),
        };

        if (this.guaranteedBonuses.absorbability !== undefined) {
          changedGuaranteedBonuses = {
            ...changedGuaranteedBonuses,
            absorbability: {
              directProductionPercentage: this.form.directProductionPercentage * 100,
              indirectProductionPercentage: this.form.indirectProductionPercentage * 100,
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
          guaranteedBonuses: changedGuaranteedBonuses,
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
