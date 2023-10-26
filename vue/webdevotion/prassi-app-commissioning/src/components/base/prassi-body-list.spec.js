import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiBodyList from './prassi-body-list';
import PrassiRoundButton from './prassi-round-button';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.component('prassi-round-button', PrassiRoundButton);

describe('PrassiBodyList.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiBodyList, {
      localVue,
      propsData: {
        id: '0',
        menu: true,
        menuIcon: 'check',
        blocks: [
          {
            _id: '0',
            type: 'chip',
            icon: 'fa-check',
            chipText: 'chip text',
          },
          {
            _id: '1',
            label: 'label text',
            size: 'small',
            weight: 'normal',
            width: 100,
            type: '2rows',
          },
          {
            _id: '2',
            label: 'label text',
            sublabel: 'sub label text',
            size: 'small',
            weight: 'normal',
            width: 180,
            type: '2rows',
          },
          {
            _id: '3',
            type: 'icon',
            color: 'red',
            width: 80,
          },
        ],
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
      },
    });
  });

  it('renders PrassiBodyList component', () => {
    expect(wrapper.contains('.p-tr-main')).toBe(true);
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });

  it('emits menuClick when PrassiBodyList menuicon clicked', () => {
    const btns = wrapper.findAll({ name: 'QBtn' });
    btns.at(0).trigger('click');
    expect(wrapper.emitted().menuClick).toBeTruthy();
  });
});
