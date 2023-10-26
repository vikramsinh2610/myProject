<template>

    <div class="containerStyle">
      <div class="box">
        <div class="datiMatch"> 
           <strong>ID Match: {{theMatch.idmatch}}</strong>
        <p style="font-size:13px">Saldo (movimenti - partite - sconto): <strong>{{theMatch.differenzamonetizzatainvalutaconimportoscontato }}</strong></p>
        <p v-if="theMatch.code_stato_trasferimento_match" style="font-size:13px;margin-bottom:2px">Stato trasferimento su SAP: {{descrizioneMatch(theMatch) }}</p>
        <p v-if="theMatch.datachiusuramatch" style="font-size:13px;margin-bottom:2px">Data Chiusura Match: {{theMatch.datachiusuramatch | formatDateTime}}</p>
        <p style="font-size:13px;margin-bottom:2px">Percentuale correttezza probabilità: {{theMatch.score }}  </p>
        <p style="font-size:13px;margin-bottom:2px">dettagli score:
        <v-btn style=" margin: 0px 5px 0px 5px;" icon class="flexcol" @click="showText = !showText">
          <v-icon size="20">mdi-arrow-down-box</v-icon>
            </v-btn></p>
        <p v-if="showText" style="font-size:13px;margin-bottom:2px">{{theMatch.scorepartite  }}</p>
<div v-if="!showText" style="padding:20px">
<table style="  margin-left: auto;margin-right: auto;text-align:left; padding:20px" class="datiStyle">
  <tr>
    <th style="width:300px">Tipo di scoring</th>
    <th>Valore</th>
  </tr>
  <tr>
    <td >Scoring riconoscimento cliente</td>
    <td>{{theMatch.gri_scoring_riconoscimento_cliente }}</td>
  </tr>
  <tr>
    <td >Scoring riconoscimento importo</td>
    <td>{{theMatch.gri_scoring_riconoscimento_importo }}</td>
  </tr>
  <tr>
    <td >Scoring riconoscimento partita</td>
    <td>{{theMatch.gri_scoring_riconoscimento_partita }}</td>
  </tr>
  <tr>
    <td >Premialità</td>
    <td>{{theMatch.gri_scoring_premialita }}</td>
  </tr>
  <tr>
    <td >Rettifiche</td>
    <td>{{theMatch.gri_scoring_rettifiche }}</td>
  </tr>
  <tr>
    <td >Penalizzazioni</td>
    <td>{{theMatch.gri_scoring_penalizzazioni }}</td>
  </tr>
</table>
</div>
        </div>
       
        
        <table style="width:100%">
        <tr>
        <td style="vertical-align: text-top;width: 35%;" >
          <DetailMovimento @openDoc="openDoc($event)" @openMovimento="openMovimento($event)" :idVal="idVal" :origin=origin></DetailMovimento>
        </td>
      
      <td style="vertical-align: text-top;  ">
        
          <div style="width:100%; text-align:center">
          
            <img  class="imgStyle" src="../assets/arrow.png">
          </div>
          <div v-if="origin" style="width:100%; text-align:center">
            <v-btn @click="dissocia" class="btnDissociaStyle"> Dissocia </v-btn>
            <v-btn @click="modificaPartite" class="btnDissociaStyle" style="margin-left:20px;"> Modifica Partite </v-btn>
          </div>
          
      </td>
      <td style="vertical-align: text-top; ;width: 35%">
        <DetailPartita @openDoc="openDoc($event)" :idVal="idVal" :origin=origin></DetailPartita>
      </td>
    </tr>
                  </table>
                  <v-dialog
                    v-model="show"
                    width="100%"
                    height="100%"
                    class="pl-5"
                  >    
                    <v-card>

                      <WizardPartite :partiteInIngresso="theMatch.partite" :ragioneSocialeConfermata="show" :movimentoCorrente="theMatch.movimenti[0]" :differenzeInIngresso="theMatch.partite_di_pareggio" @movimentoChiuso="movimentoChiuso" @dissocia="dissocia($event)"></WizardPartite>
                    </v-card>
                </v-dialog>

     <v-card v-if="theMatch.partite_di_pareggio" style="background-color: rgba(215, 214, 214, 0.751); margin-top: 20px;width:60%;margin-left:auto;margin-right:auto">
              <p  style="text-align: center; line-height: 50px;margin-bottom: 3px">
                 Partite di Pareggio {{theMatch.code_stato_trasferimento_match ? "":"proposte dal Matcher "}}.  Saldo +movimenti -partite parziale: {{theMatch.saldo}}
              </p>
          </v-card>
   <div v-for="differenzaPartite in theMatch.partite_di_pareggio" :key="differenzaPartite" style="border-radius: 3px;border: 1px solid rgba(3, 3, 3, 0.17);background-color: #ffffffcc;width:60%;margin-left:auto;margin-right:auto" >
        <v-container >
          <v-row >
            <v-col cols="4">
              <v-row>
               <p class="pStyle1">Conto:</p>
                  <p class="dataStyle1">{{nomeConto(differenzaPartite.cod)}}</p>
              </v-row>
            </v-col>
                  <v-spacer></v-spacer>

            <v-col cols="4">
              <v-row>
               <p class="pStyle1">ID Partita:</p>
                  <p class="dataStyle1">{{differenzaPartite.id_partita ? differenzaPartite.id_partita : "Nessuna Partita Associata"}}</p>
              </v-row>
            </v-col>
                  <v-spacer></v-spacer>

            <v-col cols="2">
              <v-row>
               <p class="pStyle1">Importo:</p>                 
              <p class="dataStyle1">{{segnoPerCodice(differenzaPartite.cod)}}</p>
               <p class="dataStyle1">{{differenzaPartite.importo}} {{((differenzaPartite.cod === 2) || (differenzaPartite.cod === 8)) ? 'EUR' : (theMatch.movimenti[0].valuta)}}</p>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
    </div>
          
               <p >&nbsp;</p>                 

      </div>
      
        

    
    </div>
