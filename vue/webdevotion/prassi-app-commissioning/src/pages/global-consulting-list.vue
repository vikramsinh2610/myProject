<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column fill-available">
    <div class="row q-mb-sm">
      <prassi-header-summary
        :blocks="currentSummary"
        class="col q-mr-sm"
        :pending-summary="pendingSummary"
        :pending-summary-previous="false"
      />
      <prassi-date-range-block
        :filter="filter.time"
        :disabled="pendingSummary || pendingList"
        @changed="filterDateChange"
      />
    </div>
    <div class="row q-mb-sm" style="flex: 1">
      <div class="column fill-available">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine prassi-grid"
          :disabled="pendingList"
          :row-height="66"
          :row-style="{ 'border-bottom': '10px solid #eff3f6', 'border-radius': '4px' }"
          :column-defs="columnDefs"
          :row-data="consulting"
          :default-col-def="{ resizable: true }"
          @grid-ready="onGridReady"
        >
        </ag-grid-vue>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="17px"
        color="secondary"
        text-color="white"
        @click="downloadExport()"
        icon="fa fa-download"
      />
    </q-page-sticky>

    <q-spinner-ios v-if="pendingList" :class="'center-spinner'" color="primary" :size="'80'" />
  </q-page>
</template>

<script>
/* eslint-disable unicorn/no-this-assignment */
import { mapState, mapActions } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';

import PrassiDateRangeBlock from '../components/base/prassi-date-range-block';
import PrassiHeaderSummary from '../components/base/prassi-header-summary';

const percentage = (x, y) => Math.round((100 * (y - x)) / x);

