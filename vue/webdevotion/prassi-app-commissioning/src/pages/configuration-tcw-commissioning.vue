<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-promoter-filter hidesearch roles :role-types="roles" @changed="filterPromoterChange" />
    <prassi-configuration-tcw-commissioning-list
      :commissionings="
        filterRole && filterRole !== 'no-selection'
          ? commissionings.filter((el) => el.roleId === filterRole)
          : commissionings
      "
      :is-fetching="isFetching"
      :roles="roles"
      @addCommissioning="showAddCommissioningDialog"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
    <q-dialog v-model="showInsertDialog">
      <q-card style="width: 700px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('configurationCommissioning.addTitle') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-around q-mt-md">
            <q-select
              class="col-6"
              v-model="form.roleId"
              :label="$t('configurationJobs.roleId')"
              :error-message="$t('configurationProduct.errorLabel')"
              :error="$v.form.roleId.$error"
              :options="roleTypeList"
            />
            <q-input
              class="p-pc-date col-4"
              v-model="form.creationDate"
              mask="##-##-####"
              :label="$t('promoterCompany.dateAssigned')"
            >
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="form.creationDate"
                      mask="DD-MM-YYYY"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              class="col-3"
              :error-message="$t('configurationProduct.errorLabel')"
              v-model="form.directProductionPercentage"
              type="number"
              :label="$t('configurationCommissioning.directProductionPercentage')"
              @keyup.enter="submit"
              :suffix="computeCurrencySymbol('percentage')"
            />
            <q-input
              class="col-3"
              :error-message="$t('configurationProduct.errorLabel')"
              v-model="form.indirectProductionPercentage"
              type="number"
              :label="$t('configurationCommissioning.indirectProductionPercentage')"
              @keyup.enter="submit"
              :suffix="computeCurrencySymbol('percentage')"
            />
          </div>
          <div class="row justify-around q-mt-md">
            <q-input
              class="col-3"
              :error-message="$t('configurationProduct.errorLabel')"
              v-model="form.directProductionForfait"
              type="number"
              :label="$t('configurationCommissioningHeader.directProductionForfait')"
              @keyup.enter="submit"
            />
            <q-checkbox
              class="col-3"
              left-label
              v-model="form.isIndirectProductionCombinable"
              :label="$t('configurationCommissioningHeader.indirectProductionCombinable')"
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
import { date } from 'quasar';
import { required } from 'vuelidate/lib/validators';
import PrassiConfigurationTcwCommissioningList from '../components/configuration/prassi-configuration-tcw-commissioning-list';
import PrassiPromoterFilter from '../components/promoter/prassi-promoter-filter';

export default {
  name: 'ConfigurationTcwCommissioning',
  components: {
    PrassiConfigurationTcwCommissioningList,
    PrassiPromoterFilter,
  },
  data() {
    return {
      showInsertDialog: false,
      filterRole: '',
      form: {
        roleId: '',
        creationDate: date.formatDate(Date.now(), 'DD-MM-YYYY'),
        directProductionPercentage: 0,
        indirectProductionPercentage: 0,
        isIndirectProductionCombinable: false,
        directProductionForfait: 0,
      },
    };
  },
  created() {
    this.fetchTcwCommissionings();
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      commissionings: (state) => state.configuration.tcwCommissionings.items,
      last: (state) => state.configuration.tcwCommissionings.lastRecord,
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
      roleId: {
        required,
      },
      creationDate: {
        required,
      },
    },
  },
  methods: {
    ...mapActions({
      fetchTcwCommissionings: 'configuration/fetchTcwCommissionings',
      addTcwCommissioning: 'configuration/addTcwCommissioning',
    }),
    filterPromoterChange(filter) {
      this.filterRole = filter.roleType ? filter.roleType.value : '';
    },
    showAddCommissioningDialog() {
      this.$utils.log('CONFIGURATION-TCW-COMMISSIONING', 'showCommissioningsDialog called');
      this.showInsertDialog = true;
    },
    async confirmAdd() {
      this.$utils.log('CONFIGURATION-TCW-COMMISSIONING', 'confirm add');
      this.$v.$touch();

      if (!this.$v.$error) {
        // const creationDate = new Date();
        const creationDate = date.extractDate(this.form.creationDate, 'DD-MM-YYYY');

        const _id = `${this.form.roleId.value}-${creationDate.getFullYear()}-${
          creationDate.getMonth() + 1
        }-${creationDate.getDate()}`;
        const newCommissioning = {
          _id,
          roleId: this.form.roleId.value,
          creationDate,
          directProductionPercentage: this.form.directProductionPercentage * 100,
          indirectProductionPercentage: this.form.indirectProductionPercentage * 100,
          isIndirectProductionCombinable: this.form.isIndirectProductionCombinable,
          directProductionForfait: this.form.directProductionForfait,
        };
        await this.addTcwCommissioning({
          idCommissioning: _id,
          body: newCommissioning,
        }).then(() => {
          this.$q.notify({
            message: this.$t('configurationProduct.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
          this.showInsertDialog = false;
          setTimeout(() => {
            this.fetchTcwCommissionings();
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
