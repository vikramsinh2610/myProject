import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiInvoicingList from './prassi-invoicing-list';

const localVue = createLocalVue();
localVue.use(Quasar, {
  components: All,
  directives: All,
  plugins: All,
});

localVue.component('q-page-sticky', {
  template: '<div><slot /></div>',
});

describe('PrassiInvoicingList.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiInvoicingList, {
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

  it('renders PrassiInvoicingList component', () => {
    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });
});
