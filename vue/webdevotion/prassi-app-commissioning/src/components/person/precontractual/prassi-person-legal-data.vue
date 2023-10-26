<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section" v-if="!embedded">
        <div>
          {{ $t('personPrecontractual.legalData') }}
        </div>
      </div>
      <div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-12"
            v-if="person.isCompany"
            v-model="form.companyName"
            :readonly="readOnly"
            type="text"
            :label="$t('customer.companyName')"
            :error-message="errorMessage.companyName"
            :error="$v.form.companyName.$error"
            @blur="$v.form.companyName.$touch"
            @keyup.enter="saveData"
          />
        </div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-12"
            v-model="form.fiscalCode"
            :readonly="readOnly"
            type="text"
            :label="$t('personPrecontractual.fiscalCodeOrVAT')"
            :error-message="$t('person.error')"
            :error="$v.form.fiscalCode.$error"
            @blur="$v.form.fiscalCode.$touch"
            @keyup.enter="saveData"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.email"
            :readonly="readOnly"
            type="email"
            :label="$t('personPrecontractual.emailCompany')"
            :error-message="$t('person.error')"
            :error="$v.form.email.$error"
            @blur="$v.form.email.$touch"
          />
        </div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.fixedPhone"
            :readonly="readOnly"
            type="text"
            :label="$t('personPrecontractual.fixedPhoneCompany')"
            :error-message="errorMessage.fixedPhone"
            :error="$v.form.fixedPhone.$error"
            @blur="$v.form.fixedPhone.$touch"
          />
          <q-input
            class="col-5"
            v-model="form.mobilePhone"
            :readonly="readOnly"
            type="text"
            :label="$t('personPrecontractual.mobilePhoneCompany')"
            :error-message="errorMessage.mobilePhone"
            :error="$v.form.mobilePhone.$error"
            @blur="$v.form.mobilePhone.$touch"
          />
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
import { email, required } from 'vuelidate/lib/validators';
import moment from 'moment';

export default {
  name: 'PrassiPersonLegalData',
  data() {
    return {
      form: {
        id: '',
        name: '',
        surname: '',
        companyName: '',
        fiscalCode: '',
        fixedPhone: '',
        mobilePhone: '',
        email: '',
        linkedIn: '',
        facebook: '',
        twitter: '',
      },
      errorMessage: {
        mobilePhone: '',
        fixedPhone: '',
        companyName: '',
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
    readOnly: {
      type: Boolean,
      default: true,
    },
  },
  validations() {
    return {
      form: {
        fiscalCode: {
          checkFiscalCode: (value) => {
            if (this.$utils.checkFiscalCode(value)) return true;
            if (this.$utils.checkVatNumber(value)) return true;
            return false;
          },
        },
        companyName: {
          checkCompanyName(value) {
            if (!/^(?!\s)(?![\S\s]*\s$)[\d &'.@a-z-]+$/i.test(value) && value !== '') {
              this.errorMessage.companyName = 'Ci sono dei caratteri speciali non ammessi.';
              return false;
            }
            if (value === '') {
              this.errorMessage.companyName = 'Il campo è richiesto';
              return false;
            }
            return true;
          },
        },
        email: { required, email },
        mobilePhone: {
          checkPhone(value) {
            if (!/^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,7}$/i.test(value) && value !== '') {
              this.errorMessage.mobilePhone = 'Il numero di cellulare non è corretto.';
              return false;
            }
            this.errorMessage.mobilePhone = '';
            return true;
          },
        },
        fixedPhone: {
          checkFixedPhone(value) {
            if (!/^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,7}$/i.test(value) && value !== '') {
              this.errorMessage.fixedPhone = 'Il numero di telefono non è corretto.';
              return false;
            }
            if (value === '') {
              this.errorMessage.fixedPhone = 'Il campo è richiesto';
              return false;
            }
            return true;
          },
        },
      },
    };
  },
  watch: {
    person: {
      immediate: true,
      handler(person) {
        this.$utils.logobj('PRASSI-PERSON-LEGAL-DATA', 'person', person);
        if (!person.id) return;
        this.form.name = person.name;
        this.form.surname = person.surname;
        this.form.companyName = person.companyName;
        this.form.fiscalCode = person.fiscalCode;
        this.form.fixedPhone = person.fixedPhone;
        this.form.mobilePhone = person.mobilePhone;
        this.form.email = person.email;
        this.form.linkedIn = person.linkedIn;
        this.form.facebook = person.facebook;
        this.form.twitter = person.twitter;
        this.form.id = person.id;
      },
    },
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
      this.$utils.logobj('PRASSI-PERSON-LEGAL-DATA', 'submit person legal', this.$v.form);

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-PERSON-LEGAL-DATA', 'submit person legal', this.$v.form);
        const birthday = this.person.birthDate
          ? moment(this.person.birthDate).format('DD/MM/YYYY')
          : '';
        const changedPerson = {
          ...this.person,
          name: this.form.name,
          surname: this.form.surname,
          companyName: this.form.companyName,
          fiscalCode: this.form.fiscalCode,
          fixedPhone: this.form.fixedPhone,
          birthDate: birthday ? moment.utc(birthday, 'DD-MM-YYYY').toISOString() : '',
          mobilePhone: this.form.mobilePhone,
          email: this.form.email,
          linkedIn: this.form.linkedIn,
          facebook: this.form.facebook,
          twitter: this.form.twitter,
        };
        this.$utils.logobj('PRASSI-PERSON-LEGAL-DATA', 'submit person legal', changedPerson);
        this.$emit('changeData', { item: changedPerson });
        this.$emit('changePrecontractual', {
          stepper: { name: 'legalContact', status: 'completed' },
        });
      } else {
        this.$emit('changePrecontractual', {
          stepper: { name: 'legalContact', status: 'uncompleted' },
        });
        this.$q.notify(this.$t('promoterInsertLetter.cantSave'));
      }
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
