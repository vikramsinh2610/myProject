import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiPromoterList from './prassi-promoter-list';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });

describe('PrassiPromoterList.vue', () => {
  it('renders PrassiPromoterList component', () => {
    const wrapper = mount(PrassiPromoterList, {
      localVue,
      propsData: {
        promoters: [
          {
            id: '01941ca0-5c47-644f-a5a4-51dee703d44f',
            birthDate: '1988-05-09T15:46:38.330Z',
            cellPhone: '340/5982124',
            dateApproved: '2015-05-05T16:00:17.991Z',
            dateExit: '0001-01-01T00:00:00.000Z',
            dateInsert: '2015-05-05T15:46:38.330Z',
            headquarter: false,
            employed: false,
            enabled: false,
            fixedPhone: '',
            guest: false,
            ivass: 'E000296424',
            lastLogin: '2015-05-05T15:46:38.330Z',
            name: 'STEFANO',
            serialNumber: 'A0032',
            surname: 'CABIDDU',
            userName: 'stefano.cabiddu@sheltia.com',
            area: {
              fullName: '03 SARDEGNA / 01 CAGLIARI / B / 02',
              nameArea: '03 SARDEGNA',
              nameBranch: '01 CAGLIARI',
              nameSection: 'B',
              nameZone: '02',
            },
            address: {
              address: 'Via Nazionale',
              cap: '09044',
              city: 'Quartucciu',
              number: '36',
              state: 'CA',
            },
            role: {
              key: 2,
              value: 'Promotore Assicurativo',
            },
            approvationState: {
              key: 2,
              value: 'Approvato',
            },
          },
          {
            id: '01941ca0-5c47-644f-a5a4-51dee703d44f1',
            birthDate: '1988-05-09T15:46:38.330Z',
            cellPhone: '340/5982124',
            dateApproved: '2015-05-05T16:00:17.991Z',
            dateExit: '0001-01-01T00:00:00.000Z',
            dateInsert: '2015-05-05T15:46:38.330Z',
            headquarter: false,
            employed: false,
            enabled: false,
            fixedPhone: '',
            guest: false,
            ivass: 'E000296424',
            lastLogin: '2015-05-05T15:46:38.330Z',
            name: 'STEFANO',
            serialNumber: 'A0032',
            surname: 'CABIDDU',
            userName: 'stefano.cabiddu@sheltia.com',
            area: {
              fullName: '03 SARDEGNA / 01 CAGLIARI / B / 02',
              nameArea: '03 SARDEGNA',
              nameBranch: '01 CAGLIARI',
              nameSection: 'B',
              nameZone: '02',
            },
            address: {
              address: 'Via Nazionale',
              cap: '09044',
              city: 'Quartucciu',
              number: '36',
              state: 'CA',
            },
            role: {
              key: 2,
              value: 'Promotore Assicurativo',
            },
            approvationState: {
              key: 2,
              value: 'Approvato',
            },
          },
        ],
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
        $d: () => 'data',
        $utils: {
          isoToDisplayDate() {
            return '';
          },
          promoterColor() {
            return '';
          },
          promoterColorCode() {
            return '';
          },
          promoterName() {
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

    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });
});
