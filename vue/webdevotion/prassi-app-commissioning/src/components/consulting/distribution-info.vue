<template>
  <div style="margin: 2em 0; text-align: center">
    <div v-if="company">
      <div v-if="company.type === 'impresa'">
        Il contratto viene distribuito per conto della seguente Impresa di Assicurazione:
        <hr />
        <br />
        Impresa: {{ company.name }}
        <br />
        Con iscrizione {{ company.ivass }}
      </div>

      <div v-else>
        {{ /* Intermediario */ }}
        Il contratto viene distribuito in collaborazione con altri intermediari ai sensi
        dell’articolo 22, comma 10, del decreto legge 18 ottobre 2012, n. 179, convertito nella
        legge 17 dicembre 2012, n. 221:
        <hr />
        <br />
        Intermediario: {{ company.name }}
        <br />
        Con numero di iscrizione RUI: {{ company.rui }}
        <br />
        Collocatore principalmente di polizze di {{ company.principalCompany }}
      </div>

      Con riferimento al rischio collocato si precisa che la distribuzione viene effettuata: <br />
      {{ riskText }}
    </div>

    <div v-if="!company && !isFetching">
      Testo distribuzione non presente. ({{ product.company.name }} / {{ product.company.code }} )
    </div>
  </div>
</template>

<script>
// these are derived from the documents "ALLEGATO 4"
const SCRIPT = {
  companies: [
    {
      id: '15',
      name: 'ARCA',
      ivass: 'N. 47 – ALBO SGR',
      riskText: 0,
      type: 'impresa',
    },
    {
      id: '03',
      name: 'MUTUA TRE ESSE',
      ivass: 'NESSUNO',
      riskText: 3,
      type: 'impresa',
    },
    {
      id: '25',
      name: 'MUTUA DES',
      ivass: 'NESSUNO',
      riskText: 3,
      type: 'impresa',
    },
    {
      id: '16',
      name: 'ARAG',
      ivass: 'N. I.00108 – ALBO IVASS',
      riskText: 0,
      type: 'impresa',
    },
    {
      id: '22',
      name: 'BENE ASSICURAZIONI',
      ivass: 'N. I.00180 – ALBO IVASS',
      riskText: 0,
      type: 'impresa',
    },
    {
      id: '052',
      name: 'ALLIANZ DARTA SAVING',
      ivass: 'N. II.00409 – ALBO IVASS',
      riskText: 1,
      type: 'impresa',
    },
    {
      id: '(missing)',
      name: 'ELIPS LIFE',
      ivass: 'N. I.00131 – ALBO IVASS',
      riskText: 0,
      type: 'impresa',
    },
    {
      id: '08',
      name: 'EUROP ASSISTANCE',
      ivass: 'N. I.00108 – ALBO IVASS',
      riskText: 0,
      type: 'impresa',
    },
    {
      id: '18',
      name: 'FWU',
      ivass: 'N. II.00065 – ALBO IVASS',
      riskText: 1,
      type: 'impresa',
    },
    {
      id: '001',
      name: 'HELVETIA',
      ivass: 'N. II.00002 – ALBO IVASS',
      riskText: 0,
      type: 'impresa',
    },
    {
      id: '05',
      name: 'ITALIANA ASSICURAZIONI',
      ivass: 'N. I.00004 – ALBO IVASS',
      riskText: 0,
      type: 'impresa',
    },
    {
      id: '06',
      name: 'METLIFE',
      ivass: 'N. I.00110 – ALBO IVASS',
      riskText: 0,
      type: 'impresa',
    },
    {
      id: '12',
      name: 'INTESA SANPAOLO RBM SALUTE ',
      ivass: 'N. I.00161 – ALBO IVASS',
      riskText: 0,
      type: 'impresa',
    },
    {
      id: '04',
      name: 'ZURICH ',
      ivass: 'N. I.00066 – ALBO IVASS',
      riskText: 1,
      type: 'impresa',
    },
    {
      id: '26',
      name: 'UNIPOLSAI',
      rui: 'N. I.00006 - ALBO IVASS',
      riskText: 0,
      type: 'impresa',
    },
    {
      id: '24',
      name: 'ASFALIA SRL',
      rui: 'A 000052375',
      principalCompany: 'ITALIANA ASSICURAZIONI',
      riskText: 1,
      type: 'intermediario',
    },
    {
      id: '11',
      name: 'ASSIGECO SRL',
      rui: 'B 000099506',
      principalCompany: 'LLOYD’S',
      riskText: 1,
      type: 'intermediario',
    },
    {
      id: '20',
      name: 'BI & PI SRL',
      rui: 'B 000558173',
      principalCompany: 'UNIPOL SAI, ITAS, AIG',
      riskText: 1,
      type: 'intermediario',
    },
    {
      id: '17',
      name: 'LINK SRL',
      rui: 'A 000401037',
      principalCompany: 'LLOYD’S',
      riskText: 1,
      type: 'intermediario',
    },
    {
      id: '19',
      name: 'SGARZANI & C SRL',
      rui: 'A 000090343',
      principalCompany: 'AXA ASSICURAZIONI ',
      riskText: 1,
      type: 'intermediario',
    },
    {
      id: '23',
      name: 'EQA LIFE SRL',
      rui: 'B 000482850',
      principalCompany: 'NOVIS',
      riskText: 1,
      type: 'intermediario',
    },
    {
      id: '21',
      name: 'ASSIOMA SERVICESRL ',
      rui: 'B000599551',
      principalCompany: 'AMTRUST',
      riskText: 1,
      type: 'intermediario',
    },
    {
      id: '07',
      name: 'ASSIONE SRL',
      rui: 'A 000300886',
      principalCompany: 'ZURICH',
      riskText: 2,
      type: 'intermediario',
    },
    {
      id: '09',
      name: 'ITALNEXT SRL',
      rui: 'A 000531290',
      principalCompany: 'ITALIANA ASSICURAZIONI',
      riskText: 2,
      type: 'intermediario',
    },
    {
      id: '23',
      name: 'EQA LIFE SRL',
      rui: 'B000482850',
      principalCompany: 'NOVIS',
      riskText: 1,
      type: 'intermediario',
    },
  ],
  riskText: [
    'Con autorizzazione ex art. 118 Cap pagamento liberatorio garantito da conto separato ex art. 117 cap',
    'Senza autorizzazione ex art. 118 Cap pagamento non liberatorio',
    'Con accordo ratificato ex art. 118 Cap pagamento liberatorio garantito da conto separato ex art. 117 cap',
    'Nessuno',
  ],
  alias: [],
};
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ConsultingDistributionInfo',
  components: {},
  data() {
    return {
      company: undefined,
      riskText: undefined,
    };
  },
  async mounted() {
    await this.fetchConfigurationProduct(this.consulting.product.productId);
    let companyId = this.product.company.code;
    // Check company aliases and swap id if found
    /* eslint-disable no-restricted-syntax */
    for (const alias of SCRIPT.alias) {
      if (alias.source === companyId) {
        companyId = alias.target;
      }
    }
    // Fetch the correct script based on the productId chosen
    this.company = SCRIPT.companies.find((x) => x.id === companyId);
    if (this.company) {
      this.riskText = SCRIPT.riskText[this.company.riskText];
    }
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
      const { company, riskText } = this;
      return {
        data: { company, riskText },
        valid: company && riskText,
      };
    },
  },
};
</script>
