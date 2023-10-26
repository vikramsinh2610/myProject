<template>

    <v-main>
       <v-row justify='end'>
        <v-btn style="margin-bottom:30px; margin-right:20px" elevation="0" class="btnChiudiStyle" @click="closeMatch">
            <span style="color: #D91A21">Chiudi Match</span>
        </v-btn>
        </v-row>
        <DetailMatch @openDoc="openDoc($event)" @openMovimento="openMovimento($event)" @dissocia="deleteMatch($event)" @confermaChiuso="confermaChiuso()" :origin="true" :idVal="this.$route.params.id"></DetailMatch>
        <div v-if="showModal">
            <PopUpClose theme="">
            <div>
                <v-icon size="29" style="color: rgb(14, 153, 33); float: left: margin-left: 10px">mdi-checkbox-marked-circle</v-icon>
                <h2>Congratulazioni!</h2>
           </div>
            <p>{{popupPrompt}}</p>
            <v-btn class="btnOkStyle"  @click="confermaChiuso" elevation="0" exact>ok</v-btn>
           
            </PopUpClose>
        </div>
        <div v-if="showModalDoc">
            <DocOpened  :idDoc="idDoc"  :riferimento="riferimento" @close="openDoc">
            <div>
           </div>
            <v-btn class="btnOkStyle" @click="openDoc" elevation="0">ok</v-btn>
           
            </DocOpened>
        </div>
            <PopUpMovimento @openDoc="openDoc($event)" :movimentoId="movimentoPopup" :showModal="showModalMovimento">
            </PopUpMovimento>
        <DifferenzeIncassiPartite :partite="theMatch.partite" :valuta="theMatch.movimenti ? theMatch.movimenti[0].valuta : ''" :showModal="showModalPartite" :saldo="theMatch.saldo" :differenzeInIngresso="theMatch.partite_di_pareggio" @setDifferenzeConti="setDifferenzeConti"> </DifferenzeIncassiPartite>    
    </v-main>
</template>
<script>
import DetailMatch from "../components/DetailMatch.vue" 
import PopUpClose from "../components/PopUpClose.vue"
import PopUpMovimento from "../components/PopUpMovimento.vue"
import DocOpened from "@/components/ManualMatch/DocOpened.vue"
import DifferenzeIncassiPartite from '@/components/DifferenzeIncassiPartite.vue'
import EventBus, { ACTIONS } from '../components/Helpers/EventBus.js';

export default ({
    data(){
        return{
            idDoc: null,
            showModal: false,
            showModalDoc: false,
            showModalPartite: 0,
            showModalMovimento: 0,
            theMatch: {},
            popupPrompt: null,
            riferimento: null,
            movimentoPopup: [],
        }
    },
    components:{
        DetailMatch,
        PopUpClose,
        PopUpMovimento,
        DocOpened,
        DifferenzeIncassiPartite
    },
    async beforeCreate() {
        await this.$store.commit('auth/setIsLoading', false, { root: true }) 

        let theId = this.$route.params.id;
        console.log("Manual Match for id: " + theId)
        this.theMatch = this.$store.getters["match/getMatches"].items.find(match => match.idmatch === theId);
        console.log("Match associato: " + this.theMatch);
    },
    

    methods:{
        async closeMatch(){
            if(this.theMatch && this.theMatch.saldo && this.theMatch.saldo != 0) {
                // lancia differenza partite
                this.showModalPartite++;
            } else {
                // chiudi as is.
                try{
                    await this.$store.commit('auth/setIsLoading', true, { root: true }) 

                    await this.$store.dispatch("match/SaveMatch", this.theMatch);
                    let newMatches = await this.$store.getters["match/getMatches"].items.filter(match => match.idmatch != this.theMatch.idmatch);
                    let newMatchesStructure = await this.$store.getters["match/getMatches"];
                    newMatchesStructure.items = newMatches
                    newMatchesStructure.total = newMatchesStructure -1;
                    await this.$store.commit('match/setMatches', newMatchesStructure);
                    this.popupPrompt = "Partita chiusa con successo";
                    this.showModal= !this.showModal
                } catch(error){
                    await this.$store.commit('auth/setIsLoading', false, { root: true }) 
                    console.log(error)
                    EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema nel salvataggio del match");
                }
                await this.$store.commit('auth/setIsLoading', false, { root: true }) 
            }
        },
        openDoc(evento){
            if(evento && evento.idPartita) {
                //siamo nel caso di apertura di una partita con riferimento
                console.log("Siamo nel caso del riferimento: ");
                console.log(evento);
                this.idDoc = evento.iddocumento;
                this.riferimento = evento;
                this.showModalDoc=!this.showModalDoc;
            } else {
                console.log("Siamo nel caso del id Documento: ");
                console.log(evento);
                this.idDoc = evento;
                this.showModalDoc=!this.showModalDoc;
            }
        },
        openMovimento(movimento){
            console.log("Apri popup movimento");
            console.log(movimento);
            this.movimentoPopup = movimento.iddbmovimento;
            this.showModalMovimento++;
        },
        async deleteMatch(event){
            console.log("cancella match: " + this.theMatch.idmatch);
            console.log(event);
            try{
                await this.$store.commit('auth/setIsLoading', true, { root: true }) 
                if(event && !event.matchGiaRimosso) {
                    await this.$store.dispatch("match/DeleteMatch", this.theMatch);
                }

                // RIMUOVI MATCH DALLO STATO
                let newMatches = await this.$store.getters["match/getMatches"].items.filter(match => match.idmatch != this.theMatch.idmatch);
                let newMatchesStructure = await this.$store.getters["match/getMatches"];
                newMatchesStructure.items = newMatches
                newMatchesStructure.total = newMatchesStructure.total -1;
                await this.$store.commit('match/setMatches', newMatchesStructure);
                await this.$store.commit('auth/setIsLoading', false, { root: true }) 
                this.popupPrompt = "Match rimosso con successo";
                this.showModal= !this.showModal
            } catch(error){
                await this.$store.commit('auth/setIsLoading', false, { root: true }) 
                console.log(error)
                EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema nella cancellazione del match");
            }
        },
        setDifferenzeConti(leDifferenze){
            console.log("set  differenze conti con: " + leDifferenze.differenze + " e tot differenze: " + leDifferenze.differenzaTotale);
            this.theMatch.saldo = this.globalRounderToTwoDecimals(this.theMatch.saldo + leDifferenze.differenzaTotale);
//            this.theMatch.saldo = Number(this.theMatch.saldo).toFixed(2) + Number(leDifferenze.differenzaTotale).toFixed(2);
            this.theMatch.differenze = leDifferenze.differenze;
            console.log("nuovo saldo: " + this.theMatch.saldo );
            this.closeMatch();
            console.log("show modal a: " + this.showModal);
        },
        async confermaChiuso(){
            console.log("conferma chiuso");
            await this.$store.commit('auth/setIsLoading', true, { root: true }) 
            this.$router.push({name: "matchassociated1"});
        },

    }
    
})
</script>
<style scoped>
.btnBackStyle{
    margin-bottom: 20px;
}
.btnChiudiStyle{
    background-color: #FFDFCD !important;
    border: 1px solid rgb(0, 0, 0);
    margin: 1px 45px 5px 5px;
    float: right;
}
</style>
