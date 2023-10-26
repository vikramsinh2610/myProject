<template>
  <div class="column">
    <q-card style="width: 100%" inline flat color="white" class="text-primary">
      <q-card-section class="row no-wrap">
        <span class="q-title p-al-title">{{ $t('promoterDataMain.downloads') }}</span>
      </q-card-section>
    </q-card>
    <prassi-header-list
      class="p-ll-item"
      :blocks="myHeader"
      :menu-delete="menuDelete"
      placeholder
    />

    <prassi-empty-list v-if="attachments.length === 0 && !isFetching" />

    <q-infinite-scroll
      id="scroll-attach-id"
      class="fill-available"
      style="width: 100%"
      inline
      ref="infiniteScroll"
      @load="loadMore"
      :offset="250"
      scroll-target="#scroll-attach-id"
    >
      <div style="height: 6px" />

      <prassi-body-list
        class="p-ll-item"
        v-for="attachment in attachments"
        menu
        :menu-delete="menuDelete"
        menu-icon="fa fa-download"
        delete-icon="fa fa-trash"
        :key="attachment._id"
        :blocks="myBody(attachment)"
        :id="attachment._id"
        @menuClick="download(attachment._id)"
        @deleteClick="deleteAttachment(attachment._id)"
      />
    </q-infinite-scroll>
  </div>
</template>

<script>
import { date } from 'quasar';
import PrassiHeaderList from './prassi-header-list';
import PrassiBodyList from './prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiDownloadList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      filter: {
        selected: 'all',
      },
      myHeader: [
        {
          _id: '0',
          label: 'promoterInsertLetter.downloadDate',
          sublabel: 'promoterInsertLetter.description',
          size: 'small',
          weight: 'normal',
          width: 400,
          col: true,
        },
        {
          _id: '1',
          label: 'default.description',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 600,
          col: true,
        },
      ],
    };
  },
  props: {
    attachments: {
      type: Array,
      default: () => [],
    },
    menuDelete: {
      type: Boolean,
      default: false,
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    download(id) {
      this.$emit('download', { id });
    },
    deleteAttachment(id) {
      this.$emit('deleteAttachment', { id });
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
    myBody(attachment) {
      return [
        {
          _id: '-1',
          type: 'chip',
          icon: 'fa fa-check',
          chipText: 'dn',
        },
        {
          _id: '0',
          label: date.formatDate(new Date(attachment.createDate), 'DD/MM/YYYY HH:mm:ss'),
          sublabel:
            attachment.additionalData && attachment.additionalData.attachmentType
              ? this.$t(`attachments.${attachment.additionalData.attachmentType}`)
              : this.$t(`attachments.${attachment.type}`),
          size: 'small',
          weight: 'normal',
          width: 400,
          type: '2rows',
          col: true,
        },
        {
          _id: '2',
          label: attachment.displayName,
          size: 'medium',
          weight: 'normal',
          width: 600,
          type: '2rows',
          col: true,
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-top-left-radius 4px
  border-top-right-radius 4px
  border-bottom-right-radius 0
  border-bottom-left-radius 0
  border-top solid 1px $card-border
  border-left solid 1px $card-border
  border-right solid 1px $card-border
.q-card-main
  position relative
  padding 5px 0 5px 16px
  align-items center
  height 60px
.p-ll-item
  padding-left 10px
.p-al-title
  margin-right auto
</style>
