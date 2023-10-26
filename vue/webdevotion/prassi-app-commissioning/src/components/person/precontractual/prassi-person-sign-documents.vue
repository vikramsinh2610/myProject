<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section">Firma Elettronica dei documenti</div>
      <div>
        <div class="row justify-between q-my-xs"></div>
        <div v-if="memberId">
          <div v-if="!documentSigned">
            <iframe
              :src="`${$env.yousignUrl}/procedure/sign?members=${memberId}&signatureUi=${signatureUi}`"
              width="100%"
              height="600px"
            ></iframe>
          </div>
          <div v-else>
            Il documento è stato firmato.
            <prassi-standard-button label="Successivo" @click="nextStep()" />
          </div>
        </div>
      </div>
      <div class="row justify-between q-my-xs">
        <div class="map col-12" style="height: 500px"></div>
      </div>
    </q-card-section>
    <q-inner-loading :showing="isFetching">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'PrassiPersonSignDocuments',
  data() {
    return {
      memberId: undefined,
      signatureUi: `/signature_uis/${this.$env.yousignSignatureUi}`,
      documentSigned: false,
      signature: undefined,
    };
  },
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    person: {
      type: Object,
      default: () => ({}),
    },
    embedded: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: true,
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
        if (!(precontractual.signatureDocuments && precontractual.signatureDocuments.signature))
          return;
        this.signatureDocuments = precontractual.signatureDocuments;
        this.memberId = this.signatureDocuments.signature.memberId;
        this.signature = this.signatureDocuments;
      },
    },
  },
  computed: {
    ...mapState({
      loginId: (state) => state.login._id,
    }),
  },
  methods: {
    nextStep() {
      this.$emit('nextStep');
    },
    ...mapActions({
      updatePdfSignatureDocuments: 'dossiers/updatePdfSignatureDocuments',
    }),

    ...mapMutations({}),

    async onMessageListener(msg) {
      this.$utils.logobj('message', msg);

      if (typeof msg.data === 'object' && msg.data.type === 'iframe-signed') {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });

        const res = await this.updatePdfSignatureDocuments({
          personId: this.person.id,
          precontractualId: this.precontractual.id,
          isCompany: this.person.isCompany,
          name: this.person.name,
          surname: this.person.surname,
          companyName: this.person.companyName,
          signatureDocuments: this.signatureDocuments,
          promoterId: this.loginId,
        });

        const changedPrecontractual = {
          signatureDocuments: res.item,
          status: 1,
        };
        this.$emit('changePrecontractual', {
          data: changedPrecontractual,
          stepper: { name: 'sign-documents', status: 'completed' },
        });
        this.documentSigned = true;
      }
    },
  },
  destroyed() {
    window.removeEventListener('message', this.onMessageListener);
  },
  async mounted() {
    window.addEventListener('message', this.onMessageListener);
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
