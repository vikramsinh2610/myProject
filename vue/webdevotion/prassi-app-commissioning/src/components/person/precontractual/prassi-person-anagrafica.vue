<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section" v-if="!embedded">
        <div>
          {{ $t('personPrecontractual.personData') }}
        </div>
      </div>
      <div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.name"
            type="text"
            :readonly="readOnly"
            :label="$t('person.name')"
            :error-message="errorMessage.name"
            :error="$v.form.name.$error"
            @blur="$v.form.name.$touch"
          />
          <q-input
            class="col-5"
            v-model="form.surname"
            type="text"
            :readonly="readOnly"
            :label="$t('person.surname')"
            :error-message="errorMessage.surname"
            :error="$v.form.surname.$error"
            @blur="$v.form.surname.$touch"
          />
        </div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.email"
            type="email"
            :readonly="readOnly"
            :label="$t('person.email')"
            :error-message="$t('person.error')"
            :error="$v.form.email.$error"
            @blur="$v.form.email.$touch"
          />
        </div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.fixedPhone"
            type="text"
            :readonly="readOnly"
            :label="$t('person.fixedPhone')"
            :error-message="errorMessage.fixedPhone"
            :error="$v.form.fixedPhone.$error"
            @blur="$v.form.fixedPhone.$touch"
          />
          <q-input
            class="col-5"
            v-model="form.mobilePhone"
            type="text"
            :readonly="readOnly"
            :label="$t('person.mobilePhone')"
            :error-message="errorMessage.mobilePhone"
            :error="$v.form.mobilePhone.$error"
            @blur="$v.form.mobilePhone.$touch"
          />
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
import { email, required } from 'vuelidate/lib/validators';
import moment from 'moment';

export default {
  name: 'PrassiPersonAnagrafica',
  data() {
    return {
      form: {
        id: '',
        name: '',
        surname: '',
        companyName: '',
        fixedPhone: '',
        mobilePhone: '',
        email: '',
      },
      errorMessage: {
        mobilePhone: '',
        fixedPhone: '',
        name: '',
        surname: '',
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
        name: {
          checkName(value) {
            if (!/^(?!\s)(?![\S\s]*\s$)[ 'a-z]+$/i.test(value) && value !== '') {
              this.errorMessage.name = 'Ci sono dei caratteri speciali non ammessi.';
              return false;
            }
            if (value === '') {
              this.errorMessage.name = 'Il campo è richiesto';
              return false;
            }
            return true;
          },
        },
        surname: {
          checkSurname(value) {
            if (!/^(?!\s)(?![\S\s]*\s$)[ 'a-z]+$/i.test(value) && value !== '') {
              this.errorMessage.surname = 'Ci sono dei caratteri speciali non ammessi.';
              return false;
            }
            if (value === '') {
              this.errorMessage.surname = 'Il campo è richiesto';
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
            if (value === '') {
              this.errorMessage.mobilePhone = 'Il campo è richiesto';
              return false;
            }
            return true;
          },
        },
        fixedPhone: {
          checkFixedPhone(value) {
            if (!/^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,7}$/i.test(value) && value !== '') {
              this.errorMessage.fixedPhone = 'Il numero di telefono non è corretto.';
              return false;
            }
            this.errorMessage.fixedPhone = '';
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
        this.$utils.logobj('PRASSI-PERSON-CONTACT', 'person', person);
        if (!person.id) return;
        this.form.name = person.name;
        this.form.surname = person.surname;
        this.form.companyName = person.companyName;
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
      this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact');

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact', this.form);
        const birthday = this.person.birthDate
          ? moment(this.person.birthDate).format('DD/MM/YYYY')
          : '';
        const changedPerson = {
          ...this.person,
          birthDate: birthday ? moment.utc(birthday, 'DD-MM-YYYY').toISOString() : '',
          name: this.form.name,
          surname: this.form.surname,
          fixedPhone: this.form.fixedPhone,
          mobilePhone: this.form.mobilePhone,
          email: this.form.email,
        };
        this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact', changedPerson);
        this.$emit('changeData', { item: changedPerson });
        this.$emit('changePrecontractual', { stepper: { name: 'contact', status: 'completed' } });
      } else {
        this.$emit('changePrecontractual', { stepper: { name: 'contact', status: 'uncompleted' } });
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
