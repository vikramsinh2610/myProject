<template>
  <div>
    Numero proposta assegnato automaticamente dal sistema in base al prodotto scelto:
    <hr />

    <div style="margin: 2em 0; text-align: center">
      {{ consulting.proposalNumber }} <br />
      {{ product.productName }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ConsultingProposalNumber',
  props: {},

  data() {
    return {};
  },

  async mounted() {
    await this.fetchConfigurationProduct(this.consulting.product.productId);
  },

  computed: {
    ...mapState({
      product: (state) => state.configuration.product,
      consulting: (state) => state.consulting.result,
      isFetching: (state) => state.error.isFetching,
    }),
  },

  methods: {
    ...mapActions({
      fetchConfigurationProduct: 'configuration/fetchProduct',
    }),

    triggerFromParent() {
      return { data: true, valid: true };
    },
  },
};
</script>
