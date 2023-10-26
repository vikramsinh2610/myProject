    <template>

        <div>
            <v-container fluid>
                <v-snackbar
                top
                color="success"
                v-model="snackbar"
                style="margin-top:70px"
            >
                {{ SnackBarText }}

        <template v-slot:action="{ attrs }">
            <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="snackbar = false"
            >
            Close
            </v-btn>
      </template>
    </v-snackbar>

            <WizardMovimenti :generatoreEventi="ping" :refreshIt="refreshMovimento" @setMovimento="setMovimento"></WizardMovimenti>
            <WizardRagioneSociale :sapIDCorrente="ragioneSocialeSelezionata" :movimentoSelezionato="movimentoSelezionato" @setRagioneSociale="setRagioneSociale"></WizardRagioneSociale>
            <WizardPartite :ragioneSocialeConfermata="ragioneSocialeConfermata" :movimentoCorrente="movimentoCorrente" @movimentoChiuso="movimentoChiuso"></WizardPartite>
            </v-container>
        </div>
    </template>

    <script>
    import WizardMovimenti from '@/components/wizard/WizardMovimenti.vue'
    import WizardRagioneSociale from '@/components/wizard/WizardRagioneSociale.vue'
    import WizardPartite from '@/components/wizard/WizardPartite.vue'
    import EventBus, { ACTIONS } from '../../components/Helpers/EventBus.js';

    export default {
        data(){
            return{
                movimentoCorrente: {},
                movimentoSelezionato: false,
                showModalDoc: false,
                showModal: false,
                showModal1: false,
                saldo: null,
                visibility: true,
                riferimento: null,
                ragioneSocialeSelezionata: null,
                ragioneSocialeConfermata: false,
                ping: 1,
                refreshMovimento: 1,
                SnackBarText: "info",
                snackbar: false,
            }
        },
        components:{
            WizardMovimenti,
            WizardRagioneSociale,
            WizardPartite,
        }, 
        async created() {
           console.log("created")
           this.$store.commit('auth/setIsLoading', false);
           if(!this.$store.getters["match/getMovimenti"] || this.$store.getters["match/getMovimenti"].items.length == 0) {
                console.log("Non ci sono partite, caricale")
                let params = new URLSearchParams();
                params.append("solo_movimenti_abbinabili", true);
                await this.$store.dispatch("match/LoadMovimenti", params);
            }
            if(!this.$store.getters["match/getStakeholders"] || this.$store.getters["match/getStakeholders"].length == 0) {
                console.log("Non ci sono stakholders, carica")
                await this.$store.dispatch("match/LoadStakeholders");
            }

    //        this.numero_partite=this.$store.getters["match/getPartite"].items.length;
    //        console.log("numero partite caricate in ManualMatchView1:"+this.$store.getters["match/getPartite"].items.length)
        },
    

        methods:{
            movimentoChiuso() {
                console.log("ping now")
                this.ragioneSocialeSelezionata = null;
                this.movimentoSelezionato = false;
                this.ragioneSocialeConfermata = false;
                this.movimentoCorrente = {};
                this.SnackBarText = "Operazione Completata con successo";
                this.snackbar = true;
                window.scrollTo({
                    top: 10,
                    left: 0,
                    behavior: 'smooth'
                });
                this.ping++;
            },
            setMovimento(movimentoSettato) {
                console.log("Set movimento: " + movimentoSettato);
                this.movimentoCorrente = movimentoSettato;
                console.log(this.movimentoCorrente);
                this.idDoc = this.movimentoCorrente.iddocumento;
                console.log("sapid: " + this.movimentoCorrente.sapid);
                this.ragioneSocialeSelezionata = this.movimentoCorrente.sapid;
                this.movimentoSelezionato = true;
                this.ragioneSocialeConfermata = false;
            },
            addSelection(){
                var i = 0;
                var original = document.getElementById('selectDifferenze' + i);
                var clone = original.cloneNode(true); // "deep" clone
                clone.id = "selectDifferenze" + ++i; // there can only be one element with an ID
                original.parentNode.appendChild(clone);
            },
            openDoc(){
                console.log("Apro documento: " + this.Movimento.iddocumento);
                this.idDoc = this.Movimento.iddocumento;
                let imp = ""
                if(this.Movimento && this.Movimento.valuta_importo) {
                    imp = this.Movimento.valuta_importo.toString().replace(".", ",");
                }
                console.log("Search term: " + imp);
                this.riferimento = {search: true, term: imp};
                this.showModalDoc=!this.showModalDoc
            },
            openDocPartite(){
                console.log("Apro documento: " + this.Partita.iddocumento);
                this.idDoc = this.Partita.iddocumento;
                this.riferimento = {colonna: "Numero documento", idPartita: this.Partita.numerodocumento};
                this.showModalDoc=!this.showModalDoc
            },
            async setRagioneSociale(nuovaRagione){
//                this.ragioneSocialeConfermata = false;
                console.log("Scelta sociale. E' nuova? " + nuovaRagione.confirm);
                if(!nuovaRagione.confirm) {
                    console.log("Nuova Ragione: " + nuovaRagione.newSapid);
                    this.movimentoCorrente.sapid = nuovaRagione.newSapid;
                    let stakeholder = this.$store.getters["match/getStakeholders"].items.find(stakeholder => {
                        return stakeholder.sapid === this.movimentoCorrente.sapid;
                    });
                    this.movimentoCorrente.ragionesociale = stakeholder.ragionesociale;
                    this.refreshMovimento++;
                    // Persisti cambiamento movimento
                    try{ 
                        await this.$store.dispatch("match/UpdateMovimento", {idMov: this.movimentoCorrente.artificial_id_movimento, op: "cambiaRS", idStakeholder: stakeholder.id});
                        EventBus.$emit(ACTIONS.SNACKBAR_OK, "Salvata nuova ragione sociale movimento");

                    } catch(error){
                        await this.$store.commit('auth/setIsLoading', false, { root: true }) 
                        console.log(error)
                        EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema nel salvare ragione sociale");
                    }
                }
                this.ragioneSocialeConfermata = true;
            },
        },
        computed:{
            nomeDocumento : function() {
                console.log("Cerca nome documento ");
                if(!this.movimentoCorrente || !this.movimentoCorrente.iddocumento) {
                    return "";
                }
                let ilDocumento = this.$store.getters["match/getDocumento"](this.movimentoCorrente.iddocumento);
                if(ilDocumento) {
                    return ilDocumento.nomefileoriginario;
                } 
                console.log("documento non trovato");
                return "";
            },
        }

    }
    </script>

    <style scoped>

    </style>