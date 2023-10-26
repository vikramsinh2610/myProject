<template>
  <div class="row no-wrap">
    <q-stepper
      class="no-shadow q-mr-sm min-w-170"
      vertical
      header-nav
      ref="stepper"
      v-model="letterStep"
      active-color="secondary"
    >
      <q-step prefix="b" :order="1" name="base" :title="$t('promoterInsertLetter.base')" />
      <q-step
        prefix="g"
        :order="2"
        v-if="letter.guaranteedBonuses && letter.guaranteedBonuses.length !== 0"
        name="detailGuaranteed"
        :title="$t('promoterInsertLetter.detail')"
        ><div
      /></q-step>
      <q-step
        prefix="gv"
        :order="21"
        v-if="letter.guaranteedVariableBonuses && letter.guaranteedVariableBonuses.length !== 0"
        name="detailGuaranteedVariable"
        :title="$t('promoterInsertLetter.detail')"
        ><div
      /></q-step>
      <q-step
        prefix="i"
        :order="3"
        v-if="letter.job && !letter.jobPayment"
        name="detailJob"
        :title="$t('promoterInsertLetter.detail')"
        ><div
      /></q-step>
      <q-step
        v-if="
          letter.conditionedBonuses &&
          letter.conditionedBonuses.length !== 0 &&
          !(letter.guaranteedVariableBonuses && letter.guaranteedVariableBonuses.length !== 0)
        "
        prefix="r"
        :order="4"
        :key="4"
        name="detailConditionedRange"
        :title="`${conditionedTitleStep}`"
        ><div
      /></q-step>
      <q-step
        v-if="letter.commissioningPa"
        prefix="c"
        :order="5"
        :key="5"
        name="detailCommissioningPa"
        :title="`${conditionedTitleStep}`"
        ><div
      /></q-step>
      <q-step
        v-if="letter.commissioningPas"
        prefix="c"
        :order="6"
        :key="6"
        name="detailCommissioningPas"
        :title="`${conditionedTitleStep}`"
        ><div
      /></q-step>
      <q-step
        v-if="letter.bonusPa"
        prefix="b"
        :order="7"
        :key="7"
        name="detailBonusPa"
        :title="`${conditionedTitleStep}`"
        ><div
      /></q-step>
      <q-step
        v-if="letter.bonusPas"
        prefix="b"
        :order="8"
        :key="8"
        name="detailBonusPas"
        :title="`${conditionedTitleStep}`"
        ><div
      /></q-step>
      <q-step
        v-if="letter.rappelPa"
        prefix="r"
        :order="9"
        :key="9"
        name="detailRappelPa"
        :title="`${conditionedTitleStep}`"
        ><div
      /></q-step>
      <q-step
        v-if="letter.rappelPas"
        prefix="r"
        :order="10"
        :key="10"
        name="detailRappelPas"
        :title="`${conditionedTitleStep}`"
        ><div
      /></q-step>
      <q-step
        :order="1000"
        v-if="letter.agreements && letter.agreements.length !== 0"
        name="detailPrivacy"
        :title="$t('promoterInsertLetter.detail')"
        ><div
      /></q-step>
      <q-step
        :order="2000"
        icon="fa fa-check"
        name="activation"
        :title="$t('promoterInsertLetter.activation')"
      />
    </q-stepper>

    <prassi-promoter-letter-base
      class="col"
      v-if="letterStep === 'base'"
      :letter="letter"
      :letter-settings="letterSettings"
      :n-attachments="nAttachments"
      @changeType="saveLetterType"
      @deleteLetter="deleteLetter"
      @changeData="saveLetterBase"
      @nextStep="$refs.stepper.next()"
      @uploaded="uploadedLetterAttachment"
    />

    <prassi-promoter-letter-guaranteed
      class="col"
      v-if="letterStep === 'detailGuaranteed'"
      :name="$t(`promoterInsertLetter.${letter.type}`)"
      :status="letter.status"
      :productive-period="productivePeriod"
      :invoice-description="letter.invoiceDescription"
      :guaranteed-bonuses="letter.guaranteedBonuses[0]"
      :payment-frequency="letter.paymentFrequency"
      :selected-settings="selectedSettings"
      @nextStep="$refs.stepper.next()"
      @previousStep="$refs.stepper.previous()"
      @changeData="saveLetterDetail"
    />

    <prassi-promoter-letter-guaranteed-variable
      class="col"
      v-if="letterStep === 'detailGuaranteedVariable'"
      :name="$t(`promoterInsertLetter.${letter.type}`)"
      :status="letter.status"
      :productive-period="productivePeriod"
      :guaranteed-variable-bonuses="letter.guaranteedVariableBonuses[0]"
      :invoice-description="letter.invoiceDescription"
      :conditioned-bonuses="letter.conditionedBonuses[0]"
      :payment-frequency="letter.paymentFrequency"
      :selected-settings="selectedSettings"
      @nextStep="$refs.stepper.next()"
      @previousStep="$refs.stepper.previous()"
      @changeData="saveLetterDetail"
    />

    <prassi-promoter-letter-job
      class="col"
      v-if="letterStep === 'detailJob'"
      :name="$t(`promoterInsertLetter.${letter.type}`)"
      :status="letter.status"
      :productive-period="productivePeriod"
      :job="letter.job"
      :jobs="letter.jobs"
      :selected-settings="selectedSettings"
      @nextStep="$refs.stepper.next()"
      @previousStep="$refs.stepper.previous()"
      @changeData="saveLetterDetail"
    />

    <prassi-promoter-letter-conditioned-range
      class="col"
      v-if="letterStep === 'detailConditionedRange'"
      :name="conditionedTitle"
      :status="letter.status"
      :invoice-description="letter.invoiceDescription"
      :productive-period="productivePeriod"
      :cumulate-conditioned-bonuses="letter.cumulateConditionedBonuses"
      :conditioned-bonuses="letter.conditionedBonuses"
      :selected-settings="selectedSettings"
      :products="products"
      :show-inherit-freq="letter.guaranteedBonuses && letter.guaranteedBonuses.length !== 0"
      :payment-frequency="letter.paymentFrequency"
      @needTargets="needTargetsChanged"
      @nextStep="$refs.stepper.next()"
      @previousStep="$refs.stepper.previous()"
      @changeData="saveLetterDetail"
    />

    <prassi-promoter-letter-conditioned
      class="col"
      v-if="letterStep === `detailConditioned${index}`"
      v-for="(conditionedBonus, index) in letter.conditionedBonuses"
      :key="5 + index * 2"
      :index-bonus="index"
      :name="conditionedTitle"
      :status="letter.status"
      :invoice-description="letter.invoiceDescription"
      :productive-period="productivePeriod"
      :conditioned-bonus="conditionedBonus"
      :conditioned-bonuses="letter.conditionedBonuses"
      :selected-settings="selectedSettings"
      :show-inherit-freq="letter.guaranteedBonuses && letter.guaranteedBonuses.length !== 0"
      :payment-frequency="letter.paymentFrequency"
      @needTargets="needTargetsChanged"
      @nextStep="$refs.stepper.next()"
      @previousStep="$refs.stepper.previous()"
      @changeData="saveLetterDetail"
    />

    <prassi-promoter-letter-targets
      class="col"
      v-if="letterStep === `targets${index}`"
      v-for="(conditionedBonus, index) in letter.conditionedBonuses"
      :key="6 + index * 2"
      :index-bonus="index"
      :name="$t(`promoterInsertLetter.${letter.type}`)"
      :status="letter.status"
      :productive-period="productivePeriod"
      :conditioned-bonus="conditionedBonus"
      :conditioned-bonuses="letter.conditionedBonuses"
      @nextStep="$refs.stepper.next()"
      @previousStep="$refs.stepper.previous()"
      @changeData="saveLetterDetail"
    />

    <prassi-promoter-letter-privacy
      class="col"
      v-if="letterStep === 'detailPrivacy'"
      :name="$t(`promoterInsertLetter.${letter.type}`)"
      :status="letter.status"
      :agreements="letter.agreements"
      @nextStep="$refs.stepper.next()"
      @previousStep="$refs.stepper.previous()"
      @changeData="saveLetterDetail"
    />

    <prassi-promoter-letter-commissioning-pa
      class="col"
      v-if="letterStep === 'detailCommissioningPa'"
      :name="conditionedTitle"
      :status="letter.status"
      :invoice-description="letter.invoiceDescription"
      :productive-period="productivePeriod"
      :selected-settings="selectedSettings"
      :commissioning-pa="letter.commissioningPa"
      @nextStep="$refs.stepper.next()"
      @previousStep="$refs.stepper.previous()"
      @changeData="saveLetterDetail"
    />

    <prassi-promoter-letter-commissioning-pas
      class="col"
      v-if="letterStep === 'detailCommissioningPas'"
      :name="conditionedTitle"
      :status="letter.status"
      :invoice-description="letter.invoiceDescription"
      :productive-period="productivePeriod"
      :selected-settings="selectedSettings"
      :commissioning-pa="letter.commissioningPas"
      @nextStep="$refs.stepper.next()"
      @previousStep="$refs.stepper.previous()"
      @changeData="saveLetterDetail"
    />

    <prassi-promoter-letter-bonus-pa
      class="col"
      v-if="letterStep === 'detailBonusPa'"
      :name="conditionedTitle"
      :status="letter.status"
      :invoice-description="letter.invoiceDescription"
      :productive-period="productivePeriod"
      :selected-settings="selectedSettings"
      :bonus-pa="letter.bonusPa"
      @nextStep="$refs.stepper.next()"
      @previousStep="$refs.stepper.previous()"
      @changeData="saveLetterDetail"
    />

    <prassi-promoter-letter-bonus-pas
      class="col"
      v-if="letterStep === 'detailBonusPas'"
      :name="conditionedTitle"
      :status="letter.status"
      :invoice-description="letter.invoiceDescription"
      :productive-period="productivePeriod"
      :selected-settings="selectedSettings"
      :bonus-pas="letter.bonusPas"
      @nextStep="$refs.stepper.next()"
      @previousStep="$refs.stepper.previous()"
      @changeData="saveLetterDetail"
    />

    <prassi-promoter-letter-rappel-pa
      class="col"
      v-if="letterStep === 'detailRappelPa'"
      :name="conditionedTitle"
      :status="letter.status"
      :invoice-description="letter.invoiceDescription"
      :productive-period="productivePeriod"
      :selected-settings="selectedSettings"
      :rappel-pa="letter.rappelPa"
      @nextStep="$refs.stepper.next()"
      @previousStep="$refs.stepper.previous()"
      @changeData="saveLetterDetail"
    />

    <prassi-promoter-letter-rappel-pas
      class="col"
      v-if="letterStep === 'detailRappelPas'"
      :name="conditionedTitle"
      :status="letter.status"
      :invoice-description="letter.invoiceDescription"
      :productive-period="productivePeriod"
      :selected-settings="selectedSettings"
      :rappel-pas="letter.rappelPas"
      @nextStep="$refs.stepper.next()"
      @previousStep="$refs.stepper.previous()"
      @changeData="saveLetterDetail"
    />

    <prassi-promoter-letter-activate
      class="col"
      v-if="letterStep === 'activation'"
      :letter="letter"
      @previousStep="$refs.stepper.previous()"
      @activate="activateLetter"
    />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import PrassiPromoterLetterBase from './prassi-promoter-letter-base';
