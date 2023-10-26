<template>
  <div>
    <InfoDialog @openDoc="openDoc" v-if="false" />
    <ButtonRenderer v-if="false" />
    <v-row style="min-height: 300px" no-gutters class="divRigaStyle">
      <v-col cols="6">
        <p class="text-h6 text--primary" style="margin-top: 30px; margin-left: 30px">
          Scegli Movimento
          <v-tooltip bottom style="max-width: 500px">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="ml-2" size="30" v-bind="attrs" v-on="on"
                >mdi-help-circle-outline</v-icon
              >
            </template>
            <span class="body-1" style="max-width: 500px">
              Scegliere movimento selezionando la riga in tabella, poi confermare /
              modificare la ragione sociale associata al movimento dal Matcher. Quindi
              selezionare una o piu' partite e poi chiudere la partia eventualmente
              aggiungendo degli aggiustamenti di chiusura. Cliccare su "disattiva" sui
              movimenti gestiti esternamente al matcher.
            </span>
          </v-tooltip>
        </p>
        <p class="text-h8 text--primary" style="margin-left: 30px">
          Filtrati: {{ num_filtrati_movimenti }} Scaricati:
          {{ num_scaricati_movimenti }} / Totali: {{ num_tot_movimenti }}
        </p>
      </v-col>
      <v-col cols="6">
        <v-row style="margin-top: 30px">
          <v-switch
            class="text-right mr-9 mt-10"
            v-model="ancheDisattivati"
            label="anche disattivati"
            @change="changeStateDisattivati()"
          ></v-switch>
          <v-switch
            class="text-right mr-9 mt-10"
            v-model="includiAbbinati"
            label="Includi abbinati"
            @change="changeState()"
          ></v-switch>
          <v-tooltip bottom style="max-width: 500px">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="ml-2 mt-5" size="30" v-bind="attrs" v-on="on"
                >mdi-help-circle-outline</v-icon
              >
            </template>
            <span class="body-1" style="max-width: 500px">
              La tabella mostra tutti i movimenti validi, associati ad un movimento
              bancario, che non sono già parte di un match proposto. E' possibile mostrare
              anche i movimenti disattivati o quelli presenti in match proposti.
            </span>
          </v-tooltip>
          <v-btn class="text-right ml-5 mr-9 mt-10" @click="reloadMovimenti">
            Reload Movimenti
          </v-btn>
        </v-row>
      </v-col>
      <v-row class="mt-4">
        <p
          style="
            margin-top: 20px;
            margin-left: 50px;
            margin-right: 30px;
            margin-bottom: 30px;
          "
        >
          Tipo Documento
        </p>
        <v-select
          style="padding-right: 5px; padding-left: 5px; max-width: 300px"
          clearable
          :items="tipidocumento"
          item-text="descrizione"
          item-value="descrizione"
          label="Scegli Documento"
          v-model="documentoDaCercare"
        >
        </v-select>
        <p
          style="
            margin-top: 20px;
            margin-left: 50px;
            margin-right: 30px;
            margin-bottom: 30px;
          "
        >
          Ricerca:
        </p>
        <v-text-field
          style="padding-right: 5px; padding-left: 5px; max-width: 400px"
          v-model="ricercaLibera"
          background-color="rgba(255, 255, 255, 0.505)"
        ></v-text-field>
        <v-btn class="text-right ml-5 mt-4" @click="exportCsv"> Export CSV </v-btn>
      </v-row>
      <ag-grid-vue
        style="width: 95%; margin-left: 30px; margin-top: 30px; max-height: 500px"
        class="ag-theme-alpine"
        :columnDefs="headersMovimenti"
        :rowData="movimenti"
        rowSelection="single"
        :defaultColDef="defaultColDef"
        @row-selected="onRowSelected"
        :gridOptions="gridOptions"
        :isExternalFilterPresent="isExternalFilterPresent"
        :doesExternalFilterPass="doesExternalFilterPass"
      >
      </ag-grid-vue>
      <v-row>
        <v-col class="text-right">
          <v-btn x-small class="ma-3" @click="saveState"> Save State </v-btn>
          <v-btn x-small class="ma-3" @click="loadState"> Load State </v-btn>
          <v-btn x-small class="ma-3" @click="resetState"> Reset State </v-btn>
        </v-col>
      </v-row>
    </v-row>
    <div v-if="showModalDoc">
      <DocOpened :idDoc="currentDoc" theme="" @close="openDoc">
        <div></div>
        <v-btn class="btnOkStyle" @click="openDoc" elevation="0">ok</v-btn>
      </DocOpened>
    </div>
    <PopUpMovimento
      @openDoc="openDoc($event)"
      :movimentoId="movimentoPopup"
      :showModal="showModalMovimento"
    >
    </PopUpMovimento>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import InfoDialog from "@/components/wizard/InfoDialog.vue";
