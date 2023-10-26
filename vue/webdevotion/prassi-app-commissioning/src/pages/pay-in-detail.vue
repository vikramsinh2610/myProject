<template>
  <div class="fill-available column no-wrap">
    <prassi-filter
      :plus-menu="true"
      :menus="menuFilter"
      :button="status !== 'confirmed'"
      :button-additional="status !== 'confirmed'"
      :button-label="$t('payIn.confirmPayin')"
      :button-additional-label="$t('payIn.refreshPayin')"
      :filter="filter.type"
      :is-fetching="isFetching"
      @changed="filter.type.selected = $event.selected"
      @buttonClicked="confirmPayin"
      @buttonAdditionalClicked="refreshPayin"
      @buttonPlusMenu="showing = true"
    >
      <template slot="popover">
        <q-menu touch-position>
          <q-list separator link>
            <q-item clickable v-close-popup @click.native="downloadOriginal" v-if="!$env.alpha">
              <q-item-section>{{ $t('payIn.downloadOriginal') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click.native="downloadResult">
              <q-item-section>{{ $t('payIn.downloadResult') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click.native="selectExcelValueForAll">
              <q-item-section>{{ $t('payIn.selectExcelValueForAll') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click.native="selectCalculatedValueForAll">
              <q-item-section>{{ $t('payIn.selectCalculatedValueForAll') }}</q-item-section>
            </q-item>
            <q-separator />
            <q-item
              clickable
              v-if="$user.roleID >= 1000"
              v-close-popup
              @click.native="reopenAcquittance"
            >
              <q-item-section class="text-red">{{ $t('payIn.reopenAcquittance') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </template>
    </prassi-filter>
    <prassi-acquittance-error-list
      class="fill-available column"
      :is-fetching="isFetching"
      :error-payments="itemsSelected"
      :confirmed="status === 'confirmed' || filter.type.selected !== 'error'"
      @menuClick="menuClick"
      @changedBtnToggle="selectPayin"
    />

    <q-dialog v-model="showNoteDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('payIn.editTitleDialog') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-between">
            <q-select
              class="col-6"
              v-model="payinEdit.productivePeriodMonth"
              :label="$t('invoicing.productivePeriodMonth')"
              :options="$utils.productivePeriodMonthList($t.bind(this))"
            />
            <q-input
              class="col-4"
              v-model="payinEdit.productivePeriodYear"
              type="number"
              :label="$t('invoicing.productivePeriodYear')"
              :error="$v.payinEdit.productivePeriodYear.$error"
              @blur="$v.payinEdit.productivePeriodYear.$touch"
            />
          </div>
          <div class="column justify-between">
            <q-input
              class="col-6"
              v-model="payinEdit.contractId"
              type="text"
              :label="$t('payIn.editContractId')"
            />
            <q-input
              class="col-6"
              v-model="payinEdit.payin"
              type="number"
              suffix="€"
              :label="$t('payIn.editInputPayin')"
              :error="$v.payinEdit.payin.$error"
              @blur="$v.payinEdit.payin.$touch"
            />
            <q-input
              class="col-6"
              v-model="payinEdit.calculatedPayin"
              type="number"
              suffix="€"
              :label="$t('payIn.editCalculatedPayin')"
              :error="$v.payinEdit.calculatedPayin.$error"
              @blur="$v.payinEdit.calculatedPayin.$touch"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.editButton')" @click="changePayIn" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import download from 'getfile-rename-js';
import { required, between } from 'vuelidate/lib/validators';
import { mapState, mapActions } from 'vuex';
import PrassiFilter from '../components/base/prassi-filter';
import PrassiAcquittanceErrorList from '../components/pay-in/prassi-acquittance-error-list';

export default {
  name: 'PayInDetail',
  components: {
    PrassiAcquittanceErrorList,
    PrassiFilter,
  },
  data() {
    return {
      showing: false,
      filter: {
        type: {
          selected: 'error',
        },
      },
      showNoteDialog: false,
      payinEdit: {
        _id: '',
        calculatedPayin: 0,
        payin: 0,
        contractId: '',
        productivePeriodMonth: 1,
        productivePeriodYear: 2018,
      },
    };
  },
  validations: {
    payinEdit: {
      calculatedPayin: {
        required,
        between: between(0, 999999999),
      },
      payin: {
        required,
        between: between(0, 999999999),
      },
      contractId: {
        required,
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
      acquittances: (state) => state.acquittance.acquittances.items,
      status: (state) => state.acquittance.acquittance.item.status,
      payments: (state) => state.acquittance.acquittance.item.payments,
      document: (state) => state.documents.document.item,
      report: (state) => state.acquittance.report.item,
      isFetching: (state) => state.error.isFetching,
    }),
    itemsSelected() {
      switch (this.filter.type.selected) {
        case 'not-existing':
          return this.notExisting;
        case 'unmatched':
          return this.unmatched;
        case 'already-confirmed':
          return this.alreadyConfirmed;
        case 'error':
          return this.errors;
        case 'ok':
          return this.okPayments;
        case 'paid':
          return this.paid;
        default:
          return this.payments;
      }
    },
    notExisting() {
      return this.payments ? this.payments.filter((el) => el.notFoundBase) : [];
    },
    unmatched() {
      return this.payments ? this.payments.filter((el) => el.notFoundPractice) : [];
    },
    alreadyConfirmed() {
      return this.payments ? this.payments.filter((el) => el.alreadyConfirmed) : [];
    },
    errors() {
      return this.payments ? this.payments.filter((el) => el.errorPayin) : [];
    },
    okPayments() {
      return this.payments ? this.payments.filter((el) => el.ok) : [];
    },
    paid() {
      return this.payments ? this.payments.filter((el) => el.alreadyPaid) : [];
    },
    menuFilter() {
      return [
        {
          _id: 'not-existing',
          label: `${this.$t('payIn.not-existing')}: ${
            this.notExisting !== undefined ? this.notExisting.length : '-'
          }`,
          tooltip: this.$t('payIn.not-existing-tooltip'),
        },
        {
          _id: 'unmatched',
          label: `${this.$t('payIn.unmatched')}: ${
            this.unmatched !== undefined ? this.unmatched.length : '-'
          }`,
          tooltip: this.$t('payIn.unmatched-tooltip'),
        },
        {
          _id: 'already-confirmed',
          label: `${this.$t('payIn.already-confirmed')}: ${
            this.alreadyConfirmed !== undefined ? this.alreadyConfirmed.length : '-'
          }`,
          tooltip: this.$t('payIn.already-confirmed-tooltip'),
        },
        {
          _id: 'paid',
          label: `${this.$t('payIn.paid')}: ${this.paid !== undefined ? this.paid.length : '-'}`,
          tooltip: this.$t('payIn.paid-tooltip'),
        },
        {
          _id: 'error',
          label: `${this.$t('payIn.error')}: ${
            this.errors !== undefined ? this.errors.length : '-'
          }`,
          tooltip: this.$t('payIn.error-tooltip'),
        },
        {
          _id: 'ok',
          label: `${this.$t('payIn.ok')}: ${
            this.okPayments !== undefined ? this.okPayments.length : '-'
          }`,
          tooltip: this.$t('payIn.ok-tooltip'),
        },
      ];
    },
  },
  methods: {
    ...mapActions({
      refreshAcquittance: 'acquittance/refreshAcquittance',
      confirmAcquittance: 'acquittance/confirmAcquittance',
      unconfirmAcquittance: 'acquittance/unconfirmAcquittance',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
      fetchAcquittanceReport: 'acquittance/fetchAcquittanceReport',
      updateAcquittance: 'acquittance/updateAcquittance',
      updateAcquittanceSelectExcelValue: 'acquittance/updateAcquittanceSelectExcelValue',
      updateAcquittanceSelectCalculatedValue: 'acquittance/updateAcquittanceSelectCalculatedValue',
    }),
    notifyKO() {
      this.$q.notify({
        message: this.$t('payIn.updateError'),
        timeout: 300,
      });
    },
    notifyOK() {
      this.$q.notify({
        message: this.$t('payIn.updateOK'),
        color: 'secondary',
        timeout: 300,
      });
      this.showNoteDialog = false;
    },
    downloadOriginal() {
      this.$utils.log('PAY-IN-DETAIL', 'downloadOriginal');
      const selectedPayin = this.acquittances.find((el) => el._id === this.$route.params.id);
      this.fetchDocumentUrl(selectedPayin.documentId).then(() => {
        download(this.document.url, this.document.displayName);
      });
    },
    downloadResult() {
      this.$utils.log('PAY-IN-DETAIL', 'downloadResult');
      this.fetchAcquittanceReport(this.$route.params.id).then(() => {
        this.fetchDocumentUrl(this.report.documentId).then(() => {
          download(this.document.url, this.document.displayName);
        });
      });
    },
    selectExcelValueForAll() {
      this.$utils.log('PAY-IN-DETAIL', 'selectExcelValueForAll');
      this.updateAcquittanceSelectExcelValue({
        acquittancesId: this.$route.params.id,
      })
        .then(() => {
          this.notifyOK();
        })
        .catch(() => {
          this.notifyKO();
        });
    },
    selectCalculatedValueForAll() {
      this.$utils.log('PAY-IN-DETAIL', 'selectCalculatedValueForAll');
      this.updateAcquittanceSelectCalculatedValue({
        acquittancesId: this.$route.params.id,
      })
        .then(() => {
          this.notifyOK();
        })
        .catch(() => {
          this.notifyKO();
        });
    },
    reopenAcquittance() {
      this.$utils.log('PAY-IN-DETAIL', 'reopenAcquittance');
      this.unconfirmAcquittance(this.$route.params.id)
        .then(() => {
          this.$q.notify({
            message: this.$t('payIn.unconfirmOK'),
            color: 'secondary',
            timeout: 300,
          });
        })
        .catch(() => {
          this.$q.notify({
            message: this.$t('payIn.unconfirmError'),
            timeout: 300,
          });
        });
    },
    refreshPayin() {
      this.$utils.log('PAY-IN-DETAIL', 'refreshPayin');
      const notFixed = this.payments.filter(
        (el) => !el.ok && el.errorPayin && !el.manuallyModified && !el.select,
      );

      this.$utils.logobj('PAY-IN-DETAIL', 'notFixed', notFixed);
      if (notFixed.length > 0) {
        this.$q.notify({
          message: 'Impossibile ricalcolare: quietanze con payin non selezionato',
          timeout: 3000,
        });
        return;
      }

      this.refreshAcquittance(this.$route.params.id)
        .then(() => {
          this.notifyOK();
        })
        .catch(() => {
          this.notifyKO();
        });
    },
    confirmPayin() {
      this.$utils.log('PAY-IN-LIST', 'refreshPayin');
      this.confirmAcquittance(this.$route.params.id)
        .then(() => {
          this.$q.notify({
            message: this.$t('payIn.confirmOK'),
            color: 'secondary',
            timeout: 300,
          });
        })
        .catch(() => {
          this.$q.notify({
            message: this.$t('payIn.confirmError'),
            timeout: 300,
          });
        });
    },
    addInvoiceNoteDialog() {
      this.showNoteDialog = true;
    },
    changePayIn() {
      this.$v.payinEdit.$touch();

      if (!this.$v.payinEdit.$error) {
        this.executeChangePayIn();
      } else {
        this.error = true;
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    executeChangePayIn() {
      this.$utils.log('PAY-IN-DETAIL', 'executeChangePayIn');
      this.selectedPayment = this.payments.find((el) => el._id === this.payinEdit._id);
      this.selectedPayment = {
        ...this.selectedPayment,
        _id: this.payinEdit._id,
        contractId: this.payinEdit.contractId,
        oldPayin: this.selectedPayment.payin,
        payin: Math.round(this.payinEdit.payin * 100),
        oldCalculatedPayin: this.selectedPayment.calculatedPayin,
        manuallyModified: true,
        calculatedPayin: Math.round(this.payinEdit.calculatedPayin * 100),
        productivePeriodYear: this.payinEdit.productivePeriodYear,
        productivePeriodMonth: this.payinEdit.productivePeriodMonth.value,
      };

      this.updateAcquittance({
        acquittancesId: this.$route.params.id,
        payment: { item: this.selectedPayment },
      })
        .then(() => {
          this.notifyOK();
        })
        .catch(() => {
          this.notifyKO();
        });
    },
    menuClick(param) {
      this.$utils.logobj('PAY-IN-DETAIL', 'menuClick', param);
      this.selectedPayment = this.payments.find((el) => el._id === param);
      this.$utils.logobj('PAY-IN-DETAIL', 'menuClick', this.selectedPayment);

      this.payinEdit = {
        _id: this.selectedPayment._id,
        contractId: this.selectedPayment.contractId,
        payin: this.selectedPayment.payin / 100,
        calculatedPayin: this.selectedPayment.calculatedPayin / 100,
        productivePeriodYear: this.selectedPayment.productivePeriodYear,
        productivePeriodMonth: {
          label: this.$utils.numberToMonth(
            this.selectedPayment.productivePeriodMonth,
            this.$t.bind(this),
          ),
          value: this.selectedPayment.productivePeriodMonth,
        },
      };
      const actions = [
        {
          label: this.$t('promoterDetail.change'),
          icon: 'fa fa-edit',
          color: 'green',
          handler: () => {
            this.showNoteDialog = true;
          },
        },
      ];

      this.$q
        .bottomSheet({
          title: this.$t('payIn.titleMenu'),
          dismissLabel: 'Quit',
          actions,
        })
        .onOk((action) => {
          action.handler();
        });
    },
    selectPayin(param) {
      this.$utils.logobj('PAY-IN-DETAIL', 'selectPayin', param);
      this.selectedPayment = this.payments.find((el) => el._id === param.id);
      this.selectedPayment = {
        ...this.selectedPayment,
        select: param.selected,
      };

      this.updateAcquittance({
        acquittancesId: this.$route.params.id,
        payment: { item: this.selectedPayment },
      })
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then(() => {
          this.$q.notify({
            message: this.$t('payIn.updateOK'),
            color: 'secondary',
            timeout: 300,
          });
          this.showNoteDialog = false;
        })
        // eslint-disable-next-line sonarjs/no-identical-functions
        .catch(() => {
          this.$q.notify({
            message: this.$t('payIn.updateError'),
            timeout: 300,
          });
        });
    },
  },
};
</script>

<style lang="stylus" scoped></style>
