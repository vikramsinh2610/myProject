<template>
  <div class="column">
    <prassi-header-list :blocks="myHeader" class="p-ll-item" placeholder />

    <prassi-empty-list v-if="customers.length === 0 && !isFetching" />

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
        v-for="customer in customers"
        :key="customer._id"
        @click="$emit('viewClick', customer)"
      >
        <prassi-body-list
          :id="customer._id"
          :blocks="myBody(customer)"
          menu-delete
          delete-icon="fa fa-trash"
          @deleteClick="deleteCustomerInsurer(customer._id)"
        />
      </div>
    </q-infinite-scroll>

    <q-page-sticky v-if="$user.roleID >= 7" position="bottom-right" :offset="[18, 18]">
      <q-fab icon="fa fa-chevron-up" active-icon="fa fa-times" direction="up" color="secondary">
        <q-fab-action @click="$emit('addCustomer')" color="secondary" icon="fa fa-plus-white">
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('customer.addCustomerContract') }}
          </q-tooltip>
        </q-fab-action>
        <q-fab-action @click="$emit('addCustomerInsurer')" color="primary" icon="fa fa-plus-white">
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('customer.addCustomerInsurer') }}
          </q-tooltip>
        </q-fab-action>
        <q-fab-action
          v-if="$user.roleID >= 7 && deleteButton"
          @click="$emit('deleteCustomer')"
          color="red"
          icon="fa fa-trash"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('customer.deleteCustomer') }}
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
  name: 'PrassiConfigurationCustomerInsurerList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList }, // , PrassiSearchFilter
  updated() {
    this.resumeScrolling();
  },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'configurationHeader.customerDescription',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
          sortable: () => {
            this.$emit('sort', 'customerId');
          },
        },
        {
          _id: '1-0',
          label: 'customerHeader.inherited',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 5,
        },
        {
          _id: '1',
          label: 'configurationHeader.promoter',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '2',
          label: 'default.tree',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 400,
          col: true,
        },
        {
          // numero
          _id: '3',
          label: 'configurationJobs.fromProductivePeriodMonth',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 50,
        },
        {
          _id: '4',
          label: 'configurationJobs.fromProductivePeriodYear',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 50,
          sortable: () => {
            this.$emit('sort', 'time');
          },
        },
      ],
    };
  },
  props: {
    customers: {
      type: Array,
      default: () => [],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    deleteButton: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    stopScrolling() {
      this.$utils.log('CUSTOMER-CONFIGURATION-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('CUSTOMER-CONFIGURATION-LIST', 'RESUME SCROLLING');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('CUSTOMER-CONFIGURATION-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      // console.log(`loadMore: ${index}, ${done}`);
      this.$emit('loadMore', { index, done });
    },
    deleteCustomerInsurer(id) {
      this.$emit('deleteCustomerInsurer', { id });
    },
    myBody(customer) {
      return [
        {
          _id: '0',
          label: customer.displayCustomerName,
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '1-0',
          type: 'icon',
          color: customer.inherited ? 'green' : 'grey',
          icon: customer.inherited ? 'fas fa-arrow-up' : 'fa fa-check',
          width: 5,
        },
        {
          _id: '1',
          label: customer.promoterName,
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '2',
          label: customer.networkHierarchy,
          size: 'small',
          weight: 'normal',
          width: 400,
          col: true,
        },
        {
          _id: '3',
          label: customer.productivePeriodMonth.toString(),
          size: 'small',
          weight: 'normal',
          width: 50,
        },
        {
          _id: '4',
          label: customer.productivePeriodYear.toString(),
          size: 'small',
          weight: 'normal',
          width: 50,
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