import PrassiPromoterLetterConditionedRange from './prassi-promoter-letter-conditioned-range';
import PrassiPromoterLetterCommissioningPa from './prassi-promoter-letter-commissioning-pa';
import PrassiPromoterLetterCommissioningPas from './prassi-promoter-letter-commissioning-pas';
import PrassiPromoterLetterBonusPa from './prassi-promoter-letter-bonus-pa';
import PrassiPromoterLetterBonusPas from './prassi-promoter-letter-bonus-pas';
import PrassiPromoterLetterRappelPa from './prassi-promoter-letter-rappel-pa';
import PrassiPromoterLetterRappelPas from './prassi-promoter-letter-rappel-pas';
import PrassiPromoterLetterConditioned from './prassi-promoter-letter-conditioned';
import PrassiPromoterLetterGuaranteed from './prassi-promoter-letter-guaranteed';
import PrassiPromoterLetterGuaranteedVariable from './prassi-promoter-letter-guaranteed-variable';
import PrassiPromoterLetterActivate from './prassi-promoter-letter-activate';
import PrassiPromoterLetterTargets from './prassi-promoter-letter-targets';
import PrassiPromoterLetterPrivacy from './prassi-promoter-letter-privacy';
import PrassiPromoterLetterJob from './prassi-promoter-letter-job';

