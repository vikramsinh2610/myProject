<template>
  <div class="p-hv-main">
    <div class="p-hv-title text-uppercase">{{ title }}</div>
    <div class="row justify-between relative-position">
      <span class="p-hv-value">
        {{ !isNaN(value) && !pendingSummary ? $n(value, 'integer') : '-' }}
        <span v-if="currency && !pendingSummary"> € </span>
      </span>
      <q-inner-loading :showing="pendingSummary">
        <q-spinner-ios size="50px" color="primary" />
      </q-inner-loading>
    </div>
    <q-separator />
    <div class="relative-position">
      <span class="p-hv-pvalue">
        {{ !isNaN(previousValue) ? $n(previousValue, 'integer') : '-' }}
      </span>
      <span v-if="currency"> € </span>
      <span
        class="p-hv-percentage"
        :class="percentage >= 0 || !percentage ? 'text-green' : 'text-red'"
      >
        {{ !isNaN(percentage) && percentage && percentage !== Infinity ? percentage : '-' }}%
      </span>
      <q-inner-loading :showing="pendingSummaryPrevious">
        <q-spinner-ios size="50px" color="primary" />
      </q-inner-loading>
    </div>
  </div>
</template>

<script>
import { TweenMax } from 'gsap';

export default {
  name: 'PrassiHeaderBlock',
  props: {
    pendingSummary: {
      type: Boolean,
      default: false,
    },
    pendingSummaryPrevious: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'title',
    },
    value: {
      type: Number,
      default: 0,
    },
    previousValue: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    currency: {
      type: Boolean,
      default: false,
    },
    flickr: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tweenedValue: 0,
    };
  },
  computed: {
    animatedValue() {
      return Math.round(this.tweenedValue);
    },
  },
  watch: {
    value(newValue) {
      TweenMax.to(this.$data, 1, { tweenedValue: newValue });
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-hv-main
  padding 10px 15px 4px
  border-radius 4px
  background-color white
  min-width 155px
.p-hv-title
  font-size 16px
  color $text-opaque
  font-weight 100
.p-hv-value
  font-size 34px
  line-height 46px
  margin auto
.q-separator
  background-color $lg-4
  opacity 0.2
  margin-top 0
  margin-bottom 8px
  display block
.p-hv-pvalue
  font-size 18px
  font-weight 100
.p-hv-percentage
  float right
  font-size 18px
</style>
