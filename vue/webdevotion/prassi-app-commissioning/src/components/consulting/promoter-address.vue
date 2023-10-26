<template>
  <div>
    <div v-if="ready">
      <address-lookup
        ref="address"
        :search-active="false"
        :initial-address="initialAddress"
        :readonly="hasSignature"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AddressLookup from './address-lookup';

export default {
  name: 'ConsultingAgencyInfo',
  components: {
    AddressLookup,
  },

  data() {
    return { ready: false, initialAddress: {} };
  },

  async mounted() {
    this.initialAddress = this.consulting.promoter?.address;

    if (!this.initialAddress.route && this.survey.signature) {
      const { promoterId } = this.survey.signature.promoter;
      await this.fetchBranch(promoterId);
      this.initialAddress = this.branch;
    }

    this.ready = true;
  },

  computed: {
    ...mapState({
      survey: (state) => state.surveys.survey,
      consulting: (state) => state.consulting.result,
      branch: (state) => state.promoters.branch,
      isFetching: (state) => state.error.isFetching,
    }),

    hasSignature() {
      return !!this.consulting?.signature;
    },
  },

  methods: {
    ...mapActions({
      fetchBranch: 'promoters/fetchBranch',
    }),

    triggerFromParent() {
      return {
        data: this.$refs.address.getAddress(),
        valid: this.$refs.address.isValid(),
      };
    },
  },
};
</script>
