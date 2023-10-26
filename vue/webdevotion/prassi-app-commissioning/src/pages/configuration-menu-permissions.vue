<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-promoter-filter
      hidesearch
      auth-roles
      :promoters="promoterList"
      :auth-role-types="roles"
      @changed="filterPromoterChange"
    />
    <prassi-configuration-menu-permissions-list
      class="fill-available"
      :menu-permissions="menuPermissions"
      ref="configurationMenuPermissionsList"
      :is-fetching="isFetching"
      :roles="roles"
      :promoters="promoterList"
      @loadMore="loadMoreMenuPermissions"
      @addMenuPermission="showAddMenuPermissionsDialog"
      @modifyConfiguration="doModifyConfiguration"
      @deleteConfiguration="deleteConfiguration"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
    <q-dialog v-model="showInsertDialog">
      <q-card style="width: 700px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('configurationMenuPermissions.addTitle') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-around q-mt-md">
            <q-select
              class="col-9"
              clearable
              v-model="form.roleId"
              :label="$t('configurationMenuPermissions.roleId')"
              :error-message="$t('configurationMenuPermissions.errorLabel')"
              :options="roleTypeList"
            />
          </div>
          <div class="row justify-around q-mt-md">
            <q-select
              class="col-9"
              use-input
              clearable
              v-model="form.userId"
              :label="$t('filterPromoterBlock.searchPromoter')"
              :options="optionsPromoterList"
              @filter="filterPromoter"
            />
          </div>
          <div class="row justify-center q-mt-md">
            <q-select
              class="col-6"
              v-model="form.menuId"
              :label="$t('configurationMenuPermissions.menuId')"
              :error-message="$t('configurationMenuPermissions.errorLabel')"
              :error="$v.form.menuId.$error"
              :options="menuIdsList"
            />
            <q-checkbox
              class="col-3"
              left-label
              v-model="form.enabled"
              :label="$t('configurationMenuPermissions.enabled')"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button
            :label="$t('configurationMenuPermissions.addButton')"
            @click="confirmAdd"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDelDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            {{ $t('configurationHeader.confirmDelete') + ' ' + this.dossierToDelete }}
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button
            color="red"
            :label="$t('configurationProduct.delete')"
            @click="doDeleteConfiguration"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import PrassiConfigurationMenuPermissionsList from '../components/configuration/prassi-configuration-menu-permissions-list';
import PrassiPromoterFilter from '../components/promoter/prassi-promoter-filter';
// import constants from '../constants';

