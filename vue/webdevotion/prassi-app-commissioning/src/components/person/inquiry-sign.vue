<template>
  <div>
    <div class="p-pc-title-section">
      Firma {{ this.type === 'customer' ? 'cliente' : 'consulente' }}
    </div>

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
        <prassi-standard-button label="Successivo" @click="clickNavigateNext()" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'InquirySign',

  components: {},

  props: {
    type: {
      type: String, // promoter | customer
      default: undefined,
    },
    nextCallback: {
      type: Function,
      default: undefined,
    },
  },

  data() {
    return {
      memberId: undefined,
      signatureUi: `/signature_uis/${this.$env.yousignSignatureUi}`,
      documentSigned: false,
    };
  },

  async mounted() {
    if (this.signature) {
      this.memberId =
        this.type === 'customer'
          ? this.signature.customer.memberId
          : this.signature.promoter.memberId;
    }

    window.addEventListener('message', this.onMessageListener);
  },

  destroyed() {
    window.removeEventListener('message', this.onMessageListener);
  },

  computed: {
    ...mapState({
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

    async onMessageListener(msg) {
      this.$utils.logobj('message', msg);

      if (typeof msg.data === 'object' && msg.data.type === 'iframe-signed') {
        this.documentSigned = true;

        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });

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
      }
    },

    clickNavigateNext() {
      this.nextCallback();
    },
  },
};
</script>
