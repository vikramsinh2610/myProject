<template>
  <div class="column fill-available">
    <prassi-header-list :blocks="myHeader" class="p-ll-item" />

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
        @click="$router.push(`/promoters/${promoter._id}/company`)"
      >
        <prassi-body-list :blocks="myBody(promoter)" />
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiPromoterList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
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
        {
          _id: '3',
          label: 'promoterHeader.approved',
          sublabel: 'promoterHeader.enable',
          size: 'small',
          weight: 'light',
          width: 120,
          sortable: () => {
            this.$emit('sort', 'approved');
          },
        },
        {
          _id: '4',
          label: 'promoterHeader.dateInserted',
          sublabel: 'promoterHeader.dateGone',
          size: 'small',
          weight: 'light',
          width: 120,
        },
        {
          _id: '5',
          label: 'promoterHeader.lastLogin',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
          sortable: () => {
            this.$emit('sort', 'lastLoginDate');
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
      this.$utils.log('PROMOTERS-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('PROMOTERS-LIST', 'RESUME SCROLLING');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('PROMOTERS-LIST', 'FORCE SCROLLING');
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
        {
          _id: '3',
          type: 'icon',
          icon: promoter.approved ? 'fa fa-thumbs-up' : 'fa fa-thumbs-down',
          color: promoter.approved ? 'green' : 'red',
          width: 45,
        },
        {
          _id: '4',
          type: 'icon',
          color: promoter.enabled ? 'green' : 'red',
          width: 50,
        },
        {
          _id: '5',
          label: promoter.networkEnterDate ? this.$d(new Date(promoter.networkEnterDate)) : '',
          sublabel: promoter.networkExitDate ? this.$d(new Date(promoter.networkExitDate)) : '',
          size: 'small',
          weight: 'normal',
          width: 120,
          type: '2rows',
        },
        {
          _id: '6',
          label: promoter.lastLoginDate ? this.$d(new Date(promoter.lastLoginDate)) : '',
          size: 'small',
          weight: 'normal',
          width: 100,
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
