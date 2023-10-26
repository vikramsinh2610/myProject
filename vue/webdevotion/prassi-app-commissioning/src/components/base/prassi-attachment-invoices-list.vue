<template>
  <div class="column">
    <q-card style="width: 100%" inline flat color="white" class="text-primary">
      <q-card-section class="row no-wrap">
        <span class="q-title p-al-title">{{ $t('invoicing.documents') }}</span>
      </q-card-section>
    </q-card>
    <prassi-header-list class="p-ll-item" :blocks="myHeader" menu-delete placeholder />

    <prassi-empty-list v-if="attachments.length === 0 && !isFetching" />

    <q-infinite-scroll
      id="scroll-attach-id"
      class="fill-available"
      inline
      ref="infiniteScroll"
      @load="loadMore"
      :offset="250"
      scroll-target="#scroll-attach-id"
    >
      <div style="height: 6px" />

      <div
        class="p-ll-item"
        v-for="attachment in attachments"
        :key="attachment._id"
        @click="$emit('viewClick', attachment._id)"
      >
        <prassi-body-list
          menu
          menu-delete
          :hide-menu-delete="attachment.issued || $user.roleID < 7 || attachment.commissioning"
          :hide-menu="!attachment.documentId"
          menu-icon="fa fa-download"
          delete-icon="fa fa-trash"
          :key="attachment._id"
          :blocks="myBody(attachment)"
          :id="attachment._id"
          @menuClick="attachment.documentId ? download(attachment.documentId) : undefined"
          @deleteClick="attachment.issued ? undefined : deleteInvoice(attachment._id)"
        />
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from './prassi-header-list';
import PrassiBodyList from './prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiAttachmentInvoiceList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      filter: {
        selected: 'all',
      },
      myHeader: [
        {
          _id: '0',
          label: 'invoicing.invoiceDate',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
          col: true,
        },
        {
          _id: '1',
          label: 'invoicing.invoiceNumber',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
          col: true,
        },
        {
          _id: '1.1',
          label: 'invoicing.name',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
          col: true,
        },
        {
          _id: '2',
          label: 'invoicing.productivePeriodMonth',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
          col: true,
        },
        {
          _id: '3',
          label: 'invoicing.totalInvoice',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 120,
        },
      ],
    };
  },
  props: {
    attachments: {
      type: Array,
      default: () => [],
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
    deleteInvoice(id) {
      this.$emit('deleteInvoice', { id });
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
    stopScrolling() {
      this.$utils.log('INVOICE-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('INVOICE-LIST', 'RESUME SCROLLING');
      if (typeof this.$refs.infiniteScroll !== 'undefined') {
        this.$refs.infiniteScroll.resume();
      }
    },
    forceScrolling() {
      this.$utils.log('INVOICE-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    myBody(attachment) {
      return [
        {
          _id: '0',
          label: this.$utils.isoToDisplayDate(attachment.createDate, this.$d.bind(this)),
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
          col: true,
        },
        {
          _id: '1',
          label: attachment.number === 'ND' ? this.$t('invoicing.notIssued') : attachment.number,
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
          col: true,
        },
        {
          _id: '1.1',
          label: attachment.heading ? attachment.heading.name : '-',
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
          col: true,
        },
        {
          _id: '2',
          label: `${attachment.productivePeriodYear.toString()}/${attachment.productivePeriodMonth.toString()}`,
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
          col: true,
        },
        {
          _id: '3',
          label: attachment.amount ? `${this.$n(attachment.amount / 100, 'nodecimals')}€` : '0',
          size: 'medium',
          weight: 'normal',
          width: 120,
          type: '2rows',
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
  cursor pointer
.p-al-title
  margin-right auto
</style>
