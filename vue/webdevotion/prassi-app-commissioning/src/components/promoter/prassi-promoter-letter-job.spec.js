import { shallowMount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import Vuelidate from 'vuelidate';
import PrassiRoundButton from '../base/prassi-round-button';
import PrassiPromoterLetterJob from './prassi-promoter-letter-job';
import PrassiStandardButton from '../base/prassi-standard-button';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.use(Vuelidate);
localVue.component('prassi-round-button', PrassiRoundButton);
localVue.component('prassi-standard-button', PrassiStandardButton);

describe('PrassiPromoterLetterJob.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterLetterJob, {
      localVue,
      propsData: {
        name: 'Garantito',
        isFetching: false,
        status: 'wip',
        job: {
          directProductionPercentage: 6500,
          directProductionForfait: 55000,
          roleId: 'promoter',
        },
        selectedSettings: {
          _id: 'job',
          roleType: {
            0: 'promoter',
            1: 'team-manager',
            2: 'senior-promoter',
            3: 'branch-manager',
            4: 'district-manager',
            5: 'administrator',
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
        $user: {
          roleID: 1000,
        },
        $v: {
          form: {
            amount: { $error: false, $touch: () => {} },
            percentage: { $error: false, $touch: () => {} },
            roleType: { $error: false, $touch: () => {} },
            fromProductivePeriodMonth: { $error: false, $touch: () => {} },
            fromProductivePeriodYear: { $error: false, $touch: () => {} },
            toProductivePeriodMonth: { $error: false, $touch: () => {} },
            toProductivePeriodYear: { $error: false, $touch: () => {} },
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

  it('renders PrassiPromoterLetterJob component', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });

    expect(inputs.at(0).props().value).toEqual(2018);
  });

  it('emits changeData when PrassiPromoterLetterJob submit clicked', () => {
    const btns = wrapper.findAll({ name: 'PrassiStandardButton' });
    btns.at(0).trigger('click');
  });
});

describe('PrassiPromoterLetterJob.vue with broken props', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterLetterJob, {
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
            percentage: { $error: false, $touch: () => {} },
            roleType: { $error: false, $touch: () => {} },
            fromProductivePeriodMonth: { $error: false, $touch: () => {} },
            fromProductivePeriodYear: { $error: false, $touch: () => {} },
            toProductivePeriodMonth: { $error: false, $touch: () => {} },
            toProductivePeriodYear: { $error: false, $touch: () => {} },
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

  it('renders PrassiPromoterLetterJob component with broken props', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });

    expect(inputs.length).toEqual(1);
  });
});
