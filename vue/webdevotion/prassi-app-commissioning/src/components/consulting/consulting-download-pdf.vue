<template>
  <div>
    <section v-if="!signature || !signature.procedureCompleted">
      <p>Cliente e consulente devono ancora firmare il PDF.</p>
      <prassi-standard-button
        v-if="
          $user.roleID >= 7 &&
          !signature.procedureCompleted &&
          signature.customer.status === 'done' &&
          signature.promoter.status === 'done'
        "
        label="FIX AGGIORNA FIRMA"
        @click="() => updateSignAgain()"
      />
    </section>

    <section v-else style="margin-top: 1.5em">
      <div v-for="file in signature.files" :key="file.fileId">
        <prassi-body-list
          menu
          menu-icon="fa fa-download"
          :blocks="fileBlock(file)"
          @menuClick="() => downloadPdf(file.documentId, displayName(file))"
        />
      </div>
      <div class="row justify-between q-my-xs">
        <prassi-standard-button label="aggiorna pdf" @click="() => aggiornaPdf()" />
        <prassi-standard-button label="vai alla pratica" @click="() => goToPractice()" />
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import download from 'getfile-rename-js';
import PrassiBodyList from '../base/prassi-body-list';

export default {
  name: 'ConsultingDownloadPdf',

  components: {
    PrassiBodyList,
  },

  props: {},

  data() {
    return {};
  },

  computed: {
    ...mapState({
      consulting: (state) => state.consulting.result,
      signature: (state) => state.consulting.result?.signature,
      isFetching: (state) => state.error.isFetching,
      token: (state) => state.login.token,
    }),
  },

  methods: {
    ...mapActions({
      updatePdfSignature: 'consulting/updatePdfSignature',
    }),

    async updateSignAgain() {
      const signature = { ...this.signature };

      await this.updatePdfSignature({
        resultId: this.consulting._id,
        signature,
      });
    },

    fileLabel(file) {
      return {
        afc: 'Attestato di fine consulenza',
        sepa: 'Mandato per addebito diretto SEPA',
        allegato4: `Allegato 4${this.consulting.type === 'inv' ? 'bis' : ''}`,
        adequacy: 'Adeguatezza',
      }[file.fileType];
    },

    displayName(file) {
      const name = [this.signature.customer.info.name, this.signature.customer.info.surname].join(
        ' ',
      );
      return `${this.fileLabel(file)}-${name}.pdf`;
    },
    fileBlock(file) {
      return [
        {
          _id: '0',
          label: this.fileLabel(file),
          weight: 'normal',
          type: '2rows',
          col: true,
        },
      ];
    },
    async aggiornaPdf() {
      const { resultId } = this.$route.params;
      const store = { rootState: this.$store.state, commit: this.$store.commit };
      await this.$utils.getApiCall(store, {
        url: `/v1/consulting/${resultId}/update-pdf-documents`,
        action: 'post',
      });
      // await download(res, 'Aggiorna Pdf');
    },
    async downloadPdf(documentId, label) {
      const store = { rootState: this.$store.state, commit: this.$store.commit };
      const res = await this.$utils.getApiCall(store, {
        url: `/v1/documents/${documentId}/presigned-download`,
      });

      await download(res.item.url, label);
    },

    goToPractice() {
      this.$utils.logobj('CONSULTING', 'viewDossier', this.consulting);
      const id = this.consulting.practiceUuid;
      const msId = id.split('-');
      const msId1 =
        msId[0].slice(6, 8) + msId[0].slice(4, 6) + msId[0].slice(2, 4) + msId[0].slice(0, 2);
      const msId2 = msId[1].slice(2, 4) + msId[1].slice(0, 2);
      const msId3 = msId[2].slice(2, 4) + msId[2].slice(0, 2);
      if (this.consulting.proposalNumber.slice(0, 3) === 'SUB') {
        window.open(
          `${this.$env.legacyBaseUrl}/#/dettaglioProposta/${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}?token=${this.token}`,
          '_blank',
        );
      } else {
        this.$utils.logobj('CONSULTING', 'viewDossier versamento', this.consulting);
        const idc = this.consulting.product.practiceUuid;
        const msIdc = idc.split('-');
        const msIdc1 =
          msIdc[0].slice(6, 8) + msIdc[0].slice(4, 6) + msIdc[0].slice(2, 4) + msIdc[0].slice(0, 2);
        const msIdc2 = msIdc[1].slice(2, 4) + msIdc[1].slice(0, 2);
        const msIdc3 = msIdc[2].slice(2, 4) + msIdc[2].slice(0, 2);
        window.open(
          `${this.$env.legacyBaseUrl}/#/versamentoAggiuntivo/${msIdc1}-${msIdc2}-${msIdc3}-${msIdc[3]}-${msIdc[4]}/${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}?token=${this.token}`,
          '_blank',
        );
      }
    },

    triggerFromParent() {
      return {};
    },
  },
};
</script>
