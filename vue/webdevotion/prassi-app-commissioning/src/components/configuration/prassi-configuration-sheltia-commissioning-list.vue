<template>
  <div class="column">
    <prassi-header-list :blocks="myHeader" class="p-ll-item" placeholder />

    <prassi-empty-list v-if="commissionings.length === 0 && !isFetching" />

    <div style="height: 6px" />
    <div
      class="p-pl-promoter-item"
      v-for="commissioning in commissionings"
      :key="commissioning._id"
      @click="$router.push(`/configuration/sheltia-commissioning/${commissioning._id}`)"
    >
      <prassi-body-list
        :id="commissioning._id"
        :blocks="myBody(commissioning)"
        menu
        menu-icon="fa fa-copy"
        @menuClick="$emit('copyConfiguration', $event)"
      />
    </div>
    <div class="full-width q-ma-xl" />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="$emit('addCommissioning')"
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
  name: 'PrassiConfigurationSheltiaCommissioningList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'configurationCommissioningHeader.idCommissioning',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 300,
        },
        {
          _id: '1',
          label: 'configurationCommissioningHeader.roleId',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 300,
          col: true,
        },
        {
          _id: '2',
          label: 'configurationCommissioningHeader.fromProductivePeriod',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
      ],
    };
  },
  props: {
    commissionings: {
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
    myBody(commissioning) {
      return [
        {
          _id: '0',
          label: commissioning._id,
          size: 'small',
          weight: 'normal',
          width: 300,
          type: '2rows',
        },
        {
          _id: '1',
          label: this.$utils.getRoleName(this.roles, commissioning.roleId),
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 300,
          col: true,
        },
        {
          _id: '2',
          label: `${this.$utils.numberToMonth(
            commissioning.fromProductivePeriodMonth,
            this.$t.bind(this),
          )} ${commissioning.fromProductivePeriodYear}`,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
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
