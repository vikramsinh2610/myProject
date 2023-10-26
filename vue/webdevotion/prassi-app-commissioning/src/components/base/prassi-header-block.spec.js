import { shallowMount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiHeaderBlock from './prassi-header-block';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });

describe('PrassiHeaderBlock.vue', () => {
  it('renders PrassiHeaderBlock component', () => {
    const wrapper = shallowMount(PrassiHeaderBlock, {
      localVue,
      propsData: {
        title: 'mytitle',
        value: 120,
        previousValue: 60,
        percentage: 50,
        currency: true,
        flickr: true,
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
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

    expect(wrapper.find('.p-hv-title').text()).toMatch('mytitle');
    expect(wrapper.find('.p-hv-value').text()).toMatch('100');
    expect(wrapper.find('.p-hv-pvalue').text()).toMatch('100');
    expect(wrapper.find('.p-hv-percentage').text()).toMatch('50%');
    expect(wrapper.contains('div')).toBe(true);
  });
});
