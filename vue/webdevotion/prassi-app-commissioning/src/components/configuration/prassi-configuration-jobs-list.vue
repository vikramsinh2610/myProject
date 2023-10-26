<template>
  <div class="column">
    <prassi-search-filter
      :search-label="$t('filterPromoterBlock.searchPromoter')"
      @changedSearch="$emit('searchPromoter', $event)"
    />

    <prassi-header-list :blocks="myHeader" class="p-ll-item" placeholder />

    <prassi-empty-list v-if="promoters.length === 0 && !isFetching" />

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
        v-for="promoter in promoters"
        :key="promoter._id"
        @click="$router.push(`/configuration/jobs/${promoter._id}`)"
      >
        <prassi-body-list :id="promoter._id" :blocks="myBody(promoter)" />
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
  name: 'PrassiConfigurationJobsList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList, PrassiSearchFilter },
  updated() {
    this.resumeScrolling();
  },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'promoterHeader.displayName',
          sublabel: 'promoterHeader.area',
          size: 'small',
          weight: 'normal',
          width: 274,
          sortable: () => {
            this.$emit('sort', 'surname');
          },
        },
        {
          _id: '1',
          label: 'promoterHeader.username',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 254,
          sortable: () => {
            this.$emit('sort', 'username');
          },
        },
        {
          _id: '2',
          label: 'promoterHeader.role',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 180,
          sortable: () => {
            this.$emit('sort', 'roleId');
          },
        },
      ],
    };
  },
  props: {
    promoters: {
      type: Array,
      default: () => [],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    stopScrolling() {
      this.$utils.log('CONFIGURATION-PROMOTERS-JOBS-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('CONFIGURATION-PROMOTERS-JOBS-LIST', 'RESUME SCROLLING');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('CONFIGURATION-PROMOTERS-JOBS-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
    myBody(promoter) {
      return [
        {
          _id: '0',
          label: promoter.displayName,
          sublabel: promoter.displayHierarchy,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, promoter.roleId),
          size: 'small',
          weight: 'normal',
          width: 274,
          type: '2rows',
        },
        {
          _id: '1',
          label: promoter.username,
          size: 'small',
          weight: 'normal',
          width: 254,
          type: '2rows',
        },
        {
          _id: '2',
          label: this.$utils.getRoleName(this.roles, promoter.roleId),
          size: 'small',
          weight: 'normal',
          width: 180,
          type: '2rows',
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
