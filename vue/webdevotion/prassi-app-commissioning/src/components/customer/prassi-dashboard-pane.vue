<template>
  <div class="box">
    <header v-if="$slots['header']">
      <slot name="header"></slot>
    </header>

    <div v-if="$slots['body']" :class="{ pane: true, 'with-chip': !!chip }">
      <q-chip v-if="chip" class="p-c-chip lowercase" dense color="lg-2" text-color="primary">{{
        chip
      }}</q-chip>

      <slot name="body"></slot>
    </div>

    <slot name="default"></slot>
  </div>
</template>

<script>
export default {
  name: 'PrassiDashboardPane',
  props: {
    chip: {
      type: String,
      default: undefined,
    },
  },
};
</script>

<style lang="stylus" scoped></style>
