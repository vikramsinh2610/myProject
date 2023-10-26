<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
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
        />
        <span class="p-dr-text-year"> {{ filterInternal.year }} </span>
        <q-btn
          id="right"
          dense
          flat
          size="25px"
          color="tertiary"
          aria-label="year add"
          icon="keyboard_arrow_right"
          @click="add"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'PrassiYearRangeBlock',
  data() {
    return {
      filterInternal: { ...this.filter },
    };
  },
  props: {
    filter: {
      type: Object,
      default: () => ({
        year: 2018,
      }),
    },
  },
  watch: {
    filter(filter) {
      this.$utils.logobj('PRASSIDATERANGE', 'filter changed', filter);
      this.filterInternal = { ...filter };
    },
    'filterInternal.year': function (year) {
      this.$utils.logobj('PRASSIDATERANGE', 'filterInternal.year', year);
      this.$emit('changed', { ...this.filterInternal, year });
    },
  },
  methods: {
    add() {
      this.$utils.log('PRASSIDATERANGE', 'add');
      this.filterInternal.year += 1;
    },
    subtract() {
      this.$utils.log('PRASSIDATERANGE', 'subtract');
      this.filterInternal.year -= 1;
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-radius 4px
  border solid 1px $card-border
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
</style>
