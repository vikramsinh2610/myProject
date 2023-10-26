<template>
  <div>
      <table>
          <tr>
              <td class="filtroStyle">
                  <v-autocomplete
                    :items="valute"
                    item-text="descrizione"
                    item-value="codice_iso"
                    label="Scegli valuta"
                    v-model="filtroMMMovimentiValuta"
                    ></v-autocomplete>
              </td>
              
              <td class="filtroStyle">
                  <div  class="tooltip">
                      <v-text-field  label="Importo" v-model="filtroMMMovimentiImporto"></v-text-field> 
                      <span v-if="isOk" class="tooltiptext">Inserisci almeno 3 caratteri per la ricerca</span>
                  </div>
                  
              </td>
               
              <td class="filtroStyle">
                  <div  class="tooltip">
                      <v-text-field label="Ragione Sociale" v-model="filtroMMMovimentiRagioneSociale" ></v-text-field>
                      <span v-if="isOk" class="tooltiptext">Inserisci almeno 3 caratteri per la ricerca</span>
                  </div>
              </td>
          </tr>
      </table>
  </div>
</template>

<script>
export default {
    name: 'SelectMovimenti-item',
    data(){
        return{
            isOk: false,
            temp: ''
        }
    },
    updated(){
         if(this.$store.getters["match/getfiltroMMMovimentiRagioneSociale"] != null){
            console.log("stampa")
            this.temp=this.$store.getters["match/getfiltroMMMovimentiRagioneSociale"]
            if(this.temp.length < 3 ){
            this.isOk = true
            }else{
            this.isOk=false
            this.temp=null
            }
        }

        if(this.$store.getters["match/getFiltroMovimentiImporto"] != null){
            
            this.temp=this.$store.getters["match/getFiltroMovimentiImporto"]
            if(this.temp.length < 3 ){
            this.isOk = true
            }else{
            this.isOk=false
            this.temp=null
            }
            console.log(this.isOk)
        console.log(this.temp.length)
        }
       
        
        
        console.log(this.$store.getters["match/getfiltroMMMovimentiRagioneSociale"])
    },

   computed: {
      valute() {
            return structuredClone(this.$store.getters["match/getValuteOrdinate"]);
      },
      filtroMMMovimentiImporto: {
          
        get () {
        return this.$store.getters["match/getFiltroMovimentiImporto"]
        },  
        set (value) {
            this.$store.commit('match/setfiltroMMMovimentiImporto', value)
        }
      },
      filtroMMMovimentiRagioneSociale: {
        get () {
        return this.$store.getters["match/getfiltroMMMovimentiRagioneSociale"]
        },  
        set (value) {
            this.$store.commit('match/setfiltroMMMovimentiRagioneSociale', value)
        }
      },
      filtroMMMovimentiConto: {
          get () {
          return this.$store.getters["match/getfiltroMMMovimentiConto"]
          },  
          set (value) {
              this.$store.commit('match/setFiltroMovimentiiConto', value)
          }
      },
      filtroMMMovimentiValuta: {
          get () {
          return this.$store.getters["match/getfiltroMMMovimentiValuta"]
          },  
          set (value) {
              this.$store.commit('match/setfiltroMMMovimentiValuta', value)
          }
      }
   }
}
</script>

<style scoped>
.v-input {
    padding:0px !important;
    margin: 0px !important;
}
.v-text-field__details{ 
    display: none !important;
}
.filtroStyle{
    padding-right:4px !important;
    width: 20%;
    font-size: 10px;
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