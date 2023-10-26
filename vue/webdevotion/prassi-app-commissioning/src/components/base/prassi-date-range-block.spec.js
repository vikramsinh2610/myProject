import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiDateRangeBlock from './prassi-date-range-block';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });

describe('PrassiDateRangeBlock.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiDateRangeBlock, {
      localVue,
      propsData: {
        type: Object,
        default: () => ({
          selected: 'year',
          year: 2018,
          quarter: 1,
          month: 1,
        }),
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
          numberToMonth() {
            return '';
          },
          quarterToMonth() {
            return 'Q1';
          },
          monthToQuarter() {
            return 0;
          },
          log() {
            return '';
          },
        },
      },
    });
  });

  it('button month click should change to year', () => {
    jest.useFakeTimers();
    const tabs = wrapper.findAll({ name: 'QTab' });
    tabs.at(2).trigger('click');
    jest.runAllTimers();
    expect(wrapper.emitted().changed).toBeTruthy();
  });

  it('renders PrassiDateRangeBlock component', () => {
    expect(wrapper.find('.p-dr-text-year').text()).toContain('/2019');
  });

  it('button right click should increment the year', () => {
    const tabs = wrapper.findAll({ name: 'QTab' });
    tabs.at(2).trigger('click');
    const button = wrapper.find('#right');
    button.trigger('click');
    expect(wrapper.find('.p-dr-text-year').text()).toContain('/2019');
  });

  it('button left click should decrement the year', () => {
    const button = wrapper.find('#left');
    button.trigger('click');
    expect(wrapper.find('.p-dr-text-year').text()).toContain('/2019');
  });
});
