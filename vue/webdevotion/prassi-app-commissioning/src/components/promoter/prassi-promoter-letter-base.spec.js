import { shallowMount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import Vuelidate from 'vuelidate';
import PrassiRoundButton from '../base/prassi-round-button';
import PrassiPromoterLetterBase from './prassi-promoter-letter-base';
import PrassiStandardButton from '../base/prassi-standard-button';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.use(Vuelidate);
localVue.component('prassi-round-button', PrassiRoundButton);
localVue.component('prassi-standard-button', PrassiStandardButton);

describe('PrassiPromoterLetterBase.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterLetterBase, {
      localVue,
      propsData: {
        isFetching: false,
        status: 'wip',
        letter: {
          _id: '119-2018',
          description: 'garantito + bonus anticipato',
          fromProductivePeriodMonth: 6,
          fromProductivePeriodYear: 2018,
          promoterDisplayName: 'EFISIO SANTUS',
          promoterId: '117b107f-76fc-604d-b194-a00f94503cf6',
          promoterSerialNumber: 'A0145',
          signatureDate: '2018-06-23T17:07:04.690Z',
          status: 'wip',
          toProductivePeriodMonth: 9,
          toProductivePeriodYear: 2018,
          type: 'guaranteed-with-bonus-prepaid',
        },
        letterSettings: {},
      },
      mocks: {
        $t: () => {},
        $user: {
          roleID: 1000,
        },
        $n: () => '100',
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

  it('renders PrassiPromoterLetterBase component', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });
    const datetimes = wrapper.findAll({ name: 'QDatetime' });

    expect(inputs.at(0).props().value).toContain('A0145');
    expect(inputs.at(1).props().value).toContain('EFISIO SANTUS');
    expect(datetimes.at(0).props().value).toContain('2018-06-23T17:07:04.690Z');
  });

  it('emits changeData when PrassiPromoterLetterBase submit clicked', () => {
    const btns = wrapper.findAll({ name: 'PrassiStandardButton' });
    btns.at(0).trigger('click');
  });
});

describe('PrassiPromoterLetterBase.vue Broken props', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterLetterBase, {
      localVue,
      propsData: {
        isFetching: false,
        letter: {
          _id: '119-2018',
        },
        letterSettings: {},
      },
      mocks: {
        $t: () => {},
        $user: {
          roleID: 1000,
        },
        $n: () => '100',
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

  it('renders PrassiPromoterLetterBase component with broken propos', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });
    const datetimes = wrapper.findAll({ name: 'QDatetime' });

    expect(inputs.length).toEqual(4);
    expect(datetimes.length).toEqual(1);
  });
});
