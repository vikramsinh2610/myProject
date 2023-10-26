<template>
  <div class="column fill-available">
    <div
      class="column fill-available"
      v-if="
        status !== 'processing' &&
        status !== 'rollbacking' &&
        status !== 'rollbacking-error' &&
        status !== 'opened-error'
      "
    >
      <prassi-navigate
        not-navigate
        :button2="status === 'confirmed'"
        button3
        :button-label="$t('default.downloadExcel')"
        :button-label2="$t('commissioning.rollbackCommissioning')"
        :button-label3="$t('commissioning.downloadExcelInstallments')"
        @buttonClicked="$emit('downloadExcel')"
        @button2Clicked="$emit('rollbackCommissioning')"
        @button3Clicked="$emit('downloadExcelInstallments')"
      />
      <prassi-promoter-filter @changed="filterPromoterChange" />

      <prassi-header-list class="p-item" :blocks="myHeader" />

      <prassi-empty-list v-if="network.length === 0 && !isFetching" />

      <q-infinite-scroll
        id="scroll-network-id"
        class="fill-available"
        inline
        ref="infiniteScroll"
        @load="loadMore"
        :offset="250"
        scroll-target="#scroll-network-id"
      >
        <div style="height: 6px" />
        <div
          class="p-item cursor-pointer"
          v-for="item in loadedNetwork"
          :key="item._id"
          @click="showDossiers(item._id)"
        >
          <prassi-body-list :blocks="myBody(item)" :id="item._id" />
        </div>
        <div class="text-center">
          <q-spinner-dots v-if="is_fetching" color="primary" size="40" />
        </div>
      </q-infinite-scroll>
    </div>
    <div v-if="status === 'opened-error'" class="fill-available column">
      <prassi-navigate
        not-navigate
        :button2="$user.roleID >= 1000"
        :title-label="$t('commissioning.openedErrorTitle')"
        :button-label="$t('commissioning.reloadCommissioning')"
        :button-label2="$t('commissioning.resetCommissioning')"
        @buttonClicked="$emit('reopenCommissioning')"
        @button2Clicked="$emit('resetCommissioning')"
      />
      <prassi-log-events :commissioning-id="$route.params.id" invoicing-id="no-invoicing" />
    </div>
    <div
      v-if="status === 'processing' || status === 'rollbacking' || status === 'rollbacking-error'"
      class="fill-available column"
    >
      <prassi-navigate
        not-navigate
        loading
        :button="false"
        :title-label="$t('commissioning.processingTitle')"
      />
    </div>

    <q-dialog v-model="showDossiersDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('commissioning.dossiersDialog') }}</div>
        </q-card-section>
        <q-card-section>
          <q-table
            class="q-my-lg"
            :pagination.sync="pagination"
            :data="tableData"
            :columns="columns"
            row-key="name"
          >
            <q-tr slot="header" slot-scope="props" :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <div>{{ col.label }}</div>
                <div>{{ col.option ? computeProduct(col.option) : '' }}</div>
              </q-th>
            </q-tr>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiEmptyList from '../base/prassi-empty-list';
import PrassiPromoterFilter from '../promoter/prassi-promoter-filter';
import PrassiNavigate from '../base/prassi-navigate';
import PrassiLogEvents from '../base/prassi-log-events';

