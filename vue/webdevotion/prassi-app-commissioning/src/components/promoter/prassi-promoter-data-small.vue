<template>
  <q-card inline flat color="white" class="tezt-primary">
    <q-card-section>
      <div class="p-pd-title-section">{{ $t('promoterDataSmall.promoterDataSmallTitle') }}</div>
      <div class="column justify-between">
        <span class="row no-wrap justify-between items-baseline">
          <span class="p-pd-text-description">{{ $t('promoterDataSmall.serialNumber') }}</span>
          <span class="p-pd-text-large ellipsis">{{ promoter.serialNumber || '' }}</span>
        </span>
        <span class="row no-wrap justify-between items-baseline">
          <span class="p-pd-text-description">{{ $t('promoterDataSmall.dateInserted') }}</span>
          <span class="p-pd-text-medium q-ml-xs ellipsis">
            {{ promoter.networkEnterDate ? $d(new Date(promoter.networkEnterDate)) : '' }}
          </span>
        </span>
        <span class="row no-wrap justify-between items-baseline">
          <span class="p-pd-text-description">{{ $t('promoterDataSmall.dateApproved') }}</span>
          <span class="p-pd-text-medium q-ml-xs ellipsis">
            {{ promoter.approvationDate ? $d(new Date(promoter.approvationDate)) : '' }}
          </span>
        </span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'PrassiPromoterDataSmall',
  props: {
    promoter: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-radius 4px
  border solid 1px $card-border
  height 185px
.p-pd-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
.q-separator
  background-color $lg-4
  opacity 0.2
  height 1px
  margin-top 0
  margin-bottom 8px
  display block
.p-pd-text-description
  margin-left 20px
  font-size 16px
  font-weight 100
.p-pd-text-large
  font-size 35px
  font-weight 500
.p-pd-text-medium
  font-size 24px
  font-weight 500
</style>
