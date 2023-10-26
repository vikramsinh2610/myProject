<template>
  <div class="column fill-available">
    <prassi-header-list
      :blocks="myHeader"
      class="p-ll-item"
      :placeholder="$user.roleID > 7"
      menu-delete
    />

    <prassi-empty-list v-if="customers.length === 0 && !isFetching" />

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
        v-for="customer in customers"
        :key="customer._id"
        @click="$emit('viewClick', customer._id)"
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
    </q-infinite-scroll>
    <q-page-sticky v-if="$user.roleID >= 7" position="bottom-right" :offset="offsetSticky">
      <q-fab icon="fa fa-chevron-up" active-icon="fa fa-times" direction="up" color="secondary">
        <q-fab-action @click="$emit('downloadCustomer')" color="primary" icon="fa fa-download">
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('customer.customerExport') }}
          </q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
    <q-page-sticky v-if="$user.roleID < 7" position="bottom-right" :offset="offsetSticky">
      <q-fab icon="fa fa-chevron-up" active-icon="fa fa-times" direction="up" color="secondary">
        <q-fab-action @click="$emit('downloadCustomer')" color="primary" icon="fa fa-download">
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('customer.customerExport') }}
          </q-tooltip>
        </q-fab-action>
        <q-fab-action @click="$emit('addCustomer')" color="secondary" icon="fa fa-plus-white">
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('customer.addCustomer') }}
          </q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiCustomerList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  updated() {
    this.resumeScrolling();
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
      this.$utils.log('CUSTOMER-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('CUSTOMER-LIST', 'RESUME SCROLLING NEW');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('CUSTOMER-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
    myBody(customer) {
      return [
        {
          _id: '0',
          label: customer.displayName,
          sublabel: customer.created ? this.$d(new Date(customer.created)) : '',
          size: 'small',
          weight: 'normal',
          width: 274,
          type: '2rows',
        },
        {
          _id: '1',
          label: customer.statusDisplayValue,
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
          label: customer.typeDisplayValue,
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
