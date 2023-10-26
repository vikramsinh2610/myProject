<template>
  <div class="fill-available column">
    <prassi-person-person-list
      ref="personList"
      :persons="persons"
      :is-fetching="isFetching"
      @loadMore="loadMorePersons"
      @viewClick="changePersonDialog"
      @detailClick="gotoPerson"
      @deletePerson="deletePersonClicked"
    />

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
              :label="$t('customer.linkedCompanyPersonId')"
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

    <q-page-sticky
      v-if="$user.roleID >= 7"
      position="bottom-right"
      :offset="[18, 18]"
      class="first-menu"
    >
      <q-fab icon="fa fa-chevron-up" active-icon="fa fa-times" direction="up" color="secondary">
        <q-fab-action @click="addPersonDialog" color="secondary" icon="fa fa-plus-white">
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('customer.addPerson') }}
          </q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import PrassiPersonPersonList from '../components/person/prassi-person-person-list';

export default {
  name: 'PersonsDetailCompanies',
  components: {
    PrassiPersonPersonList,
  },
  data() {
    return {
      showAddDialog: false,
      showDelDialog: false,
      personToDelete: '',
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
    };
  },
  validations: {
    form: {
      personType: {
        required,
      },
    },
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      person: (state) => state.dossiers.customer,
      persons: (state) => state.dossiers.personCompanies.items,
      personsSelect: (state) => state.dossiers.customers.items,
      last: (state) => state.dossiers.personCompanies.lastRecord,
      lastPersonsSelect: (state) => state.dossiers.customers.lastRecord,
      skipPersonsSelect: (state) => state.dossiers.customers.skip,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  methods: {
    ...mapActions({
      fetchPersonPersons: 'dossiers/fetchPersonCompanies',
      fetchPersonsSelect: 'dossiers/fetchPersonsSelectCompany',
      deletePersonPersons: 'dossiers/deletePersonCompanies',
      savePersonPersons: 'dossiers/savePersonCompanies',
    }),
    ...mapMutations({
      resetCustomers: 'dossiers/resetCustomers',
      resetPersonPersons: 'dossiers/resetPersonCompanies',
      setCustomerSearchFilter: 'dossiers/setCustomerSearchFilter',
    }),
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
        personId: this.person.id,
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
      this.$router.push(`/persons/${person.uuid}`);
    },
    // eslint-disable-next-line no-unused-vars
    loadMorePersons({ index, done }) {
      if (this.last || this.error) {
        this.$refs.personList.stopScrolling();
      } else {
        this.$utils.logobj('PERSON-DETAIL-PERSONS', 'loadMorePersons', index);
        this.fetchPersonPersons(this.$route.params.id).finally(() => done());
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 960px
  max-width fit-content

.first-menu
  bottom 70px
</style>
