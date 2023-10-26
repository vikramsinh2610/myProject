<template>
  <div class="column">
    <q-card style="width: 100%" inline flat color="white" class="text-primary">
      <q-card-section class="row no-wrap">
        <span class="q-title p-al-title">{{ $t('promoterInsertLetter.documents') }}</span>
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
        :hide-menu-delete="attachment.locked"
        delete-icon="fa fa-trash"
        :key="attachment._id"
        :blocks="myBody(attachment)"
        :id="attachment._id"
        @menuClick="download(attachment._id)"
        @deleteClick="attachment.locked ? undefined : deleteAttachment(attachment._id)"
      />
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from './prassi-header-list';
import PrassiBodyList from './prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiAttachmentList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      filter: {
        selected: 'all',
      },
      myHeader: [
        {
          _id: '0',
          label: 'promoterInsertLetter.uploadDate',
          sublabel: 'promoterInsertLetter.description',
          size: 'small',
          weight: 'normal',
          width: 400,
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
          chipText: this.$t(`attachments.${attachment.type}`).slice(0, 2),
        },
        {
          _id: '0',
          label: this.$utils.isoToDisplayDate(attachment.createDate, this.$d.bind(this)),
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
