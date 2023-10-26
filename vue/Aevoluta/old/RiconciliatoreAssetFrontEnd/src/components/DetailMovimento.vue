<template>
<div>
  <div v-for="match in matches.items" :key="match.idmatch" class="match">
     <div v-if="match.idmatch == idVal">
       <div v-for="movimento in match.movimenti" :key="String(match.idmatch) + String(movimento.artificial_id_movimento)" >
         <v-card style="background-color: rgba(215, 214, 214, 0.751); margin-top: 20px;">
              <p style="text-align: center; line-height: 50px;margin-bottom: 3px">
                  {{movimento.ragionesociale}}
              </p>
          </v-card>
         <v-card class="cardStyle">
           <table style="width:100%">
             <tr >
              <td class="cell" > <p class="pStyle">Data operazione:</p></td>
              <td class="cell" > 
                  <p class="dataStyle">{{movimento.dataoperazione | formatDateShort}}</p>
                </td>
          </tr>
          <tr>
              <td class="cell" > <p class="pStyle">Data di registrazione:</p></td>
              <td class="cell" > 
                  <p class="dataStyle">{{movimento.dataregistrazione | formatDateShort}}</p>
                </td>
          </tr>
          <tr>
              <td class="cell" > <p class="pStyle">Riferimento Piteco:</p></td>
              <td class="cell" > 
                  <p class="dataStyle">{{movimento.codice_piteco}}</p>
                </td>
          </tr>
          <tr>
              <td class="cell" > <p class="pStyle">Tipo</p></td>
              <td class="cell" >
                  <p class="dataStyle">{{movimento.tipo}}</p>
                </td>
          </tr>
          <tr>
              <td class="cell" > <p class="pStyle">Divisa/Cambio</p></td>
              <td class="cell" > 
                  <p class="dataStyle">{{movimento.valuta}}</p>
                </td>
                
          </tr>
          <tr>
              <td class="cell" > <p class="pStyle">Importo in valuta ({{movimento.valuta}}): </p></td>
              <td class="cell" > 
                  <p class="dataStyle">{{movimento.valuta_importo}}</p>
                </td>
                
          </tr>
          <tr>
              <td class="cell" > <p class="pStyle">Importo in EUR: </p></td>
              <td class="cell" > 
                  <p class="dataStyle">{{movimento.eur_importo}}</p>
                </td>
                
          </tr>
          <tr>
              <td :colspan="2">
                  <hr style="margin-bottom: 5px; width:100%">
              </td>
          </tr>
          
          <tr>
              <td class="cell" > <p class="pStyle">Conto:</p></td>
              <td class="cell" > 
                  <p class="dataStyle">{{movimento.conto}}</p>
                </td>
          </tr>
          <tr>
              <td class="cell"> <p class="pStyle">Data valuta:</p></td>
              <td class="cell" > 
                 <p class="dataStyle">{{movimento.datavaluta}}</p>
                </td>
          </tr>
          <tr>
              <td :colspan="2">
                  <hr style="margin-bottom: 5px; width:100%">
              </td>
          </tr>
          
          <tr>
            <td > <p class="pStyle">ID Movimento</p></td>
              <td > 
                  <p class="dataStyle">{{movimento.artificial_id_movimento}}</p>
                </td>
          </tr>
          <tr>
            <td > <p class="pStyle">ID Documento</p></td>
              <td > 
                  <p class="dataStyle">{{movimento.iddocumento}}</p>
                </td>
          </tr>
          <tr>
              <td class="cell" > <p class="pStyle">Sap ID cliente:</p></td>
              <td class="cell" > 
                 <p class="dataStyle"> {{movimento.sapid}}</p>
                </td>
          </tr>
          <tr>
                <td class="cell" > <p class="pStyle" > Note Movimento:</p></td>
              <td class="cell CellWithAevoTooltip" :colspan="2" > 
                      <span class="AevoTooltip">{{movimento.notemovimento }}</span>

                 <p class="dataStyle" >{{movimento.notemovimento  | formatTruncate(15, '...')}}</p>
                </td>
          </tr>
          <tr v-if="movimento.is_sottomovimento_con_supermovimento_aggregato">
                <td class="cell" > <p class="pStyle" style="border: 4px solid rgba(3, 3, 3, 0.17)" > Super-Movimento:</p></td>
                <td class="cell" > <p class="dataStyle strong" style="margin-top:3px;border: 4px solid rgba(3, 3, 3, 0.17)"> Visualizza Aggregato:
            <v-btn style=" margin: 0px 5px 0px 5px;" icon class="flexcol" @click="openMovimento(movimento)">
            <v-icon size="20">mdi-open-in-new</v-icon>
            </v-btn>
            </p></td>
          </tr>
           </table>
          
        </v-card>
        <div> 
            <p style="float:left; margin-top:7px">Visualizza Documento</p>
            <v-btn style=" margin: 0px 5px 0px 5px;" icon class="flexcol" @click="openDoc(movimento.iddocumento)">
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
    name: 'DetailMovimento-item',
    methods: {
        openDoc(nome){
            console.log(nome)
            this.$emit('openDoc', nome)
        },
        openMovimento(movimento){
            console.log(movimento)
            this.$emit('openMovimento', movimento)
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
p:after {
    content: "\00a0";
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

</style>
