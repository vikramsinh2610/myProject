import { shallowMount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import Vuelidate from 'vuelidate';
import PrassiRoundButton from '../base/prassi-round-button';
import PrassiPromoterLetterPrivacy from './prassi-promoter-letter-privacy';
import PrassiStandardButton from '../base/prassi-standard-button';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.use(Vuelidate);
localVue.component('prassi-round-button', PrassiRoundButton);
localVue.component('prassi-standard-button', PrassiStandardButton);

describe('PrassiPromoterLetterPrivacy.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterLetterPrivacy, {
      localVue,
      propsData: {
        name: 'Garantito',
        isFetching: false,
        status: 'wip',
        agreements: [
          {
            agree: false,
            content: 'Hey, this is a long story',
            name: 'Test Agreement #1',
          },
          {
            agree: false,
            content: 'Hey, this is a long story',
            name: 'Test Agreement #3',
          },
          {
            agree: false,
            content: 'Hey, this is a long story',
            name: 'Test Agreement #2',
          },
        ],
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

  it('renders PrassiPromoterLetterPrivacy component', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });
    expect(inputs.length).toEqual(0);
  });

  it('emits changeData when PrassiPromoterLetterPrivacy submit clicked', () => {
    const btns = wrapper.findAll({ name: 'PrassiStandardButton' });
    btns.at(0).trigger('click');
  });
});

describe('PrassiPromoterLetterPrivacy.vue with broken props', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiPromoterLetterPrivacy, {
      localVue,
      propsData: {
        name: '',
        isFetching: false,
        agreements: [],
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

  it('renders PrassiPromoterLetterPrivacy component with broken props', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });
    expect(inputs.length).toEqual(0);
  });
});
