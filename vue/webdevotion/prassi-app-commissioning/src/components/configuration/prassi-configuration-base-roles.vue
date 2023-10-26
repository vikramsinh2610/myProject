<template>
  <div class="column">
    <prassi-search-filter
      :search-label="$t('configurationHeader.searchRoleFilter')"
      @changedSearch="$emit('searchRole', $event)"
    />

    <prassi-header-list :blocks="myHeader" class="p-ll-item" />

    <prassi-empty-list v-if="roles.length === 0 && !isFetching" />

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
        v-for="role in roles"
        :key="role._id"
        @click="$router.push(`/configuration/roles/${role._id}`)"
      >
        <prassi-body-list :id="role._id" :blocks="myBody(role)" />
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';
import PrassiSearchFilter from '../base/prassi-search-filter';

export default {
  name: 'PrassiConfigurationBaseRoles',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList, PrassiSearchFilter },
  updated() {
    this.resumeScrolling();
  },
  data() {
    return {
      myHeader: [
        // {
        //   _id: '0',
        //   label: 'configurationHeader.roleId',
        //   sublabel: '',
        //   size: 'small',
        //   weight: 'normal',
        //   width: 250,
        // },
        {
          _id: '1',
          label: 'configurationHeader.roleName',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 300,
        },
        {
          _id: '2',
          label: 'configurationHeader.roleColor',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
          col: true,
        },
        {
          _id: '3',
          label: 'configurationHeader.roleArea',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
        },
      ],
    };
  },
  props: {
    sections: {
      type: Array,
      default: () => [],
    },
    roles: {
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
      this.$utils.log('CONFIGURATION-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('CONFIGURATION-LIST', 'RESUME SCROLLING');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('CONFIGURATION-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
    myBody(role) {
      return [
        // {
        //   _id: '0',
        //   label: role._id,
        //   size: 'small',
        //   weight: 'normal',
        //   width: 250,
        //   type: '2rows',
        // },
        {
          _id: '1',
          label: role.name,
          size: 'small',
          weight: 'normal',
          width: 300,
          type: '2rows',
        },
        {
          _id: '2',
          label: role.color,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
          col: true,
        },
        {
          _id: '3',
          label: role.area,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
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
