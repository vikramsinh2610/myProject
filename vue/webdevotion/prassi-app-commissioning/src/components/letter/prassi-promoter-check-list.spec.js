import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiPromoterCheckList from './prassi-promoter-check-list';

const localVue = createLocalVue();
localVue.use(Quasar, {
  components: All,
  directives: All,
  plugins: All,
});

describe('PrassiPromoterCheckList.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiPromoterCheckList, {
      localVue,
      propsData: {
        closed: false,
        promoters: [
          {
            _id: '9200000080-subscription-1',
            displayName: '9200000080',
            displayHierarchy: '9200000080',
            roleId: 'promoter',
            username: '2018-01-29T00:00:00.000Z',
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

  it('renders PrassiPromoterCheckList component', () => {
    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });
});
