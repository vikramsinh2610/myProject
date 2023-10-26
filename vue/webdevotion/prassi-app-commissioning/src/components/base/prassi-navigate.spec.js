import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiNavigate from './prassi-navigate';
import PrassiRoundButton from '../base/prassi-round-button';
import PrassiStandardButton from '../base/prassi-standard-button';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.component('prassi-round-button', PrassiRoundButton);
localVue.component('prassi-standard-button', PrassiStandardButton);

describe('PrassiNavigate.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiNavigate, {
      localVue,
      mocks: {
        $t: () => {},
        $n: () => '100',
      },
    });
  });

  it('renders PrassiNavigate component', () => {
    expect(wrapper.contains('.this-p-btn')).toBe(true);
  });
});
