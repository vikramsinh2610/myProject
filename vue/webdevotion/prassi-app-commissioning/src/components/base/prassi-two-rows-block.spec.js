import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, { QChip } from 'quasar';
import PrassiTwoRowsBlock from './prassi-two-rows-block';

const localVue = createLocalVue();
localVue.use(Quasar, {
  components: [QChip],
});

describe('prassi-two-rows-block.vue', () => {
  it('renders prassi-two-rows-block component', () => {
    const wrapper = mount(PrassiTwoRowsBlock, {
      localVue,
      propsData: {
        label: 'mylabel',
        sublabel: 'mysublabel',
        sublabelchip: true,
        border: true,
        color: 'red',
        size: 'small',
        width: 100,
        weight: 'medium',
      },
      mocks: {
        $t: () => {},
      },
    });

    expect(wrapper.text().includes('mylabel')).toBe(true);
    expect(wrapper.contains('div')).toBe(true);
  });
});
