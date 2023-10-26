<template>
  <div class="column fill-available">
    <prassi-header-list :blocks="myHeader" class="p-ll-item" placeholder />

    <prassi-empty-list v-if="persons.length === 0 && !isFetching" />

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
      <div
        class="p-pl-promoter-item"
        v-for="person in persons"
        :key="person.id"
        @click="$emit('viewClick', person)"
      >
        <prassi-body-list
          menu
          menu-icon="fa fa-address-card"
          :blocks="myBody(person)"
          @menuClick="$emit('detailClick', person)"
        />
      </div>
      <q-spinner-ios
        v-if="isFetching"
        :class="
          persons && persons.length !== 0 && !showProgress
            ? 'center-spinner'
            : 'center-spinner-first'
        "
        color="primary"
        :size="persons && persons.length !== 0 && !showProgress ? '40' : '80'"
      />
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiPersonRelationList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  updated() {
    this.resumeScrolling();
    if (this.persons.length === 0) {
      this.forceScrolling();
    }
  },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'customerHeader.displayName',
          sublabel: 'customer.fiscalCode',
          size: 'small',
          weight: 'normal',
          width: 274,
          col: true,
        },
        {
          _id: '1',
          label: 'customer.personType',
          sublabel: 'customerHeader.status',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '2',
          label: 'dossierHeader.contractId',
          sublabel: 'dossierHeader.practice',
          size: 'small',
          weight: 'normal',
          width: 130,
        },
      ],
    };
  },
  props: {
    persons: {
      type: Array,
      default: () => [],
    },
    offsetSticky: {
      type: Array,
      default: () => [18, 18],
    },
    isFetching: {
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
  },
  methods: {
    stopScrolling() {
      this.$utils.log('PERSON-RELATIONS-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('PERSON-RELATIONS-LIST', 'RESUME SCROLLING NEW');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('PERSON-RELATIONS-LIST', 'FORCE SCROLLING');
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
          label: person.personType ? person.personType.value : '-',
          sublabel: this.$utils.customerStatus(person.status),
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: '2',
          label: person.contractId,
          sublabel: person.practiceId,
          size: 'medium',
          weight: 'normal',
          width: 130,
          type: '2rows',
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
