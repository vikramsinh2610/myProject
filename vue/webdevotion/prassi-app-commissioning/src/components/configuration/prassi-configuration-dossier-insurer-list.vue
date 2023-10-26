<template>
  <div class="column">
    <prassi-header-list :blocks="myHeader" class="p-ll-item" placeholder />

    <prassi-empty-list v-if="dossiers.length === 0 && !isFetching" />

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
      <!-- @click="$router.push(`/configuration/dossier-insurer/${dossier._id}`)" -->
      <div class="p-pl-promoter-item" v-for="dossier in dossiers" :key="dossier._id">
        <prassi-body-list
          :id="dossier._id"
          :blocks="myBody(dossier)"
          menu-delete
          delete-icon="fa fa-trash"
          @deleteClick="deleteDossierInsurer(dossier._id)"
        />
      </div>
    </q-infinite-scroll>

    <q-page-sticky position="bottom-right" :offset="[60, 18]">
      <q-btn
        ref="addButton"
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="$emit('addDossierInsurer')"
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
  name: 'PrassiConfigurationCustomerInsurerList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList }, // , PrassiSearchFilter
  updated() {
    this.resumeScrolling();
  },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'configurationHeader.dossierCode',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
          sortable: () => {
            this.$emit('sort', 'dossierId');
          },
        },
        {
          _id: '1-0',
          label: 'customerHeader.inherited',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 5,
        },
        {
          _id: '1',
          label: 'configurationHeader.promoter',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '2',
          label: 'default.tree',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 400,
          col: true,
        },
        {
          // numero
          _id: '3',
          label: 'configurationJobs.fromProductivePeriodMonth',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 50,
        },
        {
          _id: '4',
          label: 'configurationJobs.fromProductivePeriodYear',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 50,
          sortable: () => {
            this.$emit('sort', 'time');
          },
        },
      ],
    };
  },
  props: {
    dossiers: {
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
      this.$utils.log('DOSSIER-CONFIGURATION-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('DOSSIER-CONFIGURATION-LIST', 'RESUME SCROLLING');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('DOSSIER-CONFIGURATION-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      // console.log(`loadMore: ${index}, ${done}`);
      this.$emit('loadMore', { index, done });
    },
    deleteDossierInsurer(id) {
      this.$emit('deleteDossierInsurer', { id });
    },
    myBody(dossier) {
      return [
        {
          _id: '0',
          label: dossier.dossierId,
          size: 'small',
          weight: 'normal',
          width: 150,
        },
        {
          _id: '1-0',
          type: 'icon',
          color: dossier.inherited ? 'green' : 'grey',
          icon: dossier.inherited ? 'fas fa-arrow-up' : 'fa fa-check',
          width: 5,
        },
        {
          _id: '1',
          label: dossier.promoterName,
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '2',
          label: dossier.networkHierarchy,
          size: 'small',
          weight: 'normal',
          width: 400,
          col: true,
        },
        {
          _id: '3',
          label: dossier.productivePeriodMonth.toString(),
          size: 'small',
          weight: 'normal',
          width: 50,
        },
        {
          _id: '4',
          label: dossier.productivePeriodYear.toString(),
          size: 'small',
          weight: 'normal',
          width: 50,
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
