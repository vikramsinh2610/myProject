<template>
  <q-card inline flat color="white" class="text-primary">
    <q-card-section>
      <div class="column justify-between">
        <span class="row no-wrap justify-between items-baseline">
          <span class="p-pd-text-description">{{ $t('customerDataSmall.fiscalCode') }}</span>
          <span class="p-pd-text-large ellipsis">{{ customer.vatCode || '' }}</span>
        </span>
        <span class="row no-wrap justify-between items-baseline">
          <span class="p-pd-text-description">{{ $t('customerDataSmall.created') }}</span>
          <span class="p-pd-text-medium q-ml-xs ellipsis">
            {{ customer.created ? $d(new Date(customer.created)) : '' }}
          </span>
        </span>
        <span class="row no-wrap justify-between items-baseline">
          <span class="p-pd-text-description">{{ $t('customerDataSmall.status') }}</span>
          <span class="p-pd-text-medium q-ml-xs ellipsis">
            {{ customer.statusDisplayValue }}
          </span>
        </span>
        <span class="row no-wrap justify-between items-baseline">
          <span class="p-pd-text-description">{{ $t('customerDataSmall.type') }}</span>
          <span class="p-pd-text-medium q-ml-xs ellipsis">
            {{ customer.typeDisplayValue }}
          </span>
        </span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'PrassiCustomerDataSmall',
  props: {
    customer: {
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
  margin-left 10px
  font-size 16px
  font-weight 100
.p-pd-text-large
  font-size 20px
  font-weight 500
.p-pd-text-medium
  font-size 18px
  font-weight 500
</style>
