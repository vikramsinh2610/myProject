<template>
  <div class="column">
    <prassi-header-list :blocks="myHeader" class="p-ll-item" placeholder />

    <prassi-empty-list v-if="menuPermissions.length === 0 && !isFetching" />

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
        v-for="menuPermission in menuPermissions"
        :key="menuPermission._id"
        @click="$emit('modifyConfiguration', menuPermission._id)"
      >
        <prassi-body-list
          :id="menuPermission._id"
          :blocks="myBody(menuPermission)"
          menu
          menu-icon="fa fa-times"
          @menuClick="$emit('deleteConfiguration', $event)"
        />
      </div>
    </q-infinite-scroll>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="$emit('addMenuPermission')"
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
  name: 'PrassiConfigurationMenuPermissionsList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  updated() {
    this.resumeScrolling();
  },
  data() {
    return {
      myHeader: [
        {
          _id: '1',
          label: 'configurationMenuPermissions.roleId',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 250,
        },
        {
          _id: '2',
          label: 'configurationMenuPermissions.user',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '3',
          label: 'configurationMenuPermissions.menuId',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '5',
          label: 'configurationMenuPermissions.enabled',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
      ],
    };
  },
  props: {
    menuPermissions: {
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
    promoters: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    stopScrolling() {
      this.$utils.log('MENU-CONFIGURATION-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('MENU-CONFIGURATION-LIST', 'RESUME SCROLLING');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('MENU-CONFIGURATION-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    myBody(menuPermission) {
      return [
        {
          _id: '1',
          label: this.$utils.getAuthenticationName(this.roles, menuPermission.roleId),
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 250,
        },
        {
          _id: '2',
          label: menuPermission.userId
            ? this.$utils.getPromoterDisplayNameByPromoterId(this.promoters, menuPermission.userId)
            : '',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '3',
          label: `${menuPermission.menuId}`,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '5',
          type: 'icon',
          color: menuPermission.enabled ? 'green' : 'red',
          icon: menuPermission.enabled ? 'fa fa-check' : 'fa fa-times',
          width: 100,
        },
      ];
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-pl-promoter-item
  cursor pointer
</style>
