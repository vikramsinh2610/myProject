<template>
  <div class="fill-available row">
    <prassi-promoter-company
      class="col-9 q-mr-sm q-mb-sm"
      :promoter="companyProfile"
      :roles="roles"
      @changeData="saveCompanyProfile"
    />
    <prassi-attachment-list
      class="col"
      :is-fetching="isFetching"
      :attachments="documents"
      menu-delete
      @download="download"
      @deleteAttachment="deleteAttachment"
    />
  </div>
</template>

<script>
import download from 'getfile-rename-js';
import { mapActions, mapState, mapMutations } from 'vuex';
import PrassiPromoterCompany from '../components/promoter/prassi-promoter-company';
import PrassiAttachmentList from '../components/base/prassi-attachment-list';

export default {
  name: 'PromotersDetailCompany',
  components: {
    PrassiAttachmentList,
    PrassiPromoterCompany,
  },
  computed: {
    ...mapState({
      companyProfile: (state) => state.promoters.companyProfile,
      documents: (state) => state.promoters.documents.items,
      document: (state) => state.documents.document.item,
      isFetching: (state) => state.error.isFetching,
      roles: (state) => state.promoters.roles.items,
    }),
  },
  methods: {
    ...mapActions({
      savePromoterCompanyProfile: 'promoters/savePromoterCompanyProfile',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
      deleteDocument: 'promoters/deleteDocument',
      fetchPromoterDocuments: 'promoters/fetchPromoterDocuments',
    }),
    ...mapMutations({
      resetPromoterDocuments: 'promoters/resetPromoterDocuments',
    }),
    saveCompanyProfile(item) {
      this.$utils.logobj('PROMOTERS-DETAIL', 'saveCompanyProfile', item);
      this.savePromoterCompanyProfile({
        promoterId: this.$route.params.id,
        body: item,
      }).then(async () => {
        this.$utils.log('PROMOTERS-DETAIL', 'savedCompanyProfile');
        this.$q.notify({ message: this.$t('promoterCompany.savedOk'), color: 'secondary' });
      });
    },
    download({ id }) {
      this.$utils.logobj('PROMOTERS-DETAIL-DOCUMENTS', 'download', id);
      this.fetchDocumentUrl(id).then(() => {
        download(this.document.url, this.document.displayName);
      });
    },
    deleteAttachment({ id }) {
      this.$utils.logobj('PROMOTERS-DETAILS', 'delete', id);
      this.deleteDocument(id)
        .then(() => {
          this.resetPromoterDocuments();
          this.fetchPromoterDocuments({
            promoterId: this.$route.params.id,
            types: 'letter-attachment,user-attachment',
          });
          this.$q.notify({
            message: this.$t('attachment.deletedOk'),
            color: 'secondary',
            timeout: 300,
          });
        })
        .catch((error) => {
          this.$utils.errobj('promoters-detail-letter', 'deleteAttachment', error);
        });
    },
  },
};
</script>

<style lang="stylus" scoped></style>
