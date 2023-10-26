import { mount, createLocalVue } from '@vue/test-utils';
import Quasar, * as All from 'quasar';
import PrassiAttachmentList from './prassi-attachment-list';
import PrassiRoundButton from './prassi-round-button';

const localVue = createLocalVue();
localVue.use(Quasar, {
  components: All,
  directives: All,
  plugins: All,
});

localVue.component('q-page-sticky', {
  template: '<div><slot /></div>',
});
localVue.component('prassi-round-button', PrassiRoundButton);

describe('PrassiAttachmentList.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PrassiAttachmentList, {
      localVue,
      propsData: {
        attachments: [
          {
            _id: '44a97775-499b-4cf3-9535-e68ce42cd594',
            additionalData: { attachmentType: 'welcome-bonus' },
            type: 'invoice',
            createDate: '2018-06-23T17:07:18.834Z',
            url: 'https://tcw-documents-stage.s3.amazonaws.com/letters/119-2018/44a97775-499b-4cf3-9535-e68ce42cd594?AWSAccessKeyId=AKIAJUYUVBC7RKIOYDNA&Expires=1529778541&Signature=OnTbuH0ct46Fd6eJtaJAX7FClEk%3D',
          },
          {
            _id: '44a97775-499b-4cf3-9535-e68ce42cd595',
            additionalData: { attachmentType: 'welcome-bonus' },
            type: 'invoice',
            createDate: '2018-06-23T17:07:18.834Z',
            url: 'https://tcw-documents-stage.s3.amazonaws.com/letters/119-2018/44a97775-499b-4cf3-9535-e68ce42cd594?AWSAccessKeyId=AKIAJUYUVBC7RKIOYDNA&Expires=1529778541&Signature=OnTbuH0ct46Fd6eJtaJAX7FClEk%3D',
          },
          {
            _id: '44a97775-499b-4cf3-9535-e68ce42cd596',
            additionalData: { attachmentType: 'welcome-bonus' },
            type: 'invoice',
            createDate: '2018-06-23T17:07:18.834Z',
            url: 'https://tcw-documents-stage.s3.amazonaws.com/letters/119-2018/44a97775-499b-4cf3-9535-e68ce42cd594?AWSAccessKeyId=AKIAJUYUVBC7RKIOYDNA&Expires=1529778541&Signature=OnTbuH0ct46Fd6eJtaJAX7FClEk%3D',
          },
        ],
      },
      mocks: {
        $t: () => 'pippo',
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
      },
    });
  });

  it('renders PrassiAttachmentList component', () => {
    expect(wrapper.find('.q-card').is('div')).toBe(true);
  });
});
