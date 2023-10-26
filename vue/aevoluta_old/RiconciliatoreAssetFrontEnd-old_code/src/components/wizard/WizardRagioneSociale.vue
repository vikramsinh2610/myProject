    <template>
        <div>
            <v-row style="min-height: 30px;"></v-row>
            <v-row v-if="movimentoSelezionato" no-gutters class="datiStyle" >
                <v-col md="8" >
                <span class="text-h6 text--primary" style="min-height: 100px;"> Scegli Ragione Sociale </span> 
                    <v-row no-gutters style="margin-top:30px; height: 80px;">
                    <v-btn id="btnConfermRS" @click.prevent="confermaRS" style="margin-left: 20px;">
                        <v-icon size="25">mdi-checkbox-marked-circle</v-icon>
                        <span> Conferma Attuale</span> 
                    </v-btn>

                    <v-autocomplete
                        style="margin-left:100px; padding-right:10px; padding-left:15px; "
                        :items="stakeholders"
                        :item-text="getItemText"
                        item-value="sapid"
                        label="Scegli"
                        dense
                        v-model="ragioneSocialeSelezionata"
                    ></v-autocomplete>
                <v-btn id="btnCambiaRS" @click.prevent="cambiaRS" >
                        <v-icon size="25">mdi-checkbox-marked-circle</v-icon>
                        <span> Scegli Nuova </span> 
                    </v-btn>
                    </v-row>
                </v-col>
            </v-row>
        </div>
    </template>

    <script>

    export default {
        props:{
            sapIDCorrente: null,
            movimentoSelezionato: null,
        },
        data(){
            return{
                ragioneSocialeSelezionata: null,
                ragioneSocialeConfermata: false,
            }
        },
        watch: { 
            sapIDCorrente: function(newVal, oldVal) { // watch it
                console.log('sapIDCorrente changed: ', newVal, ' | was: ', oldVal);
                this.ragioneSocialeSelezionata = newVal;
            }
        },
        methods:{
            confermaRS(){
                console.log("confermataRagioneSociale");
                this.ragioneSocialeConfermata = true;
                this.caricaPartite();
                this.$emit('setRagioneSociale', {confirm: true, newSapid: null});

            },
            cambiaRS(){
                console.log("Scelta nuova ragione sociale");
                this.ragioneSocialeConfermata = true;
                this.caricaPartite();
                this.$emit('setRagioneSociale', {confirm: false, newSapid: this.ragioneSocialeSelezionata});                   
            },
            async caricaPartite() {
                // loading data
                let params = new URLSearchParams();
                params.append("sapid", this.ragioneSocialeSelezionata);
                params.append("escludi_coinvolti_in_match", false);
//                await this.$store.dispatch("match/LoadPartite", params);
                setTimeout(
                    function() {
                        window.scrollBy(0,300);
                    }, 500);
           },
           getItemText(item) {
                return `${item.ragionesociale} - ${item.sapid}`;
            }
        },
        computed:{
            stakeholders : function() {
                return structuredClone(this.$store.getters["match/getStakeholders"].items);
            },
        }
    }
    </script>

    <style scoped>

    .datiStyle{
        border: 1px solid rgb(0, 0, 0);
    background-color: rgba(203, 197, 197, 0.242);
    min-height: 150px;
    margin-top: 10px;
    
    }
    </style>