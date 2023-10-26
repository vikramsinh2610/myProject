import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiStandardButton from './prassi-standard-button';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });

describe('PrassiStandardButton.vue', () => {
  it('renders PrassiStandardButton component', () => {
    const wrapper = mount(PrassiStandardButton, {
      localVue,
      propsData: {
        label: 'Cancel',
      },
      mocks: {
        $t: () => {},
      },
    });

    expect(wrapper.contains('div')).toBe(true);
  });
});
