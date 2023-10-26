<template>
  <div>
    <section v-if="!signature">
      <div>
        <div class="p-pc-title-section">Consulente</div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="promoter.name"
            type="text"
            :label="$t('person.name')"
            :error-message="$t('person.error')"
            :error="$v.promoter.name.$error"
            @blur="$v.promoter.name.$touch"
            :readonly="hasSignature || promoterLocked.name"
          />
          <q-input
            class="col-5"
            v-model="promoter.surname"
            type="text"
            :label="$t('person.surname')"
            :error-message="$t('person.error')"
            :error="$v.promoter.surname.$error"
            @blur="$v.promoter.surname.$touch"
            :readonly="hasSignature || promoterLocked.surname"
          />
        </div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="promoter.email"
            type="email"
            :label="$t('person.email')"
            :error-message="$t('person.error')"
            :error="$v.promoter.email.$error"
            @blur="$v.promoter.email.$touch"
            :readonly="hasSignature || promoterLocked.email"
          />
          <q-input
            class="col-5"
            v-model="promoter.mobilePhone"
            type="text"
            :label="$t('person.mobilePhone')"
            :error-message="promoter.errorMessage.mobilePhone"
            :error="$v.promoter.mobilePhone.$error"
            @blur="$v.promoter.mobilePhone.$touch"
            :readonly="hasSignature || promoterLocked.mobilePhone"
          />
        </div>
      </div>

      <div style="margin-top: 2.5em">
        <div class="p-pc-title-section">Cliente</div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="customer.name"
            type="text"
            :label="$t('person.name')"
            :error-message="$t('person.error')"
            :error="$v.customer.name.$error"
            :readonly="$user.roleID < 7"
            @blur="$v.customer.name.$touch"
          />
          <q-input
            class="col-5"
            v-model="customer.surname"
            type="text"
            :label="$t('person.surname')"
            :error-message="$t('person.error')"
            :error="$v.customer.surname.$error"
            @blur="$v.customer.surname.$touch"
            :readonly="$user.roleID < 7"
          />
        </div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="col-5"
            v-model="customer.email"
            type="email"
            :label="$t('person.email')"
            :error-message="$t('person.error')"
            :error="$v.customer.email.$error"
            @blur="$v.customer.email.$touch"
            :readonly="$user.roleID < 7"
          />
          <q-input
            class="col-5"
            v-model="customer.mobilePhone"
            type="text"
            :label="$t('person.mobilePhone')"
            :error-message="customer.errorMessage.mobilePhone"
            :error="$v.customer.mobilePhone.$error"
            @blur="$v.customer.mobilePhone.$touch"
            :readonly="$user.roleID < 7"
          />
        </div>
      </div>

      <div v-if="!signature">
        <prassi-standard-button label="Crea PDF per firma digitale" @click="clickSign" />
      </div>
    </section>

    <section v-if="signature">
      <div v-if="signature.documentId">
        <p>Cliente e consulente hanno firmato il PDF.</p>
      </div>
      <div v-else>
        <p>Il PDF è pronto per essere firmato.</p>
        <prassi-standard-button label="Vai a Firma consulente" @click="nextCallback" />
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';

