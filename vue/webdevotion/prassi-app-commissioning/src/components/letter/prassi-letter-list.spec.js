import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiLetterList from './prassi-letter-list';
import PrassiRoundButton from '../base/prassi-round-button';

const localVue = createLocalVue();
localVue.use(Quasar, {
  components: All,
  directives: All,
  plugins: All,
});

localVue.component('q-page-sticky', {
  render(createElement) {
    return createElement('div', this.$slots.default);
  },
});

localVue.component('prassi-round-button', PrassiRoundButton);

describe('PrassiLetterList.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiLetterList, {
      localVue,
      propsData: {
        singlePromoter: true,
        letters: [
          {
            _id: '000000000',
            active: true,
            attachment: 'proposal-id-00',
            dateEndValid: '2018-05-30T15:43:48+00:00',
            signatureDate: '2018-05-30T15:43:48+00:00',
            dateStartValid: '2018-05-30T15:43:48+00:00',
            description: 'Mandato',
            letter: 'ln',
            number: '001-2018',
            payment: '2018-05-30T15:43:48+00:00',
            percentage: 80,
            promoterId: '000000000',
            type: 'guaranteed',
          },
          {
            _id: '000000002',
            active: false,
            attachment: 'proposal-id-00',
            dateEndValid: '2018-05-30T15:43:48+00:00',
            signatureDate: '2018-05-30T15:43:48+00:00',
            dateStartValid: '2018-05-30T15:43:48+00:00',
            description: 'Mandato',
            letter: 'ln',
            number: '001-2018',
            payment: '2018-05-30T15:43:48+00:00',
            percentage: 80,
            promoterId: '000000000',
            type: 'guaranteed',
          },
          {
            _id: '000000003',
            active: true,
            attachment: 'proposal-id-00',
            dateEndValid: '2018-05-30T15:43:48+00:00',
            dateSignin: '2018-05-30T15:43:48+00:00',
            dateStartValid: '2018-05-30T15:43:48+00:00',
            description: 'Mandato',
            letter: 'ln',
            number: '001-2018',
            payment: '2018-05-30T15:43:48+00:00',
            percentage: 80,
            promoterId: '000000000',
            type: 'guaranteed',
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
          logobj() {
            return '';
          },
          log() {
            return '';
          },
        },
        $user: {
          roleID: 1000,
        },
        $route: {
          name: '',
        },
        $router: {
          currentRoute: {
            fullPath: '/letters',
          },
        },
      },
    });
  });

  it('renders PrassiLetterList component', () => {
    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });

  it('emits new letter event', () => {
    // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
    const button = wrapper.find({ ref: 'addButton' });
    button.trigger('click');
    expect(wrapper.emitted().addLetter).toBeTruthy();
  });

  it('emits menuclick row event', () => {
    const btns = wrapper.findAll({ name: 'QBtn' });
    btns.at(2).trigger('click');
    expect(wrapper.emitted().menuClick).toBeTruthy();
  });
});
