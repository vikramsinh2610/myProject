<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <prassi-person-person-list
        ref="personList"
        :persons="persons"
        :is-fetching="isFetching"
        :embedded="true"
        @loadMore="loadMorePersons"
        @viewClick="changePersonDialog"
        @detailClick="gotoPerson"
        @deletePerson="deletePersonClicked"
      />

      <div style="display: flex; margin-top: 1.5em">
        <prassi-standard-button
          class="q-mb-lg"
          label="Collega anagrafica"
          @click="addPersonDialog"
        />
        <prassi-standard-button
          class="q-mb-lg"
          label="Crea nuova anagrafica"
          @click="addCustomerDialog = true"
        />
      </div>

      <q-dialog v-model="showDelDialog">
        <q-card style="width: 800px">
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">
              {{
                $t('configurationHeader.confirmDeletePersonPerson') +
                ' ' +
                this.personToDelete.displayname
              }}
            </div>
          </q-card-section>
          <q-card-section>
            <prassi-standard-button
              color="red"
              :label="$t('configurationProduct.delete')"
              @click="deleteDocumentConfirmed"
            />
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showAddDialog">
        <q-card style="max-width: 800px; width: 800px">
          <q-card-section class="bg-secondary text-white q-mb-md">
            <div class="text-h6">{{ $t('configurationHeader.changePersonPerson') }}</div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-between q-my-xs">
              <q-select
                filled
                v-model="form.linkedPerson"
                use-input
                hide-selected
                fill-input
                input-debounce="700"
                :label="$t('customer.linkedPersonId')"
                :options="personsSelect"
                @filter="filterFn"
                @filter-abort="abortFilterFn"
                @virtual-scroll="onScroll"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey"> No results </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-select
                class="col-5"
                clearable
                v-model="form.personType"
                :label="$t('customer.personType')"
                :error-message="$t('person.error')"
                :error="$v.form.personType.$error"
                @blur="$v.form.personType.$touch"
                :options="personTypeList"
              />
            </div>
          </q-card-section>

          <q-card-section>
            <prassi-standard-button :label="$t('default.okButton')" @click="comfirmAddPerson" />
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
              <q-select
                class="col-6"
                clearable
                input-debounce="0"
                new-value-mode="add-unique"
                use-input
                v-model="customerData.name"
                :label="$t('customer.name')"
                :options="optionsNamesList"
                @filter="filterNames"
              />
              <q-input
                class="col-6"
                v-model="customerData.surname"
                type="text"
                :label="$t('customer.surname')"
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
                :error-message="errorMessage.mobilePhone"
                :error="$v.customerData.mobilePhone.$error"
                @blur="$v.customerData.mobilePhone.$touch"
              />
              <q-input
                class="col-6"
                v-model="customerData.housePhone"
                type="email"
                :error-message="errorMessage.housePhone"
                :error="$v.customerData.housePhone.$error"
                @blur="$v.customerData.housePhone.$touch"
              />
              <q-input
                class="col-6"
                v-model="customerData.workPhone"
                type="email"
                :error-message="errorMessage.workPhone"
                :error="$v.customerData.workPhone.$error"
                @blur="$v.customerData.workPhone.$touch"
              />
            </div>
          </q-card-section>
          <q-card-section>
            <prassi-standard-button :label="$t('default.addButton')" @click="comfirmAddCustomer" />
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { required, email, requiredIf } from 'vuelidate/lib/validators';
import PrassiPersonPersonList from '../../components/person/prassi-person-person-list';

