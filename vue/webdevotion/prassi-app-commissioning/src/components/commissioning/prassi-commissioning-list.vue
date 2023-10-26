<template>
  <div>
    <prassi-header-list class="p-cl-item" :blocks="myHeader" no-scrollbar />
    <div style="height: 6px" />

    <prassi-empty-list v-if="commissionings.length === 0 && !isFetching" />

    <div
      class="p-cl-item"
      v-for="commissioning in commissionings"
      :key="commissioning._id"
      @click="$emit('viewClick', commissioning._id)"
    >
      <prassi-body-list
        :blocks="myBody(commissioning)"
        :id="commissioning._id"
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
        @click="$emit('addCommissioning')"
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
  name: 'PrassiCommissioningList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'commissioningHeader.closingDate',
          sublabel: 'commissioningHeader.openingDate',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
        {
          _id: '1',
          label: 'commissioningHeader.productivePeriod',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 130,
        },
        {
          _id: '2',
          label: 'commissioningHeader.status',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 120,
          col: true,
        },
        {
          _id: '3',
          label: 'commissioningHeader.earnings',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 120,
        },
        {
          _id: '4',
          label: 'commissioningHeader.expenses',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 120,
        },
        {
          _id: '5',
          label: 'commissioningHeader.margin',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 120,
        },
        {
          _id: '6',
          label: 'commissioningHeader.consultants',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 120,
        },
      ],
    };
  },
  props: {
    commissionings: {
      type: Array,
      default: () => [],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    myBody(commissioning) {
      return [
        {
          _id: '1',
          label: commissioning.didClosedDate ? this.$d(new Date(commissioning.didClosedDate)) : '-',
          sublabel: this.$d(new Date(commissioning.didOpenedDate)),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '2',
          label: `${this.$utils.numberToMonth(
            commissioning.productivePeriodMonth,
            this.$t.bind(this),
          )} ${commissioning.productivePeriodYear}`,
          size: 'medium',
          weight: 'normal',
          width: 130,
          type: '2rows',
        },
        {
          _id: '3',
          label: this.$t(`commissioning.${commissioning.status}`),
          size: 'small',
          weight: 'normal',
          width: 120,
          type: '2rows',
          col: true,
        },
        {
          _id: '4',
          label: `${this.$n(commissioning.income / 100, 'nodecimals')}€`,
          size: 'large',
          weight: 'light',
          width: 120,
          type: '2rows',
        },
        {
          _id: '5',
          label: `${this.$n(commissioning.outcome / 100, 'nodecimals')}€`,
          size: 'medium',
          weight: 'light',
          width: 120,
          type: '2rows',
        },
        {
          _id: '6',
          label: `${this.$n(commissioning.margin / 100, 'nodecimals')}€`,
          size: 'medium',
          weight: 'light',
          width: 120,
          type: '2rows',
        },
        {
          _id: '7',
          label: `${this.$n(commissioning.promotersCount, 'integer')}`,
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
