<template>
<div >
   <div class="divStyle">
       
    <!-- DOCUMENTI-->
          <p class="filterStyle" style="margin-top:0px">
              Filtra movimenti in base ad un documento
          </p>
              <div class="container">
                  <table class="tableStyle" style="margin:10px">
                  <tr style="text-align:center; width:100%">
                  <td  class="riga">
                      <p class="titleStyle">
                          Tipo Documento
                      </p>
                      <v-select style="padding-right:5px; padding-left:5px " 
                      clearable
                        :items="tipiDocumento"
                        item-text="descrizione"
                        item-value="iddb"
                        label="Scegli Documento"
                        v-model="MM0MovimentoTipoDocumento">                         
                      </v-select>
                  </td >
                  
                  <td  class="riga">
                      <p class="titleStyle">
                          Anno
                      </p>
                      <v-select style="padding-right:5px; padding-left:5px " 
                        :items="anni"
                        v-model="MM0MovimentoDocumentoAnno"
                        label="Scegli anno">                         
                      </v-select>
                  </td >
                 
                  <td  class="riga">
                      <p class="titleStyle">
                          Mese
                      </p>
                      <v-select style="padding-right:5px; padding-left:5px " 
                        :items="mesi"
                        item-text="descrizione"
                        item-value="indice"
                        label="Scegli mese"                       
                       v-model="MM0MovimentoDocumentoMese">                         
                      </v-select>
                  </td >

                    <td  >
                        <p class="titleStyle">
                          Documento
                    </p>
                    <v-autocomplete
                        style="padding-right:5px; padding-left:5px"
                        :items="documenti"
                        item-text="nomefileoriginario"
                        item-value="idfile"
                        label="Scegli"
                        no-data-text="Nessun Documento Trovato"
                        v-model="MM0MovimentoIdDocumento"
                    ></v-autocomplete>
                    <p style="float:left; margin-top:5px">Visualizza Documento</p>
                
                    <v-btn style=" margin: 0px 5px 0px 5px; float: right" icon class="flexcol" @click="openDoc">
                    <v-icon size="20">mdi-open-in-new</v-icon>
                    </v-btn>

                  </td>
                  </tr>
                </table>

              </div>

    <!-- MOVIMENTI -->
          <p class="filterStyle">
              Filtra Movimenti e sotto movimenti
          </p>
              <div class="container">
                  <table class="tableStyle" style="margin:10px">

                  <tr>
                      <td class="riga" style="width: 20%">
                      <p class="titleStyle">
                          Ragione Sociale
                      </p>
                      <v-autocomplete
                        style=" padding-right:10px; padding-left:15px; "
                        :items="stakeholders"
                        item-text="ragionesociale"
                        item-value="sapid"
                        label="Scegli"
                        dense
                        v-model="MM0MovimentoRagioneSociale"
                        ></v-autocomplete>
                  </td>
                  <td style="width:25%" class="riga">
                      <p class="titleStyle">
                          Data Operazione
                      </p>
                      <div v-if="showSelect_M"> 
                          <select style="text-align:center" class="dataStyle" @click="changeSelectMovimenti($event)">
                            <option value=""> - </option>
                          <option value="mese"> Ultimo mese</option>
                          <option value="6_mesi"> Ultimi 6 mesi</option>
                          <option value="Scegli"> Scegli data</option>
                      </select>
                      </div>
                      <div v-if="!showSelect_M"> 
                          <td style="max-width:50%; float:left">
                              <v-menu
                        ref="menuDA_M"
                        v-model="menuDA_M"
                        :close-on-content-click="false"
                        :return-value.sync="dateDA_Mv"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="dateDA_M"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            background-color="rgba(255, 255, 255, 0.505)"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="dateDA_M"
                        no-title
                        scrollable
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="menuDA_M = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menuDA_M.save(dateDA_M)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-menu>
                          </td>
                          <td style="max-width:50%">
                            <v-menu
                        ref="menuA_M"
                        v-model="menuA_M"
                        :close-on-content-click="false"
                        :return-value.sync="dateA_M"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="dateA_M"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            background-color="rgba(255, 255, 255, 0.505)"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="dateA_M"
                        no-title
                        scrollable
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="menuA_M = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menuA_M.save(dateA_M)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-menu>  
                          </td>
                    
                      </div>
                  </td >
                  
                 
                      <td style="width: 15%" class="riga">
                          <p class="titleStyle">
                          Valuta
                      </p>
                      <v-autocomplete
                      style="padding-right:5px; padding-left:5px"
                    :items="valute"
                    item-text="descrizione"
                    item-value="codice_iso"
                    label="Scegli"
                    v-model="MM0MovimentoValuta"
                    ></v-autocomplete>
                  </td>
                  <td style="width: 20%" >
                      <p class="titleStyle">
                          Conto bancario
                      </p>
                      <input type="text" class="dataStyle" v-model="MM0MovimentoContoBancario">
                  </td>
                  </tr>
                  </table>
              </div>

    <!-- PARTITE -->
          <p class="filterStyle">
              Filtra Partite
          </p>
              <div class="container">
                  <table class="tableStyle" style="margin-top:10px; margin-bottom: 10px">
                  <tr>
                  <td class="riga" style="width: 20%">
                          <p class="titleStyle">
                          Ragione Sociale
                      </p>
                      <v-autocomplete
                        style=" padding-right:10px; padding-left:15px; "
                        :items="stakeholders"
                        item-text="ragionesociale"
                        item-value="sapid"
                        label="Scegli"
                        dense
                        v-model="MM0PartitaRagioneSociale"
                        ></v-autocomplete>
                  </td>
                      <td class="riga" style="width: 20%">
                      <p class="titleStyle">
                          Data creazione partita
                      </p>
                      <div v-if="showSelect_CP"> 
                          <select style="text-align:center" class="dataStyle" @click="changeSelectCreazionePartita($event)">
                              <option value=""> - </option>
                          <option value="mese"> Ultimo mese</option>
                          <option value="6_mesi"> Ultimi 6 mesi</option>
                          <option value="Scegli"> Scegli data</option>
                      </select>
                      </div>
                      <div v-if="!showSelect_CP"> 
                          <td style="max-width:50%; float:left">
                              <v-menu
                        ref="menuDA_CP"
                        v-model="menuDA_CP"
                        :close-on-content-click="false"
                        :return-value.sync="dateDA_CP"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="dateDA_CP"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            background-color="rgba(255, 255, 255, 0.505)"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="dateDA_CP"
                        no-title
                        scrollable
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="menuDA_CP = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menuDA_CP.save(dateDA_CP)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-menu>
                          </td>
                          <td style="max-width:50%">
                            <v-menu
                        ref="menuA_CP"
                        v-model="menuA_CP"
                        :close-on-content-click="false"
                        :return-value.sync="dateA_CP"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="dateA_CP"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            background-color="rgba(255, 255, 255, 0.505)"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="dateA_CP"
                        no-title
                        scrollable
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="menuA_CP = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menuA_CP.save(dateA_CP)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-menu>  
                          </td>
                    
                      </div>
                  </td>
                  <td class="riga" style="width: 20%">
                      <p class="titleStyle">
                          Data scadenza pagamento
                      </p>
                       <div v-if="showSelect_SP"> 
                          <select  style="text-align:center" class="dataStyle" @click="changeSelectScadenzaPartita($event)">
                              <option value="" >-</option>
                          <option value="mese" > Ultimo mese</option>
                          <option value="6_mesi"> Ultimi 6 mesi</option>
                          <option value="Scegli"> Scegli data</option>
                      </select>
                      </div>
                      <div v-if="!showSelect_SP"> 
                          <td style="max-width:50%; float:left">
                              <v-menu
                        ref="menuDA_SP"
                        v-model="menuDA_SP"
                        :close-on-content-click="false"
                        :return-value.sync="dateDA_SP"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="dateDA_SP"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            background-color="rgba(255, 255, 255, 0.505)"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="dateDA_SP"
                        no-title
                        scrollable
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="menuDA_SP = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menuDA_SP.save(dateDA_SP)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-menu>
                          </td>
                          <td style="max-width:50%">
                            <v-menu
                        ref="menuA_SP"
                        v-model="menuA_SP"
                        :close-on-content-click="false"
                        :return-value.sync="dateA_SP"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="dateA_SP"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            background-color="rgba(255, 255, 255, 0.505)"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="dateA_SP"
                        no-title
                        scrollable
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="menuA_SP = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menuA_SP.save(dateA_SP)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-menu>  
                          </td>
                    
                      </div>
                  </td >
                  <td  style="width: 10%">
                          <p class="titleStyle">
                          Valuta
                      </p>
                      <v-autocomplete
                      style="padding-right:10px; padding-left:15px; "
                    :items="valute"
                    item-text="descrizione"
                    item-value="codice_iso"
                    label="Scegli"
                    v-model="MM0PartitaValuta"
                    ></v-autocomplete>
                  </td>
                  </tr>
                  </table>

              </div>
            

              <div class="filterStyle" >
                  <v-btn id="btnCerca" class="btnCercaStyle" @click.prevent="cerca" >
                      <v-icon size="25">mdi-magnify</v-icon>
                  <span> cerca</span> 
              </v-btn>
              
              </div>
              
  </div>
      <div v-if="showModalDoc">
            <DocOpened  :idDoc=MM0MovimentoIdDocumento theme="" @close="openDoc">
            <div>
                
           </div>
            <v-btn class="btnOkStyle" @click="openDoc" elevation="0">ok</v-btn>
           
            </DocOpened>
    </div>