export default {
  name: 'PrassiCommissioningTotalNetworkList',
  components: {
    PrassiHeaderList,
    PrassiBodyList,
    PrassiEmptyList,
    PrassiPromoterFilter,
    PrassiNavigate,
    PrassiLogEvents,
  },
  data() {
    return {
      loadedNetwork: [],
      filteredNetwork: this.network,
      skip: 0,
      is_fetching: true,
      showDossiersDialog: false,
      pagination: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      columns: [
        {
          name: 'cashin',
          currency: true,
          required: true,
          label: this.$t(`commissioning.cashin`),
          align: 'left',
          field: 'cashin',
        },
        {
          name: 'practiceType',
          currency: true,
          required: true,
          label: this.$t(`commissioning.practiceType`),
          align: 'left',
          field: 'practiceType',
        },
        {
          name: 'dossierId',
          currency: true,
          required: true,
          label: this.$t(`commissioning.dossierId`),
          align: 'left',
          field: 'dossierId',
        },
        {
          name: 'installment',
          currency: true,
          required: true,
          label: this.$t(`commissioning.installment`),
          align: 'left',
          field: 'installment',
        },
        {
          name: 'productivePeriod',
          currency: true,
          required: true,
          label: this.$t(`commissioning.productivePeriod`),
          align: 'left',
          field: 'productivePeriod',
        },
        {
          name: 'indirect',
          currency: true,
          required: true,
          label: this.$t(`commissioning.indirect`),
          align: 'left',
          field: 'indirect',
        },
        {
          name: 'iv',
          currency: true,
          required: true,
          label: this.$t(`commissioning.iv`),
          align: 'left',
          field: 'iv',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
        },
      ],
      tableData: [],
      myHeader: [
        {
          _id: '0',
          label: 'commissioning.displayName',
          sublabel: 'commissioning.area',
          size: 'small',
          weight: 'normal',
          width: 200,
          col: true,
        },
        this.$env.edition === 'tcw'
          ? {
              _id: '1',
              label: 'commissioning.totalPurchase',
              sublabel: 'commissioning.indirect',
              size: 'small',
              weight: 'normal',
              width: 100,
            }
          : undefined,
        this.$env.edition === 'tcw'
          ? {
              _id: '2',
              label: 'commissioning.totalAdvance',
              sublabel: 'commissioning.indirect',
              size: 'small',
              weight: 'normal',
              width: 100,
            }
          : undefined,
        this.$env.edition === 'tcw'
          ? {
              _id: '3',
              label: 'commissioning.totalIncome',
              sublabel: 'commissioning.indirect',
              size: 'small',
              weight: 'normal',
              width: 100,
            }
          : undefined,
        this.$env.edition === 'tcw'
          ? {
              _id: '4',
              label: 'commissioning.totalFees',
              sublabel: '',
              size: 'small',
              weight: 'light',
              width: 100,
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '1',
              label: 'commissioning.totalIv',
              sublabel: '',
              size: 'small',
              weight: 'normal',
              width: 100,
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '2',
              label: 'commissioning.basisDirectAmount',
              sublabel: 'commissioning.basisIndirectAmount',
              size: 'small',
              weight: 'normal',
              width: 100,
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '3',
              label: 'commissioning.rangeDirectAmount',
              sublabel: 'commissioning.rangeIndirectAmount',
              size: 'small',
              weight: 'normal',
              width: 100,
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '4',
              label: 'commissioning.targetIv',
              sublabel: 'commissioning.targetAmount',
              size: 'small',
              weight: 'normal',
              width: 100,
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '5',
              label: 'commissioning.totalAnticipationDirect',
              sublabel: 'commissioning.totalAnticipationIndirect',
              size: 'small',
              weight: 'normal',
              width: 100,
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '5',
              label: 'commissioning.totalDirect',
              sublabel: 'commissioning.totalIndirect',
              size: 'small',
              weight: 'normal',
              width: 100,
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '6',
              label: 'commissioning.totalCashIn',
              sublabel: 'commissioning.totalFees',
              size: 'small',
              weight: 'normal',
              width: 100,
            }
          : undefined,
        {
          _id: '7',
          label: 'commissioning.totals',
          sublabel: '',
          size: 'small',
          weight: 'light',
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
    status: {
      type: String,
      default: '',
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
        this.$utils.log('COMMISSIONING-TOTALE-NETWORK', 'network');
        this.filteredNetwork = network;
        this.resetScrolling();
      },
    },
  },
  methods: {
    showDossiers(id) {
      this.tableData = [];
      const thisResult = this.network.find((el) => el._id === id);
      if (thisResult) {
        thisResult.details.installments.forEach((el) => {
          this.tableData.push({
            practiceType: el.practiceType.slice(0, 3),
            dossierId: el.dossierId,
            cashin: el.cashin,
            installment: el.installment,
            productivePeriod: el.productivePeriod,
            practiceId: el.practiceId,
            indirect: el.indirect,
            iv: el.iv / 100,
          });
        });
        this.showDossiersDialog = true;
      }
    },
    filterPromoterChange(filter) {
      this.filteredNetwork = filter.searchPromoter
        ? this.network.filter((el) =>
            el.displayName.toUpperCase().includes(filter.searchPromoter.toUpperCase()),
          )
        : this.network;

      this.resetScrolling();
    },
    resetScrolling() {
      this.loadedNetwork = [];
      this.skip = 0;
      this.is_fetching = true;
      this.$nextTick().then(() => {
        this.resumeScrolling();
      });
    },
    stopScrolling() {
      this.$utils.log('COMMISSIONING-TOTALE-NETWORK', 'STOP SCROLLING');
      this.$refs.infiniteScroll.stop();
    },
    resumeScrolling() {
      this.$utils.log('COMMISSIONING-TOTALE-NETWORK', 'RESUME SCROLLING');
      if (typeof this.$refs.infiniteScroll !== 'undefined') {
        this.$refs.infiniteScroll.resume();
      }
    },
    forceScrolling() {
      this.$utils.log('COMMISSIONING-TOTALE-NETWORK', 'FORCE SCROLLING');
      this.$refs.infiniteScroll.trigger();
    },
    // eslint-disable-next-line no-unused-vars
    loadMore(index, done) {
      this.$utils.logobj('COMMISSIONING-TOTALE-NETWORK', 'LOAD MORE index', index);
      const items = this.filteredNetwork.slice(this.skip, this.skip + 20);

      if (items && items.length !== 0) {
        this.skip += 20;
        this.loadedNetwork = [...this.loadedNetwork, ...items];
        this.$nextTick().then(() => {
          done();
        });
      } else {
        this.is_fetching = false;
        this.stopScrolling();
      }
    },
    // eslint-disable-next-line sonarjs/cognitive-complexity
    myBody(item) {
      return [
        {
          _id: '0',
          label: item.displayName,
          sublabel: item.path,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, item.roleId),
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
          col: true,
        },
        this.$env.edition === 'tcw'
          ? {
              _id: '1',
              label: `${
                item.details.purchaseDirectAmount || item.details.purchaseIndirectAmount
                  ? this.$n(
                      (item.details.purchaseIndirectAmount + item.details.purchaseDirectAmount) /
                        100,
                      'nodecimals',
                    )
                  : 0
              }€`,
              sublabel: `${
                item.details.purchaseIndirectAmount
                  ? this.$n(item.details.purchaseIndirectAmount / 100, 'nodecimals')
                  : 0
              }€`,
              size: 'medium',
              weight: 'normal',
              width: 100,
              type: '2rows',
            }
          : undefined,
        this.$env.edition === 'tcw'
          ? {
              _id: '2',
              label: `${
                item.details.advanceDirectAmount || item.details.advanceIndirectAmount
                  ? this.$n(
                      (item.details.advanceDirectAmount + item.details.advanceIndirectAmount) / 100,
                      'nodecimals',
                    )
                  : 0
              }€`,
              sublabel: `${
                item.details.advanceIndirectAmount
                  ? this.$n(item.details.advanceIndirectAmount / 100, 'nodecimals')
                  : 0
              }€`,
              size: 'small',
              weight: 'normal',
              width: 100,
              type: '2rows',
            }
          : undefined,
        this.$env.edition === 'tcw'
          ? {
              _id: '3',
              label: `${
                item.details.cashInDirectAmount || item.details.cashInIndirectAmount
                  ? this.$n(
                      (item.details.cashInDirectAmount + item.details.cashInIndirectAmount) / 100,
                      'nodecimals',
                    )
                  : 0
              }€`,
              sublabel: `${
                item.details.cashInIndirectAmount
                  ? this.$n(item.details.cashInIndirectAmount / 100, 'nodecimals')
                  : 0
              }€`,
              size: 'large',
              weight: 'light',
              width: 100,
              type: '2rows',
            }
          : undefined,
        this.$env.edition === 'tcw'
          ? {
              _id: '4',
              label: `${
                item.details.managementFee
                  ? this.$n(item.details.managementFee / 100, 'nodecimals')
                  : 0
              }€`,
              size: 'medium',
              weight: 'light',
              width: 100,
              type: '2rows',
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '1',
              label: `${
                item.details.totalIv ? this.$n(item.details.totalIv / 100, 'nodecimals') : 0
              }`,
              size: 'medium',
              weight: 'light',
              width: 100,
              type: '2rows',
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '2',
              label: `${
                item.details.basisDirectAmount
                  ? this.$n(item.details.basisDirectAmount / 100, 'nodecimals')
                  : 0
              }€`,
              sublabel: `${
                item.details.basisIndirectAmount
                  ? this.$n(item.details.basisIndirectAmount / 100, 'nodecimals')
                  : 0
              }€`,
              size: 'medium',
              weight: 'light',
              width: 100,
              type: '2rows',
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '3',
              label: `${
                item.details.rangeDirectAmount
                  ? this.$n(item.details.rangeDirectAmount / 100, 'nodecimals')
                  : 0
              }€`,
              sublabel: `${
                item.details.rangeIndirectAmount
                  ? this.$n(item.details.rangeIndirectAmount / 100, 'nodecimals')
                  : 0
              }€`,
              size: 'medium',
              weight: 'light',
              width: 100,
              type: '2rows',
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '4',
              label: `${
                item.details.targetIv ? this.$n(item.details.targetIv / 100, 'nodecimals') : 0
              }`,
              sublabel: `${
                item.details.targetAmount
                  ? this.$n(item.details.targetAmount / 100, 'nodecimals')
                  : 0
              }€`,
              size: 'medium',
              weight: 'light',
              width: 100,
              type: '2rows',
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '5',
              label: `${
                item.details.advanceDirectProductionAmount
                  ? this.$n(item.details.advanceDirectProductionAmount / 100, 'nodecimals')
                  : 0
              }€`,
              sublabel: `${
                item.details.advanceIndirectProductionAmount
                  ? this.$n(item.details.advanceIndirectProductionAmount / 100, 'nodecimals')
                  : 0
              }€`,
              size: 'medium',
              weight: 'light',
              width: 100,
              type: '2rows',
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '5',
              label: `${
                item.details.totalDirect ? this.$n(item.details.totalDirect / 100, 'nodecimals') : 0
              }€`,
              sublabel: `${
                item.details.totalIndirect
                  ? this.$n(item.details.totalIndirect / 100, 'nodecimals')
                  : 0
              }€`,
              size: 'medium',
              weight: 'light',
              width: 100,
              type: '2rows',
            }
          : undefined,
        this.$env.edition === 'sheltia'
          ? {
              _id: '6',
              label: `${
                item.details.totalCashIn ? this.$n(item.details.totalCashIn / 100, 'nodecimals') : 0
              }€`,
              sublabel: `${
                item.details.managementFee
                  ? this.$n(item.details.managementFee / 100, 'nodecimals')
                  : 0
              }€`,
              size: 'medium',
              weight: 'light',
              width: 100,
              type: '2rows',
            }
          : undefined,
        {
          _id: '7',
          label: `${this.$n(item.totalAmount / 100, 'nodecimals')}€`,
          size: 'medium',
          weight: 'light',
          width: 100,
          type: '2rows',
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped></style>
