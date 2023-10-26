<template>
  <div class="fill-available row no-wrap">
    <q-stepper
      class="no-shadow q-mr-sm min-w-170"
      vertical
      header-nav
      ref="stepper"
      v-model="commissioningStep"
      active-color="secondary"
    >
      <q-step prefix="1" :order="1" name="purchase" :title="$t('commissioning.purchase')" />
      <q-step prefix="2" :order="2" name="income" :title="$t('commissioning.income')" />
      <q-step prefix="3" :order="4" name="totalBalance" :title="$t('commissioning.totalBalance')" />
      <q-step prefix="4" :order="5" name="totalNetwork" :title="$t('commissioning.totalNetwork')" />
      <q-step
        prefix="5"
        :order="6"
        icon="fa fa-check"
        name="confirm"
        :title="$t('commissioning.confirm')"
        :disable="status !== 'confirmed' && status !== 'closed'"
      />
    </q-stepper>

    <prassi-commissioning-installment-list
      class="col"
      v-if="commissioningStep === 'purchase'"
      :is-fetching="isFetching"
      :key="0"
      kind="purchase"
      :closed="closed"
      :installments="purchase"
      @changeChecked="setInstallmentsPurchaseChecked($event)"
      @checkedAll="setAllInstallmentsPurchaseChecked($event)"
      @addSelected="addSelectedPurchase"
      @removeSelected="removeSelectedPurchase"
    />

    <prassi-commissioning-installment-list
      class="col"
      v-if="commissioningStep === 'income'"
      :is-fetching="isFetching"
      :key="1"
      kind="cashIn"
      :closed="closed"
      :installments="cashIn"
      @changeChecked="setInstallmentsCashInChecked($event)"
      @checkedAll="setAllInstallmentsCashInChecked($event)"
      @addSelected="addSelectedCashIn"
      @removeSelected="removeSelectedCashIn"
    />

    <prassi-commissioning-total-balance-list
      class="col fill-available"
      v-if="commissioningStep === 'totalBalance'"
      :is-fetching="isFetching"
      :installments="included"
      :mfees="mfees"
    />

    <prassi-commissioning-total-network-list
      class="col"
      v-if="commissioningStep === 'totalNetwork'"
      :status="status"
      :is-fetching="isFetching"
      :network="network"
      :roles="roles"
      @reopenCommissioning="reopenCommissioning"
      @resetCommissioning="resetCommissioning"
      @rollbackCommissioning="rollbackCommissioning"
      @downloadExcel="downloadExcel"
      @downloadExcelInstallments="downloadExcelInstallments"
    />

    <prassi-commissioning-confirm
      class="col"
      v-if="commissioningStep === 'confirm'"
      :status="status"
      :commissioning="commissioning"
      @confirm="confirmCommissioning"
      @unclose="uncloseCommissioning"
    />

    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
      v-if="commissioningStep !== 'confirm'"
    >
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="$refs.stepper.next()"
        icon="fa fa-arrow-right"
      />
    </q-page-sticky>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiCommissioningInstallmentList from '../components/commissioning/prassi-commissioning-installment-list';
import PrassiCommissioningTotalBalanceList from '../components/commissioning/prassi-commissioning-total-balance-list';
import PrassiCommissioningConfirm from '../components/commissioning/prassi-commissioning-confirm';
import PrassiCommissioningTotalNetworkList from '../components/commissioning/prassi-commissioning-total-network-list';