</div>
  
</template>

<script>
import DocOpened from '@/components/ManualMatch/DocOpened.vue'

export default {
    data(){
        return{
            stakeholders: [],

            stoCercando: false,
            showModalDoc: false,
            showSelect_M: true,
            showSelect_CP: true,
            showSelect_SP: true,
            dateDA_M: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            dateA_M: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            dateDA_CP: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            dateA_CP: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            dateDA_SP: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            dateA_SP: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

            menuDA_M: false,
            menuA_M: false,
            menuDA_CP: false,
            menuA_CP: false,
            menuDA_SP: false,
            menuA_SP: false,

            anni: ["All", 2018, 2019, 2020, 2021, 2022],
            mesi: [ {descrizione: "All", indice: null},
                    {descrizione: "gennaio", indice: 0},
                    {descrizione: "febbraio", indice: 1},
                    {descrizione: "marzo", indice: 2},
                    {descrizione: "aprile", indice: 3},
                    {descrizione: "maggio", indice: 4},
                    {descrizione: "giugno", indice: 5},
                    {descrizione: "luglio", indice: 6},
                    {descrizione: "agosto", indice: 7},
                    {descrizione: "settempre", indice: 8},
                    {descrizione: "ottobre", indice: 9},
                    {descrizione: "novembre", indice: 10},
                    {descrizione: "dicembre", indice: 11}],

            MM0PartitaValuta: null,
            MM0PartitaRagioneSociale: null,
            MM0MovimentoRagioneSociale: null,
            MM0MovimentoContoBancario: null,
            MM0MovimentoTipoDocumento: null,
            MM0MovimentoIdDocumento: null,
            MM0MovimentoValuta: null,
            MM0MovimentoDocumentoAnno: 2022,
            MM0MovimentoDocumentoMese: {
                                        indice: new Date().getMonth()}
        }
    },
    components:{
        DocOpened
    }, 
    updated(){
        console.log(this.MM0MovimentoDocumentoAnno)
        console.log(this.MM0MovimentoDocumentoMese)

/*       
        if(this.MM0MovimentoDocumentoAnno == "All"){
            console.log("Imposto filtro anno = null")
            this.MM0MovimentoDocumentoAnno = null;
            console.log(this.MM0MovimentoDocumentoAnno)
        }
  */      
    },
    async mounted() {
        if(this.stakeholders.length == 0) {
            console.log("Non ci sono stakholders, carica")
            this.stakeholders = structuredClone(this.$store.getters["match/getStakeholders"].items);
        }
        var _this = this;
        window.activeEnterPath = this.$router.currentRoute.path;
        window.addEventListener('keyup', function(event) {
            // evita che parta anche sulle altre pagine:
            if(_this.$router.currentRoute.path != window.activeEnterPath) return;
            if (event.key === "Enter") {
                _this.cerca()
                }
        });

    },
    async created() {
        let params = new URLSearchParams();
        await this.$store.dispatch("match/LoadDocumenti", params);
    },
    methods:{

        changeSelectMovimenti(event){
            console.log(event.target.value)
            if(event.target.value == "Scegli"){
                this.showSelect_M = !this.showSelect_M
                console.log("show select M : " + this.showSelect_M)
            }
        },
        changeSelectCreazionePartita(event){
            console.log(event.target.value)
            if(event.target.value == "Scegli"){
                this.showSelect_CP = !this.showSelect_CP
                console.log("show select CP : " + this.showSelect_CP)
            }
        },
        changeSelectScadenzaPartita(event){
            console.log(event.target.value)
            if(event.target.value == "Scegli"){
                this.showSelect_SP = !this.showSelect_SP
                console.log("show select SP : " + this.showSelect_SP)
            }
        },
        async cerca(){
            if(this.stoCercando) return;
            this.stoCercando = true;
            console.log("hi");
            // loading data
            let params = new URLSearchParams();
            if(this.MM0PartitaValuta) {
                params.append("valuta", this.MM0PartitaValuta);
            }
            if(this.MM0PartitaRagioneSociale) {
                params.append("sapid", this.MM0PartitaRagioneSociale);
            }
            await this.$store.dispatch("match/LoadPartite", params);

            params = new URLSearchParams();
            if(this.MM0MovimentoRagioneSociale) {
                params.append("sapid", this.MM0MovimentoRagioneSociale);
            }
            if(this.MM0MovimentoContoBancario) {
                params.append("conto", this.MM0MovimentoContoBancario);
            }
            if(this.MM0MovimentoTipoDocumento) {
                params.append("tipo", this.MM0MovimentoTipoDocumento);
            }
            if(this.MM0MovimentoValuta) {
                params.append("valuta", this.MM0MovimentoValuta);
            }
            if(this.MM0MovimentoIdDocumento) {
                params.append("id_documento", this.MM0MovimentoIdDocumento);
            }
            params.append("solo_movimenti_abbinabili", true);

 //           params.append('page', 1);
 //           params.append('per_page', 1000);
            await this.$store.dispatch("match/LoadMovimenti", params);
            this.$store.commit('auth/setIsLoading', true);

            this.$store.commit('match/setfiltroMMPartite', "")
            this.$store.commit('match/setfiltroMMMovimentiConto', "")
            this.$store.commit('match/setfiltroMMMovimentiValuta', "")
            this.$store.commit('match/setfiltroMMMovimentiImporto', "")

            await this.$store.dispatch("match/LoadStakeholders");
            this.$router.push({name: "manualmatch1"}).catch(err => {
                this.stoCercando = true;
                this.$store.commit('auth/setIsLoading', false);
                console.log(err)});
                this.stoCercando = true;
        },
        openDoc() {
            this.showModalDoc=!this.showModalDoc
        },
    }, 
    computed:{
        valute : function() {
            return structuredClone(this.$store.getters["match/getValuteOrdinate"]);
        },
        documenti : function() {
            if(this.$store.getters["match/getDocumenti"]) {
                return this.$store.getters["match/getDocumenti"].items
                .filter(documento => {
                    let ok = true;
                    if(this.MM0MovimentoTipoDocumento ) {
//                        console.log("codice selezionato "+ this.MM0MovimentoTipoDocumento.toString() + " codice documento: " + documento.codtipofile);
                        ok = ok &&  this.MM0MovimentoTipoDocumento === documento.codtipofile;
                    } 
//                    console.log("data documento: " + documento.datacontenutodocumento + "date: " + new Date(documento.datacontenutodocumento))
                    if(this.MM0MovimentoDocumentoAnno && this.MM0MovimentoDocumentoAnno != "All" && documento.datacontenutodocumento) {
//                       console.log("anno selezionato "+ this.MM0MovimentoDocumentoAnno + " anno documento: " + new Date(documento.datacontenutodocumento).getFullYear());
                       ok = ok && (new Date(documento.datacontenutodocumento)
                        .getFullYear().toString()
                        .indexOf(this.MM0MovimentoDocumentoAnno.toString()) != -1);
                    }
                    if(this.MM0MovimentoDocumentoMese && documento.datacontenutodocumento) {
//                       console.log("mese selezionato "+ this.MM0MovimentoDocumentoMese + " mese documento: " + new Date(documento.datacontenutodocumento).getMonth());
                        ok = ok && (new Date(documento.datacontenutodocumento)
                        .getMonth().toString()
                        .indexOf(this.MM0MovimentoDocumentoMese.toString()) != -1);
                    }
                    return ok;

                });
            } else {
                return this.$store.getters["match/getDocumenti"];
            }
        },
        tipiDocumento : function() {
            let tipiDocumentoMostrati = structuredClone(this.$store.getters["match/getTipiDocumento"]);
            tipiDocumentoMostrati.unshift({
                    "descrizione" : "All",
                    "iddb" : null
                });
            return tipiDocumentoMostrati;
        },
    }
}
</script>

