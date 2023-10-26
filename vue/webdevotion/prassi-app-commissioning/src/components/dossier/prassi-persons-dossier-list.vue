<template>
  <div class="column fill-available">
    <prassi-header-list class="p-pl-item" :blocks="myHeader" />

    <prassi-empty-list v-if="dossiers.length === 0 && !isFetching" />

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
        class="p-pl-item"
        v-for="dossier in dossiers"
        :key="dossier._id"
        @click="$emit('viewDossier', dossier)"
      >
        <prassi-body-list :blocks="myBody(dossier)" :id="dossier._id" />
      </div>
      <q-spinner-ios
        v-if="isFetching"
        :class="dossiers && dossiers.length !== 0 ? 'center-spinner' : 'center-spinner-first'"
        color="primary"
        :size="dossiers && dossiers.length !== 0 ? '40' : '80'"
      />
    </q-infinite-scroll>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiPersonsDossierList',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList },
  data() {
    return {
      myHeader: [
        {
          _id: '0',
          label: 'dossierHeader.effectDate',
          sublabel: 'dossierHeader.emitDate',
          size: 'small',
          weight: 'normal',
          width: 80,
        },
        {
          _id: '1',
          label: 'dossierHeader.contractId',
          sublabel: 'dossierHeader.practice',
          size: 'small',
          weight: 'normal',
          width: 130,
        },
        {
          _id: '2',
          label: 'dossierHeader.insured',
          sublabel: 'dossierHeader.product',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '2-0',
          label: 'customerHeader.inherited',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 45,
        },
        {
          _id: '3',
          label: 'dossierHeader.insurer',
          sublabel: 'promoterHeader.area',
          size: 'small',
          weight: 'light',
          width: 340,
          col: true,
        },
        {
          _id: '4',
          label: 'dateRangeBlock.prassiDateRangeTitle',
          sublabel: 'dossierHeader.rate',
          size: 'small',
          weight: 'light',
          width: 100,
        },
        {
          _id: '5',
          label: 'dossierHeader.premium',
          sublabel: 'dossierHeader.iv',
          size: 'small',
          weight: 'light',
          width: 90,
        },
        {
          _id: '7',
          label: 'dossierHeader.status',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 45,
        },
        {
          _id: '8',
          label: 'dossierHeader.adequacy',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 40,
        },
      ],
    };
  },
  props: {
    dossiers: {
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
      this.$utils.log('DOSSIER-LIST', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('DOSSIER-LIST', 'RESUME SCROLLING');
      this.$refs.infiniteScroll.resume();
    },
    forceScrolling() {
      this.$utils.log('DOSSIER-LIST', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    loadMore(index, done) {
      this.$emit('loadMore', { index, done });
    },
    myBody(dossier) {
      return [
        {
          _id: '00',
          type: 'chip',
          icon: 'fa fa-check',
          chipText: this.$t(`payinChipText.${dossier.practiceType}`),
        },
        {
          _id: '0',
          label: dossier.effectDate ? this.$d(new Date(dossier.effectDate)) : '-',
          sublabel: dossier.emitDate ? this.$d(new Date(dossier.emitDate)) : '-',
          size: 'small',
          weight: 'normal',
          width: 80,
          type: '2rows',
        },
        {
          _id: '1',
          label: dossier.contractId,
          sublabel: dossier.practiceId,
          size: 'medium',
          weight: 'normal',
          width: 130,
          type: '2rows',
        },
        {
          _id: '2',
          label: dossier.insuredName,
          sublabel: dossier.productName,
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: '2-0',
          type: 'icon',
          color: dossier.inherited ? 'green' : 'grey',
          icon: dossier.inherited ? 'fas fa-arrow-up' : 'fa fa-check',
          width: 45,
        },
        {
          _id: '3',
          label: dossier.validPromoterName,
          sublabel: dossier.displayHierarchy,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, dossier.roleId),
          size: 'large',
          weight: 'light',
          width: 340,
          type: '2rows',
          col: true,
        },
        {
          _id: '4',
          label: `${dossier.effectProductivePeriodMonth} / ${dossier.effectProductivePeriodYear}`,
          sublabel: this.$utils.numberToRate(
            dossier.installmentsPerYear,
            this.$t.bind(this),
            dossier.unique,
          ),
          size: 'medium',
          weight: 'light',
          width: 100,
          type: '2rows',
        },
        {
          _id: '5',
          label: `${this.$n(dossier.premiumGross / 1, 'nodecimals')}€`,
          sublabel: `${this.$n(dossier.iv / 1, 'nodecimals')}`,
          size: 'medium',
          weight: 'light',
          width: 90,
          type: '2rows',
        },
        {
          _id: '7',
          label: dossier.statusName,
          size: 'small',
          weight: 'normal',
          width: 45,
          type: '2rows',
        },
        {
          _id: '8',
          type: 'icon',
          color: (() => {
            switch (dossier.adequacy) {
              case 3:
                return 'green';
              case 2:
                return 'grey';
              default:
                return 'red';
            }
          })(),
          icon: (() => {
            switch (dossier.adequacy) {
              case 3:
                return 'fa fa-check';
              case 2:
                return 'fa fa-edit';
              default:
                return 'fa fa-times';
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
.p-pl-item
  padding-left 10px
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