export default {
  name: 'AnagraficaPersonPersons',
  components: {
    PrassiPersonPersonList,
  },
  props: {
    personId: {
      type: String,
      default: undefined,
    },
    personOldId: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      showAddDialog: false,
      showDelDialog: false,
      personToDelete: '',
      errorMessage: {
        mobilePhone: '',
        housePhone: '',
        workPhone: '',
      },
      form: {
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
      personTypeList: [
        {
          label: 'Assicurato',
          value: 1,
        },
        {
          label: 'Procuratore',
          value: 2,
        },
        {
          label: 'Beneficiario',
          value: 3,
        },
        {
          label: 'Titolare effettivo',
          value: 4,
        },
        {
          label: 'Legale rappresentante',
          value: 5,
        },
        {
          label: 'Contraente',
          value: 6,
        },
        {
          label: 'Beneficiario complementari',
          value: 7,
        },
        {
          label: 'Contraente EuropAssistance',
          value: 8,
        },
        {
          label: 'Assicurato EuropAssistance',
          value: 9,
        },
        {
          label: 'Commercialista',
          value: 10,
        },
        {
          label: 'Persona Collegata',
          value: 11,
        },
        {
          label: 'Referente Aziendale',
          value: 12,
        },
      ],
      // Create customer
      addCustomerDialog: false,
      customerData: {
        name: undefined,
        surname: '',
        email: '',
        mobilePhone: '',
        housePhone: '',
        workPhone: '',
      },
      optionsNamesList: this.namesList,
    };
  },
  validations: {
    form: {
      personType: {
        required,
      },
    },
    customerData: {
      name: {
        required,
      },
      surname: {
        required,
      },
      email: {
        required: requiredIf(function () {
          return (
            !this.customerData.mobilePhone &&
            !this.customerData.housePhone &&
            !this.customerData.workPhone
          );
        }),
        email,
      },
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
      housePhone: {
        checkFixedPhone(value) {
          if (!/^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,7}$/i.test(value) && value !== '') {
            this.errorMessage.housePhone = 'Il numero di telefono non è corretto.';
            return false;
          }
          this.errorMessage.housePhone = '';
          return true;
        },
      },
      workPhone: {
        checkFixedPhone(value) {
          if (!/^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,7}$/i.test(value) && value !== '') {
            this.errorMessage.workPhone = 'Il numero di telefono non è corretto.';
            return false;
          }
          this.errorMessage.workPhone = '';
          return true;
        },
      },
    },
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      person: (state) => state.dossiers.customer,
      persons: (state) => state.dossiers.personPersons.items,
      personsSelect: (state) => state.dossiers.customers.items,
      last: (state) => state.dossiers.personPersons.lastRecord,
      lastPersonsSelect: (state) => state.dossiers.customers.lastRecord,
      skipPersonsSelect: (state) => state.dossiers.customers.skip,
      isFetching: (state) => state.error.isFetching,
      // Create Customer
      names: (state) => state.dossiers.names,
    }),
    namesList() {
      return this.names ? this.names.map((el) => el.name) : [];
    },
  },
  methods: {
    ...mapActions({
      fetchPersonPersons: 'dossiers/fetchPersonPersons',
      fetchPersonsSelect: 'dossiers/fetchPersonsSelect',
      deletePersonPersons: 'dossiers/deletePersonPersons',
      savePersonPersons: 'dossiers/savePersonPersons',
      createCustomer: 'dossiers/createCustomer',
      savePerson: 'surveys/savePerson',
    }),
    ...mapMutations({
      resetCustomers: 'dossiers/resetCustomers',
      resetPersonPersons: 'dossiers/resetPersonPersons',
      setCustomerSearchFilter: 'dossiers/setCustomerSearchFilter',
    }),
    filterNames(value, update) {
      update(() => {
        const needle = value.toLowerCase();
        this.optionsNamesList = this.names
          .filter((v) => v.name.toLowerCase().includes(needle))
          .map((el) => el.name);
      });
    },
    // eslint-disable-next-line no-unused-vars
    onScroll({ index, to, ref }) {
      if (!this.lastPersonsSelect && index === to) {
        this.fetchPersonsSelect().then(() => {
          this.$nextTick(() => {
            this.personsPersonsList = this.personsSelect;
            ref.refresh();
          });
        });
      }
    },
    filterFn(value, update, abort) {
      this.$utils.log('PERSON-DETAIL-PERSONS', 'filterFn');
      this.resetCustomers();
      this.setCustomerSearchFilter(value);
      this.fetchPersonsSelect()
        .then(() => {
          update(() => {
            this.personsPersonsList = this.personsSelect;
          });
        })
        .catch(() => {
          abort();
        });
    },
    abortFilterFn() {
      // console.log('delayed filter aborted')
    },
    addPersonDialog() {
      this.$utils.log('PERSON-DETAIL-PERSONS', 'addPersonDialog');
      this.form = {
        // eslint-disable-next-line unicorn/no-null
        id: null,
        personId: this.personOldId,
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
    changePersonDialog(person) {
      this.$utils.logobj('PERSON-DETAIL-PERSONS', 'changePersonDialog', person);
      this.form = {
        ...person,
        personType: person.personType
          ? {
              label: person.personType.value,
              value: person.personType.key,
            }
          : { label: '', value: 0 },
        linkedPerson: person.linkedPersonId
          ? {
              label: person.displayname,
              value: person.linkedPersonId,
            }
          : { label: '', value: 0 },
      };
      this.showAddDialog = true;
    },
    comfirmAddPerson() {
      this.$v.form.$touch();
      this.$utils.logobj('PRASSI-DETAIL-IDENTITY', 'submit person identity');

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-DETAIL-IDENTITY', 'submit person identity', this.form);
        this.showAddDialog = false;

        this.savePersonPersons({
          ...this.form,
          personType: {
            value: this.form.personType.label,
            key: this.form.personType.value,
          },
          linkedPersonId: this.form.linkedPerson.value,
          personTypeKey: this.form.personType.value,
        }).then(() => {
          this.$q.notify({
            message: this.$t('configurationProduct.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
          this.resetPersonPersons();
          this.$refs.personList.forceScrolling();
        });
      } else {
        this.$q.notify(this.$t('promoterInsertLetter.cantSave'));
      }
    },
    deletePersonClicked(person) {
      this.$utils.logobj('PERSON-DETAIL-PERSONS', 'deletePersonClicked', person);
      this.personToDelete = person;
      this.showDelDialog = true;
    },
    deleteDocumentConfirmed() {
      this.$utils.log('PERSON-DETAIL-PERSONS', 'deleteDocumentConfirmed');
      this.deletePersonPersons(this.personToDelete).then(() => {
        this.$q.notify({
          message: this.$t('default.deleteOk'),
          color: 'secondary',
          timeout: 300,
        });
        this.resetPersonPersons();
      });
      this.personToDelete = '';
      this.showDelDialog = false;
    },
    gotoPerson(person) {
      this.$utils.logobj('PERSON-DETAIL-PERSONS', 'gotoPerson', person);
      window.open(`/persons/${person.uuid}`, '_blank');
    },
    // eslint-disable-next-line no-unused-vars
    loadMorePersons({ index, done }) {
      if (this.last || this.error) {
        this.$refs.personList.stopScrolling();
      } else {
        this.$utils.logobj('PERSON-DETAIL-PERSONS', 'loadMorePersons', index);
        this.fetchPersonPersons(this.personId).finally(() => done());
      }
    },

    comfirmAddCustomer() {
      this.$utils.logobj('CUSTOMERS-DETAIL', 'comfirmAddCustomer', this.customerData);
      this.$v.customerData.$touch();

      if (!this.$v.customerData.$error) {
        this.$utils.logobj('CUSTOMERS-DETAIL', 'comfirmAddCustomer', this.customerData);
        this.executeAddCustomer();
        this.addCustomerDialog = false;
      } else {
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    executeAddCustomer() {
      this.$utils.log('CUSTOMER-DETAIL', 'executeAddCustomer');

      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;

      const data = {
        ...this.customerData,
        isCompany: false,
        address: {},
        legalAddress: {},
      };

      this.savePerson(data)
        .then(() => {
          this.$q.notify({
            message: this.$t('customer.notifyCustomerAdded'),
            color: 'secondary',
            timeout: 300,
          });
          // this.viewCustomerLegacy(this.customer._id);
        })
        .finally(() => {
          this.pendingList = false;
          this.pendingSummary = false;
          this.pendingSummaryPrevious = false;
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 960px
  max-width fit-content
.q-card
  border-radius 4px
  border solid 1px $card-border
  min-height 280px
</style>
