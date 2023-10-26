<template>
  <div class="p-c-fit" :class="col ? 'col' : ''" :style="col ? 'min-width: 50px' : ''">
    <q-chip
      v-if="type === 'chip'"
      class="p-c-chip lowercase"
      dense
      color="lg-2"
      text-color="primary"
    >
      {{ chipText }}
    </q-chip>
    <prassi-two-rows-block
      v-if="type === '2rows'"
      :label="label"
      :sublabel="sublabel"
      :sublabel-chip="sublabelChip"
      :color="color"
      :size="size"
      :weight="weight"
      :width="width"
      :col="col"
      :class-name="className"
    />
    <q-icon
      v-if="type === 'icon'"
      class="p-c-icon"
      :name="icon"
      :color="color"
      size="15px"
      :style="`width: ${width}px`"
    />
  </div>
</template>

<script>
import PrassiTwoRowsBlock from './prassi-two-rows-block';

export default {
  name: 'PrassiConditionalBlock',
  components: { PrassiTwoRowsBlock },
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
    weight: {
      type: String,
      default: 'normal',
    },
    type: {
      type: String,
      default: '2rows',
    },
    icon: {
      type: String,
      default: 'fa fa-check',
    },
    color: {
      type: String,
      default: 'green',
    },
    className: {
      type: String,
      default: '',
    },
    chipText: {
      type: String,
      default: 'Pt',
    },
    col: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-c-icon
  color $r-3
  margin-left   5px
  margin-right  20px
.p-c-chip
  position absolute
  left -10px
  top 20px
  font-size 16px
.p-c-fit
  display inline-flex
</style>
