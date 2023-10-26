<template>
<div>
    <div  style="margin:auto; width:90%">
    <div id="riga1" class="divRigaStyle">
        <div id="Movimenti" class="divMovimentiStyle">
            <h3>Movimenti e Sotto-Movimenti</h3>
            <SelectMovimenti></SelectMovimenti>
            <ListMovimenti @setDataMovimento="setDataMovimento"></ListMovimenti>

        </div>
        <div id="Partite" class="divPartiteStyle">
            <h3>Partite</h3>
            <SelectPartite></SelectPartite>
            <ListPartite @setDataPartita="setDataPartita" ></ListPartite>
            
               
        </div>
    </div>
    <br>
    
    <div id="riga2" class="divRigaStyle">
        <div class="datiStyle">
            
            <table style="width:100%; table-layout: fixed">
                <tr > 
            <!-- primo blocco -->
                    <td id="primo blocco" class="riga" style="border: transparent">
                        <tr >
                            <td style="width:20%">
                                <p>Rag. Sociale</p>
                            </td>
                            <td style="width:60%">
                                <p class="dataStyle" type="text" >{{Movimento.ragionesociale | formatTruncate(23, '...')}} </p>
                            </td>   
                        </tr>
                        <tr>
                            <td >
                                <p>Data Op.</p>
                            </td>
                            <td > 
                                <p class="dataStyle" type="text" >{{Movimento.dataoperazione | formatDateLong}}</p> </td>
                        </tr>
                        <tr>
                            <td >
                                <p>Data registr.</p>
                            </td>
                            <td > 
                                <p class="dataStyle" type="text" >{{Movimento.dataregistrazione | formatDateLong}}</p> </td>
                        </tr>
                         <tr>
                            <td >
                                <p>Riferimento Piteco.</p>
                            </td>
                            <td > 
                                <p class="dataStyle" type="text" >{{Movimento.codice_piteco | formatTruncate(23, '...')}}</p> </td>
                        </tr>
                        <tr >
                            <td >
                                <p>Note</p>
                            </td>

                            <td class="CellWithAevoTooltip" :rowspan="2" > 
                                <span class="AevoTooltip">{{Movimento.notemovimento }}</span>

                                <p style="height:60px !important" class="dataStyle" type="text" >{{Movimento.notemovimento | formatTruncate(23, '...')}}</p> </td>
                        </tr>
                        
                    </td>
                <!-- secondo -->
                    <td id="secondo blocco" class="riga" >
                        <tr>
                            <td >
                                <p>IDMovimento</p>
                            </td>
                            
                            <td :title="Movimento.artificial_id_movimento"> 
                                <p class="dataStyle" type="text" >{{Movimento.artificial_id_movimento}}</p> 
                            </td>
                            
                           </tr>
                        <tr>
                            <td style="width:30%">
                                <p>Conto</p>
                            </td>
                            <td style="width:50%"> 
                                <p class="dataStyle" type="text" >{{Movimento.conto | formatTruncate(25, '...')}}</p> </td>
                        </tr>
                         <tr>
                            <td >
                                <p>Tipo Doc.</p>
                            </td>
                            <td > 
                                <p class="dataStyle" type="text" >{{Movimento.tipo | formatTruncate(25, '...')}}</p> </td>
                        </tr>
                        <tr>
                            <td >
                                <p>Nome Doc.</p>
                            </td>
                            <td > 
                                <p class="dataStyle" type="text" >{{nomeDocumento | formatTruncate(25, '...')}}</p> </td>
                        </tr>
                        <tr>
                            <td >
                                <p>Valuta</p>
                            </td>
                            <td > 
                                <p class="dataStyle" type="text" >{{Movimento.valuta | formatTruncate(25, '...')}}</p> </td>
                        </tr>
                        <tr> 
                            <td :colspan="2"> 
                                <p style="float:left; margin-top:6px; vertical-align: middle;">Visualizza Documento</p>
                            
                                <v-btn style=" margin: 0px 5px 0px 5px; float: right" icon class="flexcol" @click="openDoc">
                                <v-icon size="20">mdi-open-in-new</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </td>
                <!-- terzo -->
                    <td id="terzo blocco" class="riga" style="border: transparent">
                        <tr>
                            <td style="width:30%">
                                <p>Rag. Sociale</p>
                            </td>
                            <td style="width:50%"> 
                                <p class="dataStyle" type="text" >{{Partita.ragionesociale | formatTruncate(25, '...')}}</p> </td>
                        </tr>
                        <tr>
                            <td style="width:30%">
                                <p>SAP ID</p>
                            </td>
                            <td > 
                                <p class="dataStyle" type="text" >{{Partita.sapid | formatTruncate(25, '...')}}</p> </td>
                        </tr>
                        <tr>
                            <td >
                                <p>Numero doc</p>
                            </td>
                            <td > 
                                <p class="dataStyle" type="text" >{{Partita.numerodocumento | formatTruncate(25, '...')}}</p> </td>
                        </tr>
                         <tr>
                            <td >
                                <p>Data Scad</p>
                            </td>
                            <td > 
                                <p class="dataStyle" type="text" > {{Partita.datascadenza | formatDateLong}} </p> </td>
                        </tr>
                        <tr>
                            <td >
                                <p>Data Doc</p>
                            </td>
                            <td > 
                                <p class="dataStyle" type="text" >{{Partita.datadocumento | formatDateLong}}</p> </td>
                        </tr>
                    </td>
                    <!-- quarto blocco -->
                    <td id="quarto blocco" class="riga" style="border: transparent">
                        <tr>
                            <td style="width:30%">
                                <p>Importo Valuta</p>
                            </td>
                            <td style="width:50%"> 
                                <p class="dataStyle" type="text" > {{Partita.valutalordo | formatTruncate(25, '...')}}</p> </td>
                        </tr>
                        <tr>
                            <td >
                                <p>Valuta</p>
                            </td>
                            <td > 
                                <p class="dataStyle" type="text" > {{Partita.valuta | formatTruncate(25, '...')}}</p> </td>
                        </tr>
                        <tr> 
                            <td :colspan="2"> 
                                <p style="float:left; margin-top:5px">Visualizza Documento</p>
                            
                                <v-btn style=" margin: 0px 5px 0px 5px; float: right" icon class="flexcol" @click="openDocPartite">
                                <v-icon size="20">mdi-open-in-new</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </td>

                </tr>

            </table>
        </div>
    </div>
 
    <div id="riga3" class="divRigaStyle">
        <div  style="height:20px">
            <p v-if="visibility" style="vertical-align:middle; width: 65%; text-align: center; margin-top:15px ">Drop in the box below </p>    
        </div>
        <div 
        class="dropStyle"
        :class="(saldo== 0) ? 'dropsaldoZero' : 'dropStyle'"
        id="dropArea"
        @drop="onDrop($event)"
        @dragenter.prevent
        @dragover.prevent
        
        @dragstart="dragStart($event, movimento)"
          @dragover.stop>
        </div> 
        <div class="saldoStyle">
            <span >Saldo = {{saldo}}</span>
        </div>
        <div>
            <v-btn class="btnChiudiStyle" @click="chiudiMatch">
                <span style="color: #D91A21">Chiudi Match</span>
            </v-btn>
        </div>
    </div>
    </div>
        <DifferenzeIncassiPartite :partite="partiteDroppate" :valuta="movimentiDroppati ? movimentiDroppati[0].valuta : ''" :showModal="showModal" :saldo="saldo" @setDifferenzeConti="setDifferenzeConti"> </DifferenzeIncassiPartite>

    <div v-if="showModal1">
            <PopUpClose  theme="">
            <div>
                <v-icon size="29" style="color: rgb(14, 153, 33); float: left: margin-left: 10px">mdi-checkbox-marked-circle</v-icon>
                <h2>Congratulazioni!</h2>
           </div>
            <p>Match effettuato con successo</p>
            <v-btn class="btnOkStyle" @click="showModal1 = false" elevation="0" exact>ok</v-btn>
           
            </PopUpClose>
    </div>
    <div v-if="showModalDoc">
            <DocOpened  :idDoc="idDoc" :riferimento="riferimento" theme="" @close="openDoc">
            <div>
                
           </div>
            <v-btn class="btnOkStyle" @click="openDoc" elevation="0">ok</v-btn>
           
            </DocOpened>
    </div>
