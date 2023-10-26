<template>
  <div class="row no-wrap">
    <q-stepper
      class="no-shadow q-mr-sm min-w-260"
      style="width: 260px"
      vertical
      header-nav
      ref="stepper"
      v-model="personStep"
      active-color="secondary"
    >
      <q-step
        v-for="section in groupedSections"
        :key="section.id"
        :name="section.name"
        :title="section.title"
        :class="sectionCompletionStatus(section.name).color"
        :icon="sectionCompletionStatus(section.name).icon"
      />
    </q-stepper>

    <prassi-person-legal-data
      class="col"
      v-if="personStep === 'legalContact'"
      :read-only="readOnly"
      :person="person"
      :is-fetching="isFetching"
      @changeData="savePersonClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-legal-address
      class="col"
      v-if="personStep === 'legalAddress'"
      :read-only="readOnly"
      :person="person"
      :is-fetching="isFetching"
      @changeData="savePersonClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-vat-card
      class="col"
      v-if="personStep === 'vat'"
      :read-only="readOnly"
      :person="person"
      :is-fetching="isFetching"
      :precontractual="precontractual"
      @changeData="savePersonClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-search-legal-person
      class="col"
      v-if="personStep === 'searchLegal'"
      :person="person"
      :person-persons="personPersons"
      :is-fetching="isFetching"
      :legal-person="personRelated"
      :precontractual="precontractual"
      @changeData="savePersonClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-anagrafica
      class="col"
      v-if="personStep === 'contact'"
      :read-only="readOnly || !linkedPersonId"
      :enable="linkedPersonId"
      :person="personRelated"
      :is-fetching="isFetching"
      @changeData="savePersonRelatedClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-fiscal
      class="col"
      v-if="personStep === 'fiscal'"
      :read-only="readOnly || !linkedPersonId"
      :person="personRelated"
      :is-fetching="isFetching"
      @changeData="savePersonRelatedClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-address
      class="col"
      v-if="personStep === 'address'"
      :read-only="readOnly || !linkedPersonId"
      :person="personRelated"
      :is-fetching="isFetching"
      @changeData="savePersonRelatedClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-identity-card
      class="col"
      v-if="personStep === 'identity'"
      :read-only="readOnly || !linkedPersonId"
      :precontractual="precontractualRelated"
      :identity-card="personIdentityCard"
      :is-fetching="isFetching"
      @changeData="saveIdentityCardClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-legal-fiscal-card
      class="col"
      v-if="personStep === 'fiscalCard'"
      :read-only="readOnly || !linkedPersonId"
      :person="personRelated"
      :is-fetching="isFetching"
      :precontractual="precontractualRelated"
      @changeData="savePersonRelatedClick"
      @changeDataRelated="savePrecontractualRelatedClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-mandate-company
      class="col"
      v-if="personStep === 'mandate'"
      :read-only="readOnly"
      :person="person"
      :is-fetching="isFetching"
      :precontractual="precontractual"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-privacy
      class="col"
      v-if="personStep === 'privacy'"
      :read-only="readOnly"
      :is-fetching="isFetching"
      :precontractual="precontractual"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-otp-company
      class="col"
      v-if="personStep === 'otp'"
      :read-only="readOnly || disableSign"
      :person="person"
      :is-fetching="isFetching"
      :legal-person="personRelated"
      :precontractual="precontractual"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-sign-documents
      class="col"
      v-if="personStep === 'sign-documents'"
      :read-only="readOnly"
      :person="person"
      :is-fetching="isFetching"
      :precontractual="precontractual"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-download-document
      class="col"
      v-if="personStep === 'download-document'"
      :person="person"
      :precontractual="precontractual"
      :is-fetching="isFetching"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <q-dialog v-model="showDelPersonDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            {{ $t('person.confirmDelete') }}
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button
            color="red"
            :label="$t('configurationProduct.delete')"
            @click="deletePersonConfirmed"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiPersonAnagrafica from './prassi-person-anagrafica';
