import { ref, computed, onMounted } from '@vue/composition-api';

const headings = ref([]);
const loadingHeadings = ref(false);

export const fetchHeadings = () =>
  global.utils
    .compositionApiCallList({
      url: `/v1/invoices/headings`,
    })
    .then((result) => {
      global.utils.logobj('useHeadings', 'fetchHeadings', result);
      loadingHeadings.value = false;
      headings.value = result.items;
    });

export default function useHeadings() {
  onMounted(() => {
    global.utils.log('useHeadings', 'onMounted');
    loadingHeadings.value = true;
    fetchHeadings();
  });

  return {
    loadingHeadings,
    headings: computed(() => headings.value),
    headingsList: computed(() =>
      headings.value.map((el) => ({
        label: el.name,
        value: el,
      })),
    ),
  };
}
