<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-promoter-filter roles :role-types="roles" @changed="filterPromoterChange" />
    <prassi-promoter-list
      ref="promoterList"
      :promoters="promoters"
      :roles="roles"
      :is-fetching="isFetching"
      @sort="sortPromoters"
      @loadMore="loadMorePromoters"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="downloadExcel"
        icon="fa fa-download"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import download from 'getfile-rename-js';
import PrassiPromoterFilter from '../components/promoter/prassi-promoter-filter';
import PrassiPromoterList from '../components/promoter/prassi-promoter-list';

export default {
  name: 'Promoters',
  components: {
    PrassiPromoterList,
    PrassiPromoterFilter,
  },
  data() {
    return {
      searchPromoters: '',
      roleId: '',
    };
  },
  created() {
    this.resetPromoterSearch();
    this.resetPromoters();
  },
  mounted() {
    this.$utils.log('PROMOTERS', 'created');
    this.resetPromoterSearch();
    this.resetPromoters();
  },
  props: {
    closed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      rootId: (state) => state.login._id,
      promoters: (state) => state.promoters.promoters.items,
      roles: (state) => state.promoters.roles.items,
      last: (state) => state.promoters.promoters.lastRecord,
      filter: (state) => state.promoters.filter,
      isFetching: (state) => state.error.isFetching,
      report: (state) => state.promoters.report.item,
      document: (state) => state.documents.document.item,
      documents: (state) => state.invoicing.documents.items,
    }),
  },
  methods: {
    ...mapActions({
      fetchPromoters: 'promoters/fetchPromoters',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
      fetchPromotersExcelReport: 'promoters/fetchPromotersExcelReport',
    }),
    ...mapMutations({
      resetPromoterSearch: 'promoters/resetPromoterSearch',
      resetPromoters: 'promoters/resetPromoters',
      setPromotersFilterYear: 'promoters/setPromotersFilterYear',
      setPromotersFilterSelected: 'promoters/setPromotersFilterSelected',
      setPromotersSorting: 'promoters/setPromotersSorting',
      setPromoterFilterRoleType: 'promoters/setPromoterFilterRoleType',
      setPromoterFilterSearch: 'promoters/setPromoterFilterSearch',
    }),
    filterPromoterChange(filter) {
      this.$utils.logobj('PROMOTERS', 'filterPromoterChange', filter);
      this.setPromoterFilterRoleType(filter.roleType.value);
      this.setPromoterFilterSearch(filter.searchPromoter);
      this.resetPromoters();
    },
    sortPromoters(sort) {
      this.$utils.logobj('PROMOTERS', 'sortPromoters', sort);
      this.setPromotersSorting(sort);
      this.resetPromoters();
    },
    downloadExcel() {
      this.$utils.log('PROMOTERS-DETAIL', 'downloadExcel');
      this.fetchPromotersExcelReport().then(() => {
        this.fetchDocumentUrl(this.report.documentId).then(() => {
          download(this.document.url, this.document.displayName);
        });
      });
    },
    // eslint-disable-next-line no-unused-vars
    loadMorePromoters({ index, done }) {
      this.$utils.log('PROMOTERS', `loadMorePromoters called: ${index}`);
      if (this.last || this.error) {
        this.$refs.promoterList.stopScrolling();
      } else {
        this.fetchPromoters().finally(() => done());
      }
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
