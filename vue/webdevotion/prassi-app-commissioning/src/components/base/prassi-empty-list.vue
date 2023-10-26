<template>
  <div>
    <q-card style="width: 100%" inline flat color="white" text-color="primary">
      <q-card-section class="row no-wrap">
        <div class="block margin-auto p-tr-main-text-large">{{ $t('default.empty') }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'PrassiAttachmentList',
};
</script>

<style lang="stylus" scoped>
.q-card
  margin-bottom 6px
  border-radius 4px
  border solid 1px $card-border
.q-card-main
  position relative
  padding 5px 0 5px 16px
  align-items center
  height 60px
.p-tr-main-text-large
  font-size 20px
  color $dg-3
</style>
