<template>
  <div>
    <prassi-header-list class="p-cl-item" :blocks="myHeader" no-scrollbar placeholder />
    <div style="height: 6px" />

    <prassi-empty-list v-if="invoicings.length === 0 && !isFetching" />

    <div
      class="p-cl-item"
      v-for="invoicing in invoicings"
      :key="invoicing._id"
      @click="$emit('viewClick', invoicing._id)"
    >
      <prassi-body-list
        :blocks="myBody(invoicing)"
        :id="invoicing._id"
        menu
        @menuClick="$emit('menuClick', $event)"
      />
    </div>
    <div class="full-width q-ma-xl" />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="$emit('addInvoicing')"
        icon="fa fa-plus-white"
      />
    </q-page-sticky>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiInvoicingList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'invoicingHeader.closingDate',
          sublabel: 'invoicingHeader.openingDate',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
        {
          _id: '1',
          label: 'invoicingHeader.productivePeriod',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 130,
        },
        {
          _id: '2',
          label: 'invoicingHeader.status',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
          col: true,
        },
        {
          _id: '3',
          label: 'invoicingHeader.earnings',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 120,
        },
        {
          _id: '4',
          label: 'invoicingHeader.expenses',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 120,
        },
        {
          _id: '5',
          label: 'invoicingHeader.margin',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 120,
        },
        {
          _id: '6',
          label: 'invoicingHeader.consultants',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 120,
        },
      ],
    };
  },
  props: {
    invoicings: {
      type: Array,
      default: () => [],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    myBody(invoicing) {
      return [
        {
          _id: '1',
          label: invoicing.didClosedDate ? this.$d(new Date(invoicing.didClosedDate)) : '-',
          sublabel: this.$d(new Date(invoicing.didOpenedDate)),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '2',
          label: `${this.$utils.numberToMonth(
            invoicing.productivePeriodMonth,
            this.$t.bind(this),
          )} ${invoicing.productivePeriodYear}`,
          size: 'medium',
          weight: 'normal',
          width: 130,
          type: '2rows',
        },
        {
          _id: '3',
          label: this.$t(`invoicing.${invoicing.status}`),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
          col: true,
        },
        {
          _id: '4',
          label: invoicing.stats.gross
            ? `${this.$n(invoicing.stats.gross / 100, 'nodecimals')}€`
            : '-',
          size: 'large',
          weight: 'light',
          width: 120,
          type: '2rows',
        },
        {
          _id: '5',
          label: invoicing.stats.tax ? `${this.$n(invoicing.stats.tax / 100, 'nodecimals')}€` : '-',
          size: 'medium',
          weight: 'light',
          width: 120,
          type: '2rows',
        },
        {
          _id: '6',
          label: invoicing.stats.net ? `${this.$n(invoicing.stats.net / 100, 'nodecimals')}€` : '-',
          size: 'medium',
          weight: 'light',
          width: 120,
          type: '2rows',
        },
        {
          _id: '7',
          label: invoicing.stats.promoterNumber ? invoicing.stats.promoterNumber.toString() : '-',
          size: 'medium',
          weight: 'light',
          width: 120,
          type: '2rows',
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-cl-item
  cursor pointer
</style>
