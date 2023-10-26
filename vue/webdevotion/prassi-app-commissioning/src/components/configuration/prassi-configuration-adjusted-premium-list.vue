<template>
  <div class="column">
    <prassi-header-list :blocks="myHeader" class="p-ll-item" placeholder />

    <prassi-empty-list v-if="adjustedPremiums.length === 0 && !isFetching" />

    <div style="height: 6px" />
    <div
      class="p-pl-promoter-item"
      v-for="adjustedPremium in adjustedPremiums"
      :key="adjustedPremium._id"
      @click="$router.push(`/configuration/adjusted-premium/${adjustedPremium._id}`)"
    >
      <prassi-body-list
        :id="adjustedPremium._id"
        :blocks="myBody(adjustedPremium)"
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
        @click="$emit('addAdjustedPremium')"
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
  name: 'PrassiConfigurationAdjustedPremiumList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'configurationAdjustedPremium.idAdjustedPremium',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 180,
        },
      ],
    };
  },
  props: {
    adjustedPremiums: {
      type: Array,
      default: () => [],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    myBody(adjustedPremium) {
      return [
        {
          _id: '0',
          label: adjustedPremium._id,
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
