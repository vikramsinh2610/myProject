<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column items-center">
    <q-card class="q-pa-lg" inline color="white" text-color="primary" style="max-width: 1000px">
      <q-card-section>
        <div class="p-pc-title-section">{{ $t('default.syncPage') }}</div>
        <div>
          <div class="row justify-between">
            <q-select
              class="col-6"
              v-model="form.productivePeriodMonth"
              :label="$t('invoicing.productivePeriodMonth')"
              :options="$utils.productivePeriodMonthList($t.bind(this))"
            />
            <q-input
              class="col-4"
              v-model="form.productivePeriodYear"
              type="number"
              hide-bottom-space
              :label="$t('invoicing.productivePeriodYear')"
              :error="$v.form.productivePeriodYear.$error"
              @blur="$v.form.productivePeriodYear.$touch"
            />
          </div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-12"
              v-model="form.practiceId"
              type="text"
              :label="$t('default.practiceId')"
              @keyup.enter="submit"
            />
          </div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-12"
              v-model="form.contractId"
              type="text"
              :label="$t('default.contractId')"
              @keyup.enter="submit"
            />
          </div>
          <div class="row justify-between q-my-lg">
            <q-checkbox
              class="p-pc-toggle col-12"
              left-label
              v-model="form.override"
              :label="$t('configurationProduct.override')"
            />
          </div>
        </div>
        <prassi-standard-button
          class="q-my-lg"
          :loading="isFetching"
          :label="$t('default.syncButton')"
          @click="submit"
        />
      </q-card-section>
    </q-card>
    <div class="text-center"><q-spinner-dots v-if="isFetching" color="primary" size="40" /></div>
  </q-page>
</template>

<script>
import { required, between } from 'vuelidate/lib/validators';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'SyncPractice',
  data() {
    return {
      form: {
        productivePeriodMonth: {
          label: this.$utils.numberToMonth(new Date().getMonth() + 1, this.$t.bind(this)),
          value: new Date().getMonth() + 1,
        },
        productivePeriodYear: new Date().getFullYear(),
        practiceId: '',
        contractId: '',
        override: false,
      },
    };
  },
  validations: {
    form: {
      productivePeriodYear: {
        required,
        integer: true,
        between: between(2000, 2999),
      },
    },
  },
  created() {
    this.$utils.log('SYNC', 'created');
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  methods: {
    ...mapActions({
      fetchSyncPractice: 'commissioning/fetchSyncPractice',
      fetchSyncPracticeSingle: 'commissioning/fetchSyncPracticeSingle',
      fetchSyncContractSingle: 'commissioning/fetchSyncContractSingle',
    }),
    submit() {
      this.$v.form.$touch();

      if (!this.$v.form.$error) {
        this.$utils.logobj('SYNC', 'submit', this.form);

        if (this.form.practiceId) {
          this.fetchSyncPracticeSingle({
            practiceId: this.form.practiceId,
            override: this.form.override,
            productivePeriod: `${
              this.form.productivePeriodYear
            }${this.form.productivePeriodMonth.value.toString().padStart(2, '0')}`,
          }).then(() => {
            this.$q.notify({
              message: this.$t('default.syncOK'),
              color: 'secondary',
              timeout: 300,
            });
          });
        } else if (this.form.contractId) {
          this.fetchSyncContractSingle({
            contractId: this.form.contractId,
            override: this.form.override,
            productivePeriod: `${
              this.form.productivePeriodYear
            }${this.form.productivePeriodMonth.value.toString().padStart(2, '0')}`,
          })
            // eslint-disable-next-line sonarjs/no-identical-functions
            .then(() => {
              this.$q.notify({
                message: this.$t('default.syncOK'),
                color: 'secondary',
                timeout: 300,
              });
            });
        } else {
          this.fetchSyncPractice({
            commissioningId: `${
              this.form.productivePeriodYear
            }${this.form.productivePeriodMonth.value.toString().padStart(2, '0')}`,
            override: this.form.override,
          })
            // eslint-disable-next-line sonarjs/no-identical-functions
            .then(() => {
              this.$q.notify({
                message: this.$t('default.syncOK'),
                color: 'secondary',
                timeout: 300,
              });
            });
        }
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.center-spinner
  display block
  margin auto
.p-pc-toggle
  justify-content space-between
  font-size 22px
</style>
