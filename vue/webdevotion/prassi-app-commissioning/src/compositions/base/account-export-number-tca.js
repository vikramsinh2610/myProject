import { ref, computed, onMounted } from '@vue/composition-api';

const exportNumberTCA = ref([]);
const invoicingId = ref('');
const loadingExportNumberTCA = ref(false);

export const fetchExportNumberTCA = () =>
  global.utils
    .compositionApiCallList({
      url: `/v1/invoicing/${invoicingId.value}/get-tcw-export-number-tca`,
    })
    .then((result) => {
      global.utils.logobj('useExportNumberTCA', 'fetchExportNumberTCA', result);
      loadingExportNumberTCA.value = false;
      exportNumberTCA.value = result.item;
    });

export const setExportNumeberFilterTCA = (filters) => {
  global.utils.logobj('useExportNumberTCA', 'setFilters', filters);
  invoicingId.value = filters;
  loadingExportNumberTCA.value = true;
  return fetchExportNumberTCA();
};

export default function useExportNumberTCA() {
  onMounted(() => {
    global.utils.log('useExportNumberTCA', 'onMounted');
    const actualYear = new Date().getFullYear();
    const actualMonth = new Date().getMonth() + 1;
    invoicingId.value = actualYear.toString() + actualMonth.toString().padStart(2, '0');
    loadingExportNumberTCA.value = true;
    fetchExportNumberTCA();
  });

  return {
    setExportNumeberFilterTCA,
    loadingExportNumberTCA,
    exportNumberTCA: computed(() => exportNumberTCA.value),
  };
}
