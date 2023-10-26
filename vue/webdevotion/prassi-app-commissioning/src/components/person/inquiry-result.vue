<template>
  <div>
    <section v-if="!isFetching && availableProducts.length > 0">
      <div style="margin-bottom: 2em">
        L'analisi dei bisogni consente di collocare i seguenti prodotti:
        <h5>{{ allCategories() }}</h5>
      </div>

      <div>
        <q-card style="width: 100%" inline flat color="white" text-color="primary">
          <q-card-actions class="row q-px-md">
            <q-input
              class="col"
              v-model="searchProduct"
              debounce="500"
              clearable
              placeholder="Cerca prodotto"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-select
              class="col q-ml-lg select-ellipsis"
              use-input
              clearable
              v-model="selectedCompanyId"
              label="Cerca Società"
              :options="optionsCompanies"
            />
            <q-select
              class="col q-ml-lg select-ellipsis"
              use-input
              clearable
              v-model="selectedCategoryId"
              label="Cerca categoria"
              :options="optionsCategories"
            />
          </q-card-actions>
        </q-card>
      </div>
      <prassi-header-list :blocks="myHeader" class="p-ll-item" />

      <div style="height: 300px; overflow: scroll">
        <div v-for="p in sortedProducts" :key="p._id" class="p-pl-promoter-item">
          <prassi-body-list
            :id="p._id"
            :blocks="myBody(p)"
            :checkbox="pickProduct"
            :checked="p._id == selectedProduct"
            @changedChecked="toggleProduct"
          />
        </div>
      </div>
    </section>

    <section v-if="!isFetching && availableProducts.length == 0">
      <div>Non ci sono prodotti collocabili</div>
      <prassi-standard-button
        class="q-mb-lg"
        label="Chiudi consulenza"
        @click="
          isClosed = true;
          closeConsulting();
        "
      />
    </section>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';

export const QUESTION_IDS = new Set([
  '03-14-obiettivi',
  '04-16-rischio',
  '05-17-rischio',
  '06-18-patrimonio',
  '06-19-propensione',
  '06-19-propensione1',
  '06-19-propensione2',
]);

