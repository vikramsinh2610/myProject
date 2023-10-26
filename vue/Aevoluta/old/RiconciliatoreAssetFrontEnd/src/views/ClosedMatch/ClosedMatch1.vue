<template>

    <v-main>
        <br>
        <div style="width:100%; text-align:right; margin:10px; padding-right:100px"> 
             <v-btn elevation="0" class="btnDissociaSAPStyle" @click="toggleModal">
            <span style="color: white">Cancella Match</span>
        </v-btn>
        </div>
        <DetailMatch @openDoc="openDoc($event)"  @openMovimento="openMovimento($event)" :origin=false :idVal="this.$route.params.id"></DetailMatch>
        
       
        <div v-if="showModal">
            <PopUpClose  theme="Dissocia">
            <div>
                <h3>Attenzione!</h3>
           </div>
            <p>Per Dissociare il match occorre effettuare la procedura su SAP</p>
            <v-btn class="btnOkStyle" @click="deleteMatch" elevation="0" exact>ok</v-btn>
           <v-btn class="btnAnnullaStyle" elevation="0" @click="toggleModal">annulla</v-btn>
           
            </PopUpClose>
        </div>
        <div v-if="showModalDoc">
            <DocOpened  :idDoc="idDoc" :riferimento="riferimento" @close="openDoc">
            <div>
                prova
           </div>
            <v-btn class="btnOkStyle" @click="openDoc" elevation="0">ok</v-btn>
           
            </DocOpened>
    </div>
                <PopUpMovimento @openDoc="openDoc($event)" :movimentoId="movimentoPopup" :showModal="showModalMovimento">
            </PopUpMovimento>

    </v-main>

    
   
</template>
<script>
import DetailMatch from "@/components/DetailMatch.vue"
import PopUpClose from "@/components/PopUpClose.vue"
import DocOpened from "@/components/ManualMatch/DocOpened.vue"
import PopUpMovimento from "@/components/PopUpMovimento.vue"
import EventBus, { ACTIONS } from '@/components/Helpers/EventBus.js';

export default ({
    data(){
        return{
            idDoc: null,
            showModal: false,
            showModalDoc: false,
            showModalMovimento: 0,
            riferimento: null,
            movimentoPopup: [],
        }
    },
    components:{
        DetailMatch,
        PopUpClose,
        DocOpened,
        PopUpMovimento,
    },
    methods:{
        toggleModal(){
        this.showModal= !this.showModal
        },
        openDoc(evento){
            if(evento && evento.idPartita) {    
                //siamo nel caso di apertura di una partita con riferimento
                console.log("Siamo nel caso del riferimento: ");
                console.log(evento);
                this.idDoc = evento.iddocumento;
                this.riferimento = evento;
            } else {
                console.log("Siamo nel caso del id Documento: ");
                console.log(evento);
                this.idDoc = evento;
            }
            this.showModalDoc=!this.showModalDoc;
        },
        openMovimento(movimento){
            console.log("Apri popup movimento");
            console.log(movimento);
            this.movimentoPopup = movimento.iddbmovimento;
            this.showModalMovimento++;
        },
        async deleteMatch(){
            try{
                await this.$store.commit('auth/setIsLoading', true, { root: true }) 
                let theId = this.$route.params.id;
                console.log("Cancella Match for id: " + theId)
                let theMatch = this.$store.getters["match/getMatchesChiusi"].items.find(match => match.idmatch === theId);
                console.log("Match associato: " + theMatch);
                await this.$store.dispatch("match/DeleteMatch", theMatch);
                EventBus.$emit(ACTIONS.SNACKBAR_OK, "Match cancellato definitivamente");

                let params = new URLSearchParams();
                await this.$store.dispatch("match/LoadMatches", {params: params, soloAperti:false});

                this.$router.push({name: "closedmatch"});
            } catch(error){
                await this.$store.commit('auth/setIsLoading', false, { root: true }) 
                console.log(error)
                EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema nella cancellazione del match");
            }
        },

    }
    
})
</script>
<style scoped>
.btnBackStyle{
    margin-bottom: 20px;
}
.btnOkStyle{
    background-color: transparent !important;
    float: right;
    text-shadow: 1px 1px #3a383850;
}
.btnAnnullaStyle{
    background-color: transparent !important;
}
.btnDissociaSAPStyle{
    text-align:center;
    background-color: rgb(120, 52, 52) !important;
}

</style>
