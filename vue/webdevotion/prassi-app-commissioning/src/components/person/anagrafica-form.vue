<template>
  <div>
    <div class="hidden option-group-resize">
      <div>
        <q-option-group
          v-model="form.isCompany"
          :options="[
            { label: 'Persona Fisica', value: false },
            {
              label: 'Persona Giuridica',
              value: true,
            },
          ]"
          :type="'radio'"
          size="30px"
          color="primary"
          inline
        />
      </div>
    </div>

    <q-tabs inverted no-pane-border align="justify" v-model="menu">
      <q-tab name="contact" :label="$t('person.contact')" />
      <q-tab name="fiscal" :label="$t('person.fiscal')" />
      <q-tab
        name="persons"
        :label="$t('default.personsDetailPersons')"
        v-show="personsTabEnabled()"
      />
      <q-tab name="legalAddress" :label="legalAddressLabel()" />
      <q-tab name="address" :label="addressLabel()" />
    </q-tabs>

    <prassi-person-contact
      v-show="menu == 'contact'"
      ref="contact"
      class="col"
      :embedded="true"
      :required="required"
      :person="form"
      @changeData="saveData"
    />

    <prassi-person-fiscal
      v-show="menu === 'fiscal'"
      ref="fiscal"
      class="col"
      :embedded="true"
      :required="required"
      :person="form"
      @changeData="saveData"
    />

    <div v-show="personsTabEnabled() && menu === 'persons'">
      <prassi-person-persons
        v-if="form.oldId"
        ref="persons"
        class="col"
        :person-id="personId"
        :person-old-id="form.oldId"
      />

      <div v-else>Per creare collegamenti, salva prima l'anagrafica.</div>
    </div>

    <div v-show="menu === 'address'">
      <prassi-person-address
        ref="address"
        class="col"
        :embedded="true"
        :required="required"
        :person="form"
        @changeData="saveData"
      />
    </div>

    <prassi-person-legal-address
      v-show="menu === 'legalAddress'"
      ref="legalAddress"
      class="col"
      :embedded="true"
      :required="required"
      :person="form"
      @changeData="saveData"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';

import PrassiPersonContact from '../person/prassi-person-contact';
import PrassiPersonFiscal from '../person/prassi-person-fiscal';
import PrassiPersonAddress from '../person/prassi-person-address';
import PrassiPersonLegalAddress from '../person/prassi-person-legal-address';
import PrassiPersonPersons from './prassi-person-persons';

export default {
  name: 'AnagraficaForm',

  components: {
    PrassiPersonContact,
    PrassiPersonFiscal,
    PrassiPersonAddress,
    PrassiPersonLegalAddress,
    PrassiPersonPersons,
  },

  props: {
    personId: {
      type: String,
      default: undefined,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      menu: 'contact',
      form: {
        oldId: '',
        isCompany: false,
        addressSameAsLegal: true,
        address: {},
        legalAddress: {},
      },
    };
  },

  async mounted() {
    const data = this.person;

    Object.entries(data).forEach(([field, value]) => {
      this.$set(this.form, field, value);
    });

    // The use of `person.id` is on purpose.
    // The api PUT person-companies wants the old id, not the uuid
    this.form.oldId = data.id;
  },

  computed: {
    ...mapState({
      person: (state) => state.dossiers.customer,
      isFetching: (state) => state.error.isFetching,
    }),
  },

  methods: {
    ...mapActions({
      fetchPerson: 'surveys/fetchPerson',
      savePerson: 'surveys/savePerson',
    }),

    saveData() {},

    personsTabEnabled() {
      return this.form.isCompany;
    },

    addressLabel() {
      return this.form.isCompany ? this.$t('person.companyAddress') : this.$t('person.address');
    },

    legalAddressLabel() {
      return this.form.isCompany
        ? this.$t('person.companyLegalAddress')
        : this.$t('person.legalAddress');
    },

    tryParse(data) {
      try {
        return JSON.parse(JSON.stringify(data));
      } catch (error) {
        this.$utils.errobj('anagrafica-form', 'parse', { data, error });
        return {};
      }
    },

    validateFromParent() {
      const contactResult = this.$refs.contact.triggerFromParent();
      const fiscalResult = this.$refs.fiscal.triggerFromParent();
      const legalAddressResult = this.$refs.legalAddress.triggerFromParent();
      const addressResult = this.$refs.address.triggerFromParent();

      const contact = this.tryParse(contactResult.data);
      const fiscal = this.tryParse(fiscalResult.data);
      const legalAddress = this.tryParse(
        legalAddressResult.data && legalAddressResult.data.legalAddress,
      );
      const address = this.tryParse(addressResult.data && addressResult.data.address);

      // Ensure all dates are formatted properly
      if (fiscal.birthDate) {
        fiscal.birthDate = moment.utc(fiscal.birthDate, 'DD/MM/YYYY', false).toISOString();
      }
      if (fiscal.foundationDate) {
        fiscal.foundationDate = moment
          .utc(`01-01-${fiscal.foundationDate}`, 'DD-MM-YYYY')
          .toISOString();
      }

      const allValid = [
        contactResult.valid,
        fiscalResult.valid,
        addressResult.valid,
        legalAddressResult.valid,
      ].every((x) => x === true);

      return {
        contact,
        fiscal,
        address,
        legalAddress,
        valid: {
          contact: contactResult.valid,
          fiscal: fiscalResult.valid,
          address: addressResult.valid,
          legalAddress: legalAddressResult.valid,
          allValid,
        },
      };
    },

    async triggerFromParent() {
      const { contact, fiscal, address, legalAddress } = this.validateFromParent();

      this.$utils.errobj('anagrafica-form', 'parse', { person: this.person });
      const data = {
        ...this.person,
        isCompany: this.form.isCompany,
        ...contact,
        ...fiscal,
        companyType: {
          value: fiscal.companyType.label,
          key: fiscal.companyType.value,
        },
        address,
        legalAddress,
      };

      if (this.personId) data.uuid = this.personId;

      const { item } = await this.savePerson(data);
      return item.uuid;
    },
  },
};
</script>
