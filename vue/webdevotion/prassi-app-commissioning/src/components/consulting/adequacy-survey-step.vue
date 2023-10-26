<template>
  <div v-if="!resultId">
    Prima di procedere, compila il questionario adeguatezza
    <prassi-standard-button class="q-mb-lg" label="Compila" @click="showAdequacySurvey()" />
  </div>

  <div v-else>Questionario adeguatezza compilato</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ConsultingAdequacySurveyStep',

  props: {
    showAdequacySurvey: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {};
  },

  computed: {
    ...mapState({
      survey: (state) => state.surveys.survey,
      consulting: (state) => state.consulting.result,
      adequacyResultId: (state) => state.consulting.adequacyResultId,
      isFetching: (state) => state.error.isFetching,
    }),

    resultId() {
      return this.consulting?.adequacy?.resultId || this.adequacyResultId;
    },
  },

  methods: {
    triggerFromParent() {
      return {
        data: { resultId: this.resultId },
        valid: !!this.resultId,
      };
    },
  },
};
</script>
