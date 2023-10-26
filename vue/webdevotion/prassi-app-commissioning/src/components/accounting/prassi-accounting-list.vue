<template>
  <div class="column fill-available">
    <prassi-header-list class="p-item" :blocks="myHeader" />

    <prassi-empty-list v-if="transactions.length === 0 && !isFetching" />

    <q-infinite-scroll
      id="scroll-target-id"
      class="fill-available"
      inline
      ref="infiniteScroll"
      @load="loadMore"
      :offset="250"
      scroll-target="#scroll-target-id"
    >
      <div style="height: 6px" />
      <div
        class="p-item"
        v-for="transaction in transactions"
        :key="transaction._id"
        @click="$emit('viewClick', transaction._id)"
      >
        <prassi-body-list :blocks="myBody(transaction)" :id="transaction._id" />
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiAccountingList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'accountingHeader.productivePeriod',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 100,
        },
        {
          _id: '1',
          label: 'accountingHeader.contractNumber',
          sublabel: 'accountingHeader.dossierNumber',
          size: 'small',
          weight: 'normal',
          width: 130,
        },
        {
          _id: '2',
          label: 'accountingHeader.yearlyPremium',
          sublabel: 'accountingHeader.rate',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
        {
          _id: '3',
          label: 'accountingHeader.product',
          sublabel: 'accountingHeader.company',
          size: 'small',
          weight: 'light',
          width: 400,
          col: true,
        },
        {
          _id: '4',
          label: 'accountingHeader.description',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 100,
        },
        {
          _id: '6',
          label: 'accountingHeader.type',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 100,
        },
        {
          _id: '7',
          label: 'accountingHeader.amount',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 100,
        },
      ],
    };
  },
  props: {
    transactions: {
      type: Array,
      default: () => [],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    stopScrolling() {
      this.$utils.log('ACCOUNTING-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('ACCOUNTING-LIST', 'RESUME SCROLLING');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('ACCOUNTING-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
    myBody(transaction) {
      return [
        {
          _id: '0',
          label:
            transaction.productivePeriodYear && transaction.productivePeriodMonth
              ? `${transaction.productivePeriodYear} / ${transaction.productivePeriodMonth}`
              : '-',
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '1',
          label: transaction.contractId,
          sublabel: transaction.practiceId,
          size: 'small',
          weight: 'normal',
          width: 130,
          type: '2rows',
        },
        {
          _id: '2',
          label: `${this.$n(transaction.premiumGross / 100, 'nodecimals')}€`,
          sublabel: this.$utils.numberToRate(transaction.installmentsPerYear, this.$t.bind(this)),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '3',
          label: transaction.productName,
          sublabel: transaction.companyName,
          size: 'large',
          weight: 'light',
          width: 400,
          type: '2rows',
          col: true,
        },
        {
          _id: '4',
          label: transaction.type === 'out' ? 'Rete' : transaction.companyName,
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '6',
          label: this.$t(`accounting.${transaction.commissionType}`),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '7',
          label: `${this.$n(transaction.amount / 100, 'nodecimals')}€`,
          size: transaction.amount >= 0 ? 'medium' : 'red',
          weight: 'light',
          width: 100,
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
