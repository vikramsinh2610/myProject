<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-configuration-jobs-list
      class="fill-available"
      ref="ConfigurationJobsList"
      :promoters="promoters"
      :roles="roles"
      :is-fetching="isFetching"
      @loadMore="loadMorePromoters"
      @searchPromoter="searchPromoters"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiConfigurationJobsList from '../components/configuration/prassi-configuration-jobs-list';

export default {
  name: 'ConfigurationJobs',
  components: {
    PrassiConfigurationJobsList,
  },
  mounted() {
    this.setPromotersSearchText('');
    this.resetPromoters();
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      promoters: (state) => state.configuration.promoters.items,
      last: (state) => state.configuration.promoters.lastRecord,
      isFetching: (state) => state.error.isFetching,
      roles: (state) => state.promoters.roles.items,
    }),
  },
  methods: {
    ...mapActions({
      fetchPromoters: 'configuration/fetchPromoters',
    }),
    ...mapMutations({
      resetPromoters: 'configuration/resetPromoters',
      setPromotersSearchText: 'configuration/setPromotersSearchText',
    }),
    searchPromoters(search) {
      this.$utils.logobj('CONFIGURATION-JOBS', 'searchJob', search);
      this.setPromotersSearchText(search);
      this.resetPromoters();
    },
    // eslint-disable-next-line no-unused-vars
    loadMorePromoters({ index, done }) {
      if (this.last || this.error) {
        this.$refs.ConfigurationJobsList.stopScrolling();
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
  min-width 960px
  max-width 960px
.center-spinner
  display block
  margin auto
</style>
