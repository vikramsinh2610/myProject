<template>
  <div v-if="!hasProduct">
    <div style="margin: 2em 0">
      <q-option-group
        v-model="productType"
        :options="options"
        :type="'radio'"
        size="30px"
        color="primary"
        inline
      />
    </div>

    <inquiry-result
      ref="result"
      v-if="productType === 'SUB'"
      :pick-product="true"
      :product-ids="survey.products"
      :consulting-type="(consulting && consulting.type) || 'noninv'"
      :product-scores="consulting && consulting.adequacy && consulting.adequacy.score"
      :close-consulting="closeConsulting"
    />

    <versamento-aggiuntivo
      ref="versamento-aggiuntivo"
      v-if="productType === 'VA'"
      :consulting-type="(consulting && consulting.type) || 'noninv'"
      :product-scores="consulting && consulting.adequacy && consulting.adequacy.score"
    />
  </div>

  <div v-else>Prodotto: {{ consulting.product.name }}</div>
</template>

<script>
import { mapState } from 'vuex';
import InquiryResult from '../person/inquiry-result';
import VersamentoAggiuntivo from './versamento-aggiuntivo';

export default {
  name: 'ConsultingPickProduct',

  components: {
    InquiryResult,
    VersamentoAggiuntivo,
  },

  props: {
    closeConsulting: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      productType: 'SUB',
      options: [
        { label: 'Sottoscrizione', value: 'SUB' },
        {
          label: 'Versamento aggiuntivo',
          value: 'VA',
        },
      ],
      contracts: [],
    };
  },

  async mounted() {
    this.productType = this.consulting?.product?.type || 'SUB';
  },

  computed: {
    ...mapState({
      survey: (state) => state.surveys.survey,
      consulting: (state) => state.consulting.result,
      isFetching: (state) => state.error.isFetching,
    }),

    hasProduct() {
      return !!this.consulting?.product?.productId;
    },
  },

  methods: {
    triggerFromParent() {
      let product;
      let practiceId;
      let contractId;
      let practiceUuid;

      if (this.hasProduct) {
        return {
          data: {
            productId: this.consulting?.product?.productId,
            type: this.consulting?.product?.type,
            name: this.consulting?.product?.name,
            code: this.consulting?.product?.code,
            company: this.consulting?.product?.company,
            companyId: this.consulting?.product?.companyId,
            category: this.consulting?.product?.category,
            practiceId: this.consulting?.proposalNumber,
            ...(this.consulting?.practiceUuid
              ? { practiceUuid: this.consulting?.practiceUuid }
              : {}),
            ...(this.consulting?.contractId ? { contractId: this.consulting?.contractId } : {}),
            ...(contractId ? { contractId } : {}),
            ...(this.consulting?.product?.isClosed ? { isClosed: true } : {}),
          },
          valid: true,
        };
      }

      if (this.productType === 'SUB') {
        product = this.$refs.result.getSelectedProduct();
      }

      if (this.productType === 'VA') {
        const contract = this.$refs['versamento-aggiuntivo'].getSelectedContract();
        product = contract.product;
        practiceId = contract.practiceId;
        contractId = contract.contractId;
        practiceUuid = contract.practiceUuid;
      }

      return {
        data: {
          productId: product._id,
          type: this.productType,
          name: product.productName,
          code: product.productCode,
          company: product.company,
          companyId: product.companyId,
          category: product.category,
          ...(practiceId ? { practiceId } : {}),
          ...(practiceUuid ? { practiceUuid } : {}),
          ...(contractId ? { contractId } : {}),
          ...(product.isClosed ? { isClosed: true } : {}),
        },
        valid: !!product,
      };
    },
  },
};
</script>
