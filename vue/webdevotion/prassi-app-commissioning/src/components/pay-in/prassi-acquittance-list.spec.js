import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiAcquittanceList from './prassi-acquittance-list';
import PrassiRoundButton from '../base/prassi-round-button';

const localVue = createLocalVue();
localVue.use(Quasar, {
  components: All,
  directives: All,
  plugins: All,
});

localVue.component('prassi-round-button', PrassiRoundButton);

localVue.component('q-page-sticky', {
  template: '<div><slot /></div>',
});

describe('PrassiAcquittanceList.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiAcquittanceList, {
      localVue,
      propsData: {
        acquittances: [
          {
            _id: '6bc04f5e-375c-46d9-ac51-cc1e81b462b0',
            companyName: 'CF',
            count: 612,
            didConfirmedDate: '2018-09-27T14:32:45.255Z',
            didCreatedDate: '2018-09-27T14:20:26.210Z',
            status: 'confirmed',
          },
          {
            _id: '6bc04f5e-375c-46d9-ac51-cc1e81b462b02',
            companyName: 'CF',
            count: 612,
            didConfirmedDate: '2018-09-27T14:32:45.255Z',
            didCreatedDate: '2018-09-27T14:20:26.210Z',
            status: 'confirmed',
          },
          {
            _id: '6bc04f5e-375c-46d9-ac51-cc1e81b462b04',
            companyName: 'CF',
            count: 612,
            didConfirmedDate: '2018-09-27T14:32:45.255Z',
            didCreatedDate: '2018-09-27T14:20:26.210Z',
            status: 'created',
          },
        ],
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
        $d: () => 'data',
        $env: { alpha: false },
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
        },
        $route: {
          name: '',
        },
      },
    });
  });

  it('renders PrassiAcquittanceList component', () => {
    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });
});
