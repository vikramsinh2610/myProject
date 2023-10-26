<template>
  <div :class="{ column: !embedded, 'fill-available': true }">
    <prassi-header-list :blocks="myHeader" class="p-ll-item" placeholder menu-delete />

    <prassi-empty-list v-if="!person && !isFetching" />

    <q-infinite-scroll
      id="scroll-target-id"
      class="fill-available relative-position"
      inline
      ref="infiniteScroll"
      @load="loadMore"
      :offset="250"
      scroll-target="#scroll-target-id"
    >
      <div style="height: 6px" />
      <div class="p-pl-promoter-item" :key="person.id" @click="$emit('viewClick', person)">
        <prassi-body-list
          menu
          menu-delete
          menu-icon="fa fa-address-card"
          :blocks="myBody(person)"
          delete-icon="fa fa-trash"
          @menuClick="$emit('detailClick', person)"
          @deleteClick="deletePerson(person)"
        />
      </div>
      <q-spinner-ios v-if="loading" class="center-spinner" color="primary" size="40" />
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from '../../base/prassi-header-list';
import PrassiBodyList from '../../base/prassi-body-list';
import PrassiEmptyList from '../../base/prassi-empty-list';

export default {
  name: 'PrassiPersonDetail',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'customerHeader.displayName',
          sublabel: 'customer.fiscalCode',
          size: 'small',
          weight: 'normal',
          width: 230,
          col: true,
        },
        {
          _id: '1',
          label: 'customerHeader.owner',
          sublabel: 'customerHeader.area',
          size: 'small',
          weight: 'normal',
          width: 240,
          col: true,
        },
      ],
    };
  },
  props: {
    person: {
      type: Object,
      default: () => ({}),
    },
    offsetSticky: {
      type: Array,
      default: () => [18, 18],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showProgress: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: () => [],
    },
    embedded: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    stopScrolling() {
      this.$utils.log('PERSON-PERSONS-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('PERSON-PERSONS-LIST', 'RESUME SCROLLING NEW');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('PERSON-PERSONS-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
    deletePerson(person) {
      this.$emit('deletePerson', person);
    },
    myBody(person) {
      return [
        {
          _id: '0',
          label: person.displayname,
          sublabel: person.fiscalCode,
          size: 'small',
          weight: 'normal',
          width: 274,
          type: '2rows',
          col: true,
        },
        {
          _id: '1',
          label: person.promoterName,
          sublabel: person.networkHierarchy,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, person.roleId),
          size: 'large',
          weight: 'light',
          width: 240,
          type: '2rows',
          col: true,
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-pl-promoter-item
  cursor pointer
.center-spinner
  display block
  margin auto
.center-spinner-first
  display block
  margin auto
  position: absolute;
  top: 50%;
  left: calc(50% - 40px);
  transform: translateY(-50%);
</style>
