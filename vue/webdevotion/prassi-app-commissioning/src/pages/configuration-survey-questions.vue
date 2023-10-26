<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-configuration-question-list
      class="fill-available"
      ref="ConfigurationQuestionsList"
      :questions="questions"
      :sections="sections"
      :is-fetching="isFetching"
      @loadMore="loadMoreQuestions"
      @searchQuestion="searchQuestion"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="$router.push(`/configuration/questions/new-question`)"
        icon="fa fa-plus-white"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiConfigurationQuestionList from '../components/configuration/prassi-configuration-question-list';

export default {
  name: 'ConfigurationSurveyQuestions',
  components: {
    PrassiConfigurationQuestionList,
  },
  data() {
    return {
      showAddDialog: false,
      question: undefined,
      questionToCopy: '',
    };
  },
  mounted() {
    this.resetQuestionsFilter();
    this.resetQuestions();
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      questions: (state) => state.configuration.questions.items,
      last: (state) => state.configuration.questions.lastRecord,
      isFetching: (state) => state.error.isFetching,
      sections: (state) => state.configuration.sections,
    }),
  },
  methods: {
    ...mapActions({
      fetchQuestions: 'configuration/fetchQuestions',
    }),
    ...mapMutations({
      resetQuestions: 'configuration/resetQuestions',
      resetQuestionsFilter: 'configuration/resetQuestionsFilter',
      setQuestionsSearchText: 'configuration/setQuestionsSearchText',
    }),
    searchQuestion(search) {
      this.$utils.logobj('CONFIGURATION-QUESTIONS', 'searchQuestion', search);
      this.setQuestionsSearchText(search);
      this.resetQuestions();
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreQuestions({ index, done }) {
      if (this.last || this.error) {
        this.$refs.ConfigurationQuestionsList.stopScrolling();
      } else {
        this.fetchQuestions().finally(() => done());
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 960px
  max-width fit-content
.center-spinner
  display block
  margin auto
</style>
