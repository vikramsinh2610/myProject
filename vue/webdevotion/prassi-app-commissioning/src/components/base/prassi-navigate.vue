<template>
  <q-card style="width: 100%" inline flat class="bg-white text-primary">
    <q-card-section v-if="titleLabel" style="text-align: center">{{ titleLabel }}</q-card-section>
    <q-spinner-gears v-if="loading" class="block margin-auto" size="50px" color="primary" />
    <q-card-actions>
      <q-btn
        v-if="!notNavigate"
        rounded
        flat
        icon="fa fa-chevron-left"
        class="p-btn-icon block"
        style="margin-left: 15px !important; margin-right: 0 !important"
        color="secondary"
        text-color="secondary"
        :label="$t('default.navigateBack')"
        @click="$emit('backwardClicked')"
      />
      <prassi-standard-button
        v-if="button"
        class="this-p-btn"
        :label="buttonLabel"
        @click="$emit('buttonClicked')"
      />
      <prassi-standard-button
        v-if="button2"
        class="this-p-btn"
        :color="buttonColor2"
        :label="buttonLabel2"
        @click="$emit('button2Clicked')"
      />
      <prassi-standard-button
        v-if="button3"
        class="this-p-btn"
        :label="buttonLabel3"
        @click="$emit('button3Clicked')"
      />
      <div v-if="!button" class="block" />
      <q-btn
        v-if="!notNavigate"
        rounded
        flat
        icon-right="fa fa-chevron-right"
        class="p-btn-icon block"
        style="margin-right: 15px !important"
        color="secondary"
        text-color="secondary"
        :label="$t('default.navigateForward')"
        @click="$emit('forwardClicked')"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'PrassiNavigate',
  props: {
    buttonLabel: {
      type: String,
      default: '',
    },
    buttonLabel2: {
      type: String,
      default: '',
    },
    buttonColor2: {
      type: String,
      default: 'red',
    },
    titleLabel: {
      type: String,
      default: '',
    },
    button: {
      type: Boolean,
      default: true,
    },
    button2: {
      type: Boolean,
      default: false,
    },
    button3: {
      type: Boolean,
      default: false,
    },
    buttonLabel3: {
      type: String,
      default: '',
    },
    notNavigate: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
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
.p-pf-plus:hover
  border-color $secondary
.this-p-btn
  margin auto !important
.side-p-btn
  margin-top auto
  margin-bottom  auto
</style>
