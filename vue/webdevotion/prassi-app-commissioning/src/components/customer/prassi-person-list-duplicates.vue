<template>
  <div class="column fill-available">
    <prassi-header-list
      :blocks="myHeader"
      class="p-ll-item"
      :placeholder="$user.roleID > 7"
      menu-delete
    />

    <prassi-empty-list v-if="customers.length === 0 && !isFetching" />

    <div
      id="scroll-target-id2"
      class="fill-available relative-position"
      inline
      ref="infiniteScroll2"
      @load="loadMore"
      :offset="10"
      scroll-target="#scroll-target-id2"
    >
      <div style="height: 6px" />
      <div
        class="p-pl-promoter-item"
        v-for="customer in customers"
        :key="customer._id"
        @click="$emit('viewClick', customer)"
      >
        <prassi-body-list
          :menu="$user.roleID > 7"
          menu-delete
          menu-icon="fa fa-address-card"
          delete-icon="fas fa-envelope"
          :blocks="myBody(customer)"
          @menuClick="$emit('detailClick', customer)"
          @deleteClick="$emit('emailClick', customer)"
        />
      </div>
      <q-spinner-ios
        v-if="isFetching"
        :class="
          customers && customers.length !== 0 && !showProgress
            ? 'center-spinner'
            : 'center-spinner-first'
        "
        color="primary"
        :size="customers && customers.length !== 0 && !showProgress ? '40' : '80'"
      />
    </div>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiPersonListDuplicates',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  updated() {
    this.$utils.log('PERSON-LIST-DUPLICATED', 'updated');
    // this.resumeScrolling();
  },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'customerHeader.displayName',
          sublabel: 'customerHeader.created',
          size: 'small',
          weight: 'normal',
          width: 274,
        },
        {
          _id: '1',
          label: 'customerHeader.status',
          sublabel: 'dossiers.birthday',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '2-0',
          label: 'customerHeader.inherited',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 45,
        },
        {
          _id: '2',
          label: 'customerHeader.owner',
          sublabel: 'customerHeader.area',
          size: 'small',
          weight: 'normal',
          width: 240,
          col: true,
        },
        {
          _id: '3',
          label: 'customerHeader.type',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 120,
        },
      ],
    };
  },
  props: {
    customers: {
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
      this.$utils.log('PERSON-LIST-DUPLICATED', 'STOP SCROLLING');
      this.$refs.infiniteScroll2.stop();
    },
    resumeScrolling() {
      this.$utils.log('PERSON-LIST-DUPLICATED', 'RESUME SCROLLING NEW');
      this.$refs.infiniteScroll2.resume();
    },
    forceScrolling() {
      this.$utils.log('PERSON-LIST-DUPLICATED', 'FORCE SCROLLING');
      this.$refs.infiniteScroll2.trigger();
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
    myBody(customer) {
      return [
        {
          _id: '0',
          label: customer.displayname,
          sublabel: customer.created ? this.$d(new Date(customer.created)) : '',
          size: 'small',
          weight: 'normal',
          width: 274,
          type: '2rows',
        },
        {
          _id: '1',
          label: this.$utils.customerStatus(customer.status),
          sublabel: customer.birthDate ? this.$d(new Date(customer.birthDate)) : '',
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: '2-0',
          type: 'icon',
          color: customer.inherited ? 'green' : 'grey',
          icon: customer.inherited ? 'fas fa-arrow-up' : 'fa fa-check',
          width: 45,
        },
        {
          _id: '2',
          label: customer.promoterName,
          sublabel: customer.networkHierarchy,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, customer.roleId),
          size: 'large',
          weight: 'light',
          width: 240,
          type: '2rows',
          col: true,
        },
        {
          _id: '3',
          label: this.$utils.customerType(customer.customerType),
          size: 'small',
          weight: 'normal',
          width: 120,
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
