import { shallowMount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import Vuelidate from 'vuelidate';
import PrassiPromoterDataMain from './prassi-promoter-data-main';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.use(Vuelidate);

describe('PrassiPromoterDataMain.vue', () => {
  it('renders PrassiPromoterDataMain component', () => {
    jest.useFakeTimers();

    const wrapper = shallowMount(PrassiPromoterDataMain, {
      localVue,
      propsData: {
        menu: 'company',
        promoter: {
          id: '01941ca0-5c47-644f-a5a4-51dee703d44f',
          birthDate: '1988-05-09T15:46:38.330Z',
          mobilePhone: '340/5982124',
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
          displayName: 'STEFANO CABIDDU',
          serialNumber: 'A0032',
          roleName: 'Promotore',
          username: 'stefano.cabiddu@sheltia.com',
          displayHierarchy: '02 SARDEGNA',
          displayAddress: 'Via dei mille, 100',
        },
      },
      mocks: {
        $t: () => {},
        $env: { alpha: false },
        $utils: {
          isoToDisplayDate() {
            return '';
          },
          logobj() {
            return '';
          },
          log() {
            return '';
          },
        },
        $n: () => '100',
        $d: () => 'data',
      },
    });

    expect(wrapper.find('.p-pdm-title-section').text()).toContain('STEFANO CABIDDU');
  });
});
