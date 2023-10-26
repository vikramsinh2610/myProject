<template>
  <div>
    <div v-if="!consulting.signature">PDF non ancora creato.</div>

    <div v-if="memberId">
      <div v-if="!documentSigned">
        <iframe
          :src="`${$env.yousignUrl}/procedure/sign?members=${memberId}&signatureUi=${signatureUi}`"
          width="100%"
          height="600px"
        ></iframe>
      </div>
      <div v-else>Il documento è stato firmato.</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'ConsultingSign',

  components: {},

  props: {
    type: {
      type: String, // promoter | customer
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

      if (this.type === 'third-payer') {
        this.memberId = this.signature.thirdPayer.memberId;
      }
    }

    window.addEventListener('message', this.onMessageListener);
  },

  destroyed() {
    window.removeEventListener('message', this.onMessageListener);
  },

  computed: {
    ...mapState({
      consulting: (state) => state.consulting.result,
      signature: (state) => state.consulting.result?.signature,
      isFetching: (state) => state.error.isFetching,
    }),
  },

  methods: {
    ...mapActions({
      updatePdfSignature: 'consulting/updatePdfSignature',
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
        } else if (this.type === 'third-payer') {
          signature.thirdPayer.status = 'done';
        } else {
          signature.promoter.status = 'done';
        }

        await this.updatePdfSignature({
          resultId: this.consulting._id,
          signature,
        });
      }
    },

    triggerFromParent() {
      return {};
    },
  },
};
</script>
