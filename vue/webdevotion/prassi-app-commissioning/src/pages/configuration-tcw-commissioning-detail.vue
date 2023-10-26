<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <q-card inline flat color="white" text-color="primary">
      <q-card-section>
        <div class="p-pc-title-section">{{ $t('configurationCommissioning.title') }}</div>
        <div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-4 q-mb-md"
              :error-message="$t('configurationProduct.errorLabel')"
              :readonly="true"
              v-model="form.roleId"
              type="text"
              :label="$t('configurationCommissioningHeader.roleId')"
            />
          </div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-2"
              :error-message="$t('configurationProduct.errorLabel')"
              v-model="form.directProductionPercentage"
              type="number"
              :label="$t('configurationCommissioning.directProductionPercentage')"
              @keyup.enter="submit"
              :suffix="computeCurrencySymbol('percentage')"
            />
            <q-input
              class="col-2"
              :error-message="$t('configurationProduct.errorLabel')"
              v-model="form.indirectProductionPercentage"
              type="number"
              :label="$t('configurationCommissioning.indirectProductionPercentage')"
              @keyup.enter="submit"
              :suffix="computeCurrencySymbol('percentage')"
            />
            <q-input
              class="col-2"
              :error-message="$t('configurationProduct.errorLabel')"
              v-model="form.directProductionForfait"
              type="number"
              :label="$t('configurationCommissioningHeader.directProductionForfait')"
              @keyup.enter="submit"
            />
            <q-checkbox
              class="col-2"
              left-label
              v-model="form.isIndirectProductionCombinable"
              :label="$t('configurationCommissioningHeader.indirectProductionCombinable')"
            />
          </div>
        </div>
        <prassi-standard-button
          class="q-mb-lg q-mt-xl"
          color="red"
          :loading="isFetching"
          :label="$t('configurationCommissioning.delete')"
          @click="cancel"
        />
        <prassi-standard-button
          class="q-mb-lg"
          :loading="isFetching"
          :label="$t('configurationCommissioning.save')"
          @click="submit"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
// import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ConfigurationCommissioningDetail',
  data() {
    return {
      form: {
        idCommissioning: this.$route.params.id,
        roleId: '',
        directProductionPercentage: 0,
        indirectProductionPercentage: 0,
        isIndirectProductionCombinable: false,
        directProductionForfait: 0,
      },
    };
  },
  computed: {
    ...mapState({
      commissioning: (state) => state.configuration.tcwCommissioning,
      isFetching: (state) => state.error.isFetching,
      roles: (state) => state.promoters.roles.items,
    }),
  },
  created() {
    this.fetchConfigurationTcwCommissioning(this.$route.params.id);
  },
  watch: {
    commissioning: {
      immediate: true,
      handler(commissioning) {
        this.$utils.logobj('CONFIGURATION-COMMISSIONING-DETAIL', 'commissioning', commissioning);
        this.form.idCommissioning = commissioning._id;
        this.form.roleId = this.$utils.getRoleName(this.roles, commissioning.roleId);
        this.form.directProductionPercentage = commissioning.directProductionPercentage / 100;
        this.form.indirectProductionPercentage = commissioning.indirectProductionPercentage / 100;
        this.form.isIndirectProductionCombinable = commissioning.isIndirectProductionCombinable;
        this.form.directProductionForfait = commissioning.directProductionForfait;
      },
    },
  },
  methods: {
    ...mapActions({
      fetchConfigurationTcwCommissioning: 'configuration/fetchTcwCommissioning',
      saveConfigurationTcwCommissioning: 'configuration/saveTcwCommissioning',
      deleteConfigurationTcwCommissioning: 'configuration/deleteTcwCommissioning',
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
      // this.$v.form.$touch();
      // if (!this.$v.form.$error) {
      const changedCommissioning = {
        ...this.commissioning,
        directProductionPercentage: this.form.directProductionPercentage * 100,
        indirectProductionPercentage: this.form.indirectProductionPercentage * 100,
        isIndirectProductionCombinable: this.form.isIndirectProductionCombinable,
        directProductionForfait: this.form.directProductionForfait,
      };
      this.saveConfigurationTcwCommissioning({
        idCommissioning: this.form.idCommissioning,
        body: changedCommissioning,
      }).then(() => {
        this.$q.notify({
          message: this.$t('configurationProduct.saveOk'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    cancel() {
      this.deleteConfigurationTcwCommissioning(this.form.idCommissioning).then(() => {
        this.$q.notify({
          message: this.$t('default.deleteOk'),
          color: 'secondary',
          timeout: 300,
        });
        this.$router.push('/configuration/tcw-commissioning');
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
