<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-title-section">
        {{ $t('promoterInsertLetter.detailData') }} {{ name }}
        <prassi-round-button
          class="float-right"
          icon="fa fa-chevron-up"
          @click="$emit('previousStep')"
        />
      </div>
      <div class="q-mt-xl">
        <div
          class="row justify-between q-my-lg"
          v-for="agreement in form.agreements"
          :key="agreement.name"
        >
          <q-collapsible group="privacy" :label="agreement.name">
            <div>{{ agreement.content }}</div>
          </q-collapsible>

          <q-toggle
            class="p-toggle"
            left-label
            :readonly="status !== 'wip' || $user.roleID < 7"
            v-model="agreement.agree"
            :label="$t('promoterInsertLetter.consent')"
            color="secondary"
          />
        </div>
      </div>
      <prassi-standard-button
        class="q-my-lg"
        v-if="status === 'wip' && $user.roleID >= 7"
        :loading="isFetching"
        :label="$t('promoterCompany.save')"
        @click="submit"
      />
      <prassi-round-button
        class="q-mb-md float-right"
        icon="fa fa-chevron-down"
        @click="nextStep"
      />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'PrassiPromoterLetterPrivacy',
  data() {
    return {
      form: {
        agreements: [],
      },
    };
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    agreements: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    agreements: {
      immediate: true,
      handler(agreements) {
        this.$utils.logobj('PRASSI-PROMOTER-LETTER-PRIVACY', 'watch letter privacy', agreements);
        this.form.agreements = [...agreements];
      },
    },
  },
  methods: {
    nextStep() {
      if (this.status === 'wip' && this.$user.roleID >= 7) {
        this.submit();
      } else {
        this.$emit('nextStep');
      }
    },
    submit() {
      this.$utils.logobj('PRASSI-PROMOTER-LETTER-TARGETS', 'submit letter targets', this.form);
      const agreements = [...this.form.agreements];
      this.$emit('changeData', { agreements });
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
.p-large-field
  min-width 270px
.p-small-field
  width 135px
.p-micro-field
  width 75px
.p-toggle
  width 45%
  justify-content space-between
  font-size 22px
.p-date
  width 200px
</style>
