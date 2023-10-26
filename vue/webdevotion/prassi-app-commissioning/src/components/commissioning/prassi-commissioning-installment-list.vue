<template>
  <div class="column">
    <prassi-filter
      v-if="!closed"
      :button="!closed"
      :checkbox="!closed"
      :checked="allChecked"
      :button-label="buttonLabel"
      :checkbox-label="$t('commissioning.allCheckbox')"
      :menus="menuFilter"
      :filter="filter"
      :label-top="$env.edition === 'sheltia'"
      :label-top-text="labelTopText"
      @changed="changedFilter"
      @changedChecked="changedChecked"
      @buttonClicked="$emit(addOrRemoveEvent, { id: $route.params.id, filter: viewInstallments })"
    />

    <prassi-search-filter
      :search-label="$t('commissioning.searchFilter')"
      @changedSearch="searchChange"
    />

    <prassi-header-list class="p-item" :checkbox="!closed" :blocks="myHeader" />

    <prassi-empty-list v-if="loadedInstallments.length === 0 && !isFetching" />

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
      <div class="p-item" v-for="item in loadedInstallments" :key="item._id">
        <prassi-body-list
          v-if="$env.edition !== 'sheltia' || item.type !== 'advance'"
          :checkbox="!closed"
          :checked="item.checked || false"
          :blocks="myBody(item)"
          :id="item._id"
          @changedChecked="$emit('changeChecked', $event)"
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
import PrassiSearchFilter from '../base/prassi-search-filter';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiCommissioningInstallmentsList',
  components: {
    PrassiSearchFilter,
    PrassiFilter,
    PrassiHeaderList,
    PrassiBodyList,
    PrassiEmptyList,
  },
  data() {
    return {
      buttonLabel: this.$t('commissioning.addSelected'),
      allChecked: false,
      filter: {
        selected: 'confirmed',
      },
      loadedInstallments: [],
      skip: 0,
      is_fetching: true,
      filteredInstallments: this.viewInstallments,
      searchValue: '',
      menuFilter: [
        {
          _id: 'confirmed',
          label: this.$t('commissioning.confirmedMenu'),
        },
        {
          _id: 'exceptions',
          label: this.$t('commissioning.exceptions'),
        },
        {
          _id: 'added',
          label: this.$t('commissioning.added'),
        },
      ],
      myHeader: [
        {
          _id: '0',
          label: 'commissioningPurchase.operationDate',
          sublabel: 'commissioningPurchase.forecastDate',
          size: 'small',
          weight: 'normal',
          width: 110,
        },
        {
          _id: '1',
          label: 'commissioningPurchase.contractNumber',
          sublabel: 'commissioningPurchase.dossierNumber',
          size: 'small',
          weight: 'normal',
          width: 140,
        },
        {
          _id: '2',
          label: 'commissioningPurchase.yearlyPremium',
          sublabel: 'commissioningPurchase.rate',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
        {
          _id: '3',
          label: 'commissioningPurchase.product',
          sublabel: 'commissioningPurchase.company',
          size: 'small',
          weight: 'light',
          width: 280,
          col: true,
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
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 80,
        },
        this.$env.edition === 'tcw' || this.kind === 'purchase'
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
      ],
    };
  },
  props: {
    closed: {
      type: Boolean,
      default: false,
    },
    installments: {
      type: Array,
      default: () => [],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    kind: {
      type: String,
      default: '',
    },
  },
  watch: {
    closed: {
      immediate: true,
      handler(closed) {
        this.$utils.logobj('COMMISSIONING-INSTALLMENT-LIST', 'closed', closed);
        this.filter = { selected: !closed ? 'confirmed' : 'added' };
      },
    },
    viewInstallments: {
      immediate: true,
      handler() {
        this.$utils.log('COMMISSIONING-INSTALLMENT-LIST', 'viewInstallments');
        this.setFilteredInstallments();
      },
    },
  },
  computed: {
    labelTopText() {
      return `${this.$n(
        // eslint-disable-next-line unicorn/no-reduce
        this.confirmed.reduce((acc, item) => acc + item.iv, 0) / 100,
        'nodecimals',
      )} IV / ${this.$n(
        // eslint-disable-next-line unicorn/no-reduce
        this.added.reduce((acc, item) => acc + item.iv, 0) / 100,
        'nodecimals',
      )} IV`;
    },
    addOrRemoveEvent() {
      return this.filter.selected === 'added' ? 'removeSelected' : 'addSelected';
    },
    confirmed() {
      return this.installments.filter((el) => !el.included && el.confirmed);
    },
    added() {
      return this.installments.filter((el) => el.included);
    },
    exceptions() {
      return this.installments.filter((el) => !el.included && !el.confirmed);
    },
    viewInstallments() {
      switch (this.filter.selected) {
        case 'confirmed':
          return this.confirmed;
        case 'added':
          return this.added;
        case 'exceptions':
          return this.exceptions;
        default:
          return this.confirmed;
      }
    },
  },
  methods: {
    changedChecked(checked) {
      this.allChecked = checked;
      this.$emit('checkedAll', { checked, filter: this.filteredInstallments });
    },
    changedFilter(filter) {
      this.filter = filter;
      this.allChecked = false;
      this.buttonLabel =
        filter.selected === 'added'
          ? this.$t('commissioning.removeSelected')
          : this.$t('commissioning.addSelected');
    },
    searchChange(value) {
      this.$utils.logobj('COMMISSIONING-INSTALLMENT-LIST', 'searchChange', value);
      this.searchValue = value;
      this.setFilteredInstallments();
    },
    setFilteredInstallments() {
      this.filteredInstallments = this.searchValue
        ? this.viewInstallments.filter(
            (el) =>
              el.contractId.includes(this.searchValue) || el.dossierId.includes(this.searchValue),
          )
        : this.viewInstallments;
      this.loadedInstallments = [];
      this.skip = 0;
      this.is_fetching = true;
      this.$nextTick().then(() => {
        this.resumeScrolling();
      });
    },
    stopScrolling() {
      this.$utils.log('COMMISSIONING-INSTALLMENT-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('COMMISSIONING-INSTALLMENT-LIST', 'RESUME SCROLLING');
      if (typeof this.$refs.infiniteScroll !== 'undefined') {
        this.$refs.infiniteScroll.resume();
      }
    },
    forceScrolling() {
      this.$utils.log('COMMISSIONING-INSTALLMENT-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    // eslint-disable-next-line no-unused-vars
    loadMore(index, done) {
      this.$utils.logobj('COMMISSIONING-INSTALLMENT-LIST', 'LOAD MORE index', index);
      const items = this.filteredInstallments.slice(this.skip, this.skip + 20);

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
      const instalmmentIv = installment.iv ? `${this.$n(installment.iv / 100, 'integer')}` : '-';
      return [
        {
          _id: '0',
          type: 'chip',
          icon: 'fa fa-check',
          chipText: this.$t(`installmentChipText.${installment.type}-${installment.practiceType}`),
        },
        {
          _id: '1',
          label: installment.paymentDate ? this.$d(new Date(installment.paymentDate)) : '-',
          sublabel: installment.dueDate ? this.$d(new Date(installment.dueDate)) : '-',
          size: 'small',
          weight: 'normal',
          width: 110,
          type: '2rows',
        },
        {
          _id: '2',
          label: installment.contractId,
          sublabel: installment.dossierId,
          size: 'medium',
          weight: 'normal',
          width: 140,
          type: '2rows',
        },
        {
          _id: '3',
          label: `${this.$n(installment.premiumGross / 100, 'nodecimals')}€`,
          sublabel: this.$utils.numberToRate(installment.installmentsPerYear, this.$t.bind(this)),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '4',
          label: installment.productName,
          sublabel: installment.companyName,
          size: 'large',
          weight: 'light',
          width: 280,
          type: '2rows',
          col: true,
        },
        {
          _id: '5',
          label: `${installment.installment}/${installment.installmentsPerYear}`,
          sublabel: `${installment.productivePeriodYear}/${installment.productivePeriodMonth}`,
          size: 'medium',
          weight: 'light',
          width: 80,
          type: '2rows',
        },
        {
          _id: '6',
          label: `${this.$n(installment.payin / 100, 'nodecimals')}€`,
          size: 'medium',
          weight: 'light',
          width: 80,
          type: '2rows',
        },
        this.$env.edition === 'tcw' || this.kind === 'purchase'
          ? {
              _id: '7',
              label:
                // eslint-disable-next-line no-nested-ternary
                this.$env.edition === 'tcw'
                  ? `${this.$n(installment.payout / 100, 'nodecimals')}€`
                  : instalmmentIv,
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
</style>
