<template>
  <div class="column">
    <prassi-filter :menus="menuFilter" :filter="filter" @changed="filter = $event" />
    <prassi-header-list class="p-item" :blocks="myHeader" />

    <prassi-empty-list v-if="viewInstallments.length === 0 && !isFetching" />

    <q-infinite-scroll
      id="scroll-balance-id"
      class="fill-available"
      inline
      ref="infiniteScroll"
      @load="loadMore"
      :offset="250"
      scroll-target="#scroll-balance-id"
    >
      <div style="height: 6px" />
      <div class="p-item" v-for="item in loadedInstallments" :key="item._id">
        <prassi-body-list
          v-if="$env.edition !== 'sheltia' || item.type !== 'advance'"
          :blocks="myBody(item)"
          :id="item._id"
        />
      </div>
      <div class="text-center"><q-spinner-dots v-if="is_fetching" color="primary" size="40" /></div>
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiFilter from '../base/prassi-filter';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiCommissioningTotalBalanceList',
  components: { PrassiFilter, PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      filter: {
        selected: 'purchases',
      },
      loadedInstallments: [],
      skip: 0,
      is_fetching: true,
      menuFilter: [
        {
          _id: 'purchases',
          label: this.$t('commissioning.purchases'),
        },
        this.$env.edition === 'tcw'
          ? {
              _id: 'advances',
              label: this.$t('commissioning.advances'),
            }
          : undefined,
        {
          _id: 'incomes',
          label: this.$t('commissioning.incomes'),
        },
        {
          _id: 'fees',
          label: this.$t('commissioning.fees'),
        },
        {
          _id: 'all',
          label: this.$t('commissioning.all'),
        },
      ],
    };
  },
  props: {
    installments: {
      type: Array,
      default: () => [],
    },
    mfees: {
      type: Array,
      default: () => [],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    viewInstallments: {
      immediate: true,
      handler() {
        this.$utils.log('COMMISSIONING-TOTALE-BALANCE', 'viewInstallments');
        this.loadedInstallments = [];
        this.skip = 0;
        this.is_fetching = true;
        this.$nextTick().then(() => {
          this.resumeScrolling();
        });
      },
    },
  },
  computed: {
    purchases() {
      return this.$env.edition === 'tcw'
        ? this.installments.filter((el) => el.type === 'purchase')
        : this.installments.filter((el) => el.type === 'purchase' || el.type === 'advance');
    },
    advances() {
      return this.installments.filter((el) => el.type === 'advance');
    },
    incomes() {
      return this.installments.filter((el) => el.type === 'cash-in');
    },
    all() {
      return this.installments;
    },
    viewInstallments() {
      switch (this.filter.selected) {
        case 'purchases':
          return this.purchases;
        case 'advances':
          return this.advances;
        case 'incomes':
          return this.incomes;
        case 'fees':
          return this.mfees;
        case 'all':
          return this.all;
        default:
          return this.purchases;
      }
    },
    myHeader() {
      return [
        this.filter.selected !== 'fees'
          ? {
              _id: '0',
              label: 'commissioningPurchase.operationDate',
              sublabel: 'commissioningPurchase.forecastDate',
              size: 'small',
              weight: 'normal',
              width: 110,
            }
          : undefined,
        {
          _id: '1',
          label: 'commissioningPurchase.contractNumber',
          sublabel: 'commissioningPurchase.dossierNumber',
          size: 'small',
          weight: 'normal',
          width: 120,
        },
        this.filter.selected !== 'fees'
          ? {
              _id: '2',
              label: 'commissioningPurchase.yearlyPremium',
              sublabel: 'commissioningPurchase.rate',
              size: 'small',
              weight: 'normal',
              width: 100,
            }
          : undefined,
        {
          _id: '3',
          label: 'commissioningPurchase.product',
          sublabel: 'commissioningPurchase.company',
          size: 'small',
          weight: 'light',
          width: 300,
          col: true,
        },
        this.filter.selected !== 'fees'
          ? {
              _id: '4',
              label: 'commissioningPurchase.installment',
              sublabel: '',
              size: 'small',
              weight: 'light',
              width: 40,
            }
          : undefined,
        this.filter.selected !== 'fees'
          ? {
              _id: '5',
              label: 'commissioningPurchase.payIn',
              sublabel: '',
              size: 'small',
              weight: 'light',
              width: 80,
            }
          : undefined,
        this.filter.selected !== 'fees'
          ? {
              _id: '6',
              label:
                this.$env.edition === 'tcw'
                  ? 'commissioningPurchase.payOut'
                  : 'commissioningPurchase.iv',
              sublabel: '',
              size: 'small',
              weight: 'light',
              width: 120,
            }
          : undefined,
        this.filter.selected === 'fees'
          ? {
              _id: '6',
              label: 'commissioningPurchase.amount',
              sublabel: '',
              size: 'small',
              weight: 'light',
              width: 120,
            }
          : undefined,
      ];
    },
  },
  methods: {
    stopScrolling() {
      this.$utils.log('COMMISSIONING-TOTALE-BALANCE', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('COMMISSIONING-TOTALE-BALANCE', 'RESUME SCROLLING');
      if (typeof this.$refs.infiniteScroll !== 'undefined') {
        this.$refs.infiniteScroll.resume();
      }
    },
    forceScrolling() {
      this.$utils.log('COMMISSIONING-TOTALE-BALANCE', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    // eslint-disable-next-line no-unused-vars
    loadMore(index, done) {
      this.$utils.logobj('COMMISSIONING-TOTALE-BALANCE', 'LOAD MORE index', index);
      const items = this.viewInstallments.slice(this.skip, this.skip + 20);

      if (items && items.length !== 0) {
        this.skip += 20;
        this.loadedInstallments = [...this.loadedInstallments, ...items];
        this.$nextTick().then(() => {
          done();
        });
      } else {
        this.is_fetching = false;
        this.stopScrolling();
      }
    },
    myBody(installment) {
      return [
        this.filter.selected !== 'fees'
          ? {
              _id: '0',
              type: 'chip',
              icon: 'fa fa-check',
              chipText: this.$t(
                `installmentChipText.${installment.type}-${installment.practiceType}`,
              ),
            }
          : undefined,
        this.filter.selected !== 'fees'
          ? {
              _id: '1',
              label: installment.paymentDate ? this.$d(new Date(installment.paymentDate)) : '-',
              sublabel: installment.dueDate ? this.$d(new Date(installment.dueDate)) : '-',
              size: 'small',
              weight: 'normal',
              width: 110,
              type: '2rows',
            }
          : undefined,
        {
          _id: '2',
          label: installment.contractId,
          sublabel: installment.dossierId,
          size: 'medium',
          weight: 'normal',
          width: 120,
          type: '2rows',
        },
        this.filter.selected !== 'fees'
          ? {
              _id: '3',
              label: `${this.$n(installment.premiumGross / 100, 'nodecimals')}€`,
              sublabel: this.$utils.numberToRate(
                installment.installmentsPerYear,
                this.$t.bind(this),
              ),
              size: 'small',
              weight: 'normal',
              width: 100,
              type: '2rows',
            }
          : undefined,
        {
          _id: '4',
          label: installment.productName,
          sublabel: installment.companyName,
          size: 'large',
          weight: 'light',
          width: 300,
          type: '2rows',
          col: true,
        },
        this.filter.selected !== 'fees'
          ? {
              _id: '5',
              label: `${installment.installment}/${installment.installmentsPerYear}`,
              size: 'medium',
              weight: 'light',
              width: 40,
              type: '2rows',
            }
          : undefined,
        this.filter.selected !== 'fees'
          ? {
              _id: '6',
              label: `${this.$n(installment.payin / 100, 'nodecimals')}€`,
              size: 'medium',
              weight: 'light',
              width: 80,
              type: '2rows',
            }
          : undefined,
        this.filter.selected !== 'fees'
          ? {
              _id: '7',
              label:
                this.$env.edition === 'tcw'
                  ? `${this.$n(installment.payout / 100, 'nodecimals')}€`
                  : `${this.$n(installment.iv / 100, 'nodecimals')}`,
              size: 'medium',
              weight: 'light',
              width: 120,
              type: '2rows',
            }
          : undefined,
        this.filter.selected === 'fees'
          ? {
              _id: '7',
              label: `${this.$n(installment.amount / 100, 'nodecimals')}€`,
              size: 'medium',
              weight: 'light',
              width: 120,
              type: '2rows',
            }
          : undefined,
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>

.p-item
  padding-left 10px
  cursor pointer
</style>
