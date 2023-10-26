<template>
  <div v-if="ready">
    <div class="p-pc-title-section">Dati soggetto pagatore sepa</div>

    <div>
      <div class="row justify-between q-my-xs">
        <q-input
          class="col-5"
          v-model="customer.name"
          type="text"
          label="Nome cognome / Ragione sociale"
          :error-message="$t('person.error')"
          :error="$v.customer.name.$error"
          @blur="$v.customer.name.$touch"
          :readonly="hasSignature"
        />
      </div>
      <div class="row justify-between q-my-xs">
        <q-input
          class="col-5"
          v-if="!customer.isCompany"
          v-model="customer.fiscalCode"
          type="text"
          label="Codice fiscale"
          :error-message="$t('person.error')"
          :error="$v.customer.fiscalCode.$error"
          @blur="$v.customer.fiscalCode.$touch"
          :readonly="hasSignature"
        />
        <q-input
          v-if="customer.isCompany"
          class="col-5"
          v-model="customer.vat"
          type="text"
          label="Partita iva"
          :error-message="$t('person.error')"
          :error="$v.customer.vat.$error"
          @blur="$v.customer.vat.$touch"
          :readonly="hasSignature"
        />
      </div>
    </div>

    <hr style="margin: 2em 0" />
    <address-lookup ref="address" :initial-address="initialAddress" :readonly="hasSignature" />
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions } from 'vuex';
import AddressLookup from './address-lookup';

const nomeRagioneSociale = (data) => {
  if (data.isCompany && data.companyName) return data.companyName;
  return `${data.name} ${data.surname}`;
};

export default {
  name: 'ConsultingSepaCustomerInfo',
  components: {
    AddressLookup,
  },

  data() {
    return {
      ready: false,
      initialAddress: {},
      customer: {
        isCompany: false,
        name: '',
        fiscalCode: '',
        vat: '',
      },
    };
  },

  async mounted() {
    const customerId = this.consulting?.sepa.linkedCustomerId
      ? this.consulting?.sepa.linkedCustomerId
      : this.$route.params.id;
    await this.fetchPerson(customerId);

    this.$set(this.customer, 'name', nomeRagioneSociale(this.person));
    this.$set(this.customer, 'fiscalCode', this.person.fiscalCode);
    this.$set(this.customer, 'isCompany', this.person.isCompany);
    this.initialAddress = this.person.legalAddress;

    const { customer } = this.consulting?.sepa;
    if (customer.name && !this.consulting?.sepa.isThirdPayer) {
      this.$set(this.customer, 'name', customer.name);
      this.$set(this.customer, 'fiscalCode', customer.fiscalCode);
      this.$set(this.customer, 'vat', customer.vat);
      this.initialAddress = this.consulting.sepa?.address;
    }

    if (customer.name && !this.initialAddress.city) {
      this.initialAddress = this.consulting.sepa?.address;
    }

    this.ready = true;
  },

  validations() {
    return {
      customer: {
        name: { required },
        fiscalCode: {
          ...(this.required ? { required } : {}),
          checkFiscalCode: this.customer.isCompany || this.$utils.checkFiscalCode,
        },
        vat: {
          ...(this.required ? { required } : {}),
          checkVatNumber: !this.customer.isCompany || this.$utils.checkVatNumber,
        },
      },
    };
  },

  computed: {
    ...mapState({
      person: (state) => state.surveys.person,
      consulting: (state) => state.consulting.result,
    }),

    hasSignature() {
      return !!this.consulting?.signature;
    },
  },

  methods: {
    ...mapActions({
      fetchPerson: 'surveys/fetchPerson',
      savePerson: 'dossiers/savePerson',
      savePersonSurvey: 'surveys/savePerson',
    }),

    async triggerFromParent() {
      const component = this.$refs.address;
      this.$v.customer.$touch();

      const item = {
        ...this.person,
        fiscalCode: this.customer.isCompany ? this.customer.vat : this.customer.fiscalCode,
        vat: this.customer.vat,
        address: component.getAddress(),
      };

      // eslint-disable-next-line unicorn/prefer-ternary
      if (!this.consulting?.sepa.isThirdPayer) {
        await this.savePerson({
          body: { item },
        }).then(async () => {});
      } else {
        await this.savePersonSurvey(item).then(async () => {});
      }

      return {
        data: {
          customer: { ...this.person, ...this.customer },
          address: component.getAddress(),
        },
        valid: !this.$v.customer.$error && component.isValid(),
      };
    },
  },
};
</script>
