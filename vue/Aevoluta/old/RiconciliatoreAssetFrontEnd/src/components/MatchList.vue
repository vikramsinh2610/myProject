<template>
<div>
      <v-row class="ml-5">
        <v-col cols="9">
        <Select :chiusi="false"></Select>
        </v-col>
        <v-col
          class="d-flex"
          cols="2">
            <v-checkbox
              v-model="sortCondPag"
              label="Sort Condizioni Pagamento"
            ></v-checkbox>
            <v-tooltip bottom style="max-width:500px">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="ml-2 mr-4" size="40"
                    v-bind="attrs"
                    v-on="on"
                    >mdi-help-circle-outline</v-icon>
                </template>
                <span class="body-1" style="max-width:500px">
                  Ordina i match in base al saldo (utilizza il saldo semplice se la checkbox e' vuota, 
                  mentre il saldo con le condizioni di pagamento se la checkbox e' selezionata).
                </span>
            </v-tooltip>
            <v-btn class="mt-4" @click.prevent="cambiaSort" > 
                <span> {{sortDirection}} </span> 
            </v-btn>
        </v-col>
      </v-row>
  <v-container  class="containerStyle">


<div class="box">  
  <table style="display: table; width:100%">
    <div v-if="matchesVisualizzati.length==0">
         <p> <i>Nessun match trovato per i parametri di ricerca.</i></p>
    </div>

     <div v-for="match in matchesVisualizzati" :key="match.idmatch" class="match">
     
      <tr style="display:table; width:100%">
        
        <td style="float:left; width: 30%">
            <div v-for="movimento in match.movimenti" :key="String(match.idmatch) + String(movimento.artificial_id_movimento)" style="float:left;">
        <v-icon size="26" >mdi-file</v-icon> 
          <strong style="font-size:15px"> {{movimento.ragionesociale  | formatTruncate(30, '...')}}</strong>
          <div id="datiMovimento" class="datiStyle">
            <p>importo: <i>{{ movimento.valuta_importo}}</i></p>
            <p>data op: <i>{{ movimento.dataoperazione | formatDateShort}}</i></p>
            <p>valuta: <i>{{movimento.valuta}}</i></p>
            <p>note: <i :title=movimento.notemovimento>{{movimento.notemovimento | formatTruncate(25, '...')}} </i></p>
            </div>
        </div>
        
        </td>
        <td style="float:left; vertical-align:middle; width: 30%">
            <router-link :to="{name: 'matchassociated2', params: {id: match.idmatch, saldo: match.saldo} }">
                <v-btn :title="`score: ${match.score} \nNote match: ${match.scorepartite}`" class="btnImgStyle" elevation="0"  >
            <img class="imgMatchListStyle" src="../assets/ImgMatchAssociatiLista.png">
          </v-btn>
            </router-link>
          <v-row >
            <v-col  align="center" justify="center">
               <p  style="float:none"> <input v-if="match.saldo==0" style="transform: scale(1.4); margin:10px" type="checkbox" :id="match.idmatch"  @click="check(match.idmatch)">Saldo: {{match.saldo}}</p>
               <p  style="float:none"> Saldo Cond.Pag.: {{match.differenzamonetizzatainvalutaconimportoscontato}}</p>
            </v-col>
          </v-row>
        </td>
        <td style="float:right; width: 30%">
          <div v-for="partita in match.partite" :key="String(match.idmatch) + String(partita.iddb)" style="float:left;">
           <v-icon size="26">mdi-file</v-icon> 
            <strong style="font-size:15px"> {{partita.ragionesociale | formatTruncate(30, '...')}}</strong>
            <div id="datiMovimento" class="datiStyle">
                <p >importo <i>{{ partita.valutalordo}}</i></p>
                <p >data doc. <i>{{ partita.datadocumento | formatDateShort}}</i></p> 
                <p >valuta <i>{{ partita.valuta}}</i></p>
                <p >ID Partita <i>{{partita.numerodocumento }}</i></p> 
            </div>
         </div>
        </td>
      </tr>
      <hr>
    </div>
   </table>
    
  </div>
  </v-container>
   <div style="width:90%; margin:auto;">
    <p class="countStyle"> Numero saldi 0: {{numero_zeri}} / Numero saldi cond.pag 0: {{numero_zeri_scontati}}</p>
    <br/>
    <p class="countStyle"> Selezionati: {{numero_match}} / Scaricati: {{num_scaricati_match}} / Totali: {{num_tot_match}}</p>
  <v-btn class="pagination_button" @click.prevent="loadMoreMatches()" :disabled="num_scaricati_match===num_tot_match">Carica altri Match</v-btn>
    
  </div>
    <br>
</div>

</template>

<script>
import Select from "@/components/Select.vue";

export default {
  name: "MatchList",
    data(){
      return{
         checkedMatch: [],
         sortCondPag: false,
      }
    },
    components: {
        Select,
    },
    created() {
        this.$store.commit('auth/setIsLoading', false);
    },
    mounted() { 
        this.$store.commit('auth/setIsLoading', false);
    },    
    computed: {
        matchesVisualizzati: function() {
          let imatch = structuredClone(this.$store.getters["match/getMatchesFiltrati"]);
          console.log("matches da visualizzare: ");
          console.log(imatch);
          if(!imatch) return [];
          let _that = this;
          if(this.$store.getters["match/getIsSorted"]) {
            imatch.sort(function compareFn(a, b) { 
                if(!_that.sortCondPag) {return b.saldo - a.saldo}
                else {return b.differenzamonetizzatainvalutaconimportoscontato - a.differenzamonetizzatainvalutaconimportoscontato}
              });
          } else {
            imatch.sort(function compareFn(a, b) { 
              if(!_that.sortCondPag) {return a.saldo - b.saldo}
              else {return a.differenzamonetizzatainvalutaconimportoscontato - b.differenzamonetizzatainvalutaconimportoscontato}
              });
          }
          return imatch;
        },      
        numero_match: function() {
          return this.matchesVisualizzati.length;
        },
        numero_zeri: function() {
          if(this.matchesVisualizzati) {
            return this.matchesVisualizzati.filter(match => (Number(match.saldo) === 0)).length;
          } else {
            return 0;
          }
        },
        numero_zeri_scontati: function() {
          if(this.matchesVisualizzati) {
            return this.matchesVisualizzati.filter(match => (Number(match.differenzamonetizzatainvalutaconimportoscontato) === 0)).length;
          } else {
            return 0;
          }
        },
        num_tot_match: function() {
          return (this.$store.getters["match/getMatches"]) ? this.$store.getters["match/getMatches"].total : 0;
        },
        num_scaricati_match: function() {
          return (this.$store.getters["match/getMatches"]) ? this.$store.getters["match/getMatches"].size : 0;
        },
        sortDirection: function() {
          if(this.$store.getters["match/getIsSorted"]) {
            return "Sort Discendente";
          } else {
            return "Sort Crescente";
          }
        }
    },
    methods:{
        async loadMoreMatches(){
          console.log("loading more");
          let params = new URLSearchParams();
          await this.$store.dispatch("match/LoadMoreMatches", {params: params, soloAperti:true});
          this.matchesOrdinati = structuredClone(this.$store.getters["match/getMatchesFiltrati"]);
        },
        cambiaSort() {
          let sortUp = this.$store.getters["match/getIsSorted"];
          console.log("cambia sort da: " + sortUp);
          this.$store.commit('match/setIsSorted', !sortUp);
        },
        differenzaMovimentiMenoPartite(match) {
          let sommaMovimenti = 0;
          match.movimenti.forEach(function(movimento) {
              if (movimento.valuta_importo) {
                  sommaMovimenti += movimento.valuta_importo;
              }
          })
          let sommaPartite = 0;
          match.partite.forEach(function(partita) {
              if (partita.valutalordo) {
                  sommaPartite += partita.valutalordo;
              }
          })
          match.saldo = sommaMovimenti-sommaPartite;
          return sommaMovimenti-sommaPartite;
        },
        check(id){
          if(document.getElementById(id).checked){
            console.log("aggiungo tra i match da chiudere:" + id);
            this.checkedMatch.push(id);
            console.log(this.checkedMatch)
          }
          else if(!document.getElementById(id).checked){
            console.log("tolgo tra i match da chiudere:" + id);
            this.checkedMatch.splice(this.checkedMatch.indexOf(id ), 1);
            console.log(this.checkedMatch)
          }
          
        }
    }
}
</script>

<style scoped>
p {
  float: left;
  margin-right: 15px;
  margin-bottom: 3px;
}
.box{
  padding: 4px;
  overflow:auto;
  height: 520px;
}
.pagination_button {
    float: left;
    font-size: 11px;
    text-align: center;
    text-transform: capitalize;
    background-color: rgba(203, 197, 197, 0.242) !important;
    padding: 0px 5px !important;
    border-radius: 5px;
   /* font-family: "'EB Garamond SC',ebGaramond12SC_WGDI,'Times New Roman',serif";*/
}
.countStyle{
  float:left;
  font-size:14px; 
}


.containerStyle{
    border: 1px solid rgb(0, 0, 0);
    background-color: rgba(203, 197, 197, 0.242);
    margin-top: 10px;
    
}

.cardStyle{
    margin: auto !important;
}
.datiStyle{
    font-size: 14px;
    margin-top:10px;
    margin-bottom: 10px;
}
.imgMatchListStyle{
    max-width: 60%;
    vertical-align: middle ;
}
.btnImgStyle{
    background-color: transparent !important;
    width: 100%;
}
.match{
  margin-top:5px;
  margin-bottom: 15px;
  width:100%;
}

</style>