export default {
  name: 'InquiryResult',

  components: { PrassiHeaderList, PrassiBodyList },

  // Can either take a `form` instance or a list of `productIds`.
  // The form is used when compiling the survey,
  // to show which products match given the answers to the survey.
  // The productIds is used during consulting,
  // where we take the existing list of product ids
  // previously saved in the survey, and just show it so that
  // one product can be picked.
  // `productScores` is also used during consulting, to filter out products that scored below 50.
  // `consultingType` is used to filter out `noninv` or `inv` products.
  props: {
    form: {
      type: Object,
      default: undefined,
    },

    productIds: {
      type: Array,
      default: undefined,
    },

    productScores: {
      type: Object,
      default: undefined,
    },

    consultingType: {
      type: String,
      default: undefined, // 'inv' | 'noninv'
    },

    pickProduct: {
      type: Boolean,
      default: false,
    },

    closeConsulting: {
      type: Function,
      default: () => {},
    },

    storeProductsForSurvey: {
      type: String,
      default: undefined, // survey resultId so that matchingProducts can be stored
    },
  },

  data() {
    return {
      selectedCompanyId: undefined,
      selectedCategoryId: undefined,
      searchProduct: '',
      selectedProduct: undefined,
      isClosed: false,
      myHeader: [
        // {
        //   _id: '1',
        //   label: 'Società',
        //   sublabel: '',
        //   size: 'small',
        //   weight: 'normal',
        //   width: 200,
        // },
        {
          _id: '2',
          label: 'Nome',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 400,
          col: true,
        },
        // {
        //   _id: '3',
        //   label: 'Categoria',
        //   sublabel: '',
        //   size: 'small',
        //   weight: 'normal',
        //   width: 400,
        //   col: true,
        // },
      ],
    };
  },

  async mounted() {
    // eslint-disable-next-line unicorn/prefer-ternary
    if (this.productIds) {
      await this.fetchProductsById(this.productIds);
    } else {
      await this.fetchMatchingProducts(this.form || {});
    }

    const resultId = this.storeProductsForSurvey;
    if (!resultId) return;

    // Store products that can be selected from this survey
    // so that when starting consulting
    // we already have all the products available and don't need
    // to resurrect the form to compute the answer to survey questions
    const products = this.availableProducts.map((p) => p._id);
    this.storeMatchingProducts({
      resultId,
      products,
      categories: this.optionsCategories,
    });
  },

  computed: {
    ...mapState({
      products: (state) => state.configuration.products.items,
      isCompany: (state) => state.dossiers.customer.isCompany,
      isFetching: (state) => state.error.isFetching,
    }),

    availableProducts() {
      return this.products.filter((p) => {
        if (!p.productAvailable) return false;

        // filter products by category
        const isInvestimento = p.category.toLowerCase().includes('investimento');
        if (this.consultingType === 'inv' && !isInvestimento) return false;
        if (this.consultingType === 'noninv' && isInvestimento) return false;

        // products of type 'default' are always visible
        const surveyType = this.isCompany ? p.surveyTypeCompany : p.surveyTypePerson;
        if (surveyType === 'default') return true;
        if (!this.productScores) return true;

        // if a score is available, the product should have scored less than 50
        const score = this.productScores[surveyType];
        if (score && score >= 50) return false;

        return true;
      });
    },

    sortedProducts() {
      const filtered = this.availableProducts.filter((p) => {
        if (this.searchProduct) {
          const match = this.searchProduct.toLowerCase();
          return (
            p.productName.toLowerCase().includes(match) || p.company.toLowerCase().includes(match)
          );
        }

        if (this.selectedCategoryId && p.category !== this.selectedCategoryId) return false;
        if (this.selectedCompanyId && p.company !== this.selectedCompanyId) return false;

        return true;
      });

      const copy = [...filtered];
      copy.sort((a, b) => (a.productName > b.productName ? 1 : -1));
      return copy;
    },

    optionsCompanies() {
      const result = new Set();
      this.availableProducts.forEach((p) => result.add(p.company));
      const sorted = [...result];
      sorted.sort();
      return sorted;
    },
    optionsCategories() {
      const result = new Set();
      this.availableProducts.forEach((p) => result.add(p.category));
      const sorted = [...result];
      sorted.sort();
      return sorted;
    },
  },

  methods: {
    ...mapActions({
      fetchProducts: 'configuration/fetchProducts',
      storeMatchingProducts: 'surveys/storeMatchingProducts',
    }),
    ...mapMutations({
      resetProducts: 'configuration/resetProducts',
      setProductSurveyResponses: 'configuration/setProductSurveyResponses',
      setProductIds: 'configuration/setProductIds',
    }),

    myBody(product) {
      return [
        // {
        //   _id: '1',
        //   label: product.company,
        //   size: 'small',
        //   weight: 'normal',
        //   width: 200,
        //   type: '2rows',
        // },
        {
          _id: '2',
          label: product.productName,
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 1000,
          col: true,
        },
        // {
        //   _id: '3',
        //   label: product.category,
        //   sublabel: '',
        //   size: 'small',
        //   weight: 'normal',
        //   width: 400,
        //   col: true,
        // },
      ];
    },

    toggleProduct(event) {
      if (event.checked) {
        this.selectedProduct = event.id;
      }
    },

    getSelectedProduct() {
      if (this.isClosed) {
        return { isClosed: true };
      }

      return this.products.find((p) => p._id === this.selectedProduct);
    },

    allCategories() {
      const categories = new Set();
      this.availableProducts.forEach((p) => categories.add(p.category));
      return [...categories].join(' - ');
    },

    async fetchMatchingProducts(form) {
      const responses = Object.entries(form).reduce((acc, [id, values]) => {
        if (QUESTION_IDS.has(id) && values) {
          if (!Array.isArray(values)) {
            values = [values];
          }
          values.forEach((v) => acc.push(v));
        }
        return acc;
      }, []);

      this.resetProducts();
      this.setProductSurveyResponses(responses);
      await this.fetchProducts();
    },

    async fetchProductsById(productIds) {
      this.resetProducts();
      this.setProductIds(productIds);
      await this.fetchProducts();
    },
  },
};
</script>
