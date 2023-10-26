<template>
  <q-card style="width: 100%" inline flat color="white" text-color="primary">
    <q-card-actions>
      <q-tabs inverted no-pane-border v-model="filterInternal.selected">
        <q-tab name="appointment" :label="$t('promoterDetail.appointment')" boot />
        <q-tab name="granted" :label="$t('promoterDetail.granted')" boot />
        <q-tab name="rappel" :label="$t('promoterDetail.rappel')" boot />
        <q-tab name="bonus" :label="$t('promoterDetail.bonus')" boot />
        <q-tab name="privacy" :label="$t('promoterDetail.privacy')" boot />
        <q-tab name="all" :label="$t('promoterDetail.all')" boot />
      </q-tabs>
      <prassi-round-button class="p-pf-plus" icon="fa fa-plus" />
    </q-card-actions>
    <q-separator />
    <q-card-actions />
  </q-card>
</template>

<script>
export default {
  name: 'PrassiPromoterLetterFilter',
  data() {
    return {
      filterInternal: { ...this.filter },
    };
  },
  props: {
    filter: {
      type: Object,
      default: () => ({
        selected: 'all',
      }),
    },
  },
  watch: {
    filter(filter) {
      this.$utils.logobj('PRASSI-PROMOTER-LETTER-FILTER', 'filter.selected', filter);
      this.filterInternal = { ...filter };
    },
    'filterInternal.selected': function (selected) {
      this.$utils.logobj('PRASSI-PROMOTER-LETTER-FILTER', 'filterInternal.selected', selected);
      this.$emit('input', { ...this.filterInternal, selected });
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
  min-width 900px
  max-width 1800px
.q-separator
  background-color $card-border
.p-pf-plus
  margin auto 0 auto auto
.p-pf-plus:hover
  border-color $secondary
</style>
