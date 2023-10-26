<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-actions v-if="menu || button">
      <q-tabs v-if="menu" inverted no-pane-border v-model="filterInternal.selected">
        <q-tab
          v-for="menuItem in menus"
          :key="menuItem._id"
          :name="menuItem._id"
          :label="menuItem.label"
          :disable="menuItem.disabled"
        />
      </q-tabs>
      <prassi-standard-button
        v-if="button"
        :label="buttonLabel"
        :loading="isFetching"
        @click="$emit('buttonClicked')"
      />
      <prassi-standard-button
        v-if="button2"
        :label="button2Label"
        :loading="isFetching"
        @click="$emit('button2Clicked')"
      />
      <prassi-standard-button
        v-if="button3"
        :label="button3Label"
        :loading="isFetching"
        @click="$emit('button3Clicked')"
      />
    </q-card-actions>
    <q-separator v-if="menu || button" />
    <q-card-actions class="row q-px-lg">
      <q-input
        class="col"
        v-if="!hidesearch"
        v-model="filterInternal.searchPromoter"
        debounce="500"
        clearable
        :placeholder="$t('filterPromoterBlock.searchPromoter')"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-select
        class="col q-ml-lg select-ellipsis"
        use-input
        clearable
        v-if="promoters.length > 2"
        v-model="promoterId"
        :label="$t('filterPromoterBlock.searchPromoter')"
        :options="optionsPromoterList"
        @filter="filterPromoter"
      />
      <q-select
        class="col-5 q-ml-lg"
        clearable
        v-if="roles"
        v-model="filterInternal.roleType"
        :label="$t('promoterInsertLetter.roleType')"
        :options="roleTypeList"
      />
      <q-select
        class="col-5 q-ml-lg"
        clearable
        v-if="authRoles"
        v-model="filterInternal.authRoleType"
        :label="$t('promoterInsertLetter.roleType')"
        :options="authRoleTypeList"
      />
    </q-card-actions>
    <q-card-actions />
  </q-card>
</template>

<script>
import constants from '../../constants';

export default {
  name: 'PrassiPromoterFilter',
  data() {
    return {
      filterInternal: { ...this.filter },
      promoterId: undefined,
      optionsPromoterList: this.promoterList,
    };
  },
  props: {
    filter: {
      type: Object,
      default: () => ({
        selected: '',
        searchPromoter: '',
        roleType: {
          label: 'Tutti',
          value: constants.noSelection,
        },
        authRoleType: {
          label: 'Tutti',
          value: constants.noSelection,
        },
      }),
    },
    menu: {
      type: Boolean,
      default: false,
    },
    menus: {
      type: Array,
      default: () => [
        {
          _id: 'menu1',
          label: 'Menu Item',
        },
      ],
    },
    buttonLabel: {
      type: String,
      default: '',
    },
    button: {
      type: Boolean,
      default: false,
    },
    button2Label: {
      type: String,
      default: '',
    },
    button2: {
      type: Boolean,
      default: false,
    },
    button3Label: {
      type: String,
      default: '',
    },
    button3: {
      type: Boolean,
      default: false,
    },
    hidesearch: {
      type: Boolean,
      default: false,
    },
    promoters: {
      type: Array,
      default: () => [],
    },
    roles: {
      type: Boolean,
      default: false,
    },
    authRoles: {
      type: Boolean,
      default: false,
    },
    roleTypes: {
      type: Array,
      default: () => [],
    },
    authRoleTypes: {
      type: Array,
      default: () => [],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    filterPromoter(value, update) {
      update(() => {
        const needle = value.toLowerCase();
        this.optionsPromoterList = this.promoterList.filter((v) =>
          v.label.toLowerCase().includes(needle),
        );
      });
    },
  },
  computed: {
    roleTypeList() {
      const roleTypeList = [];

      this.roleTypes.forEach((el) => {
        roleTypeList.unshift({
          label: el.name,
          value: el.networkId,
        });
      });

      roleTypeList.unshift({
        label: this.$t(`default.${constants.noSelection}`),
        value: constants.noSelection,
      });

      return roleTypeList;
    },
    authRoleTypeList() {
      const authRoleTypeList = [];

      this.authRoleTypes.forEach((el) => {
        if (authRoleTypeList.findIndex((role) => role.value === el.authenticationId) === -1) {
          authRoleTypeList.unshift({
            label: el.authenticationName,
            value: el.authenticationId,
          });
        }
      });

      authRoleTypeList.unshift({
        label: this.$t(`default.${constants.noSelection}`),
        value: constants.noSelection,
      });

      return authRoleTypeList;
    },
    promoterList() {
      const promoterList = [];

      this.promoters.forEach((el) => {
        promoterList.push({
          label: `${el.displayName}`,
          value: el._id,
        });
      });

      promoterList.unshift({
        label: this.$t(`default.${constants.noSelection}`),
        value: constants.noSelection,
      });

      return promoterList;
    },
  },
  watch: {
    filter(filter) {
      this.$utils.logobj('PRASSI-PROMOTER-FILTER', 'filter changed', filter);
      this.filterInternal = { ...filter };
    },
    'filterInternal.searchPromoter': function (value) {
      this.$utils.logobj('PRASSI-PROMOTER-FILTER', 'searchPromoterModel', value);
      this.$emit('changed', { ...this.filterInternal, searchPromoter: value });
    },
    'filterInternal.selected': function (selected) {
      this.$utils.logobj('PRASSI-PROMOTER-FILTER', 'filterInternal.selected', selected);
      this.$emit('changed', { ...this.filterInternal, selected });
    },
    'filterInternal.roleType': function (value) {
      this.$utils.logobj('PRASSI-PROMOTER-FILTER', 'roles changed', value);
      this.$emit('changed', { ...this.filterInternal, roleType: value });
    },
    'filterInternal.authRoleType': function (value) {
      this.$utils.logobj('PRASSI-PROMOTER-FILTER', 'roles changed', value);
      this.$emit('changed', { ...this.filterInternal, authRoleType: value });
    },
    promoterId(value) {
      this.$utils.logobj('PRASSI-CUSTOMER-FILTER', 'searchByPromoter', value);
      this.filterInternal = { ...this.filterInternal, promoterId: value ? value.value : undefined };
      this.$emit('changed', { ...this.filterInternal });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-top-left-radius 4px
  border-top-right-radius 4px
  border-bottom-right-radius 0
  border-bottom-left-radius 0
  border-top solid 1px $card-border
  border-left solid 1px $card-border
  border-right solid 1px $card-border
.q-separator
  background-color $card-border
.p-pf-plus
  margin auto 0 auto auto
.p-pf-plus:hover
  border-color $secondary
</style>