export default {
  name: 'GlobalConsultingList',
  components: {
    AgGridVue,
    PrassiDateRangeBlock,
    PrassiHeaderSummary,
  },

  computed: {
    ...mapState({
      list: (state) => state.consulting.consultingList,
      summary: (state) => state.consulting.consultingSummary,
      promoters: (state) => state.promoters.promoters.items,
      network: (state) => state.promoters.network.items,
      isFetching: (state) => state.error.isFetching,
      roles: (state) => state.promoters.roles.items,
      loginId: (state) => state.login._id,
    }),
  },

  async mounted() {
    this.computeData();
  },

  methods: {
    ...mapActions({
      fetchConsultingResults: 'consulting/fetchConsultingResults',
      fetchConsultingSummary: 'consulting/fetchConsultingSummary',
      deleteConsulting: 'consulting/deleteConsulting',
    }),

    onGridReady(params) {
      this.gridApi = params.api;
      // this.gridApi.resetRowHeights();
      this.gridApi.sizeColumnsToFit();
    },

    getRowHeight() {
      return 60;
    },

    async filterDateChange(time) {
      this.filter.time = time;
      this.computeData();
    },

    downloadExport() {
      this.gridApi.exportDataAsExcel({
        processHeaderCallback(params) {
          if (params.column.colId === 'signedDate') {
            return 'Data firma';
          }

          return params.column.colDef.headerName;
        },
      });
    },

    async computeData() {
      this.computeList();
      this.computeSummary();
    },

    async computeList() {
      this.pendingList = true;
      this.pendingListFetch = this.fetchConsultingResults({ time: this.filter.time });
      await this.pendingListFetch;
      this.pendingList = false;

      this.consulting = this.list.map((item) => {
        const status = item.signature?.procedureCompleted ? 'Firmato' : 'Bozza';
        const type = {
          noninv: 'Non investimento',
          inv: 'Investimento',
        }[item.type];

        return {
          _id: item._id,
          creationDate: item.creationDate ? this.$d(new Date(item.creationDate)) : '-',
          signedDate: item.signature?.signedDate
            ? this.$d(new Date(item.signature?.signedDate))
            : '-',
          number: item.proposalNumber,
          type,
          status,
          promoter: item.promoter?.displayName,
          network: item.promoter?.displayHierarchy,
          categories: item.categories || [],
          customerId: item.customerId,
          promoterId: item.promoterId,
          person: item.person?.displayName,
        };
      });
    },

    async computeSummary() {
      this.pendingSummary = true;
      await this.pendingListFetch;

      const previousTime = this.$utils.subtractDate(this.filter.time, 'all');
      await this.fetchConsultingSummary({ time: previousTime });
      this.pendingSummary = false;

      const currentSummary = {
        promoters: new Set(),
        customers: new Set(),
        pc: this.list.length,
      };

      this.list.forEach((item) => {
        currentSummary.promoters.add(item.userId);
        currentSummary.customers.add(item.customerId);
      });

      this.currentSummary = [
        {
          _id: 'consultants',
          title: 'dossiers.consultants',
          value: currentSummary.promoters.size,
          previousValue: this.summary.promoters,
          percentage: percentage(this.summary.promoters, currentSummary.promoters.size),
        },
        {
          _id: 'customers',
          title: 'dossiers.customers',
          value: currentSummary.customers.size,
          previousValue: this.summary.customers,
          percentage: percentage(this.summary.customers, currentSummary.customers.size),
        },
        {
          _id: 'pc',
          title: 'dossiers.pc',
          value: currentSummary.pc,
          previousValue: this.summary.pc,
          percentage: percentage(this.summary.pc, currentSummary.pc),
        },
      ];
    },
  },

  data() {
    const redirectToConsulting = (e) => {
      this.$router.push(`/persons/${e.data.customerId}/consulting/${e.data._id}`);
    };

    const redirectToPerson = (e) => {
      this.$router.push(`/persons/${e.data.customerId}`);
    };
    const deleteConsulting = async (e) => {
      this.pendingList = true;
      await this.deleteConsulting({ id: e });
      this.pendingList = false;
      this.computeData();
    };

    return {
      gridApi: undefined,

      filter: {
        time: {
          selected: 'month',
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          quarter: 1,
        },
      },

      consulting: [],
      currentSummary: [],

      statusList: [{ label: 'Bozza', value: 'draft' }],

      pendingListFetch: Promise.resolve(),
      pendingSummary: false,
      pendingList: false,

      columnDefs: [
        {
          field: 'signedDate',
          headerName: 'Data firma\nData creazione',
          // sortable: true,
          // filter: true,
          width: 200,
          cellRenderer(param) {
            return `${param.data.signedDate}<br/><span class="signed">${param.data.creationDate}</span>`;
          },
          onCellClicked(e) {
            redirectToConsulting(e);
          },
        },

        {
          field: 'type',
          headerName: 'Tipo',
          sortable: true,
          filter: true,
        },

        {
          field: 'number',
          headerName: 'Numero',
          sortable: true,
          filter: true,
          // cellClass() {
          //   return 'text-light signed';
          // },
          onCellClicked(e) {
            redirectToConsulting(e);
          },
        },

        {
          field: 'status',
          headerName: 'Stato firma',
          sortable: true,
          filter: 'agSetColumnFilter',
          filterParams: {
            applyMiniFilterWhileTyping: true,
          },
          width: 150,
          cellClass(params) {
            return {
              Bozza: 'text-red',
              Firmato: 'text-green',
            }[params.value];
          },
          cellRenderer(params) {
            const icon = {
              Bozza: 'fa-ban',
              Firmato: 'fa-check',
            }[params.value];

            return `<div class="fa ${icon}" style="width: 15px"></div>`;
          },
        },

        {
          field: 'person',
          headerName: 'Cliente',
          sortable: true,
          filter: true,

          onCellClicked(e) {
            redirectToPerson(e);
          },
        },

        { field: 'promoter', headerName: 'Promotore', sortable: true, filter: true },

        { field: 'network', headerName: 'Rete', sortable: true, filter: true },
        {
          field: '',
          headerName: '',
          onCellClicked(e) {
            deleteConsulting(e.data._id);
          },
          cellRenderer() {
            const icon = 'fa fa-trash';

            return `<div class="fa ${icon}" style="width: 15px; color: red"></div>`;
          },
        },

        // {
        //   field: 'categories',
        //   headerName: 'Categorie',
        //   sortable: true,
        //   filter: true,
        //   cellRenderer(param) {
        //     return `<div class="categories">${param.data.categories.join('<br/>')}</div>`;
        //   },
        // },
      ],
      rowData: undefined,
    };
  },
};
</script>

<style lang="scss">
.p-centered-container {
  margin: 0 auto;
  min-width: 1240px;
  max-width: fit-content;
}
.center-spinner {
  display: block;
  margin: auto;
  position: absolute;
  top: 50%;
  left: calc(50% - 40px);
  transform: translateY(-50%);
}

.prassi-grid {
  --ag-font-family: 'SairaSemiCondensed';
  --ag-background-color: transparent;
  --ag-foreground-color: #424852;
  --ag-header-background-color: #eff3f6;
  --ag-row-background-color: #fff;
  --ag-odd-row-background-color: #fff;
  --ag-borders: none;
  height: 100%;

  .ag-root-wrapper {
    border-radius: 5px;
  }

  .ag-header-cell {
    font-size: 16px;
    font-weight: 500;
  }

  .ag-header-row {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    border: solid 1px #dfe2e5;
  }

  .ag-header-cell-label .ag-header-cell-text {
    white-space: pre-wrap !important;
  }

  .ag-cell {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    background: #fff;
    line-height: 1.2;
  }

  .signed {
    color: #7f8fa4;
  }

  .categories {
    text-transform: uppercase;
  }

  .text-light {
    font-weight: 300;
  }
}
</style>
