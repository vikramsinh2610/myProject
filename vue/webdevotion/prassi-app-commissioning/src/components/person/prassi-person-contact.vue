<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section" v-if="!embedded">{{ $t('person.contact') }}</div>
      <div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-if="!person.isCompany"
            v-model="form.name"
            type="text"
            :label="$t('person.name')"
            :error-message="$t('person.error')"
            :error="$v.form.name.$error"
            :readonly="$user.roleID < 7"
            @blur="$v.form.name.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-if="!person.isCompany"
            v-model="form.surname"
            type="text"
            :label="$t('person.surname')"
            :error-message="$t('person.error')"
            :error="$v.form.surname.$error"
            :readonly="$user.roleID < 7"
            @blur="$v.form.surname.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="col-12"
            v-if="person.isCompany"
            v-model="form.companyName"
            type="text"
            :label="$t('person.companyName')"
            :error-message="$t('person.error')"
            :error="$v.form.companyName.$error"
            :readonly="$user.roleID < 7"
            @blur="$v.form.companyName.$touch"
            @keyup.enter="submit"
          />
        </div>

        <q-separator class="q-my-lg" />

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="form.email"
            type="email"
            :label="$t('person.email')"
            :error-message="$t('person.error')"
            :error="$v.form.email.$error"
            @blur="$v.form.email.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-model="form.fixedPhone"
            type="text"
            :label="$t('person.fixedPhone')"
            :error-message="errorMessage.fixedPhone"
            :error="$v.form.fixedPhone.$error"
            @blur="$v.form.fixedPhone.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-model="form.mobilePhone"
            type="text"
            :label="$t('person.mobilePhone')"
            :error-message="errorMessage.mobilePhone"
            :error="$v.form.mobilePhone.$error"
            :readonly="$user.roleID < 7 && !person.isCompany"
            @blur="$v.form.mobilePhone.$touch"
            @keyup.enter="submit"
          />
        </div>

        <q-separator class="q-my-lg" v-if="!embedded" />

        <div class="row justify-between q-my-xs" v-if="!embedded">
          <q-input
            class="col-5"
            v-model="form.linkedIn"
            type="text"
            :label="$t('person.linkedIn')"
            :error-message="$t('person.error')"
            :error="$v.form.linkedIn.$error"
            @blur="$v.form.linkedIn.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-model="form.facebook"
            type="text"
            :label="$t('person.facebook')"
            :error-message="$t('person.error')"
            :error="$v.form.facebook.$error"
            @blur="$v.form.facebook.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="col-5"
            v-model="form.twitter"
            type="text"
            :label="$t('person.twitter')"
            :error-message="$t('person.error')"
            :error="$v.form.twitter.$error"
            @blur="$v.form.twitter.$touch"
            @keyup.enter="submit"
          />
        </div>
      </div>
      <div class="row justify-between q-my-xs" v-if="!embedded">
        <prassi-standard-button
          class="q-mb-lg"
          :loading="isFetching"
          :label="$t('promoterCompany.save')"
          @click="submit"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { requiredUnless, email } from 'vuelidate/lib/validators';

export default {
  name: 'PrassiPersonContact',
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
        linkedIn: '',
        facebook: '',
        twitter: '',
      },
      errorMessage: {
        mobilePhone: '',
        fixedPhone: '',
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
  },
  validations() {
    return {
      form: {
        name: {
          requiredIf: requiredUnless(function () {
            if (!this.required) return false;
            return this.person.isCompany;
          }),
        },
        surname: {
          requiredIf: requiredUnless(function () {
            if (!this.required) return false;
            return this.person.isCompany;
          }),
        },
        companyName: {
          requiredIf: requiredUnless(function () {
            if (!this.required) return false;
            return !this.person.isCompany;
          }),
        },
        linkedIn: {},
        facebook: {},
        twitter: {},
        email: {
          email,
          requiredIf: requiredUnless(function () {
            if (!this.required) return false;
            return this.form.fixedPhone !== '' || this.form.mobilePhone !== '';
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
      if (this.letter.status === 'wip' && this.$user.roleID >= 7) {
        this.submit();
      } else {
        this.$emit('nextStep');
      }
    },
    submit() {
      this.$v.form.$touch();
      this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact');

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact', this.form);
        const changedPerson = {
          ...this.person,
          name: this.form.name,
          surname: this.form.surname,
          companyName: this.form.companyName,
          fixedPhone: this.form.fixedPhone,
          mobilePhone: this.form.mobilePhone,
          email: this.form.email,
          linkedIn: this.form.linkedIn,
          facebook: this.form.facebook,
          twitter: this.form.twitter,
        };
        this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact', changedPerson);
        this.$emit('changeData', { item: changedPerson });
      } else {
        this.$q.notify(this.$t('promoterInsertLetter.cantSave'));
      }
    },

    triggerFromParent() {
      this.$v.form.$touch();
      const valid = !this.$v.form.$error;
      this.$v.form.$reset();

      return { data: this.form, valid };
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
