<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-promoter-filter hidesearch roles :role-types="roles" @changed="filterPromoterChange" />
    <prassi-configuration-sheltia-commissioning-list
      class="fill-available"
      ref="ConfigurationSheltiaCommissioningList"
      :commissionings="
        filterRole && filterRole !== 'no-selection'
          ? commissionings.filter((el) => el.roleId === filterRole)
          : commissionings
      "
      :is-fetching="isFetching"
      :roles="roles"
      @addCommissioning="showAddCommissioningDialog"
      @copyConfiguration="doCopyConfiguration"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
    <q-dialog v-model="showInsertDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('configurationCommissioning.addTitle') }}</div>
        </q-card-section>
        <q-card-section>
          <div v-if="configurationToCopy" class="row justify-between q-mt-md">
            {{ $t('configurationCommissioning.copiedText') }}
            {{ configurationToCopy }}
          </div>
          <div class="row justify-between q-mt-md">
            <q-select
              class="col-12"
              v-model="form.roleId"
              :label="$t('configurationJobs.roleId')"
              :error-message="$t('configurationProduct.errorLabel')"
              :error="$v.form.roleId.$error"
              :options="roleTypeList"
            />
            <q-input
              class="col-5"
              v-model="form.fromProductivePeriodYear"
              :label="$t('configurationJobs.fromProductivePeriodYear')"
            />
            <q-select
              class="col-5"
              v-model="form.fromProductivePeriodMonth"
              :options="$utils.productivePeriodMonthList($t.bind(this))"
              :label="$t('configurationJobs.fromProductivePeriodMonth')"
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
import PrassiConfigurationSheltiaCommissioningList from '../components/configuration/prassi-configuration-sheltia-commissioning-list';
import PrassiPromoterFilter from '../components/promoter/prassi-promoter-filter';

export default {
  name: 'ConfigurationCommissioning',
  components: {
    PrassiConfigurationSheltiaCommissioningList,
    PrassiPromoterFilter,
  },
  data() {
    return {
      showInsertDialog: false,
      configurationToCopy: '',
      filterRole: '',
      form: {
        commissioning: '',
        roleId: '',
        fromProductivePeriodMonth: {
          label: this.$utils.numberToMonth(new Date().getMonth() + 1, this.$t.bind(this)),
          value: new Date().getMonth() + 1,
        },
        fromProductivePeriodYear: new Date().getFullYear(),
        percentage: 0,
      },
    };
  },
  created() {
    this.fetchSheltiaCommissionings();
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      commissionings: (state) => state.configuration.sheltiaCommissionings.items,
      commissioning: (state) => state.configuration.sheltiaCommissioning,
      last: (state) => state.configuration.sheltiaCommissionings.lastRecord,
      isFetching: (state) => state.error.isFetching,
      roles: (state) => state.promoters.roles.items,
      roleTypeList() {
        const roleTypeList = [];
        this.roles.forEach((el) => {
          if (el === `none`) return;
          roleTypeList.unshift({
            label: el.name,
            value: el.networkId,
          });
        });
        return roleTypeList;
      },
    }),
  },
  validations: {
    form: {
      percentage: {
        required,
      },
      roleId: {
        required,
      },
    },
  },
  methods: {
    ...mapActions({
      fetchSheltiaCommissionings: 'configuration/fetchSheltiaCommissionings',
      saveSheltiaCommissioning: 'configuration/saveSheltiaCommissioning',
      fetchSheltiaCommissioning: 'configuration/fetchSheltiaCommissioning',
    }),
    filterPromoterChange(filter) {
      this.filterRole = filter.roleType ? filter.roleType.value : '';
    },
    showAddCommissioningDialog() {
      this.$utils.log('CONFIGURATION-SHELTIA-COMMISSIONING', 'showCommissioningsDialog called');
      this.configurationToCopy = '';
      this.showInsertDialog = true;
    },
    minTwoDigits(n) {
      return (n < 10 ? '0' : '') + n;
    },
    doCopyConfiguration(configuration) {
      this.$utils.logobj('CONFIGURATION-SHELTIA-COMMISSIONING', 'copyProduct', configuration);
      this.configurationToCopy = configuration;
      this.showInsertDialog = true;
    },
    async confirmAdd() {
      this.$v.$touch();
      if (!this.$v.$error) {
        let changedCommissioning = {};
        if (this.configurationToCopy) {
          await this.fetchSheltiaCommissioning(this.configurationToCopy);
          changedCommissioning = {
            ...this.commissioning,
            _id: `${this.form.roleId.value}-${
              this.form.fromProductivePeriodYear
            }${this.minTwoDigits(this.form.fromProductivePeriodMonth.value)}`,
            roleId: this.form.roleId.value,
            fromProductivePeriodMonth: this.form.fromProductivePeriodMonth.value,
            fromProductivePeriodYear: this.form.fromProductivePeriodYear,
            fromProductivePeriod: `${this.form.fromProductivePeriodYear}${this.minTwoDigits(
              this.form.fromProductivePeriodMonth.value,
            )}`,
          };
        } else {
          changedCommissioning = {
            _id: `${this.form.roleId.value}-${
              this.form.fromProductivePeriodYear
            }${this.minTwoDigits(this.form.fromProductivePeriodMonth.value)}`,
            roleId: this.form.roleId.value,
            fromProductivePeriodMonth: this.form.fromProductivePeriodMonth.value,
            fromProductivePeriodYear: this.form.fromProductivePeriodYear,
            fromProductivePeriod: `${this.form.fromProductivePeriodYear}${this.minTwoDigits(
              this.form.fromProductivePeriodMonth.value,
            )}`,
            purchase: {
              basis: {
                directProductionPercentage: 0,
                indirectProductionPercentage: 0,
              },
              range: {
                directProductionSlots: [],
                indirectProductionSlots: [],
              },
              target: {
                slots: [],
              },
            },
            cashIn: [],
          };
        }
        await this.saveSheltiaCommissioning({
          idCommissioning: `${this.form.roleId.value}-${
            this.form.fromProductivePeriodYear
          }${this.minTwoDigits(this.form.fromProductivePeriodMonth.value)}`,
          body: changedCommissioning,
        }).then(() => {
          this.$q.notify({
            message: this.$t('configurationProduct.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
          this.showInsertDialog = false;
          setTimeout(() => {
            this.fetchSheltiaCommissionings();
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
  min-width 960px
  max-width fit-content
.center-spinner
  display block
  margin auto
</style>
