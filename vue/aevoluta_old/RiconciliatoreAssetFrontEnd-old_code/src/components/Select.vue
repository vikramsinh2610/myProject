<template>

<div>
  <table style="margin-left:18px">
    <tr>
      <td>
        <v-select
            style="margin-top:10px"
            clearable
            multiple
            dense
            :items="valute"
            item-text="descrizione"
            item-value="codice_iso"
            label="Valuta"
            v-model="filtroMAValuta"
        ></v-select>
      </td>
      <td>
        <v-autocomplete
              style="margin-top:10px;padding-right:30px; padding-left:15px; width:300px; max-width:300px"
              :items="stakeholders"
              item-text="ragionesociale"
              item-value="sapid"
              label="Scegli Ragione Sociale"
              dense
              multiple
              clearable
              v-model="filtroMARagioneSociale"
          ></v-autocomplete>      
         </td>
      <td style="margin-left: 30px; max-width: 180px">
     <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            clearable
            v-model="filtroMADaData"
            prepend-icon="mdi-calendar"
            hint="DD/MM/YYYY format"
            persistent-hint
             @blur="dataDA = parseDate(filtroMADaData)"
            v-bind="attrs"
            v-on="on"
          >
            <template v-slot:label>
              <span style="font-size: 0.8em">Da Data Movimento</span>
            </template>
          </v-text-field>
        </template>
        <v-date-picker
          v-model="dataDA"
          @input="menu2 = false"
        ></v-date-picker>
      </v-menu>      
      </td>
      <td style="max-width: 180px">
     <v-menu
        v-model="menu1"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            clearable
            v-model="filtroMAAData"
            prepend-icon="mdi-calendar"
            hint="DD/MM/YYYY format"
            persistent-hint
            @blur="dataA = parseDate(filtroMAAData)"
            v-bind="attrs"
            v-on="on"
          >
            <template v-slot:label>
              <span style="font-size: 0.8em">A Data Movimento</span>
            </template>
          </v-text-field>
        </template>
        <v-date-picker
          v-model="dataA"
          @input="menu1 = false"
        ></v-date-picker>
      </v-menu>      
      </td>
        <v-tooltip bottom style="max-width:500px">
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="ml-3 mt-4"  size="30"
                v-bind="attrs"
                v-on="on"
                >mdi-help-circle-outline</v-icon>
            </template>
            <span class="body-1" style="max-width:500px">
              La data ricercata si riferisce alla data del movimento.
            </span>
        </v-tooltip>

     </tr>
  </table>
  
     
</div>

</template>

<script>

export default ({
  name: 'Select-item',
  props:{
      chiusi: null,
  },
  data() {
    return{
        dataDA: null,
        dataA: null,
        menu1: false,
        menu2: false,
        filtroMADaData: null,
        filtroMAAData: null,
    }
  },
  mounted() { 
    console.log("Select mounted");
    // aggiunti perche' watch non viene chiamato se l'oggetto passa da null a null
    this.$store.commit('match/setFiltroMADaData', null)
    this.$store.commit('match/setFiltroMAAData', null)
    this.$store.commit('match/setFiltroMAValuta', null)
    this.$store.commit('match/setFiltroMARagioneSociale', null)
  },
  methods: {
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
  },
  watch: {
    dataDA () {
      console.log("dateDA changed")
      this.filtroMADaData = this.formatDate(this.dataDA)
    },
    dataA () {
      console.log("dateA changed")
      this.filtroMAAData = this.formatDate(this.dataA)
    },
    filtroMADaData (value) {
      console.log("settata dadata: " + value)
      this.$store.commit('match/setFiltroMADaData', this.parseDate(value))
    },
    filtroMAAData (value) {
      console.log("settata dadata: " + value)
      this.$store.commit('match/setFiltroMAAData', this.parseDate(value))
    },
  },
  computed: {
      valute() {
//        return this.$store.getters["match/getValuteOrdinate"];
        return structuredClone(this.$store.getters["match/getRelevantValute"](this.chiusi).items);
  },
      filtroMARagioneSociale: {
        get () {
        return this.$store.getters["match/getFiltroMARagioneSociale"]
        },  
        set (value) {
             console.log("settata ragione sociale: " + value)
           this.$store.commit('match/setFiltroMARagioneSociale', value)
        }
      },
      filtroMAValuta: {
          get () {
            return this.$store.getters["match/getFiltroMAValuta"]
          },  
          set (value) {
            console.log("settata valuta: " + value)
              this.$store.commit('match/setFiltroMAValuta', value)
          }
      },
      stakeholders : function() {
        return structuredClone(this.$store.getters["match/getRelevantStakeholders"](this.chiusi).items);
      },
  }
})
</script>

<style scoped>
td {
  padding-right:10px;
}
.filterStyle{
  margin-top: 0px;
  margin-left: 10px;
}

.containerfiltriStyle{
  padding: 0px !important;
  margin:0px !important;
}
</style>