export default {
  name: 'InquirySign',

  components: {},

  props: {
    nextCallback: {
      type: Function,
      default: undefined,
    },
  },

  data() {
    return {
      customer: {
        name: '',
        surname: '',
        mobilePhone: '',
        email: '',
        errorMessage: {
          mobilePhone: '',
        },
      },
      promoter: {
        name: '',
        surname: '',
        mobilePhone: '',
        email: '',
        errorMessage: {
          mobilePhone: '',
        },
      },
      promoterLocked: {
        name: false,
        surname: false,
        mobilePhone: false,
        email: false,
      },
    };
  },

  async mounted() {
    const customerId = this.$route.params.id;
    await this.fetchPerson(customerId);

    if (this.person.isCompany) {
      // load legale rappresentante
      this.setDossiersFilterLegalPerson(true);
      await this.fetchPersonPersons(customerId);
      if (this.persons.length) {
        await this.fetchPerson(this.persons[0].uuid);
      }
    }

    this.$set(this.customer, 'name', this.person.name);
    this.$set(this.customer, 'surname', this.person.surname);
    this.$set(this.customer, 'email', this.person.email);
    this.$set(this.customer, 'mobilePhone', this.person.mobilePhone);

    await this.fetchPromoter(this.promoterId);
    this.$set(this.promoter, 'name', this.promoterData.name);
    this.$set(this.promoter, 'surname', this.promoterData.surname);
    this.$set(this.promoter, 'email', this.promoterData.username);
    this.$set(this.promoter, 'mobilePhone', this.promoterData.mobilePhone);

    if (this.promoter.name) this.promoterLocked.name = true;
    if (this.promoter.surname) this.promoterLocked.surname = true;
    if (this.promoter.email) this.promoterLocked.email = true;
    if (this.promoter.mobilePhone) this.promoterLocked.mobilePhone = true;

    if (this.signature && this.signature.customer) {
      this.$set(this.customer, 'name', this.signature.customer.name);
      this.$set(this.customer, 'surname', this.signature.customer.surname);
      this.$set(this.customer, 'email', this.signature.customer.email);
      this.$set(this.customer, 'mobilePhone', this.signature.customer.mobilePhone);
    }

    if (this.signature && this.signature.promoter) {
      this.$set(this.promoter, 'name', this.signature.promoter.name);
      this.$set(this.promoter, 'surname', this.signature.promoter.surname);
      this.$set(this.promoter, 'email', this.signature.promoter.username);
      this.$set(this.promoter, 'mobilePhone', this.signature.promoter.mobilePhone);
    }
  },

  validations() {
    return {
      customer: {
        name: { required },
        surname: { required },
        email: { required, email },
        mobilePhone: {
          checkPhone(value) {
            if (!/^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,7}$/i.test(value) && value !== '') {
              this.customer.errorMessage.mobilePhone = 'Il numero di cellulare non è corretto.';
              return false;
            }
            if (value === '') {
              this.customer.errorMessage.mobilePhone = 'Il campo è richiesto';
              return false;
            }
            return true;
          },
        },
      },
      promoter: {
        name: { required },
        surname: { required },
        email: { required, email },
        mobilePhone: {
          // eslint-disable-next-line sonarjs/no-identical-functions
          checkPhone(value) {
            if (!/^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,7}$/i.test(value) && value !== '') {
              this.promoter.errorMessage.mobilePhone = 'Il numero di cellulare non è corretto.';
              return false;
            }
            if (value === '') {
              this.promoter.errorMessage.mobilePhone = 'Il campo è richiesto';
              return false;
            }
            return true;
          },
        },
      },
    };
  },

  computed: {
    ...mapState({
      promoterId: (state) => state.login._id,
      person: (state) => state.surveys.person,
      persons: (state) => state.dossiers.personPersons.items,
      promoterData: (state) => state.promoters.promoter,
      signature: (state) => state.surveys.signature,
      survey: (state) => state.surveys.survey,
      isFetching: (state) => state.error.isFetching,
    }),

    hasSignature() {
      return !!this.signature;
    },
  },

  methods: {
    ...mapActions({
      fetchPerson: 'surveys/fetchPerson',
      fetchPersonPersons: 'dossiers/fetchPersonPersons',
      fetchPromoter: 'promoters/fetchPromoter',
      signPdf: 'surveys/signPdf',
    }),

    ...mapMutations({
      setDossiersFilterLegalPerson: 'dossiers/setDossiersFilterLegalPerson',
    }),

    async clickSign() {
      this.$v.customer.$touch();
      this.$v.promoter.$touch();
      if (this.$v.customer.$error || this.$v.promoter.$error) return;

      const customer = {
        id: this.person.uuid,
        name: this.customer.name,
        surname: this.customer.surname,
        email: this.customer.email,
        mobilePhone: this.formatPhone(this.customer.mobilePhone),
        isCompany: this.person.isCompany,
      };

      const promoter = {
        id: this.promoterId,
        name: this.promoter.name,
        surname: this.promoter.surname,
        email: this.promoter.email,
        mobilePhone: this.formatPhone(this.promoter.mobilePhone),
      };

      await this.signPdf({
        resultId: this.survey._id,
        customer,
        promoter,
      });
    },

    formatPhone(phone) {
      return phone.includes('+') ? phone : `+39${phone}`;
    },
  },
};
</script>
