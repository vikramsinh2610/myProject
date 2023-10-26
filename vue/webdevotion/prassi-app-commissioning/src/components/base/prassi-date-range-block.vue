<template>
  <div class="main-div">
    <q-card inline flat color="white" class="text-primary">
      <q-card-section class="q-card-main">
        <div class="p-dr-title-section uppercase">
          {{ $t('dateRangeBlock.prassiDateRangeTitle') }}
        </div>
        <div class="p-dr-central-section row justify-between">
          <q-btn
            id="left"
            dense
            flat
            size="25px"
            color="tertiary"
            aria-label="year sub"
            icon="keyboard_arrow_left"
            @click="subtract"
            :disable="disabled"
          />
          <span
            v-if="filterInternal.selected === 'year' || filterInternal.selected === 'allPeriod'"
            class="p-dr-text-year"
            :style="disabled ? 'color: grey' : ''"
          >
            {{ $t('dateRangeBlock.year') }}/{{ filterInternal.year }}
          </span>
          <span
            v-if="filterInternal.selected === 'month'"
            class="p-dr-text-year month-click"
            :style="disabled ? 'color: grey' : ''"
            @click="disabled ? (showMonthDialog = false) : (showMonthDialog = true)"
          >
            {{ $utils.numberToMonth(filterInternal.month, $t.bind(this)).slice(0, 3) }}/{{
              filterInternal.year
            }}
          </span>
          <span
            v-if="filterInternal.selected === 'quarter'"
            class="p-dr-text-year"
            :style="disabled ? 'color: grey' : ''"
          >
            {{ $utils.numberToQuarter(filterInternal.quarter) }}/{{ filterInternal.year }}
          </span>
          <q-btn
            id="right"
            dense
            flat
            size="25px"
            color="tertiary"
            aria-label="year add"
            icon="keyboard_arrow_right"
            @click="add"
            :disable="disabled"
          />
        </div>
        <q-separator />
        <q-tabs v-if="!onlyMonth" inverted no-pane-border v-model="filterInternal.selected">
          <q-tab name="month" :label="$t('dateRangeBlock.month')" :disable="disabled" />
          <q-tab name="quarter" :label="$t('dateRangeBlock.quarter')" :disable="disabled" />
          <q-tab name="year" :label="$t('dateRangeBlock.year')" :disable="disabled" />
        </q-tabs>
        <q-tabs v-if="onlyMonth" inverted no-pane-border v-model="filterInternal.selected">
          <q-tab name="month" :label="$t('dateRangeBlock.month')" :disable="disabled" />
        </q-tabs>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showMonthDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('dateRangeBlock.prassiDateRangeTitle') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-between q-my-xs">
            <q-select
              class="col-6"
              v-model="monthPeriod"
              :label="$t('commissioning.productivePeriodMonth')"
              :options="$utils.productivePeriodMonthList($t.bind(this))"
            />
            <q-input
              class="col-4"
              v-model="yearPeriod"
              type="number"
              :label="$t('commissioning.productivePeriodYear')"
              :error="$v.yearPeriod.$error"
              :error-message="$t('commissioning.productivePeriodYearError')"
              @blur="$v.yearPeriod.$touch"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.applyButton')" @click="changeMonthDirect" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { required, between } from 'vuelidate/lib/validators';

export default {
  name: 'PrassiDateRangeBlock',
  data() {
    return {
      showMonthDialog: false,
      monthPeriod: {
        label: this.$utils.numberToMonth(new Date().getMonth() + 1, this.$t.bind(this)),
        value: new Date().getMonth() + 1,
      },
      yearPeriod: new Date().getFullYear(),
      filterInternal: { ...this.filter },
    };
  },
  validations: {
    yearPeriod: {
      required,
      integer: true,
      between: between(2000, 2999),
    },
  },
  props: {
    filter: {
      type: Object,
      default: () => ({
        selected: 'month',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        quarter: 1,
      }),
    },
    dateFlow: {
      type: String,
      default: 'all',
    },
    onlyMonth: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    filter(filter) {
      this.$utils.logobj('PRASSIDATERANGE', 'filter changed', filter);
      this.filterInternal = { ...filter };
    },
    'filterInternal.selected': function (selected) {
      this.$utils.logobj('PRASSIDATERANGE', 'filterInternal.selected', selected);
      this.filterInternal = {
        ...this.filterInternal,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        quarter: this.$utils.monthToQuarter(new Date().getMonth() + 1),
        selected,
      };
      this.$emit('changed', this.filterInternal);
    },
    'filterInternal.year': function (year) {
      this.$utils.logobj('PRASSIDATERANGE', 'filterInternal.year', year);
      this.$emit('changed', { ...this.filterInternal, year });
    },
    'filterInternal.month': function (month) {
      this.$utils.logobj('PRASSIDATERANGE', 'filterInternal.month', month);
      this.$emit('changed', { ...this.filterInternal, month });
    },
    'filterInternal.quarter': function (quarter) {
      this.$utils.logobj('PRASSIDATERANGE', 'filterInternal.quarter', quarter);
      this.$emit('changed', { ...this.filterInternal, quarter });
    },
  },
  methods: {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    add() {
      try {
        this.filterInternal = this.$utils.addDate(this.filterInternal, this.dateFlow);
      } catch (error) {
        this.$q.notify({
          message: this.$t(error.message),
          color: 'secondary',
          timeout: 300,
        });
      }
    },
    // eslint-disable-next-line sonarjs/cognitive-complexity
    subtract() {
      try {
        this.filterInternal = this.$utils.subtractDate(this.filterInternal, this.dateFlow);
      } catch (error) {
        this.$q.notify({
          message: this.$t(error.message),
          color: 'secondary',
          timeout: 300,
        });
      }
    },
    changeMonthDirect() {
      this.showMonthDialog = false;
      this.filterInternal = {
        ...this.filterInternal,
        year: Number.parseInt(this.yearPeriod, 10),
        month: this.monthPeriod.value,
      };
      this.$emit('changed', this.filterInternal);
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-radius 4px
  border solid 1px $card-border
  max-height fit-content
.main-div
  max-height fit-content
.q-card-main
  padding 10px 15px 0
.p-dr-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
.q-separator
  background-color $lg-4
  opacity 0.2
  height 1px
  margin-top 0
  margin-bottom 8px
  display block
.p-dr-central-section
  height 46px
.p-dr-text-year
  font-size 40px
  line-height 46px
  margin auto
.q-tab
  padding-top 0
  padding-bottom 0
  height 34px
  min-height 34px
.q-tabs-head
  min-height 34px
.month-click
  cursor pointer
.month-click:hover
  opacity 0.25
</style>
