<template>
  <div class="column fill-available">
    <prassi-header-list class="p-item" :blocks="myHeader" />

    <prassi-empty-list v-if="transactions.length === 0 && !isFetching" />

    <q-infinite-scroll
      id="scroll-target-id"
      class="fill-available relative-position"
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
      <q-spinner-ios
        v-if="isFetching"
        :class="
          transactions && transactions.length !== 0 ? 'center-spinner' : 'center-spinner-first'
        "
        color="primary"
        :size="transactions && transactions.length !== 0 ? '40' : '80'"
      />
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiAccountingOverdueList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      myHeader: [
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
          width: 500,
          col: true,
        },
        {
          _id: '4',
          label: 'accountingHeader.installmentsTotal',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 100,
        },
        {
          _id: '5',
          label: 'accountingHeader.lateInstallments',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 100,
        },
        {
          _id: '5-1',
          label: 'dossiers.iv',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 100,
        },
        {
          _id: '6',
          label: 'accountingHeader.amountOverdue',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 160,
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
  updated() {
    this.resumeScrolling();
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
          width: 500,
          type: '2rows',
          col: true,
        },
        {
          _id: '4',
          label: this.$n(transaction.installments, 'integer'),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '5',
          label: this.$n(transaction.overdueInstallments, 'integer'),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '5-1',
          label: this.$n(transaction.iv / 100, 'integer'),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '6',
          label: `${this.$n(transaction.amount / 100, 'nodecimals')}€`,
          size: 'large',
          weight: 'light',
          width: 160,
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
.center-spinner
  display block
  margin auto
.center-spinner-first
  display block
  margin auto
  position: absolute;
  top: 50%;
  left: calc(50% - 40px);
  transform: translateY(-50%);
</style>
