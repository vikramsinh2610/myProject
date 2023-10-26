<template>
  <div>
    <prassi-invoicing-list
      :is-fetching="isFetching"
      :invoicings="invoicings"
      @viewClick="viewInvoicing"
      @addInvoicing="showAddInvoicingDialog"
      @menuClick="menuClick"
    />

    <q-dialog v-model="showInsertDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('invoicing.insertTitleDialog') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-5"
              v-model="dateEmitValue"
              mask="##-##-####"
              :label="$t('invoicing.addDateEmit')"
            >
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="dateEmitValue"
                      mask="DD-MM-YYYY"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              class="col-5"
              v-model="datePayValue"
              mask="##-##-####"
              :label="$t('invoicing.addDatePay')"
            >
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxyPay"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="datePayValue"
                      mask="DD-MM-YYYY"
                      @input="() => $refs.qDateProxyPay.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row justify-between q-my-xs">
            <q-select
              class="col-6"
              v-model="monthPeriod"
              :label="$t('commissioning.productivePeriodMonth')"
              :options="$utils.productivePeriodMonthList($t.bind(this))"
            />
            <q-input
              class="col-4"
              v-model="yearPeriod"
              type="number"
              :label="$t('commissioning.productivePeriodYear')"
              :error="$v.yearPeriod.$error"
              :error-message="$t('commissioning.productivePeriodYearError')"
              @blur="$v.yearPeriod.$touch"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.applyButton')" @click="addInvoicing" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showExportTcwDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            {{
              showExportTcwDialogTCA
                ? $t('default.downloadAccountExportTCA')
                : $t('default.downloadAccountExport')
            }}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-between q-my-xs">
            {{
              'ultima numerazione: ' +
              (showExportTcwDialogTCA ? exportNumberTCA.currentIndex : exportNumber.currentIndex)
            }}
          </div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-6"
              v-model="newExportNumber"
              type="number"
              :label="$t('commissioning.exportNumber')"
              :error="$v.newExportNumber.$error"
              :error-message="$t('commissioning.exportNumberError')"
              @blur="$v.newExportNumber.$touch"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button
            :label="$t('default.applyButton')"
            @click="
              showExportTcwDialogTCA
                ? downloadAccountExportTCA(exportPeriod)
                : downloadAccountExport(exportPeriod)
            "
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { date } from 'quasar';
import download from 'getfile-rename-js';
import { mapActions, mapMutations, mapState } from 'vuex';
import { required, between } from 'vuelidate/lib/validators';
import PrassiInvoicingList from '../components/invoicing/prassi-invoicing-list';
import useExportNumber from '../compositions/base/account-export-number';
import useExportNumberTCA from '../compositions/base/account-export-number-tca';

