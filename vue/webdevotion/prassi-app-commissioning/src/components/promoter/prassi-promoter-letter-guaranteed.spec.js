import { shallowMount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import Vuelidate from 'vuelidate';
import PrassiRoundButton from '../base/prassi-round-button';
import PrassiPromoterLetterGuaranteed from './prassi-promoter-letter-guaranteed';
import PrassiStandardButton from '../base/prassi-standard-button';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.use(Vuelidate);
localVue.component('prassi-round-button', PrassiRoundButton);
localVue.component('prassi-standard-button', PrassiStandardButton);

describe('PrassiPromoterLetterGuaranteed.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterLetterGuaranteed, {
      localVue,
      propsData: {
        name: 'Garantito',
        isFetching: false,
        status: 'wip',
        guaranteedBonuses: {
          absorbability: {
            directProductionPercentage: 0,
            indirectProductionPercentage: 0,
          },
          directProductionPercentage: 0,
          indirectProductionPercentage: 0,
          amount: 0,
          paymentFrequency: 'one-time',
          paymentTime: 'payment-delayed',
          type: 'guaranteed',
        },
        selectedSettings: {
          _id: 'guaranteed',
          absorbabilities: {
            ABSORBABLE: {
              directProductionPercentage: 10000,
              indirectProductionPercentage: 10000,
            },
            SUPPLEMENTARY: {
              directProductionPercentage: 0,
              indirectProductionPercentage: 0,
            },
          },
          paymentFrequency: ['monthly', 'one-time'],
          paymentTime: ['prepayment', 'payment-delayed'],
        },
        productivePeriod: {
          fromProductivePeriodMonth: 6,
          fromProductivePeriodYear: 2018,
          toProductivePeriodMonth: 7,
          toProductivePeriodYear: 2018,
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

  it('renders PrassiPromoterLetterGuaranteed component', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });

    expect(inputs.at(0).props().value).toEqual(2018);
    expect(inputs.at(1).props().value).toEqual(2018);
  });

  it('emits changeData when PrassiPromoterLetterGuaranteed submit clicked', () => {
    const btns = wrapper.findAll({ name: 'PrassiStandardButton' });
    btns.at(0).trigger('click');
  });
});

describe('PrassiPromoterLetterGuaranteed.vue with broken props', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterLetterGuaranteed, {
      localVue,
      propsData: {
        name: '',
        isFetching: false,
        guaranteedBonuses: {},
        selectedSettings: {},
        productivePeriod: {},
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

  it('renders PrassiPromoterLetterGuaranteed component with broken props', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });

    expect(inputs.length).toEqual(3);
  });
});
