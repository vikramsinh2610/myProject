import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiPromoterBlock from './prassi-promoter-block';

const localVue = createLocalVue();
localVue.use(Quasar, { components: All, directives: All, plugins: All });

describe('PrassiPromoterBlock.vue', () => {
  it('renders PrassiPromoterBlock component', () => {
    const wrapper = mount(PrassiPromoterBlock, {
      localVue,
      propsData: {
        promoters: [
          {
            id: 'bc021182-e35d-4a67-8bb3-75e1d2d4de3d',
            area: '01 - lazio',
            color: 'blue',
            consultants: 100,
            insured: 110,
            iv: 13000000,
            name: 'Maria Concetta',
            pc: 150,
            premiums: 100000000,
          },
          {
            id: 'bc021182-e35d-4a67-8bb3-75e1d2d4de3d1',
            area: '01 - lazio',
            color: 'blue',
            consultants: 100,
            insured: 110,
            iv: 13000000,
            name: 'Maria Concetta',
            pc: 150,
            premiums: 100000000,
          },
          {
            id: 'bc021182-e35d-4a67-8bb3-75e1d2d4de3d2',
            area: '01 - lazio',
            color: 'blue',
            consultants: 100,
            insured: 110,
            iv: 13000000,
            name: 'Maria Concetta',
            pc: 150,
            premiums: 100000000,
          },
        ],
      },
      mocks: {
        $t: () => {},
        $n: () => '100',
      },
    });

    expect(wrapper.find('.p-th-main-text').text()).toContain('name');
  });
});
