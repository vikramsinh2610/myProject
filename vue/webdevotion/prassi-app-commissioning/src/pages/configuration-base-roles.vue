<template>
  <q-page class="q-px-sm q-pt-sm column">
    <prassi-configuration-role-list
      class="fill-available"
      ref="ConfigurationBaseRoles"
      :roles="roles"
      :sections="sections"
      :is-fetching="isFetching"
      @loadMore="loadMoreRoles"
      @searchRole="searchRole"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        icon="fa fa-plus-white"
        @click="$router.push(`/configuration/roles/new-role`)"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiConfigurationRoleList from '../components/configuration/prassi-configuration-base-roles';

export default {
  name: 'ConfigurationBaseRoles',
  components: {
    PrassiConfigurationRoleList,
  },
  data() {
    return {
      showAddDialog: false,
      role: undefined,
      roleToCopy: '',
    };
  },
  mounted() {
    this.resetRolesFilter();
    this.resetRoles();
  },
  computed: {
    ...mapState({
      roles: (state) => state.configuration.roles.items,
      last: (state) => state.configuration.roles.lastRecord,
      isFetching: (state) => state.error.isFetching,
      sections: (state) => state.configuration.sections,
    }),
  },
  methods: {
    ...mapActions({
      fetchRoles: 'configuration/fetchRoles',
    }),
    ...mapMutations({
      resetRoles: 'configuration/resetRoles',
      resetRolesFilter: 'configuration/resetRolesFilter',
      setRolesSearchText: 'configuration/setRolesSearchText',
    }),
    searchRole(search) {
      this.setRolesSearchText(search);
      this.resetRoles();
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreRoles({ index, done }) {
      if (this.last || this.error) {
        this.$refs.ConfigurationBaseRoles.stopScrolling();
      } else {
        this.fetchRoles().finally(() => done());
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 960px
  max-width fit-content
.center-spinner
  display block
  margin auto
</style>
