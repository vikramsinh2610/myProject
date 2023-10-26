<template>
<div class="text-center">
    <v-dialog
      v-model="show"
      width="1000"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Seleziona differenze. Saldo: {{saldo}} {{valuta}}
        </v-card-title>
  <div>
      <v-row>
        <v-col align="center"
            justify="center">
            <v-data-table
            :headers="headers"
            :items="differenze"
            hide-default-footer
        >
        <template v-slot:[`item.idPartita`]="props">
            <v-edit-dialog
            clearable
            style="min-width: 100px;"
            :return-value.sync="props.item.idPartita"
            large
            >
            {{ props.item.idPartita }}
            <template v-slot:input>
                        <v-select style="width:100%" 
                            :items="partite"
                            item-text="iddb"
                            item-value="iddb"
                            clearable
                            v-model="props.item.idPartita">                         
                        </v-select>
            </template>
            </v-edit-dialog>
        </template>
        <template v-slot:[`item.codice`]="props">
            <v-edit-dialog
            style="min-width: 100px;"
            :return-value.sync="props.item.codice"
            large
            >
            {{ props.item.codice.nomeconto }}
            <template v-slot:input>
                        <v-select style="width:100%" 
                            :items="differenzePartiteCodici"
                            item-text="nomeconto"
                            item-value="codicesapconto"
                            return-object
                            v-model="props.item.codice">                         
                        </v-select>
            </template>
            </v-edit-dialog>
        </template>
        <template v-slot:[`item.importo`]="props">
            <v-edit-dialog
            :return-value.sync="props.item.importo"
            large
            >
            <div>{{ props.item.importo }}</div>
            <template v-slot:input>
                <v-text-field
                v-model="props.item.importo"
                label="Edit"
                single-line
                autofocus
                ></v-text-field>
            </template>
            </v-edit-dialog>
        </template>
        <template v-slot:[`item.dare`]="{ item }">
            {{segnoPerCodice(item)}}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
        <v-icon
            v-if="differenze.length > 1"
            small
            @click="deleteItem(item)"
        >
            mdi-delete
        </v-icon>
        <v-icon
            large
            @click="copySaldo(item)"
        >
            mdi-content-copy
        </v-icon>
        <v-icon
            large
            @click="addItem()"
        >
            mdi-plus-box-outline
        </v-icon>
        </template>
        </v-data-table>
    </v-col>
    </v-row>
    <v-card-title class="text-h7 dense">
          Saldo Finale: {{saldoFinale}}  {{valuta}}
    </v-card-title>

  </div>
    <v-card-actions>
        <v-col class="text-right">
      <v-btn class="mr-5"
        outlined
        text
        elevation="0"
        @click="cancelModal"
      >
        Cancella
      </v-btn>
      <v-btn
        outlined
        text
        elevation="0"
        @click="chiudiPartita"
        :disabled="!(saldoFinale===0)"
      >
        Chiudi Match
      </v-btn>
</v-col>
    </v-card-actions>

           <div id="newSelect" style="width:100%">

               </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import EventBus, { ACTIONS } from '../components/Helpers/EventBus.js';

