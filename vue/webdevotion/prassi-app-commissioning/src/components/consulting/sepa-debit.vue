<template>
  <div>
    <section style="margin: 2em 0">
      È previsto l'advisory Fee con addebito SEPA?
      <hr />
      <div>
        <q-option-group
          v-model="hasAdvisoryFee"
          :options="[
            { label: 'Si', value: true },
            {
              label: 'No',
              value: false,
            },
          ]"
          :type="'radio'"
          size="30px"
          color="primary"
          class="text-center"
          inline
          :disabled="hasSignature || consulting.type === 'inv'"
        />
      </div>
    </section>
    <section style="margin: 2em 0" v-if="hasAdvisoryFee">
      E’ previsto un terzo pagatore?
      <hr />
      <div>
        <q-option-group
          v-model="isThirdPayer"
          :options="[
            { label: 'Si', value: true },
            {
              label: 'No',
              value: false,
            },
          ]"
          :type="'radio'"
          size="30px"
          color="primary"
          class="text-center"
          inline
          :disabled="hasSignature"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ConsultingSepaDebit',

  data() {
    return {
      hasAdvisoryFee: false,
      isThirdPayer: false,
    };
  },

  mounted() {
    this.hasAdvisoryFee = this.consulting?.sepa.hasAdvisoryFee;
    this.isThirdPayer = this.consulting?.sepa.isThirdPayer;
  },

  computed: {
    ...mapState({
      consulting: (state) => state.consulting.result,
      isFetching: (state) => state.error.isFetching,
    }),

    hasSignature() {
      return !!this.consulting?.signature;
    },
  },

  methods: {
    async triggerFromParent() {
      return {
        hasAdvisoryFee: this.hasAdvisoryFee,
        isThirdPayer: this.hasAdvisoryFee && this.isThirdPayer,
      };
    },
  },
};
</script>

<style>
.disabled,
[disabled],
.disabled *,
[disabled] * {
  pointer-events: none;
}
.q-option-group--inline > div {
  margin-left: 50px;
}
</style>
