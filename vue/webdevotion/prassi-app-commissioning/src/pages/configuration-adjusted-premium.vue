<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-configuration-adjusted-premium-list
      class="fill-available"
      ref="ConfigurationAdjustedPremiumList"
      :is-fetching="isFetching"
      :adjusted-premiums="adjustedPremiums"
      @addAdjustedPremium="showAddAdjustedPremiumDialog"
      @copyConfiguration="doCopyConfiguration"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
    <q-dialog v-model="showInsertDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('configurationAdjustedPremium.addTitle') }}</div>
        </q-card-section>
        <q-card-section>
          <div v-if="configurationToCopy" class="row justify-between q-mt-md">
            {{ $t('configurationAdjustedPremium.copiedText') }}
            {{ configurationToCopy }}
          </div>
          <div class="row justify-between q-mt-md">
            <q-input
              class="col-5"
              v-model="fromProductivePeriodYear"
              :label="$t('configurationJobs.fromProductivePeriodYear')"
            />
            <q-select
              class="col-5"
              v-model="quarter"
              :options="quarters"
              :label="$t('configurationAdjustedPremium.quarters')"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.addButton')" @click="confirmAdd" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import PrassiConfigurationAdjustedPremiumList from '../components/configuration/prassi-configuration-adjusted-premium-list';

export default {
  name: 'ConfigurationAdjustedPremium',
  components: {
    PrassiConfigurationAdjustedPremiumList,
  },
  data() {
    return {
      showInsertDialog: false,
      configurationToCopy: '',
      filterRole: '',
      fromProductivePeriodYear: '',
      form: {
        adjustedPremium: '',
      },
      quarter: '',
      quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
    };
  },
  created() {
    this.fetchAdjustedPremiums();
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      adjustedPremiums: (state) => state.configuration.adjustedPremiums.items,
      adjustedPremium: (state) => state.configuration.adjustedPremium,
      last: (state) => state.configuration.adjustedPremiums.lastRecord,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  validations: {
    fromProductivePeriodYear: {
      required,
    },
    quarter: {
      required,
    },
  },
  methods: {
    ...mapActions({
      fetchAdjustedPremiums: 'configuration/fetchAdjustedPremiums',
      saveAdjustedPremium: 'configuration/saveAdjustedPremium',
      fetchAdjustedPremium: 'configuration/fetchAdjustedPremium',
    }),
    showAddAdjustedPremiumDialog() {
      this.$utils.log('CONFIGURATION-ADJUSTED-PREMIUM', 'showAdjustedPremiumsDialog called');
      this.configurationToCopy = '';
      this.showInsertDialog = true;
    },
    minTwoDigits(n) {
      return (n < 10 ? '0' : '') + n;
    },
    doCopyConfiguration(configuration) {
      this.$utils.logobj('CONFIGURATION-ADJUSTED-PREMIUM', 'copyProduct', configuration);
      this.configurationToCopy = configuration;
      this.showInsertDialog = true;
    },
    async confirmAdd() {
      this.$v.$touch();
      if (!this.$v.$error) {
        let changedAdjustedPremium = {};
        if (this.configurationToCopy) {
          await this.fetchAdjustedPremium(this.configurationToCopy);
          changedAdjustedPremium = {
            ...this.adjustedPremium,
            _id: `${this.fromProductivePeriodYear}${this.quarter}`,
          };
        } else {
          changedAdjustedPremium = {
            _id: `${this.fromProductivePeriodYear}${this.quarter}`,
            products: [],
          };
        }
        await this.saveAdjustedPremium({
          idAdjustedPremium: ``,
          body: changedAdjustedPremium,
        }).then(() => {
          this.$q.notify({
            message: this.$t('configurationProduct.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
          this.showInsertDialog = false;
          setTimeout(() => {
            this.fetchAdjustedPremiums();
          }, 700);
        });
      } else {
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    computeCurrencySymbol(symbol) {
      switch (symbol) {
        case 'currency':
          return '€';
        case 'percentage':
          return '%';
        default:
          return '';
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 280px
  max-width 300px
.center-spinner
  display block
  margin auto
</style>
