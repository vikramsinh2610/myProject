import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiInvoicingTotalNetworkList from './prassi-invoicing-total-network-list';

const localVue = createLocalVue();
localVue.use(Quasar, {
  components: All,
  directives: All,
  plugins: All,
});

describe('PrassiInvoicingTotalNetworkList.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiInvoicingTotalNetworkList, {
      localVue,
      propsData: {
        closed: false,
        network: [
          {
            _id: '82156459-c21e-411e-9e20-a10c7c21c4fa',
            createDate: '2018-08-13T14:56:16.140Z',
            grossAmount: 80018000,
            issued: true,
            number: '2-2018',
            productivePeriodMonth: 7,
            productivePeriodYear: 2017,
            promoterDisplayName: 'Emanuele Pileri',
            promoterId: '1dcd1087-3423-6f48-9946-64983e2f0a4e',
            promoterNetworkPath: '03 SARDEGNA / 02 SASSARI',
            promoterRoleId: 'branch-manager',
            stats: {
              directCommissions: 0,
              indirectCommissions: 18000,
              other: 80000000,
            },
          },
          {
            _id: '000000002',
            createDate: '2018-08-13T14:56:16.140Z',
            grossAmount: 80018000,
            issued: true,
            number: '2-2018',
            productivePeriodMonth: 7,
            productivePeriodYear: 2017,
            promoterDisplayName: 'Emanuele Pileri',
            promoterId: '1dcd1087-3423-6f48-9946-64983e2f0a4e',
            promoterNetworkPath: '03 SARDEGNA / 02 SASSARI',
            promoterRoleId: 'branch-manager',
            stats: {
              directCommissions: 0,
              indirectCommissions: 18000,
              other: 80000000,
            },
          },
          {
            _id: '000000003',
            createDate: '2018-08-13T14:56:16.140Z',
            grossAmount: 80018000,
            issued: true,
            number: '2-2018',
            productivePeriodMonth: 7,
            productivePeriodYear: 2017,
            promoterDisplayName: 'Emanuele Pileri',
            promoterId: '1dcd1087-3423-6f48-9946-64983e2f0a4e',
            promoterNetworkPath: '03 SARDEGNA / 02 SASSARI',
            promoterRoleId: 'branch-manager',
            stats: {
              directCommissions: 0,
              indirectCommissions: 18000,
              other: 80000000,
            },
          },
        ],
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
        $d: () => 'data',
        $env: { alpha: false },
        $user: {
          roleID: 1000,
        },
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

  it('renders PrassiInvoicingTotalNetworkList component', () => {
    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });
});
