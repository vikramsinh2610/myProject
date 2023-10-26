<template>
  <div class="row no-wrap justify-between p-hs-opaque">
    <prassi-header-block
      v-for="block in blocks"
      :key="block._id"
      :title="$t(`${block.title}`)"
      :value="block.value"
      :previous-value="block.previousValue"
      :percentage="block.percentage"
      :currency="block.currency"
      :flickr="block.flickr"
      :pending-summary="pendingSummary"
      :pending-summary-previous="pendingSummaryPrevious"
    />
  </div>
</template>

<script>
import PrassiHeaderBlock from './prassi-header-block';

export default {
  name: 'PrassiHeaderSummary',
  components: {
    PrassiHeaderBlock,
  },
  props: {
    pendingSummary: {
      type: Boolean,
      default: false,
    },
    pendingSummaryPrevious: {
      type: Boolean,
      default: false,
    },
    blocks: {
      type: Array,
      default: () => [
        {
          _id: 0,
          title: 'consultants',
          value: 0,
          previousValue: 0,
          percentage: 0,
          currency: false,
          flickr: false,
        },
      ],
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-hs-opaque
  border solid 1px $card-border
  background-color white
  opacity 0.65
</style>
