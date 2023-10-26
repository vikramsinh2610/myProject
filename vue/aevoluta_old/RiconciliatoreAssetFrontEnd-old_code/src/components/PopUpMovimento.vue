 <template>
<div class="text-center" style="">
   <v-dialog
      v-model="show"
      width="800"
      padding="10"
      color="grey"
      overlay-color="grey"
      overlay-opacity="0.5"
    >
         <v-card style="background: white;background-color: rgba(215, 214, 214);">
              <p style="text-align: center; line-height: 50px;margin-bottom: 0px">
                  Codice Piteco Super Movimento: {{movimento.codice_piteco}}
              </p>
          </v-card>
         <v-card class="cardStyle">
           <table style="width:90%;margin-left:5%;margin-right:5%">
             <tr >
              <td class="cell" > <p class="pStyle">Data:</p></td>
              <td class="cell" > 
                  <p class="dataStyle">{{movimento.data | formatDateShort}}</p>
                </td>
          </tr>
          <tr>
              <td class="cell" > <p class="pStyle">Riferimento Piteco:</p></td>
              <td class="cell" > 
                  <p class="dataStyle">{{movimento.codice_piteco}}</p>
                </td>
          </tr>
          <tr>
              <td class="cell" > <p class="pStyle">Divisa/Cambio</p></td>
              <td class="cell" > 
                  <p class="dataStyle">{{movimento.valuta}}</p>
                </td>
                
          </tr>
          <tr>
              <td class="cell" > <p class="pStyle">Importo in {{movimento.valuta}}: </p></td>
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
              <td class="cell" > <p class="pStyle">Conto:</p></td>
              <td class="cell" > 
                  <p class="dataStyle">{{movimento.conto}}</p>
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
                  <p class="dataStyle">{{movimento.id_movimento_bancario}}</p>
                </td>
          </tr>
          <tr>
            <td > <p class="pStyle">ID Documento</p></td>
              <td > 
                  <p class="dataStyle">{{movimento.id_documento}}</p>
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
                      <span class="AevoTooltip">{{movimento.note }}</span>

                 <p class="dataStyle" >{{movimento.note  | formatTruncate(15, '...')}}</p>
                </td>
          </tr>
        <div> 
            <p style="float:left; margin-top:7px">Visualizza Documento</p>
            <v-btn style=" margin: 0px 5px 0px 5px;" icon class="flexcol" @click="openDoc(movimento.id_documento)">
            <v-icon size="20">mdi-open-in-new</v-icon>
            </v-btn>
        </div>
           </table>
          
        </v-card>
    </v-dialog>


      </div>
</template>

<script>

export default {
    props:{
        showModal: null,
        movimentoId: null,
    },
    data(){
        return{
            show: false,
            movimento: [],
        }
    },
    computed: {
    }, 
    async beforeMount() {
        /* this.preparaDifferenze();*/
    },
    watch: { 
            showModal: async function(newVal, oldVal) { // watch it
                console.log('showModal changed: ', newVal, ' | was: ', oldVal);
                console.log("Going to load supermovimento with id: " + this.movimentoId)
                this.movimento = await this.$store.dispatch("match/LoadSuperMovimento", this.movimentoId);
                this.show = true;
            },
        },
    methods:{
        openDoc(nome){
            console.log(nome)
            this.$emit('openDoc', nome)
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

.btnChiudiStyle{
    background-color: #FFDFCD !important;
    border: 1px solid rgb(0, 0, 0);
    margin: 40px 45px 5px 5px;
    float: right;
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