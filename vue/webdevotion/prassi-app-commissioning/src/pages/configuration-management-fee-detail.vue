<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <q-card inline flat color="white" text-color="primary">
      <q-card-section>
        <div class="p-pc-title-section">{{ $t('configurationManagementFee.title') }}</div>
        <div>
          <div class="row justify-between q-my-xs">
            <q-field class="col-4" :error-label="$t('configurationProduct.errorLabel')">
              <q-input
                :readonly="true"
                v-model="form.roleId"
                type="text"
                :float-label="$t('configurationManagementFeeHeader.roleId')"
              />
            </q-field>
            <q-field class="col-3" :error-label="$t('configurationProduct.errorLabel')">
              <q-input
                :readonly="true"
                v-model="form.fromProductivePeriod"
                type="text"
                :float-label="$t('configurationManagementFeeHeader.fromProductivePeriod')"
              />
            </q-field>
          </div>
          <div class="row justify-end q-my-xs">
            <q-field class="col-2 float-right" :error-label="$t('configurationProduct.errorLabel')">
              <q-input
                v-model="form.percentage"
                type="number"
                :float-label="$t('configurationManagementFeeHeader.percentage')"
                @keyup.enter="submit"
                :suffix="computeCurrencySymbol('percentage')"
              />
            </q-field>
          </div>
        </div>
        <prassi-standard-button
          class="q-mb-lg"
          color="red"
          :loading="isFetching"
          :label="$t('configurationManagementFee.delete')"
          @click="cancel"
        />
        <prassi-standard-button
          class="q-mb-lg"
          :loading="isFetching"
          :label="$t('configurationManagementFee.save')"
          @click="submit"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ConfigurationManagementFeeDetail',
  data() {
    return {
      pagination: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      tableData: [],
      form: {
        idManagementFee: this.$route.params.id,
        roleId: '',
        fromProductivePeriod: '',
        fromProductivePeriodMonth: 0,
        fromProductivePeriodYear: 0,
        percentage: 0,
      },
    };
  },
  computed: {
    ...mapState({
      managementFee: (state) => state.configuration.managementFee,
      isFetching: (state) => state.error.isFetching,
      roles: (state) => state.promoters.roles.items,
    }),
  },
  created() {
    this.fetchConfigurationManagementFee(this.$route.params.id);
  },
  validations: {
    form: {
      percentage: {
        required,
      },
    },
  },
  watch: {
    managementFee: {
      immediate: true,
      handler(managementFee) {
        this.$utils.logobj('CONFIGURATION-MANAGEMENT-FEE-DETAIL', 'managementFee', managementFee);
        this.form.idManagementFee = managementFee._id;
        this.form.roleId = this.$utils.getRoleName(this.roles, managementFee.roleId);
        this.form.fromProductivePeriod = `${this.$utils.numberToMonth(
          managementFee.fromProductivePeriodMonth,
          this.$t.bind(this),
        )} ${managementFee.fromProductivePeriodYear}`;
        this.form.percentage = managementFee.percentage / 100;
      },
    },
  },
  methods: {
    ...mapActions({
      fetchConfigurationManagementFee: 'configuration/fetchManagementFee',
      saveConfigurationManagementFee: 'configuration/saveManagementFee',
      deleteConfigurationManagementFee: 'configuration/deleteManagementFee',
    }),
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
    submit() {
      this.$v.form.$touch();
      if (!this.$v.form.$error) {
        const changedManagementFee = {
          ...this.managementFee,
          percentage: this.form.percentage * 100,
        };
        this.saveConfigurationManagementFee({
          idManagementFee: this.form.idManagementFee,
          body: changedManagementFee,
        }).then(() => {
          this.$q.notify({
            message: this.$t('configurationProduct.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
        });
      } else {
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    cancel() {
      this.deleteConfigurationManagementFee(this.form.idManagementFee).then(() => {
        this.$q.notify({
          message: this.$t('default.deleteOk'),
          color: 'secondary',
          timeout: 300,
        });
        this.$router.push('/configuration/management-fee');
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 660px
  max-width 1100px
.q-card
  border-radius 2px
  border solid 2px $card-border
  min-height 280px
.q-card-main
  padding 10px 15px 0
  min-height 34px
.p-pc-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  margin-bottom 20px
.p-pc-toggle
  width 45%
  justify-content space-between
  font-size 22px
</style>