import PrassiPersonLegalData from './prassi-person-legal-data';
import PrassiPersonFiscal from './prassi-person-fiscal';
import PrassiPersonAddress from './prassi-person-address';
import PrassiPersonIdentityCard from './prassi-person-identity-card';
import PrassiPersonLegalFiscalCard from './prassi-legal-person-fiscal-card';
import PrassiPersonVatCard from './prassi-person-vat-card';
import PrassiPersonMandateCompany from './prassi-person-mandate-company';
import PrassiPersonPrivacy from './prassi-person-privacy';
import PrassiPersonOtpCompany from './prassi-person-otp-company';
import PrassiPersonSearchLegalPerson from './prassi-person-search-legal-person';
import PrassiPersonLegalAddress from './prassi-person-legal-address';
import PrassiPersonSignDocuments from './prassi-person-sign-documents';
import PrassiPersonDownloadDocument from './prassi-person-download-document';

export default {
  name: 'PrassiPersonLegalEditPrecontractual',
  components: {
    PrassiPersonIdentityCard,
    PrassiPersonAddress,
    PrassiPersonAnagrafica,
    PrassiPersonFiscal,
    PrassiPersonVatCard,
    PrassiPersonLegalFiscalCard,
    PrassiPersonMandateCompany,
    PrassiPersonPrivacy,
    PrassiPersonSignDocuments,
    PrassiPersonLegalData,
    PrassiPersonLegalAddress,
    PrassiPersonOtpCompany,
    PrassiPersonDownloadDocument,
    PrassiPersonSearchLegalPerson,
  },
  data() {
    return {
      personStep: 'legalContact',
      showDelPersonDialog: false,
      linkedPersonId: '',
      groupedSections: [
        {
          id: 1,
          title: this.$t('personPrecontractual.legalData'),
          name: 'legalContact',
          readOnly: false,
        },
        {
          id: 2,
          title: this.$t('personPrecontractual.companyLegalAddress'),
          name: 'legalAddress',
          readOnly: false,
        },
        {
          id: 3,
          title: this.$t('personPrecontractual.companyVat'),
          name: 'vat',
          readOnly: false,
        },
        {
          id: 4,
          title: this.$t('personPrecontractual.lookLegalPerson'),
          name: 'searchLegal',
          readOnly: true,
        },
        {
          id: 5,
          title: this.$t('personPrecontractual.legalPersonData'),
          name: 'contact',
          readOnly: false,
        },
        {
          id: 6,
          title: this.$t('personPrecontractual.legalFiscal'),
          name: 'fiscal',
          readOnly: false,
        },
        {
          id: 7,
          title: this.$t('personPrecontractual.legalPersonAddress'),
          name: 'address',
          readOnly: false,
        },
        {
          id: 8,
          title: this.$t('personPrecontractual.legalIdentityCard'),
          name: 'identity',
          readOnly: false,
        },
        {
          id: 9,
          title: this.$t('personPrecontractual.legalFiscalCode'),
          name: 'fiscalCard',
          readOnly: false,
        },
        {
          id: 10,
          title: 'Privacy',
          name: 'privacy',
          readOnly: false,
        },
        {
          id: 11,
          title: 'Mandato',
          name: 'mandate',
          readOnly: false,
        },
        {
          id: 12,
          title: 'Adesione OTP',
          name: 'otp',
          readOnly: false,
        },
        {
          id: 13,
          title: 'Firma Documenti',
          name: 'sign-documents',
          readOnly: false,
        },
        {
          id: 14,
          title: 'Download documenti',
          name: 'download-document',
          readOnly: false,
        },
      ],
      disableSign: true,
      stepper: [],
      readOnly: true,
      personId: '',
      precontractual: {
        personId: '',
        documentId: undefined,
        minimal: undefined,
        marketing: undefined,
        profile: undefined,
        fiscalCodeFile: {},
      },
      identityCard: {},
      precontractualPerson: {},
      legalPerson: {},
      personPersons: {},
    };
  },
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async mounted() {
    if (!this.$route.params) return;
    await this.fetchPersonPrecontractual(this.$route.params.precontractualId);

    const precontractual = await this.fetchPrecontractual(this.$route.params.precontractualId);
    if (precontractual.item.stepperStatus && precontractual.item.stepperStatus.stepper) {
      this.stepper = precontractual.item.stepperStatus.stepper;
    }

    this.precontractual = precontractual.item;
    // eslint-disable-next-line vue/no-mutating-props
    this.personId = precontractual.item.personId;
    this.readOnly = precontractual.item.status === 1;
    this.linkedPersonId = precontractual.item.linkedPersonId;
    if (this.readOnly) {
      this.groupedSections = this.groupedSections.filter((el) => el.readOnly === false);
    }
    const elementUncompleted = this.stepper.filter(({ status }) => status === 'uncompleted');
    this.disableSign = !(
      this.stepper.length >= this.groupedSections.length - 3 && elementUncompleted.length <= 0
    );
    if (this.stepper) {
      const elementCompleted = this.stepper.filter(({ status }) => status === 'completed');
      // eslint-disable-next-line no-restricted-syntax
      for (const section of this.groupedSections) {
        const isElementCompleted = elementCompleted.find(({ name }) => name === section.name);
        if (!isElementCompleted) {
          this.personStep = section.name;
          break;
        }
      }
    }
    const customerId = this.$route.params.id;
    this.resetPersonPersons();
    this.resetCustomerRelated();
    this.resetPersonIdentityCard();
    // eslint-disable-next-line unicorn/prefer-ternary
    if (this.person.isCompany) {
      if (precontractual.item.linkedPersonId && precontractual.item.status) {
        const res = await this.fetchPersonRelatedByPersonId(precontractual.item.linkedPersonId);
        // eslint-disable-next-line prefer-destructuring
        this.personPersons = {};
        const precontractualPerson = await this.fetchPrecontractualRelated(res.item.uuid);
        this.precontractualPerson = precontractualPerson.item;
        await this.fetchIdentityCard(this.precontractualPerson.id);
      } else {
        this.setDossiersFilterLegalPerson(true);
        await this.fetchPersonPersons(customerId);
        if (this.persons.length) {
          const precontractualPerson = await this.fetchPrecontractualRelated(this.persons[0].uuid);
          this.precontractualPerson = precontractualPerson.item;
          const res = await this.fetchPersonRelated(precontractualPerson.item.id);
          // eslint-disable-next-line prefer-destructuring
          this.personPersons = {
            ...this.persons[0],
            roleId: res.item.roleId,
            networkHierarchy: res.item.networkHierarchy,
            promoterName: res.item.promoterName,
          };
          await this.fetchIdentityCard(this.precontractualPerson.id);
        }
      }
    }
  },
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    person: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState({
      persons: (state) => state.dossiers.personPersons.items,
      personRelated: (state) => state.dossiers.customerRelated,
      precontractualRelated: (state) => state.dossiers.precontractualRelated,
      personIdentityCard: (state) => state.dossiers.personIdentityCard,
    }),
  },
  methods: {
    ...mapActions({
      savePerson: 'dossiers/savePerson',
      savePersonRelated: 'dossiers/savePersonRelated',
      fetchPersonPrecontractual: 'dossiers/fetchPersonPrecontractual',
      fetchPrecontractual: 'dossiers/fetchPrecontractual',
      fetchPrecontractualRelated: 'dossiers/fetchPrecontractualRelated',
      savePrecontractual: 'dossiers/savePrecontractual',
      savePrecontractualRelated: 'dossiers/savePrecontractualRelated',
      fetchPersonPersons: 'dossiers/fetchPersonPersons',
      fetchIdentityCard: 'dossiers/fetchIdentityCard',
      fetchPersonRelated: 'dossiers/fetchPersonRelated',
      fetchPersonRelatedByPersonId: 'dossiers/fetchPersonRelatedByPersonId',
      saveIdentityCard: 'dossiers/saveIdentityCard',
      deletePerson: 'dossiers/deletePerson',
    }),
    ...mapMutations({
      resetPersonPersons: 'dossiers/resetPersonPersons',
      resetCustomerRelated: 'dossiers/resetCustomerRelated',
      resetPersonIdentityCard: 'dossiers/resetPersonIdentityCard',
      setDossiersFilterLegalPerson: 'dossiers/setDossiersFilterLegalPerson',
    }),
    sectionCompletionStatus(sectionName) {
      if (!this.stepper) return { color: '', icon: 'fa fa-check' };
      const element = this.stepper.find(({ name }) => name === sectionName);
      if (!element) return { color: '', icon: 'fa fa-check' };

      if (element.status === 'completed') {
        return { color: 'step-positive', icon: 'fa fa-check' };
      }
      if (element.status === 'uncompleted') {
        return { color: 'step-negative', icon: 'fa fa-times' };
      }
      return { color: '', icon: 'fa fa-check' };
    },
    addNewPracticeClick() {
      this.$utils.log('PRASSI-PERSON-EDIT', 'addNewPracticeClick');
      const { id } = this.$route.params;
      const msId = id.split('-');
      const msId1 =
        msId[0].slice(6, 8) + msId[0].slice(4, 6) + msId[0].slice(2, 4) + msId[0].slice(0, 2);
      const msId2 = msId[1].slice(2, 4) + msId[1].slice(0, 2);
      const msId3 = msId[2].slice(2, 4) + msId[2].slice(0, 2);
      window.open(
        `${this.$env.legacyBaseUrl}/#/nuovaProposta/${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}`,
        '_self',
      );
    },
    deletePersonClick() {
      this.$utils.log('PRASSI-PERSON-EDIT', 'deletePersonClick');
      this.showDelPersonDialog = true;
    },
    deletePersonConfirmed() {
      this.$utils.logobj('PRASSI-PERSON-EDIT', 'deletePersonConfirmed', this.person.id);
      this.deletePerson({
        personId: this.person.id,
      }).then(() => {
        this.$utils.log('PRASSI-PERSON-EDIT', 'deletePerson');
        this.$nextTick().then(() => {
          this.$q.notify({
            message: this.$t('person.deletedOk'),
            color: 'secondary',
            timeout: 300,
          });

          this.$router.push('/persons');
        });
      });
    },

    // eslint-disable-next-line sonarjs/cognitive-complexity
    savePersonClick(item) {
      if (this.readOnly) {
        return;
      }
      this.$utils.logobj('PRASSI-PERSON-EDIT', 'savePersonClick item', item);
      this.savePerson({
        body: item,
        // eslint-disable-next-line sonarjs/no-identical-functions
      }).then(async () => {
        this.$utils.log('PRASSI-PERSON-EDIT', 'savePersonClick');
        this.$q.notify({
          message: this.$t('person.savedOk'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },

    // eslint-disable-next-line sonarjs/cognitive-complexity
    savePersonAndVisuraClick(item) {
      if (this.readOnly) {
        return;
      }
      this.$utils.logobj('PRASSI-PERSON-EDIT', 'savePersonAndVisuraClick item', item);
      this.savePerson({
        body: item,
        // eslint-disable-next-line sonarjs/no-identical-functions
      }).then(async () => {
        this.saveIdentityCard({
          body: {
            documentId: undefined,
            personId: item.item.id,
            attachmentObj: {
              attachmentId: item.vatItem.fiscalCodeFile.attachmentId,
              displayName: item.vatItem.fiscalCodeFile.displayName,
            },
            documentNumber: undefined,
            issueDate: undefined,
            expiryDate: undefined,
            issueAuthority: { value: 'Comune', key: 1 },
            issueCity: undefined,
            issueRegion: undefined,
            issueCountry: undefined,
            documentType: { key: 4, value: 'visura camerale' },
          },
          // eslint-disable-next-line sonarjs/no-identical-functions
        }).then(async () => {
          this.$utils.log('PRASSI-PERSON-EDIT', 'savePersonAndVisuraClick');
          this.$q.notify({
            message: this.$t('person.savedOk'),
            color: 'secondary',
            timeout: 300,
          });
        });
      });
    },

    // eslint-disable-next-line sonarjs/cognitive-complexity
    savePersonRelatedClick(item) {
      if (this.readOnly) {
        return;
      }
      if (!this.precontractual.linkedPersonId) {
        this.$q.notify({
          message: 'Completare lo step cerca Legale Rappresentante',
          color: 'red',
          timeout: 400,
        });
        return;
      }
      this.$utils.logobj('PRASSI-PERSON-EDIT', 'savePersonClick item', item);
      this.savePersonRelated({
        body: item,
        // eslint-disable-next-line sonarjs/no-identical-functions
      }).then(async () => {
        this.$utils.log('PRASSI-PERSON-EDIT', 'savePersonClick');
        this.$q.notify({
          message: this.$t('person.savedOk'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    saveIdentityCardClick(item) {
      if (this.readOnly) {
        return;
      }
      this.$utils.logobj('PRASSI-PERSON-EDIT', 'saveIdentityCardClick item', item);
      this.saveIdentityCard({
        body: item.item,
        // eslint-disable-next-line sonarjs/no-identical-functions
      }).then(async () => {
        this.$utils.logobj('PRASSI-PERSON-EDIT', 'saveIdentityCardClick then', this.persons);
        const precontractualPerson = await this.fetchPrecontractualRelated(this.persons[0].uuid);
        this.precontractualPerson = precontractualPerson.item;
        await this.fetchIdentityCard(this.precontractualPerson.id);
        this.$q.notify({
          message: this.$t('person.savedOk'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    // eslint-disable-next-line sonarjs/cognitive-complexity
    savePrecontractualClick(item) {
      if (this.readOnly) {
        return;
      }
      const i = this.stepper.findIndex((_element) => _element.name === item.stepper.name);
      if (i > -1) this.stepper[i] = item.stepper;
      else this.stepper.push(item.stepper);

      if (item.data) {
        this.precontractual = { ...this.precontractual, ...item.data };
      }
      const elementUncompleted = this.stepper.filter(({ status }) => status === 'uncompleted');
      this.disableSign = !(
        this.stepper.length >= this.groupedSections.length - 3 && elementUncompleted.length <= 0
      );

      this.readOnly = this.precontractual.status === 1;
      this.linkedPersonId = this.precontractual.linkedPersonId;

      this.savePrecontractual({
        body: {
          ...this.precontractual,
          stepperStatus: { stepper: this.stepper },
        },
      });
      this.$utils.logobj('PRASSI-PERSON-EDIT', 'savePersonClick Stepper item', item);
    },
    savePrecontractualRelatedClick(item) {
      if (!this.precontractual.linkedPersonId) {
        this.$q.notify({
          message: 'Completare lo step cerca Legale Rappresentante',
          color: 'red',
          timeout: 300,
        });
        return;
      }
      if (item.data && item.data.fiscalCodeFile) {
        this.savePrecontractualRelated({
          body: {
            personId: this.personRelated.id,
            id: this.precontractualRelated.id,
            fiscalCodeFile: item.data.fiscalCodeFile,
          },
        }).then(async () => {
          const precontractualPerson = await this.fetchPrecontractualRelated(this.persons[0].uuid);
          this.precontractualPerson = precontractualPerson.item;
        });
        this.$utils.logobj('PRASSI-PERSON-EDIT', 'savePersonClick Stepper item', item);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-stepper
  background-color white
  border-radius 4px
  border solid 1px $card-border
</style>
