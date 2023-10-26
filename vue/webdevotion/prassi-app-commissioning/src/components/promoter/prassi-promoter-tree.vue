<template>
  <div>
    <div v-for="promoter in promoters" :key="promoter._id">
      <prassi-promoter-block
        :id="promoter._id"
        :name="promoter.name"
        :area="promoter.area"
        :color="promoter.color"
        :consultants="promoter.consultants"
        :insured="promoter.insured"
        :premiums="promoter.premiums / 100"
        :iv="promoter.iv / 100"
        :pz="promoter.pc"
        :proposals="promoter.proposals"
      />
    </div>
  </div>
</template>

<script>
import PrassiPromoterBlock from './prassi-promoter-block';

export default {
  name: 'PrassiPromoterTree',
  components: { PrassiPromoterBlock },
  props: {
    promoters: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="stylus" scoped></style>
