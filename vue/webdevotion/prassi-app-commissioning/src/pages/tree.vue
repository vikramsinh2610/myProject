<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column fill-available">
    <div class="row q-mb-sm">
      <prassi-header-summary
        :blocks="summary"
        class="col q-mr-sm"
        :pending-summary="pendingSummary"
        :pending-summary-previous="pendingSummaryPrevious"
      />
      <prassi-date-range-block
        only-month
        :filter="filter.time"
        @changed="filterDateChange"
        :disabled="pendingSummary || pendingSummaryPrevious || pendingList"
      />
    </div>

    <q-card style="width: 100%" inline flat color="white" text-color="primary">
      <q-card-actions class="row q-px-lg">
        <q-input
          class="col"
          v-model="searchModel"
          debounce="500"
          clearable
          :placeholder="$t('tree.searchFilter')"
        >
          <template comfirmAddPerson>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-toggle v-model="expandAll" :label="$t('tree.expandAll')" color="green" />
        <q-toggle v-model="hideNodes" :label="$t('tree.hideHidden')" color="green" />
      </q-card-actions>
    </q-card>

    <q-card v-if="tree.length !== 0" class="text-primary bg-white q-px-lg q-pb-lg" inline flat>
      <q-card-section>
        <q-tree
          ref="tree"
          :nodes="tree"
          node-key="_id"
          :selected.sync="selected"
          :filter="filterTree"
          :filter-method="filterMethod"
        >
          <template #default-header="prop">
            <div class="row items-center">
              <q-chip
                class="p-c-chip lowercase"
                dense
                :color="$utils.getRoleColor(roles, prop.node.roleId)"
                text-color="white"
              >
                {{ $utils.getRoleArea(roles, prop.node.roleId) }}
              </q-chip>
              <q-toggle disable v-model="prop.node.enabled" color="green" />
              <div>
                <span class="text-weight-bold text-primary">{{ `${prop.node.name}` }}</span>
                <span class="text-weight-light text-black"> &nbsp;{{ ' / ' }}&nbsp; </span>
                <span class="text-weight-light text-black">
                  {{ prop.node.promoterName || 'VUOTO' }}
                </span>
                <span class="text-weight-light text-black"> &nbsp;{{ ' / ' }}&nbsp; </span>
                <span class="text-weight-light text-black">
                  {{ $utils.getRoleName(roles, prop.node.roleId) }}
                </span>
                <q-menu
                  v-if="$user.roleID >= 1000"
                  content-class="bg-white text-primary"
                  auto-close
                  touch-position
                  @hide="menuHiddenEvent"
                >
                  <q-list separator link>
                    <q-item clickable v-close-popup @click.native="editNodeButton">
                      <q-item-section>{{ $t('tree.edit') }}</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click.native="addNodeButton">
                      <q-item-section>{{ $t('tree.add') }}</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click.native="addNodeSiblingButton">
                      <q-item-section>{{ $t('tree.add-sibling') }}</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click.native="deleteNodeButton">
                      <q-item-section>{{ $t('tree.delete') }}</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click.native="orderNodeButton">
                      <q-item-section>{{ $t('tree.order') }}</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click.native="copyNodeButton">
                      <q-item-section>{{ $t('tree.copy') }}</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click.native="moveCustomersButton">
                      <q-item-section>{{ $t('tree.move') }}</q-item-section>
                    </q-item>
                    <q-item
                      :disable="copiedNode === undefined"
                      clickable
                      v-close-popup
                      @click.native="pasteNodeButton"
                    >
                      <q-item-section>
                        {{ $t('tree.paste') }} {{ copiedNode ? copiedNode.name : '' }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </div>
            </div>
          </template>
        </q-tree>
      </q-card-section>
    </q-card>

    <prassi-empty-list v-if="tree.length === 0 && !isFetching" />

    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />

    <q-dialog v-model="showMoveCustomersDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('tree.moveTitleDialog') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-my-xs">
            <q-select
              class="col select-ellipsis"
              use-input
              clearable
              v-model="networkId"
              :label="$t('filterPromoterBlock.searchNetwork')"
              :options="optionsNetworkList"
              @filter="filterNetwork"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.applyButton')" @click="moveCustomersApply" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEditDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('tree.edit') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-between q-my-xs">
            <q-input v-model="editNode.name" type="text" :label="$t('tree.name')" />
            <q-toggle v-model="editNode.enabled" :label="$t('tree.enabled')" color="green" />
          </div>
          <div class="row q-my-xs">
            <q-select
              class="col"
              use-input
              clearable
              v-model="editPromoter"
              :label="$t('tree.promoter')"
              :options="optionsPromoterList"
              @filter="filterPromoter"
            />
          </div>
          <div class="row q-my-xs">
            <q-select
              class="col"
              v-model="editRole"
              :label="$t('tree.roleType')"
              :options="rolesList"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.applyButton')" @click="saveNode" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('tree.add') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-between q-my-xs">
            <q-input v-model="editNode.name" type="text" :label="$t('tree.name')" />
            <q-toggle v-model="editNode.enabled" :label="$t('tree.enabled')" color="green" />
          </div>
          <div class="row q-my-xs">
            <q-select
              class="col"
              use-input
              clearable
              v-model="editPromoter"
              :label="$t('tree.promoter')"
              :options="optionsPromoterList"
              @filter="filterPromoter"
            />
          </div>
          <div class="row q-my-xs">
            <q-select
              class="col"
              v-model="editRole"
              :label="$t('tree.roleType')"
              :options="rolesList"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.applyButton')" @click="saveAddNode" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteNodeDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="fas fa-trash-alt" color="primary" text-color="white" />
          <div class="col row column">
            <span class="q-ml-sm">
              {{ $t('tree.confirmDelete') }} {{ deleteNode ? deleteNode.name : '' }}
            </span>
            <span
              v-if="deleteNode && deleteNode.children && deleteNode.children.length > 0"
              class="q-ml-sm text-red"
            >
              {{ $t('tree.containsChildren') }}
            </span>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('default.cancel')" color="primary" v-close-popup />
          <q-btn
            flat
            :label="$t('default.okButton')"
            color="primary"
            v-close-popup
            @click="deleteNodeAction"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="copyMonthTreeDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="fas fa-copy" color="primary" text-color="white" />
          <div class="col row column">
            <span class="q-ml-sm">
              {{ $t('tree.confirmCopyMonthTree') }}
            </span>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('default.cancel')" color="primary" v-close-popup />
          <q-btn
            flat
            :label="$t('default.okButton')"
            color="primary"
            v-close-popup
            @click="copyMonthTreeButton"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="recreateTreeDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="fas fa-copy" color="primary" text-color="white" />
          <div class="col row column">
            <span class="q-ml-sm">
              {{ $t('tree.recreateTree') }}
            </span>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('default.cancel')" color="primary" v-close-popup />
          <q-btn
            flat
            :label="$t('default.okButton')"
            color="primary"
            v-close-popup
            @click="recreateTreeButton"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-sticky v-if="$user.roleID >= 1000" position="bottom-right" :offset="[18, 18]">
      <q-fab icon="fa fa-plus-white" active-icon="fa fa-times" direction="up" color="secondary">
        <q-fab-action @click="copyMonthTreeDialog = true" color="primary" icon="fa fa-copy">
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('tree.copyMonthTree') }}
          </q-tooltip>
        </q-fab-action>
        <q-fab-action @click="recreateTreeDialog = true" color="red" icon="fa fa-plus-square">
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('default.reCreate') }}
          </q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiDateRangeBlock from '../components/base/prassi-date-range-block';
