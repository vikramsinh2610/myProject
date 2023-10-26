<template>

<v-container  >
        <Select :chiusi="true"></Select>
  <table style="margin-left:18px;margin-top:20px">
    <tr>
      <td>
        <v-select
            style="margin-top:10px;min-width:300px"
            clearable
            multiple
            dense
            :items="statiProcesso"
            item-text="description"
            item-value="code"
            label="Stato"
            v-model="statoProcesso"
        ></v-select>
      </td>
      <td style="min-width:100px">
      </td>
      <td style="max-width: 180px">
     <v-menu style="margin-left: 30px;"
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
            v-model="dataDAvalue"

            prepend-icon="mdi-calendar"
            hint="DD/MM/YYYY format"
            persistent-hint
             @blur="dataDA = parseDate(dataDAvalue)"
            v-bind="attrs"
            v-on="on"
          >
            <template v-slot:label>
              <span style="font-size: 0.8em">Da Data Chiusura</span>
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
            v-model="dataAvalue"
            label="A Data Chiusura"
            prepend-icon="mdi-calendar"
            hint="DD/MM/YYYY format"
            persistent-hint
            @blur="dataA = parseDate(dataAvalue)"
            v-bind="attrs"
            v-on="on"
          >
            <template v-slot:label>
              <span style="font-size: 0.8em">A Data Chiusura</span>
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
        <v-btn medium class="text-right ml-5 mr-9 mt-5"
                @click="reloadMatches"
        >
            Reload Match
        </v-btn>

     </tr>
  </table>

 <div class="box, containerStyle">
    <div v-if="!matches || matches.length==0">
         <p> <i>Nessun match trovato per i parametri di ricerca.</i></p>
    </div>
    <div v-for="match in matches" :key="match.idmatch" class="match">
      <tr style="display:table; width:100%">
        <td style="float:left; width: 30%">
            <div v-for="movimento in match.movimenti" :key="String(match.idmatch) + String(movimento.iddb)" style="float:left;">
        <v-icon size="26" >mdi-file</v-icon> 
          <strong style="font-size:15px"> {{movimento.ragionesociale  | formatTruncate(30, '...')}}</strong>
          <div id="datiMovimento" class="datiStyle">
            <p>importo: <i>{{ movimento.valuta_importo}}</i></p>
            <p>data op: <i>{{ movimento.dataoperazione | formatDateShort}}</i></p>
            <p>valuta: <i>{{movimento.valuta}}</i></p>
            <p>ID Movimento: <i>{{movimento.iddbmovimento}}</i> </p>
            <p>ID Dettaglio: <i>{{movimento.iddbdettagliomovimento}}</i></p>
            </div>
        </div>
        
        </td>
        <td style="float:left; vertical-align:middle; width:30%">
            <div> 
                <router-link :to="{name: 'closedmatch1', params: {id: match.idmatch} }">
                <v-btn :title="`Data Chiusura: ${$options.filters.formatDateTime(match.datachiusuramatch) }`" class="btnImgStyle" elevation="0"  >
            <img class="imgMatchListStyle" src="@/assets/ImgMatchAssociatiLista.png">
          </v-btn>
            </router-link>
          <v-row >
            <v-col  align="center" justify="center">
               <p  style="float:none"> Stato SAP: {{descrizioneMatch(match)}}</p>
            </v-col>
          </v-row>            </div>
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
  </div>
  <div style="width:90%; margin:auto;">
    <p class="countStyle"> Selezionati: {{numero_match}} / Scaricati: {{num_scaricati_match}} / Totali: {{num_tot_match}}</p>
  <v-btn class="pagination_button" @click.prevent="loadMoreMatches()" :disabled="num_scaricati_match===num_tot_match">Carica altri Match</v-btn>
  </div>
</v-container>


</template>

<script>
import Select from "@/components/Select.vue";
import EventBus, { ACTIONS } from '../../components/Helpers/EventBus.js';

export default {
    name: 'ClosedMatchList-item',
    data() {
      return{
          dataDAvalue: null,
          dataAvalue: null,
          dataDA: null,
          dataA: null,
          menu1: false,
          menu2: false,
          statoProcesso: null
      }
    },
    components: {
        Select,
    },
    async created () {
        let params = new URLSearchParams();
        await this.$store.dispatch("match/LoadMatches", {params: params, soloAperti:false});
        this.$store.commit('auth/setIsLoading', false);
    },    
    computed: {
        matches: function() {
          let matches = this.$store.getters["match/getMatchesChiusiFiltrati"];
          if(matches) {
            if(this.statoProcesso) {
              return structuredClone(matches.filter(match => {
                let statoTrovato = false;
                for(const stato of this.statoProcesso) {
                  statoTrovato = statoTrovato || (match.code_stato_trasferimento_match === stato);
                }
                return statoTrovato;
              }));
            } else {
              return structuredClone(matches);
            }
          } else {
            return [];
          }
        },
        statiProcesso() {
          return this.$store.getters["match/getStatiProcessoMatch"];
        },
        numero_match: function() {
          return this.matches.length;
        },
        num_tot_match: function() {
          return (this.$store.getters["match/getMatchesChiusi"]) ? this.$store.getters["match/getMatchesChiusi"].total : 0;
        },
        num_scaricati_match: function() {
          return (this.$store.getters["match/getMatchesChiusi"]) ? this.$store.getters["match/getMatchesChiusi"].size : 0;
        },

    },
    methods: {
      async reloadMatches() {
          console.log("reload matches, con: daData: " + this.dataDA + " aData: " + this.dataA )
          EventBus.$emit(ACTIONS.SNACKBAR_OK, "Ricarico Match");
          this.$store.commit('auth/setIsLoading', false);
          let params = new URLSearchParams();
          await this.$store.dispatch("match/LoadMatches", {params: params, soloAperti:false, chiusiDa: this.parseDate(this.dataDAvalue), chiusiA: this.parseDate(this.dataAvalue)});
      },
      async loadMoreMatches(){
          console.log("loading more");
          let params = new URLSearchParams();
          await this.$store.dispatch("match/LoadMoreMatches", {params: params, soloAperti:false});
      },
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
      descrizioneMatch(match) {
        console.log("trova descrizione per codice stato:  " + match.code_stato_trasferimento_match)
        let state = this.$store.getters["match/getStatiProcessoMatch"].find(stato => {
          return stato.code === match.code_stato_trasferimento_match;
        })
        if(state) {return state.description}
        return "Stato Non Trovato per codice: " +match.code_stato_trasferimento_match;
      }

    }, 
    watch: {
      dataDA () {
        console.log("dateDA changed")
        this.dataDAvalue = this.formatDate(this.dataDA)
      },
      dataA () {
        console.log("dateA changed")
        this.dataAvalue = this.formatDate(this.dataA)
      },
    }
}
    
    
</script>

<style scoped>
.v-text-field .v-label {
    font-size: 0.8em;
  }

p {
  font-style: italic;
  float: left;
  margin-right: 15px;
}
.box{
  padding: 4px;
  overflow:auto;
    height: 500px;
    overflow-x: hidden;
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
    font-size: 13px;
    margin-top:10px;
    margin-bottom: 10px;
}
.imgMatchListStyle{
    max-width: 55%;
    vertical-align: middle ;
}
.btnImgStyle{
    background-color: transparent !important;
    width: 100%;
}
.match{
  margin-top:5px;
  margin-bottom: 15px;
}

</style>