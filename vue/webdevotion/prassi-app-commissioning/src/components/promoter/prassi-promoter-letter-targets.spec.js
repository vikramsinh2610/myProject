import { shallowMount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import Vuelidate from 'vuelidate';
import PrassiRoundButton from '../base/prassi-round-button';
import PrassiPromoterLetterTargets from './prassi-promoter-letter-targets';
import PrassiStandardButton from '../base/prassi-standard-button';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.use(Vuelidate);
localVue.component('prassi-round-button', PrassiRoundButton);
localVue.component('prassi-standard-button', PrassiStandardButton);

describe('PrassiPromoterLetterTargets.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterLetterTargets, {
      localVue,
      propsData: {
        name: 'Garantito',
        isFetching: false,
        status: 'wip',
        indexBonus: 0,
        conditionedBonus: {
          amount: 0,
          conditions: [
            {
              targets: [],
              thresholds: [
                {
                  fixedPercentage: 8000,
                  from: 8000,
                  to: 9999,
                  valueMode: 'fixed',
                },
              ],
            },
          ],
          maxRecoveryPercentage: 0,
          paymentFrequency: 'one-time',
          paymentTime: 'payment-delayed',
          type: 'conditioned',
        },
        conditionedBonuses: [
          {
            amount: 0,
            conditions: [
              {
                targets: [],
                thresholds: [
                  {
                    fixedPercentage: 8000,
                    from: 8000,
                    to: 9999,
                    valueMode: 'fixed',
                  },
                ],
              },
            ],
            maxRecoveryPercentage: 0,
            paymentFrequency: 'one-time',
            paymentTime: 'payment-delayed',
            type: 'conditioned',
          },
        ],
        selectedSettings: {
          _id: 'rappel',
          paymentFrequency: ['monthly', 'one-time'],
          paymentTime: ['prepayment', 'payment-delayed'],
          targets: {
            'BRIEFED-PREMIUM': {
              kpi: {
                _id: 'BRIEFED-PREMIUM',
              },
              targetValue: 0,
              weightPercentage: 10000,
            },
            'PROMOTERS-NUMBER': {
              kpi: {
                _id: 'PROMOTERS-NUMBER',
              },
              targetValue: 0,
              weightPercentage: 10000,
            },
            CORRENTIZZAZIONE: {
              kpi: {
                _id: 'CORRENTIZZAZIONE',
              },
              targetValue: 0,
              weightPercentage: 10000,
            },
          },
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
        $v: {
          form: {
            amount: { $error: false, $touch: () => {} },
            threshold: { $error: false, $touch: () => {} },
            thresholdApplication: { $error: false, $touch: () => {} },
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

  it('renders PrassiPromoterLetterTargets component', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });

    expect(inputs.at(0).props().value).toEqual(2018);
    expect(inputs.at(1).props().value).toEqual(2018);
  });

  it('emits changeData when PrassiPromoterLetterTargets submit clicked', () => {
    const btns = wrapper.findAll({ name: 'PrassiStandardButton' });
    btns.at(0).trigger('click');
  });
});

describe('PrassiPromoterLetterTargets.vue with broken props', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterLetterTargets, {
      localVue,
      propsData: {
        name: '',
        isFetching: false,
        indexBonus: 0,
        conditionedBonus: {},
        conditionedBonuses: [],
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
            threshold: { $error: false, $touch: () => {} },
            thresholdApplication: { $error: false, $touch: () => {} },
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

  it('renders PrassiPromoterLetterTargets component with broken conditions props', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });

    expect(inputs.length).toEqual(2);
  });
});

describe('PrassiPromoterLetterTargets.vue with broken conditions props', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterLetterTargets, {
      localVue,
      propsData: {
        name: '',
        isFetching: false,
        conditionedBonuses: {
          conditionedBonuses: {
            amount: 0,
            conditions: [
              {
                targets: [],
                thresholds: [],
              },
            ],
            maxRecoveryPercentage: 0,
            paymentFrequency: 'one-time',
            paymentTime: 'payment-delayed',
            type: 'conditioned',
          },
        },
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
            threshold: { $error: false, $touch: () => {} },
            thresholdApplication: { $error: false, $touch: () => {} },
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

  it('renders PrassiPromoterLetterTargets component with broken conditions props', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });
    expect(inputs.length).toEqual(2);
  });
});
