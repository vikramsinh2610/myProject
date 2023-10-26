import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiInvoicingTotalNetworkSummary from './prassi-invoicing-total-network-summary';

const localVue = createLocalVue();
localVue.use(Quasar, {
  components: All,
  directives: All,
  plugins: All,
});

describe('PrassiInvoicingTotalNetworkSummary.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiInvoicingTotalNetworkSummary, {
      localVue,
      propsData: {
        closed: false,
        network: [
          {
            _id: '100055133-13',
            advanceDirectAmount: 0,
            advanceIndirectAmount: 1500,
            'cash-inDirectAmount': 0,
            'cash-inIndirectAmount': 9000,
            displayName: 'Emanuele Pileri',
            'management-feeDirectAmount': 0,
            'management-feeIndirectAmount': 0,
            path: '03 SARDEGNA / 02 SASSARI',
            purchaseDirectAmount: 0,
            purchaseIndirectAmount: 7500,
            roleId: 'branch-manager',
            totalAmount: 18000,
          },
          {
            _id: '000000002',
            advanceDirectAmount: 0,
            advanceIndirectAmount: 1500,
            'cash-inDirectAmount': 0,
            'cash-inIndirectAmount': 9000,
            displayName: 'Emanuele Pileri',
            'management-feeDirectAmount': 0,
            'management-feeIndirectAmount': 0,
            path: '03 SARDEGNA / 02 SASSARI',
            purchaseDirectAmount: 0,
            purchaseIndirectAmount: 7500,
            roleId: 'branch-manager',
            totalAmount: 18000,
          },
          {
            _id: '000000003',
            advanceDirectAmount: 0,
            advanceIndirectAmount: 1500,
            'cash-inDirectAmount': 0,
            'cash-inIndirectAmount': 9000,
            displayName: 'Emanuele Pileri',
            'management-feeDirectAmount': 0,
            'management-feeIndirectAmount': 0,
            path: '03 SARDEGNA / 02 SASSARI',
            purchaseDirectAmount: 0,
            purchaseIndirectAmount: 7500,
            roleId: 'branch-manager',
            totalAmount: 18000,
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

  it('renders PrassiInvoicingTotalNetworkSummary component', () => {
    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });
});
