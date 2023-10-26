<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <prassi-dossier-insurer-filter
      style="width: 100%"
      ref="dossierInsurerFilter"
      :network="network"
      :promoters="promoters"
      :roles="roles"
      @changed="filterDossierChange"
    />

    <prassi-configuration-dossier-insurer-list
      class="fill-available"
      ref="configurationDossierInsurerList"
      :dossiers="dossiers"
      :is-fetching="isFetching"
      @loadMore="loadMoreDossiers"
      @addDossierInsurer="addDossierInsurerDialog"
      @deleteDossierInsurer="deleteDossierInsurerClicked"
      @sort="sortDossiers"
    />
    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />

    <q-dialog v-model="showDelDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            {{ $t('configurationHeader.confirmDelete') + ' ' + this.dossierToDelete }}
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button
            color="red"
            :label="$t('configurationProduct.delete')"
            @click="deleteDossierInsurerConfirmed"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddDialog">
      <q-card style="max-width: 800px; width: 800px">
        <q-card-section class="bg-secondary text-white q-mb-md">
          <div class="text-h6">{{ $t('configurationHeader.addDossierInsurerTitle') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="column justify-between">
            <q-select
              style="width: 100%"
              use-input
              clearable
              v-model="form.networkId"
              :label="$t('default.tree')"
              :options="optionsNetworkList"
              @filter="filterNetwork"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="column justify-between">
            <q-select
              style="width: 100%"
              use-input
              clearable
              v-model="form.promoterId"
              :label="$t('configurationHeader.promoter')"
              :options="optionsPromoterList"
              @filter="filterPromoter"
            />
          </div>
        </q-card-section>

        <q-card-section class="row">
          <q-input
            class="col-6"
            v-model="form.dossierId"
            type="text"
            :label="$t('configurationHeader.dossierCode')"
          />
          <q-input
            class="col q-ml-lg"
            v-model="form.productivePeriodMonth"
            type="number"
            min="1"
            max="12"
            step="1"
            :label="$t('configurationJobs.fromProductivePeriodMonth')"
          />
          <q-input
            class="col q-ml-lg"
            v-model="form.productivePeriodYear"
            type="number"
            min="2000"
            step="1"
            :label="$t('configurationJobs.fromProductivePeriodYear')"
          />
        </q-card-section>

        <q-card-section>
          <prassi-standard-button
            :label="$t('default.addButton')"
            @click="comfirmAddDossierInsurer"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiConfigurationDossierInsurerList from '../components/configuration/prassi-configuration-dossier-insurer-list';
import PrassiDossierInsurerFilter from '../components/dossier/prassi-dossier-insurer-filter';

export default {
  name: 'ConfigurationDossierInsurer',
  components: {
    PrassiConfigurationDossierInsurerList,
    PrassiDossierInsurerFilter,
  },
  data() {
    return {
      showAddDialog: false,
      form: {
        networkId: undefined,
        promoterId: undefined,
        dossierId: undefined,
        productivePeriodMonth: new Date().getMonth() + 1,
        productivePeriodYear: new Date().getFullYear(),
      },
      optionsNetworkList: this.networkList,
      optionsPromoterList: this.promoterList,
      showDelDialog: false,
      dossierToDelete: '',
      dossier: '',
      dossierList: [],
    };
  },
  mounted() {
    this.resetDossiersSearch();
    this.resetDossiers();
    this.fetchNetwork();
    this.fetchAllPromoters();
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      dossiers: (state) => state.configuration.dossierInsurer.items,
      last: (state) => state.configuration.dossierInsurer.lastRecord,
      isFetching: (state) => state.error.isFetching,
      filter: (state) => state.dossiers.filter,
      network: (state) => state.promoters.network.items,
      promoters: (state) => state.promoters.promoters.items,
      roles: (state) => state.promoters.roles.items,
    }),
    promoterList() {
      const promoterList = [];

      this.promoters.forEach((el) => {
        const roleName = this.$utils.getRoleName(this.roles, el.roleId);
        promoterList.push({
          label: `${el.displayName} - ${roleName} - ${el.displayHierarchy}`,
          value: el._id,
        });
      });

      return promoterList;
    },
    networkList() {
      const networkList = [];

      this.network.forEach((el) => {
        networkList.push({
          label: `${el.displayHierarchy}`,
          value: el._id,
        });
      });

      return networkList;
    },
  },
  watch: {
    'form.productivePeriodMonth': {
      immediate: true,
      handler() {
        this.fetchNetworkPeriod({
          year: this.form.productivePeriodYear,
          month: this.form.productivePeriodMonth,
          quarter: 1,
          selected: 'month',
        });
      },
    },
    'form.productivePeriodYear': {
      immediate: true,
      // eslint-disable-next-line sonarjs/no-identical-functions
      handler() {
        this.fetchNetworkPeriod({
          year: this.form.productivePeriodYear,
          month: this.form.productivePeriodMonth,
          quarter: 1,
          selected: 'month',
        });
      },
    },
  },
  methods: {
    ...mapActions({
      fetchNetwork: 'promoters/fetchNetwork',
      fetchAllPromoters: 'promoters/fetchAllPromoters',
      fetchDossiers: 'configuration/fetchDossierInsurers',
      saveDossierInsurer: 'configuration/saveDossierInsurer',
      delDossierInsurer: 'configuration/deleteDossierInsurer',
      fetchNetworkPeriod: 'promoters/fetchNetworkPeriod',
    }),
    ...mapMutations({
      resetDossiersSearch: 'dossiers/resetDossiersSearch',
      resetDossiers: 'configuration/resetDossiers',
      setDossiersFilterAll: 'dossiers/setDossiersFilterAll',
      setDossierInsurerSorting: 'configuration/setDossierInsurerSorting',
    }),
    filterNetwork(value, update) {
      update(() => {
        const needle = value.toLowerCase();
        this.optionsNetworkList = this.networkList.filter((v) =>
          v.label.toLowerCase().includes(needle),
        );
      });
    },
    filterPromoter(value, update) {
      update(() => {
        const needle = value.toLowerCase();
        this.optionsPromoterList = this.promoterList.filter((v) =>
          v.label.toLowerCase().includes(needle),
        );
      });
    },
    sortDossiers(sort) {
      this.$utils.logobj('CONFIG-DOSSIER-INSURER', 'sortDossiers', sort);
      this.setDossierInsurerSorting(sort);
      this.resetDossiers();
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreDossiers({ index, done }) {
      if (this.last || this.error) {
        this.$refs.configurationDossierInsurerList.stopScrolling();
      } else {
        this.$utils.logobj('CONFIG-DOSSIER-INSURER', 'loadMoreDossiers', index);
        this.fetchDossiers(this.filter.fields).finally(() => done());
      }
    },
    addDossierInsurerDialog() {
      this.$utils.log('CONFIG-DOSSIER-INSURER', 'addDossierInsurerDialog');
      this.showAddDialog = true;
    },
    comfirmAddDossierInsurer() {
      if (this.form.networkId && this.form.promoterId && this.form.dossierId) {
        this.showAddDialog = false;

        const dossier = {
          networkNodeId: this.form.networkId.value,
          promoterId: this.form.promoterId.value,
          dossierId: this.form.dossierId,
          productivePeriodMonth: Number.parseInt(this.form.productivePeriodMonth, 10),
          productivePeriodYear: Number.parseInt(this.form.productivePeriodYear, 10),
        };

        this.saveDossierInsurer({ dossier }).then(() => {
          this.$q.notify({
            message: this.$t('configurationProduct.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
          this.resetDossiers();
          this.$refs.configurationDossierInsurerList.forceScrolling();
        });
      } else {
        this.error = true;
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    deleteDossierInsurerClicked(invoice) {
      this.$utils.logobj('CONFIG-DOSSIER-INSURER', 'deleteDossierInsurerClicked', invoice);
      this.dossierToDelete = invoice.id;
      this.showDelDialog = true;
    },
    deleteDossierInsurerConfirmed() {
      this.$utils.log('CONFIG-DOSSIER-INSURER', 'deleteDossierInsurerConfirmed');
      this.delDossierInsurer(this.dossierToDelete).then(() => {
        this.$q.notify({
          message: this.$t('default.deleteOk'),
          color: 'secondary',
          timeout: 300,
        });
        this.resetDossiers();
      });
      this.dossierToDelete = '';
      this.showDelDialog = false;
    },
    filterDossierChange(value) {
      this.$utils.logobj('CONFIG-DOSSIER-INSURER', 'filterDossierChange', value);
      this.resetDossiers();
      this.setDossiersFilterAll({
        ...value,
        promoterId: value.promoterId === 'no-selection' ? this.loginId : value.promoterId,
      });
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
.q-field
  font-size 16px
</style>
