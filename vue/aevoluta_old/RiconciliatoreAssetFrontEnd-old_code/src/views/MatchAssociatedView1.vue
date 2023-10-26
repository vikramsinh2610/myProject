<template>
    <v-main>
        <v-row v-if="attivaRicerca" align="center"
      justify="center">

        <v-text-field class="shrink" style="width:500px;margin-right:40px" label="Parola/Frase da cercare" v-model="ricercaLibera"></v-text-field> 

        <v-btn large color="primary" elevation="0"  @click="ricercaMatch">
            Ricerca
        </v-btn>
    </v-row>
            <MatchList ref="theMatchlist"></MatchList>
        <v-btn elevation="0" class="btnChiudiStyle" @click="chiudiSelezionate">
            <span style="color: #D91A21">Chiudi Match Selezionati</span>
        </v-btn>

    </v-main>
</template>

<script>
import MatchList from "../components/MatchList.vue";
import EventBus, { ACTIONS } from '../components/Helpers/EventBus.js';

export default ({
    created(){
        console.log(this.numMatch)
    },
    data(){
        return{
            numMatch: this.$route.params.numMatch,
            ricercaLibera: "",
        }
    },
    components: {
        MatchList,
    },
    mounted() { 
        this.$store.commit('auth/setIsLoading', false);
    },    
    methods:{
    
        async chiudiSelezionate(){
            console.log("Chiudi Selezionate");
            let selected = this.$refs.theMatchlist.checkedMatch; 
            let allMatches = await this.$store.getters["match/getMatches"].items;
            console.log(selected);
            let allZero = true;

            for(let anIdMatch of selected) {
                if(allMatches.find(match => match.idmatch == anIdMatch).saldo != 0) {
                    console.log("trovato saldo diverso da zero per: " + anIdMatch)
                    allZero = false;
                }
            }
            if(!allZero) {
                    EventBus.$emit(ACTIONS.SNACKBAR_KO, "Selezionata partita con saldo diverso da zero.");
                    return;
            }
            await this.$store.commit('auth/setIsLoading', true, { root: true }) 
            for(let anIdMatch of selected) {
                // chiudi as is.
                let theMatch = allMatches.find(match => match.idmatch == anIdMatch);
                try{
                    await this.$store.dispatch("match/SaveMatch", theMatch);
                    let newMatches = await this.$store.getters["match/getMatches"].items.filter(match => match.idmatch != theMatch.idmatch);
                    let newMatchesStructure = await this.$store.getters["match/getMatches"];
                    newMatchesStructure.items = newMatches
                    newMatchesStructure.total = newMatchesStructure -1;
                    await this.$store.commit('match/setMatches', newMatchesStructure);
                    console.log("Match chiuso con successo" + anIdMatch);
                } catch(error){
                    await this.$store.commit('auth/setIsLoading', false, { root: true }) 
                    console.log(error)
                    EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema nel salvataggio del match: " + anIdMatch);
                    return;
                }
            }
            console.log("Tutti i match chiusi con successo");
            EventBus.$emit(ACTIONS.SNACKBAR_OK, "Partite chiuse con successo");
            await this.$store.commit('auth/setIsLoading', false, { root: true }) 
        },
        async ricercaMatch() {
            await this.$store.commit('auth/setIsLoading', true, { root: true }) 

            let params = new URLSearchParams();
            params.append('like_str', this.ricercaLibera);
            await this.$store.dispatch("match/LoadMatches", {params: params, soloAperti:true});
            await this.$store.commit('auth/setIsLoading', false, { root: true }) 

        }
    },
    computed:{
        attivaRicerca : function() {
            return this.$store.getters["match/getIsRicercaOn"];
        }
    },
})
</script>

<style scoped>

.btnBackStyle{
    margin-bottom: 0px;
}

.btnChiudiStyle{
    background-color: #FFDFCD !important;
    border: 1px solid rgb(0, 0, 0);
    margin: 15px 45px 5px 5px;
    float: right;
}
.btnOkStyle{
    background-color: transparent !important;
    float: right;
    text-shadow: 1px 1px #3a383850;
}

</style>
