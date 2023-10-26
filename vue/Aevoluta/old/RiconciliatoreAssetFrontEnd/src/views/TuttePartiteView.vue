    <template>

        <div>
            <v-container fluid>
                <v-snackbar
                top
                color="success"
                v-model="snackbar"
                style="margin-top:70px"
            >
                {{ SnackBarText }}

        <template v-slot:action="{ attrs }">
            <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="snackbar = false"
            >
            Close
            </v-btn>
      </template>
    </v-snackbar>

        <div style="height: 1000px;">
         <v-row>
                      <p style="margin-top:10px; margin-left:20px;">
                          Ragione Sociale:
                      </p>
                     <v-autocomplete
                        style="max-width: 450px; margin-left:10px; padding-right:10px; padding-left:15px; "
                        :items="stakeholders"
                        :item-text="getItemText"
                        item-value="sapid"
                        label="Scegli"
                        dense
                        v-model="ragioneSocialeSelezionata"
                    ></v-autocomplete>
                    <v-btn id="btnCambiaRS" @click.prevent="cambiaRS" >
                        <v-icon size="25">mdi-checkbox-marked-circle</v-icon>
                        <span> Cerca Partite </span> 
                    </v-btn>

                      <p style="margin-top:10px; margin-left:100px; margin-right:30px;W">
                          Ricerca:
                      </p>
                        <v-text-field style="padding-top:0px; padding-right:5px; padding-left:5px; max-width:300px "
                            v-model="ricercaLibera"
                            background-color="rgba(255, 255, 255, 0.505)"
                        ></v-text-field>
                        <v-switch class="text-right mr-9;" style="margin-left: 20px; margin-top:10px; padding-top: 0px"
                            v-model="ancheAbbinati"
                            label="Anche Abbinate"
                            @change="changeState()"
                        ></v-switch>
        </v-row>
                   <v-row no-gutters class="wizardPartiteStyle">
                            <p class="text-h8 text--primary"> Filtrate: {{num_filtrate_partite}} / Scaricati: {{num_scaricate_partite}} / Totali: {{num_tot_partite}}</p>
                            <ag-grid-vue style="width: 100%; min-height:500px;"
                                class="ag-theme-alpine"
                                :columnDefs="headersPartite"
                                :rowData="partite"
                                :defaultColDef="defaultColDef"
                                :gridOptions="gridOptions"
                            >
                            </ag-grid-vue>
                    </v-row>
        </div>
            </v-container>
        </div>
    </template>

    <script>
    import EventBus, { ACTIONS } from '../components/Helpers/EventBus.js';
    import { AgGridVue } from "ag-grid-vue";
    import "ag-grid-community/dist/styles/ag-grid.css";
    import "ag-grid-community/dist/styles/ag-theme-alpine.css";

    export default {
        data(){
            return{
                showModalDoc: false,
                ping: 1,
                SnackBarText: "info",
                snackbar: false,
                ricercaLibera: "",
                stakeholders: [],
                ragioneSocialeSelezionata: null,
                ancheAbbinati: false,


                headersPartite: [
                    { headerName: 'Ragione Sociale', field: 'ragionesociale', maxWidth: 900 },
                    { headerName: 'Numero doc', field: 'numerodocumento', maxWidth: 150 },
                    { headerName: 'Importo Valuta', field: 'valutalordo', maxWidth: 150, valueFormatter: params => new Intl.NumberFormat('en-US', {style: 'currency', currency: params.data.valuta}).format(params.value) },
                    { headerName: 'Valuta', field: 'valuta', maxWidth: 100 },
                    { headerName: 'Importo Euro', field: 'eurlordo', maxWidth: 150, valueFormatter: params => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'EUR'}).format(params.value) },
                    { headerName: 'Data Doc', field: 'datadocumento', maxWidth: 130, valueFormatter: params => new Date(params.value).toLocaleString('it-IT', {year: 'numeric', month: 'numeric', day: 'numeric'}) },
                    { headerName: 'Data Scad', field: 'datascadenza', maxWidth: 130, valueFormatter: params => new Date(params.value).toLocaleString('it-IT', {year: 'numeric', month: 'numeric', day: 'numeric'}) },
                    { headerName: 'SAP ID', field: 'sapid', maxWidth: 130 },
                    { headerName: 'CondPag', field: 'codice_condizioni_pagamento', headerTooltip: 'Condizioni di Pagamento', tooltipField: 'descrizione_condizioni_pagamento', width: 100 },
                    { headerName: 'NoteSAP', field: 'testo_partita' },
                    { headerName: 'ID Unico', headerTooltip: 'Necessario per distinguere partite splittate con lo stesso numero documento', field: 'iddb', width: 100 },
                ],
                defaultColDef: {
                    sortable: true,
                    filter: true,
                    editable: false,
                    resizable: true,
                },
                gridOptions: {
                    enableCellTextSelection: true,
                },
                gridApi: null,
                columnApi: null,
                columnDefs: null,
            }
        },
        components:{
            AgGridVue,
        }, 
        mounted() {
            this.$store.commit('match/setPartite', null)
            this.gridApi = this.gridOptions.api;
            this.gridColumnApi = this.gridOptions.columnApi;
        },
        async created() {
            console.log("created")
            this.$store.commit('auth/setIsLoading', false);
            if(!this.$store.getters["match/getStakeholders"] || this.$store.getters["match/getStakeholders"].length == 0) {
                console.log("Non ci sono stakholders, carica")
                await this.$store.dispatch("match/LoadStakeholders");
            }
            this.stakeholders = this.$store.getters["match/getStakeholders"].items;
        },
        methods:{
            openDocPartite(){
                console.log("Apro documento: " + this.Partita.iddocumento);
                this.idDoc = this.Partita.iddocumento;
                this.riferimento = {colonna: "Numero documento", idPartita: this.Partita.numerodocumento};
                this.showModalDoc=!this.showModalDoc
            },
            async caricaPartite() {
                // loading data
                let params = new URLSearchParams();
                params.append("sapid", this.ragioneSocialeSelezionata);
                params.append("escludi_coinvolti_in_match", !this.ancheAbbinati);
                try {
                    await this.$store.dispatch("match/LoadPartite", params);
                } catch(error){
                    await this.$store.commit('auth/setIsLoading', false, { root: true }) 
                    console.log(error)
                    EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema nel caricamento partite");
                }

            },
            async cambiaRS() {
                this.ricercaLibera="";
                EventBus.$emit(ACTIONS.SNACKBAR_OK, "Carico Partite");
                this.caricaPartite();
            },
            async changeState() {
                EventBus.$emit(ACTIONS.SNACKBAR_OK, "Reloading Partite");
                this.caricaPartite();
            },
            getItemText(item) {
                return `${item.ragionesociale} - ${item.sapid}`;
            }
        },
        watch: { 
            ricercaLibera: function(newVal, oldVal) { // watch it
                console.log('ricercaLibera changed: ', newVal, ' | was: ', oldVal);
                this.gridApi.setQuickFilter(newVal);
            },
        },
        computed:{
            nomeDocumento : function() {
                console.log("Cerca nome documento ");
                if(!this.movimentoCorrente || !this.movimentoCorrente.iddocumento) {
                    return "";
                }
                let ilDocumento = this.$store.getters["match/getDocumento"](this.movimentoCorrente.iddocumento);
                if(ilDocumento) {
                    return ilDocumento.nomefileoriginario;
                } 
                console.log("documento non trovato");
                return "";
            },
            partite: function() {
                const partiteHolder =  this.$store.getters["match/getPartite"]
                if(partiteHolder) return partiteHolder.items;
                return [];
            },
            num_tot_partite: function() {
                if(this.$store.getters["match/getPartite"]) {
                    return this.$store.getters["match/getPartite"].total;
                } else {
                    return 0;
                }
            },
            num_scaricate_partite: function() {
                if(this.$store.getters["match/getPartite"]) {
                    return this.$store.getters["match/getPartite"].size;
                } else {
                    return 0;
                }
            },
            num_filtrate_partite: function() {
                if(this.gridApi) {
                    return this.gridApi.getDisplayedRowCount();
                } else {
                    return 0;
                }
            }
        }

    }
    </script>

    <style scoped>

    </style>