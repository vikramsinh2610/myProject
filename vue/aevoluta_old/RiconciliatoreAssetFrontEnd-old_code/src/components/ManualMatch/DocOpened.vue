<template>
  <div class="backdrop" @click.self="closeModal">
        <div class="modalDoc" >
            <h4>Nome Documento: {{nomeFileOriginale}} ID Documento: {{idDoc}}</h4>
            <embed v-if="isPdf" :src=url type="application/pdf" width="100%" height="100%" :download=fileName>
            <div v-if= "isHTML" v-html="myTable" style="overflow: scroll;"></div>
            <v-textarea v-if="isText"
                auto-grow
                v-model="myText"
                color="teal"
                >
            </v-textarea>
        </div>


    </div>
</template>

<script>
//import XLSX from 'xlsx';
import { read, utils } from 'xlsx';

export default { 
    props:[ 'idDoc', 'text', 'riferimento'],
     data(){
     return{
         url: null,
         fileName: null,
         nomeFileOriginale: null,
         myTable: null,
         myText: "",
         isPdf: false,
         isHTML: false,
         isText: false,
     }
 },
     async created() {
        try {
            console.log("Id Documento: " + this.idDoc);
            await this.$store.dispatch("match/LoadDocumento", this.idDoc);
            let currentDoc = this.$store.getters["match/getDocumentoCorrente"].doc;
            let currentFile = this.$store.getters["match/getDocumentoCorrente"].fileName;
            this.nomeFileOriginale = this.$store.getters["match/getDocumento"](this.idDoc).nomefileoriginario;
            if(currentFile && currentFile.endsWith("pdf")) {
                this.isPdf = true;
                this.url= URL.createObjectURL(currentDoc);
                this.fileName=currentFile;
                /* Search non funziona.
                if(this.riferimento && this.riferimento.search) {
                    setTimeout(function(termine) {
                        console.log("find: " + termine);
                        window.find(termine);
                    }, 5000, this.riferimento.term);
                }*/
            } else if(currentFile && (currentFile.endsWith("xlsx") || currentFile.endsWith("xlx"))) {
                this.$store.commit('auth/setIsLoading', true);
                this.isHTML = true;
                const ab = await currentDoc.arrayBuffer();
                /* Parse file andk get first worksheet */ 
                console.log("xlsx: " + utils);
                const wb = read(ab);
                let ws = wb.Sheets[wb.SheetNames[0]];
                if(this.riferimento) {
                    let aoa = utils.sheet_to_json(ws, {header:1, raw:false})
                    console.log("ws rows: " + aoa.length + " cols: " + aoa[0].length);
                    let filtered = aoa.filter((row, index) => {
                        if(index == 0) return true;
                        if(row[5] && this.riferimento.idPartita) {
                            return row[5].toString() === this.riferimento.idPartita.toString();
                        }
                        return false;
                    })
                    ws = utils.aoa_to_sheet(filtered);
                }
                /* Generate HTML */
                //console.log("html: " + XLSX.utils.sheet_to_html(ws))

                this.myTable = utils.sheet_to_html(ws);
                this.$store.commit('auth/setIsLoading', false);
            } else {
                console.log("no pdf no xlsx: " + currentFile);
                this.isText = true;
                this.myText = await currentDoc.text();
            }
        } catch(error) {
            console.log("Exception nella creazione della modale: " + error);
            this.$store.commit('auth/setIsLoading', false);
            this.isPdf = false;
            this.myTable = "C'e' stato un problema nel caricamento del documento."
        }
    },
    destroyed() {
        this.$destroy() 
        console.log("unmounting modal");
        if(this.url && this.isPdf) {
            URL.revokeObjectURL(this.url);
            this.url = null;
        }
        this.isPdf = false;
        this.fileName = null;
    },
    methods: {
       

        closeModal(){
            this.$emit('close')
        }
    }

}
</script>

<style scoped>
.box{
    padding: 4px;
  overflow:auto;
  border: 1px solid rgb(219, 219, 219);
  background-color: rgba(221, 220, 220, 0.216);
  height: 450px;
  overflow-x: hidden;
}
.modalDoc{
    width:90%;
    overflow:auto;
    height:90%;
    padding: 20px;
    margin: 50px auto; 
    margin-top:100px;
    background: white;
    border-radius: 10px;
    border: 1px solid rgb(0, 0, 0);
}
.backdrop{
    top: 0;
    position: fixed;
    background: rgba(0, 0, 0, 0.419);
    width: 100%;
    height:100%;
    z-index:1500;
}
.modalDoc h4{
    color: rgb(86, 86, 86);
    border: none;
    padding: 0;
    text-align: center;
    font-style: italic;
}
.modalDoc p{
    font-style: normal;
    text-align: center;
    margin-top: 20px;
}
        /* Tables */
        ::v-deep     .table{
            width:100%;
            margin-bottom:1em;
            border-collapse: collapse;
        }
        ::v-deep th{
            font-weight:bold;
            background-color:#ddd;
        }
        th,
        ::v-deep td{
            padding:0.5em;
            border:1px solid #ccc;

        }
</style>