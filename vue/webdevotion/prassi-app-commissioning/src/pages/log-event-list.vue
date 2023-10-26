<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <div class="column fill-available">
      <prassi-header-list class="p-pl-item" :blocks="myHeader" />
      <q-infinite-scroll
        id="scroll-events-id"
        class="fill-available"
        inline
        ref="infiniteScroll"
        @load="loadMore"
        :offset="250"
        scroll-target="#scroll-events-id"
      >
        <div style="height: 6px" />
        <div class="p-pl-item" v-for="logEvent in logEvents" :key="logEvent._id">
          <prassi-body-list :blocks="myBody(logEvent)" />
        </div>
      </q-infinite-scroll>
      <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar';
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiHeaderList from '../components/base/prassi-header-list';
import PrassiBodyList from '../components/base/prassi-body-list';

export default {
  name: 'LogEventList',
  components: { PrassiHeaderList, PrassiBodyList },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'logEvents.createDate',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 180,
        },
        {
          _id: '1',
          label: 'logEvents.description',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 600,
          col: true,
        },
        {
          _id: '2',
          label: 'logEvents.idInvoicing',
          sublabel: 'logEvents.idCommissioning',
          size: 'small',
          weight: 'normal',
          width: 120,
        },
      ],
    };
  },
  created() {
    this.$utils.log('LOG-EVENT-LIST', 'created');
    this.resetLogEvents();
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      isFetching: (state) => state.error.isFetching,
      logEvents: (state) => state.commissioning.logEvents.items,
      lastLog: (state) => state.commissioning.logEvents.lastRecord,
    }),
  },
  methods: {
    ...mapActions({
      fetchLogEvents: 'commissioning/fetchLogEvents',
    }),
    ...mapMutations({
      resetLogEvents: 'commissioning/resetLogEvents',
    }),
    // eslint-disable-next-line no-unused-vars
    loadMore(index, done) {
      this.$utils.logobj('LOG-EVENT-LIST', 'loadMore', index);
      if (this.lastLog || this.error) {
        this.$refs.infiniteScroll.stop();
      } else {
        this.fetchLogEvents({
          commissioningId: '',
          invoicingId: '',
        }).finally(() => done());
      }
    },
    myBody(logEvent) {
      return [
        {
          _id: '1',
          label: date.formatDate(new Date(logEvent.createDate), 'DD/MM/YYYY HH:mm:ss'),
          size: 'small',
          weight: 'normal',
          width: 180,
          type: '2rows',
        },
        {
          _id: '2',
          label: logEvent.description,
          size: 'medium',
          weight: 'normal',
          width: 600,
          type: '2rows',
          col: true,
        },
        {
          _id: '3',
          label: logEvent.idInvoicing,
          sublabel: logEvent.idCommissioning,
          size: 'small',
          weight: 'normal',
          width: 120,
          type: '2rows',
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  width fit-content
  min-width 960px
  max-width fit-content
.center-spinner
  display block
  margin auto
</style>
