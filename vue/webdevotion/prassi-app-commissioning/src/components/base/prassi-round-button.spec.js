import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiRoundButton from './prassi-round-button';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });

describe('PrassiRoundButton.vue', () => {
  it('renders PrassiRoundButton component', () => {
    const wrapper = mount(PrassiRoundButton, {
      localVue,
      propsData: {
        size: 'small',
        icon: 'check',
        borderColor: 'black',
        dark: true,
      },
      mocks: {
        $t: () => {},
      },
    });

    expect(wrapper.contains('div')).toBe(true);
  });
});