import ButtonRenderer from "@/components/wizard/ButtonRenderer.vue";
import EventBus, { ACTIONS } from "../../components/Helpers/EventBus.js";
import DocOpened from "@/components/ManualMatch/DocOpened.vue";
import PopUpMovimento from "@/components/PopUpMovimento.vue";

export default {
  props: {
    generatoreEventi: null,
    refreshIt: null,
  },
  data() {
    return {
      movimentoSelezionato: false,
      movimentoCorrente: null,
      firsTime: true,
      headersMovimenti: [
        {
          colId: "Ragione Sociale",
          headerName: "Ragione Sociale",
//          headerCheckboxSelection: true,
          field: "ragionesociale",
          width: 300,
          checkboxSelection: (params) => {
            return !params.data.is_movimento_disattivato;
          },
          cellStyle: (params) => {
            return params.data.is_movimento_disattivato
              ? { "pointer-events": "none", opacity: "0.4" }
              : "";
          },
        },
        {
          colId: "Data Op",
          headerName: "Data Op",
          field: "dataoperazione",
          sort: "desc",
          width: 120,
          valueFormatter: (params) =>
            new Date(params.value).toLocaleString("it-IT", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }),
        },
        {
          colId: "Importo Valuta",
          headerName: "Importo Valuta",
          field: "valuta_importo",
          width: 150,
          valueFormatter: (params) =>
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: params.data.valuta,
            }).format(params.value),
        },
        { colId: "Valuta", headerName: "Valuta", field: "valuta", width: 100 },
        {
          colId: "Importo Euro",
          headerName: "Importo Euro",
          field: "eur_importo",
          width: 150,
          valueFormatter: (params) =>
            new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(
              params.value
            ),
        },
        {
          colId: "Riferimento Piteco",
          headerName: "Riferimento Piteco",
          field: "codice_piteco",
        },
        { colId: "SAP ID", headerName: "SAP ID", field: "sapid" },
        {
          colId: "Micro",
          headerName: "Micro",
          headerTooltip: 'true se micro-movimento parte di macro-transazione', 
          field: "is_sottomovimento_con_supermovimento_aggregato",
        },
        { colId: "Tipo", headerName: "Tipo", field: "tipo", hide: true },
        { colId: "NoteHidden", headerName: "Note", field: "notemovimento", hide: true },
        { colId: "contoHidden", headerName: "conto", field: "conto", hide: true },
        {
          colId: "iddbmovimentoHidden",
          headerName: "iddbmovimento",
          field: "iddbmovimento",
          hide: true,
        },
        {
          colId: "iddbdettagliomovimentoHidden",
          headerName: "iddbdettagliomovimento",
          field: "iddbdettagliomovimento",
          hide: true,
        },
        {
          colId: "iddocumentoHidden",
          headerName: "iddocumento",
          field: "iddocumento",
          hide: true,
        },
        {
          headerName: "Disattiva",
          field: "is_movimento_disattivato",
          cellRenderer: "ButtonRenderer",
          cellRendererParams: {
            clicked: this.disattivaMovimento.bind(this),
          },
        },
        {
          headerName: "Note",
          field: "notemovimento",
          cellRenderer: "InfoDialog",
          cellRendererParams: (params) => ({
            movimento: params.data,
            note: params.data.notemovimento,
            tipo: params.data.tipo,
            conto: params.data.conto,
            idmovimento: params.data.iddbmovimento,
            idmovimentodettaglio: params.data.iddbdettagliomovimento,
            iddocumento: params.data.iddocumento,
          }),
        },
      ],
      defaultColDef: {
        flex: 1,
        sortable: true,
        filter: true,
        editable: false,
        resizable: true,
      },
      csvColumns: [
        "Ragione Sociale",
        "Data Op",
        "Importo Valuta",
        "Valuta",
        "Importo Euro",
        "Riferimento Piteco",
        "SAP ID",
        "Tipo",
        "NoteHidden",
        "contoHidden",
        "iddbmovimentoHidden",
        "iddbdettagliomovimentoHidden",
        "iddocumentoHidden",
      ],
      gridOptions: {
        isRowSelectable: (params) => {
          return !params.data.is_movimento_disattivato;
        },
        getRowStyle: (params) => {
          if (params.data.is_movimento_disattivato) {
            return { background: "gray" };
          }
        },
        tooltipShowDelay: 500,
        enableCellTextSelection: true,
      },
      gridApi: null,
      tuttiNonAbbinati: false,
      includiAbbinati: false,
      ancheDisattivati: false,
      showModalDoc: false,
      currentDoc: null,
      tipidocumento: [],
      documentoDaCercare: null,
      ricercaLibera: "",
      showModalMovimento: 0,
      movimentoPopup: [],
    };
  },
  components: {
    AgGridVue,
    InfoDialog,
    ButtonRenderer,
    DocOpened,
    PopUpMovimento,
  },
  async created() {
    console.log("Before Create ");
    if (!this.$store.getters["match/getMovimenti"]) {
      console.log(
        "Non ci sono movimenti, caricare, non abbinati: " + this.tuttiNonAbbinati
      );
      this.$store.commit("auth/setIsLoading", false);
      let params = new URLSearchParams();
      params.append("includi_disattivati_manualmente", this.ancheDisattivati);

      params.append("escludi_coinvolti_in_match", !this.includiAbbinati);
      params.append("includi_movimenti_coinvolti_in_match_confermati_manualmente", false);

      await this.$store.dispatch("match/LoadMovimenti", params);
    }
    if (!this.$store.getters["match/getStakeholders"]) {
      console.log("Non ci sono stakholders, carica");
      await this.$store.dispatch("match/LoadStakeholders");
    }
    this.tipidocumento = structuredClone(this.$store.getters["match/getTipiDocumento"]);
    this.tipidocumento.unshift({
      descrizione: "All",
      iddb: null,
    });
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    EventBus.$on(ACTIONS.OPEN_DOC, (message) => {
      this.openDoc(message);
    });
    EventBus.$on(ACTIONS.OPEN_MOV, (message) => {
      4;
      this.openMovimento(message);
    });
    this.reloadMovimenti();
    this.loadState();
  },

  watch: {
    generatoreEventi: function () {
      //questo e' solo un generatore di eventi
      this.reloadMovimenti();
    },
    refreshIt: function () {
      //questo e' solo un generatore di eventi di refresh
      console.log("going to refresh it");
      this.gridApi.refreshCells();
    },
    documentoDaCercare: function (newVal, oldVal) {
      // watch it
      console.log("documentoDaCercare changed: ", newVal, " | was: ", oldVal);
      this.documentoDaCercare = newVal;
      this.gridApi.onFilterChanged();
    },
    ricercaLibera: function (newVal, oldVal) {
      // watch it
      console.log("ricercaLibera changed: ", newVal, " | was: ", oldVal);
      this.gridApi.setQuickFilter(newVal);
    },
  },

  methods: {
    async disattivaMovimento(params) {
      try {
        console.log(`${params.data.artificial_id_movimento} was clicked`);
        if (params.data.is_movimento_disattivato) {
          await this.$store.dispatch("match/UpdateMovimento", {
            idMov: params.data.artificial_id_movimento,
            op: "attiva",
          });
        } else {
          await this.$store.dispatch("match/UpdateMovimento", {
            idMov: params.data.artificial_id_movimento,
            op: "disattiva",
          });
        }
        this.reloadMovimenti();
        EventBus.$emit(ACTIONS.SNACKBAR_OK, "Movimento Disattivato");
      } catch (error) {
        await this.$store.commit("auth/setIsLoading", false, { root: true });
        console.log(error);
        EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema nella inattivazione del movimento");
      }
    },
    onRowSelected(event) {
      if (!event.node.selected) return;
      console.log("movimento settato");
      this.movimentoCorrente = event.node.data;
      console.log(this.movimentoCorrente);
      this.$emit("setMovimento", this.movimentoCorrente);
      if (this.firsTime) {
        this.firsTime = false;
        window.scrollBy(0, 300);
      }
    },
    async reloadMovimenti() {
      console.log(
        "reload movimenti, con: tuttiNonAbbinati: " +
          this.tuttiNonAbbinati +
          " this.includiAbbinati: " +
          this.includiAbbinati +
          " ancheDisattivati " +
          this.ancheDisattivati
      );
      this.$store.commit("auth/setIsLoading", false);
      let params = new URLSearchParams();
      params.append("includi_disattivati_manualmente", this.ancheDisattivati);

      params.append("escludi_coinvolti_in_match", !this.includiAbbinati);
      params.append("includi_movimenti_coinvolti_in_match_confermati_manualmente", false);

      await this.$store.dispatch("match/LoadMovimenti", params);
      EventBus.$emit(ACTIONS.SNACKBAR_OK, "Movimenti Ricaricati");
    },
    async changeState() {
      EventBus.$emit(ACTIONS.SNACKBAR_OK, "Reloading movimenti");
      this.reloadMovimenti();
    },
    async changeStateDisattivati() {
      EventBus.$emit(ACTIONS.SNACKBAR_OK, "Reloading movimenti");
      this.reloadMovimenti();
    },
    openDoc(iddoc) {
      console.log("Show documento: " + iddoc);
      this.currentDoc = iddoc;
      this.showModalDoc = !this.showModalDoc;
    },
    openMovimento(movimento) {
      console.log("Apri popup movimento");
      console.log(movimento);
      this.movimentoPopup = movimento.iddbmovimento;
      this.showModalMovimento++;
    },
    exportCsv() {
      this.gridApi.exportDataAsCsv({
        columnKeys: this.csvColumns,
        columnSeparator: ";",
      });
    },
    async saveState() {
      let prefs = this.gridOptions.columnApi.getColumnState();
      this.$store.commit("auth/setPreferences", prefs);
      //              await this.$store.dispatch("auth/SavePreferences");

      console.log("column state saved");
    },
    async loadState() {
      if (!this.$store.getters["auth/getPreferences"]) {
        console.log("no columns state to restore by, you must save state first");
        return;
      }
      this.gridOptions.columnApi.applyColumnState({
        state: this.$store.getters["auth/getPreferences"],
        applyOrder: true,
      });
      console.log("column state restored");
    },
    resetState() {
      this.gridOptions.columnApi.resetColumnState();
      console.log("column state reset");
    },
    isExternalFilterPresent() {
      return this.documentoDaCercare && this.documentoDaCercare !== "All";
    },
    doesExternalFilterPass(node) {
      console.log("check external filter pass: " + this.documentoDaCercare)
      if (node.data) {
        return node.data.tipo === this.documentoDaCercare;
      }
      return true;
    },
  },
  computed: {
    movimenti: function () {
      const movimentiHolder = this.$store.getters["match/getMovimenti"];
      if (movimentiHolder) return movimentiHolder.items;
      return [];
    },
    num_tot_movimenti: function () {
      if (this.$store.getters["match/getMovimenti"]) {
        return this.$store.getters["match/getMovimenti"].total;
      } else {
        return 0;
      }
    },
    num_scaricati_movimenti: function () {
      if (this.$store.getters["match/getMovimenti"]) {
        return this.$store.getters["match/getMovimenti"].size;
      } else {
        return 0;
      }
    },
    num_filtrati_movimenti: function () {
      if (this.gridApi) {
        return this.gridApi.getDisplayedRowCount();
      } else {
        return 0;
      }
    },
  },
};
</script>

<style scoped>
.divRigaStyle {
  border: 1px solid rgb(0, 0, 0);
  background-color: rgba(203, 197, 197, 0.242);
  float: left;
  width: 100%;
}
</style>
