<template>
  <q-btn
    flat
    size="lg"
    class="p-standard-btn block q-my-xs"
    :color="color"
    :text-color="color"
    :label="label"
    :loading="loading"
    :disable="disable"
    @click="$emit('click')"
  />
</template>

<script>
export default {
  name: 'PrassiStandardButton',
  props: {
    label: {
      type: String,
      default: 'Ok',
    },
    color: {
      type: String,
      default: 'secondary',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-standard-btn
  margin-left auto
  margin-right  auto
  min-width 250px
.p-standard-btn:hover
  background-color $secondary
  color white !important
</style>
