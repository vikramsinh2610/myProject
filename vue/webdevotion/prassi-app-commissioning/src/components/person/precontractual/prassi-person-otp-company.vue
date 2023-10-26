<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section" v-if="!embedded">Adesione OTP</div>
      <div
        v-if="!(signatureDocuments && signatureDocuments.fileId)"
        class="row justify-between q-my-xs"
      >
        <div class="full-width">
          <p class="text-h6">Conferma email e cellulare per firma OTP</p>
          <p class="text-p">*dati modificabili solo in questa sezione e non successivamente</p>
          <q-separator />
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-5"
              v-model="form.email"
              :readonly="readOnly"
              type="email"
              :label="$t('person.email')"
              :error-message="$t('person.error')"
              :error="$v.form.email.$error"
              @blur="$v.form.email.$touch"
            />
          </div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-5"
              v-model="form.mobilePhone"
              :readonly="readOnly"
              type="text"
              :label="$t('person.mobilePhone')"
              :error-message="errorMessage.mobilePhone"
              :error="$v.form.mobilePhone.$error"
              @blur="$v.form.mobilePhone.$touch"
            />
          </div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-5"
              v-model="form.signPlaceOtp"
              :readonly="readOnly"
              type="text"
              label="Luogo Firma"
              :error-message="$t('person.error')"
              :error="$v.form.signPlaceOtp.$error"
            />
          </div>
          <prassi-standard-button
            v-if="!isFetching && !readOnly"
            label="Crea PDF per firma digitale"
            @click="clickSign"
          />
        </div>
      </div>
      <div v-else>
        <div v-if="signatureDocuments.documentId">
          <p>Il documento è stato firmato.</p>
          <prassi-standard-button
            label="Scarica PDF firmato"
            @click="() => downloadPdf(signatureDocuments.documentId)"
          />
        </div>
        <div v-else>
          <p>Il PDF è pronto per essere firmato.</p>
          <prassi-standard-button label="Vai a Firma cliente" @click="nextStep" />
        </div>
      </div>
    </q-card-section>
    <q-inner-loading :showing="isFetching">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import download from 'getfile-rename-js';
// eslint-disable-next-line no-unused-vars
import { email, required, requiredUnless } from 'vuelidate/lib/validators';

export default {
  name: 'PrassiPersonOtp',
  data() {
    return {
      message: '',
      signatureUi: `/signature_uis/${this.$env.yousignSignatureUi}`,
      signatureDocuments: {},
      form: {
        signPlaceOtp: '',
        email: '',
        mobilePhone: '',
      },
      errorMessage: {
        mobilePhone: '',
      },
    };
  },
  props: {
    person: {
      type: Object,
      default: () => ({}),
    },
    legalPerson: {
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
        let place = precontractual.signPlaceOtp;
        if (!place) {
          place = precontractual.signPlacePrivacy;
        }
        this.form.signPlaceOtp = place;
      },
    },
    person: {
      immediate: true,
      handler(person) {
        this.$utils.logobj('PRASSI-PERSON-DOCUMENT-CARD', 'person', person);
        if (!person.id) return;
        this.form.email = person.email;
        this.form.mobilePhone = person.mobilePhone;
      },
    },
    legalPerson: {
      immediate: true,
      handler(legalPerson) {
        this.$utils.logobj('PRASSI-PERSON-DOCUMENT-CARD', 'legalPerson', legalPerson);
        if (!legalPerson.id) return;
        this.form.email = legalPerson.email;
        this.form.mobilePhone = legalPerson.mobilePhone;
      },
    },
  },
  validations() {
    const v = this.required ? { required } : {};
    return {
      person: {
        companyName: v,
        legalAddress: {
          route: v,
          streetNumber: v,
          city: v,
          postalCode: v,
          province: v,
          country: v,
        },
        email: v,
        fiscalCode: v,
      },
      legalPerson: {
        mobilePhone: v,
        legalAddress: {
          route: v,
          streetNumber: v,
          city: v,
          postalCode: v,
          province: v,
          country: v,
        },
        email: v,
        name: v,
        surname: v,
        fiscalCode: v,
        birthCity: v,
        birthDate: v,
        birthRegion: v,
        birthState: v,
      },
      form: {
        email: {
          email,
          requiredIf: requiredUnless(function () {
            if (!this.required) return false;
            return this.form.mobilePhone !== '';
          }),
        },
        mobilePhone: {
          checkPhone(value) {
            if (!/^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,7}$/i.test(value) && value !== '') {
              this.errorMessage.mobilePhone = 'Il numero di cellulare non è corretto.';
              return false;
            }
            if (value === '') {
              this.errorMessage.mobilePhone = 'Il campo è richiesto';
              return false;
            }
            return true;
          },
        },
        signPlaceOtp: v,
      },
    };
  },
  methods: {
    nextStep() {
      this.$emit('nextStep');
    },
    formatPhone(phone) {
      return phone.includes('+') ? phone : `+39${phone}`;
    },
    ...mapActions({
      signPdfDocumentsCompany: 'dossiers/signPdfDocumentsCompany',
    }),

    ...mapMutations({}),

    async clickSign() {
      this.$v.person.$touch();
      this.$v.legalPerson.$touch();
      this.$v.form.$touch();
      if (this.$v.person.$error || this.$v.legalPerson.$error || this.$v.form.$error) {
        this.$q.notify('Compilare tutti i dati obbligatori per firmare digitalmente il documento');
        return;
      }
      const res = await this.signPdfDocumentsCompany({
        personId: this.person.id,
        precontractualId: this.precontractual.id,
        mobilePhone: this.formatPhone(this.form.mobilePhone),
        email: this.form.email,
        signPlaceOtp: this.form.signPlaceOtp,
      });
      const changedPrecontractual = {
        signatureDocuments: res.item,
        signPlaceOtp: this.form.signPlaceOtp,
      };
      this.$emit('changePrecontractual', {
        data: changedPrecontractual,
        stepper: { name: 'otp', status: 'completed' },
      });
      this.nextStep();
    },
    async downloadPdf(documentId) {
      const store = { rootState: this.$store.state, commit: this.$store.commit };
      const res = await this.$utils.getApiCall(store, {
        url: `/v1/documents/${documentId}/presigned-download`,
      });
      await download(res.item.url, res.item.displayName);
    },
  },
  computed: {
    ...mapState({
      isFetching: (state) => state.error.isFetching,
    }),
  },
};
</script>

<style lang="stylus" scoped>
.text-h6
  margin-bottom 4px;
.text-p
  margin-bottom 4px
  font-size 12px
  font-style italic
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
