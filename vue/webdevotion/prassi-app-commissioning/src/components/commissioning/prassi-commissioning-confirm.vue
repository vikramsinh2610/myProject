<template>
  <div class="column fill-available">
    <q-card
      v-if="
        status !== 'processing' &&
        status !== 'rollbacking' &&
        status !== 'rollbacking-error' &&
        status !== 'opened-error'
      "
      inline
      flat
      class="bg-white text-primary"
    >
      <q-card-section>
        <q-item class="column">
          <div class="text-center" v-if="commissioning.status !== 'closed'">
            {{ $t('commissioning.confirmation') }}
          </div>
          <div class="text-center" v-if="commissioning.status === 'closed'">
            {{ $t('commissioning.alreadyClosed') }}
          </div>
          <div class="q-title text-center">
            <strong>
              {{ $utils.numberToMonth(Number(commissioning._id.slice(4, 6)), $t.bind(this)) }}
              {{ commissioning._id.slice(0, 4) }}
            </strong>
          </div>
        </q-item>
        <prassi-standard-button
          class="q-my-lg"
          v-if="commissioning.status !== 'closed'"
          :label="$t('commissioning.confirmationButton')"
          :loading="isFetching"
          @click="submit"
        />
        <prassi-standard-button
          class="q-my-lg"
          color="red"
          v-if="commissioning.status === 'closed' && $user.roleID >= 1000"
          :label="$t('commissioning.uncloseButton')"
          :loading="isFetching"
          @click="$emit('unclose')"
        />
      </q-card-section>
    </q-card>
    <div
      v-if="status === 'processing' || status === 'rollbacking' || status === 'rollbacking-error'"
      class="fill-available column"
    >
      <prassi-navigate
        not-navigate
        loading
        :button="false"
        :title-label="$t('commissioning.processingTitle')"
      />
    </div>
  </div>
</template>

<script>
import PrassiNavigate from '../base/prassi-navigate';

export default {
  name: 'PrassiCommissioningConfirm',
  components: { PrassiNavigate },
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    commissioning: {
      type: Object,
      default: () => ({}),
    },
    status: {
      type: String,
      default: '',
    },
  },
  methods: {
    submit() {
      this.$utils.log('PRASSI-COMMISSIONING-CONFIRM', 'submit commissioning');
      this.$emit('confirm');
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-radius 4px
  border solid 1px $card-border
  min-height 280px
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
