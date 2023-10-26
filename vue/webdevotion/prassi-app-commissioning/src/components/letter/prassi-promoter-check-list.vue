<template>
  <div class="column">
    <prassi-header-list
      checkbox
      checkbox-visible
      :blocks="myHeader"
      @changedChecked="changeCheckedAll"
    />

    <prassi-empty-list v-if="loadedPromoters.length === 0 && !isFetching" />

    <q-infinite-scroll
      id="scroll-target-id-promo-checklist"
      class="fill-available"
      style="overflow: auto"
      inline
      ref="infiniteScroll"
      @load="loadMore"
      :offset="500"
      scroll-target="#scroll-target-id-promo-checklist"
    >
      <div style="height: 6px" />
      <div class="p-pl-promoter-item" v-for="item in loadedPromoters" :key="item._id">
        <prassi-body-list
          checkbox
          :checked="item.checked"
          :blocks="myBody(item)"
          :id="item._id"
          @changedChecked="$emit('changeChecked', $event)"
        />
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiPromoterCheckList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      loadedPromoters: [],
      skip: 0,
      is_fetching: true,
      myHeader: [
        {
          _id: '0',
          label: 'promoterHeader.displayName',
          sublabel: 'promoterHeader.area',
          size: 'small',
          weight: 'normal',
          width: 274,
          col: true,
        },
        {
          _id: '1',
          label: 'promoterHeader.username',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 254,
        },
        {
          _id: '2',
          label: 'promoterHeader.role',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 180,
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
  watch: {
    promoters: {
      immediate: true,
      handler() {
        this.$utils.log('PROMOTER-CHECK-LIST', 'promoters');
        this.loadedPromoters = [];
        this.skip = 0;
        this.is_fetching = true;
        this.$nextTick().then(() => {
          this.resumeScrolling();
          this.forceScrolling();
        });
      },
    },
  },
  methods: {
    changeCheckedAll($event) {
      this.loadedPromoters.forEach((el) => {
        el.checked = $event;
      });
      this.$emit('changeCheckedAll', $event);
    },
    resumeScrolling() {
      this.$utils.log('PROMOTER-CHECK-LIST', 'RESUME SCROLLING');
      if (typeof this.$refs.infiniteScroll !== 'undefined') {
        this.$utils.log('PROMOTER-CHECK-LIST', 'RESUME');
        this.$refs.infiniteScroll.resume();
      }
    },
    forceScrolling() {
      this.$utils.log('CPROMOTER-CHECK-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    // eslint-disable-next-line no-unused-vars
    loadMore(index, done) {
      this.$utils.logobj('PROMOTER-CHECK-LIST', 'LOAD MORE index', index);
      const items = this.promoters.slice(this.skip, this.skip + 20);

      if (items && items.length !== 0) {
        this.skip += 20;
        this.loadedPromoters = [...this.loadedPromoters, ...items];
        this.$nextTick().then(() => {
          this.$utils.logobj('PROMOTER-CHECK-LIST', 'LOAD MORE DONE', index);
          done();
        });
      } else {
        this.$utils.logobj('PROMOTER-CHECK-LIST', 'LOAD MORE STOP', index);
        this.is_fetching = false;
        this.$refs.infiniteScroll.stop();
      }
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
          col: true,
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
