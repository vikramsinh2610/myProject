<template>
  <q-card style="width: 100%" inline flat color="white" text-color="primary">
    <q-card-actions>
      <q-tabs inverted no-pane-border v-model="filterInternal.selected">
        <q-tab name="direct" :label="$t('filterProposalBlock.direct')" boot />
        <q-tab name="indirect" :label="$t('filterProposalBlock.indirect')" boot />
        <q-tab name="all" :label="$t('filterProposalBlock.all')" boot />
      </q-tabs>
      <prassi-round-button class="p-pf-plus" icon="fa fa-plus" />
    </q-card-actions>
    <q-separator />
    <q-card-actions>
      <q-chip color="lg-2" text-color="primary" closable> produzione: "tutta" </q-chip>
      <q-chip color="lg-2" text-color="primary" closable> stato: "in elaborazione" </q-chip>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'PrassiProposalFilter',
  data() {
    return {
      filterInternal: { ...this.filter },
    };
  },
  props: {
    filter: {
      type: Object,
      default: () => ({
        selected: 'indirect',
      }),
    },
  },
  watch: {
    filter(filter) {
      this.$utils.logobj('PRASSI-PROPOSAL-FILTER', 'filter changed', filter);
      this.filterInternal = { ...filter };
    },
    'filterInternal.selected': function (selected) {
      this.$utils.logobj('PRASSI-PROPOSAL-FILTER', 'filterInternal.selected', selected);
      this.$emit('changed', { ...this.filterInternal, selected });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  margin-bottom 10px
  border-radius 4px
  border solid 1px $card-border
  min-width 900px
  max-width 1800px
.q-separator
  background-color $card-border
.p-pf-plus
  margin auto 0 auto auto
.p-pf-plus:hover
  border-color $secondary
</style>
