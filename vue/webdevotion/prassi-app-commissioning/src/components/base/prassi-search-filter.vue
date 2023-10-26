<template>
  <q-card style="width: 100%" inline flat color="white" text-color="primary">
    <q-card-actions class="q-px-lg">
      <q-input
        class="full-width"
        v-model="searchModel"
        debounce="500"
        clearable
        :placeholder="searchLabel"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-card-actions>
    <q-card-actions />
  </q-card>
</template>

<script>
export default {
  name: 'PrassiSearchFilter',
  data() {
    return {
      filterInternal: { ...this.filter },
      searchModel: '',
    };
  },
  props: {
    filter: {
      type: Object,
      default: () => ({
        selected: '',
      }),
    },
    searchLabel: {
      type: String,
      default: 'cerca',
    },
  },
  watch: {
    searchModel(value) {
      this.$utils.logobj('PRASSI-SEARCH-FILTER', 'searchModel', value);
      this.$emit('changedSearch', value);
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-top-left-radius 4px
  border-top-right-radius 4px
  border-bottom-right-radius 0
  border-bottom-left-radius 0
  border-top solid 1px $card-border
  border-left solid 1px $card-border
  border-right solid 1px $card-border
.q-separator
  background-color $card-border
.p-pf-plus
  margin auto 0 auto auto
.p-pf-plus:hover
  border-color $secondary
</style>
