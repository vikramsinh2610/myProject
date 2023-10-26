<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-configuration-management-fee-list
      class="fill-available"
      ref="ConfigurationManagementFeeList"
      :management-fees="managementFees"
      :roles="roles"
      :is-fetching="isFetching"
      @addManageFee="showAddManageFeeDialog"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
    <q-dialog v-model="showInsertDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('default.addManageFeeConfiguration') }}</div>
        </q-card-section>
        <q-card-section>
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
            <q-input
              v-model="form.percentage"
              class="col-5"
              :label="$t('configurationManagementFeeHeader.percentage')"
              :suffix="computeCurrencySymbol('percentage')"
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
import PrassiConfigurationManagementFeeList from '../components/configuration/prassi-configuration-management-fee-list';

export default {
  name: 'ConfigurationManagementFee',
  components: {
    PrassiConfigurationManagementFeeList,
  },
  data() {
    return {
      showInsertDialog: false,
      form: {
        managementFee: '',
        roleId: undefined,
        fromProductivePeriodMonth: {
          label: this.$utils.numberToMonth(new Date().getMonth() + 1, this.$t.bind(this)),
          value: new Date().getMonth() + 1,
        },
        fromProductivePeriodYear: new Date().getFullYear(),
        percentage: 0,
      },
    };
  },
  mounted() {
    this.fetchManagementFees();
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      managementFees: (state) => state.configuration.managementFees.items,
      last: (state) => state.configuration.managementFees.lastRecord,
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
      fetchManagementFees: 'configuration/fetchManagementFees',
      saveManagementFee: 'configuration/saveManagementFee',
    }),
    showAddManageFeeDialog() {
      this.$utils.log('PAY-IN-LIST', 'showAddManageFeeDialog called');
      this.showInsertDialog = true;
    },
    minTwoDigits(n) {
      return (n < 10 ? '0' : '') + n;
    },
    async confirmAdd() {
      this.$v.$touch();
      if (!this.$v.$error) {
        const changedManagementFee = {
          _id: `${this.form.roleId.value}-${this.form.fromProductivePeriodYear}${this.minTwoDigits(
            this.form.fromProductivePeriodMonth.value,
          )}`,
          roleId: this.form.roleId.value,
          fromProductivePeriodMonth: this.form.fromProductivePeriodMonth.value,
          fromProductivePeriodYear: this.form.fromProductivePeriodYear,
          fromProductivePeriod: `${this.form.fromProductivePeriodYear}${this.minTwoDigits(
            this.form.fromProductivePeriodMonth.value,
          )}`,
          percentage: this.form.percentage * 100,
        };
        await this.saveManagementFee({
          idManagementFee: `${this.form.roleId.value}-${
            this.form.fromProductivePeriodYear
          }${this.minTwoDigits(this.form.fromProductivePeriodMonth.value)}`,
          body: changedManagementFee,
        }).then(() => {
          this.$q.notify({
            message: this.$t('configurationProduct.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
          this.showInsertDialog = false;
          setTimeout(() => {
            this.fetchManagementFees();
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
