import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiAcquittanceErrorList from './prassi-acquittance-error-list';

const localVue = createLocalVue();
localVue.use(Quasar, {
  components: All,
  directives: All,
  plugins: All,
});

describe('PrassiAcquittanceErrorList.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiAcquittanceErrorList, {
      localVue,
      propsData: {
        closed: false,
        errorPayments: [
          {
            _id: '9200000080-subscription-1',
            calculatedPayin: 5841,
            contractId: '9200000080',
            installment: 1,
            installmentDate: '2018-01-29T00:00:00.000Z',
            ok: false,
            payin: 17491,
            premiumGross: 75000,
            premiumNet: 69971,
            productivePeriodMonth: 1,
            productivePeriodYear: 2018,
            type: 'subscription',
          },
          {
            _id: '9200000080-subscription-2',
            calculatedPayin: 5841,
            contractId: '9200000080',
            installment: 1,
            installmentDate: '2018-01-29T00:00:00.000Z',
            ok: false,
            payin: 17491,
            premiumGross: 75000,
            premiumNet: 69971,
            productivePeriodMonth: 1,
            productivePeriodYear: 2018,
            type: 'subscription',
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

  it('renders PrassiAcquittanceErrorList component', () => {
    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });
});
