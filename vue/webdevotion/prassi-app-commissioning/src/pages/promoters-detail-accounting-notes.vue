<template>
  <div>
    <q-card style="width: 100%" inline flat color="white" class="text-primary">
      <q-card-section class="row no-wrap">
        <span class="q-title p-al-title">{{ $t('promoterDataMain.accountingNotes') }}</span>
        <span class="q-title">
          {{ $t('promoterDataMain.totalAccountingNotes') }}
          {{ $n(totalNotes / 100, 'nodecimals') }}€
        </span>
      </q-card-section>
    </q-card>
    <prassi-invoicing-detail
      class="col"
      not-navigate
      only-details
      :is-fetching="isFetching"
      :notes="notes"
      :confirmed="false"
      :readonly="invoice.issued || $user.roleID < 7"
      :roles="roles"
      @deleteNote="deleteNote"
      @editNote="editNote"
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

    <q-page-sticky v-if="$user.roleID >= 7" position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="addInvoiceNoteDialog"
        icon="fa fa-plus-white"
      />
    </q-page-sticky>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { required, between } from 'vuelidate/lib/validators';
import PrassiInvoicingDetail from '../components/invoicing/prassi-invoicing-detail';

export default {
  name: 'PromotersDetailAccountingNotes',
  components: {
    PrassiInvoicingDetail,
  },
  data() {
    return {
      showNoteDialog: false,
      noteToInsert: {
        type: 'balance',
        amount: 0,
        netToPay: false,
        productivePeriodMonth: new Date().getMonth() + 1,
        productivePeriodYear: new Date().getFullYear(),
        description: '',
        additionalData: {
          recoveryInstallmentsNumber: 1,
          dossierId: '',
          contractId: '',
          practiceId: '',
        },
      },
      typeList: [
        {
          label: 'Anticipo',
          value: 'advance',
        },
        {
          label: 'Premio di recruiting',
          value: 'recruiting-prize',
        },
        {
          label: 'Premio produzione',
          value: 'production-prize',
        },
        {
          label: 'Recupero anticipo',
          value: 'debit',
        },
        {
          label: 'Conguaglio',
          value: 'balance',
        },
        {
          label: 'Provvigione',
          value: 'commission',
        },
        {
          label: 'Storno',
          value: 'starling',
        },
        {
          label: 'Storno provvigioni acquisto',
          value: 'write-off-commission-purchase',
        },
        {
          label: 'Storno provvigioni danni',
          value: 'write-off-commission-damage',
        },
        {
          label: 'Storno provvigioni management fee',
          value: 'write-off-commission-mf',
        },
        {
          label: 'Storno over provvigioni',
          value: 'write-off-commission',
        },
        {
          label: 'Storno rappel',
          value: 'write-off-rappel',
        },
        {
          label: 'Storno premio produzione',
          value: 'write-off-production-prize',
        },
        {
          label: 'Storno premium recruiting',
          value: 'write-off-recruiting-prize',
        },
        {
          label: 'Storno bonus garantito',
          value: 'write-off-guaranteed-bonus',
        },
        {
          label: 'Altro',
          value: 'other',
        },
      ],
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
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      document: (state) => state.documents.document.item,
      invoices: (state) => state.promoters.invoices.items,
      invoice: (state) => state.invoicing.invoice.item,
      notes: (state) => state.invoicing.notes.items,
      note: (state) => state.invoicing.note.item,
      notesTypes: (state) => state.promoters.noteTypes.items,
      isFetching: (state) => state.error.isFetching,
      roles: (state) => state.promoters.roles.items,
    }),
    totalNotes() {
      // eslint-disable-next-line unicorn/no-reduce
      return this.notes.reduce((acc, el) => acc + el.amount, 0);
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
  methods: {
    ...mapActions({
      fetchInvoice: 'invoicing/fetchInvoice',
      setInvoiceNoteAccounted: 'invoicing/setInvoiceNoteAccounted',
      setInvoiceNoteUnaccounted: 'invoicing/setInvoiceNoteUnaccounted',
      addInvoiceNote: 'invoicing/addInvoiceNote',
      deleteInvoiceNote: 'invoicing/deleteInvoiceNote',
      fetchPromoterNotes: 'invoicing/fetchPromoterNotes',
      issueInvoice: 'invoicing/issueInvoice',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
    }),
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
    deleteNote(id) {
      this.$utils.logobj('INVOICE-DETAIL', 'deleteNote', id);
      this.deleteInvoiceNote({ invoiceId: this.invoice._id, noteId: id }).then(() => {
        this.fetchInvoice(this.$route.params.invoice);
        this.fetchPromoterNotes({
          promoterId: this.$route.params.id,
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
        promoterId: this.$route.params.id,
        note: thisNoteToInsert,
      }).then(() => {
        this.fetchPromoterNotes({
          promoterId: this.$route.params.id,
          year: this.$env.edition === 'sheltia' ? 2019 : 2018,
          month: this.$env.edition === 'sheltia' ? 1 : 12,
        });
        this.$q.notify({
          message: this.$t('invoicing.notifyEditInvoiceNote'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-top-left-radius 4px
  border-top-right-radius 4px
  border-bottom-right-radius 4px
  border-bottom-left-radius 4px
  border-top solid 1px $card-border
  border-left solid 1px $card-border
  border-right solid 1px $card-border
  border-bottom solid 1px $card-border
.p-al-title
  margin-right auto
</style>
