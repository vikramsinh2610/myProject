import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiInvoicingDetail from './prassi-invoicing-detail';

const localVue = createLocalVue();
localVue.use(Quasar, {
  components: All,
  directives: All,
  plugins: All,
});

describe('PrassiInvoicingDetail.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiInvoicingDetail, {
      localVue,
      propsData: {
        closed: false,
        confirmed: true,
        notes: [],
        invoice: {
          _id: '82156459-c21e-411e-9e20-a10c7c21c4fa',
          createDate: '2018-08-13T14:56:16.140Z',
          accountingNotes: [],
          entries: [
            {
              _id: 'ced52ea7-bcc8-4bcb-a27b-9fa98eedab46',
              accounted: true,
              additionalData: {
                absorbability: {
                  directProductionPercentage: 0,
                  indirectProductionPercentage: 0,
                },
                accruedAmount: 80000000,
                expireDate: '2017-08-01T00:00:00.000Z',
                letterId: '89-2018',
                targetAmount: 80000000,
                targetPercentage: 10000,
              },
              type: 'bonus-letter',
              amount: 80000000,
              origin: 'conditioned+rappel+payment-delayed',
            },
          ],
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
        promoter: {
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
            other: 1000,
          },
        },
        readonly: true,
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

  it('renders PrassiInvoicingDetail component', () => {
    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });
});
