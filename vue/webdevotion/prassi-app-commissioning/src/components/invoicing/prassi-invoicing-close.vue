<template>
  <div class="fill-available row no-wrap">
    <div v-if="invoicing.status === 'close-processing'" class="fill-available column">
      <prassi-navigate
        not-navigate
        loading
        :button="false"
        :title-label="$t('invoicing.closeProcessingTitle')"
      />
    </div>
    <div v-if="invoicing.status === 'closing-error'" class="fill-available column">
      <prassi-navigate
        not-navigate
        :title-label="$t('invoicing.openedErrorTitle')"
        :button-label="$t('invoicing.reprocessClosing')"
        @buttonClicked="$emit('close')"
      />
      <prassi-log-events :invoicing-id="$route.params.id" commissioning-id="no-commissioning" />
    </div>
    <q-card
      v-if="invoicing.status !== 'close-processing' && invoicing.status !== 'closing-error'"
      class="fill-available"
      inline
      flat
      color="white"
      text-color="primary"
    >
      <q-card-section>
        <q-item class="column">
          <div class="text-center" v-if="invoicing.status !== 'closed'">
            {{ $t('invoicing.closing') }}
          </div>
          <div class="text-center" v-if="invoicing.status === 'closed'">
            {{ $t('invoicing.alreadyClosed') }}
          </div>
          <div class="q-title text-center">
            <strong>
              {{ $utils.numberToMonth(Number(invoicing._id.slice(4, 6)), $t.bind(this)) }}
              {{ invoicing._id.slice(0, 4) }}
            </strong>
          </div>
        </q-item>
        <prassi-standard-button
          class="q-my-lg"
          v-if="invoicing.status !== 'closed'"
          :label="$t('invoicing.closeButton')"
          :loading="isFetching"
          @click="submit"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import PrassiNavigate from '../base/prassi-navigate';
import PrassiLogEvents from '../base/prassi-log-events';

export default {
  name: 'PrassiInvoicingClose',
  components: { PrassiNavigate, PrassiLogEvents },
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    invoicing: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    submit() {
      this.$utils.log('PRASSI-INVOICING-CLOSE', 'submit invoicing');
      this.$emit('close');
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-radius 4px
  border solid 1px $card-border
.q-card-main
  padding 10px 15px 0
  min-height 34px
.p-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  margin-bottom 20px
.p-pc-large-field
  min-width 270px
.p-pc-small-field
  width 130px
.p-pc-toggle
  width 45%
  justify-content space-between
  font-size 22px
.p-pc-date
  width 200px
</style>
