<template>
  <div class="column">
    <prassi-header-list :blocks="myHeader" class="p-ll-item" placeholder />

    <prassi-empty-list v-if="commissionings.length === 0 && !isFetching" />

    <div style="height: 6px" />
    <div
      class="p-pl-promoter-item"
      v-for="commissioning in commissionings"
      :key="commissioning._id"
      @click="$router.push(`/configuration/tcw-commissioning/${commissioning._id}`)"
    >
      <!-- menu menu-icon="fa fa-copy" @menuClick="$emit('copyConfiguration', $event)" -->
      <prassi-body-list :id="commissioning._id" :blocks="myBody(commissioning)" />
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
  name: 'PrassiConfigurationTcwCommissioningList',
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
          width: 250,
        },
        {
          _id: '2',
          label: 'configurationCommissioningHeader.directProductionPercentage',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
        },
        {
          _id: '3',
          label: 'configurationCommissioningHeader.indirectProductionPercentage',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
        },
        {
          _id: '4',
          label: 'configurationCommissioningHeader.creationDate',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
        },
        {
          _id: '5',
          label: 'configurationCommissioningHeader.indirectProductionCombinable',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
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
          width: 250,
        },
        {
          _id: '2',
          label: `${commissioning.directProductionPercentage / 100} %`,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
        },
        {
          _id: '3',
          label: `${commissioning.indirectProductionPercentage / 100} %`,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
        },
        {
          _id: '4',
          label: this.$d(new Date(commissioning.creationDate)),
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 150,
        },
        {
          _id: '5',
          type: 'icon',
          color: commissioning.isIndirectProductionCombinable ? 'green' : 'red',
          icon: commissioning.isIndirectProductionCombinable ? 'fa fa-check' : 'fa fa-times',
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
