<template>
  <div>
    <div class="row justify-between q-my-xs">
      <q-input
        class="col-5"
        v-model="promoter.name"
        type="text"
        :label="$t('person.name')"
        :error-message="$t('person.error')"
        :error="$v.promoter.name.$error"
        @blur="$v.promoter.name.$touch"
        :readonly="hasSignature || promoterLocked.name"
      />
      <q-input
        class="col-5"
        v-model="promoter.surname"
        type="text"
        :label="$t('person.surname')"
        :error-message="$t('person.error')"
        :error="$v.promoter.surname.$error"
        @blur="$v.promoter.surname.$touch"
        :readonly="hasSignature || promoterLocked.surname"
      />
    </div>

    <div class="row justify-between q-my-xs">
      <q-input
        class="col-5"
        v-model="promoter.ivassCode"
        type="text"
        :label="$t('promoterCompany.ivass')"
        :error-message="$t('person.error')"
        :error="$v.promoter.ivassCode.$error"
        @blur="$v.promoter.ivassCode.$touch"
        :readonly="hasSignature || promoterLocked.ivassCode"
      />

      <q-input
        class="cols-5 p-pc-date"
        v-model="promoter.ruiSignupDate"
        mask="##-##-####"
        :label="$t('promoterCompany.ruiSignupDate')"
        :readonly="hasSignature || promoterLocked.ruiSignupDate"
      >
        <template #append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
              <q-date
                v-model="promoter.ruiSignupDate"
                mask="DD-MM-YYYY"
                :readonly="hasSignature || promoterLocked.ruiSignupDate"
                @input="() => $refs.qDateProxy2.hide()"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>

    <div class="row justify-between q-my-xs">
      <q-input
        class="col-5"
        v-model="promoter.email"
        type="email"
        :label="$t('person.email')"
        :error-message="$t('person.error')"
        :error="$v.promoter.email.$error"
        @blur="$v.promoter.email.$touch"
        :readonly="hasSignature || promoterLocked.email"
      />
      <q-input
        class="col-5"
        v-model="promoter.mobilePhone"
        type="text"
        :label="$t('person.mobilePhone')"
        :error-message="promoter.errorMessage.mobilePhone"
        :error="$v.promoter.mobilePhone.$error"
        @blur="$v.promoter.mobilePhone.$touch"
        :readonly="hasSignature || promoterLocked.mobilePhone"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import moment from 'moment';

const getIvassFromSurvey = (results) => {
  const onboarding = results.find((r) => r.type === 'onboarding');
  if (!onboarding) return {};

  const question = onboarding.questions.find((q) => q._id === 'on-rui-number');
  if (!question) return {};

  const [ivassCode, ruiSignupDate] = question.responses;

  return {
    ivassCode: ivassCode.typeValue,
    ruiSignupDate: ruiSignupDate.typeValue
      ? moment(ruiSignupDate.typeValue).format('DD-MM-YYYY')
      : '',
  };
};

export default {
  name: 'ConsultingPromoterInfo',

  components: {},

  props: {
    nextCallback: {
      type: Function,
      default: undefined,
    },
  },

  data() {
    return {
      promoter: {
        name: '',
        surname: '',
        mobilePhone: '',
        email: '',
        ivassCode: '',
        ruiSignupDate: '',
        errorMessage: {
          mobilePhone: '',
        },
      },

      promoterLocked: {
        name: false,
        surname: false,
        mobilePhone: false,
        email: false,
        ruiSignupDate: false,
        ivassCode: false,
      },
    };
  },

  async mounted() {
    const { promoter } = this.consulting;

    let info = {};
    if (this.survey.signature?.promoter) {
      info = this.survey.signature?.promoter.info;
    }

    await this.fetchPromoter(promoter.promoterId);
    await this.fetchSurveyResults({ userId: this.promoterData._id, type: 'onboarding' });

    const onboarding = getIvassFromSurvey(this.surveyResults);

    this.$set(this.promoter, 'name', promoter.name || info.name);
    this.$set(this.promoter, 'surname', promoter.surname || info.surname);
    this.$set(this.promoter, 'email', promoter.email || info.email);
    this.$set(this.promoter, 'mobilePhone', promoter.mobilePhone || info.mobilePhone);

    this.$set(this.promoter, 'ivassCode', promoter.ivassCode || onboarding.ivassCode);
    this.$set(this.promoter, 'ruiSignupDate', promoter.ruiSignupDate || onboarding.ruiSignupDate);

    if (this.promoter.name) this.promoterLocked.name = true;
    if (this.promoter.surname) this.promoterLocked.surname = true;
    if (this.promoter.email) this.promoterLocked.email = true;
    if (this.promoter.mobilePhone) this.promoterLocked.mobilePhone = true;
    if (this.promoter.ivassCode) this.promoterLocked.ivassCode = true;
    if (this.promoter.ruiSignupDate) this.promoterLocked.ruiSignupDate = true;
  },

  validations() {
    return {
      promoter: {
        name: { required },
        surname: { required },
        email: { required, email },
        mobilePhone: {
          // eslint-disable-next-line sonarjs/no-identical-functions
          checkPhone(value) {
            if (!/^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,7}$/i.test(value) && value !== '') {
              this.promoter.errorMessage.mobilePhone = 'Il numero di cellulare non è corretto.';
              return false;
            }
            if (value === '') {
              this.promoter.errorMessage.mobilePhone = 'Il campo è richiesto';
              return false;
            }
            return true;
          },
        },
        ivassCode: { required },
        ruiSignupDate: { required },
      },
      promoterLocked: {
        name: false,
        surname: false,
        mobilePhone: false,
        email: false,
      },
    };
  },

  computed: {
    ...mapState({
      survey: (state) => state.surveys.survey,
      consulting: (state) => state.consulting.result,
      surveyResults: (state) => state.surveys.results,
      promoterData: (state) => state.promoters.promoter,
      isFetching: (state) => state.error.isFetching,
    }),

    hasSignature() {
      return !!this.consulting?.signature;
    },
  },

  methods: {
    ...mapActions({
      fetchPromoter: 'promoters/fetchPromoter',
      fetchSurveyResults: 'surveys/fetchSurveyResults',
    }),

    ...mapMutations({}),

    triggerFromParent() {
      this.$v.promoter.$touch();
      return { data: this.promoter, valid: !this.$v.promoter.$error };
    },
  },
};
</script>
