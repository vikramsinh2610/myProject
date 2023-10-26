<template>
  <prassi-attachment-list
    class="fill-available"
    :is-fetching="isFetching"
    :menu-delete="true"
    :attachments="documents"
    @loadMore="loadMoreDocuments"
    @download="download"
    @deleteAttachment="deleteAttachment"
  />
</template>

<script>
import download from 'getfile-rename-js';
import { mapState, mapActions, mapMutations } from 'vuex';
import PrassiAttachmentList from '../components/base/prassi-attachment-list';

export default {
  name: 'PromotersDetailDocuments',
  components: {
    PrassiAttachmentList,
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      documents: (state) => state.promoters.documents.items,
      last: (state) => state.promoters.documents.lastRecord,
      document: (state) => state.documents.document.item,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  methods: {
    ...mapActions({
      fetchPromoterDocuments: 'promoters/fetchPromoterDocuments',
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
      deleteDocument: 'promoters/deleteDocument',
    }),
    ...mapMutations({
      resetPromoterDocuments: 'promoters/resetPromoterDocuments',
    }),
    // eslint-disable-next-line no-unused-vars
    loadMoreDocuments({ index, done }) {
      this.$utils.logobj('PROMOTERS-DETAIL-DOCUMENTS', 'loadMoreDocuments', index);
      if (this.last || this.error) return;
      this.fetchPromoterDocuments({
        promoterId: this.$route.params.id,
        types: 'letter-attachment,user-attachment',
      }).finally(() => done());
    },
    download({ id }) {
      this.$utils.logobj('PROMOTERS-DETAIL-DOCUMENTS', 'download', id);
      this.fetchDocumentUrl(id).then(() => {
        download(this.document.url, this.document.displayName);
      });
    },
    deleteAttachment({ id }) {
      this.$utils.logobj('PROMOTERS-DETAIL-DOCUMENTS', 'delete', id);
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
