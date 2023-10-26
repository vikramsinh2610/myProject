<template>
  <q-card style="width: 100%" inline flat color="white" text-color="primary">
    <q-card-actions class="row q-px-lg">
      <q-input
        class="col"
        v-model="filterInternal.promoterDisplayName"
        debounce="500"
        clearable
        :placeholder="$t('filterPromoterBlock.searchPromoter')"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-select
        class="col-3 q-ml-lg"
        clearable
        v-model="type"
        :label="$t('letterHeader.type')"
        :options="lettersTypesList"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import constants from '../../constants';

export default {
  name: 'PrassiLetterFilter',
  data() {
    return {
      type: undefined,
      filterInternal: { ...this.filter },
    };
  },
  props: {
    filter: {
      type: Object,
      default: () => ({
        promoterDisplayName: '',
        type: undefined,
      }),
    },
    lettersTypes: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    lettersTypesList() {
      const lettersTypesList = [];
      this.lettersTypes.forEach((type) => {
        lettersTypesList.unshift({
          label: this.$t(`promoterInsertLetter.${type}`),
          value: type,
        });
      });

      lettersTypesList.unshift({
        label: this.$t(`default.${constants.noSelection}`),
        value: constants.noSelection,
      });

      return lettersTypesList;
    },
  },
  watch: {
    filter(filter) {
      this.$utils.logobj('PRASSI-LETTER-FILTER', 'filter changed', filter);
      this.filterInternal = { ...filter };
    },
    'filterInternal.promoterDisplayName': function (value) {
      this.$utils.logobj('PRASSI-LETTER-FILTER', 'searchByPromoter', value);
      this.$emit('changed', { ...this.filterInternal, promoterDisplayName: value });
    },
    type(value) {
      this.$utils.logobj('PRASSI-LETTER-FILTER', 'searchByType changed', value);
      this.filterInternal = { ...this.filterInternal, type: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  margin-bottom 10px
  border-radius 4px
  border solid 1px $card-border
.q-separator
  background-color $card-border
.p-pf-plus
  margin auto 0 auto auto
.p-pf-plus:hover
  border-color $secondary
</style>
