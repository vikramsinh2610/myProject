<template>
  <div>
    <prassi-header-list class="p-item" :blocks="myHeader" placeholder />

    <prassi-empty-list v-if="acquittances.length === 0 && !isFetching" />

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
        class="p-item"
        v-for="acquittance in acquittances"
        :key="acquittance._id"
        @click="$emit('viewClick', acquittance._id)"
      >
        <prassi-body-list
          :blocks="myBody(acquittance)"
          :id="acquittance._id"
          menu
          @menuClick="$emit('menuClick', $event)"
        />
      </div>
    </q-infinite-scroll>

    <div class="full-width q-ma-xl" />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="$emit('addAcquittance')"
        icon="fa fa-plus-white"
      />
    </q-page-sticky>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiAcquittanceList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      myHeader: [
        {
          _id: '1',
          label: 'acquittanceHeader.didCreatedDate',
          sublabel: 'acquittanceHeader.didConfirmedDate',
          size: 'small',
          weight: 'normal',
          width: 150,
        },
        {
          _id: '2',
          label: 'acquittanceHeader.company',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 150,
          col: true,
        },
        {
          _id: '3',
          label: 'acquittanceHeader.status',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 150,
        },
        {
          _id: '4',
          label: 'acquittanceHeader.count',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 150,
        },
      ],
    };
  },
  props: {
    acquittances: {
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
      this.$utils.log('ACQUITTANCE-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('ACQUITTANCE-LIST', 'RESUME SCROLLING');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('ACQUITTANCE-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
    myBody(acquittance) {
      return [
        {
          _id: '1',
          label: acquittance.didCreatedDate ? this.$d(new Date(acquittance.didCreatedDate)) : '',
          sublabel: acquittance.didConfirmedDate
            ? this.$d(new Date(acquittance.didConfirmedDate))
            : '',
          size: 'small',
          weight: 'normal',
          width: 150,
          type: '2rows',
        },
        {
          _id: '2',
          label: acquittance.companyName,
          size: 'medium',
          weight: 'normal',
          width: 150,
          type: '2rows',
          col: true,
        },
        {
          _id: '3',
          label: this.$t(`acquittanceHeader.${acquittance.status}`),
          size: 'medium',
          weight: 'normal',
          width: 150,
          type: '2rows',
        },
        {
          _id: '4',
          label: acquittance.count.toString(),
          size: 'large',
          weight: 'light',
          width: 150,
          type: '2rows',
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-item
  cursor pointer
</style>