import PrassiHeaderSummary from '../components/base/prassi-header-summary';
import PrassiEmptyList from '../components/base/prassi-empty-list';

export default {
  name: 'Tree',
  data() {
    return {
      pendingSummary: false,
      pendingSummaryPrevious: false,
      pendingList: false,
      expandAll: false,
      hideNodes: true,
      searchModel: '',
      filterTree: '*',
      showEditDialog: false,
      addSibling: true,
      showAddDialog: false,
      deleteNodeDialog: false,
      copyMonthTreeDialog: false,
      recreateTreeDialog: false,
      showMoveCustomersDialog: false,
      networkId: undefined,
      // eslint-disable-next-line unicorn/no-null
      selected: null,
      // eslint-disable-next-line unicorn/no-null
      persistSelected: null,
      selectedNode: {
        // eslint-disable-next-line unicorn/no-null
        _id: null,
        enabled: false,
      },
      copiedNode: undefined,
      deleteNode: undefined,
      editNode: {
        _id: undefined,
        enabled: false,
      },
      editPromoter: {
        label: '',
        value: '',
      },
      editRole: {
        label: '',
        value: '',
      },
      optionsPromoterList: this.promoterList,
      optionsNetworkList: this.networkList,
      menuFilter: [
        {
          _id: 'all',
          label: this.$t('dossiers.all'),
        },
        {
          _id: 'direct',
          label: this.$t('dossiers.direct'),
        },
        {
          _id: 'indirect',
          label: this.$t('dossiers.indirect'),
        },
      ],
      typeList: [
        {
          label: 'Tutti',
          value: 'no-selection',
        },
        {
          label: 'Sottoscrizione',
          value: 5,
        },
        {
          label: 'Versamento aggiuntivo',
          value: 2,
        },
        {
          label: 'Fuori sacco',
          value: 9,
        },
        {
          label: 'Recesso',
          value: 6,
        },
      ],
      statusList: [
        {
          label: 'Tutti',
          value: 'no-selection',
        },
        {
          label: 'In vigore',
          value: 6,
        },
        {
          label: 'In elaborazione',
          value: 4,
        },
      ],
    };
  },
  components: {
    PrassiHeaderSummary,
    PrassiDateRangeBlock,
    PrassiEmptyList,
  },
  mounted() {
    this.pendingList = true;
    this.pendingSummary = true;
    this.pendingSummaryPrevious = true;
    this.resetDossiersSearch();
    const filterPreviousDate = this.$utils.subtractDate(this.filter.time, 'all');
    this.setDossiersFilterPreviousDate(filterPreviousDate);
    this.fetchContractsSummary(this.filter.fields.promoterId || this.loginId).finally(
      // eslint-disable-next-line no-return-assign
      () => (this.pendingSummary = false),
    );
    this.fetchContractsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
      // eslint-disable-next-line no-return-assign
      () => (this.pendingSummaryPrevious = false),
    );
    this.fetchTree().finally(
      // eslint-disable-next-line no-return-assign
      () => (this.pendingList = false),
    );
    this.fetchAllPromoters();
    this.fetchNetworkPeriod({
      year: this.filter.time.year,
      month: this.filter.time.month,
      quarter: this.filter.time.quarter,
      selected: this.filter.time.selected,
    });
  },
  watch: {
    searchModel(value) {
      this.filterTree = value || '*';
      this.expandAll = true;
    },
    expandAll(value) {
      if (value) {
        this.$refs.tree.expandAll();
      } else {
        this.$refs.tree.collapseAll();
      }
    },
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      loginId: (state) => state.login._id,
      summary: (state) => [
        {
          _id: 'consultants',
          title: 'dossiers.consultants',
          value: state.dossiers.summary.nodes,
          previousValue: state.dossiers.summary.previousNodes,
          percentage: state.dossiers.summary.percentageNodes,
        },
        {
          _id: 'insured',
          title: 'dossiers.insured',
          value: state.dossiers.summary.insured ? state.dossiers.summary.insured : undefined,
          previousValue: state.dossiers.summary.previousInsured
            ? state.dossiers.summary.previousInsured
            : undefined,
          percentage: state.dossiers.summary.percentageInsured,
        },
        {
          _id: 'premiums',
          title: 'dossiers.premiums',
          value: state.dossiers.summary.premiums / 100,
          previousValue: state.dossiers.summary.previousPremiums / 100,
          percentage: state.dossiers.summary.percentagePremiums,
          currency: true,
          flickr: true,
        },
        {
          _id: 'iv',
          title: 'dossiers.iv',
          value: state.dossiers.summary.iv / 100,
          previousValue: state.dossiers.summary.previousIV / 100,
          percentage: state.dossiers.summary.percentageIV,
        },
        {
          _id: 'pc',
          title: 'dossiers.pc',
          value: state.dossiers.summary.pc / 100,
          previousValue: state.dossiers.summary.previousPC / 100,
          percentage: state.dossiers.summary.percentagePC,
        },
      ],
      dossiers: (state) => state.dossiers.dossiers.items,
      promoters: (state) => state.promoters.promoters.items,
      network: (state) => state.promoters.network.items,
      roles: (state) => state.promoters.roles.items,
      tree: (state) => state.dossiers.tree.item,
      last: (state) => state.dossiers.dossiers.lastRecord,
      filter: (state) => state.dossiers.filter,
      isFetching: (state) => state.error.isFetching,
      companies: (state) => state.acquittance.companies.items,
    }),
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
    promoterList() {
      const promoterList = [];

      this.promoters.forEach((el) => {
        promoterList.unshift({
          label: el.displayName,
          value: el._id,
        });
      });

      promoterList.unshift({
        label: '',
        value: '',
      });

      return promoterList;
    },
    rolesList() {
      const roleTypeList = [];

      this.roles.forEach((el) => {
        roleTypeList.unshift({
          label: el.name,
          value: el.networkId,
        });
      });

      return roleTypeList;
    },
    companyList() {
      return this.companies.map((el) => ({
        label: el.name,
        value: el._id,
      }));
    },
  },
  methods: {
    ...mapActions({
      fetchContractsSummary: 'dossiers/fetchContractsSummary',
      fetchContractsSummaryPrevious: 'dossiers/fetchContractsSummaryPrevious',
      fetchContracts: 'dossiers/fetchContracts',
      fetchAllPromoters: 'promoters/fetchAllPromoters',
      fetchTree: 'dossiers/fetchTree',
      createTree: 'dossiers/createTree',
      createTreeCopyPrevious: 'dossiers/createTreeCopyPrevious',
      createTreeNode: 'dossiers/createTreeNode',
      saveTreeNode: 'dossiers/saveTreeNode',
      moveCustomerNode: 'dossiers/moveCustomerNode',
      deleteTreeNode: 'dossiers/deleteTreeNode',
      orderTreeNode: 'dossiers/orderTreeNode',
      moveTreeNode: 'dossiers/moveTreeNode',
      fetchNetworkPeriod: 'promoters/fetchNetworkPeriod',
    }),
    ...mapMutations({
      resetDossiersSearch: 'dossiers/resetDossiersSearch',
      resetPromoterSearch: 'promoters/resetPromoterSearch',
      resetDossiersSummary: 'dossiers/resetDossiersSummary',
      resetDossiers: 'dossiers/resetDossiers',
      setDossiersFilterDate: 'dossiers/setDossiersFilterDate',
      setDossiersFilterPreviousDate: 'dossiers/setDossiersFilterPreviousDate',
      setDossiersFilterSelected: 'dossiers/setDossiersFilterSelected',
      setDossiersFilterPromoter: 'dossiers/setDossiersFilterPromoter',
      setDossiersFilterAll: 'dossiers/setDossiersFilterAll',
    }),
    filterNetwork(value, update) {
      update(() => {
        const needle = value.toLowerCase();
        this.optionsNetworkList = this.networkList.filter((v) =>
          v.label.toLowerCase().includes(needle),
        );
      });
    },
    filterMethod(node, filter) {
      const filterLowerCase = filter.toLowerCase();
      const roleName = this.$utils.getRoleName(this.roles, node.roleId).toLowerCase();

      if (filter === '*') {
        return !this.hideNodes || node.enabled;
      }

      return (
        (node.promoterName.toLowerCase().includes(filterLowerCase) ||
          roleName.includes(filterLowerCase) ||
          node.name.toLowerCase().includes(filterLowerCase)) &&
        (!this.hideNodes || node.enabled)
      );
    },
    menuHiddenEvent() {
      // eslint-disable-next-line unicorn/no-null
      this.selected = null;
    },
    moveCustomersApply() {
      this.$utils.logobj('TREE', 'moveCustomersApply', this.editNode);
      this.$utils.logobj('TREE', 'moveCustomersApply', this.editPromoter);
      this.$utils.logobj('TREE', 'moveCustomersApply', this.editRole);
      this.showMoveCustomersDialog = false;
      this.$q.loading.show({ delay: 200 });
      this.moveCustomerNode({
        nodeTargetId: this.editNode._id,
        nodeDestinationId: this.networkId.value,
      })
        .then(() => {
          this.$q.notify({
            message: this.$t('tree.okOperation'),
            color: 'secondary',
            timeout: 300,
          });
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },
    saveNode() {
      this.$utils.logobj('TREE', 'saveNode', this.editNode);
      this.$utils.logobj('TREE', 'saveNode', this.editPromoter);
      this.$utils.logobj('TREE', 'saveNode', this.editRole);
      this.showEditDialog = false;
      this.saveTreeNode({
        nodeId: this.editNode._id,
        nodeBody: {
          ...this.editNode,
          promoterId: this.editPromoter ? this.editPromoter.value : '',
          promoterName: this.editPromoter ? this.editPromoter.label : '',
          roleId: this.editRole.value,
        },
        // eslint-disable-next-line sonarjs/no-identical-functions
      }).then(() => {
        this.$q.notify({
          message: this.$t('tree.okOperation'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    saveAddNode() {
      this.$utils.logobj('TREE', 'saveNode', this.editNode);
      this.$utils.logobj('TREE', 'saveNode', this.editPromoter);
      this.$utils.logobj('TREE', 'saveNode', this.editRole);
      this.showAddDialog = false;
      this.createTreeNode({
        nodeId: this.persistSelected,
        addSibling: this.addSibling,
        nodeBody: {
          ...this.editNode,
          promoterId: this.editPromoter.value,
          promoterName: this.editPromoter.label,
          roleId: this.editRole.value,
        },
        // eslint-disable-next-line sonarjs/no-identical-functions
      }).then(() => {
        this.$q.notify({
          message: this.$t('tree.okOperation'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    deleteNodeAction() {
      this.$utils.logobj('TREE', 'saveNode', this.deleteNode);
      this.deleteNodeDialog = false;
      this.deleteTreeNode(this.deleteNode._id).then(() => {
        this.$q.notify({
          message: this.$t('tree.nodeDelete'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    editNodeButton() {
      this.$utils.log('TREE', 'editNode');
      this.$utils.logobj('TREE', 'editNode', this.selected);
      const node = this.$utils.first({ children: this.tree }, this.selected);
      if (node) {
        this.$utils.logobj('TREE', 'found', node);
        this.editNode = { ...node };
        this.editPromoter = {
          value: node.promoterId,
          label: node.promoterName,
        };
        this.editRole = {
          value: node.roleId,
          label: this.$utils.getRoleName(this.roles, node.roleId),
        };
        this.showEditDialog = true;
      } else {
        this.$q.notify(this.$t('tree.noSelection'));
      }
    },
    addNodeButton() {
      this.$utils.log('TREE', 'addNodeButton');
      this.persistSelected = this.selected;
      this.editNode = {
        _id: undefined,
        enabled: false,
      };
      this.editPromoter = {
        label: '',
        value: '',
      };
      this.editRole = {
        label: 'Nessuno',
        value: 'none',
      };
      this.addSibling = false;
      this.showAddDialog = true;
    },
    addNodeSiblingButton() {
      this.$utils.log('TREE', 'addNodeSiblingButton');
      this.persistSelected = this.selected;
      this.editNode = {
        _id: undefined,
        enabled: false,
      };
      this.editPromoter = {
        label: '',
        value: '',
      };
      this.editRole = {
        label: 'Nessuno',
        value: 'none',
      };
      this.addSibling = true;
      this.showAddDialog = true;
    },
    orderNodeButton() {
      this.$utils.log('TREE', 'pasteNodeButton');
      this.persistSelected = this.selected;
      this.orderTreeNode(this.persistSelected);
    },
    moveCustomersButton() {
      const node = this.$utils.first({ children: this.tree }, this.selected);
      if (node) {
        this.$utils.logobj('TREE', 'found', node);
        this.editNode = { ...node };
        this.editPromoter = {
          value: node.promoterId,
          label: node.promoterName,
        };
        this.editRole = {
          value: node.roleId,
          label: this.$utils.getRoleName(this.roles, node.roleId),
        };
        this.showMoveCustomersDialog = true;
      } else {
        this.$q.notify(this.$t('tree.noSelection'));
      }
    },
    copyNodeButton() {
      this.$utils.log('TREE', 'copyNodeButton');
      const node = this.$utils.first({ children: this.tree }, this.selected);
      if (node) {
        this.$utils.logobj('TREE', 'found', node);
        this.copiedNode = { ...node };
        this.$q.notify({
          message: this.$t('tree.nodeCopied'),
          color: 'secondary',
          timeout: 300,
        });
      } else {
        this.$q.notify(this.$t('tree.noSelection'));
      }
    },
    pasteNodeButton() {
      this.$utils.log('TREE', 'pasteNodeButton');
      this.persistSelected = this.selected;
      this.moveTreeNode({
        sourceNodeId: this.copiedNode._id,
        destinationNodeId: this.persistSelected,
      }).then(() => {
        this.$q.notify({
          message: this.$t('tree.nodePasted'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    deleteNodeButton() {
      this.$utils.log('TREE', 'deleteNodeButton');
      const node = this.$utils.first({ children: this.tree }, this.selected);
      if (node) {
        this.$utils.logobj('TREE', 'found', node);
        this.deleteNode = { ...node };
        this.deleteNodeDialog = true;
      } else {
        this.$q.notify(this.$t('tree.noSelection'));
      }
    },
    copyMonthTreeButton() {
      this.$utils.log('TREE', 'copyMonthTreeButton');
      this.copyMonthTreeDialog = false;
      // eslint-disable-next-line sonarjs/no-identical-functions
      this.createTreeCopyPrevious().then(() => {
        this.$q.notify({
          message: this.$t('tree.okOperation'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    recreateTreeButton() {
      this.$utils.log('TREE', 'recreateTreeButton');
      this.recreateTreeDialog = false;
      // eslint-disable-next-line sonarjs/no-identical-functions
      this.createTree().then(() => {
        this.$q.notify({
          message: this.$t('tree.okOperation'),
          color: 'secondary',
          timeout: 300,
        });
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
    filterDossierChange(value) {
      this.$utils.logobj('TREE', 'filterDossierChange', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.resetDossiers();
      this.resetDossiersSummary();
      this.setDossiersFilterAll({
        ...value,
        promoterId: value.promoterId === 'no-selection' ? this.loginId : value.promoterId,
      });
      this.fetchContractsSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchContractsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.fetchTree().finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingList = false),
      );
      this.fetchNetworkPeriod({
        year: this.filter.time.year,
        month: this.filter.time.month,
        quarter: this.filter.time.quarter,
        selected: this.filter.time.selected,
      });
    },
    filterTypeChange(value) {
      this.$utils.logobj('DOSSIERS', 'filterDossierChange', value);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.resetDossiers();
      this.resetDossiersSummary();
      this.setDossiersFilterSelected(value.selected);
      this.fetchContractsSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchContractsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.fetchTree().finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingList = false),
      );
      this.fetchNetworkPeriod({
        year: this.filter.time.year,
        month: this.filter.time.month,
        quarter: this.filter.time.quarter,
        selected: this.filter.time.selected,
      });
    },
    filterDateChange(filterDate) {
      this.$utils.logobj('DOSSIERS', 'filterDate', filterDate);
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.resetDossiers();
      this.resetDossiersSummary();
      this.setDossiersFilterDate(filterDate);
      const filterPreviousDate = this.$utils.subtractDate(filterDate, 'all');
      this.setDossiersFilterPreviousDate(filterPreviousDate);
      this.fetchContractsSummary(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummary = false),
      );
      this.fetchContractsSummaryPrevious(this.filter.fields.promoterId || this.loginId).finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingSummaryPrevious = false),
      );
      this.fetchTree().finally(
        // eslint-disable-next-line no-return-assign
        () => (this.pendingList = false),
      );
      this.fetchNetworkPeriod({
        year: this.filter.time.year,
        month: this.filter.time.month,
        quarter: this.filter.time.quarter,
        selected: this.filter.time.selected,
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 1240px
  max-width fit-content
.center-spinner
  display block
  margin auto
</style>
