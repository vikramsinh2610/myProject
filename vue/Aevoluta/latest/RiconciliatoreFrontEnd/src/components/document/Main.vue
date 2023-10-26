<template>
 <Modal class="new-doc-model"  :show="showDocumento" @hidden="showDocumento = false" @click.self="closeModal">
            <ModalHeader>
                <h2 class="font-medium text-base mr-auto">{{ $t("match_validati_details.Numero_Doc") }}: {{ nomeFileOriginale }} : {{
                    idDoc
                }}</h2>
                <button>
                    <XCircleIcon class="w-16 h-8 text-danger ml-auto mt-3" @click="closeModal" />
                </button>
               
            </ModalHeader>
            <ModalBody>
                <embed v-if="isPdf" :src=url type="application/pdf" width="100%" height="100%" :download=fileName>
                <div v-if="isHTML" v-html="myTable" style="overflow: scroll;"></div>
                <!-- <v-textarea v-if="isText" auto-grow v-model="myText" color="teal">
                </v-textarea> -->
            </ModalBody>
        </Modal>
</template>
<script setup>
import { read, utils } from 'xlsx';
import {ref, onMounted} from 'vue';
import { useMatchStore } from "@/stores/match";
let matchStore = useMatchStore();
const url = ref(null);
const fileName = ref(null)
const nomeFileOriginale = ref(null) 
const myTable = ref(null);
const myText = ref('');
const isPdf = ref(false);
const isHTML = ref(false);
const isText = ref(false);
const showDocumento = ref(false)
const props = defineProps({
   riferimento: {
    type: Object,
    default() {
      return {};
    },
  },
  idDoc: {
    type: [String, Number],
    default: "",
  },
});
onMounted(() => {
   pdfView()
})
async function pdfView() {
    try{ 
        await matchStore.LoadDocumento(props.idDoc)
       
        let currentDoc = matchStore.getDocumentoCorrente.doc
        console.log(currentDoc)

        let currentFile = matchStore.getDocumentoCorrente.fileName;

        nomeFileOriginale.value = matchStore.getDocumento(props.idDoc).nomefileoriginario;

        if (currentFile && currentFile.endsWith("pdf")) {


            isPdf.value = true
            url.value = URL.createObjectURL(currentDoc)
            fileName.value = currentFile
            console.log(url.value)
            console.log(fileName.value)
            console.log("reached here")
        } else if (currentFile && (currentFile.endsWith("xlsx") || currentFile.endsWith("xlx"))) {

            //this.$store.commit('auth/setIsLoading', true);
            isHTML.value = true;
            const ab = await currentDoc.arrayBuffer();
            /* Parse file andk get first worksheet */
            console.log("xlsx: " + utils);
            const wb = read(ab);
            let ws = wb.Sheets[wb.SheetNames[0]];
            if (props.riferimento) {
                let aoa = utils.sheet_to_json(ws, { header: 1, raw: false })
                console.log("ws rows: " + aoa.length + " cols: " + aoa[0].length);
                let filtered = aoa.filter((row, index) => {
                    if (index == 0) return true;
                    if (row[5] && props.riferimento.idPartita) {
                        return row[5].toString() === props.riferimento.idPartita.toString();
                    }
                    return false;
                })
                ws = utils.aoa_to_sheet(filtered);
            }
            /* Generate HTML */
            //console.log("html: " + XLSX.utils.sheet_to_html(ws))

            myTable.value = utils.sheet_to_html(ws);
            // this.$store.commit('auth/setIsLoading', false);

        } else {


            // console.log("no pdf no xlsx: " + currentFile);
            isText.value = true;
            myText.value = await currentDoc.text();
        }

        showDocumento.value = true
    }catch (error) {
        console.log("Exception nella creazione della modale: " + error);
        isPdf.value = false;
        myTable.value = "C'e' stato un problema nel caricamento del documento."
    }
}
function closeModal() {
    showDocumento.value = false
}

</script>
