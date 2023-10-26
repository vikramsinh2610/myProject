<template>
  <div class="row q-mb-sm">
    <prassi-promoter-insert-letter
      class="col-9 q-mr-sm"
      :letter="letter"
      :letter-settings="letterSettings"
      :products="products"
      :n-attachments="attachments.length"
      @exit="gotoLetterList"
    />
    <prassi-attachment-list
      class="col"
      :is-fetching="isFetching"
      :attachments="attachments"
      :menu-delete="true"
      @download="download"
      @deleteAttachment="deleteAttachment"
    />
  </div>
</template>

<script>
import download from 'getfile-rename-js';
import { mapState, mapActions } from 'vuex';
import PrassiPromoterInsertLetter from '../components/promoter/prassi-promoter-insert-letter';
import PrassiAttachmentList from '../components/base/prassi-attachment-list';

export default {
  name: 'PromotersDetailLetter',
  components: {
    PrassiAttachmentList,
    PrassiPromoterInsertLetter,
  },
  computed: {
    ...mapState({
      letter: (state) => state.promoters.letter,
      letterSettings: (state) => state.promoters.letterSettings.types,
      attachments: (state) => state.promoters.attachments.items,
      document: (state) => state.documents.document.item,
      products: (state) => state.accounting.products.items,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  methods: {
    ...mapActions({
      fetchDocumentUrl: 'documents/fetchDocumentUrl',
      deleteDocument: 'promoters/deleteDocument',
      fetchPromoterLetterAttachments: 'promoters/fetchPromoterLetterAttachments',
    }),
    gotoLetterList() {
      this.$utils.logobj('PROMOTERS-DETAIL', 'gotoLetterList', 'gotoLetterList');
      this.$router.push(`/promoters/${this.$route.params.id}/letters`);
    },
    download({ id }) {
      this.$utils.logobj('PROMOTERS-DETAIL', 'download', id);
      this.fetchDocumentUrl(id).then(() => {
        download(this.document.url, this.document.displayName);
      });
    },
    deleteAttachment({ id }) {
      this.$utils.logobj('PROMOTERS-DETAIL', 'delete', id);
      this.$q
        .dialog({
          title: this.$t('attachment.titleDeleteDialog'),
          message: this.$t('attachment.msgDeleteDialog'),
          ok: this.$t('attachment.okDeleteDialog'),
        })
        .onOk(() => {
          this.deleteDocument(id)
            .then(() => {
              this.fetchPromoterLetterAttachments({
                promoterId: this.$route.params.id,
                letterId: this.$route.params.letter,
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
        });
    },
  },
};
</script>

<style lang="stylus" scoped></style>
