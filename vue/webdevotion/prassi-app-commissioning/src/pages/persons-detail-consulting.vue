<template>
  <div>
    <div v-if="isShowingAdequacySurvey">
      <consulting-adequacy-survey :on-save="onAdequacySurveySave" />
    </div>

    <div
      v-if="ready && !isShowingAdequacySurvey"
      class="row no-wrap"
      style="margin-bottom: 6em; width: 100%"
    >
      <q-stepper
        vertical
        header-nav
        style="width: 260px"
        active-color="secondary"
        v-model="currentSection"
        class="no-shadow q-mr-sm min-w-260"
      >
        <q-step
          v-for="section in sections"
          :key="section.id"
          :name="section.id"
          :title="section.name.toUpperCase()"
          :class="{
            hidden: !sectionIsVisible(section),
            [sectionCompletionStatus(section).color]: true,
          }"
          :icon="sectionCompletionStatus(section).icon"
          :disable="!canNavigateWithStepper()"
        >
        </q-step>
      </q-stepper>

      <q-card
        inline
        flat
        color="white"
        class="text-primary col q-card q-card--flat no-shadow q-card q-card--flat no-shadow"
      >
        <q-card-section>
          <div class="p-pc-title-section" style="text-transform: uppercase">
            {{ getSection(currentSection).name }}
          </div>

          <consulting-adequacy-survey-step
            :show-adequacy-survey="() => (isShowingAdequacySurvey = true)"
            ref="adequacy-survey"
            v-if="currentSection == 'adequacy-survey'"
          />
          <consulting-pick-product
            ref="pick-product"
            v-if="currentSection == 'pick-product'"
            :close-consulting="saveAndClose"
          />
          <consulting-proposal-number
            ref="proposal-number"
            v-if="currentSection == 'proposal-number'"
          />
          <consulting-promoter-info ref="promoter-info" v-if="currentSection == 'promoter-info'" />
          <consulting-promoter-address
            ref="promoter-address"
            v-if="currentSection == 'promoter-address'"
          />
          <consulting-distribution-info
            ref="distribution-info"
            v-if="currentSection == 'distribution-info'"
          />
          <consulting-sepa-debit ref="sepa-debit" v-if="currentSection == 'sepa-debit'" />
          <consulting-third-payer ref="third-payer" v-if="currentSection == 'third-payer'" />
          <consulting-sepa-customer-info
            ref="sepa-customer-info"
            v-if="currentSection == 'sepa-customer-info'"
          />
          <consulting-third-payer-document
            ref="third-payer-document"
            v-if="currentSection == 'third-payer-document'"
          />
          <consulting-sepa-iban-info
            ref="sepa-iban-info"
            v-if="currentSection == 'sepa-iban-info'"
          />
          <consulting-end-extra-info
            ref="end-extra-info"
            v-if="currentSection == 'end-extra-info'"
          />

          <div v-if="!isReadyToSign && currentSection.startsWith('sign')">
            <p>Completa tutti gli step prima di procedere alla firma digitale.</p>
          </div>
          <div v-if="isReadyToSign">
            <consulting-create-pdf
              ref="sign-create-pdf"
              v-if="currentSection == 'sign-create-pdf'"
            />
            <consulting-sign
              type="promoter"
              key="sign-promoter"
              ref="sign-promoter"
              v-if="currentSection == 'sign-promoter'"
            />
            <consulting-sign
              type="customer"
              key="sign-customer"
              ref="sign-customer"
              v-if="currentSection == 'sign-customer'"
            />
            <consulting-sign
              type="third-payer"
              key="sign-third-payer"
              ref="sign-third-payer"
              v-if="currentSection == 'sign-third-payer'"
            />
            <consulting-download-pdf
              ref="sign-download-pdf"
              v-if="currentSection == 'sign-download-pdf'"
            />
          </div>

          <div v-if="canShowNextSection()" style="display: flex; margin-top: 1.5em">
            <prassi-standard-button
              v-if="!isLastSection"
              class="q-mb-lg"
              label="Successivo"
              @click="goToNextSection()"
            />

            <prassi-standard-button
              class="q-mb-lg"
              label="Salva e Chiudi"
              @click="saveAndClose()"
            />
          </div>
        </q-card-section>
        <q-inner-loading :showing="isFetching">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import ConsultingAdequacySurvey from '../components/consulting/adequacy-survey';
import ConsultingAdequacySurveyStep from '../components/consulting/adequacy-survey-step';
import ConsultingPickProduct from '../components/consulting/pick-product';
import ConsultingProposalNumber from '../components/consulting/proposal-number';
import ConsultingPromoterInfo from '../components/consulting/promoter-info';
import ConsultingPromoterAddress from '../components/consulting/promoter-address';
import ConsultingDistributionInfo from '../components/consulting/distribution-info';
import ConsultingSepaCustomerInfo from '../components/consulting/sepa-customer-info';
import ConsultingSepaDebit from '../components/consulting/sepa-debit';
import ConsultingThirdPayer from '../components/consulting/third-payer';
import ConsultingThirdPayerDocument from '../components/consulting/third-payer-document';
import ConsultingSepaIbanInfo from '../components/consulting/sepa-iban-info';
import ConsultingEndExtraInfo from '../components/consulting/end-extra-info';
import ConsultingCreatePdf from '../components/consulting/create-pdf';
import ConsultingSign from '../components/consulting/consulting-sign';
import ConsultingDownloadPdf from '../components/consulting/consulting-download-pdf';

