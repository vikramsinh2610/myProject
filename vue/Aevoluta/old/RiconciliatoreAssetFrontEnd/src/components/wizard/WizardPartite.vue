    <template>

        <div v-show="ragioneSocialeAttivata" v-bind:style="ragioneSocialeAttivata ? 'height: 100%;padding-left:10px;padding-right:10px' : 'height: 1500px'">
            <v-container fluid >
                <v-row v-show="!ragioneSocialeAttivata" style="min-height: 60px;"></v-row>
                <v-row v-show="ragioneSocialeAttivata" class="text-h6 text--primary" style="min-height: 30px;"> Aggiungi o togli partite al match. </v-row>
                <v-row v-show="ragioneSocialeAttivata" style="min-height: 25px;"> Alla chiusura il match proposto verrà dissociato e sostituito con il nuovo match </v-row>
                   <v-row  id="scatola" style="height: 900px;" class="wizardPartiteStyle">
                    <v-col>
                    <v-row >
                        <p class="text-h6 text--primary" style="margin-top:30px"> Scegli Partita </p>
                   </v-row>
                    <v-row style="min-height: 60px;">
                    <p class="text-h8 text--primary" style="margin-left: 10px; margin-top: 10px;"> Filtrati: {{num_scaricate_partite}} / Totali: {{num_tot_partite}}</p>
                    <p style="margin-left:20px; margin-top: 10px; margin-right:30px; margin-bottom:30px">
                        Ricerca:
                    </p>
                    <v-text-field style="padding-top: 0px; padding-right:5px; padding-left:5px; max-width:400px "
                        v-model="ricercaLibera"
                        background-color="rgba(255, 255, 255, 0.505)"
                    ></v-text-field>
                    <p  style="margin-left:20px; margin-top: 10px; margin-right:10px; margin-bottom:30px; color:rgba(0, 0, 0, 0.6);">
                        Non in match proposti:                         
                    </p>
                    <v-switch class="text-right mr-2" style="margin-top: 5px;"
                        v-model="changeStateTutteLePartite"
                        label="tutte"
                    ></v-switch>
                    <p v-if="!partiteInIngresso" style="margin-left:20px; margin-top: 10px; margin-right:10px; margin-bottom:30px; color:rgba(0, 0, 0, 0.6);">
                        Anche chiuse:                         
                    </p>
                    <v-switch v-if="!partiteInIngresso" class="text-right mr-2" style="margin-top: 5px;"
                        v-model="changeStateSoloAperte"
                        label="solo aperte"
                    ></v-switch>
                    <p v-if="!partiteInIngresso" style="margin-left:20px; margin-top: 10px; margin-right:10px; margin-bottom:30px; color:rgba(0, 0, 0, 0.6);">
                        Solo valuta Mov:                         
                    </p>
                    <v-switch v-if="!partiteInIngresso" class="text-right mr-2" style="margin-top: 5px;"
                        v-model="changeStateTutteValute"
                        label="tutte valute"
                    ></v-switch>
                    </v-row>
                    <v-row >
                        <v-col class="ml-4" md="9"  style="margin-right:10px">
                            <ag-grid-vue :style="{width, height}"
                                class="ag-theme-alpine"
                                :columnDefs="headersPartite"
                                :rowData="partite"
                                rowSelection="multiple"
                                :defaultColDef="defaultColDef"
                                @row-selected="onRowSelected"
                                :gridOptions="gridOptions"
                                :pinnedTopRowData="pinnedTopRowData"
                                :getRowStyle="getRowStyle"
                            >
                            </ag-grid-vue>
                        </v-col>
                        <v-col md="2" v-show="ragioneSocialeAttivata" style="min-height=600px; ">
                            <v-card class="mx-auto" max-width="300px" min-width="300px">
                                <v-card-text>
                                <p class="text-h6 text--primary">
                                    Saldo
                                </p>
                                <p class="text-h7 text--primary">
                                    {{saldo}}  {{movimentoCorrente.valuta}}
                                </p>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn :disabled="((partiteCorrenti.length) == 0 || (saldo===0))" id="btnchiudiMatch" @click.prevent="chiudiMatch" >
                                        <v-icon size="25">mdi-auto-fix</v-icon>
                                        <span> +- Differenze</span> 
                                    </v-btn>
                                </v-card-actions>
                                <v-card-actions>
                                    <v-btn :disabled="!(saldo===0)" id="btnchiudiMatch" @click.prevent="chiudiMatch" >
                                        <v-icon size="25">mdi-checkbox-marked-circle</v-icon>
                                        <span> Chiudi Match</span> 
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                            <v-card class="mx-auto mt-5" max-width="300px" min-width="300px">
                                <v-card-text>
                                <p class="text-h6 text--primary">
                                    Note Movimento
                                </p>
                                <p class="text-h7 text--primary">
                                    {{movimentoCorrente.notemovimento}}
                                </p>
                                </v-card-text>
                            </v-card>
                        </v-col>
                       </v-row>
                       </v-col>
                    </v-row> 
            <DifferenzeIncassiPartite :differenzeInIngresso="differenzeInIngresso" :showModal="showModal" :partite="partiteCorrenti" :valuta="movimentoCorrente.valuta" :saldo="saldo" @setDifferenzeConti="setDifferenzeConti"> </DifferenzeIncassiPartite>
            </v-container>
        </div>
    </template>

    <script>
    import { AgGridVue } from "ag-grid-vue";
    import "ag-grid-community/dist/styles/ag-grid.css";
    import "ag-grid-community/dist/styles/ag-theme-alpine.css";
    import DifferenzeIncassiPartite from '@/components/DifferenzeIncassiPartite.vue'
    import EventBus, { ACTIONS } from '../../components/Helpers/EventBus.js';

    export default {
        props:{
            ragioneSocialeConfermata: null,
            movimentoCorrente: null,
            partiteInIngresso: null,
            differenzeInIngresso: null,
        },
        data(){
            return{
                showModalDoc: false,
                showModal: 0,
                showModal1: false,
                Partita:{},
                numero_partite:0,
                ragioneSocialeAttivata: false,
                ricercaLibera: "",
                ricercaNascosta: "",
                partiteCorrenti: [],
                differenzeCorrenti: null,
                differenzeTotale: 0,
                headersPartite: [
                    { headerName: 'Numero doc', field: 'numerodocumento', width: 140, checkboxSelection: true },
                    { headerName: 'Imp Valuta', field: 'valutalordo', headerTooltip: 'Importo in valuta', width: 120, valueFormatter: params => new Intl.NumberFormat('en-US', {style: 'currency', currency: params.data.valuta}).format(params.value) },
                    { headerName: 'Val', headerTooltip: 'Valuta', field: 'valuta', width: 100 },
                    { headerName: 'Importo €', field: 'eurlordo', width: 120, valueFormatter: params => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'EUR'}).format(params.value) },
                    { headerName: 'Data Doc', field: 'datadocumento', width: 120, valueFormatter: params => new Date(params.value).toLocaleString('it-IT', {year: 'numeric', month: 'numeric', day: 'numeric'}) },
                    { headerName: 'Data Scad', sort: "desc", field: 'datascadenza', width: 120, valueFormatter: params => new Date(params.value).toLocaleString('it-IT', {year: 'numeric', month: 'numeric', day: 'numeric'}) },
                    { headerName: 'SAP ID', field: 'sapid', width: 100 },
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
                    tooltipShowDelay: 500, 
                    enableBrowserTooltips: true, 
                    enableCellTextSelection: true,
                },
                gridApi: null,
                columnApi: null,
                columnDefs: null,
                tutteLePartite: false,
                soloAperte: true,
                tutteValute: false,
                pinnedTopRowData: null,
                height: '600px',
                width: '100%',
            }
        },
        components:{
            AgGridVue,
            DifferenzeIncassiPartite
        }, 
        watch: { 
            ragioneSocialeConfermata: function(newVal, oldVal) { // watch it
                console.log('ragioneSocialeConfermata changed: ', newVal, ' | was: ', oldVal);
                if(!newVal) {
                    //selezionato nuovo movimento, elimina temp:
                    this.partiteCorrenti = [];
                    this.ricercaLibera = "";
                    this.resetGrid();
                    this.differenzeTotale = 0;
                    this.tutteValute = false;
                    this.pinnedTopRowData = null;
                    this.gridApi.setPinnedTopRowData(this.gridApi.getSelectedRows());
                } else {
                    this.ricaricaPartite();
                    this.pinnedTopRowData = null;
                    this.gridApi.setPinnedTopRowData(this.gridApi.getSelectedRows());
                    if(this.partiteInIngresso) {
                        this.selezionaPartite(this.partiteInIngresso);
                    }
                }
                this.ragioneSocialeAttivata = newVal;
            },
            ricercaLibera: function(newVal, oldVal) { // watch it
                console.log('ricercaLibera changed: ', newVal, ' | was: ', oldVal);
/*                if(newVal === "") {
                    this.gridApi.setQuickFilter("");
                } else {
                    let ricerca = this.ricercaNascosta + " " + newVal;
                    console.log("Ricerca: " + ricerca);
                    this.gridApi.setQuickFilter(ricerca);
                }*/
                this.gridApi.setQuickFilter(newVal);

            },
        },
        mounted() {
            console.log("wizard partite mounted")
            this.gridApi = this.gridOptions.api;
            this.gridColumnApi = this.gridOptions.columnApi;
            this.partiteCorrenti = [];
            this.differenzeTotale = 0;
            this.ricercaLibera = "";
            this.pinnedTopRowData = null;
            if(this.partiteInIngresso) {
                this.selezionaPartite(this.partiteInIngresso);
                this.ragioneSocialeAttivata = true;
            }
        },
        methods:{
            async chiudiMatch(){
                console.log("saldo: " + this.saldo + " and showmodal: " + this.showModal);
                if(this.saldo && this.saldo!=0){
                    // se non e' saldato aggiungere differenze
                    this.showModal++;
                }
                else {
                    if(this.partiteInIngresso) {
                        this.$emit('dissocia', {matchGiaRimosso: true});
                    }
                    let listaPartite = [];
                    for(const item of this.partiteCorrenti)  {
                        listaPartite.push(item.iddb);
                    }
                    let listaMovimenti = [];
                    listaMovimenti.push(this.movimentoCorrente.artificial_id_movimento)
                    console.log("differenze :")
                    console.log(this.differenzeCorrenti)
                    let creaEChiudi = {listaPartite: listaPartite,
                                       listaMovimenti: listaMovimenti,
                                       differenze: this.differenzeCorrenti }
                    // chiudi match.
                    try{
                        await this.$store.commit('auth/setIsLoading', true, { root: true }) 
                        await this.$store.dispatch("match/CreaESalvaMatch", creaEChiudi);
                        console.log("Match Salvato");
//                        this.showModal=false;
                        this.partiteCorrenti = [];
                        this.differenzeTotale = 0;
                        this.differenzeCorrenti = [];
                        this.ricercaLibera = "";
                        this.tutteValute = false;
                        this.pinnedTopRowData = null;
                        this.gridApi.setPinnedTopRowData(this.gridApi.getSelectedRows());
                        if(this.partiteInIngresso) {
                            EventBus.$emit(ACTIONS.SNACKBAR_OK, "Match chiuso con successo.");
                        } else {
                            EventBus.$emit(ACTIONS.SNACKBAR_OK, "Match nuovo chiuso con successo. Match proposto rimosso.");
                        }
                        this.$emit('movimentoChiuso');
                    } catch(error){
                        await this.$store.commit('auth/setIsLoading', false, { root: true }) 
                        console.log(error)
                        EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema nella creazione del match");
                        this.partiteCorrenti = [];
                        this.differenzeTotale = 0;
                        this.differenzeCorrenti = [];
                        this.ricercaLibera = "";
                        this.tutteValute = false;
                        this.pinnedTopRowData = null;
                        this.gridApi.setPinnedTopRowData(this.gridApi.getSelectedRows());
                   }
                    await this.$store.commit('auth/setIsLoading', false, { root: true }) 

                }
            },
            async anticipo(){
                console.log("Anticipo da implementare");
                // SALVA ANTICIPO
                this.$emit('movimentoChiuso');
            },

            setDifferenzeConti(leDifferenze){
                console.log("set  differenze conti con: " + leDifferenze.differenze + " e tot differenze: " + leDifferenze.differenzaTotale);
                this.differenzeCorrenti = leDifferenze.differenze;
                this.differenzeTotale = leDifferenze.differenzaTotale;
//                this.showModal = false;
                this.chiudiMatch();
                console.log("show modal a: " + this.showModal);
            },
            onRowSelected() {
                console.log("partita selezionata");
                let selectedNodes = this.gridApi.getSelectedNodes();
                this.partiteCorrenti = selectedNodes.map(node => node.data);
                if(this.partiteCorrenti) {
                    this.ricercaNascosta = "";
                    for (const p of this.partiteCorrenti) { 
                        this.ricercaNascosta += p.numerodocumento;
                    }
                }
                this.gridApi.setPinnedTopRowData(this.gridApi.getSelectedRows());
                if(this.gridApi.getSelectedRows()) {
                    let pixHeight = 600 + 40 * this.gridApi.getSelectedRows().length;
                    this.height = pixHeight + "px"
                    document.getElementById('scatola').style.height = (pixHeight + 300) + "px";

                }
                console.log(this.partiteCorrenti);
                console.log("selected data: " + `Selected Nodes:\n${JSON.stringify(this.partiteCorrenti)}`);

            },
            resetGrid(){
                //clear filters
                this.gridApi.setFilterModel(null);
                //notify grid to implement the changes
                this.gridApi.onFilterChanged();
                this.height = "600px"
                document.getElementById('scatola').style.height = "900px";
                //reset all grouping
                this.gridApi.setColumnDefs(this.headersPartite);
                //where columDefs is the object you used while creating grid first time.
            },
            async ricaricaPartite() {
                let params = new URLSearchParams();
                params.append("sapid", this.movimentoCorrente.sapid);
                params.append("escludi_coinvolti_in_match", !this.tutteLePartite);
                params.append("soloAperte", this.soloAperte);
                await this.$store.dispatch("match/LoadPartite", params);
                EventBus.$emit(ACTIONS.SNACKBAR_OK, "Reloading partite");
            },
            getRowStyle(params) {
                if (params.node.rowPinned) {
                    return { 'font-weight': 'bold' };
                }
            },
            selezionaPartite(partite) {
                console.log("selezionaPartite: ");
                console.log(partite)
                this.tutteLePartite=true;
                this.ricaricaPartite();
                let _this=this
                setTimeout( async function() {
                if(partite) {
                    _this.gridApi.forEachNode( function (node) {
                        let exists = partite.find(partita => {return partita.iddb === node.data.iddb})
                        console.log("compare: " + node.data.iddb + " found: " + exists)
                        if (exists) {
                            node.setSelected(true);
                        }
                    });
                }
            }, 1000);

            }
        },
        computed:{
            partite: function() {
                const partiteHolder =  this.$store.getters["match/getPartite"]

                if(partiteHolder) {
                    if(this.tutteValute) {
                        return partiteHolder.items;
                    } else {
                        let partiteFiltrate = partiteHolder.items.filter(partita => {
                        return (partita.valuta
                            .toString()
                            .indexOf(this.movimentoCorrente.valuta) != -1);
                        });
                        return partiteFiltrate;
                    }
                }
                return [];
            },
            saldo: function() {
                let totaleSaldo = 0;
                if(this.partiteCorrenti) {
                    for (const p of this.partiteCorrenti) { 
                        console.log("somma partita: " + p.valutalordo); 
                        if(this.movimentoCorrente.valuta === p.valuta) {
                            totaleSaldo += p.valutalordo;
                        } else {
                            totaleSaldo += p.eurlordo;
                        }
                    }
                }
                totaleSaldo = Number(this.movimentoCorrente.valuta_importo) - totaleSaldo
                totaleSaldo = totaleSaldo + this.differenzeTotale;
                return  this.globalRounderToTwoDecimals(totaleSaldo);
            },
            num_tot_partite: function() {
                if(this.$store.getters["match/getPartite"]) {
                    return this.$store.getters["match/getPartite"].size;
                } else {
                    return 0;
                }
            },
            num_scaricate_partite: function() {
                if(this.gridApi) {
                    return this.gridApi.getDisplayedRowCount();
                } else {
                    return 0;
                }
            },
            changeStateTutteLePartite: {
                get () {
                    return this.tutteLePartite;
                },  
                async set (value) {
                    console.log("settata tutteLePartite: " + value)
                    this.partiteCorrenti = [];
                    this.tutteLePartite = value;
                    this.ricaricaPartite();
                }
            },
            changeStateSoloAperte: {
                get () {
                    return this.soloAperte;
                },  
                async set (value) {
                    console.log("settata soloAperte: " + value)
                    this.partiteCorrenti = [];
                    this.soloAperte = value;
                    this.ricaricaPartite();
                }
            },
            changeStateTutteValute: {
                get () {
                    return this.tutteValute;
                },  
                async set (value) {
                    console.log("settata tutteValute: " + value)
                    this.partiteCorrenti = [];
                    this.tutteValute = value;
                    EventBus.$emit(ACTIONS.SNACKBAR_OK, "Mostro tutte valute");
                }
            },

        }

    }


    </script>

    <style >

    .ag-root-wrapper {
        min-height: 500px !important;
    }

    .wizardPartiteStyle{
        border: 1px solid rgb(0, 0, 0);
    background-color: rgba(203, 197, 197, 0.242);
    
    }

    </style>