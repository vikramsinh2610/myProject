<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section" v-if="!embedded">Mandato</div>
      <div>
        <div class="row justify-between q-my-xs">
          <div class="full-width">
            <p class="text-h6">Conferimento mandato a Sheltia Srl</p>
            <q-separator />
            <div class="row justify-between q-my-xs">
              <q-input
                class="col-5"
                v-model="form.signPlaceMandate"
                :readonly="readOnly"
                type="text"
                label="Luogo Firma"
                :error-message="$t('person.error')"
                :error="$v.form.signPlaceMandate.$error"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-between q-my-xs" v-if="!readOnly">
        <prassi-standard-button class="q-mb-lg" label="Successivo" @click="nextStep()" />
        <prassi-standard-button class="q-mb-lg" label="Salva e Chiudi" @click="submit" />
      </div>
    </q-card-section>
    <q-inner-loading :showing="isFetching">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'PrassiPersonMandate',
  data() {
    return {
      message: '',
      signatureUi: `/signature_uis/${this.$env.yousignSignatureUi}`,
      form: {
        signPlaceMandate: '',
      },
    };
  },
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    person: {
      type: Object,
      default: () => ({}),
    },
    embedded: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: true,
    },
    precontractual: {
      type: Object,
      default: () => ({}),
    },
    readOnly: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    precontractual: {
      immediate: true,
      handler(precontractual) {
        this.$utils.logobj('PRASSI-PERSON-DOCUMENT-CARD', 'precontractual', precontractual);
        if (!precontractual.id) return;
        let place = precontractual.signPlaceMandate;
        if (!place) {
          place = precontractual.signPlacePrivacy;
        }
        this.form.signPlaceMandate = place;
      },
    },
  },
  validations() {
    const v = this.required ? { required } : {};
    return {
      form: {
        signPlaceMandate: v,
      },
    };
  },
  methods: {
    nextStep() {
      this.saveData();
      this.$emit('nextStep');
    },
    submit() {
      this.saveData();
    },
    saveData() {
      this.$v.form.$touch();
      const changedPrecontractual = {
        signPlaceMandate: this.form.signPlaceMandate,
      };
      if (!this.$v.form.$error) {
        this.$emit('changePrecontractual', {
          data: changedPrecontractual,
          stepper: { name: 'mandate', status: 'completed' },
        });
      } else {
        this.$emit('changePrecontractual', {
          data: changedPrecontractual,
          stepper: { name: 'mandate', status: 'uncompleted' },
        });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.text-h6
  margin-bottom 4px;
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
.p-pc-red-section
  font-size 18px
  color $r-3
  font-weight 500
  margin 20px auto
  text-align center
.p-pc-small-field
  width 140px
.p-pc-toggle
  width 45%
  justify-content space-between
  font-size 22px
.p-pc-date
  width 200px
</style>
