<template>
  <div>
    <section v-if="!signature || !signature.documentId">
      <p>Cliente e consulente devono ancora firmare il PDF.</p>
      <prassi-standard-button label="Vai a Firma consulente" @click="nextCallback" />
    </section>

    <prassi-standard-button
      v-if="$user.roleID >= 7 && (!signature || !signature.documentId)"
      label="FIX AGGIORNA FIRMA"
      @click="() => updateSignAgain()"
    />

    <section v-else>
      <prassi-body-list
        menu
        menu-icon="fa fa-download"
        :blocks="fileBlock()"
        @menuClick="() => downloadPdf(signature.documentId, displayName())"
      />
      <prassi-standard-button class="q-mb-lg" label="Torna alla Dashboard" @click="goDashboard()" />
    </section>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import download from 'getfile-rename-js';
import PrassiBodyList from '../base/prassi-body-list';

export default {
  name: 'InquiryDownloadPdf',

  components: {
    PrassiBodyList,
  },

  props: {
    nextCallback: {
      type: Function,
      default: undefined,
    },
  },

  data() {
    return {};
  },

  // async mounted() {},

  computed: {
    ...mapState({
      promoterId: (state) => state.login._id,
      person: (state) => state.surveys.person,
      promoterData: (state) => state.promoters.promoter,
      signature: (state) => state.surveys.signature,
      survey: (state) => state.surveys.survey,
      isFetching: (state) => state.error.isFetching,
    }),
  },

  methods: {
    ...mapActions({
      updatePdfSignature: 'surveys/updatePdfSignature',
    }),

    ...mapMutations({}),

    async updateSignAgain() {
      const signature = { ...this.signature };

      if (this.type === 'customer') {
        signature.customer.status = 'done';
      } else {
        signature.promoter.status = 'done';
      }

      await this.updatePdfSignature({
        resultId: this.survey._id,
        signature,
      });
    },

    goDashboard() {
      this.$router.push(`/persons/${this.$route.params.id}`);
    },

    fileLabel() {
      return 'Analisi dei bisogni';
    },

    displayName() {
      const name = [this.signature.customer.info.name, this.signature.customer.info.surname].join(
        ' ',
      );
      return `${this.survey.codeSurveyResult}-${this.fileLabel()}-${name}.pdf`;
    },

    fileBlock() {
      return [
        {
          _id: '0',
          label: this.fileLabel(),
          weight: 'normal',
          type: '2rows',
          col: true,
        },
      ];
    },

    async downloadPdf(documentId, label) {
      const store = { rootState: this.$store.state, commit: this.$store.commit };
      const res = await this.$utils.getApiCall(store, {
        url: `/v1/documents/${documentId}/presigned-download`,
      });

      await download(res.item.url, label);
    },
  },
};
</script>
