import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiCommissioningTotalBalanceList from './prassi-commissioning-total-balance-list';

const localVue = createLocalVue();
localVue.use(Quasar, {
  components: All,
  directives: All,
  plugins: All,
});

describe('PrassiCommissioningTotalBalanceList.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiCommissioningTotalBalanceList, {
      localVue,
      propsData: {
        closed: false,
        installments: [
          {
            _id: '100055133-13',
            companyId: 'HELVETIA',
            companyName: 'HELVETIA',
            confirmed: false,
            contractId: '940011030',
            dossierId: '100055133',
            dueDate: '2015-09-23T00:00:00.000Z',
            edited: false,
            included: true,
            installment: 13,
            installmentPerYear: 12,
            payin: 50000,
            paymentDate: '',
            payout: 5000,
            premiumGross: 12000000,
            premiumNet: 12000000,
            productId: '264',
            productName: 'Helvetia Aequa - PIP',
            productivePeriodMonth: 9,
            productivePeriodYear: 2016,
            type: 'cash-in',
          },
          {
            _id: '000000002',
            companyId: 'HELVETIA',
            companyName: 'HELVETIA',
            confirmed: false,
            contractId: '940011030',
            dossierId: '100055133',
            dueDate: '2015-09-23T00:00:00.000Z',
            edited: false,
            included: true,
            installment: 13,
            installmentPerYear: 12,
            payin: 50000,
            paymentDate: '',
            payout: 5000,
            premiumGross: 12000000,
            premiumNet: 12000000,
            productId: '264',
            productName: 'Helvetia Aequa - PIP',
            productivePeriodMonth: 9,
            productivePeriodYear: 2016,
            type: 'cash-in',
          },
          {
            _id: '000000003',
            companyId: 'HELVETIA',
            companyName: 'HELVETIA',
            confirmed: false,
            contractId: '940011030',
            dossierId: '100055133',
            dueDate: '2015-09-23T00:00:00.000Z',
            edited: false,
            included: true,
            installment: 13,
            installmentPerYear: 12,
            payin: 50000,
            paymentDate: '',
            payout: 5000,
            premiumGross: 12000000,
            premiumNet: 12000000,
            productId: '264',
            productName: 'Helvetia Aequa - PIP',
            productivePeriodMonth: 9,
            productivePeriodYear: 2016,
            type: 'cash-in',
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

  it('renders PrassiCommissioningTotalBalanceList component', () => {
    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });
});