</div>
    

</template>

<script>
import SelectPartite from '@/components/ManualMatch/SelectPartite.vue'
import SelectMovimenti from '@/components/ManualMatch/SelectMovimenti.vue'
import ListMovimenti from '@/components/ManualMatch/ListMovimenti.vue'
import ListPartite from '@/components/ManualMatch/ListPartite.vue'
import PopUpClose from '@/components/PopUpClose.vue'
import DocOpened from '@/components/ManualMatch/DocOpened.vue'
import DifferenzeIncassiPartite from '@/components/DifferenzeIncassiPartite.vue'
import EventBus, { ACTIONS } from '../../components/Helpers/EventBus.js';

export default {
    data(){
        return{
            showModalDoc: false,
            showModal: false,
            showModal1: false,
            visibility: true,
            T_ID:0,
            Movimento:{},
            movimentiDroppati: [],
            P_ID:0,
            Partita:{},
            partiteDroppate: [],
            match:[],
            idDoc: null,
            riferimento: null,
            numero_partite:0,
            differenzeCorrenti: null,
            differenzeTotale: 0,
        }
    },
    components:{
        SelectPartite,
        SelectMovimenti,
        ListMovimenti,
        ListPartite,
        PopUpClose,
        DocOpened,
        DifferenzeIncassiPartite
    }, 
    async created() {
        this.$store.commit('auth/setIsLoading', false);
        this.numero_partite=this.$store.getters["match/getPartite"].items.length;
        console.log("numero partite caricate in ManualMatchView1:"+this.$store.getters["match/getPartite"].items.length)
    },
   

    methods:{
        addSelection(){
            var i = 0;
            var original = document.getElementById('selectDifferenze' + i);
            var clone = original.cloneNode(true); // "deep" clone
            clone.id = "selectDifferenze" + ++i; // there can only be one element with an ID
            original.parentNode.appendChild(clone);
        },
        async chiudiMatch(){
            console.log("saldo: " + this.saldo + " and showmodal: " + this.showModal);
            if(this.saldo && this.saldo!=0){
                // se non e' saldato aggiungere differenze
                this.showModal++;
            }
            else {
                let listaPartite = [];
                for(const item of this.partiteDroppate)  {
                    listaPartite.push(item.numerodocumento);
                }
                let listaMovimenti = [];
                for(const item of this.movimentiDroppati)  {
                    listaMovimenti.push(item.artificial_id_movimento);
                }
    
                let creaEChiudi = {listaPartite: listaPartite,
                                    listaMovimenti: listaMovimenti,
                                    differenze: this.differenzeCorrenti }
                console.log("Crea E Chiudi");
                console.log(creaEChiudi);
                // chiudi match.
                try{
                    await this.$store.commit('auth/setIsLoading', true, { root: true }) 
                    await this.$store.dispatch("match/CreaESalvaMatch", creaEChiudi);
                    this.rimuoviMovimentiEPartiteSalvati();
                    console.log("Match Salvato");
                    await this.$store.commit('auth/setIsLoading', false, { root: true }) 
                    this.showModal1=true;
                } catch(error){
                    await this.$store.commit('auth/setIsLoading', false, { root: true }) 
                    console.log(error)
                    EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema nella creazione del match");
                }
            }
        },
        setDifferenzeConti(leDifferenze){
            console.log("set  differenze conti con: " + leDifferenze.differenze + " e tot differenze: " + leDifferenze.differenzaTotale);
            this.differenzeCorrenti = leDifferenze.differenze;
            this.differenzeTotale = leDifferenze.differenzaTotale;
//                this.showModal = false;
            this.chiudiMatch();
            console.log("show modal a: " + this.showModal);
        },
        openDoc(){
            console.log("Apro documento: " + this.Movimento.iddocumento);
            this.idDoc = this.Movimento.iddocumento;
            let imp = ""
            if(this.Movimento && this.Movimento.valuta_importo) {
                imp = this.Movimento.valuta_importo.toString().replace(".", ",");
            }
            console.log("Search term: " + imp);
            this.riferimento = {search: true, term: imp};
            this.showModalDoc=!this.showModalDoc;
        },
        openDocPartite(){
            console.log("Apro documento: " + this.Partita.iddocumento);
            this.idDoc = this.Partita.iddocumento;
            this.riferimento = {colonna: "Numero documento", idPartita: this.Partita.numerodocumento};
            this.showModalDoc=!this.showModalDoc
        },
        setDataMovimento(movimento){
            console.log("movimento passed correctly");
            this.T_ID = movimento.artificial_id_movimento;
            this.Movimento = movimento;
            console.log(this.Movimento);
            this.idDoc = movimento.iddocumento;
        },
        setDataPartita(partita){
            console.log("partita passed correctly");
            this.P_ID = partita.id;
            this.Partita = partita;
            console.log(this.Partita);
        },
        async onDrop(e){
          console.log("dropped ");
            this.visibility=false;
            const movimento_importo = e.dataTransfer.getData('movimento_importo');
            const movimento_id = e.dataTransfer.getData('movimento_id');
            console.log("movimento id dropped: " + movimento_id + " movimento_importo: " + movimento_importo);
            const movimento = document.getElementById(movimento_id);
            console.log("movimento id dropped: " + movimento_id + " found: " + movimento);
            const partita_importo = e.dataTransfer.getData('partita_importo');
            const partita_id = e.dataTransfer.getData('partita_id');
            console.log("partita id dropped: " + partita_id + " partita_importo: " + partita_importo);
            const partita = document.getElementById(partita_id);

            console.log(partita)
            if(movimento){
                e.target.appendChild(movimento);
                let movimentoDroppato = await this.$store.getters["match/getMovimenti"].items.filter(movimento => movimento.artificial_id_movimento == movimento_id)[0];
                console.log("movimento droppato");
                console.log(movimentoDroppato);                
                this.movimentiDroppati.push(movimentoDroppato);
            }
            else if (partita){
                e.target.appendChild(partita);
                let partitaDroppata = await this.$store.getters["match/getPartite"].items.filter(partita => partita.numerodocumento == partita_id)[0];
                console.log("partita droppato");
                console.log(partitaDroppata);                
                this.partiteDroppate.push(partitaDroppata);
            }
        },
        async rimuoviMovimentiEPartiteSalvati() {
            console.log("rimuovi movimenti dallo stato")
            // RIMUOVI MOVIMENTI DALLO STATO
            let movimentiFiltrati = await this.$store.getters["match/getMovimenti"].items.
            filter(movimento => {
                let ok = true;
                for(let movimentoDroppato of this.movimentiDroppati) {
                    if(movimento.artificial_id_movimento == movimentoDroppato.artificial_id_movimento) {
                        console.log("movimento trovato:" + movimento.artificial_id_movimento);
                        ok = false;
                    }
                }
                return ok;
            })
            let movimentiStructure = await this.$store.getters["match/getMovimenti"];
            console.log("Rimuovo movimenti: " + (movimentiStructure.total - movimentiFiltrati.length));
            movimentiStructure.items = movimentiFiltrati;
            movimentiStructure.total = movimentiFiltrati.length;
            await this.$store.commit('match/setMovimenti', movimentiStructure);

            // RIMUOVI MOVIMENTI DALLO STATO
            let partiteFiltrate = await this.$store.getters["match/getPartite"].items.filter(partita => {
                let ok = true;
                for(let partitaDroppata of this.partiteDroppate) {
                    if(partita.numerodocumento == partitaDroppata.numerodocumento) {
                        console.log("partita trovato:" + partita.numerodocumento);
                        ok = false;
                    }
                }
                return ok;
            })
            let partiteStructure = await this.$store.getters["match/getPartite"];
            console.log("Rimuovo partite: " + (partiteStructure.total - partiteFiltrate.length));
            partiteStructure.items = partiteFiltrate;
            partiteStructure.total = partiteFiltrate.length;
            await this.$store.commit('match/setPartite', partiteStructure);

            document.getElementById("dropArea").innerHTML="";

            this.differenzeTotale = 0;
            this.differenzeCorrenti = null;
            this.movimentiDroppati = [];
            this.partiteDroppate = [];
        }
    },
    computed:{
        nomeDocumento : function() {
            console.log("Cerca nome documento ");
            if(!this.Movimento || !this.Movimento.iddocumento) {
                return "";
            }
            let ilDocumento = this.$store.getters["match/getDocumento"](this.Movimento.iddocumento);
            if(ilDocumento) {
                return ilDocumento.nomefileoriginario;
            } 
            console.log("documento non trovato");
            return "";
        },
        saldo: function() {
            let sommaTotale = 0;
            if(this.partiteDroppate) {
                for (const p of this.partiteDroppate) { 
                    console.log("somma partita: " + p.valutalordo); 
                    sommaTotale += p.valutalordo;
                }
            }
            if(this.movimentiDroppati) {
                for (const m of this.movimentiDroppati) { 
                    console.log("somma movimenti: " + m.valuta_importo); 
                    sommaTotale -= m.valuta_importo;
                }
            }
            sommaTotale = sommaTotale + this.differenzeTotale;
            return  this.globalRounderToTwoDecimals(sommaTotale);
        },
        
    }

}
</script>