export default {
  name: 'PersonDetailConsulting',
  components: {
    ConsultingAdequacySurvey,
    ConsultingAdequacySurveyStep,
    ConsultingPickProduct,
    ConsultingProposalNumber,
    ConsultingPromoterInfo,
    ConsultingPromoterAddress,
    ConsultingDistributionInfo,
    ConsultingSepaDebit,
    ConsultingThirdPayer,
    ConsultingThirdPayerDocument,
    ConsultingSepaCustomerInfo,
    ConsultingSepaIbanInfo,
    ConsultingEndExtraInfo,
    ConsultingCreatePdf,
    ConsultingSign,
    ConsultingDownloadPdf,
  },

  async mounted() {
    const { resultId } = this.$route.params;
    await this.fetchConsultingResult({ resultId });
    this.computeIsReadyToSign();
    this.computeConsultingType();
    this.computeInquiryResultId();

    // reset adequacy survey
    // eslint-disable-next-line unicorn/no-useless-undefined
    this.setAdequacySurveyResultId(undefined);

    await this.fetchSingleSurveyResult({ resultId: this.inquiryResultId });
    this.ready = true;
  },

  computed: {
    ...mapState({
      token: (state) => state.login.token,
      person: (state) => state.dossiers.customer,
      survey: (state) => state.surveys.survey,
      consulting: (state) => state.consulting.result,
      adequacyResultId: (state) => state.consulting.adequacyResultId,
      isFetching: (state) => state.error.isFetching,
    }),

    isLastSection() {
      return this.sections.at(-1).id === this.currentSection;
    },

    procedureCompleted() {
      return this.consulting?.signature?.procedureCompleted || this.consulting?.product?.isClosed;
    },
  },

  methods: {
    ...mapActions({
      // fetchPerson: 'surveys/fetchPerson',
      fetchSingleSurveyResult: 'surveys/fetchSingleSurveyResult',
      fetchConsultingResult: 'consulting/fetchResult',
      storeConsultingResult: 'consulting/storeResult',
    }),

    ...mapMutations({
      setAdequacySurveyResultId: 'consulting/setAdequacySurveyResultId',
    }),

    getSection(section) {
      return this.sections.find((s) => s.id === section);
    },
    sectionIsVisible(section) {
      if (section.active) {
        const doc = { ...this.consulting };
        doc.type ||= this.type;
        return section.active(doc);
      }

      return true;
    },
    sectionCompletionStatus(section) {
      let status = 'incomplete';

      if (!this.consulting) status = 'complete';

      if (this.consulting?.validSections?.includes(section.id)) {
        status = 'complete';
      }

      // promoter signed
      if (
        this.consulting?.signature?.promoter?.status === 'done' &&
        section.id === 'sign-promoter'
      ) {
        status = 'complete';
      }

      // promoter signed
      if (
        this.consulting?.signature?.thirdPayer?.status === 'done' &&
        section.id === 'sign-third-payer'
      ) {
        status = 'complete';
      }

      // customer signed
      if (
        this.consulting?.signature?.customer?.status === 'done' &&
        section.id === 'sign-customer'
      ) {
        status = 'complete';
      }

      // ready to sign
      if (this.consulting?.signature && section.id === 'sign-create-pdf') {
        status = 'complete';
      }

      // if consulting is done
      if (this.consulting?.signature?.procedureCompleted && section.id.startsWith('sign')) {
        status = 'complete';
      }

      if (status === 'complete') {
        return { color: 'step-positive', icon: 'fa fa-check' };
      }

      return { color: 'step-warning', icon: 'fa fa-exclamation' };
      // return { color: 'step-negative', icon: 'fa fa-times' };
    },

    async saveResult() {
      const { id: customerId } = this.$route.params;
      const component = this.$refs[this.currentSection];
      const parent = await component.triggerFromParent();

      let valid = true;
      let data = parent;

      if (parent.data) {
        data = parent.data;
        valid = parent.valid;
      }
      const json = JSON.parse(JSON.stringify(data));

      const { resultId } = this.$route.params;
      await this.storeConsultingResult({
        resultId,
        data: {
          customerId,
          inquiryResultId: this.inquiryResultId,
          type: this.type,
          section: this.currentSection,
          data: json,
          valid,
        },
      });
      this.computeIsReadyToSign();
    },

    async goToNextSection() {
      await this.saveResult();
      let index = this.sections.findIndex((s) => s.id === this.currentSection) + 1;

      let section = this.sections[index];
      while (!this.sectionIsVisible(section)) {
        index += 1;
        section = this.sections[index];
      }

      this.currentSection = section.id;
    },

    async saveAndClose() {
      await this.saveResult();
      this.$router.push(`/persons/${this.$route.params.id}`);
    },

    computeIsReadyToSign() {
      if (this.consulting?.signature) {
        this.isReadyToSign = true;
        return;
      }

      let ready = true;
      // eslint-disable-next-line no-restricted-syntax
      for (const section of this.sections) {
        // eslint-disable-next-line no-continue
        if (!this.sectionIsVisible(section)) continue;

        // skip signature sections
        // eslint-disable-next-line no-continue
        if (section.id.startsWith('sign')) continue;

        ready = this.consulting?.validSections.includes(section.id);
        if (!ready) break;
      }

      this.isReadyToSign = ready;
    },

    computeConsultingType() {
      let type;

      if (this.$route.query.type) {
        type = this.$route.query.type;
      }

      if (this.consulting?.type) {
        type = this.consulting?.type;
      }

      if (!type) {
        throw new Error('tipo consulenza non settato nella query ?type');
      }

      this.type = type;
      if (this.type === 'inv') this.currentSection = 'adequacy-survey';
    },

    computeInquiryResultId() {
      this.inquiryResultId = this.consulting?.inquiryResultId || this.$route.query.inquiryResultId;

      if (!this.inquiryResultId) {
        throw new Error('resultId survey non settato nella query ?inquiryResultId');
      }
    },

    async onAdequacySurveySave() {
      this.isShowingAdequacySurvey = false;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });

      // Because we've loaded a new survey, the old inquiry survey is gone from the store
      // Restore previous survey so that data is populated correctly
      await this.fetchSingleSurveyResult({ resultId: this.inquiryResultId });
    },

    canShowNextSection() {
      if (
        this.currentSection === 'sign-customer' &&
        !this.consulting?.validSections?.includes('sign-customer')
      ) {
        return true;
      }

      if (
        this.currentSection === 'sign-third-payer' &&
        !this.consulting?.validSections?.includes('sign-third-payer')
      ) {
        return true;
      }

      if (this.procedureCompleted) return false;

      if (this.currentSection === 'sign-create-pdf') {
        return !!this.consulting?.signature;
      }

      if (this.currentSection === 'adequacy-survey') {
        return this.hasCompletedAdequacy();
      }

      return true;
    },

    hasCompletedAdequacy() {
      return this.adequacyResultId || !!this.consulting?.adequacy?.resultId;
    },

    canNavigateWithStepper() {
      if (!this.consulting) return false;
      if (this.type === 'inv' && !this.hasCompletedAdequacy()) return false;
      if (!this.consulting?.product?.productId) return false;

      return true;
    },
  },

  data() {
    return {
      ready: false,
      isReadyToSign: false,
      isShowingAdequacySurvey: false,
      type: 'noninv', // noninv | inv
      inquiryResultId: undefined, // survey inquiry result id
      currentSection: 'pick-product',
      // currentSection: 'promoter-info',
      sections: [
        {
          id: 'adequacy-survey',
          name: 'Questionario adeguatezza',
          active: (doc) => doc.type === 'inv',
        },
        { id: 'pick-product', name: 'Scegli prodotto' },
        { id: 'proposal-number', name: 'Numero proposta' },
        { id: 'promoter-info', name: 'Dati intermediario' },
        { id: 'promoter-address', name: 'Indirizzo filiale' },
        { id: 'distribution-info', name: 'Distribuzione' },
        { id: 'sepa-debit', name: 'Sepa' },
        { id: 'third-payer', name: 'Terzo Pagatore', active: (doc) => doc?.sepa?.isThirdPayer },
        {
          id: 'sepa-customer-info',
          name: 'Dati pagatore sepa',
          active: (doc) => doc?.sepa?.hasAdvisoryFee,
        },
        {
          id: 'third-payer-document',
          name: 'Doc. Identità TP',
          active: (doc) => doc?.sepa?.isThirdPayer,
        },
        { id: 'sepa-iban-info', name: 'IBAN sepa', active: (doc) => doc?.sepa?.hasAdvisoryFee },
        { id: 'end-extra-info', name: 'Attestato fine consulenza' },
        {
          id: 'sign-create-pdf',
          name: 'Raccolta dati per firma digitale',
        },
        {
          id: 'sign-promoter',
          name: 'Firma digitale (Consulente)',
        },
        { id: 'sign-customer', name: 'Firma digitale (Cliente)' },
        {
          id: 'sign-third-payer',
          active: (doc) => doc?.sepa?.isThirdPayer,
          name: 'Firma digitale (Terzo pagatore)',
        },
        { id: 'sign-download-pdf', name: 'Download PDF firmato' },
      ],
    };
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  min-width 710px
  max-width 960px
  border-radius 4px
  border solid 1px $card-border
  min-height 280px

.q-stepper
  background-color white
  border-radius 4px
  border solid 1px $card-border
</style>