export default {
  name: 'InvoicingList',
  components: {
    PrassiInvoicingList,
  },
  setup() {
    const { exportNumber, setExportNumeberFilter } = useExportNumber();
    const { exportNumberTCA, setExportNumeberFilterTCA } = useExportNumberTCA();
    return { exportNumber, setExportNumeberFilter, exportNumberTCA, setExportNumeberFilterTCA };
  },
  data() {
    return {
      showInsertDialog: false,
      showExportTcwDialog: false,
      showExportTcwDialogTCA: false,
      dateEmitValue: date.formatDate(Date.now(), 'DD-MM-YYYY'),
      datePayValue: date.formatDate(Date.now(), 'DD-MM-YYYY'),
      monthPeriod: {
        label: this.$utils.numberToMonth(new Date().getMonth() + 1, this.$t.bind(this)),
        value: new Date().getMonth() + 1,
      },
      yearPeriod: new Date().getFullYear(),
      newExportNumber: 0,
      exportPeriod: 0,
    };
  },
  validations: {
    yearPeriod: {
      required,
      integer: true,
      between: between(2000, 2999),
    },
    newExportNumber: {
      required,
      integer: true,
    },
  },
  computed: {
    ...mapState({
      isFetching: (state) => state.error.isFetching,
      rootId: (state) => state.login._id,
      invoicings: (state) => state.invoicing.invoicings.items,
      last: (state) => state.invoicing.invoicings.lastRecord,
      report: (state) => state.invoicing.report.item,
      document: (state) => state.documents.document.item,
    }),
  },
  methods: {
    ...mapActions({
      fetchInvoicings: 'invoicing/fetchInvoicings',
      openInvoicing: 'invoicing/openInvoicing',
      fetchInvoicingExcelAllReport: 'invoicing/fetchInvoicingExcelAllReport',
      fetchInvoicingExcelAllYearReport: 'invoicing/fetchInvoicingExcelAllYearReport',
      fetchInvoicingExcelAccountExport: 'invoicing/fetchInvoicingExcelAccountExport',
      fetchTcwInvoicingExcelAccountExport: 'invoicing/fetchTcwInvoicingExcelAccountExport',
      fetchTcwInvoicingExcelAccountExportTCA: 'invoicing/fetchTcwInvoicingExcelAccountExportTCA',
      fetchInvoicingExcelPromotersRegistry: 'invoicing/fetchInvoicingExcelPromotersRegistry',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
    }),
    ...mapMutations({
      resetInvoicings: 'invoicing/resetInvoicings',
      resetInvoicing: 'invoicing/resetInvoicing',
      setInvoicingFilterSelected: 'invoicing/setInvoicingFilterSelected',
    }),
    addInvoicing() {
      this.$v.yearPeriod.$touch();

      if (!this.$v.yearPeriod.$error) {
        this.$utils.logobj('INVOICING-LIST', 'confirmAdd', this.yearPeriod);
        this.resetInvoicing();
        this.openInvoicing({
          invoicingId: `${this.yearPeriod}${this.monthPeriod.value.toString().padStart(2, '0')}`,
          issueDate: date
            .adjustDate(date.extractDate(this.dateEmitValue, 'DD-MM-YYYY'), {
              hours: 12,
              minutes: 0,
            })
            .toISOString(),
          dueDate: date
            .adjustDate(date.extractDate(this.datePayValue, 'DD-MM-YYYY'), {
              hours: 12,
              minutes: 0,
            })
            .toISOString(),
        }).then(() => {
          this.$router.push(
            `/invoicing/${this.yearPeriod}${this.monthPeriod.value.toString().padStart(2, '0')}`,
          );
        });
      } else {
        this.error = true;
        this.$q.notify(this.$t('default.cantSave'));
        this.dateEmitValue = date.formatDate(Date.now(), 'DD-MM-YYYY');
        this.datePayValue = date.formatDate(Date.now(), 'DD-MM-YYYY');
        this.monthPeriod = {
          label: this.$utils.numberToMonth(
            this.selectedPayment.productivePeriodMonth,
            this.$t.bind(this),
          ),
          value: this.selectedPayment.productivePeriodMonth,
        };
        this.yearPeriod = new Date().getFullYear();
      }
    },
    showAddInvoicingDialog() {
      this.$utils.log('INVOICING-LIST', 'showAddInvoicingDialog called');
      this.showInsertDialog = true;
    },
    viewInvoicing(id) {
      this.$utils.logobj('INVOICING-LIST', 'viewInvoicing', id);
      this.$router.push(`/invoicing/${id}`);
    },
    downloadExcel(period) {
      this.$utils.log('INVOICING-LIST', 'downloadExcel');
      this.fetchInvoicingExcelAllReport(period).then(() => {
        this.fetchDocumentUrl(this.report.documentId).then(() => {
          download(this.document.url, this.document.displayName);
        });
      });
    },
    // eslint-disable-next-line sonarjs/no-identical-functions
    downloadExcelYear(period) {
      this.$utils.log('INVOICING-LIST', 'downloadExcelYear');
      // eslint-disable-next-line sonarjs/no-identical-functions
      this.fetchInvoicingExcelAllYearReport(period).then(() => {
        this.fetchDocumentUrl(this.report.documentId).then(() => {
          download(this.document.url, this.document.displayName);
        });
      });
    },
    downloadAnagrafiche(period) {
      this.$utils.log('INVOICING-LIST', 'downloadAnagrafiche');
      // eslint-disable-next-line sonarjs/no-identical-functions
      this.fetchInvoicingExcelPromotersRegistry(period).then(() => {
        this.fetchDocumentUrl(this.report.documentId).then(() => {
          download(this.document.url, this.document.displayName);
        });
      });
    },
    downloadAccountExport(period) {
      this.$utils.log('INVOICING-DETAIL', 'downloadAccountExport');
      this.showExportTcwDialog = false;
      if (this.$env.edition === 'sheltia') {
        // eslint-disable-next-line sonarjs/no-identical-functions
        this.fetchInvoicingExcelAccountExport(period).then(() => {
          this.fetchDocumentUrl(this.report.documentId).then(() => {
            download(this.document.url, this.document.displayName);
          });
        });
      } else {
        // eslint-disable-next-line sonarjs/no-identical-functions
        this.fetchTcwInvoicingExcelAccountExport({
          period,
          newExportNumber: this.newExportNumber,
          // eslint-disable-next-line sonarjs/no-identical-functions
        }).then(() => {
          this.fetchDocumentUrl(this.report.documentId).then(() => {
            download(this.document.url, this.document.displayName);
          });
        });
      }
    },
    downloadAccountExportTCA(period) {
      this.$utils.log('INVOICING-DETAIL', 'downloadAccountExportTCA');
      // eslint-disable-next-line sonarjs/no-identical-functions
      this.showExportTcwDialog = false;
      this.fetchTcwInvoicingExcelAccountExportTCA({
        period,
        newExportNumber: this.newExportNumber,
        // eslint-disable-next-line sonarjs/no-identical-functions
      }).then(() => {
        this.fetchDocumentUrl(this.report.documentId).then(() => {
          download(this.document.url, this.document.displayName);
        });
      });
    },
    menuClick(param) {
      this.$utils.logobj('INVOICING-LIST', 'menuClick', param);
      const actions = [
        {
          label: this.$t('default.downloadExcel'),
          icon: 'fa fa-download',
          color: 'green',
          handler: () => {
            this.downloadExcel(param);
          },
        },
        {
          label: this.$t('default.downloadExcelYear'),
          icon: 'fa fa-download',
          color: 'green',
          handler: () => {
            this.downloadExcelYear(param);
          },
        },
        {
          label: this.$t('default.downloadAccountExport'),
          icon: 'fa fa-download',
          color: 'green',
          handler: () => {
            if (this.$env.edition === 'tcw') {
              this.setExportNumeberFilter(param).then(() => {
                this.newExportNumber = this.exportNumber.currentMonthIndex;
              });
              this.exportPeriod = param;
              this.showExportTcwDialog = true;
              this.showExportTcwDialogTCA = false;
            } else {
              this.downloadAccountExport(param);
            }
          },
        },
      ];

      if (this.$env.edition === 'tcw') {
        actions.push({
          label: this.$t('default.downloadAccountExportTCA'),
          icon: 'fa fa-download',
          color: 'green',
          handler: () => {
            if (this.$env.edition === 'tcw') {
              this.setExportNumeberFilterTCA(param).then(() => {
                this.newExportNumber = this.exportNumberTCA.currentMonthIndex;
              });
              this.exportPeriod = param;
              this.showExportTcwDialog = true;
              this.showExportTcwDialogTCA = true;
            } else {
              this.downloadAccountExportTCA(param);
            }
          },
        });
      }

      if (this.$env.edition === 'sheltia') {
        actions.push({
          label: this.$t('default.downloadAnagrafiche'),
          icon: 'fa fa-download',
          color: 'green',
          handler: () => {
            this.downloadAnagrafiche(param);
          },
        });
      }

      this.$q
        .bottomSheet({
          title: `${this.$utils.numberToMonth(
            Number.parseInt(param.slice(4), 10),
            this.$t.bind(this),
          )} ${param.slice(0, 4)}`,
          actions,
        })
        .onOk((action) => {
          action.handler();
        });
    },
  },
};
</script>

<style lang="stylus" scoped></style>
