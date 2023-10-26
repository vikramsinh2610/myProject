import { createLocalVue, shallowMount } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiAccountingList from './prassi-accounting-list';

// eslint-disable-next-line unicorn/no-reduce
const components = Object.keys(All).reduce((object, key) => {
  const value = All[key];
  if (value && value.component && value.component.name !== undefined) {
    object[key] = value;
  }
  return object;
}, {});

const localVue = createLocalVue();
localVue.use(Quasar, {
  components,
  directives: All,
  plugins: All,
});

describe('PrassiAccountingList.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiAccountingList, {
      localVue,
      propsData: {
        transactions: [
          {
            _id: '000000000',
            didClosedDate: '2018-05-30T15:43:48+00:00',
            didOpenedDate: '2018-05-30T15:43:48+00:00',
            productivePeriodMonth: 1,
            productivePeriodYear: 2017,
            status: 'open',
            income: 100000,
            outcome: 100000,
            margin: 100000,
          },
          {
            _id: '000000002',
            didClosedDate: '2018-05-30T15:43:48+00:00',
            didOpenedDate: '2018-05-30T15:43:48+00:00',
            productivePeriodMonth: 1,
            productivePeriodYear: 2017,
            status: 'open',
            income: 100000,
            outcome: 100000,
            margin: 100000,
          },
          {
            _id: '000000003',
            didClosedDate: '2018-05-30T15:43:48+00:00',
            didOpenedDate: '2018-05-30T15:43:48+00:00',
            productivePeriodMonth: 1,
            productivePeriodYear: 2017,
            status: 'open',
            income: 100000,
            outcome: 100000,
            margin: 100000,
          },
        ],
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
        $d: () => 'data',
        $env: { alpha: false },
        $utils: {
          isoToDisplayDate() {
            return '';
          },
          numberToMonth() {
            return 'gennaio';
          },
          numberToRate() {
            return 'yearly';
          },
          logobj() {
            return '';
          },
          log() {
            return '';
          },
        },
        $route: {
          name: '',
        },
      },
    });
  });

  it('renders PrassiAccountingList component', () => {
    expect(wrapper.contains('.p-item')).toBe(true);
  });
});