export default {
  name: 'CommissioningDetail',
  components: {
    PrassiCommissioningTotalNetworkList,
    PrassiCommissioningConfirm,
    PrassiCommissioningTotalBalanceList,
    PrassiCommissioningInstallmentList,
  },
  data() {
    return {
      commissioningStep: 'purchase',
      myCommissioningTimer: {},
    };
  },
  mounted() {
    this.resetInstallmentsPurchase();
    this.resetInstallmentsCashIn();
    this.fetchInstallmentsPurchase(this.$route.params.id);
    this.fetchInstallmentsCashIn(this.$route.params.id);
  },
  beforeDestroy() {
    clearInterval(this.myCommissioningTimer);
  },
  computed: {
    ...mapState({
      isFetching: (state) => state.error.isFetching,
      status: (state) => state.commissioning.commissioning.item.status,
      commissioning: (state) => state.commissioning.commissioning.item,
      purchase: (state) => state.commissioning.installmentsPurchase.items,
      cashIn: (state) => state.commissioning.installmentsCashIn.items,
      included: (state) => state.commissioning.installmentsIncluded.items,
      network: (state) => state.commissioning.totalNetwork.items,
      mfees: (state) => state.commissioning.mfees.items,
      report: (state) => state.commissioning.report.item,
      document: (state) => state.documents.document.item,
      roles: (state) => state.promoters.roles.items,
      exportId: (state) => state.commissioning.exportId,
    }),
    closed() {
      return (
        this.commissioning.status === 'closed' ||
        this.commissioning.status === 'processing' ||
        this.commissioning.status === 'confirmed' ||
        this.commissioning.status === 'opened-error'
      );
    },
  },
  watch: {
    status(status) {
      switch (status) {
        case 'opened':
          this.commissioningStep = 'purchase';
          break;
        case 'opened-error':
        case 'confirmed':
          this.commissioningStep = 'totalNetwork';
          break;
        default:
          break;
      }
    },
    // eslint-disable-next-line sonarjs/cognitive-complexity
    commissioningStep(step) {
      switch (step) {
        case 'purchase':
          this.resetInstallmentsPurchase();
          this.resetInstallmentsCashIn();
          this.fetchInstallmentsPurchase(this.$route.params.id);
          this.fetchInstallmentsCashIn(this.$route.params.id);
          break;
        case 'totalBalance':
          this.fetchInstallmentsIncluded(this.$route.params.id);
          this.fetchMFees(this.$route.params.id);
          break;
        case 'totalNetwork':
          if (this.commissioning.status === 'opened' && this.commissioning.status !== 'closed') {
            this.resetTotalNetwork();
            this.setCommissioningConfirm(this.$route.params.id).then(() => {
              this.myCommissioningTimer = setInterval(() => {
                this.fetchCommissioning(this.$route.params.id).then(async () => {
                  if (this.status === 'confirmed') {
                    this.resetTotalNetwork();
                    this.fetchTotalNetwork(this.$route.params.id);
                  }
                  if (this.status === 'confirmed' || this.status === 'opened-error') {
                    clearInterval(this.myCommissioningTimer);
                  }
                });
              }, 5000);
            });
          } else if (this.commissioning.status !== 'processing') {
            this.resetTotalNetwork();
            this.fetchTotalNetwork(this.$route.params.id);
          }
          break;
        case 'confirm':
          break;
        default:
          break;
      }
    },
  },
  methods: {
    ...mapActions({
      fetchCommissioning: 'commissioning/fetchCommissioning',
      fetchInstallmentsPurchase: 'commissioning/fetchInstallmentsPurchase',
      fetchInstallmentsCashIn: 'commissioning/fetchInstallmentsCashIn',
      fetchInstallmentsIncluded: 'commissioning/fetchInstallmentsIncluded',
      fetchMFees: 'commissioning/fetchMFees',
      fetchTotalNetwork: 'commissioning/fetchTotalNetwork',
      addSelectedInstallments: 'commissioning/addSelectedInstallments',
      removeSelectedInstallments: 'commissioning/removeSelectedInstallments',
      setCommissioningConfirm: 'commissioning/setCommissioningConfirm',
      setCommissioningReopenError: 'commissioning/setCommissioningReopenError',
      setCommissioningReset: 'commissioning/setCommissioningReset',
      setCommissioningRollback: 'commissioning/setCommissioningRollback',
      setCommissioningRollbackClose: 'commissioning/setCommissioningRollbackClose',
      setCommissioningClose: 'commissioning/setCommissioningClose',
      fetchResultExcelReport: 'commissioning/fetchResultExcelReport',
      fetchResultExcelInstallmentsReport: 'commissioning/fetchResultExcelInstallmentsReport',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
      fetchExportUrl: 'documents/fetchExportUrl',
    }),
    ...mapMutations({
      resetInstallmentsPurchase: 'commissioning/resetInstallmentsPurchase',
      resetInstallmentsCashIn: 'commissioning/resetInstallmentsCashIn',
      resetTotalNetwork: 'commissioning/resetTotalNetwork',
      setInstallmentsPurchaseChecked: 'commissioning/setInstallmentsPurchaseChecked',
      setInstallmentsCashInChecked: 'commissioning/setInstallmentsCashInChecked',
      setAllInstallmentsPurchaseChecked: 'commissioning/setAllInstallmentsPurchaseChecked',
      setAllInstallmentsCashInChecked: 'commissioning/setAllInstallmentsCashInChecked',
      changeExportInProgressState: 'documents/changeExportInProgressState',
      changeExportCompletedState: 'documents/changeExportCompletedState',
    }),
    addSelectedPurchase(data) {
      if (!data.filter.find((el) => el.checked)) return;
      this.$q.loading.show({ delay: 200 });
      this.addSelectedInstallments(data).then(() => {
        this.fetchInstallmentsPurchase(this.$route.params.id).finally(() => {
          this.$q.loading.hide();
        });
      });
    },
    removeSelectedPurchase(data) {
      if (!data.filter.find((el) => el.checked)) return;
      this.$q.loading.show({ delay: 200 });
      // eslint-disable-next-line sonarjs/no-identical-functions
      this.removeSelectedInstallments(data).finally(() => {
        this.fetchInstallmentsPurchase(this.$route.params.id).finally(() => {
          this.$q.loading.hide();
        });
      });
    },
    addSelectedCashIn(data) {
      if (!data.filter.find((el) => el.checked)) return;
      this.$q.loading.show({ delay: 200 });
      this.addSelectedInstallments(data).finally(() => {
        this.fetchInstallmentsCashIn(this.$route.params.id).finally(() => {
          this.$q.loading.hide();
        });
      });
    },
    removeSelectedCashIn(data) {
      if (!data.filter.find((el) => el.checked)) return;
      this.$q.loading.show({ delay: 200 });
      // eslint-disable-next-line sonarjs/no-identical-functions
      this.removeSelectedInstallments(data).finally(() => {
        this.fetchInstallmentsCashIn(this.$route.params.id).finally(() => {
          this.$q.loading.hide();
        });
      });
    },
    confirmCommissioning() {
      this.$utils.log('COMMISSIONING-DETAIL', 'confirmCommissioning');
      this.setCommissioningClose(this.$route.params.id).then(async () => {
        this.$utils.log('COMMISSIONING-DETAIL', 'confirmCommissioning');
        this.$q.notify({
          message: this.$t('commissioning.closingConfirm'),
          color: 'secondary',
          timeout: 300,
        });

        this.$router.push('/commissioning');
      });
    },
    uncloseCommissioning() {
      this.$utils.log('COMMISSIONING-DETAIL', 'uncloseCommissioning');
      this.setCommissioningRollbackClose(this.$route.params.id).then(() => {
        this.myCommissioningTimer = setInterval(() => {
          this.fetchCommissioning(this.$route.params.id).then(async () => {
            if (this.status === 'confirmed') {
              this.commissioningStep = 'totalNetwork';
              clearInterval(this.myCommissioningTimer);
            }
          });
        }, 5000);
      });
    },
    downloadExcelInstallments() {
      this.$utils.log('COMMISSIONING-DETAIL', 'downloadExcelInstallments');
      this.$q.loading.show({ delay: 200 });

      this.fetchResultExcelInstallmentsReport(this.$route.params.id)
        .then(() => {
          this.changeExportInProgressState(true);
          this.changeExportCompletedState(false);
          this.myExportTimer = setInterval(() => {
            this.fetchExportUrl(this.exportId).then(async () => {
              if (this.document.found) {
                this.changeExportInProgressState(false);
                this.changeExportCompletedState(true);
                clearInterval(this.myExportTimer);
              }
            });
          }, 5000);
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },
    downloadExcel() {
      this.$utils.log('COMMISSIONING-DETAIL', 'downloadExcel');
      this.fetchResultExcelReport(this.$route.params.id)
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then(() => {
          this.changeExportInProgressState(true);
          this.changeExportCompletedState(false);
          // eslint-disable-next-line sonarjs/no-identical-functions
          this.myExportTimer = setInterval(() => {
            // eslint-disable-next-line sonarjs/no-identical-functions
            this.fetchExportUrl(this.exportId).then(async () => {
              if (this.document.found) {
                this.changeExportInProgressState(false);
                this.changeExportCompletedState(true);
                clearInterval(this.myExportTimer);
              }
            });
          }, 5000);
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },
    reopenCommissioning() {
      this.$utils.log('COMMISSIONING-DETAIL', 'reloadCommissioning');
      this.setCommissioningReopenError(this.$route.params.id).then(() => {
        this.commissioningStep = 'purchase';
      });
    },
    resetCommissioning() {
      this.$utils.log('COMMISSIONING-DETAIL', 'resetCommissioning');
      this.setCommissioningReset(this.$route.params.id).then(() => {
        this.myCommissioningTimer = setInterval(() => {
          this.fetchCommissioning(this.$route.params.id).then(async () => {
            this.$utils.log('COMMISSIONING-DETAIL', 'resetCommissioning', this.status);
            if (this.status === 'opened') {
              this.commissioningStep = 'purchase';
            }
            if (this.status === 'opened' || this.status === 'opened-error') {
              clearInterval(this.myCommissioningTimer);
            }
          });
        }, 5000);
      });
    },
    rollbackCommissioning() {
      this.$utils.log('COMMISSIONING-DETAIL', 'rollbackCommissioning');
      // eslint-disable-next-line sonarjs/no-identical-functions
      this.setCommissioningRollback(this.$route.params.id).then(() => {
        // eslint-disable-next-line sonarjs/no-identical-functions
        this.myCommissioningTimer = setInterval(() => {
          // eslint-disable-next-line sonarjs/no-identical-functions
          this.fetchCommissioning(this.$route.params.id).then(async () => {
            if (this.status === 'opened') {
              this.commissioningStep = 'purchase';
            }
            if (this.status === 'opened' || this.status === 'opened-error') {
              clearInterval(this.myCommissioningTimer);
            }
          });
        }, 5000);
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-stepper
  background-color white
  border-radius 4px
  border solid 1px $card-border
</style>
