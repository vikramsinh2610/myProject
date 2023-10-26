import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiProposalList from './prassi-proposal-list';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });

describe('PrassiProposalList.vue', () => {
  it('renders PrassiProposalList component', () => {
    const wrapper = mount(PrassiProposalList, {
      localVue,
      propsData: {
        proposals: [
          {
            _id: '000000000',
            type: 'Rp,',
            effectDate: '2018-05-30T15:43:48+00:00',
            termDate: '2018-05-30T15:43:48+00:00',
            contractId: 'contract-id-00',
            proposalId: 'proposal-id-00',
            productId: 'product-id-00',
            productName: 'Tcm Fum 504',
            insurerId: 'insurer-id-00',
            insurerName: 'HELVETIA',
            insuredName: 'Ahmed Abdelkarim Mohamed',
            premiumNet: 1000,
            premiumGross: 1400,
            recurring: 'mensile',
            iv: 180000,
            late: 0,
            wait: 25,
            paid: 25,
            state: 'in elab',
            payments: 'Al corrente',
            check: true,
          },
          {
            _id: '000000002',
            type: 'Rp,',
            effectDate: '2018-05-30T15:43:48+00:00',
            termDate: '2018-05-30T15:43:48+00:00',
            contractId: 'contract-id-00',
            proposalId: 'proposal-id-00',
            productId: 'product-id-00',
            productName: 'Tcm Fum 504',
            insurerId: 'insurer-id-00',
            insurerName: 'HELVETIA',
            insuredName: 'Ahmed Abdelkarim Mohamed',
            premiumNet: 1000,
            premiumGross: 1400,
            recurring: 'mensile',
            iv: 180000,
            late: 0,
            wait: 25,
            paid: 25,
            state: 'in elab',
            payments: 'Al corrente',
            check: true,
          },
          {
            _id: '000000003',
            type: 'Rp,',
            effectDate: '2018-05-30T15:43:48+00:00',
            termDate: '2018-05-30T15:43:48+00:00',
            contractId: 'contract-id-00',
            proposalId: 'proposal-id-00',
            productId: 'product-id-00',
            productName: 'Tcm Fum 504',
            insurerId: 'insurer-id-00',
            insurerName: 'HELVETIA',
            insuredName: 'Ahmed Abdelkarim Mohamed',
            premiumNet: 1000,
            premiumGross: 1400,
            recurring: 'mensile',
            iv: 180000,
            late: 0,
            wait: 25,
            paid: 25,
            state: 'in elab',
            payments: 'Al corrente',
            check: true,
          },
          {
            _id: '000000004',
            type: 'Rp,',
            effectDate: '2018-05-30T15:43:48+00:00',
            termDate: '2018-05-30T15:43:48+00:00',
            contractId: 'contract-id-00',
            proposalId: 'proposal-id-00',
            productId: 'product-id-00',
            productName: 'Tcm Fum 504',
            insurerId: 'insurer-id-00',
            insurerName: 'HELVETIA',
            insuredName: 'Ahmed Abdelkarim Mohamed',
            premiumNet: 1000,
            premiumGross: 1400,
            recurring: 'mensile',
            iv: 180000,
            late: 0,
            wait: 25,
            paid: 25,
            state: 'in elab',
            payments: 'Al corrente',
            check: true,
          },
          {
            _id: '000000005',
            type: 'Rp,',
            effectDate: '2018-05-30T15:43:48+00:00',
            termDate: '2018-05-30T15:43:48+00:00',
            contractId: 'contract-id-00',
            proposalId: 'proposal-id-00',
            productId: 'product-id-00',
            productName: 'Tcm Fum 504',
            insurerId: 'insurer-id-00',
            insurerName: 'HELVETIA',
            insuredName: 'Ahmed Abdelkarim Mohamed',
            premiumNet: 1000,
            premiumGross: 1400,
            recurring: 'mensile',
            iv: 180000,
            late: 0,
            wait: 25,
            paid: 25,
            state: 'in elab',
            payments: 'Al corrente',
            check: true,
          },
        ],
      },
      mocks: {
        $t: () => {},
        $d: () => {},
        $n: () => {},
      },
    });

    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });
});
