<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-configuration-tcw-commissioning-dynamic-list
      class="fill-available"
      :commissionings="commissionings"
      :is-fetching="isFetching"
      @copyConfiguration="doCopyConfiguration"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
    <q-dialog v-model="showInsertDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('configurationCommissioningDynamic.addTitle') }}</div>
        </q-card-section>
        <q-card-section>
          <div v-if="configurationToCopy" class="row justify-between q-mt-md">
            {{ $t('configurationCommissioningDynamic.copiedText') }}
            {{ configurationToCopy }}
          </div>
          <div class="row justify-between q-mt-md">
            <q-input
              class="col-5"
              v-model="fromProductivePeriodYear"
              :label="$t('configurationCommissioningDynamic.fromProductivePeriodYear')"
            />
            <q-input
              class="col-5"
              v-model="fromProductivePeriodMonth"
              :label="$t('configurationCommissioningDynamic.fromProductivePeriodMonth')"
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
import PrassiConfigurationTcwCommissioningDynamicList from '../components/configuration/prassi-configuration-tcw-commissioning-dynamic-list';

export default {
  name: 'ConfigurationTcwCommissioningDynamic',
  components: {
    PrassiConfigurationTcwCommissioningDynamicList,
  },
  data() {
    return {
      showInsertDialog: false,
      configurationToCopy: '',
      filterRole: '',
      fromProductivePeriodYear: '',
      fromProductivePeriodMonth: '',
    };
  },
  created() {
    this.fetchTcwCommissioningsDynamic();
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      commissionings: (state) => state.configuration.tcwCommissionings.items,
      commissioning: (state) => state.configuration.tcwCommissioningDynamic,
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
  methods: {
    ...mapActions({
      fetchTcwCommissioningsDynamic: 'configuration/fetchTcwCommissioningsDynamic',
      fetchTcwCommissioningDynamic: 'configuration/fetchTcwCommissioningDynamic',
      addTcwCommissioningDynamic: 'configuration/addTcwCommissioningDynamic',
    }),
    filterPromoterChange(filter) {
      this.filterRole = filter.roleType ? filter.roleType.value : '';
    },
    async confirmAdd() {
      this.$utils.log('CONFIGURATION-TCW-COMMISSIONING', 'confirm add');

      let newCommissioning = {};
      if (this.configurationToCopy) {
        await this.fetchTcwCommissioningDynamic(this.configurationToCopy);
        newCommissioning = {
          ...this.commissioning,
          _id: `${this.fromProductivePeriodYear}${this.fromProductivePeriodMonth}`,
        };
      } else {
        const rowBonus = {
          roleId: '',
          directProductionPercentage: 0,
          indirectProductionPercentage: 0,
          isIndirectProductionCombinable: false,
          directProductionForfait: 0,
        };
        const blockRow = {
          id: '',
          roles: [rowBonus],
        };
        newCommissioning = {
          _id: `${this.fromProductivePeriodYear}${this.fromProductivePeriodMonth}`,
          config: [blockRow],
        };
      }

      await this.addTcwCommissioningDynamic({
        idCommissioning: '',
        body: newCommissioning,
      }).then(() => {
        this.$q.notify({
          message: this.$t('configurationProduct.saveOk'),
          color: 'secondary',
          timeout: 300,
        });
        this.showInsertDialog = false;
        setTimeout(() => {
          this.fetchTcwCommissioningsDynamic();
        }, 700);
      });
    },
    doCopyConfiguration(configuration) {
      this.$utils.logobj('CONFIGURATION-ADJUSTED-PREMIUM', 'copyProduct', configuration);
      this.configurationToCopy = configuration;
      this.showInsertDialog = true;
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