export default {
    props:{
        valuta: null,
        showModal: null,
        saldo: null,
        differenzeInIngresso: null,
        partite: null,
    },
    data(){
        return{
            differenze: [],
            differenzePartiteCodici: [],
            differenzaCorrente: null,
            ammontareCorrente: null,
            show: false,


        pagination: {},
        headers: [
          { 
            text: 'idPartita', 
            align: 'start',
            sortable: false,
            value: 'idPartita' },
          {
            text: 'Codice Differenza',
            value: 'codice',
          },
          { text: 'Dare/Avere', value: 'dare' },
          { text: 'Importo', value: 'importo' },
          { text: 'Actions ', value: 'actions', sortable: false },
        ],
        }
    },
    computed: {
        saldoFinale: function() {
            return this.globalRounderToTwoDecimals(Number(this.saldo) + Number(this.differenzaTotale()));
        }   
    }, 
    async beforeMount() {
        console.log("mounted: ", this.showModal);
        this.differenzePartiteCodici = this.$store.getters["match/getContiDifferenzeIncassiPartite"];
        /* this.preparaDifferenze();*/
    },
    watch: { 
            showModal: function(newVal, oldVal) { // watch it
                console.log('showModal changed: ', newVal, ' | was: ', oldVal);
                this.preparaDifferenze();
                this.show = true;
            },
        },
    methods:{
        copySaldo (item) {
            item.importo = 0;
            let delta = this.globalRounderToTwoDecimals(Number(this.saldo) + Number(this.differenzaTotale()));
            if(this.segnoPerCodice(item) == "+") {
                if(delta <= 0) {
                    item.importo = Math.abs(delta);
                } else {
                        EventBus.$emit(ACTIONS.SNACKBAR_KO, "Arrotondamento negativo non compatibile");
                }
            } else {
                if(delta>=0) {
                    item.importo = delta;
                } else {
                        EventBus.$emit(ACTIONS.SNACKBAR_KO, "Arrotondamento positivo non compatibile");
                }

            }
        },
        differenzeSintetiche() {
            let diffrenzeDaInviare = [];
            for(const item of this.differenze)  {
                const cod_sap = item.codice.codicesapconto;
                
                let cod = this.$store.getters["match/getContiDifferenzeIncassiPartite"]
                        .find(diff => diff.codicesapconto === cod_sap)
                        .codiceinternoconto;
                let importo = this.globalRounderToTwoDecimals(item.importo);
                let id = item.idPartita;
                let diff = {};
                if(id) {
                    diff={id, cod, importo};
                } else {
                    diff={cod, importo};

                }
                console.log(diff);
                diffrenzeDaInviare.push(diff);
            }   
            return diffrenzeDaInviare;
        },
        differenzaTotale() {
            let differenzaTotale = 0;
            console.log(this.differenze);
            for(const item of this.differenze)  {
                console.log("Codice: " + item.codice.codicesapconto)
                if(item.codice.codicesapconto && (item.codice.codicesapconto != "6200000" && item.codice.codicesapconto != "6140000")){
                    console.log("Passato: " + item.codice.codicesapconto)
                    if(this.segnoPerCodice(item) === "+") {
                        differenzaTotale += Number(item.importo);
                    } else {
                        differenzaTotale -= Number(item.importo);
                    }
                }
            }

            return this.globalRounderToTwoDecimals(differenzaTotale);
        },
        deleteItem (item) {
            this.editedIndex = this.differenze.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.differenze.splice(this.editedIndex, 1)
        },
        segnoPerCodice (item) {
            console.log("Segno per codice: " + item.codice.codicesapconto +  " with " + this.differenzePartiteCodici);
            if(
                this.differenzePartiteCodici.find(differenza => {
                return differenza.codicesapconto === item.codice.codicesapconto;})
                &&
                this.differenzePartiteCodici.find(differenza => {
                return differenza.codicesapconto === item.codice.codicesapconto;}).iscontoinavere
                ){
                return "-";
            } else {
                return "+"
            }
        },
        addItem () {
            this.differenze.push({codice: {nomeconto: "Arrotondamenti/Abbuoni", codicesapconto: "5564515"}, importo: 0})
        },
        cancelModal () {
            console.log("Cancel Modal");
            this.show=false;
        },
        chiudiPartita () {
            console.log("Chiudi Partita");
            this.$emit('setDifferenzeConti', {differenze: this.differenzeSintetiche(), differenzaTotale: this.differenzaTotale()});            this.show=false;
        },
        preparaDifferenze() {
            console.log("prepara differenze: " + this.differenzeInIngresso)
            if(this.differenzeInIngresso && this.differenzeInIngresso.length > 0) {
                EventBus.$emit(ACTIONS.SNACKBAR_OK, "Partite pre-popolate dal Matcher");

                this.differenze = [];
                for(const item of this.differenzeInIngresso)  {
                    let codice = this.differenzePartiteCodici.find(diff => diff.codiceinternoconto === item.cod);
                    if((codice.codicesapconto == "5564515" || codice.codicesapconto == "4519500") && (Math.abs(Number(item.importo)) > 1) ){
                        this.differenze.push({codice: {nomeconto: "", codicesapconto: ""}, importo: Number(item.importo)})
                    } else if(codice.codicesapconto != "6200000" && codice.codicesapconto != "6140000"){
                        if(item.id_partita) {
                            this.differenze.push({idPartita: item.id_partita, codice: {nomeconto: codice.nomeconto, codicesapconto: codice.codicesapconto}, importo: Number(item.importo)})
                        } else {
                            this.differenze.push({codice: {nomeconto: codice.nomeconto, codicesapconto: codice.codicesapconto}, importo: Number(item.importo)})
                        }
                    }
                }   
            } else {
                if(this.saldo < 0) {
                    if(this.saldo < -1) {
                        this.differenze = [{codice: {nomeconto: "", codicesapconto: ""}, importo: 0}];
                    } else {
                        this.differenze = [{codice: {nomeconto: "Arrotondamenti/Abbuoni passivi", codicesapconto: "5564515"}, importo: 0}];
                    }
                } else {
                    if(this.saldo > 1) {
                        this.differenze = [{codice: {nomeconto: "", codicesapconto: ""}, importo: 0}];
                    } else {
                        this.differenze = [{codice: {nomeconto: "Arrotondamenti/Abbuoni attivi", codicesapconto: "4519500"}, importo: 0}];
                    }
                }
//                this.copySaldo(this.differenze[0]);
            }
        },

    }
}
</script>

<style scoped>

.modal{
    width:400px;
    min-height:200px;
    padding: 20px;
    margin: 100px auto; 
    background: white;
    border-radius: 10px;
    border: 4px solid rgb(14, 153, 33);
}

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