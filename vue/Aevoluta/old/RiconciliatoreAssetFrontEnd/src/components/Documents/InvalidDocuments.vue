<template>
</template>

<script>
import DocOpened from '@/components/ManualMatch/DocOpened.vue'

export default {

    data(){
        return{   
            documentiNonValidi:[],
            showModalDoc: false,
            idDoc: null
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
        console.log("documenti non validi");
    },
    methods:{

        openDoc(anIdDocumento) {
            console.log("Apri documento: " + anIdDocumento);
            this.idDoc = anIdDocumento;
            this.showModalDoc=!this.showModalDoc
        },
    }

}
</script>

<style scoped>
.box{
  padding: 4px;
  overflow:auto;
    height: 450px;
}
.imgStyle{
    width: 85%;
}
</style>