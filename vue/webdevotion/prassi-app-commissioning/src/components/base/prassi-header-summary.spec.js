import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiHeaderSummary from './prassi-header-summary';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });

describe('PrassiHeaderSummary.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiHeaderSummary, {
      localVue,
      propsData: {
        blocks: [
          {
            _id: 0,
            title: 'consultants',
            value: 100,
            previousValue: 120,
            percentage: 40,
            currency: false,
            flickr: false,
          },
          {
            _id: 1,
            title: 'consultants',
            value: 100,
            previousValue: 120,
            percentage: 40,
            currency: false,
            flickr: false,
          },
          {
            _id: 2,
            title: 'consultants',
            value: 100,
            previousValue: 120,
            percentage: 40,
            currency: true,
            flickr: false,
          },
          {
            _id: 3,
            title: 'consultants',
            value: 100,
            previousValue: 120,
            percentage: 40,
            currency: false,
            flickr: true,
          },
        ],
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
      },
    });
  });

  it('renders PrassiHeaderSummary component', () => {
    expect(wrapper.contains('.p-hv-main')).toBe(true);
    expect(wrapper.find('.p-hs-opaque').is('div')).toBe(true);
  });
});
