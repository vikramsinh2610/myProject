import { shallowMount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import Vuelidate from 'vuelidate';
import PrassiPromoterCompany from './prassi-promoter-company';
import PrassiStandardButton from '../base/prassi-standard-button';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.use(Vuelidate);
localVue.component('prassi-standard-button', PrassiStandardButton);

describe('PrassiPromoterCompany.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterCompany, {
      localVue,
      propsData: {
        isFetching: false,
        promoter: {
          id: '01941ca0-5c47-644f-a5a4-51dee703d44f',
          birthDate: '1988-05-09T15:46:38.330Z',
          cellPhone: '340/5982124',
          approvationDate: '2015-05-05T16:00:17.991Z',
          dateExit: '0001-01-01T00:00:00.000Z',
          networkEnterDate: '2015-05-05T15:46:38.330Z',
          headquarter: false,
          employed: false,
          enabled: false,
          director: false,
          fixedPhone: '',
          guest: false,
          ivassCode: 'E000296424',
          lastLogin: '2015-05-05T15:46:38.330Z',
          name: 'STEFANO',
          serialNumber: 'A0032',
          surname: 'CABIDDU',
          userName: 'stefano.cabiddu@sheltia.com',
        },
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
        $env: { alpha: false },
        $user: {
          roleID: 1000,
        },
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
      },
    });
  });

  it('renders PrassiPromoterCompany component', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });
    const datetimes = wrapper.findAll({ name: 'QDatetime' });

    expect(inputs.at(0).props().value).toContain('A0032');
    expect(inputs.at(1).props().value).toContain('E000296424');
    expect(datetimes.at(0).props().value).toContain('2015-05-05T15:46:38.330Z');
    expect(datetimes.at(1).props().value).toContain('2015-05-05T16:00:17.991Z');
  });

  it('emits changeData when PrassiPromoterCompany submit clicked', () => {
    const btns = wrapper.findAll({ name: 'PrassiStandardButton' });
    btns.at(0).trigger('click');
  });
});

describe('PrassiPromoterCompany.vue Broken props', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterCompany, {
      localVue,
      propsData: {
        isFetching: false,
        promoter: {
          id: '01941ca0-5c47-644f-a5a4-51dee703d44f',
        },
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
        $user: {
          roleID: 1000,
        },
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
      },
    });
  });

  it('renders PrassiPromoterCompany component with broken props', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });
    const toggles = wrapper.findAll({ name: 'QToggle' });
    const datetimes = wrapper.findAll({ name: 'QDatetime' });

    expect(inputs.length).toEqual(2);
    expect(datetimes.length).toEqual(2);
    expect(toggles.length).toEqual(4);
  });
});
