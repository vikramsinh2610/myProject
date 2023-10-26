<template>
  <div>
      <table>
          <tr>
             
              <td class="filtroStyle">
                  <div  class="tooltip">
                      <v-text-field  label="Ragione Sociale" v-model="filtroPartitaRagioneSociale"></v-text-field>
                      <span v-if="isOk" class="tooltiptext">Inserisci almeno 3 caratteri per la ricerca</span>
                  </div>
              </td>
              <td class="filtroStyle">
                  <div  class="tooltip">
                      <v-text-field label="SapId" v-model="filtroPartitaSAPId"></v-text-field>
                      <span v-if="isOk" class="tooltiptext">Inserisci almeno 3 caratteri per la ricerca</span>
                  </div>
              </td>
              <td class="filtroStyle">
                  <div  class="tooltip">
                      <v-text-field label="Importo" v-model="filtroPartitaImporto"></v-text-field>
                      <span v-if="isOk" class="tooltiptext">Inserisci almeno 2 caratteri per la ricerca</span>
                  </div>
              </td>
              <td class="filtroStyle">
                  <div  class="tooltip">
                      <v-text-field label="PartitaID" v-model="filtroPartitaPartitaID"></v-text-field>
                      <span v-if="isOk" class="tooltiptext">Inserisci almeno 3 caratteri per la ricerca</span>
                  </div>
              </td>
              
          </tr>
      </table>
  </div>
</template>

<script>
export default {
    name: 'SelectPartite-item',
    data(){
        return{
            isOk: false,
            temp: ''
        }
    },
    updated(){
        if(this.$store.getters["match/getfiltroMMPartite"] != null){
            console.log("stampa P")
            this.temp=this.$store.getters["match/getfiltroMMPartite"]
            if(this.temp.length < 3 ){
            this.isOk = true
            }else{
            this.isOk=false
            this.temp=null
            }
        }
        else if(this.$store.getters["match/getfiltroMMPartiteSapId"] != null){
            this.temp=this.$store.getters["match/getfiltroMMPartiteSapId"]
            if(this.temp.length < 3 ){
            this.isOk = true
            }else{
            this.isOk=false
            this.temp=null
            }
        }
        else if(this.$store.getters["match/getfiltroMMPartiteImporto"] != null){
            this.temp=this.$store.getters["match/getfiltroMMPartiteImporto"]
            if(this.temp.length < 2 ){
            this.isOk = true
            }else{
            this.isOk=false
            this.temp=null
            }
        }
        else if(this.$store.getters["match/getfiltroMMPartitePartitaID"] != null){
            this.temp=this.$store.getters["match/getfiltroMMPartitePartitaID"]
            if(this.temp.length < 3 ){
            this.isOk = true
            }else{
            this.isOk=false
            this.temp=null
            }
        }
        
        console.log(this.isOk)
    
    },
    computed: {
        filtroPartitaRagioneSociale: {
            get () {
            return this.$store.getters["match/getfiltroMMPartite"]
            },  
            set (value) {
                this.$store.commit('match/setfiltroMMPartite', value)
            }
        },
        filtroPartitaSAPId:{
            //aggiungere get, set filtroMMPartiteSapId
            get () {
            return this.$store.getters["match/getfiltroMMPartiteSapId"]
            },  
            set (value) {
                this.$store.commit('match/setfiltroMMPartiteSapId', value)
            }
        },
        filtroPartitaImporto:{
            //aggiungere get, set filtroMMPartiteImporto
            get () {
            return this.$store.getters["match/getfiltroMMPartiteImporto"]
            },  
            set (value) {
                this.$store.commit('match/setfiltroMMPartiteImporto', value)
            }
        },
        filtroPartitaPartitaID:{
            //aggiungere get, set filtroMMPartiteImporto
            get () {
            return this.$store.getters["match/getfiltroMMPartitePartitaID"]
            },  
            set (value) {
                this.$store.commit('match/setfiltroMMPartitePartitaID', value)
            }
        }
    }


}
</script>

<style scoped>
.v-text-field__details{ 
    display: none !important;
}
.v-input {
    padding:0px !important;
    margin: 0px !important;
}
.filtroStyle{
    padding-right:2px !important;
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
  padding: 2px;
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
</style>