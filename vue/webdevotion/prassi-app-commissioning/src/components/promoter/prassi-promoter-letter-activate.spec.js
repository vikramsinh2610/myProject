import { shallowMount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import Vuelidate from 'vuelidate';
import PrassiRoundButton from '../base/prassi-round-button';
import PrassiPromoterLetterActivate from './prassi-promoter-letter-activate';
import PrassiStandardButton from '../base/prassi-standard-button';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.use(Vuelidate);
localVue.component('prassi-round-button', PrassiRoundButton);
localVue.component('prassi-standard-button', PrassiStandardButton);

describe('PrassiPromoterLetterActivate.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterLetterActivate, {
      localVue,
      propsData: {
        name: 'Garantito',
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
      },
      mocks: {
        $t: () => {},
        $user: {
          roleID: 1000,
        },
        $v: {
          form: {
            amount: { $error: false, $touch: () => {} },
            paymentFrequency: { $error: false, $touch: () => {} },
            directProductionPercentage: { $error: false, $touch: () => {} },
            indirectProductionPercentage: { $error: false, $touch: () => {} },
            fromProductivePeriodMonth: { $error: false, $touch: () => {} },
            fromProductivePeriodYear: { $error: false, $touch: () => {} },
            toProductivePeriodMonth: { $error: false, $touch: () => {} },
            toProductivePeriodYear: { $error: false, $touch: () => {} },
            detailType: { $error: false, $touch: () => {} },
            $touch: () => {},
          },
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
          productivePeriodMonthList() {
            return [
              {
                label: 'jan',
                value: 1,
              },
              {
                label: 'feb',
                value: 2,
              },
            ];
          },
        },
      },
    });
  });

  it('renders PrassiPromoterLetterActivate component', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });

    expect(inputs.length).toEqual(0);
  });

  it('emits changeData when PrassiPromoterLetterActivate submit clicked', () => {
    const btns = wrapper.findAll({ name: 'PrassiStandardButton' });
    btns.at(0).trigger('click');
  });
});

describe('PrassiPromoterLetterActivate.vue with broken props', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterLetterActivate, {
      localVue,
      propsData: {
        name: '',
        isFetching: false,
        letter: {},
      },
      mocks: {
        $t: () => {},
        $user: {
          roleID: 1000,
        },
        $v: {
          form: {
            amount: { $error: false, $touch: () => {} },
            paymentFrequency: { $error: false, $touch: () => {} },
            directProductionPercentage: { $error: false, $touch: () => {} },
            indirectProductionPercentage: { $error: false, $touch: () => {} },
            fromProductivePeriodMonth: { $error: false, $touch: () => {} },
            fromProductivePeriodYear: { $error: false, $touch: () => {} },
            toProductivePeriodMonth: { $error: false, $touch: () => {} },
            toProductivePeriodYear: { $error: false, $touch: () => {} },
            detailType: { $error: false, $touch: () => {} },
            $touch: () => {},
          },
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
          // eslint-disable-next-line sonarjs/no-identical-functions
          productivePeriodMonthList() {
            return [
              {
                label: 'jan',
                value: 1,
              },
              {
                label: 'feb',
                value: 2,
              },
            ];
          },
        },
      },
    });
  });

  it('renders PrassiPromoterLetterActivate component with broken props', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });
    expect(inputs.length).toEqual(0);
  });
});
