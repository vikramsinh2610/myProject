import { ref, computed, onMounted } from '@vue/composition-api';

const products = ref([]);
const companyId = ref('no-selection');
const loadingProducts = ref(false);

export const fetchProducts = () =>
  global.utils
    .compositionApiCallList({
      url: `/v1/products${companyId.value ? `?companyId=${companyId.value}` : ''}`,
    })
    .then((result) => {
      global.utils.logobj('useProducts', 'fetchProducts', result);
      loadingProducts.value = false;
      products.value = result.items;
    });

export const setProductsFilter = (filters) => {
  global.utils.logobj('useProducts', 'setFilters', filters);
  companyId.value =
    filters.company && filters.company !== 'no-selection' ? filters.company : undefined;
  loadingProducts.value = true;
  fetchProducts();
};

export default function useProducts() {
  onMounted(() => {
    global.utils.log('useProducts', 'onMounted');
    companyId.value = undefined;
    loadingProducts.value = true;
    fetchProducts();
  });

  return {
    setProductsFilter,
    loadingProducts,
    companyId,
    products: computed(() => products.value),
    productsList: computed(() =>
      products.value.map((el) => ({
        label: el.name,
        value: el._id,
      })),
    ),
  };
}