<style scoped>

.btnCercaStyle{
    text-align: center;
    border: 1px solid rgb(0, 0, 0);
    background-color: rgba(203, 197, 197, 0.242) !important;
    padding: 10px;
    border-radius: 5px;
   /* font-family: "'EB Garamond SC',ebGaramond12SC_WGDI,'Times New Roman',serif";*/
}
.riga{
    border-right: 1px solid rgba(0, 0, 0, 0.342);
    text-align: center;
    padding: 5px;
}
.dataStyle{
   padding:5px;
    border: 1px solid rgba(3, 3, 3, 0.17);
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 0.505);
    margin:10px;
    font-size: 13px;
   /* font-family: "'EB Garamond SC',ebGaramond12SC_WGDI,'Times New Roman',serif";*/
}

.tableStyle{
    text-align: center;
    margin:auto;
    padding:5px;
    width: 100%;
}
.titleStyle{
    text-align: center;
    font-size: 15px;
    padding-right: 10px;
    padding-top:5px;
    padding-bottom: 1px ;
    margin-bottom: 2px !important;
    vertical-align: top;
   /* font-family: "'EB Garamond SC',ebGaramond12SC_WGDI,'Times New Roman',serif";*/

}
.filterStyle{
    width: 100%;
    margin:10px;
    margin-top:2px !important;
    text-align: center;
    margin-left:30px;
    font-size: 16px;
   /* font-family: "'EB Garamond SC',ebGaramond12SC_WGDI,'Times New Roman',serif";*/

}
.container{
    border: 1px solid rgb(0, 0, 0);
    background-color: rgba(203, 197, 197, 0.242);
    border-radius: 5px;
    min-width: 95%;
    padding: 0px;
    min-height: 20%;
    text-align: center;
    margin-bottom: 20px;
   /* font-family: "'EB Garamond SC',ebGaramond12SC_WGDI,'Times New Roman',serif";*/

}


</style>