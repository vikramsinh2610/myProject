import { shallowMount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import Vuelidate from 'vuelidate';
import PrassiInvoicingClose from './prassi-invoicing-close';
import PrassiRoundButton from '../base/prassi-round-button';
import PrassiStandardButton from '../base/prassi-standard-button';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.use(Vuelidate);
localVue.component('prassi-round-button', PrassiRoundButton);
localVue.component('prassi-standard-button', PrassiStandardButton);

describe('PrassiInvoicingClose.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiInvoicingClose, {
      localVue,
      propsData: {
        isFetching: false,
        invoicing: {
          _id: '201803',
          didClosedDate: '2018-08-14T09:41:57.521Z',
          didOpenedDate: '2018-08-14T09:41:36.831Z',
          invoices: [
            {
              _id: '492dd8ba-aa1e-4ede-bb8b-b7636eeb0fe2',
              confirmed: true,
            },
          ],
          productivePeriodMonth: 3,
          productivePeriodYear: 2018,
          status: 'opened',
        },
      },
      mocks: {
        $t: () => {},
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
          numberToMonth() {
            return 'gennaio';
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

  it('renders PrassiInvoicingClose component', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });

    expect(inputs.length).toEqual(0);
  });

  it('emits changeData when PrassiInvoicingClose submit clicked', () => {
    const btns = wrapper.findAll({ name: 'PrassiStandardButton' });
    btns.at(0).trigger('click');
  });
});

describe('PrassiInvoicingClose.vue with broken props', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PrassiInvoicingClose, {
      localVue,
      propsData: {
        name: '',
        isFetching: false,
        invoicing: {
          _id: '201803',
        },
      },
      mocks: {
        $t: () => {},
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
          numberToMonth() {
            return 'gennaio';
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

  it('renders PrassiInvoicingClose component with broken props', () => {
    const inputs = wrapper.findAll({ name: 'QInput' });
    expect(inputs.length).toEqual(0);
  });
});
