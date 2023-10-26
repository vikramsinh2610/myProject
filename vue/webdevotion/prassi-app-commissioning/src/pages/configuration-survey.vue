<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-configuration-surveys-list
      class="fill-available"
      ref="ConfigurationSurveysList"
      :surveys="surveys"
      :types="types"
      :is-fetching="isFetching"
      @loadMore="loadMoreSurveys"
      @searchSurvey="searchSurvey"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="$router.push(`/configuration/surveys/new-survey`)"
        icon="fa fa-plus-white"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiConfigurationSurveysList from '../components/configuration/prassi-configuration-surveys-list';

export default {
  name: 'ConfigurationSurvey',
  components: {
    PrassiConfigurationSurveysList,
  },
  data() {
    return {
      showAddDialog: false,
      survey: undefined,
      surveyToCopy: '',
    };
  },
  mounted() {
    this.resetSurveysFilter();
    this.resetSurveys();
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      surveys: (state) => state.configuration.surveys.items,
      types: (state) => state.configuration.types,
      last: (state) => state.configuration.surveys.lastRecord,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  methods: {
    ...mapActions({
      fetchSurveys: 'configuration/fetchSurveys',
    }),
    ...mapMutations({
      resetSurveys: 'configuration/resetSurveys',
      resetSurveysFilter: 'configuration/resetSurveysFilter',
      setSurveysSearchText: 'configuration/setSurveysSearchText',
    }),
    searchSurvey(search) {
      this.$utils.logobj('CONFIGURATION-SURVEYS', 'searchSurvey', search);
      this.setSurveysSearchText(search);
      this.resetSurveys();
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreSurveys({ index, done }) {
      if (this.last || this.error) {
        this.$refs.ConfigurationSurveysList.stopScrolling();
      } else {
        this.fetchSurveys().finally(() => done());
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
