<template>
  <div class="fill-available row no-wrap">
    <div v-if="status === 'opened-error'" class="fill-available column">
      <prassi-navigate
        :title-label="$t('invoicing.openedErrorTitle')"
        :button-label="$t('invoicing.reopenInvoicing')"
        @buttonClicked="startReopenInvoicing"
      />
      <prassi-log-events :invoicing-id="$route.params.id" commissioning-id="no-commissioning" />
    </div>
    <div v-if="status === 'processing'" class="fill-available column">
      <prassi-navigate
        not-navigate
        loading
        :button="false"
        :title-label="$t('invoicing.processingTitle')"
      />
    </div>
    <div
      v-if="status && status !== 'processing' && status !== 'opened-error'"
      class="fill-available row no-wrap"
    >
      <q-stepper
        class="no-shadow q-mr-sm min-w-170"
        header-nav
        vertical
        ref="stepper"
        v-model="invoicingStep"
        active-color="secondary"
      >
        <q-step prefix="1" :order="1" name="totalNetwork" :title="$t('invoicing.totalNetwork')">
          <div />
        </q-step>
        <q-step prefix="2" :order="2" name="detail" :title="$t('invoicing.detail')"><div /></q-step>
        <q-step prefix="3" :order="3" name="summary" :title="$t('invoicing.summary')">
          <div />
        </q-step>
        <q-step
          prefix="4"
          :order="4"
          name="process-preview"
          :title="$t('invoicing.process-preview')"
        >
          <div />
        </q-step>
        <q-step prefix="5" :order="5" name="preview" :title="$t('invoicing.preview')">
          <div />
        </q-step>
        <q-step prefix="6" :order="6" name="close" :title="$t('invoicing.close')"><div /></q-step>
        <q-step
          prefix="7"
          :order="7"
          icon="fa fa-check"
          name="print"
          :disable="invoicing.status !== 'closed'"
          :title="$t('invoicing.print')"
        />
      </q-stepper>

      <prassi-invoicing-total-network-list
        class="col"
        v-if="invoicingStep === 'totalNetwork'"
        :is-fetching="isFetching"
        :network="network"
        :closed="invoicing.status === 'closed'"
        :roles="roles"
        @invoiceClicked="invoiceClicked"
        @downloadExcel="downloadExcel"
        @reopenInvoicing="startReopenInvoicing"
        @importFile="importInvoicingFile"
        @rollback="handleRollback"
      />

      <prassi-invoicing-detail
        class="col"
        v-if="invoicingStep === 'detail'"
        :is-fetching="isFetching"
        :invoice="invoice"
        :notes="notes"
        :products="products"
        :confirmed="statusInvoice.confirmed"
        :readonly="statusReadonly"
        :roles="roles"
        @addNote="addNote"
        @removeNote="removeNote"
        @deleteNote="deleteNote"
        @editNote="editNote"
        @confirm="confirmInvoice"
        @remove="removeInvoice"
        @previous="invoicePrevious"
        @next="invoiceNext"
        @changeTax="changeTaxRegimeType"
      />

      <prassi-invoicing-total-network-summary
        class="col"
        v-if="invoicingStep === 'summary'"
        :is-fetching="isFetching"
        :readonly="statusReadonly"
        :network-all="network"
        :network-confirmed="networkConfirmed"
        :network-unconfirmed="networkUnconfirmed"
        :roles="roles"
        @checkedAll="setAllInvoiceChecked($event)"
        @changeConfirmedChecked="setInvoiceConfirmedChecked($event)"
        @changeUnconfirmedChecked="setInvoiceUnconfirmedChecked($event)"
        @addSelected="addSelectedUnconfirmed"
        @removeSelected="removeSelectedConfirmed"
        @invoiceClicked="invoiceClicked"
      />

      <prassi-invoicing-preview
        class="col"
        v-if="invoicingStep === 'process-preview'"
        :invoicing="invoicing"
        @preview="previewInvoicing"
      />

      <prassi-invoicing-total-network-print
        class="col"
        v-if="invoicingStep === 'preview'"
        ref="documentPreviewList"
        :is-fetching="isFetching"
        :offset-sticky="[80, 18]"
        :documents="previewDocuments"
        :step="invoicingStep"
        :roles="roles"
        @loadMore="loadMorePreviewDocuments"
        @find="findPreviewDocuments"
        @downloadAll="downloadAllPreview"
        @downloadReceipts="downloadReceiptsPreview"
        @downloadInvoice="downloadInvoice"
        @downloadFiscal="downloadFiscal"
      />

      <prassi-invoicing-close
        class="col"
        v-if="invoicingStep === 'close'"
        :invoicing="invoicing"
        @close="closeInvoicing"
      />

      <prassi-invoicing-total-network-print
        class="col"
        v-if="invoicingStep === 'print'"
        ref="documentList"
        :is-fetching="isFetching"
        :documents="documents"
        :step="invoicingStep"
        :roles="roles"
        @loadMore="loadMoreDocuments"
        @find="findDocuments"
        @downloadAll="downloadAll"
        @downloadAllWithDetails="downloadAllWithDetails"
        @downloadReceipts="downloadReceipts"
        @downloadInvoice="downloadInvoice"
        @downloadInvoiceWithDetail="downloadInvoiceWithDetail"
        @downloadFiscal="downloadFiscal"
        @downloadAnagrafiche="downloadAnagrafiche"
      />

      <q-dialog v-model="showNoteDialog">
        <q-card style="width: 800px">
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">
              {{
                noteToInsert._id
                  ? $t('invoicing.editNoteTitleDialog')
                  : $t('invoicing.insertNoteTitleDialog')
              }}
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-between">
              <q-select
                class="col-6"
                v-model="noteToInsert.productivePeriodMonth"
                :label="$t('invoicing.productivePeriodMonth')"
                :options="$utils.productivePeriodMonthList($t.bind(this))"
              />
              <q-input
                class="col-4"
                v-model="noteToInsert.productivePeriodYear"
                type="number"
                :label="$t('invoicing.productivePeriodYear')"
                :error="$v.noteToInsert.productivePeriodYear.$error"
                @blur="$v.noteToInsert.productivePeriodYear.$touch"
              />
            </div>
            <div class="column justify-between">
              <q-select
                class="col-6"
                v-model="noteToInsert.type"
                :label="$t('invoicing.type')"
                :options="noteTypeList"
                :error="$v.noteToInsert.type.$error"
                @blur="$v.noteToInsert.type.$touch"
              />
              <q-input
                class="col-6"
                v-model="noteToInsert.amount"
                type="number"
                suffix="€"
                :label="$t('invoicing.amountNoteDescription')"
                :error="$v.noteToInsert.amount.$error"
                @blur="$v.noteToInsert.amount.$touch"
              />
              <q-input
                v-model="noteToInsert.description"
                type="textarea"
                rows="5"
                :max-height="120"
                :label="$t('invoicing.noteDescription')"
              />
              <q-input
                class="col-6"
                v-if="noteToInsert.type && noteToInsert.type.value === 'advance'"
                v-model="noteToInsert.additionalData.recoveryInstallmentsNumber"
                type="number"
                :label="$t('invoicing.recoveryInstallmentsNumber')"
                :error="$v.noteToInsert.additionalData.recoveryInstallmentsNumber.$error"
                @blur="$v.noteToInsert.additionalData.recoveryInstallmentsNumber.$touch"
              />
              <q-checkbox
                class="col-6 q-my-lg"
                v-model="noteToInsert.netToPay"
                left-label
                :label="$t('invoicing.netToPay')"
              />
            </div>
          </q-card-section>
          <q-card-section>
            <prassi-standard-button
              :label="noteToInsert._id ? $t('default.editButton') : $t('default.addButton')"
              @click="comfirmAddNote"
            />
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-page-sticky
        position="bottom-right"
        :offset="[23, 75]"
        v-if="
          invoicingStep === 'detail' && invoicing.status === 'opened' && !statusInvoice.confirmed
        "
      >
        <q-btn
          round
          size="14px"
          color="red"
          text-color="white"
          @click="addInvoiceNoteDialog"
          icon="fa fa-plus-white"
        />
      </q-page-sticky>
      <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="invoicingStep !== 'print'">
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
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import download from 'getfile-rename-js';
import { required, between } from 'vuelidate/lib/validators';
import PrassiInvoicingDetail from '../components/invoicing/prassi-invoicing-detail';
import PrassiInvoicingClose from '../components/invoicing/prassi-invoicing-close';
import PrassiInvoicingPreview from '../components/invoicing/prassi-invoicing-preview';
import PrassiInvoicingTotalNetworkSummary from '../components/invoicing/prassi-invoicing-total-network-summary';
import PrassiInvoicingTotalNetworkPrint from '../components/invoicing/prassi-invoicing-total-network-print';
import PrassiInvoicingTotalNetworkList from '../components/invoicing/prassi-invoicing-total-network-list';
import PrassiNavigate from '../components/base/prassi-navigate';
import PrassiLogEvents from '../components/base/prassi-log-events';

