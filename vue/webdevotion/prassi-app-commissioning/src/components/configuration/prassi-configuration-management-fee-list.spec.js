import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiConfigurationProductsList from './prassi-configuration-products-list';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });

describe('PrassiConfigurationProductsList.vue', () => {
  it('renders PrassiConfigurationProductsList component', () => {
    const wrapper = mount(PrassiConfigurationProductsList, {
      localVue,
      propsData: {},
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

    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });
});
