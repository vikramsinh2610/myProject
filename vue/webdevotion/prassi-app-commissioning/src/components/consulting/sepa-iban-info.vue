<template>
  <div>
    <q-input
      class="col-12"
      v-model="form.iban"
      type="text"
      :label="$t('IBAN')"
      :error-message="$t('person.error')"
      :error="$v.form.iban.$error"
      @blur="$v.form.iban.$touch"
      :readonly="hasSignature"
    />
    <q-input
      class="col-12"
      v-model="form.swift"
      type="text"
      :label="$t('SWIFT / BIC')"
      :error-message="$t('person.error')"
      :error="$v.form.swift.$error"
      @blur="$v.form.swift.$touch"
      :readonly="hasSignature"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'ConsultingSepaIbanInfo',
  components: {},

  data() {
    return {
      form: {
        iban: '',
        swift: '',
      },
    };
  },

  mounted() {
    const { iban } = this.consulting?.sepa;
    if (!iban) return;

    this.$set(this.form, 'iban', iban.iban);
    this.$set(this.form, 'swift', iban.swift);
  },

  validations() {
    return {
      form: {
        iban: { required, checkIban: this.$utils.checkIban },
        swift: {},
      },
    };
  },

  computed: {
    ...mapState({
      consulting: (state) => state.consulting.result,
    }),

    hasSignature() {
      return !!this.consulting?.signature;
    },
  },

  methods: {
    triggerFromParent() {
      this.$v.form.$touch();
      return { data: this.form, valid: !this.$v.form.$error };
    },
  },
};
</script>