export default {
  name: 'ConfigurationMenuPermissions',
  components: {
    PrassiConfigurationMenuPermissionsList,
    PrassiPromoterFilter,
  },
  data() {
    return {
      showDelDialog: false,
      showInsertDialog: false,
      filterRole: '',
      filterUser: '',
      configurationToModify: '',
      dossierToDelete: '',
      optionsPromoterList: this.allPromoterList,
      form: {
        roleId: undefined,
        enabled: true,
        menuId: {
          label: '',
          value: '',
        },
        userId: undefined,
      },
    };
  },
  created() {
    this.resetMenuPermissionsConfigurations();
  },
  mounted() {
    this.fetchAllPromoters();
    this.fetchUsersFromMenuPermissionsConfigurations();
    this.fetchMenuIds();
    this.resetMenuPermissionsConfigurationsFilter();
    this.resetMenuPermissionsConfigurations();
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      menuPermissions: (state) => state.configuration.menuPermissions.items,
      menuPermission: (state) => state.configuration.menuPermission,
      last: (state) => state.configuration.menuPermissions.lastRecord,
      filter: (state) => state.configuration.filter,
      isFetching: (state) => state.error.isFetching,
      error: (state) => state.error.error,
      roles: (state) => state.promoters.roles.items,
      promoters: (state) => state.promoters.promoters.items,
      menuPermissionsPromoters: (state) => state.configuration.menuPermissions.promoters,
      menuIds: (state) => state.configuration.menuPermissions.menuIds,
      roleTypeList() {
        const authRoleTypeList = [];
        this.roles.forEach((el) => {
          if (el === `none`) return;
          if (authRoleTypeList.findIndex((role) => role.value === el.authenticationId) === -1) {
            authRoleTypeList.unshift({
              label: el.authenticationName,
              value: el.authenticationId,
            });
          }
        });
        return authRoleTypeList;
      },
      menuIdsList() {
        const menuIdsList = [];
        this.menuIds.forEach((el) => {
          menuIdsList.unshift({
            label: this.$t(`menu.${el.menuId}`),
            value: el.menuId,
          });
        });
        return menuIdsList;
      },
      promoterList() {
        const promoterList = [];
        this.menuPermissionsPromoters.forEach((el) => {
          if (!el._id || el._id === '') {
            return;
          }
          promoterList.unshift({
            displayName: this.$utils.getPromoterDisplayNameByPromoterId(this.promoters, el._id),
            _id: el._id,
          });
        });
        return promoterList;
      },
      allPromoterList() {
        const promoterList = [];
        this.promoters.forEach((el) => {
          promoterList.unshift({
            label: el.displayName,
            value: el._id,
          });
        });
        return promoterList;
      },
    }),
  },
  validations: {
    form: {
      menuId: {
        required,
      },
    },
  },
  methods: {
    ...mapActions({
      fetchMenuPermissionsConfigurations: 'configuration/fetchMenuPermissionsConfigurations',
      fetchUsersFromMenuPermissionsConfigurations:
        'configuration/fetchUsersFromMenuPermissionsConfigurations',
      fetchMenuIds: 'configuration/fetchMenuIds',
      fetchMenuPermissionsConfiguration: 'configuration/fetchMenuPermissionsConfiguration',
      fetchAllPromoters: 'promoters/fetchAllPromoters',
      deleteMenuPermissions: 'configuration/deleteMenuPermissions',
      saveMenuPermissions: 'configuration/saveMenuPermissions',
      setMenuPermissionFilterSearch: 'configuration/setMenuPermissionFilterSearch',
    }),
    ...mapMutations({
      resetMenuPermissionsConfigurations: 'configuration/resetMenuPermissionsConfigurations',
      resetMenuPermissionsConfigurationsFilter:
        'configuration/resetMenuPermissionsConfigurationsFilter',
      setMenuPermissionsConfigurationsSearchText:
        'configuration/setMenuPermissionsConfigurationsSearchText',
      setMenuPermissionsConfigurationsFilterRoleType:
        'configuration/setMenuPermissionsConfigurationsFilterRoleType',
      setMenuPermissionsConfigurationsFilterPromoterId:
        'configuration/setMenuPermissionsConfigurationsFilterPromoterId',
    }),
    filterPromoterChange(filter) {
      this.$utils.logobj('MENU-PERMISSIONS', 'filterPromoterChange', filter);
      this.setMenuPermissionsConfigurationsFilterRoleType(
        filter.authRoleType ? filter.authRoleType.value : '',
      );
      this.setMenuPermissionsConfigurationsFilterPromoterId(
        filter.promoterId ? filter.promoterId : '',
      );
      this.resetMenuPermissionsConfigurations();
    },
    showAddMenuPermissionsDialog() {
      this.$utils.log('CONFIGURATION-MENU-PERMISSIONS', 'showAddMenuPermissionsDialog called');
      this.configurationToModify = '';
      this.form = {
        roleId: undefined,
        enabled: true,
        menuId: {
          label: '',
          value: '',
        },
        userId: undefined,
      };
      this.showInsertDialog = true;
    },
    deleteConfiguration(_id) {
      this.showDelDialog = true;
      this.dossierToDelete = _id;
    },
    doDeleteConfiguration() {
      this.deleteMenuPermissions(this.dossierToDelete).then(() => {
        this.$q.notify({
          message: this.$t('default.deleteOk'),
          color: 'secondary',
          timeout: 300,
        });
        setTimeout(() => {
          this.showDelDialog = false;
          this.dossierToDelete = '';
          this.resetMenuPermissionsConfigurations();
          this.fetchUsersFromMenuPermissionsConfigurations();
        }, 700);
      });
    },
    doModifyConfiguration(_id) {
      this.$utils.logobj('CONFIGURATION-MENU-PERMISSIONS', 'modifyMenuPermission', _id);
      this.configurationToModify = _id;
      const { roleId, menuId, userId } = this.menuPermissions.find((x) => x._id === _id);
      this.form.roleId = this.roleTypeList.find((el) => Number.parseInt(roleId, 10) === el.value);
      this.form.userId = this.allPromoterList.find((el) => userId === el.value);
      this.form.menuId = this.menuIdsList.find((el) => menuId === el.value);

      this.form.enabled = this.menuPermissions.find((x) => x._id === _id).enabled;
      this.showInsertDialog = true;
    },
    async confirmAdd() {
      this.$utils.log('CONFIGURATION-MENU-PERMISSIONS', 'confirm add');
      this.$v.$touch();
      if (!this.$v.$error) {
        const changedMenuPermission = {
          roleId: this.form.roleId ? this.form.roleId.value : '',
          userId: this.form.userId ? this.form.userId.value : '',
          enabled: this.form.enabled,
          menuId: this.form.menuId.value,
        };

        await this.saveMenuPermissions({
          body: changedMenuPermission,
        }).then(() => {
          this.$q.notify({
            message: this.$t('configurationProduct.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
          this.showInsertDialog = false;
          setTimeout(() => {
            this.resetMenuPermissionsConfigurations();
            this.fetchUsersFromMenuPermissionsConfigurations();
          }, 700);
        });
      } else {
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreMenuPermissions({ index, done }) {
      if (this.last || this.error) {
        this.$refs.configurationMenuPermissionsList.stopScrolling();
      } else {
        this.$utils.logobj('CONFIG-MENU-PERMISSIONS', 'loadMoreMenuPermessions', index);
        this.fetchMenuPermissionsConfigurations().finally(() => done());
      }
    },
    computeCurrencySymbol(symbol) {
      switch (symbol) {
        case 'currency':
          return '€';
        case 'percentage':
          return '%';
        default:
          return '';
      }
    },
    filterPromoter(value, update) {
      update(() => {
        const needle = value.toLowerCase();
        this.optionsPromoterList = this.allPromoterList.filter((v) =>
          v.label.toLowerCase().includes(needle),
        );
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  width fit-content
  min-width 960px
  max-width 1280px
.center-spinner
  display block
  margin auto
</style>
