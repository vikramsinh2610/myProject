<template>
  <q-btn
    :class="dark ? `p-mb-button-dark border-${border}` : `p-mb-button-light border-${border}`"
    :disable="disabled"
    outline
    dense
    round
    :size="size"
    :color="dark ? 'white' : 'tertiary'"
    :text-color="dark ? 'white' : 'tertiary'"
    aria-label="Menu"
    :type="type"
    :href="href"
    @click="$emit('click', $event)"
    :icon="icon"
  >
    <slot name="popover" />
  </q-btn>
</template>

<script>
export default {
  name: 'PrassiRoundButton',
  props: {
    type: {
      type: String,
      default: 'button',
    },
    href: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '15px',
    },
    icon: {
      type: String,
      default: 'fa fa-burger',
    },
    dark: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    borderColor: {
      type: String,
      default: 'default',
    },
  },
  computed: {
    border() {
      if (this.borderColor === 'default') return this.dark ? 'menu-1st-section' : 'tertiary';
      return this.borderColor;
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-mb-button-dark:hover
  border-color white
.p-mb-button-light:hover
  border-color $secondary
.q-btn--outline
  border-width 2px
  border-style solid
</style>
