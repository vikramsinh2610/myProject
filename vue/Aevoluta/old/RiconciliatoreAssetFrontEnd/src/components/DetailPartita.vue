<template>
<div>
  <div v-for="match in matches.items" :key="match.idmatch" class="match">
     <div v-if="match.idmatch == idVal">
       <div v-for="partita in match.partite" :key="String(match.idmatch) + String(partita.iddb)" >
      <v-card style="background-color: rgba(215, 214, 214, 0.751); margin-top: 20px">
              <p  style="text-align: center; line-height: 50px;margin-bottom: 3px">
                 Numero Doc. {{partita.numerodocumento}}
              </p>
          </v-card>
          <v-card class="cardStyle">
              <table style="width:100%">
               <tr>
              <td class="cell" :colspan="3"> <p class="pStyle">Data scadenza:</p></td>
              <td class="cell" :colspan="3"> 
                  <p class="dataStyle">{{partita.datascadenza | formatDateShort}}</p>
                </td>
          </tr>
          <tr>
              <td class="cell" :colspan="3"> <p class="pStyle">Data documento:</p></td>
              <td class="cell" :colspan="3"> 
                  <p class="dataStyle">{{partita.datadocumento | formatDateShort}}</p>
                </td>
          </tr>
          <tr>
              <td class="cell" :colspan="3"> <p class="pStyle">Divisa:</p></td>
              <td class="cell" :colspan="3"> 
                  <p class="dataStyle">{{partita.valuta}}</p>
                </td>
          </tr>
          <tr>
              <td class="cell" :colspan="3"> <p class="pStyle" >Sap ID</p></td>
              <td class="cell" :colspan="3">
                  <p class="dataStyle">{{partita.sapid}}</p> </td>
          </tr>
          <tr>
              <td class="cell" :colspan="3"> <p class="pStyle" >Ragione Sociale</p></td>
              <td class="cell" :colspan="3">
                  <p class="dataStyle">{{partita.ragionesociale}}</p> </td>
          </tr>
          <tr>
              <td class="cell" :colspan="3"> <p class="pStyle">Importo in valuta ({{partita.valuta}})</p></td>
              <td class="cell" :colspan="3"> 
                  <p class="dataStyle">{{partita.valutalordo}}</p></td>
          </tr>
          <tr >
              <td class="cell" :colspan="3"> <p class="pStyle">Importo in EUR</p></td>
              <td class="cell" :colspan="3"> 
                  <p class="dataStyle">{{partita.eurlordo| formatTruncateDecimal(2)}}</p></td>
          </tr>
          <tr>
              <td class="cell" :colspan="3"> <p class="pStyle">Sconto in valuta </p></td>
              <td class="cell" :colspan="3"> 
                  <p class="dataStyle">{{sconto(match, partita)}}</p></td>
          </tr>
          <tr>
              <td class="cell" :colspan="3"> <p class="pStyle">Sconto in valuta% </p></td>
              <td class="cell" :colspan="3"> 
                  <p class="dataStyle">{{((100 * sconto(match, partita)) / partita.valutalordo )| formatTruncateDecimal(2)}} % </p></td>
          </tr>
          <tr>
              <td class="cell" :colspan="3"> <p class="pStyle">Note SAP </p></td>
              <td class="cell CellWithAevoTooltip" :colspan="3" > 
                      <span class="AevoTooltip">{{partita.testo_partita }}</span>
                  <p class="dataStyle">{{partita.testo_partita ? partita.testo_partita : "&nbsp;" | formatTruncate(20, '...')}} </p></td>
          </tr>
          <tr>
              <td class="cell" :colspan="3"> <p class="pStyle">Codice CondPag </p></td>
              <td class="cell" :colspan="3"> 
                  <p class="dataStyle">{{partita.codice_condizioni_pagamento}} &nbsp;</p></td>
          </tr>
          <tr>
              <td class="cell" :colspan="3"> <p class="pStyle">Desc CondPag </p></td>
              <td class="cell CellWithAevoTooltip" :colspan="3" > 
                      <span class="AevoTooltip">{{partita.descrizione_condizioni_pagamento }}</span>
                  <p class="dataStyle">{{partita.descrizione_condizioni_pagamento   | formatTruncate(20, '...')}} &nbsp;</p></td>
          </tr>
          <tr>
              <td class="cell" :colspan="3"> <p class="pStyle">ID Partita </p></td>
              <td class="cell" :colspan="3"> 
                  <p class="dataStyle">{{partita.iddb}}</p></td>
          </tr>
              </table>
         
        </v-card>
        <div > 
            <p style="float:left; margin-top:7px">Visualizza Documento</p>
            <v-btn style=" margin: 0px 5px 0px 5px; " icon class="flexcol" @click="openDoc(partita.numerodocumento, partita.iddocumento)">
            <v-icon size="20">mdi-open-in-new</v-icon>
            </v-btn>
        </div>
    </div>
     </div>

    
    
</div>
</div>

    
</template>
<script>

export default ({
  props:{
      origin: null,
      idVal: null
    },
    created(){
      console.log("mi e' arrivata questa ID: " + this.idVal)
    },
    name: 'DetailPartita-item',
    
    methods: {
        openDoc(aNumerodocumento, anIddocumento){
            let riferimento = {colonna: "Numero documento", idPartita: aNumerodocumento, iddocumento: anIddocumento};
            this.$emit('openDoc', riferimento)
        },
        sconto(aMatch, partita){
          console.log("sconto per: " + aMatch + " partita:  " + partita)
          if(aMatch.partite_di_pareggio && aMatch.partite_di_pareggio.length > 0) {
            console.log("ci sono partite di pareggio")
            let scontoPartita = aMatch.partite_di_pareggio.find(partita_di_pareggio => partita_di_pareggio.id_partita === partita.iddb);
            if(scontoPartita) {
              console.log("partita di pareggio trovata")
              return scontoPartita.importo;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        }
    },
    computed: {
        matches: function() {
          if(this.origin) {
            return this.$store.getters["match/getMatches"];
          } else {
            return this.$store.getters["match/getMatchesChiusi"];
          }
        }
    }
      
    
})
</script>
<style scoped>
.cardStyle{
    background-color: #ffffffcc;
  padding: 10px;
}
.cell{
  padding: 1px;
}
.pStyle{
    font-size: 13px ;
    padding: 1px;
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

}
</style>
