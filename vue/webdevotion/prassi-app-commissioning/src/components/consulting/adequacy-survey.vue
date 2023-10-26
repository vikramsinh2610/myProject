<template>
  <div class="row">
    <survey-form
      v-if="ready"
      :sections="sections"
      :survey="survey"
      :save-survey="saveSurvey"
      :submit-survey="saveSurveyAndRedirect"
      :customer-id="customerId"
      :readonly="readonly"
    />
  </div>
</template>

<script>
/* eslint-disable no-restricted-syntax, no-continue, sonarjs/cognitive-complexity
 */
import { mapState, mapActions, mapMutations } from 'vuex';
import SurveyForm from '../person/survey-form';

export default {
  name: 'ConsultingSurveyAdequacy',

  components: { SurveyForm },

  props: {
    onSave: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      inquiryResult: { questions: [] },
      readonly: false,
      ready: false,
    };
  },

  async mounted() {
    // the current survey is inquiry
    // we copy it so that we can later pre-fill questions to the adequacy survey
    this.inquiryResult = { ...this.survey };

    this.resetSurvey();

    const surveys = {
      fisica: '9972120f-ba8c-4586-9ff1-26696645a232',
      giuridica: 'dae8146a-59c5-414d-85ce-249ecd27d3b2',
    };

    if (this.resultId) {
      this.readonly = true;
      await this.fetchSingleSurveyResult({ resultId: this.resultId });
    } else {
      const surveyId = this.isCompany ? surveys.giuridica : surveys.fisica;
      await this.fetchSurvey({ surveyId });
    }

    await this.fetchSections();

    this.copyAnswersFromInquiry();

    this.ready = true;
  },

  methods: {
    ...mapActions({
      fetchSurvey: 'surveys/fetchSurvey',
      fetchSingleSurveyResult: 'surveys/fetchSingleSurveyResult',
      fetchSections: 'surveys/fetchSections',
      saveSurveyResult: 'surveys/saveSurvey',
    }),

    ...mapMutations({
      resetSurvey: 'surveys/resetSurvey',
      setAdequacySurveyResultId: 'consulting/setAdequacySurveyResultId',
    }),

    async saveSurvey() {
      // don't store the survey until the very end
    },

    async saveSurveyAndRedirect(data) {
      const res = await this.saveSurveyResult({ ...data, resultId: this.resultId });

      if (!this.resultId) {
        this.setAdequacySurveyResultId(res.item._id);
      }

      if (!res.item.filled) {
        this.$q.notify({
          message: `L'adeguatezza deve essere completata per poter continuare`,
          type: 'warning',
          timeout: 2000,
        });
        return;
      }

      this.onSave();
    },

    copyAnswersFromInquiry() {
      /*
        '04-ad-carico': '04-ad-carico', // PERSONE A CARICO
        '01-08-settore-attivita': '01-08-settore-attivita', // SETTORE ATTIVITA'
        'job-situation': 'job-situation', // STATO OCCUPAZIONALE
        '02-10-ultimo-reddito': '02-10-ultimo-reddito', // ULTIMO REDDITO ANNUO
        // per persone giuridiche:
        'g-06-fatturato': '', // FATTURATO
      */

      const questionsToCopy = this.isCompany
        ? {
            '06-18-patrimonio': 'g-07-patrimonio', // PATRIMONIO DISPONIBILE ALL'INVESTIMENTO
          }
        : {
            '06-18-patrimonio': '09-ad-patrimonio', // PATRIMONIO DISPONIBILE ALL'INVESTIMENTO
          };

      for (const q of this.inquiryResult.questions) {
        let questionId = q._id;

        if (questionsToCopy[q._id]) questionId = questionsToCopy[q._id];

        // check that adequacy contains this question
        const adequacyQuestion = this.survey.questions.find((adQ) => adQ._id === questionId);
        if (!adequacyQuestion) continue;

        // text responses
        if (q.responses.length === 1) {
          adequacyQuestion.responses[0].typeValue = q.responses[0].typeValue;
        }

        // selection responses
        // use response index instead of _id because some responses have different ids across surveys
        let index = 0;

        for (const r of q.responses) {
          if (r.selected) {
            const adequacyResponse = adequacyQuestion.responses[index];
            if (adequacyResponse) adequacyResponse.selected = true;
          }

          index += 1;
        }
      }
    },
  },

  computed: {
    ...mapState({
      survey: (state) => state.surveys.survey,
      sections: (state) => state.surveys.sections,
      consulting: (state) => state.consulting.result,
      adequacyResultId: (state) => state.consulting.adequacyResultId,
      isCompany: (state) => state.dossiers.customer.isCompany,
      isFetching: (state) => state.error.isFetching,
    }),
    customerId() {
      return this.$route.params.id;
    },
    resultId() {
      return this.consulting?.adequacy?.resultId || this.adequacyResultId;
    },
  },
};
</script>

<style lang="stylus" scoped></style>
