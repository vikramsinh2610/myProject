<template>
  <q-card inline flat color="white" text-color="primary" style="width: 700px">
    <q-card-section>
      <div class="p-pc-title-section" v-if="!embedded">Mandato</div>
      <div>
        <div class="row justify-between q-my-xs">
          <div class="full-width">
            <p class="text-h6">Conferimento mandato a Sheltia Srl</p>
            <q-separator />
            <div class="row justify-between q-my-xs">
              <p class="desc">
                Conferisce mandato di brokeraggio affidando l'incarico di svolgere attività di
                intermediazione previste dal Regolamento IVASS n. 40 del 02/08/2018, e successive
                integrazioni, ovvero di di gestire, amministrare, intermediare e prestare servizi di
                consulenza assicurativa in merito alle coperture dei rischi e delle polizze:
              </p>
              <q-option-group
                v-model="form.noPolicyLimits"
                :disable="readOnly"
                :options="[
                  {
                    label:
                      'Di qualunque tipo, sia per quelle in essere e sia per quelle future, nella mia/nostra sfera d’interesse',
                    value: true,
                  },
                  {
                    label:
                      'Limitatamente ad alcuni specifici rischi/tipologie di polizze (specificare):',
                    value: false,
                  },
                ]"
                class="text-left"
                :type="'radio'"
                size="30px"
                color="primary"
                inline
              />
            </div>
            <div v-if="!form.noPolicyLimits" class="row justify-between q-my-xs">
              <q-input
                class="col-12"
                v-model="form.policies"
                :readonly="readOnly || this.form.noPolicyLimits"
                type="text"
                label="Specificare i rischi o le tipologie di polizze previste"
                :error-message="errorMessage.policies"
                :error="$v.form.policies.$error"
                @blur="$v.form.policies.$touch"
              />
            </div>
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
      <div class="row justify-between q-my-xs" v-if="!readOnly && !isFetching">
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
        policies: '',
        noPolicyLimits: true,
      },
      errorMessage: {
        policies: '',
      },
    };
  },
  props: {
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
    isFetching: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    precontractual: {
      immediate: true,
      handler(precontractual) {
        this.$utils.logobj('PRASSI-PERSON-MANDATE-COMPANY', 'precontractual', precontractual);
        if (!precontractual.id) return;
        let place = precontractual.signPlaceMandate;
        if (!place) {
          place = precontractual.signPlacePrivacy;
        }
        this.form.signPlaceMandate = place;
        this.form.noPolicyLimits = precontractual.noPolicyLimits;
        if (!precontractual.policies) {
          this.form.noPolicyLimits = true;
        }
        this.form.policies = precontractual.policies;
      },
    },
  },
  validations() {
    const v = this.required ? { required } : {};
    return {
      form: {
        signPlaceMandate: v,
        policies: {
          checkLimit(value, { noPolicyLimits }) {
            if (noPolicyLimits === true) {
              this.errorMessage.policies = '';
              return true;
            }
            if (value === '') {
              this.errorMessage.policies = 'Il campo è richiesto';
              return false;
            }
            if (!/^[ ',;a-z]+$/i.test(value)) {
              this.errorMessage.policies = 'Ci sono dei caratteri speciali non ammessi.';
              return false;
            }

            return true;
          },
        },
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
      if (this.form.noPolicyLimits === true) {
        this.form.policies = '';
      }
      const changedPrecontractual = {
        signPlaceMandate: this.form.signPlaceMandate,
        policies: this.form.policies,
        noPolicyLimits: this.form.noPolicyLimits,
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
.desc
  margin-top 10px
  color #666666
  font-weight 400
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
