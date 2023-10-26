import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiConditionalBlock from './prassi-conditional-block';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });

describe('PrassiConditionalBlock.vue', () => {
  it('renders PrassiConditionalBlock CHIP component', () => {
    const wrapper = mount(PrassiConditionalBlock, {
      localVue,
      propsData: {
        label: 'label',
        sublabel: 'sublabel',
        sublabelChip: false,
        size: 'small',
        weight: 'light',
        width: 70,
        type: 'chip',
        icon: 'fa-check',
        color: 'green',
        chipText: 'Ct',
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
      },
    });

    expect(wrapper.contains('.p-c-chip')).toBe(true);
    expect(wrapper.contains('.p-c-fit')).toBe(true);
  });

  it('renders PrassiConditionalBlock TWOROWS component', () => {
    const wrapper = mount(PrassiConditionalBlock, {
      localVue,
      propsData: {
        label: 'label',
        sublabel: 'sublabel',
        sublabelChip: false,
        size: 'small',
        weight: 'light',
        width: 70,
        type: '2rows',
        icon: 'fa-check',
        color: 'green',
        chipText: 'Ct',
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
      },
    });

    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.contains('.p-c-fit')).toBe(true);
  });

  it('renders PrassiConditionalBlock ICON component', () => {
    const wrapper = mount(PrassiConditionalBlock, {
      localVue,
      propsData: {
        label: 'label',
        sublabel: 'sublabel',
        sublabelChip: false,
        size: 'small',
        weight: 'light',
        width: 70,
        type: 'icon',
        icon: 'fa-check',
        color: 'green',
        chipText: 'Ct',
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
      },
    });

    expect(wrapper.contains('.p-c-icon')).toBe(true);
    expect(wrapper.contains('.p-c-fit')).toBe(true);
  });
});
