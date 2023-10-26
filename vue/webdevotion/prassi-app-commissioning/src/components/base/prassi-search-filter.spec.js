import { shallowMount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import Vuelidate from 'vuelidate';
import PrassiSearchFilter from './prassi-search-filter';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.use(Vuelidate);

describe('PrassiSearchFilter.vue', () => {
  it('renders PrassiSearchFilter component', () => {
    jest.useFakeTimers();

    const wrapper = shallowMount(PrassiSearchFilter, {
      localVue,
      propsData: {
        filter: {
          type: Object,
          default: () => ({
            selected: 'indirect',
          }),
        },
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
        $env: { alpha: false },
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

    const tabs = wrapper.findAll({ name: 'QSearch' });
    tabs.at(0).trigger('click');
  });
});