</template>
<script>
import DetailMovimento from "./DetailMovimento.vue";
import DetailPartita from "./DetailPartita.vue";
import WizardPartite from "./wizard/WizardPartite.vue";

export default ({
  data(){
    return{
        theMatch: null,
        differenzePartiteCodici: null,
        show:false,
        showText:true
    }
  },
  props:{
      origin: null,
      idVal: null,
    },
    name: 'DetailMatch-item',
    components:{
      DetailMovimento,
      DetailPartita,
      WizardPartite
    },
    created () {
      this.show = false;
      this.differenzePartiteCodici = this.$store.getters["match/getContiDifferenzeIncassiPartite"];

      if(this.origin) {
        console.log("match aperto");
        this.theMatch = this.$store.getters["match/getMatches"].items.find(match => match.idmatch === this.idVal);
      } else {
        console.log("match chiuso");
        this.theMatch = this.$store.getters["match/getMatchesChiusi"].items.find(match => match.idmatch === this.idVal);
      }
      console.log("the Match found: " + this.theMatch + " for idVal: " + this.idVal);
    },
    methods: {
        // movimento chiuso viene usato solo per il caso in cui il movimento
        // viene completato con lo wizard partite
        movimentoChiuso() {
          this.show = false;
          this.$emit('confermaChiuso');
        },
        openDoc(event){
            this.$emit('openDoc', event)
        },
        openMovimento(event){
            console.log("Evento DetailMatch: open Movimento")
            this.$emit('openMovimento', event)
        },
        dissocia(event){
            this.$emit('dissocia', event)
        },
        modificaPartite() {
            this.show=true;
        },
        descrizioneMatch(match) {
            console.log("trova descrizione per codice stato:  " + match.code_stato_trasferimento_match)
            let state = this.$store.getters["match/getStatiProcessoMatch"].find(stato => {
            return stato.code === match.code_stato_trasferimento_match;
            })
            if(state) {return state.description}
            return "Stato Non Trovato per codice: " +match.code_stato_trasferimento_match;
        },
        nomeConto(codice) {
          let diff = this.differenzePartiteCodici.find(diff => diff.codiceinternoconto === codice);
          if(diff) {
            return diff.nomeconto;
          } else {
            return "codice non trovato"
          }
        },
        segnoPerCodice (codice) {
          let diff = this.differenzePartiteCodici.find(diff => diff.codiceinternoconto === codice);

            if(diff) {
              if(diff.iscontoinavere) {
                return "-";
              } else {
                  return "+"
              }
            } else {
              return "N/A"
            }
        },

    },
    computed: {
        matches: function() {
            return this.$store.getters["match/getMatches"]
        }
    }    
})
</script>

<style scoped>
.datiMatch{
  text-align: center;
  border: 1px solid rgb(0, 0, 0);
    background-color: rgba(250, 219, 219, 0.611);
}
.dataStyle{
    font-size: 15px;
    border: 1px solid rgba(3, 3, 3, 0.17);
    padding-right: 5px;
    padding-left: 5px;
    padding-top: 1px;
    padding-bottom: 1px;
    text-align: center;
    border-radius: 3px;
    margin-bottom: 5px;
white-space:nowrap;
}
.dataStyle1{
    font-size: 15px;
    border: 1px solid rgba(3, 3, 3, 0.17);
    padding-right: 5px;
    padding-left: 5px;
    padding-top: 1px;
    padding-bottom: 1px;
    text-align: center;
    border-radius: 3px;
    margin-top:5px;
white-space:nowrap;
}
.cardStyle{
    background-color: #ffffffcc;
  padding: 10px;
}
.riga{
    border-right: 1px solid rgba(0, 0, 0, 0.342);
    padding: 5px;
    vertical-align: middle;
    width:22%;
    
}
.cell{
  padding: 1px;
}

.pStyle{
    font-size: 13px ;
    padding: 1px;
    margin-top:5px;
    text-align: left;
}

.pStyle1{
    font-size: 13px ;
    padding: 1px;
    margin-top:8px;
    text-align: left;
}

.datiStyle{
    border: 1px solid rgb(0, 0, 0);
  background-color: rgba(203, 197, 197, 0.242);
  min-height: 150px;
  margin-top: 10px;
  
}
.box{
  padding: 4px;
  overflow:auto;
  height: 740px;
    
}
.containerStyle{
    border: 1px solid rgb(0, 0, 0);
    background-color: rgba(203, 197, 197, 0.242);
    width: 95%;
    padding: 5px;
    padding-bottom:0px;
}

.imgStyle{
    margin: auto;
    margin-top: 10%;
    
}

.RGStyle{
    color: red;
    
}

.btnDissociaStyle{
    border-radius: 30px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 25%;
}





</style>