export default {
  name: 'PrassiPromoterInsertLetter',
  components: {
    PrassiPromoterLetterCommissioningPa,
    PrassiPromoterLetterCommissioningPas,
    PrassiPromoterLetterBonusPa,
    PrassiPromoterLetterBonusPas,
    PrassiPromoterLetterRappelPa,
    PrassiPromoterLetterRappelPas,
    PrassiPromoterLetterConditionedRange,
    PrassiPromoterLetterJob,
    PrassiPromoterLetterPrivacy,
    PrassiPromoterLetterTargets,
    PrassiPromoterLetterGuaranteed,
    PrassiPromoterLetterGuaranteedVariable,
    PrassiPromoterLetterConditioned,
    PrassiPromoterLetterBase,
    PrassiPromoterLetterActivate,
  },
  data() {
    return {
      letterStep: 'base',
      needTargets: false,
    };
  },
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    letter: {
      type: Object,
      default: () => ({}),
    },
    letterSettings: {
      type: Object,
      default: () => ({}),
    },
    products: {
      type: Array,
      default: () => [],
    },
    nAttachments: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    selectedSettings() {
      return Object.entries(this.letterSettings).find((key) => key[1]._id === this.letter.type)[1];
    },
    conditionedTitleStep() {
      switch (this.letter.type) {
        case 'guaranteed-with-bonus-prepaid':
          return this.$t('promoterInsertLetter.prepayment');
        case 'guaranteed-with-bonus':
          return this.$t('promoterInsertLetter.bonus');
        default:
          return this.$t('promoterInsertLetter.detail');
      }
    },
    conditionedTitle() {
      switch (this.letter.type) {
        case 'guaranteed-with-bonus-prepaid':
          return this.$t('promoterInsertLetter.prepayment');
        case 'guaranteed-with-bonus':
          return this.$t('promoterInsertLetter.bonus');
        default:
          return this.$t(`promoterInsertLetter.${this.letter.type}`);
      }
    },
    productivePeriod() {
      return {
        fromProductivePeriodMonth: this.letter.fromProductivePeriodMonth,
        fromProductivePeriodYear: this.letter.fromProductivePeriodYear,
        toProductivePeriodMonth: this.letter.toProductivePeriodMonth,
        toProductivePeriodYear: this.letter.toProductivePeriodYear,
      };
    },
  },
  methods: {
    ...mapActions({
      savePromoterLetter: 'promoters/savePromoterLetter',
      savePromoterLetterAttachment: 'promoters/savePromoterLetterAttachment',
      fetchPromoterLetterAttachments: 'promoters/fetchPromoterLetterAttachments',
      deletePromoterLetter: 'promoters/deletePromoterLetter',
      activatePromoterLetter: 'promoters/activatePromoterLetter',
    }),
    ...mapMutations({
      resetPromoterLetter: 'promoters/resetPromoterLetter',
    }),
    needTargetsChanged(need) {
      this.needTargets = need;
    },
    targetsStepDisplay(index) {
      return (
        this.letter.conditionedBonuses &&
        this.letter.conditionedBonuses.length !== 0 &&
        (this.letter.conditionedBonuses[index].paymentTime !== 'prepayment' || this.needTargets)
      );
    },
    saveLetterType(item) {
      this.$utils.logobj('PROMOTER-INSERT-LETTER', 'saveLetterType', item);
      this.savePromoterLetter({
        promoterId: this.$route.params.id,
        letterId: item._id,
        body: item,
      });
    },
    saveLetterBase({ item }) {
      this.$utils.logobj('PROMOTER-INSERT-LETTER', 'saveLetterBase', item);
      this.savePromoterLetter({
        promoterId: this.$route.params.id,
        letterId: item._id,
        body: item,
      }).then(() => {
        this.$utils.log('PROMOTERS-INSERT-LETTER', 'saveLetterBase');
        this.$nextTick().then(() => {
          this.$q.notify({
            message: this.$t('promoterInsertLetter.savedOk'),
            color: 'secondary',
            timeout: 300,
          });

          this.$refs.stepper.next();
        });
      });
    },
    deleteLetter(id) {
      this.$utils.logobj('PROMOTER-INSERT-LETTER', 'deleteLetter', id);
      this.deletePromoterLetter({
        promoterId: this.$route.params.id,
        letterId: id,
      }).then(() => {
        this.$utils.log('PROMOTERS-INSERT-LETTER', 'deleteLetter');
        this.$nextTick().then(() => {
          this.$q.notify({
            message: this.$t('promoterInsertLetter.deletedOk'),
            color: 'secondary',
            timeout: 300,
          });

          this.$emit('exit');
        });
      });
    },
    // eslint-disable-next-line sonarjs/cognitive-complexity
    saveLetterDetail(item) {
      this.$utils.logobj('PROMOTER-INSERT-LETTER', 'saveLetterDetail item', item);
      const changedLetter = { ...this.letter };
      if (item.guaranteedBonuses) changedLetter.guaranteedBonuses = [item.guaranteedBonuses];
      if (item.guaranteedVariableBonuses)
        changedLetter.guaranteedVariableBonuses = [item.guaranteedVariableBonuses];
      if (item.conditionedBonuses) changedLetter.conditionedBonuses = [...item.conditionedBonuses];
      if (item.invoiceDescription) changedLetter.invoiceDescription = item.invoiceDescription;
      if (item.job) changedLetter.job = item.job;
      if (item.jobs) changedLetter.jobs = item.jobs;
      if (item.jobPayment) changedLetter.jobPayment = item.jobPayment;
      if (item.agreements) changedLetter.agreements = item.agreements;
      if (item.commissioningPa) changedLetter.commissioningPa = item.commissioningPa;
      if (item.commissioningPas) changedLetter.commissioningPas = item.commissioningPas;
      if (item.bonusPa) changedLetter.bonusPa = item.bonusPa;
      if (item.bonusPas) changedLetter.bonusPas = item.bonusPas;
      if (item.rappelPa) changedLetter.rappelPa = item.rappelPa;
      if (item.rappelPas) changedLetter.rappelPas = item.rappelPas;
      // eslint-disable-next-line no-prototype-builtins
      if (item.hasOwnProperty('cumulateConditionedBonuses'))
        changedLetter.cumulateConditionedBonuses = item.cumulateConditionedBonuses;
      if (item.paymentFrequency) changedLetter.paymentFrequency = item.paymentFrequency;
      if (
        item.productivePeriod &&
        item.productivePeriod.fromProductivePeriodMonth &&
        item.productivePeriod.fromProductivePeriodYear
      ) {
        changedLetter.fromProductivePeriodMonth = item.productivePeriod.fromProductivePeriodMonth;
        changedLetter.fromProductivePeriodYear = item.productivePeriod.fromProductivePeriodYear;
      }
      if (
        item.productivePeriod &&
        item.productivePeriod.toProductivePeriodMonth &&
        item.productivePeriod.toProductivePeriodYear
      ) {
        changedLetter.toProductivePeriodMonth = item.productivePeriod.toProductivePeriodMonth;
        changedLetter.toProductivePeriodYear = item.productivePeriod.toProductivePeriodYear;
      }

      this.$utils.logobj('PROMOTER-INSERT-LETTER', 'saveLetterDetail changedLetter', changedLetter);
      this.savePromoterLetter({
        promoterId: this.$route.params.id,
        letterId: this.letter._id,
        body: changedLetter,
        // eslint-disable-next-line sonarjs/no-identical-functions
      }).then(async () => {
        this.$utils.log('PROMOTERS-INSERT-LETTER', 'saveLetterDetail');
        this.$q.notify({
          message: this.$t('promoterInsertLetter.savedOk'),
          color: 'secondary',
          timeout: 300,
        });

        this.$refs.stepper.next();
      });
    },
    activateLetter() {
      this.$utils.log('PROMOTER-INSERT-LETTER', 'activateLetter');
      this.activatePromoterLetter({
        promoterId: this.$route.params.id,
        letterId: this.letter._id,
      }).then(async () => {
        this.$utils.log('PROMOTERS-INSERT-LETTER', 'activateLetter');
        this.$q.notify({
          message: this.$t('promoterInsertLetter.activatedConfirm'),
          color: 'secondary',
          timeout: 300,
        });

        this.$emit('exit');
      });
    },
    uploadedLetterAttachment({ letterId, attachmentId, displayName }) {
      this.$utils.logobj('PROMOTER-INSERT-LETTER', 'uploadedLetterAttachment', letterId);
      this.$utils.logobj('PROMOTER-INSERT-LETTER', 'uploadedLetterAttachment', attachmentId);
      this.$utils.logobj('PROMOTER-INSERT-LETTER', 'uploadedLetterAttachment', displayName);
      this.savePromoterLetterAttachment({
        promoterId: this.$route.params.id,
        letterId,
        type: this.letter.type,
        attachmentId,
        displayName,
      }).then(async () => {
        this.$utils.log('PROMOTERS-INSERT-LETTER', 'uploadedLetterAttachment');
        this.fetchPromoterLetterAttachments({
          promoterId: this.$route.params.id,
          letterId,
        });
      });
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
