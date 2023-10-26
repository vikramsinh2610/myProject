<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <prassi-standard-button
        v-if="
          $user.roleID >= 7 &&
          (!signatureDocuments ||
            !signatureDocuments.documentIdMandate ||
            !signatureDocuments.documentIdPrivacy ||
            !signatureDocuments.documentIdOtp)
        "
        label="FIX AGGIORNA FIRMA"
        @click="() => updateSignAgain()"
      />
      <div class="p-pc-title-section" v-if="!embedded">Download Documenti</div>
      <div>
        <div class="row justify-between q-py-xl">
          <div class="col-12">
            <div
              v-if="
                signatureDocuments &&
                (signatureDocuments.documentIdMandate ||
                  signatureDocuments.documentIdPrivacy ||
                  signatureDocuments.documentIdOtp)
              "
            >
              <div v-if="signatureDocuments.documentIdMandate">
                <prassi-body-list
                  menu
                  menu-icon="fa fa-download"
                  :blocks="attachmentBlock('mandato.pdf')"
                  @menuClick="downloadAttachment(signatureDocuments.documentIdMandate)"
                />
              </div>
              <div v-if="signatureDocuments.documentIdPrivacy">
                <prassi-body-list
                  menu
                  menu-icon="fa fa-download"
                  :blocks="attachmentBlock('privacy.pdf')"
                  @menuClick="downloadAttachment(signatureDocuments.documentIdPrivacy)"
                />
              </div>
              <div v-if="signatureDocuments.documentIdOtp">
                <prassi-body-list
                  menu
                  menu-icon="fa fa-download"
                  :blocks="attachmentBlock('otp.pdf')"
                  @menuClick="downloadAttachment(signatureDocuments.documentIdOtp)"
                />
              </div>
            </div>
            <div class="row justify-between q-mt-lg" v-if="!readOnly">
              <prassi-standard-button
                class="q-mb-lg"
                label="Torna alla Dashboard"
                @click="goDashboard()"
              />
            </div>
            <div v-else>
              {{ $t('survey.noAttachment') }}
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-between q-my-xs"></div>
    </q-card-section>
    <q-inner-loading :showing="isFetching">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex';
import download from 'getfile-rename-js';
import PrassiBodyList from '../../base/prassi-body-list';

export default {
  name: 'PrassiPersonDownloadDocument',
  components: {
    PrassiBodyList,
  },
  data() {
    return {
      message: '',
      signatureDocuments: {},
    };
  },
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    embedded: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: true,
    },
    person: {
      type: Object,
      default: () => ({}),
    },
    precontractual: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    precontractual: {
      immediate: true,
      handler(precontractual) {
        this.$utils.logobj('PRASSI-PERSON-DOCUMENT-CARD', 'precontractual', precontractual);
        if (!precontractual.id) return;
        this.signatureDocuments = precontractual.signatureDocuments;
      },
    },
  },
  methods: {
    ...mapActions({
      updatePdfSignatureDocuments: 'dossiers/updatePdfSignatureDocuments',
    }),

    async downloadAttachment(documentId) {
      const store = { rootState: this.$store.state, commit: this.$store.commit };
      const res = await this.$utils.getApiCall(store, {
        url: `/v1/documents/${documentId}/presigned-download`,
      });

      await download(res.item.url, res.item.displayName);
    },

    async updateSignAgain() {
      await this.updatePdfSignatureDocuments({
        personId: this.person.id,
        precontractualId: this.precontractual.id,
        isCompany: this.person.isCompany,
        name: this.person.name,
        surname: this.person.surname,
        companyName: this.person.companyName,
        signatureDocuments: this.signatureDocuments,
        promoterId: this.loginId,
      });
    },

    goDashboard() {
      this.$router.push(`/persons/${this.$route.params.id}`);
    },

    attachmentBlock(displayName) {
      return [
        {
          _id: '0',
          label: displayName,
          weight: 'normal',
          type: '2rows',
          col: true,
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-radius 4px
  border solid 1px $card-border
  min-height 280px
.q-card-main
  padding 10px 15px 0
  min-height 34px
.p-pc-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  margin-bottom 20px
.p-pc-red-section
  font-size 18px
  color $r-3
  font-weight 500
  margin 20px auto
  text-align center
.p-pc-small-field
  width 140px
.p-pc-toggle
  width 45%
  justify-content space-between
  font-size 22px
.p-pc-date
  width 200px
</style>
