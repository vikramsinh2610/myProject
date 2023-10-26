<template>
  <div class="p-tr-main" :class="border ? 'p-tr-border ' : ''" :style="computedMainStyle">
    <div
      :class="`p-tr-main-text-${size} p-tr-text-weight-${weight} ellipsis ${className}`"
      :style="!col ? `width: ${width}px` : 'width: 100%'"
      ref="mainTextId"
    >
      {{ label }} <i class="fas fa-sort" v-if="sortable" />
    </div>
    <q-tooltip v-if="col && checkOverFlow">
      {{ label }}
    </q-tooltip>
    <div
      v-if="!sublabelChip"
      :class="`p-tr-small-text-${size} ellipsis`"
      :style="!col ? `width: ${width}px` : 'width: 100%'"
    >
      {{ sublabel }}
    </div>
    <q-chip v-if="sublabelChip && sublabel" :color="color" text-color="white" dense>
      {{ sublabel }}
    </q-chip>
  </div>
</template>

<script>
export default {
  name: 'PrassiTwoRowsBlock',
  data() {
    return {
      overFlow: 0,
    };
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    sublabel: {
      type: String,
      default: '',
    },
    sublabelChip: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'blue',
    },
    className: {
      type: String,
      default: '',
    },
    border: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'large',
    },
    width: {
      type: Number,
      default: 100,
    },
    col: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: String,
      default: 'normal',
    },
    sortable: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.overFlow = this.$refs.mainTextId
      ? this.$refs.mainTextId.clientWidth - this.$refs.mainTextId.scrollWidth
      : 0;
  },
  computed: {
    checkOverFlow() {
      return this.overFlow < 0;
    },
    computedMainStyle() {
      const colorStyle = this.color ? `color: ${this.color} !important;` : '';
      const mainWidthStyle = this.col ? `max-width: calc(100% - 15px)` : '';
      // const mainWidthStyle = this.col ? `max-width: ${this.width}px` : '';
      return `${colorStyle};${mainWidthStyle}`;
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-tr-main
  display inline-block
  width 100%
  padding-left  5px
  padding-right 20px
.p-tr-border
  border-right solid 1px $card-border
.p-tr-main-text-large
  font-size 20px
  color $dg-3
.p-tr-small-text-large
  font-size 14px
  font-weight 100
  color $text-opaque
.p-tr-main-text-medium
  font-size 18px
  color $dg-3
.p-tr-small-text-medium
  font-size 16px
  font-weight 100
  color $text-opaque
.p-tr-main-text-small
  font-size 16px
  color $dg-3
.p-tr-small-text-small
  font-size 16px
  font-weight 100
  color $text-opaque
.p-tr-text-weight-normal
  font-weight normal
.p-tr-text-weight-light
  font-weight 100
.p-tr-main-text-red
  font-size 18px
  color $red
.p-tr-small-text-red
  font-size 16px
  font-weight 100
  color $red
.q-chip
  text-transform uppercase
</style>
