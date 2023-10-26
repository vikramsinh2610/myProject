<template>
  <div class="column">
    <prassi-header-list :blocks="myHeader" class="p-ll-item" placeholder />

    <prassi-empty-list v-if="commissionings.length === 0 && !isFetching" />

    <div style="height: 6px" />
    <div
      class="p-pl-promoter-item"
      v-for="commissioning in commissionings"
      :key="commissioning._id"
      @click="$router.push(`/configuration/tcw-commissioning-dynamic/${commissioning._id}`)"
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
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiConfigurationTcwCommissioningDynamicList',
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
          width: 180,
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
  },
  methods: {
    myBody(commissioning) {
      return [
        {
          _id: '0',
          label: commissioning._id,
          size: 'small',
          weight: 'normal',
          width: 180,
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
</style>
