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
import { mapState, mapActions, mapMutations } from 'vuex';
import SurveyForm from '../components/person/survey-form';

export default {
  name: 'PersonDetailSurveyResultShow',

  components: { SurveyForm },

  data() {
    return {
      ready: false,
      readonly: true,
    };
  },

  async mounted() {
    this.resetSurvey();

    const { resultId } = this.$route.params;
    await this.fetchSingleSurveyResult({ resultId });
    await this.fetchSections();

    if (this.survey.state === 'draft' && !this.survey.signature?.procedureCompleted) {
      this.readonly = false;
    }

    this.ready = true;
  },

  methods: {
    ...mapActions({
      fetchSingleSurveyResult: 'surveys/fetchSingleSurveyResult',
      fetchSections: 'surveys/fetchSections',
      saveSurveyResult: 'surveys/saveSurvey',
    }),

    ...mapMutations({
      resetSurvey: 'surveys/resetSurvey',
    }),

    async saveSurvey(data) {
      await this.saveSurveyResult({ ...data, resultId: this.resultId });
    },

    async saveSurveyAndRedirect(data) {
      await this.saveSurveyResult({ ...data, resultId: this.resultId });
      this.$router.push(`/persons/${this.customerId}/survey-results`);
    },
  },

  computed: {
    ...mapState({
      survey: (state) => state.surveys.survey,
      sections: (state) => state.surveys.sections,
      isFetching: (state) => state.error.isFetching,
    }),
    customerId() {
      return this.$route.params.id;
    },
    resultId() {
      return this.$route.params.resultId;
    },
  },
};
</script>

<style lang="stylus" scoped></style>
