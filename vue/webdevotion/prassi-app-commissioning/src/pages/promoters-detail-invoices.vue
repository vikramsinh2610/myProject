<template>
  <div class="fill-available column">
    <prassi-attachment-invoice-list
      class="fill-available"
      ref="invoiceList"
      :is-fetching="isFetching"
      :attachments="invoices"
      @loadMore="loadMoreInvoices"
      @download="download"
      @deleteInvoice="deleteInvoiceClicked"
      @viewClick="viewInvoice"
    />
    <q-dialog v-model="showDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('invoicing.insertInvoiceTitleDialog') }}</div>
        </q-card-section>
        <q-card-section style="overflow-x: scroll">
          <div class="row justify-between q-mb-md">
            <q-select
              class="col-6"
              v-model="invoiceToInsert.productivePeriodMonth"
              :label="$t('invoicing.productivePeriodMonth')"
              :options="$utils.productivePeriodMonthList($t.bind(this))"
            />
            <q-input
              class="col-4"
              v-model="invoiceToInsert.productivePeriodYear"
              hide-bottom-space
              type="number"
              :label="$t('invoicing.productivePeriodYear')"
              :error="$v.invoiceToInsert.productivePeriodYear.$error"
              @blur="$v.invoiceToInsert.productivePeriodYear.$touch"
            />
          </div>
          <q-input
            class="col-5"
            v-model="invoiceToInsert.issueDate"
            mask="##-##-####"
            :label="$t('invoicing.issueDate')"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="invoiceToInsert.issueDate"
                    mask="DD-MM-YYYY"
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            class="col-5"
            v-model="invoiceToInsert.dueDate"
            mask="##-##-####"
            :label="$t('invoicing.dueDate')"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="invoiceToInsert.dueDate"
                    mask="DD-MM-YYYY"
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.addButton')" @click="comfirmAddInvoice" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-sticky v-if="$user.roleID >= 7" position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="addInvoice"
        icon="fa fa-plus-white"
      />
    </q-page-sticky>
  </div>
</template>

<script>
import { date } from 'quasar';
import download from 'getfile-rename-js';
import { required, between } from 'vuelidate/lib/validators';
import { mapState, mapActions, mapMutations } from 'vuex';
import PrassiAttachmentInvoiceList from '../components/base/prassi-attachment-invoices-list';

export default {
  name: 'PromotersDetailInvoices',
  components: {
    PrassiAttachmentInvoiceList,
  },
  data() {
    return {
      showDialog: false,
      invoiceToInsert: {
        productivePeriodMonth: {
          label: this.$utils.numberToMonth(new Date().getMonth() + 1, this.$t.bind(this)),
          value: new Date().getMonth() + 1,
        },
        productivePeriodYear: new Date().getFullYear(),
        issueDate: date.formatDate(Date.now(), 'DD-MM-YYYY'),
        dueDate: date.formatDate(Date.now(), 'DD-MM-YYYY'),
      },
    };
  },
  validations: {
    invoiceToInsert: {
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
      invoices: (state) => state.promoters.invoices.items,
      invoice: (state) => state.invoicing.invoice.item,
      last: (state) => state.promoters.invoices.lastRecord,
      document: (state) => state.documents.document.item,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  methods: {
    ...mapActions({
      fetchPromoterInvoices: 'promoters/fetchPromoterInvoices',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
      createInvoice: 'invoicing/createInvoice',
      deleteInvoice: 'invoicing/deleteInvoice',
    }),
    ...mapMutations({
      resetPromoterInvoices: 'promoters/resetPromoterInvoices',
    }),
    deleteInvoiceClicked(invoice) {
      this.$utils.logobj('PROMOTERS-DETAIL-INVOICES', 'deleteInvoiceClicked', invoice.id);
      this.deleteInvoice({ promoterId: this.$route.params.id, invoiceId: invoice.id }).then(() => {
        this.$q.notify({
          message: this.$t('invoicing.invoiceDeleted'),
          color: 'secondary',
          timeout: 300,
        });
        this.resetPromoterInvoices();
        this.$refs.invoiceList.resumeScrolling();
      });
    },
    addInvoice() {
      this.showDialog = true;
    },
    comfirmAddInvoice() {
      this.$v.invoiceToInsert.$touch();

      if (!this.$v.invoiceToInsert.$error) {
        this.$utils.logobj('INVOICING-DETAIL', 'comfirmAdd', this.invoiceToInsert);
        this.showDialog = false;
        this.createInvoice({
          promoterId: this.$route.params.id,
          invoice: {
            ...this.invoiceToInsert,
            productivePeriodMonth: this.invoiceToInsert.productivePeriodMonth.value,
            issueDate: date
              .adjustDate(date.extractDate(this.invoiceToInsert.issueDate, 'DD-MM-YYYY'), {
                hours: 12,
                minutes: 0,
              })
              .toISOString(),
            dueDate: date
              .adjustDate(date.extractDate(this.invoiceToInsert.dueDate, 'DD-MM-YYYY'), {
                hours: 12,
                minutes: 0,
              })
              .toISOString(),
          },
        }).then(() => {
          this.$router.push(`/promoters/${this.$route.params.id}/invoices/${this.invoice._id}`);
        });
      } else {
        this.error = true;
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreInvoices({ index, done }) {
      this.$utils.logobj('PROMOTERS-DETAIL-INVOICES', 'loadMoreInvoices', index);
      if (this.last || this.error) {
        this.$refs.invoiceList.stopScrolling();
      } else {
        this.fetchPromoterInvoices({
          promoterId: this.$route.params.id,
          year: this.$env.edition === 'sheltia' ? 2019 : 2018,
          month: this.$env.edition === 'sheltia' ? 1 : 12,
        }).finally(() => done());
      }
    },
    download({ id }) {
      this.$utils.logobj('PROMOTERS-DETAIL-INVOICES', 'download', id);
      this.fetchDocumentUrl(id).then(() => {
        download(this.document.url, this.document.displayName);
      });
    },
    viewInvoice(id) {
      this.$utils.logobj('PROMOTERS-DETAIL-INVOICES', 'viewInvoice', id);
      this.$router.push(`/promoters/${this.$route.params.id}/invoices/${id}`);
    },
  },
};
</script>

<style lang="stylus" scoped></style>
