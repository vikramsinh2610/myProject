<template>
<div> 
  <div class="box"
   @drop="onDrop($event)"
        @dragenter.prevent
        @dragover.prevent>
      <div v-for="(partita,index) in partite" :key="partita.id" >
          
          <div :class="(idSelected == index) ? 'cardselected' : 'card'" @click="populateDataP(partita)"
          draggable="true"
          :id="partita.numerodocumento"
          @dragstart="dragStart($event, partita)"
          @dragover.stop>
          
              <div class="container">
                  <div style="padding-top:10px; text-align:center; min-height:40px; width:100%">
                      <h5><b>{{partita.ragionesociale | formatTruncate(10, '...') }}</b></h5> 
                  </div>
                  
                    <div style="text-align:center; min-height:33px">
                        <div class="importoStyle">
                        <p class="dataStyle">{{partita.valutalordo}}</p>
                        </div>
                    </div>
                    
                    <div style=" text-align:center; min-height:20px">
                        <p class="dataStyle">ID Doc: {{partita.numerodocumento}}</p>
                        <p class="dataStyle">SapID: {{partita.sapid}}</p>
                    </div>
                     
                </div>
              </div>
      </div>
  </div>
      <p class="countStyle"> Selezionati: {{numero_partite}} / Scaricati: {{num_scaricate_partite}} / Totali: {{num_tot_partite}}</p>
     
      <v-btn class="pagination_button" @click.prevent="loadMorePartite()" :disabled="num_scaricate_partite===num_tot_partite">Carica altre Partite</v-btn>
              
</div>
  
</template>

<script>
export default {
    data() {
      return {
        idSelected:-1,
        partita: {},
      }
    },
      computed: {
        partite: function() {
          return this.$store.getters["match/getPartiteFiltrate"]
        },
        numero_partite: function() {
          return Object.keys(this.partite).length;
        },
        num_tot_partite: function() {
          return this.$store.getters["match/getPartite"].total;
        },
        num_scaricate_partite: function() {
          return this.$store.getters["match/getPartite"].size;
        }
      },
       methods:{
        async loadMorePartite(){
          console.log("loading more");
          await this.$store.dispatch("match/LoadMorePartite");
        },
        populateDataP(partita){
            this.idSelected = partita.id;
            this.partita = partita;
            this.$emit('setDataPartita', this.partita)
        },
        dragStart: (event, partita)=>{
          console.log("drag started on partita " + partita.numerodocumento);
          const target = partita;
          event.dataTransfer.setData('partita_id', target.numerodocumento);
          event.dataTransfer.setData('partita_importo', target.eurlordo);
          
            /*setTimeout(()=>{
               target.style.display="none";
            },0);*/
        },
        onDrop(e){
            this.visibility=false;
            const movimento_importo = e.dataTransfer.getData('movimento_importo');
            const movimento_id = e.dataTransfer.getData('movimento_id');
            const movimento = document.getElementById(movimento_id);

            const partita_importo = e.dataTransfer.getData('partita_importo');
            const partita_id = e.dataTransfer.getData('partita_id');
            const partita = document.getElementById(partita_id);

            console.log(partita)
            if(partita==null){
                e.target.appendChild(movimento);
                this.saldo += parseFloat(movimento_importo);
                console.log(this.saldo);
            }
            else if (movimento == null){
                e.target.appendChild(partita);
                this.saldo -= parseFloat(partita_importo);
                console.log(this.saldo);
            }
        }
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
   /* font-family: "'EB Garamond SC',ebGaramond12SC_WGDI,'Times New Roman',serif";*/
}
.countStyle{
  float:left;
  font-size:14px;
 /* font-family: "'EB Garamond SC',ebGaramond12SC_WGDI,'Times New Roman',serif";*/
  margin-top:5px;
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
  background-color: #DFD4D4;
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
  background-color: #DFD4D4;
  border-radius: 3px;
  margin: 10px;
  border: 1px solid rgb(251, 4, 4);
}
@media screen and (max-width: 1020px) {
  .card {
    width: 90%;
    height: auto;
    display: block;
    margin-bottom: 20px;
  }
}
@media screen and (max-width: 1020px) {
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