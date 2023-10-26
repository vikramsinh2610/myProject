<template>
  <div class="column">
    <prassi-search-filter
      :search-label="$t('configurationHeader.searchQuestionFilter')"
      @changedSearch="$emit('searchQuestion', $event)"
    />

    <prassi-header-list :blocks="myHeader" class="p-ll-item" />

    <prassi-empty-list v-if="questions.length === 0 && !isFetching" />

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
        v-for="question in questions"
        :key="question._id"
        @click="$router.push(`/configuration/questions/${question._id}`)"
      >
        <prassi-body-list :id="question._id" :blocks="myBody(question)" />
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
  name: 'PrassiConfigurationQuestionList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList, PrassiSearchFilter },
  updated() {
    this.resumeScrolling();
  },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'configurationHeader.questionId',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
        },
        {
          _id: '1',
          label: 'configurationHeader.questionCreationDate',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
        {
          _id: '2',
          label: 'configurationHeader.questionText',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 250,
          col: true,
        },
        {
          _id: '3',
          label: 'configurationHeader.questionSection',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
        },
        {
          _id: '4',
          label: 'configurationHeader.questionMultiple',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
      ],
    };
  },
  props: {
    sections: {
      type: Array,
      default: () => [],
    },
    questions: {
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
    myBody(question) {
      return [
        {
          _id: '0',
          label: question._id,
          size: 'small',
          weight: 'normal',
          width: 150,
          type: '2rows',
        },
        {
          _id: '1',
          label: this.$utils.isoToDisplayDate(question.creationDate, this.$d.bind(this)),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '2',
          label: question.texts[0].text,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 250,
          col: true,
        },
        {
          _id: '3',
          label: this.sections.find((el) => el._id === question.section)
            ? this.sections.find((el) => el._id === question.section).description
            : 'Non trovata',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
        },
        {
          _id: '4',
          type: 'icon',
          color: question.multiple ? 'green' : 'red',
          icon: question.multiple ? 'fa fa-check' : 'fa fa-times',
          size: 'small',
          weight: 'normal',
          width: 100,
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
