<template>
  <div class="column fill-available no-wrap">
    <prassi-navigate
      not-navigate
      :button2="closed !== true && $user.roleID >= 1000"
      :button-label="$t('default.downloadExcel')"
      :button-label2="$t('invoicing.reopenInvoicing')"
      @buttonClicked="$emit('downloadExcel')"
      @button2Clicked="$emit('reopenInvoicing')"
    />

    <prassi-navigate
      v-if="closed !== true && $user.roleID >= 7"
      not-navigate
      button-label="Import"
      @buttonClicked="openImportFile"
      button3
      button-label3="Rollback"
      @button3Clicked="$emit('rollback')"
    />
    <input type="file" style="display: none" ref="fileImport" @change="importInvoicingFile" />

    <prassi-promoter-filter @changed="filterPromoterChange" />

    <prassi-header-list class="p-item" :blocks="myHeader" />

    <prassi-empty-list v-if="filteredNetwork.length === 0 && !isFetching" />

    <div class="fill-available q-infinite-scroll">
      <div style="height: 6px" />
      <div
        class="p-item"
        v-for="item in filteredNetwork"
        :key="item._id"
        @click="$emit('invoiceClicked', item._id)"
      >
        <prassi-body-list :blocks="myBody(item)" :id="item._id" />
      </div>
      <div class="full-width q-ma-xl" />
    </div>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiPromoterFilter from '../promoter/prassi-promoter-filter';
import PrassiEmptyList from '../base/prassi-empty-list';
import PrassiNavigate from '../base/prassi-navigate';

export default {
  name: 'PrassiInvoicingTotalNetworkList',
  components: {
    PrassiHeaderList,
    PrassiBodyList,
    PrassiPromoterFilter,
    PrassiEmptyList,
    PrassiNavigate,
  },
  data() {
    return {
      filteredNetwork: this.network,
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
          label: 'invoicing.role',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
        {
          _id: '1-1',
          label: 'invoicing.tax',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 120,
        },
        {
          _id: '2',
          label: 'invoicing.totalIncome',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
        {
          _id: '3',
          label: 'invoicing.totalOther',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
        {
          _id: '4',
          label: 'invoicing.totalGross',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
      ],
    };
  },
  props: {
    network: {
      type: Array,
      default: () => [],
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    closed: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    network: {
      immediate: true,
      handler(network) {
        this.filteredNetwork = network;
      },
    },
  },
  methods: {
    openImportFile() {
      this.$refs.fileImport.click();
    },
    importInvoicingFile(e) {
      this.$emit('importFile', e);
    },
    filterPromoterChange(filter) {
      this.filteredNetwork = filter.searchPromoter
        ? this.network.filter((el) =>
            el.promoterDisplayName.toUpperCase().includes(filter.searchPromoter.toUpperCase()),
          )
        : this.network;
    },
    myBody(item) {
      return [
        {
          _id: '0',
          label: item.promoterDisplayName,
          sublabel: item.promoterNetworkPath,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, item.promoterRoleId),
          size: 'small',
          weight: 'normal',
          width: 274,
          type: '2rows',
          col: true,
        },
        {
          _id: '1',
          label: this.$utils.getRoleShortName(this.roles, item.promoterRoleId),
          size: 'medium',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '1-1',
          label: this.$t(`invoicing.${item.taxRegimeType}`),
          size: 'medium',
          weight: 'normal',
          width: 120,
          type: '2rows',
        },
        {
          _id: '2',
          label:
            item.directCommissionsAmount || item.indirectCommissionsAmount
              ? `${this.$n(
                  (item.directCommissionsAmount + item.indirectCommissionsAmount) / 100,
                  'nodecimals',
                )}€`
              : '-',
          size: 'medium',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '3',
          label: item.otherAmount ? `${this.$n(item.otherAmount / 100, 'nodecimals')}€` : '-',
          size: 'medium',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '4',
          label: item.grossAmount ? `${this.$n(item.grossAmount / 100, 'nodecimals')}€` : '0',
          size: 'medium',
          weight: 'normal',
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
