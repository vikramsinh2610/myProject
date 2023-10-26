<template>
  <div>
    <prassi-acquittance-list
      ref="acquittanceList"
      :is-fetching="isFetching"
      :acquittances="acquittances"
      @viewClick="viewAcquittance"
      @loadMore="loadMoreAcquittances"
      @addAcquittance="showAddAcquittanceDialog"
      @menuClick="menuClick"
    />

    <q-dialog v-model="showInsertDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('payIn.titleUploadDialog') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-between q-my-xs">
            <q-select
              class="col"
              clearable
              v-model="company"
              :label="$t('payIn.companyList')"
              :options="companyList"
              @keyup.enter="confirmAdd(props.ok)"
            />
          </div>
          <div class="row q-my-xl">
            <q-uploader
              class="full-width"
              ref="uploader"
              auto-expand
              hide-upload-button
              method="PUT"
              :headers="[{ name: 'content-type', value: 'application/octet-stream' }]"
              :factory="getSignedUrl"
              :send-raw="true"
              @uploaded="uploaded"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('payIn.upload')" @click="addPayIn" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import download from 'getfile-rename-js';
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiAcquittanceList from '../components/pay-in/prassi-acquittance-list';

export default {
  name: 'PayInList',
  components: {
    PrassiAcquittanceList,
  },
  data() {
    return {
      showInsertDialog: false,
      company: undefined,
    };
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      rootId: (state) => state.login._id,
      acquittances: (state) => state.acquittance.acquittances.items,
      last: (state) => state.acquittance.acquittances.lastRecord,
      filter: (state) => state.acquittance.filter,
      companies: (state) => state.acquittance.companies.items,
      signedUrl: (state) => state.acquittance.signedUrl.item,
      document: (state) => state.documents.document.item,
      report: (state) => state.acquittance.report.item,
      isFetching: (state) => state.error.isFetching,
    }),
    companyList() {
      return this.companies.map((el) => ({
        label: el.name,
        value: el._id,
      }));
    },
  },
  methods: {
    ...mapActions({
      fetchAcquittances: 'acquittance/fetchAcquittances',
      fetchCompanySignedUrl: 'acquittance/fetchCompanySignedUrl',
      addAcquittance: 'acquittance/addAcquittance',
      deleteAcquittance: 'acquittance/deleteAcquittance',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
      fetchAcquittanceReport: 'acquittance/fetchAcquittanceReport',
    }),
    ...mapMutations({
      resetAcquittances: 'acquittance/resetAcquittances',
      setAccountingFilterSelected: 'accounting/setAccountingFilterSelected',
    }),
    viewAcquittance(id) {
      this.$utils.logobj('PAY-IN-LIST', 'viewAcquittance', id);
      this.$router.push(`/pay-in/${id}`);
    },
    showAddAcquittanceDialog() {
      this.$utils.log('PAY-IN-LIST', 'showAddAcquittanceDialog called');
      this.showInsertDialog = true;
    },
    addPayIn() {
      if (this.company) {
        this.$refs.uploader.upload();
      } else {
        this.company = undefined;
        this.$refs.uploader.reset();
        this.$q.notify(this.$t('payIn.cantSave'));
      }
    },
    // eslint-disable-next-line no-unused-vars
    async getSignedUrl(file) {
      this.$utils.logobj('PAY-IN-LIST', 'getSignedUrl', file);
      await this.fetchCompanySignedUrl(this.company.value);
      return { url: this.signedUrl.url };
    },
    // eslint-disable-next-line no-unused-vars
    async uploaded(file) {
      this.$utils.logobj('PAY-IN-LIST', 'uploaded', file);
      this.addAcquittance({ companyId: this.company.value, documentId: this.signedUrl._id })
        .then(() => {
          this.$q.notify({
            message: this.$t('payIn.uploadOK'),
            color: 'secondary',
            timeout: 300,
          });
          this.resetAcquittances();
          this.fetchAcquittances();
        })
        .catch(() => {
          this.$q.notify(this.$t('payIn.uploadKO'));
        })
        .finally(() => {
          this.company = undefined;
          this.$refs.uploader.reset();
        });
    },
    menuClick(param) {
      this.$utils.logobj('PAY-IN-LETTERS', 'menuClick', param);
      const selectedPayin = this.acquittances.find((el) => el._id === param);

      const actions = [
        {
          label: this.$t('payIn.downloadOriginal'),
          icon: 'fa fa-download',
          color: 'green',
          handler: () => {
            this.$utils.logobj('PAY-IN-LETTERS', 'downloadOriginal', param);
            this.fetchDocumentUrl(selectedPayin.documentId).then(() => {
              download(this.document.url, this.document.displayName);
            });
          },
        },
        {
          label: this.$t('payIn.downloadResult'),
          icon: 'fa fa-file-download',
          color: 'black',
          handler: () => {
            this.$utils.logobj('PAY-IN-LIST', 'downloadResult', param);
            this.fetchAcquittanceReport(param).then(() => {
              this.fetchDocumentUrl(this.report.documentId).then(() => {
                download(this.document.url, this.document.displayName);
              });
            });
          },
        },
      ];

      if (selectedPayin.status !== 'confirmed') {
        actions.push({
          label: this.$t('payIn.cancel'),
          icon: 'fa fa-trash',
          color: 'red',
          handler: () => {
            this.$utils.logobj('PAY-IN-LIST', 'delete', param);
            this.deleteAcquittance(param)
              .then(() => {
                this.resetAcquittances();
                this.fetchAcquittances();
              })
              .catch(() => {
                this.$q.notify(this.$t('payIn.deleteKO'));
              });
          },
        });
      }

      this.$q
        .bottomSheet({
          title: this.$t('payIn.menu'),
          dismissLabel: 'Quit',
          actions,
        })
        .onOk((action) => {
          action.handler();
        });
    },
    filterTypeChange(filterType) {
      this.$utils.logobj('PAY-IN-LIST', 'filterTypeChange', filterType);
      this.setAccountingFilterSelected(filterType.selected);
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreAcquittances({ index, done }) {
      this.$utils.log('PAY-IN-LIST', `loadMoreAcquittances called: ${index}`);
      if (this.last || this.error) {
        this.$refs.acquittanceList.stopScrolling();
      } else {
        this.fetchAcquittances().finally(() => done());
      }
    },
  },
};
</script>

<style lang="stylus" scoped></style>
