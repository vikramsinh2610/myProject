import { shallowMount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import Vuelidate from 'vuelidate';
import PrassiPromoterLetterFilter from './prassi-promoter-letter-filter';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.use(Vuelidate);

describe('PrassiPromoterLetterFilter.vue', () => {
  it('renders PrassiPromoterLetterFilter component', () => {
    jest.useFakeTimers();

    // eslint-disable-next-line no-unused-vars
    const wrapper = shallowMount(PrassiPromoterLetterFilter, {
      localVue,
      propsData: {
        filter: {
          type: Object,
          default: () => ({
            selected: 'all',
          }),
        },
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
        $d: () => 'data',
        $utils: {
          isoToDisplayDate() {
            return '';
          },
          logobj() {
            return '';
          },
          log() {
            return '';
          },
        },
      },
    });
  });
});
