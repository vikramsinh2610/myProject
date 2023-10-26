<template>
  <div class="column">
    <prassi-search-filter
      :search-label="$t('configurationHeader.searchSurveyFilter')"
      @changedSearch="$emit('searchSurvey', $event)"
    />

    <prassi-header-list :blocks="myHeader" class="p-ll-item" />

    <prassi-empty-list v-if="surveys.length === 0 && !isFetching" />

    <q-infinite-scroll
      id="scroll-target-id"
      class="fill-available"
      inline
      ref="infiniteScroll"
      @load="loadMore"
      :offset="250"
      scroll-target="#scroll-target-id"
    >
      <div style="height: 6px" />
      <div
        class="p-pl-promoter-item"
        v-for="survey in surveys"
        :key="survey._id"
        @click="$router.push(`/configuration/surveys/${survey._id}`)"
      >
        <prassi-body-list :id="survey._id" :blocks="myBody(survey)" />
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';
import PrassiSearchFilter from '../base/prassi-search-filter';

export default {
  name: 'PrassiConfigurationSurveyList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList, PrassiSearchFilter },
  updated() {
    this.resumeScrolling();
  },
  data() {
    return {
      myHeader: [
        {
          _id: '1',
          label: 'configurationHeader.surveyCreationDate',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '2',
          label: 'configurationHeader.surveyType',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 400,
          col: true,
        },
      ],
    };
  },
  props: {
    types: {
      type: Array,
      default: () => [],
    },
    surveys: {
      type: Array,
      default: () => [],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    stopScrolling() {
      this.$utils.log('CONFIGURATION-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('CONFIGURATION-LIST', 'RESUME SCROLLING');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('CONFIGURATION-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
    myBody(survey) {
      return [
        {
          _id: '1',
          label: this.$utils.isoToDisplayDate(survey.creationDate, this.$d.bind(this)),
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: '2',
          label: this.types.find((el) => el._id === survey.type).description,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 400,
          col: true,
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-pl-promoter-item
  cursor pointer
</style>
