import { ref, computed, onMounted } from '@vue/composition-api';

const exportNumber = ref([]);
const invoicingId = ref('');
const loadingExportNumber = ref(false);

export const fetchExportNumber = () =>
  global.utils
    .compositionApiCallList({
      url: `/v1/invoicing/${invoicingId.value}/get-tcw-export-number`,
    })
    .then((result) => {
      global.utils.logobj('useExportNumber', 'fetchExportNumber', result);
      loadingExportNumber.value = false;
      exportNumber.value = result.item;
    });

export const setExportNumeberFilter = (filters) => {
  global.utils.logobj('useProducts', 'setFilters', filters);
  invoicingId.value = filters;
  loadingExportNumber.value = true;
  return fetchExportNumber();
};

export default function useExportNumber() {
  onMounted(() => {
    global.utils.log('useExportNumber', 'onMounted');
    const actualYear = new Date().getFullYear();
    const actualMonth = new Date().getMonth() + 1;
    invoicingId.value = actualYear.toString() + actualMonth.toString().padStart(2, '0');
    loadingExportNumber.value = true;
    fetchExportNumber();
  });

  return {
    setExportNumeberFilter,
    loadingExportNumber,
    exportNumber: computed(() => exportNumber.value),
  };
}
