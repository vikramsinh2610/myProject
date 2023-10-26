<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section">
        {{ $t('promoterInsertLetter.activationStep') }}
        <prassi-round-button
          class="float-right"
          icon="fa fa-chevron-up"
          @click="$emit('previousStep')"
        />
      </div>
      <q-item class="column">
        <div class="text-center" v-if="letter.status === 'wip'">
          {{ $t('promoterInsertLetter.confirmation') }}
        </div>
        <div class="text-center" v-if="letter.status === 'active'">
          {{ $t('promoterInsertLetter.letterIsActive') }}
        </div>
        <div class="text-center" v-if="letter.status === 'inactive'">
          {{ $t('promoterInsertLetter.letterIsInActive') }}
        </div>
        <div class="q-title text-center">
          <strong>{{ letter._id }}</strong> {{ $t('promoterInsertLetter.of') }}
          <strong>{{ letter.promoterDisplayName }}</strong>
        </div>
      </q-item>
      <prassi-standard-button
        class="q-my-lg"
        v-if="letter.status === 'wip' && $user.roleID >= 7"
        :loading="isFetching"
        :label="$t('promoterInsertLetter.activate')"
        @click="submit"
      />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'PrassiPromoterLetterActivate',
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    letter: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    submit() {
      this.$utils.log('PRASSI-PROMOTER-LETTER-ACTIVATE', 'submit letter ACTIVATE');
      this.$emit('activate');
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
.p-pc-title-section
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
