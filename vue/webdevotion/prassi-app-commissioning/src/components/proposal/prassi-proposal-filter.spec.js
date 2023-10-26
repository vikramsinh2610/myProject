import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiProposalFilter from './prassi-proposal-filter';
import PrassiRoundButton from '../base/prassi-round-button';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.component('prassi-round-button', PrassiRoundButton);

describe('PrassiProposalFilter.vue', () => {
  it('renders PrassiProposalFilter component', () => {
    jest.useFakeTimers();

    const wrapper = mount(PrassiProposalFilter, {
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
    jest.runAllTimers();
    expect(wrapper.emitted().changed).toBeTruthy();
  });
});
