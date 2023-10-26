<template>
  <div class="column fill-available">
    <prassi-promoter-filter :is-fetching="isFetching" @changed="filterPromoterChange" />

    <prassi-header-list class="p-item" :blocks="myHeader" placeholder menu-delete />

    <prassi-empty-list v-if="filteredDocuments.length === 0 && !isFetching" />

    <q-infinite-scroll
      id="scroll-network-print-id"
      class="fill-available"
      inline
      ref="infiniteScroll"
      @load="loadMore"
      :offset="250"
      scroll-target="#scroll-network-print-id"
    >
      <div style="height: 6px" />
      <div
        class="p-item"
        v-for="item in filteredDocuments"
        :key="item._id"
        @click="$emit('downloadInvoice', item._id)"
      >
        <prassi-body-list
          :blocks="myBody(item)"
          :id="item._id"
          menu
          :menu-delete="step !== 'preview'"
          menu-icon="fa fa-download"
          delete-icon="fas fa-info-circle"
          @menuClick="$emit('downloadInvoice', item._id)"
          @deleteClick="$emit('downloadInvoiceWithDetail', item.additionalData.invoiceId)"
        />
      </div>
    </q-infinite-scroll>
    <q-page-sticky v-if="$user.roleID >= 7" position="bottom-right" :offset="offsetSticky">
      <q-fab icon="fa fa-chevron-up" active-icon="fa fa-times" direction="up" color="secondary">
        <q-fab-action @click="$emit('downloadAll')" color="primary" icon="fa fa-download">
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('invoicing.downloadAll') }}
          </q-tooltip>
        </q-fab-action>
        <q-fab-action
          v-if="step !== 'preview'"
          @click="$emit('downloadAllWithDetails')"
          color="primary"
          icon="fa fa-download"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('invoicing.downloadAllWithDetails') }}
          </q-tooltip>
        </q-fab-action>
        <q-fab-action
          v-if="$env.edition === 'sheltia' && step !== 'preview'"
          @click="$emit('downloadReceipts')"
          color="primary"
          icon="fa fa-download"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('invoicing.reportEmployee') }}
          </q-tooltip>
        </q-fab-action>
        <q-fab-action
          v-if="step !== 'preview'"
          @click="$emit('downloadFiscal')"
          color="primary"
          icon="fa fa-download"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('invoicing.reportFiscal') }}
          </q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiPromoterFilter from '../promoter/prassi-promoter-filter';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiInvoicingTotalNetworkPrint',
  components: {
    PrassiHeaderList,
    PrassiBodyList,
    PrassiPromoterFilter,
    PrassiEmptyList,
  },
  data() {
    return {
      filteredDocuments: this.documents,
      myHeader: [
        {
          _id: '0',
          label: 'invoicing.displayName',
          sublabel: 'invoicing.area',
          size: 'small',
          weight: 'normal',
          width: 274,
          col: true,
        },
        {
          _id: '1',
          label: 'invoicing.invoiceNumber',
          sublabel: 'invoicing.invoiceDate',
          size: 'small',
          weight: 'normal',
          width: 274,
        },
      ],
    };
  },
  props: {
    documents: {
      type: Array,
      default: () => [],
    },
    offsetSticky: {
      type: Array,
      default: () => [18, 18],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    step: {
      type: String,
      default: 'preview',
    },
    roles: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    documents: {
      immediate: true,
      handler(documents) {
        this.filteredDocuments = documents;
      },
    },
  },
  methods: {
    stopScrolling() {
      this.$utils.log('INVOICING-TOTAL-NETWORK-PRINT', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('INVOICING-TOTAL-NETWORK-PRINT', 'RESUME SCROLLING');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('INVOICING-TOTAL-NETWORK-PRINT', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      this.$utils.log('INVOICING-TOTAL-NETWORK-PRINT', 'loadMore', index);
      this.$emit('loadMore', { index, done });
    },
    filterPromoterChange(filter) {
      if (filter.searchPromoter) {
        this.$emit('find', filter.searchPromoter);
      } else {
        this.$emit('find', '');
      }
    },
    myBody(item) {
      return [
        {
          _id: '0',
          label: item.additionalData.promoterDisplayName,
          sublabel: item.additionalData.promoterNetworkPath,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, item.additionalData.promoterRoleId),
          size: 'small',
          weight: 'normal',
          width: 274,
          type: '2rows',
          col: true,
        },
        {
          _id: '1',
          label: item.additionalData.invoiceNumber,
          sublabel: this.$utils.isoToDisplayDate(item.createDate, this.$d.bind(this)),
          size: 'small',
          weight: 'normal',
          width: 274,
          type: '2rows',
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-item
  cursor pointer
</style>
