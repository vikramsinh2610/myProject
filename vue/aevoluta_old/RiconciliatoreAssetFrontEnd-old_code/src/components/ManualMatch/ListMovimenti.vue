<template>
<div> 
  <div class="box"
  @drop="onDrop($event)"
        @dragenter.prevent
        @dragover.prevent>
   
      <div v-for="(movimento,index) in movimenti" :key="movimento.artificial_id_movimento" >
         
          <div  :class="(idSelected === index) ? 'cardselected' : 'card'" @click="populateDataT(movimento)"
          draggable="true"
          :id="movimento.artificial_id_movimento"
          @dragstart="dragStart($event, movimento)"
          @dragover.stop >
              <div class="container">
                  <div  class="tooltip" style="padding-top:10px; text-align:center; min-height:40px;width:100%">
                      <h5><b>{{movimento.ragionesociale | formatTruncate(10, '...')}}</b></h5> 
                      <span v-if="movimento.ragionesociale" class="tooltiptext">{{movimento.ragionesociale}}</span>
                  </div>

                  <div style="text-align:center; min-height:33px">
                      <div class="importoStyle">
                        <p class="dataStyle">{{movimento.valuta_importo}}</p>
                    </div>
                  </div>
                  <div style=" text-align:center; min-height:20px">
                      <p class="dataStyle">Data: {{movimento.dataoperazione | formatDateShort}}</p>
                  </div>
                  <div style=" text-align:center; min-height:20px">
                      <p class="dataStyle">Valuta: {{movimento.valuta}}</p>
                  </div>
                     
                </div>
              </div>
      </div>
  </div>
  <p class="countStyle"> Selezionati: {{numero_movimenti}} / Scaricati: {{num_scaricati_movimenti}} / Totali: {{num_tot_movimenti}}</p>
     
      <v-btn class="pagination_button" @click.prevent="loadMoreMovimenti()" :disabled="num_scaricati_movimenti===num_tot_movimenti" >Carica altri Movimenti</v-btn>
       
</div>
  
</template>

<script>
export default {
    data() {
      return {
       idSelected: "",
        movimento: {},
      }
    },
      computed: {
        movimenti: function() {
          console.log(this.$store.getters["match/getMovimentiFiltrati"]);
          return this.$store.getters["match/getMovimentiFiltrati"]
        },
        numero_movimenti: function() {
          return Object.keys(this.movimenti).length;
        },
        num_tot_movimenti: function() {
          return this.$store.getters["match/getMovimenti"].total;
        },
        num_scaricati_movimenti: function() {
          return this.$store.getters["match/getMovimenti"].size;
        }
      },
    methods:{
      async loadMoreMovimenti(){
        console.log("loading more");
          await this.$store.dispatch("match/LoadMoreMovimenti");
        },
        populateDataT(movimento){
          console.log(movimento)
            this.idSelected = movimento.artificial_id_movimento;
            console.log("ID Selected: " + this.idSelected);
            this.movimento = movimento;
            this.$emit('setDataMovimento', this.movimento)
        },
        dragStart: (event, movimento)=>{
            console.log("drag started on card " + movimento.artificial_id_movimento);
            const target = movimento;
            event.dataTransfer.setData('movimento_id', target.artificial_id_movimento);
            event.dataTransfer.setData('movimento_importo', target.valuta_importo);
            /*setTimeout(()=>{
               target.style.display="none";
            },0);*/
        },
    }
}
</script>

<style scoped>
.pagination_button {
    float: right;
    font-size: 11px;
    text-align: center;
    text-transform: capitalize;
    background-color: rgba(203, 197, 197, 0.242) !important;
    padding: 0px 5px !important;
    border-radius: 5px;
    /*font-family: "'EB Garamond SC',ebGaramond12SC_WGDI,'Times New Roman',serif";*/
}
.countStyle{
  float:left;
  font-size:14px; 
 /* font-family: "'EB Garamond SC',ebGaramond12SC_WGDI,'Times New Roman',serif";*/
  margin-top:5px;
}
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  text-align: center;
  border-radius: 6px;
  padding: 5px;
   box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
   border-color: black;
   font-size: 12px;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
.importoStyle{
    background-color:aliceblue;
    border-radius:80px;
    width:100%;
    text-align: center;
}
.dataStyle{
    font-size: 12px;
    padding:1px;
    vertical-align: middle !important;
}
.container {
    padding:0px;
    width:98%;
}
.card {
  float: left;
  min-width: 20%;
  height:120px;
  margin: 0 -5px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  background-color: #DCCBC6;
  border-radius: 3px;
  margin: 10px;
}
.cardselected {
  float: left;
  height:120px;
  min-width: 22%;
  margin: 0 -5px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  background-color: #DCCBC6;
  border-radius: 3px;
  margin: 10px;
  border: 1px solid rgb(251, 4, 4);
}
@media screen and (max-width: 1000px) {
  .card {
    width: 90%;
    height: auto;
    display: block;
    margin-bottom: 20px;
  }
}
@media screen and (max-width: 1000px) {
  .cardselected {
    width: 90%;
    height: auto;
    display: block;
    margin-bottom: 20px;
  }
}
.card:after {
  content: "";
  display: table;
  clear: both;
}
.cardselected:after {
  content: "";
  display: table;
  clear: both;
}
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}
.box{
  padding: 4px;
  overflow:auto;
  border: 1px solid rgb(0, 0, 0);
  background-color: rgba(203, 197, 197, 0.242);
  height: 256px;
  overflow-x: hidden;
   
}
.v-application p{
    margin-bottom:2px !important;
}
</style>