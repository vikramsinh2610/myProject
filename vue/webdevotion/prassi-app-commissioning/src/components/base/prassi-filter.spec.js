import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiFilter from './prassi-filter';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });

describe('PrassiFilter.vue', () => {
  it('renders PrassiFilter component', () => {
    jest.useFakeTimers();

    const wrapper = mount(PrassiFilter, {
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
        $utils: {
          isoToDisplayDate() {
            return '';
          },
          promoterColor() {
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

    const tabs = wrapper.findAll({ name: 'QTab' });
    tabs.at(0).trigger('click');
    jest.clearAllTimers();
    expect(wrapper.emitted().changed).toBeTruthy();
  });
});
