import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiHeaderList from './prassi-header-list';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });

describe('PrassiHeaderList.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiHeaderList, {
      localVue,
      propsData: {
        blocks: [
          {
            _id: 0,
            label: 'label',
            sublabel: 'sublabel',
            size: 'small',
            weight: 'light',
            width: 70,
          },
          {
            _id: 1,
            label: 'label',
            sublabel: 'sublabel',
            size: 'small',
            weight: 'medium',
            width: 100,
          },
          {
            _id: 2,
            label: 'label',
            sublabel: 'sublabel',
            size: 'medium',
            weight: 'medium',
            width: 100,
          },
          {
            _id: 3,
            label: 'label',
            sublabel: 'sublabel',
            size: 'large',
            weight: 'large',
            width: 100,
          },
        ],
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
      },
    });
  });

  it('renders PrassiHeaderList component', () => {
    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });
});
