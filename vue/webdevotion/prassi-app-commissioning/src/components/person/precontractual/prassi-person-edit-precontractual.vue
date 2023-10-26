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

    <prassi-person-anagrafica
      class="col"
      v-if="personStep === 'contact'"
      :read-only="readOnly"
      :person="person"
      :is-fetching="isFetching"
      @changeData="savePersonClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-fiscal
      class="col"
      v-if="personStep === 'fiscal'"
      :read-only="readOnly"
      :person="person"
      :is-fetching="isFetching"
      @changeData="savePersonClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-address
      class="col"
      v-if="personStep === 'address'"
      :read-only="readOnly"
      :person="person"
      :is-fetching="isFetching"
      :precontractual="precontractual"
      @changeData="savePersonClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-identity-card
      class="col"
      v-if="personStep === 'identity'"
      :read-only="readOnly"
      :precontractual="precontractual"
      :is-fetching="isFetching"
      :identity-card="personIdentityCard"
      @changeData="saveIdentityCardClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-fiscal-card
      class="col"
      v-if="personStep === 'fiscalCard'"
      :read-only="readOnly"
      :is-fetching="isFetching"
      :person="person"
      :precontractual="precontractual"
      @changeData="savePersonClick"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-mandate
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
      :precontractual="precontractual"
      :is-fetching="isFetching"
      @changePrecontractual="savePrecontractualClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-otp
      class="col"
      v-if="personStep === 'otp'"
      :read-only="readOnly || disableSign"
      :person="person"
      :is-fetching="isFetching"
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
      :read-only="readOnly"
      :is-fetching="isFetching"
      :person="person"
      :precontractual="precontractual"
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
import PrassiPersonFiscal from './prassi-person-fiscal';
import PrassiPersonAddress from './prassi-person-address';
import PrassiPersonIdentityCard from './prassi-person-identity-card';
import PrassiPersonFiscalCard from './prassi-person-fiscal-card';
import PrassiPersonMandate from './prassi-person-mandate';
import PrassiPersonPrivacy from './prassi-person-privacy';
import PrassiPersonOtp from './prassi-person-otp';
import PrassiPersonSignDocuments from './prassi-person-sign-documents';
import PrassiPersonDownloadDocument from './prassi-person-download-document';

export default {
  name: 'PrassiPersonEditPrecontractual',
  components: {
    PrassiPersonIdentityCard,
    PrassiPersonAddress,
    PrassiPersonAnagrafica,
    PrassiPersonFiscal,
    PrassiPersonFiscalCard,
    PrassiPersonMandate,
    PrassiPersonPrivacy,
    PrassiPersonOtp,
    PrassiPersonSignDocuments,
    PrassiPersonDownloadDocument,
  },
  data() {
    return {
      personStep: 'contact',
      showDelPersonDialog: false,
      readOnly: true,
      disableSign: true,
      groupedSections: [
        {
          id: 1,
          title: this.$t('personPrecontractual.personData'),
          name: 'contact',
        },
        {
          id: 2,
          title: this.$t('personPrecontractual.fiscal'),
          name: 'fiscal',
        },
        {
          id: 3,
          title: this.$t('personPrecontractual.address'),
          name: 'address',
        },
        {
          id: 4,
          title: this.$t('personPrecontractual.identityCard'),
          name: 'identity',
        },
        {
          id: 5,
          title: this.$t('personPrecontractual.fiscalCode'),
          name: 'fiscalCard',
        },
        {
          id: 6,
          title: 'Privacy',
          name: 'privacy',
        },
        {
          id: 7,
          title: 'Mandato',
          name: 'mandate',
        },
        {
          id: 8,
          title: 'Adesione OTP',
          name: 'otp',
        },
        {
          id: 9,
          title: 'Firma Documenti',
          name: 'sign-documents',
        },
        {
          id: 10,
          title: 'Download documenti',
          name: 'download-document',
        },
      ],
      stepper: [],
      personId: '',
      precontractual: {
        personId: '',
        documentId: undefined,
        issueDate: '',
        expiryDate: '',
        documentType: {},
        minimal: undefined,
        marketing: undefined,
        profile: undefined,
        fiscalCodeFile: {},
      },
      identityCard: {},
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
    this.resetPersonIdentityCard();
    await this.fetchIdentityCard(this.precontractual.id);
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
      personIdentityCard: (state) => state.dossiers.personIdentityCard,
    }),
  },
  methods: {
    ...mapActions({
      fetchPersonPrecontractual: 'dossiers/fetchPersonPrecontractual',
      savePerson: 'dossiers/savePerson',
      fetchPrecontractual: 'dossiers/fetchPrecontractual',
      savePrecontractual: 'dossiers/savePrecontractual',
      saveIdentityCard: 'dossiers/saveIdentityCard',
      fetchIdentityCard: 'dossiers/fetchIdentityCard',
      deletePerson: 'dossiers/deletePerson',
    }),
    ...mapMutations({
      resetPersonIdentityCard: 'dossiers/resetPersonIdentityCard',
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
    saveIdentityCardClick(item) {
      if (this.readOnly) {
        return;
      }
      this.$utils.logobj('PRASSI-PERSON-EDIT', 'saveIdentityCardClick item', item);
      this.saveIdentityCard({
        body: item.item,
        // eslint-disable-next-line sonarjs/no-identical-functions
      }).then(async () => {
        const precontractualPerson = await this.fetchPrecontractual(
          this.$route.params.precontractualId,
        );
        this.precontractual = precontractualPerson.item;
        await this.fetchIdentityCard(this.precontractual.id);
        this.$utils.log('PRASSI-PERSON-EDIT', 'savePersonClick');
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

      this.savePrecontractual({
        body: {
          ...this.precontractual,
          stepperStatus: { stepper: this.stepper },
        },
      });
      this.$utils.logobj('PRASSI-PERSON-EDIT', 'savePersonClick Stepper item', item);
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
