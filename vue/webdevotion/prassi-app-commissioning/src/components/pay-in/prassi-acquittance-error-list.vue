<template>
  <div>
    <prassi-header-list class="p-item" :blocks="myHeader" :placeholder="!confirmed" />

    <prassi-empty-list v-if="errorPayments.length === 0 && !isFetching" />

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
      <div class="p-item" v-for="item in loadedErrorPayments" :key="item._id">
        <prassi-body-list
          :blocks="myBody(item)"
          :id="item._id"
          :menu="!confirmed"
          btn-toggle
          :btn-toggle-enabled="!confirmed"
          :btn-toggle-selected="item.select"
          :btn-toggle-options="[
            { label: `${$n(item.payin / 100, 'nodecimals')}€`, value: 'excel-value' },
            {
              label:
                item.calculatedPayin !== -1
                  ? `${$n(item.calculatedPayin / 100, 'nodecimals')}€`
                  : '-',
              value: 'calculated-value',
            },
          ]"
          @changedBtnToggle="$emit('changedBtnToggle', $event)"
          @menuClick="$emit('menuClick', $event)"
        />
      </div>
      <div class="text-center"><q-spinner-dots v-if="is_fetching" color="primary" size="40" /></div>
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiAcquittanceErrorList',
  components: {
    PrassiHeaderList,
    PrassiBodyList,
    PrassiEmptyList,
  },
  data() {
    return {
      loadedErrorPayments: [],
      skip: 0,
      is_fetching: false,
      myHeader: [
        {
          _id: '1',
          label: 'payIn.installmentDate',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 90,
        },
        {
          _id: '2',
          label: 'payIn.contractId',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 140,
        },
        {
          _id: '21',
          label: 'payIn.status',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 300,
          col: true,
        },
        {
          _id: '3',
          label: 'payIn.premiumGross',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 80,
        },
        {
          _id: '4',
          label: 'payIn.premiumNet',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 80,
        },
        {
          _id: '5',
          label: 'payIn.installment',
          sublabel: 'payIn.productivePeriod',
          size: 'small',
          weight: 'light',
          width: 80,
        },
        {
          _id: '5-1',
          label: 'payIn.manuallyModified',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 40,
        },
        {
          _id: '6',
          label: 'payIn.payInOrCalculated',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 183,
        },
      ],
    };
  },
  props: {
    errorPayments: {
      type: Array,
      default: () => [],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    errorPayments: {
      immediate: true,
      handler() {
        this.$utils.log('ACQUITTANCE-ERROR-LIST', 'errorPayments');
        this.loadedErrorPayments = [];
        this.skip = 0;
        this.is_fetching = true;
        this.$nextTick().then(() => {
          this.resumeScrolling();
        });
      },
    },
  },
  methods: {
    stopScrolling() {
      this.$utils.log('ACQUITTANCE-ERROR-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('ACQUITTANCE-ERROR-LIST', 'RESUME SCROLLING');
      if (typeof this.$refs.infiniteScroll !== 'undefined') {
        this.$refs.infiniteScroll.resume();
      }
    },
    forceScrolling() {
      this.$utils.log('ACQUITTANCE-ERROR-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    // eslint-disable-next-line no-unused-vars
    loadMore(index, done) {
      this.$utils.logobj('ACQUITTANCE-ERROR-LIST', 'LOAD MORE index', index);
      const items = this.errorPayments.slice(this.skip, this.skip + 20);

      this.$utils.logobj('ACQUITTANCE-ERROR-LIST', 'items', items);

      if (items && items.length !== 0) {
        this.skip += 20;
        this.loadedErrorPayments = [...this.loadedErrorPayments, ...items];
        this.$nextTick().then(() => {
          done();
        });
      } else {
        this.is_fetching = false;
        this.stopScrolling();
      }
    },
    myBody(errorPayment) {
      return [
        {
          _id: '0',
          type: 'chip',
          icon: 'fa fa-check',
          chipText: this.$t(`payinChipText.${errorPayment.type}`),
        },
        {
          _id: '1',
          label: errorPayment.installmentDate
            ? this.$d(new Date(errorPayment.installmentDate))
            : '-',
          size: 'small',
          weight: 'normal',
          width: 90,
          type: '2rows',
        },
        {
          _id: '2',
          label: errorPayment.contractId,
          size: 'medium',
          weight: 'normal',
          width: 140,
          type: '2rows',
        },
        {
          _id: '21',
          label: errorPayment.status,
          size: 'medium',
          weight: 'normal',
          width: 300,
          type: '2rows',
          col: true,
        },
        {
          _id: '3',
          label: `${this.$n(errorPayment.premiumGross / 100, 'nodecimals')}€`,
          size: 'small',
          weight: 'normal',
          width: 80,
          type: '2rows',
        },
        {
          _id: '4',
          label: `${this.$n(errorPayment.premiumNet / 100, 'nodecimals')}€`,
          size: 'small',
          weight: 'normal',
          width: 80,
          type: '2rows',
        },
        {
          _id: '5',
          label: `${errorPayment.installment}`,
          sublabel: `${errorPayment.productivePeriodYear}/${errorPayment.productivePeriodMonth}`,
          size: 'medium',
          weight: 'light',
          width: 80,
          type: '2rows',
        },
        {
          _id: '8',
          type: 'icon',
          color: (() => {
            switch (errorPayment.manuallyModified) {
              case true:
                return 'green';
              case false:
                return 'grey';
              default:
                return 'grey';
            }
          })(),
          icon: (() => {
            switch (errorPayment.manuallyModified) {
              case true:
                return 'fa fa-pen';
              case false:
                return 'fa fa-edit';
              default:
                return 'fa fa-edit';
            }
          })(),
          width: 40,
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-item
  padding-left 10px
</style>