<style scoped>


.dropStyle.dropsaldoZero{
    background-color: rgba(32, 171, 60, 0.242);
}

.saldoStyle{
    margin: 20px 45px 5px 5px;
    text-align: center;
}
.btnChiudiStyle{
    background-color: #FFDFCD !important;
    border: 1px solid rgb(0, 0, 0);
    margin: 40px 45px 5px 5px;
    float: right;
}
.labeldropNOTVisible{
    display: none;
}
.labeldropVisible{
    text-align: center;
    width: 100%;
    min-height: 50px;
    display:table;
}
.dropStyle{
    border: 1px solid rgb(0, 0, 0);
  background-color: rgba(203, 197, 197, 0.242);
  min-height: 180px;
  margin-bottom: 20px;
  width: 65%;
  border-radius: 50px;
  float: left;
  padding:10px
}


.v-application p {
    margin-bottom: 1px;
    font-size: 14px;
}
.dataStyle{
   padding:2px !important;
    border: 1px solid rgba(3, 3, 3, 0.17);
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 0.505);
    float: right;
    min-width:90%;
    margin-top: 2px;
    margin-right: 5px;
    font-size: 13px;
    text-align: center;
    border-radius: 3px;
    white-space:nowrap;
    height: 30px;
}
.riga{
    border-right: 1px solid rgba(0, 0, 0, 0.342);
    padding: 5px;
    vertical-align: middle;
    width:22%;
    
}
.datiStyle{
    border: 1px solid rgb(0, 0, 0);
  background-color: rgba(203, 197, 197, 0.242);
  min-height: 150px;
  margin-top: 10px;
  
}
.divRigaStyle{
    float:left;
    height: 33%;
    width: 100%;
}

.divPartiteStyle{
    float:right !important;
    width:48%
}

.divMovimentiStyle{
    float:left;
    width:48%;
}

.btnBackStyle{
    background-color: transparent !important;
    margin: 30px 10px 20px 10px;
    margin-bottom: 2px;
}
.btnOkStyle{
    background-color: transparent !important;
    float: right;
    text-shadow: 1px 1px #3a383850;
}

</style>