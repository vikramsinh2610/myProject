<template>
  <div class="column fill-available">
    <prassi-header-list class="p-item" :blocks="myHeader" :placeholder="$user.roleID >= 7" />

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
        @click="$emit('viewDossier', transaction.originalPracticeId)"
      >
        <prassi-body-list
          :blocks="myBody(transaction)"
          :id="transaction._id"
          :menu="$user.roleID >= 7"
          @menuClick="$emit('menuClick', $event, transaction)"
        />
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
          label: 'dossierHeader.insured',
          sublabel: 'dossierHeader.product',
          size: 'small',
          weight: 'light',
          width: 200,
          col: true,
        },
        {
          _id: '3-1',
          label: 'dossierHeader.insurer',
          sublabel: 'promoterHeader.area',
          size: 'small',
          weight: 'light',
          width: 340,
        },
        {
          _id: '4',
          label: 'commissioningPurchase.installment',
          sublabel: 'commissioningHeader.productivePeriod',
          size: 'small',
          weight: 'light',
          width: 80,
        },
        {
          _id: '5',
          label: 'commissioningPurchase.payIn',
          sublabel:
            this.$env.edition === 'tcw'
              ? 'commissioningPurchase.payOut'
              : 'commissioningPurchase.iv',
          size: 'small',
          weight: 'light',
          width: 80,
        },
        {
          _id: '6',
          label: 'dossierHeader.confirmed',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 45,
        },
        {
          _id: '7',
          label: 'dossierHeader.paid',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 45,
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
    roles: {
      type: Array,
      default: () => [],
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
          sublabel: this.$utils.numberToRate(
            transaction.installmentsPerYear,
            this.$t.bind(this),
            transaction.unique,
          ),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '3',
          label: transaction.insuredName,
          sublabel: transaction.productName,
          size: 'large',
          weight: 'light',
          width: 200,
          type: '2rows',
          col: true,
        },
        {
          _id: '3-1',
          label: transaction.validPromoterName,
          sublabel: transaction.displayHierarchy,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, transaction.roleId),
          size: 'large',
          weight: 'light',
          width: 340,
          type: '2rows',
        },
        {
          _id: '4',
          label: `${transaction.installment}/${transaction.installmentsPerYear}`,
          sublabel: `${transaction.productivePeriodYear}/${transaction.productivePeriodMonth}`,
          size: 'medium',
          weight: 'light',
          width: 80,
          type: '2rows',
        },
        {
          _id: '5',
          label: `${this.$n(transaction.payin / 100, 'nodecimals')}€`,
          sublabel:
            // eslint-disable-next-line no-nested-ternary
            this.$env.edition === 'tcw'
              ? `${this.$n(transaction.payout / 100, 'nodecimals')}€`
              : transaction.iv
              ? `${this.$n(transaction.iv / 100, 'integer')}`
              : '-',
          size: 'medium',
          weight: 'light',
          width: 80,
          type: '2rows',
        },
        {
          _id: '6',
          type: 'icon',
          color: transaction.confirmed ? 'green' : 'red',
          icon: transaction.confirmed ? 'fa fa-check' : 'fa fa-times',
          width: 45,
        },
        {
          _id: '7',
          type: 'icon',
          color: transaction.paidToNetwork ? 'green' : 'grey',
          icon: transaction.paidToNetwork ? 'fa fa-check' : 'fa fa-times',
          width: 45,
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
