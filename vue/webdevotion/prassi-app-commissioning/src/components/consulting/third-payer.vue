<template>
  <div>
    <q-card-section>
      <div>
        <div class="row justify-between q-my-xs">
          <div class="col-5 justify-between">
            <q-input
              class="col-5"
              :readonly="hasSignature"
              v-model="form.searchName"
              @keyup="clearFiscal"
              type="text"
              label="Cerca Nome e Cognome"
            />
          </div>
          <div class="col-5 justify-between">
            <q-input
              class="col-5"
              :readonly="hasSignature"
              v-model="form.searchFiscalCode"
              @keyup="clearName"
              type="text"
              label="Cerca per Codice Fiscale o Partita IVA"
            />
          </div>
        </div>

        <div class="row justify-between q-my-xs">
          <prassi-standard-button
            v-if="!hasSignature"
            class="q-mb-lg"
            label="Cerca"
            @click="addPersonDialog"
          />
        </div>

        <div class="row justify-between q-my-lg">
          <prassi-person-detail
            :person="personSelected"
            :readonly="hasSignature"
            v-if="personSelectedBlock"
            :loading="isFetchingData"
            :embedded="true"
            @detailClick="gotoPerson"
            @deletePerson="deletePersonClicked"
          />
        </div>
      </div>
      <q-dialog v-model="showAddDialog">
        <q-card style="max-width: 800px; width: 800px">
          <q-card-section class="bg-secondary text-white q-mb-md">
            <div class="text-h6">{{ $t('configurationHeader.changePersonPerson') }}</div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-between q-my-xs">
              <div class="col-5 justify-between">
                <q-input
                  class="col-5"
                  v-model="formDialog.searchName"
                  @keyup="clearFiscal"
                  type="text"
                  label="Cerca Nome e Cognome"
                />
              </div>
              <div class="col-5 justify-between">
                <q-input
                  class="col-5"
                  v-model="formDialog.searchFiscalCode"
                  @keyup="clearName"
                  type="text"
                  label="Cerca per Codice Fiscale o Partita IVA"
                />
              </div>
            </div>
            <div class="row justify-between q-my-lg">
              <prassi-standard-button
                class="q-mb-lg"
                label="Crea Nuova Anagrafica"
                @click="comfirmAddPerson"
              />
              <prassi-standard-button class="q-mb-lg" label="Cerca" @click="searchOnDialog" />
            </div>
            <div class="row justify-between q-my-lg">
              <prassi-persons-detail
                :persons="personsFilter"
                :is-fetching="isFetching"
                :embedded="true"
                @selectClick="preSavePersonPersons"
                @detailClick="gotoPerson"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!-- Create person dialog -->
      <q-dialog v-model="addCustomerDialog">
        <q-card style="width: 800px">
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">
              {{ $t('customer.addCustomer') }}
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="column justify-between">
              <q-input
                class="col-6"
                v-model="customerData.name"
                :label="$t('customer.name')"
                type="text"
                :error-message="errorMessage.name"
                :error="$v.customerData.name.$error"
                @blur="$v.customerData.name.$touch"
              />
              <q-input
                class="col-6"
                v-model="customerData.surname"
                type="text"
                :label="$t('customer.surname')"
                :error-message="errorMessage.surname"
                :error="$v.customerData.surname.$error"
                @blur="$v.customerData.surname.$touch"
              />
              <q-input
                class="col-6"
                v-model="customerData.email"
                type="email"
                :label="$t('customer.email')"
                :error="$v.customerData.email.$error"
                @blur="$v.customerData.email.$touch"
              />
              <q-input
                class="col-6"
                v-model="customerData.mobilePhone"
                type="email"
                :label="$t('customer.mobilePhone')"
                :error-message="errorMessage.mobilePhone"
                :error="$v.customerData.mobilePhone.$error"
                @blur="$v.customerData.mobilePhone.$touch"
              />
            </div>
          </q-card-section>
          <q-card-section>
            <prassi-standard-button :label="$t('default.addButton')" @click="comfirmAddCustomer" />
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-card-section>
    <q-inner-loading :showing="isFetching">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { email, required } from 'vuelidate/lib/validators';
