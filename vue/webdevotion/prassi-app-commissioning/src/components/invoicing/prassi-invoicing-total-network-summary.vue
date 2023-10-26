<template>
  <div class="column fill-available no-wrap">
    <prassi-filter
      :button="filter.selected !== 'all' && !readonly"
      :button-label="
        filter.selected === 'confirmed'
          ? $t('invoicing.removeSelected')
          : $t('invoicing.addSelected')
      "
      :checkbox="filter.selected !== 'all' && !readonly"
      :checked="allChecked"
      :checkbox-label="$t('commissioning.allCheckbox')"
      :menus="menuFilter"
      :filter="filter"
      @changed="changedFilter"
      @changedChecked="changedChecked"
      @buttonClicked="$emit(addOrRemoveEvent)"
    />

    <prassi-search-filter
      :search-label="$t('filterPromoterBlock.searchPromoter')"
      @changedSearch="searchChange"
    />

    <prassi-header-list
      class="p-item"
      :checkbox="filter.selected !== 'all' && !readonly"
      :blocks="myHeader"
    />

    <prassi-empty-list v-if="filteredNetwork.length === 0 && !isFetching" />

    <div class="fill-available q-infinite-scroll">
      <div style="height: 6px" />
      <div
        class="p-item"
        v-for="item in filteredNetwork"
        :key="item._id"
        @click="$emit('invoiceClicked', item._id)"
      >
        <prassi-body-list
          :checkbox="filter.selected !== 'all' && !readonly"
          :checked="item.checked || false"
          :blocks="myBody(item)"
          :id="item._id"
          @changedChecked="
            filter.selected === 'confirmed'
              ? $emit('changeConfirmedChecked', $event)
              : $emit('changeUnconfirmedChecked', $event)
          "
        />
      </div>
      <div class="full-width q-ma-xl" />
    </div>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiFilter from '../base/prassi-filter';
import PrassiSearchFilter from '../base/prassi-search-filter';
import PrassiEmptyList from '../base/prassi-empty-list';

export default {
  name: 'PrassiInvoicingTotalNetworkSummary',
  components: {
    PrassiFilter,
    PrassiHeaderList,
    PrassiBodyList,
    PrassiSearchFilter,
    PrassiEmptyList,
  },
  data() {
    return {
      filteredNetwork: [],
      allChecked: false,
      searchPromoter: '',
      filter: {
        selected: 'unconfirmed',
        searchPromoter: '',
        roleType: 'none',
      },
      menuFilter: [
        {
          _id: 'unconfirmed',
          label: this.$t('invoicing.unconfirmedItems'),
        },
        {
          _id: 'confirmed',
          label: this.$t('invoicing.confirmedItems'),
        },
        {
          _id: 'all',
          label: this.$t('invoicing.allItems'),
        },
      ],
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
    networkConfirmed: {
      type: Array,
      default: () => [],
    },
    networkUnconfirmed: {
      type: Array,
      default: () => [],
    },
    networkAll: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
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
  watch: {
    networkConfirmed: {
      immediate: true,
      handler() {
        this.applyFilter();
      },
    },
    networkUnconfirmed: {
      immediate: true,
      handler() {
        this.applyFilter();
      },
    },
  },
  computed: {
    addOrRemoveEvent() {
      return this.filter.selected === 'confirmed' ? 'removeSelected' : 'addSelected';
    },
    viewNetwork() {
      switch (this.filter.selected) {
        case 'confirmed':
          return this.networkConfirmed;
        case 'unconfirmed':
          return this.networkUnconfirmed;
        case 'all':
          return this.networkAll;
        default:
          return this.networkConfirmed;
      }
    },
  },
  methods: {
    changedChecked(checked) {
      this.allChecked = checked;
      this.$emit('checkedAll', { checked, filter: this.filteredNetwork });
    },
    changedFilter(filter) {
      this.$utils.logobj('INVOICINT-TOTAL-NETWORK', 'changedFilter', filter);
      this.filter = filter;
      this.filter.searchPromoter = this.searchPromoter;
      this.allChecked = false;
      this.applyFilter();
    },
    searchChange(filter) {
      this.$utils.logobj('INVOICINT-TOTAL-NETWORK', 'searchChange', filter);
      this.searchPromoter = filter;
      this.filter.searchPromoter = filter;
      this.allChecked = false;
      this.applyFilter();
    },
    applyFilter() {
      this.filteredNetwork = this.viewNetwork;
      this.filteredNetwork = this.filter.searchPromoter
        ? this.viewNetwork.filter((el) =>
            el.promoterDisplayName.toUpperCase().includes(this.filter.searchPromoter.toUpperCase()),
          )
        : this.viewNetwork;
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
