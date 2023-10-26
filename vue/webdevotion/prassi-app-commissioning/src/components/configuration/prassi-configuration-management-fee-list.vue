<template>
  <div class="column">
    <prassi-header-list :blocks="myHeader" class="p-ll-item" placeholder />

    <prassi-empty-list v-if="managementFees.length === 0 && !isFetching" />

    <div style="height: 6px" />
    <div
      class="p-pl-promoter-item"
      v-for="managementFee in managementFees"
      :key="managementFee._id"
      @click="$router.push(`/configuration/management-fee/${managementFee._id}`)"
    >
      <prassi-body-list :id="managementFee._id" :blocks="myBody(managementFee)" />
    </div>
    <div class="full-width q-ma-xl" />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="$emit('addManageFee')"
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
  name: 'PrassiConfigurationManagementFeeList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'configurationManagementFeeHeader.idManagementFee',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 300,
        },
        {
          _id: '1',
          label: 'configurationManagementFeeHeader.roleId',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 300,
          col: true,
        },
        {
          _id: '2',
          label: 'configurationManagementFeeHeader.fromProductivePeriod',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '3',
          label: 'configurationManagementFeeHeader.percentage',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
      ],
    };
  },
  props: {
    managementFees: {
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
  },
  methods: {
    myBody(managementFee) {
      return [
        {
          _id: '0',
          label: managementFee._id,
          size: 'small',
          weight: 'normal',
          width: 300,
          type: '2rows',
        },
        {
          _id: '1',
          label: this.$utils.getRoleName(this.roles, managementFee.roleId),
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 300,
          col: true,
        },
        {
          _id: '2',
          label: `${this.$utils.numberToMonth(
            managementFee.fromProductivePeriodMonth,
            this.$t.bind(this),
          )} ${managementFee.fromProductivePeriodYear}`,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 240,
        },
        {
          _id: '3',
          label: `${this.$n(managementFee.percentage / 100)}%`,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
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