import PrassiPersonDetail from '../person/precontractual/prassi-person-detail';
import PrassiPersonsDetail from '../person/precontractual/prassi-persons-detail';

export default {
  name: 'ConsultingThirdPayer',

  components: {
    PrassiPersonDetail,
    PrassiPersonsDetail,
  },

  data() {
    return {
      showAddDialog: false,
      showDelDialog: false,
      personSelected: {},
      personSelectedBlock: false,
      personToDelete: '',
      isFetchingData: false,
      // eslint-disable-next-line unicorn/no-null
      linkedCustomerId: null,
      // eslint-disable-next-line unicorn/no-null
      companyId: null,
      form: {
        searchName: '',
        searchFiscalCode: '',
        // eslint-disable-next-line unicorn/no-null
        id: null,
        personId: '',
        // eslint-disable-next-line unicorn/no-null
        personType: null,
        // eslint-disable-next-line unicorn/no-null
        personTypeKey: null,
        linkedPersonId: '',
        // eslint-disable-next-line unicorn/no-null
        linkedPerson: null,
      },
      formDialog: {
        searchName: '',
        searchFiscalCode: '',
      },
      // Create customer
      customerData: {
        name: '',
        surname: '',
        email: '',
        mobilePhone: '',
        isCompany: false,
      },
      errorMessage: {
        mobilePhone: '',
        name: '',
        surname: '',
      },
      addCustomerDialog: false,
      personsPersonsList: undefined,
    };
  },
  validations() {
    return {
      customerData: {
        name: {
          checkName(value) {
            if (!/^(?!\s)(?![\S\s]*\s$)[ 'a-z]+$/i.test(value) && value !== '') {
              this.errorMessage.name = 'Ci sono dei caratteri speciali non ammessi.';
              return false;
            }
            if (value === '') {
              this.errorMessage.name = 'Il campo è richiesto';
              return false;
            }
            return true;
          },
        },
        surname: {
          checkSurname(value) {
            if (!/^(?!\s)(?![\S\s]*\s$)[ 'a-z]+$/i.test(value) && value !== '') {
              this.errorMessage.surname = 'Ci sono dei caratteri speciali non ammessi.';
              return false;
            }
            if (value === '') {
              this.errorMessage.surname = 'Il campo è richiesto';
              return false;
            }
            return true;
          },
        },
        email: { required, email },
        mobilePhone: {
          checkPhone(value) {
            if (!/^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,7}$/i.test(value) && value !== '') {
              this.errorMessage.mobilePhone = 'Il numero di cellulare non è corretto.';
              return false;
            }
            if (value === '') {
              this.errorMessage.mobilePhone = 'Il campo è richiesto';
              return false;
            }
            return true;
          },
        },
      },
    };
  },

  async mounted() {
    this.linkedCustomerId = this.consulting?.sepa.linkedCustomerId;
    if (this.linkedCustomerId) {
      this.personSelectedBlock = true;
      this.addCustomerDialog = false;
      const personRelatedRes = await this.fetchPersonLinked(this.linkedCustomerId);
      const personRelated = personRelatedRes.item;
      this.personSelected = personRelated;
    }
  },

  computed: {
    ...mapState({
      consulting: (state) => state.consulting.result,
      persons: (state) => state.dossiers.personPersons.items,
      personsFilter: (state) => state.dossiers.customers.items,
      personRelated: (state) => state.dossiers.customerRelated,
      precontractualRelated: (state) => state.dossiers.precontractualRelated,
      isFetching: (state) => state.error.isFetching,
    }),

    hasSignature() {
      return !!this.consulting?.signature;
    },
  },

  methods: {
    ...mapActions({
      savePersonPersonsLegal: 'dossiers/savePersonPersonsLegal',
      fetchPersonsFilter: 'dossiers/fetchPersonsFilter',
      fetchPersonLinked: 'dossiers/fetchPersonLinked',
      createPersonRelated: 'dossiers/createPersonRelated',
      fetchIdentityCard: 'dossiers/fetchIdentityCard',
      fetchPrecontractualRelated: 'dossiers/fetchPrecontractualRelated',
    }),
    ...mapMutations({
      resetCustomers: 'dossiers/resetCustomers',
      setCustomerSearchFilter: 'dossiers/setCustomerSearchFilter',
      setCustomerFilterFiscalCode: 'dossiers/setCustomerFilterFiscalCode',
      resetPersonIdentityCard: 'dossiers/resetPersonIdentityCard',
      resetPersonPersons: 'dossiers/resetPersonPersons',
    }),
    clearFiscal() {
      this.form.searchFiscalCode = '';
      this.formDialog.searchFiscalCode = '';
    },
    clearName() {
      this.form.searchName = '';
      this.formDialog.searchName = '';
    },
    comfirmAddPerson() {
      this.showAddDialog = false;
      this.addCustomerDialog = true;
    },
    gotoPerson(person) {
      this.$utils.logobj('PERSON-DETAIL-PERSONS', 'gotoPerson', person);
      if (person && person.uuid) {
        window.open(`/persons/${person.uuid}`, '_blank');
      }
    },
    async comfirmAddCustomer() {
      this.$v.customerData.$touch();
      this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact');

      if (!this.$v.customerData.$error) {
        this.$utils.logobj('PRASSI-PERSON-CONTACT', 'submit person contact', this.customerData);
        const data = { item: this.customerData };
        this.personSelectedBlock = true;
        this.addCustomerDialog = false;
        const personRelatedRes = await this.createPersonRelated({ body: data });
        const personRelated = personRelatedRes.item;
        this.personSelected = personRelated;
        this.linkedCustomerId = personRelated.uuid;
        this.resetPersonPersons();
      } else {
        this.$q.notify(this.$t('promoterInsertLetter.cantSave'));
      }
    },
    addPersonDialog() {
      this.$utils.log('PERSON-DETAIL-PERSONS', 'addPersonDialog');
      this.resetCustomers();
      if (this.form.searchFiscalCode) {
        this.setCustomerSearchFilter(this.form.searchFiscalCode);
        this.setCustomerFilterFiscalCode(true);
      } else {
        this.setCustomerSearchFilter(this.form.searchName);
        this.setCustomerFilterFiscalCode(false);
      }
      this.fetchPersonsFilter();

      this.form = {
        // eslint-disable-next-line unicorn/no-null
        id: this.form.id,
        personId: this.personOldId,
        searchFiscalCode: this.formDialog.searchFiscalCode,
        searchName: this.formDialog.searchName,
        // eslint-disable-next-line unicorn/no-null
        personType: null,
        // eslint-disable-next-line unicorn/no-null
        personTypeKey: null,
        linkedPersonId: '',
        // eslint-disable-next-line unicorn/no-null
        linkedPerson: null,
      };
      this.showAddDialog = true;
    },
    searchOnDialog() {
      this.resetCustomers();
      if (this.formDialog.searchName) {
        this.setCustomerSearchFilter(this.formDialog.searchName);
        this.setCustomerFilterFiscalCode(false);
      } else {
        this.setCustomerSearchFilter(this.formDialog.searchFiscalCode);
        this.setCustomerFilterFiscalCode(true);
      }
      this.fetchPersonsFilter();
    },
    preSavePersonPersons(person) {
      this.showAddDialog = false;
      this.personSelectedBlock = true;
      this.personSelected = person;
      this.linkedCustomerId = person.uuid;
      this.resetPersonPersons();
    },
    deletePersonClicked() {
      this.form.linkedPerson = '';
      this.personSelectedBlock = false;
    },
    async triggerFromParent() {
      return {
        linkedCustomerId: this.linkedCustomerId,
      };
    },
  },
};
</script>

<style lang="stylus" scoped>
.disabled,
[disabled],
.disabled *,
[disabled] * {
  pointer-events: none;
}
.q-option-group--inline > div {
  margin-left: 50px;
}
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