export default {
  name: 'InvoicingDetail',
  components: {
    PrassiInvoicingPreview,
    PrassiInvoicingTotalNetworkList,
    PrassiInvoicingTotalNetworkPrint,
    PrassiInvoicingTotalNetworkSummary,
    PrassiInvoicingClose,
    PrassiInvoicingDetail,
    PrassiNavigate,
    PrassiLogEvents,
  },
  data() {
    return {
      invoicingStep: 'totalNetwork',
      selectedPromoterNumber: 0,
      myInvoicingTimer: {},
      showNoteDialog: false,
      noteToInsert: {
        type: 'balance',
        amount: 0,
        netToPay: false,
        productivePeriodMonth: 1,
        productivePeriodYear: 2018,
        description: '',
        additionalData: {
          recoveryInstallmentsNumber: 1,
          dossierId: '',
          contractId: '',
          practiceId: '',
        },
      },
    };
  },
  validations: {
    noteToInsert: {
      amount: {
        required,
      },
      type: {
        required,
      },
      additionalData: {
        recoveryInstallmentsNumber: {
          integer: true,
          between: between(1, 48),
        },
      },
      productivePeriodYear: {
        required,
        integer: true,
        between: between(2000, 2999),
      },
    },
  },
  mounted() {
    this.resetInvoices();
    this.resetDocuments();
    this.resetPreviewDocuments();
    this.fetchInvoices(this.$route.params.id);
  },
  beforeDestroy() {
    clearInterval(this.myInvoicingTimer);
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      isFetching: (state) => state.error.isFetching,
      status: (state) => state.invoicing.invoicing.item.status,
      invoicing: (state) => state.invoicing.invoicing.item,
      network: (state) => state.invoicing.invoices.items,
      networkConfirmed: (state) => state.invoicing.invoicesConfirmed.items,
      networkUnconfirmed: (state) => state.invoicing.invoicesUnconfirmed.items,
      invoice: (state) => state.invoicing.invoice.item,
      documents: (state) => state.invoicing.documents.items,
      previewDocuments: (state) => state.invoicing.previewDocuments.items,
      note: (state) => state.invoicing.note.item,
      notes: (state) => state.invoicing.notes.items,
      notesTypes: (state) => state.promoters.noteTypes.items,
      document: (state) => state.documents.document.item,
      lastDocument: (state) => state.invoicing.documents.lastRecord,
      lastPreviewDocument: (state) => state.invoicing.previewDocuments.lastRecord,
      report: (state) => state.invoicing.report.item,
      products: (state) => state.accounting.products.items,
      roles: (state) => state.promoters.roles.items,
    }),
    selectedPromoter() {
      return this.network[this.selectedPromoterNumber];
    },
    statusReadonly() {
      return (
        this.invoicing.status === 'completed' ||
        this.invoicing.status === 'closed' ||
        this.invoicing.status === 'processing' ||
        this.invoicing.status === 'close-processing' ||
        this.invoicing.status === 'closing-error'
      );
    },
    statusInvoice() {
      return (
        this.invoicing.invoices.find((el) => el._id === this.invoice._id) || { confirmed: false }
      );
    },
    noteTypeList() {
      const noteTypeList = [];

      this.notesTypes.forEach((el) => {
        noteTypeList.push({
          label: el.description,
          value: el._id,
        });
      });

      return noteTypeList;
    },
  },
  watch: {
    status(status) {
      switch (status) {
        case 'close-processing':
        case 'preview-processing':
        case 'processing':
          clearInterval(this.myInvoicingTimer);
          this.myInvoicingTimer = setInterval(() => {
            this.resetInvoicing();
            this.fetchInvoicing(this.$route.params.id).then(async () => {
              if (
                this.status !== 'processing' &&
                this.status !== 'close-processing' &&
                this.status !== 'preview-processing'
              ) {
                this.resetInvoices();
                this.resetPreviewDocuments();
                await this.fetchInvoices(this.$route.params.id);
                await this.fetchPreviewDocuments(this.$route.params.id);
                clearInterval(this.myInvoicingTimer);
              }
            });
          }, 5000);
          break;
        case 'opened':
          this.invoicingStep =
            this.invoicingStep !== 'process-preview' ? 'totalNetwork' : 'preview';
          break;
        case 'closed':
          this.invoicingStep = 'print';
          break;
        default:
          break;
      }
    },
    invoicingStep(step) {
      switch (step) {
        case 'detail':
          this.fetchInvoice(this.selectedPromoter._id).then(() => {
            this.resetInvoiceNote();
          });
          this.fetchPromoterNotes({
            promoterId: this.selectedPromoter.promoterId,
            year: this.$env.edition === 'sheltia' ? 2019 : 2018,
            month: this.$env.edition === 'sheltia' ? 1 : 12,
          });
          break;
        case 'summary':
          this.resetInvoicesConfirmed();
          this.resetInvoicesUnconfirmed();
          this.fetchInvoicesConfirmed(this.$route.params.id);
          this.fetchInvoicesUnconfirmed(this.$route.params.id).then(() => {
            if (
              this.networkUnconfirmed.length > 0 &&
              !(this.invoicing.status === 'completed' || this.invoicing.status === 'closed')
            ) {
              this.$q.notify({
                message: this.$t('invoicing.notifyUnconfirmedInvoices'),
                color: 'red',
                timeout: 300,
              });
            }
          });
          break;
        case 'print':
          this.resetDocuments();
          break;
        default:
          break;
      }
    },
  },
  methods: {
    ...mapActions({
      fetchInvoices: 'invoicing/fetchInvoices',
      fetchInvoicesConfirmed: 'invoicing/fetchInvoicesConfirmed',
      fetchInvoicesUnconfirmed: 'invoicing/fetchInvoicesUnconfirmed',
      fetchInvoice: 'invoicing/fetchInvoice',
      fetchDocuments: 'invoicing/fetchDocuments',
      fetchPreviewDocuments: 'invoicing/fetchPreviewDocuments',
      setInvoiceConfirm: 'invoicing/setInvoiceConfirm',
      setInvoiceRemove: 'invoicing/setInvoiceRemove',
      setInvoicingClose: 'invoicing/setInvoicingClose',
      setInvoicingPreview: 'invoicing/setInvoicingPreview',
      setInvoiceNoteAccounted: 'invoicing/setInvoiceNoteAccounted',
      setInvoiceNoteUnaccounted: 'invoicing/setInvoiceNoteUnaccounted',
      addInvoiceNote: 'invoicing/addInvoiceNote',
      deleteInvoiceNote: 'invoicing/deleteInvoiceNote',
      fetchPromoterNotes: 'invoicing/fetchPromoterNotes',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
      fetchInvoiceDetailUrl: 'documents/fetchInvoiceDetailUrl',
      fetchInvoiceZipUrl: 'documents/fetchInvoiceZipUrl',
      fetchInvoicing: 'invoicing/fetchInvoicing',
      fetchInvoicingExcelReport: 'invoicing/fetchInvoicingExcelReport',
      fetchInvoicingExcelReportConfirmed: 'invoicing/fetchInvoicingExcelReportConfirmed',
      fetchInvoicingExcelReportFiscal: 'invoicing/fetchInvoicingExcelReportFiscal',
      fetchInvoicingExcelPromotersRegistry: 'invoicing/fetchInvoicingExcelPromotersRegistry',
      reopenInvoicing: 'invoicing/reopenInvoicing',
      changeTaxRegime: 'invoicing/changeTaxRegime',
      importInvoicing: 'invoicing/importInvoicing',
      rollback: 'invoicing/rollback',
    }),
    ...mapMutations({
      resetInvoices: 'invoicing/resetInvoices',
      resetInvoicesConfirmed: 'invoicing/resetInvoicesConfirmed',
      resetInvoicesUnconfirmed: 'invoicing/resetInvoicesUnconfirmed',
      resetDocuments: 'invoicing/resetDocuments',
      resetPreviewDocuments: 'invoicing/resetPreviewDocuments',
      setInvoiceConfirmedChecked: 'invoicing/setInvoiceConfirmedChecked',
      setInvoiceUnconfirmedChecked: 'invoicing/setInvoiceUnconfirmedChecked',
      setAllInvoiceChecked: 'invoicing/setAllInvoiceChecked',
      setInvoicingFilterFullTextSearch: 'invoicing/setInvoicingFilterFullTextSearch',
      resetInvoicing: 'invoicing/resetInvoicing',
    }),
    closeInvoicing() {
      this.$utils.log('INVOICING-DETAIL', 'closeInvoicing');
      this.setInvoicingClose(this.$route.params.id);
    },
    previewInvoicing() {
      this.$utils.log('INVOICING-DETAIL', 'previewInvoicing');
      this.setInvoicingPreview(this.$route.params.id);
    },
    confirmInvoice(id) {
      this.$utils.logobj('INVOICING-DETAIL', 'confirmInvoice', id);
      if (this.invoice.grossAmount >= 0) {
        this.setInvoiceConfirm({ invoicingId: this.$route.params.id, invoiceId: id }).then(() => {
          this.fetchInvoice(id);
          this.$q.notify({
            message: this.$t('invoicing.notifyConfirmInvoice'),
            color: 'secondary',
            timeout: 300,
          });
        });
      } else {
        this.$q.notify({
          message: this.$t('invoicing.cantConfirmInvoice'),
          color: 'secondary',
          timeout: 300,
        });
      }
    },
    removeInvoice(id) {
      this.$utils.logobj('INVOICING-DETAIL', 'removeInvoice', id);
      this.setInvoiceRemove({ invoicingId: this.$route.params.id, invoiceId: id }).then(() => {
        this.fetchInvoice(id);
        this.$q.notify({
          message: this.$t('invoicing.notifyRemoveInvoice'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    addNote(id) {
      this.$utils.logobj('INVOICING-DETAIL', 'addNote', id);
      this.setInvoiceNoteAccounted({ invoiceId: this.invoice._id, noteId: id }).then(() => {
        this.fetchInvoice(this.selectedPromoter._id);
        this.fetchPromoterNotes({
          promoterId: this.selectedPromoter.promoterId,
          year: this.$env.edition === 'sheltia' ? 2019 : 2018,
          month: this.$env.edition === 'sheltia' ? 1 : 12,
        });
        this.$q.notify({
          message: this.$t('invoicing.notifyInvoiceNoteAccounted'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    editNote(id) {
      this.$utils.logobj('INVOICING-DETAIL', 'editNote', id);
      const thisNoteToInsert = JSON.parse(JSON.stringify(this.notes.find((el) => el._id === id)));
      if (thisNoteToInsert.amount !== 0) thisNoteToInsert.amount /= 100;
      const labelType = this.noteTypeList.find((el) => thisNoteToInsert.type === el.value);
      this.noteToInsert = {
        ...thisNoteToInsert,
        productivePeriodMonth: {
          label: this.$utils.numberToMonth(
            thisNoteToInsert.productivePeriodMonth,
            this.$t.bind(this),
          ),
          value: thisNoteToInsert.productivePeriodMonth,
        },
        type: {
          label: labelType ? labelType.label : '',
          value: thisNoteToInsert.type,
        },
      };
      this.showNoteDialog = true;
    },
    removeNote(id) {
      this.$utils.logobj('INVOICING-DETAIL', 'removeNote', id);
      this.setInvoiceNoteUnaccounted({ invoiceId: this.invoice._id, noteId: id }).then(() => {
        this.fetchInvoice(this.selectedPromoter._id);
        this.fetchPromoterNotes({
          promoterId: this.selectedPromoter.promoterId,
          year: this.$env.edition === 'sheltia' ? 2019 : 2018,
          month: this.$env.edition === 'sheltia' ? 1 : 12,
        });
        this.$q.notify({
          message: this.$t('invoicing.notifyInvoiceNoteUnaccounted'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    deleteNote(id) {
      this.$utils.logobj('INVOICING-DETAIL', 'deleteNote', id);
      this.deleteInvoiceNote({ invoiceId: this.invoice._id, noteId: id }).then(() => {
        this.fetchInvoice(this.selectedPromoter._id);
        this.fetchPromoterNotes({
          promoterId: this.selectedPromoter.promoterId,
          year: this.$env.edition === 'sheltia' ? 2019 : 2018,
          month: this.$env.edition === 'sheltia' ? 1 : 12,
        });
        this.$q.notify({
          message: this.$t('invoicing.notifyInvoiceNoteDeleted'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    addInvoiceNoteDialog() {
      this.resetInvoiceNote();
      this.showNoteDialog = true;
    },
    comfirmAddNote() {
      this.$v.noteToInsert.$touch();

      if (!this.$v.noteToInsert.$error) {
        this.$utils.logobj('INVOICING-DETAIL', 'comfirmAdd', this.noteToInsert.amount);
        this.executeAddInvoiceNote();
        this.showNoteDialog = false;
      } else {
        this.error = true;
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    resetInvoiceNote() {
      this.noteToInsert = {
        type: undefined,
        amount: 0,
        netToPay: false,
        productivePeriodYear: this.invoice.productivePeriodYear,
        productivePeriodMonth: {
          label: this.$utils.numberToMonth(this.invoice.productivePeriodMonth, this.$t.bind(this)),
          value: this.invoice.productivePeriodMonth,
        },
        description: '',
        additionalData: {
          recoveryInstallmentsNumber: 1,
          dossierId: '',
          contractId: '',
          practiceId: '',
        },
      };
    },
    executeAddInvoiceNote() {
      this.$utils.log('INVOICING-DETAIL', 'addInvoiceNote');
      this.noteToInsert.amount = Math.trunc(this.noteToInsert.amount * 100);
      const thisNoteToInsert = {
        ...this.noteToInsert,
        productivePeriodMonth: this.noteToInsert.productivePeriodMonth.value,
        type: this.noteToInsert.type.value,
      };
      this.addInvoiceNote({
        promoterId: this.selectedPromoter.promoterId,
        note: thisNoteToInsert,
      }).then(() => {
        if (!this.noteToInsert._id) {
          this.setInvoiceNoteAccounted({ invoiceId: this.invoice._id, noteId: this.note._id }).then(
            () => {
              this.fetchInvoice(this.selectedPromoter._id);
              this.fetchPromoterNotes({
                promoterId: this.selectedPromoter.promoterId,
                year: this.$env.edition === 'sheltia' ? 2019 : 2018,
                month: this.$env.edition === 'sheltia' ? 1 : 12,
              });
              this.$q.notify({
                message: this.$t('invoicing.notifyAddInvoiceNote'),
                color: 'secondary',
                timeout: 300,
              });
            },
          );
        } else {
          this.fetchInvoice(this.selectedPromoter._id);
          this.fetchPromoterNotes({
            promoterId: this.selectedPromoter.promoterId,
            year: this.$env.edition === 'sheltia' ? 2019 : 2018,
            month: this.$env.edition === 'sheltia' ? 1 : 12,
          });
          this.$q.notify({
            message: this.$t('invoicing.notifyEditInvoiceNote'),
            color: 'secondary',
            timeout: 300,
          });
        }
      });
    },
    invoiceClicked(id) {
      this.selectedPromoterNumber = this.network.findIndex((el) => el._id === id);
      this.$refs.stepper.goTo('detail');
    },
    invoicePrevious() {
      if (this.selectedPromoterNumber <= 0) return;
      this.selectedPromoterNumber -= 1;
      this.fetchInvoice(this.selectedPromoter._id).then(() => {
        this.resetInvoiceNote();
      });
      this.fetchPromoterNotes({
        promoterId: this.selectedPromoter.promoterId,
        year: this.$env.edition === 'sheltia' ? 2019 : 2018,
        month: this.$env.edition === 'sheltia' ? 1 : 12,
      });
    },
    invoiceNext() {
      if (this.selectedPromoterNumber >= this.network.length - 1) return;
      this.selectedPromoterNumber += 1;
      this.fetchInvoice(this.selectedPromoter._id).then(() => {
        this.resetInvoiceNote();
      });
      this.fetchPromoterNotes({
        promoterId: this.selectedPromoter.promoterId,
        year: this.$env.edition === 'sheltia' ? 2019 : 2018,
        month: this.$env.edition === 'sheltia' ? 1 : 12,
      });
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreDocuments({ index, done }) {
      if (this.lastDocument || this.error) {
        this.$refs.documentList.stopScrolling();
      } else {
        this.fetchDocuments(this.$route.params.id).finally(() => {
          done();
        });
      }
    },
    findDocuments(param) {
      this.setInvoicingFilterFullTextSearch(param);
      this.resetDocuments();
      this.$refs.documentList.resumeScrolling();
      this.$refs.documentList.forceScrolling();
    },
    // eslint-disable-next-line no-unused-vars
    loadMorePreviewDocuments({ index, done }) {
      if (this.lastPreviewDocument || this.error) {
        this.$refs.documentPreviewList.stopScrolling();
      } else {
        this.fetchPreviewDocuments(this.$route.params.id).finally(() => {
          done();
        });
      }
    },
    findPreviewDocuments(param) {
      this.setInvoicingFilterFullTextSearch(param);
      this.resetPreviewDocuments();
      this.$refs.documentPreviewList.resumeScrolling();
      this.$refs.documentPreviewList.forceScrolling();
    },
    changeTaxRegimeType(newTaxRegime) {
      this.$utils.logobj('INVOICE-DETAIL', 'changeTaxRegimeType', newTaxRegime);
      if (this.invoice.issued) return;

      this.changeTaxRegime({
        promoterId: this.$route.params.id,
        invoiceId: this.invoice._id,
        taxRegime: newTaxRegime.taxRegime,
        invoiceHeading: newTaxRegime.invoiceHeading,
      }).then(() => {
        this.$q.notify({
          message: this.$t('invoicing.taxRegimeChange'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    downloadAllWithDetails() {
      this.$utils.log('INVOICING-DETAIL', 'downloadAllWithDetails');
      this.fetchInvoiceZipUrl({
        invoicingId: this.$route.params.id,
        type: 'all',
        preview: false,
        withDetails: true,
      }).then(() => {
        download(this.document.urlSigned, this.document.displayName);
      });
    },
    downloadAll() {
      this.$utils.log('INVOICING-DETAIL', 'downloadAll');
      this.fetchInvoiceZipUrl({
        invoicingId: this.$route.params.id,
        type: 'all',
        preview: false,
      }).then(() => {
        download(this.document.urlSigned, this.document.displayName);
      });
    },
    downloadAllPreview() {
      this.$utils.log('INVOICING-DETAIL', 'downloadAllPreview');
      this.fetchInvoiceZipUrl({
        invoicingId: this.$route.params.id,
        type: 'all',
        preview: true,
      }).then(() => {
        download(this.document.urlSigned, this.document.displayName);
      });
    },
    downloadReceipts() {
      this.$utils.log('INVOICING-DETAIL', 'downloadReceipts');
      this.fetchInvoiceZipUrl({
        invoicingId: this.$route.params.id,
        type: 'receipt',
        preview: false,
      }).then(() => {
        download(this.document.urlSigned, this.document.displayName);
      });
    },
    downloadReceiptsPreview() {
      this.$utils.log('INVOICING-DETAIL', 'downloadReceipts');
      this.fetchInvoiceZipUrl({
        invoicingId: this.$route.params.id,
        type: 'receipt',
        preview: true,
      }).then(() => {
        download(this.document.urlSigned, this.document.displayName);
      });
    },
    downloadInvoiceWithDetail(id) {
      this.$utils.logobj('INVOICING-DETAIL', 'downloadInvoiceWithDetail', id);
      this.fetchInvoiceDetailUrl(id).then(() => {
        download(this.document.url, this.document.displayName);
      });
    },
    downloadInvoice(id) {
      this.$utils.logobj('INVOICING-DETAIL', 'downloadInvoice', id);
      this.fetchDocumentUrl(id).then(() => {
        download(this.document.url, this.document.displayName);
      });
    },
    async addSelectedUnconfirmed() {
      const data = this.networkUnconfirmed.filter((el) => el.checked);
      if (!data) return;
      this.$q.loading.show({ delay: 200 });
      // eslint-disable-next-line unicorn/no-for-loop
      for (let i = 0; i < data.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await this.setInvoiceConfirm({
          invoicingId: this.$route.params.id,
          invoiceId: data[i]._id,
        });
      }
      this.resetInvoicesConfirmed();
      this.resetInvoicesUnconfirmed();
      this.fetchInvoicesConfirmed(this.$route.params.id);
      this.fetchInvoicesUnconfirmed(this.$route.params.id);
      this.$q.loading.hide();
    },
    async removeSelectedConfirmed() {
      const data = this.networkConfirmed.filter((el) => el.checked);
      if (!data) return;
      this.$q.loading.show({ delay: 200 });
      // eslint-disable-next-line unicorn/no-for-loop
      for (let i = 0; i < data.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await this.setInvoiceRemove({ invoicingId: this.$route.params.id, invoiceId: data[i]._id });
      }
      this.$q.loading.hide();
      this.resetInvoicesConfirmed();
      this.resetInvoicesUnconfirmed();
      this.fetchInvoicesConfirmed(this.$route.params.id);
      this.fetchInvoicesUnconfirmed(this.$route.params.id);
    },
    startReopenInvoicing() {
      this.$utils.log('INVOICING-DETAIL', 'reopenInvoicing');
      this.reopenInvoicing(this.$route.params.id);
    },
    downloadExcel() {
      this.$utils.log('INVOICING-DETAIL', 'downloadExcel');
      this.fetchInvoicingExcelReport(this.$route.params.id).then(() => {
        this.fetchDocumentUrl(this.report.documentId).then(() => {
          download(this.document.url, this.document.displayName);
        });
      });
    },
    downloadFiscal() {
      this.$utils.log('INVOICING-DETAIL', 'downloadFiscal');
      if (this.$env.edition === 'sheltia') {
        // eslint-disable-next-line sonarjs/no-identical-functions
        this.fetchInvoicingExcelReportFiscal(this.$route.params.id).then(() => {
          this.fetchDocumentUrl(this.report.documentId).then(() => {
            download(this.document.url, this.document.displayName);
          });
        });
      } else {
        // eslint-disable-next-line sonarjs/no-identical-functions
        this.fetchInvoicingExcelReportConfirmed(this.$route.params.id).then(() => {
          this.fetchDocumentUrl(this.report.documentId).then(() => {
            download(this.document.url, this.document.displayName);
          });
        });
      }
    },
    downloadAnagrafiche() {
      this.$utils.log('INVOICING-DETAIL', 'downloadAnagrafiche');
      // eslint-disable-next-line sonarjs/no-identical-functions
      this.fetchInvoicingExcelPromotersRegistry(this.$route.params.id).then(() => {
        this.fetchDocumentUrl(this.report.documentId).then(() => {
          download(this.document.url, this.document.displayName);
        });
      });
    },
    importInvoicingFile(e) {
      const file = e.target.files[0];
      const invoicingId = this.invoicing._id;

      this.toBase64(file)
        .then((base64) => this.importInvoicing({ invoicingId, body: { file: base64 } }))
        .then(() => {
          this.$q.notify({
            message: this.$t('invoicing.importAccountingNoteSuccessful'),
            color: 'secondary',
            timeout: 2000,
          });
        });
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', () => resolve(reader.result.split('base64,').pop()));
        reader.addEventListener('error', (error) => reject(error));
      });
    },
    handleRollback() {
      const invoicingId = this.invoicing._id;

      this.$q
        .dialog({
          title: 'Confirm',
          message: 'Would you like to rollback the acount note?',
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.rollback({ invoicingId }).then(() => {
            this.$q.notify({
              message: this.$t('invoicing.rollbackAccountingNoteSuccessful'),
              color: 'secondary',
              timeout: 2000,
            });
          });
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
