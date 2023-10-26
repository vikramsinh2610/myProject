<template>
  <div> 
        <div class="containerStyle">
            <table style="width:100%; margin: 10px">
                <h4> Documenti da verificare</h4>
                <tr >
                    <td style="width:100%; border-right: 1px solid rgba(0, 0, 0, 0.342); ">
                    <div class="box">
                      <table style="margin-top: 30px;">
                        <div v-for="(documento) in documentiNonValidi" :key="documento.id" >
                                <tr style="width: 100%">
                                    <td style="width: 8%; vertical-align:top;">
                                            <v-icon size="100">mdi-text-box-remove</v-icon>
                                    </td>
                                    <td style="width:92% ">
                                        <tr >
                                            <h4>
                                            {{documento.nomefileoriginario}}
                                        </h4>
                                        </tr>
                                        
                                        <tr>
                                            Data Contenuto: {{documento.datacontenutodocumento | formatDateLong}}
                                        </tr>
                                        <tr>
                                            Tipo File: {{documento.tipoDocTesto}}
                                        </tr>
                                        <tr>
                                            Id File: {{documento.idfile}}
                                        </tr>
                                        <tr v-if="documento.note_check.length > 0">
                                            <span >
                                            Ragione Richiesta: {{documento.note_check}}
                                            </span>
                                        </tr>
                                        <tr>
                                            <p style="float:left; margin-top:0px">Visualizza Documento</p>
                                            <v-btn style=" margin: -5px 5px 0px 5px; float: left" icon class="flexcol" @click="openDoc(documento.idfile)">
                                            <v-icon size="20">mdi-open-in-new</v-icon>
                                            </v-btn>
                                        </tr>
                                    </td>
                                    <td style="width:100px; ">
                                        <tr>
                                            <v-btn 
                                            medium
                                            color="primary"
                                            dark
                                            style="margin-bottom:20px; margin-right: 20px"
                                            @click="accetta(documento.idfile)">
                                                Accetta
                                            </v-btn>
                                        </tr>
                                        <tr>
                                            <v-btn 
                                            medium
                                            color="primary"
                                            dark
                                            style="margin-bottom:20px; margin-right: 10px"
                                            @click="scarta(documento.idfile)">
                                                Scarta
                                            </v-btn>
                                        </tr>
                                    </td>
                                </tr>
                        </div>
                            </table>

                    </div>
                    </td>
                </tr>
            </table>
    </div>
    <div v-if="showModalDoc">
            <DocOpened  :idDoc="idDoc" theme="" @close="openDoc">
            <div>
                
        </div>
            <v-btn class="btnOkStyle" @click="openDoc" elevation="0">ok</v-btn>
        
            </DocOpened>
    </div>
    
  </div>
</template>

<script>
import DocOpened from '@/components/ManualMatch/DocOpened.vue'
import EventBus, { ACTIONS } from '../../components/Helpers/EventBus.js';

export default {

    data(){
        return{   
            documentiNonValidi:[],
            showModalDoc: false,
            idDoc: null,
        }
    },
   components:{
        DocOpened,
    }, 
    async created() {
        let params = new URLSearchParams();
        params.append('visualizza_non_validi', true);
        await this.$store.dispatch("match/LoadDocumentiDaVerificare", params);
        this.documentiNonValidi = this.$store.getters["match/getDocumentiDaVerificare"].items;
        console.log("documenti non validi caricati");

        let tipiDocumento = structuredClone(this.$store.getters["match/getTipiDocumento"]);
        for(let doc of this.documentiNonValidi) {
            doc.tipoDocTesto = tipiDocumento.find(tipo => tipo.iddb === doc.codtipofile).descrizione;
        }
    },
    methods:{
        openDoc(anIdDocumento) {
            console.log("Apri documento: " + anIdDocumento);
            this.idDoc = anIdDocumento;
            this.showModalDoc=!this.showModalDoc
        },
        async accetta(anIdDocumento) {
            try{ 
                console.log("accetta: " + anIdDocumento);
                await this.$store.dispatch("match/UpdateDocumento", {idDoc: anIdDocumento, op: "conferma"});
                this.reloadDocumenti();
                EventBus.$emit(ACTIONS.SNACKBAR_OK, "Documento Accettato");
            } catch(error){
                await this.$store.commit('auth/setIsLoading', false, { root: true }) 
                console.log(error)
                EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema nella accettazione del documento");
            }
        },
        async scarta(anIdDocumento) {
            try{ 
                console.log("scarta: " + anIdDocumento);
                await this.$store.dispatch("match/UpdateDocumento", {idDoc: anIdDocumento, op: "scarta"});
                this.reloadDocumenti();
                EventBus.$emit(ACTIONS.SNACKBAR_OK, "Documento Scartato");
            } catch(error){
                await this.$store.commit('auth/setIsLoading', false, { root: true }) 
                console.log(error)
                EventBus.$emit(ACTIONS.SNACKBAR_KO, "Problema nello scarto del documento");
            }
        },
        async reloadDocumenti() {
            let params = new URLSearchParams();
            params.append('visualizza_non_validi', true);
            await this.$store.dispatch("match/LoadDocumentiDaVerificare", params);
            this.documentiNonValidi = this.$store.getters["match/getDocumentiDaVerificare"].items;
            console.log("documenti non validi caricati");
            EventBus.$emit(ACTIONS.SNACKBAR_OK, "Documenti Aggiornati");
        }

    }

}
</script>

<style>
.containerStyle{
    border: 1px solid rgb(0, 0, 0);
    background-color: rgba(203, 197, 197, 0.242);
    margin-top: 10px;
    width: 90%;
    margin:auto

}
</style>