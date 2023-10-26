<template>
  <survey-form
    v-if="ready"
    :sections="sections"
    :survey="survey"
    :save-survey="saveSurvey"
    :submit-survey="saveSurveyAndRedirect"
    :customer-id="customerId"
  />
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import SurveyForm from '../components/person/survey-form';

export default {
  name: 'PersonDetailSurveys',

  components: { SurveyForm },

  data() {
    return {
      ready: false,

      // New survey wont' have an id, but when "Next" button is clicked,
      // we're still on the same page and need to set the survey id so
      // that we keep editing the same item
      resultId: undefined,
    };
  },

  async mounted() {
    this.resetSurvey();

    const { surveyId } = this.$route.params;
    await this.fetchSurvey({ surveyId });
    await this.fetchSections();
    this.ready = true;
  },

  methods: {
    ...mapActions({
      fetchSurvey: 'surveys/fetchSurvey',
      fetchSections: 'surveys/fetchSections',
      saveSurveyResult: 'surveys/saveSurvey',
    }),

    ...mapMutations({
      resetSurvey: 'surveys/resetSurvey',
    }),

    async saveSurvey(data) {
      const res = await this.saveSurveyResult({ ...data, resultId: this.resultId });
      if (!this.resultId) {
        this.resultId = res.item._id;
      }
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
  },
};
</script>

<style lang="stylus" scoped></style>
