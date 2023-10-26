<template>
  <div>
    <div class="column fill-available">
      <div v-if="!isFetching && !results.length">Nessun questionario trovato.</div>
      <div
        class="p-pl-promoter-item"
        v-for="result in results"
        :key="result._id"
        @click="detailClick(result)"
      >
        <prassi-body-list
          menu
          menu-icon="fa fa-address-card"
          :blocks="myBody(result)"
          @menuClick="detailClick(result)"
        />
      </div>
    </div>

    <q-dialog v-model="dialogOpen">
      <q-card style="max-width: 800px; width: 800px">
        <q-card-section class="bg-secondary text-white q-mb-md">
          <div class="text-h6">{{ $t('configurationHeader.searchSurveyFilter') }}</div>
        </q-card-section>
        <q-card-section>
          <div>
            <q-select
              filled
              v-model="selectedSurveyType"
              use-input
              hide-selected
              fill-input
              input-debounce="700"
              :label="$t('configurationHeader.surveyType')"
              :options="surveyTypes"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey"> No results </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </q-card-section>

        <q-card-section>
          <prassi-standard-button :label="$t('default.okButton')" @click="newSurveyClick" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]" class="first-menu">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="showDialog"
        icon="fa fa-plus-white"
      />
    </q-page-sticky>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import PrassiBodyList from '../components/base/prassi-body-list';

// `50ad3529-7fe2-4841-b734-9cf564f309f4`, // inquiry
// `3a70a1d8-8e09-4bb4-9f13-34cb823846f1`, // coherence
// eslint-disable-next-line no-unused-vars
// const INQUIRY_SURVEY_ID = '50ad3529-7fe2-4841-b734-9cf564f309f4';
// const ONBOARDING_SURVEY_ID = '5fcffc86-8970-4da5-b3e1-bc130e072482';

export default {
  name: 'PersonDetailSurveyResults',
  components: { PrassiBodyList },

  data() {
    return {
      dialogOpen: false,
      selectedSurveyType: undefined,
      surveyTypes: [],
    };
  },

  async mounted() {
    const customerId = this.$route.params.id;
    await this.fetchSurveyResults({ customerId });
  },

  methods: {
    ...mapActions({
      fetchSurveys: 'configuration/fetchSurveys',
      fetchSurveyResults: 'surveys/fetchSurveyResults',
    }),
    ...mapMutations({
      resetSurveys: 'configuration/resetSurveys',
    }),

    detailClick(result) {
      this.$router.push(`survey-results/${result._id}`);
    },

    myBody(result) {
      return [
        {
          _id: '0',
          label: result.codeSurveyResult,
          sublabel: result.state,
          size: 'small',
          weight: 'normal',
          width: 274,
          type: '2rows',
          col: true,
        },
        {
          _id: '1',
          label: result.type,
          size: 'small',
          weight: 'normal',
          width: 274,
          type: '2rows',
          col: true,
        },
      ];
    },

    async showDialog() {
      const mapping = this.surveyTypeMapping;

      this.resetSurveys();
      const res = await this.fetchSurveys();

      this.surveyTypes = res.items.map((item) => ({
        value: item._id,
        label: mapping.find((el) => el._id === item.type).description,
      }));
      this.dialogOpen = true;
    },

    newSurveyClick() {
      this.$router.push(`surveys/${this.selectedSurveyType.value}`);
    },
  },
  computed: {
    ...mapState({
      results: (state) => state.surveys.results,
      surveyTypeMapping: (state) => state.configuration.types,
      isFetching: (state) => state.error.isFetching,
    }),
  },
};
</script>

<style lang="stylus" scoped>
.first-menu
  bottom 70px
</style>
