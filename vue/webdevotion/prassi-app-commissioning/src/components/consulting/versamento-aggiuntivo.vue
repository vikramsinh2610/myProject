<template>
  <div v-if="contracts.length === 0">Nessun contratto valido</div>
  <div v-else>
    <div style="margin-bottom: 2em">
      <h5>{{ allCategories() }}</h5>
      <p>Selezionare il contratto su cui fare il versamento aggiuntivo</p>
    </div>

    <prassi-header-list :blocks="myHeader" class="p-ll-item" />

    <div style="height: 300px; overflow: scroll">
      <div v-for="c in contracts" :key="c.practiceId" class="p-pl-promoter-item">
        <prassi-body-list
          :id="c.practiceId"
          :blocks="myBody(c)"
          :checkbox="true"
          :checked="c.practiceId == selectedContract"
          @changedChecked="toggleContract"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-restricted-syntax, no-continue */
import { mapState, mapActions, mapMutations } from 'vuex';
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import CONSTANTS from '../../constants';

export default {
  name: 'ConsultingVersamentoAggiuntivo',

  components: { PrassiHeaderList, PrassiBodyList },

  props: {
    consultingType: {
      type: String,
      default: undefined, // 'inv' | 'noninv'
    },
    productScores: {
      type: Object,
      default: undefined,
    },
  },

  data() {
    return {
      selectedContract: undefined,
      contracts: [],
      myHeader: [
        {
          _id: '1',
          label: 'Società',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '2',
          label: 'Nome',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 400,
          col: true,
        },
        {
          _id: '3',
          label: 'Contratto',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 400,
          col: true,
        },
      ],
    };
  },

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async mounted() {
    const res = await this.fetchPersonDossiers({
      customerId: this.$route.params.id,
      skipReceive: true,
    });

    const contracts = res.items;

    if (contracts.length) {
      // for each contract, fetch the product so that we know if VA is allowed
      const productIds = contracts.map((c) => c.productId);
      this.resetProducts();
      this.setProductIds(productIds);
      const products = await this.fetchProducts({ skipReceive: true });

      for (const c of contracts) {
        const p = products.items.find((x) => x._id === c.productId);

        if (!p.productAvailable) continue;
        if (!p.versamentoAggiuntivoAllowed) continue;
        if (c.practiceType !== 'subscription') continue;
        if (c.status !== CONSTANTS.practiceStatus.IN_VIGORE) continue;

        // filter products by category
        const isInvestimento = p.category.toLowerCase().includes('investimento');
        if (this.consultingType === 'inv' && !isInvestimento) continue;
        if (this.consultingType === 'noninv' && isInvestimento) continue;

        const scoreIsGood = (() => {
          // products of type 'default' are always visible
          const surveyType = this.isCompany ? p.surveyTypeCompany : p.surveyTypePerson;
          if (surveyType === 'default') return true;
          if (!this.productScores) return true;

          // if a score is available, the product should have scored less than 50
          const score = this.productScores[surveyType];
          if (score && score >= 50) return false;

          return true;
        })();

        if (!scoreIsGood) continue;

        this.contracts.push({
          ...c,
          product: p,
        });
      }
    }
  },

  computed: {
    ...mapState({
      isCompany: (state) => state.dossiers.customer.isCompany,
      isFetching: (state) => state.error.isFetching,
    }),
  },

  methods: {
    ...mapActions({
      fetchPersonDossiers: 'dossiers/fetchPersonDossiers',
      fetchProducts: 'configuration/fetchProducts',
    }),
    ...mapMutations({
      resetProducts: 'configuration/resetProducts',
      setProductIds: 'configuration/setProductIds',
    }),

    allCategories() {
      const categories = new Set();
      this.contracts.forEach((c) => categories.add(c.product.category));
      return [...categories].join(' - ');
    },

    myBody(contract) {
      return [
        {
          _id: '1',
          label: contract.product.company,
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: '2',
          label: contract.product.productName,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 400,
          col: true,
        },
        {
          _id: '3',
          label: contract.practiceId,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 400,
          col: true,
        },
      ];
    },

    toggleContract(event) {
      if (event.checked) {
        this.selectedContract = event.id;
      }
    },

    getSelectedContract() {
      return this.contracts.find((c) => c.practiceId === this.selectedContract);
    },
  },
};
</script>
