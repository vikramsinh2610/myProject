<template>
    <div class="intro-y flex items-center py-4">
        <button class="btn btn-secondary mr-1 bg-white" @click="backButton">
            <ArrowLeftIcon class="block mx-auto" />
        </button>
        <h2 class="text-lg font-medium truncate mr-5">{{ $t("match_validati_details.Dettaglio_Match") }}</h2>
        <button class="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 xl:mt-0 align-top ml-auto bg-white"
            @click="deleteConfirmationModal = true">
            <MinusCircleIcon class="w-4 h-4 mr-2" /> {{ $t("match_validati_details.Disassocia") }}
        </button>
    </div>
    <!--begin delete confirmation-->
    <Modal :show="deleteConfirmationModal" @hidden="deleteConfirmationModal = false">
        <ModalBody class="p-0">
            <div class="p-5 text-center">
                <AlertCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
                <div class="text-3xl mt-5">Disassocia</div>
                <div class="text-slate-500 mt-2">
                    {{ $t("match_validati_details.Sei_sicuro_di_voler_disassociare_il_Match") }} <br />{{
                        $t("match_validati_details.Loperazione_e_irreversible") }}
                </div>
            </div>
            <div class="px-5 pb-8 text-center">
                <button type="button" @click="deleteConfirmationModal = false" class="btn btn-outline-secondary w-24 mr-1">
                    {{ $t("match_validati_details.Annula") }}
                </button>
                <button type="button" class="btn btn-danger w-24" @click="deleteMatch">{{
                    $t("match_validati_details.Disassocia") }}</button>
            </div>
        </ModalBody>
    </Modal>
    <!--end delete confirmation-->
    <!--4 tabs : start-->
    <div class="grid grid-cols-12 gap-6 mt-5">
        <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in" style="cursor:default">
                <div class="box box-card p-5 h-32">

                    <div class="text-3xl font-medium leading-8 mt-6">{{ detail?.movimenti?.[0]?.ragionesociale }}</div>
                    <div class="text-base text-slate-500 mt-1">{{ $t("match_validata_page.Ragione_Sociale") }}</div>
                </div>
            </div>
        </div>
        <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in" style="cursor:default">
                <div class="box box-card p-5 h-32">
                    <div class="text-3xl font-medium leading-8 mt-6">{{ detail.idmatch }}</div>
                    <div class="text-base text-slate-500 mt-1">{{ $t("match_validati_details.SAP_ID") }}</div>
                </div>
            </div>
        </div>
        <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in" style="cursor:default">
                <div class="box box-card p-5 h-32">
                    <div class="text-3xl font-medium leading-8 mt-6">
                        {{ currencyFormatter(detail?.differenzamonetizzatainvalutaconimportoscontato, 'EUR') }}</div>
                    <div class="text-base text-slate-500 mt-1">{{ $t("match_validata_page.Saldo") }}</div>
                </div>
            </div>

        </div>
        <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in" style="cursor:default">
                <div class="box box-card p-5 h-32">
                    <div class="text-3xl font-medium leading-8 mt-6">{{ detail.score }}%</div>
                    <div class="text-base text-slate-500 mt-1">{{ $t("match_validata_page.Confidenza") }}</div>
                </div>
            </div>
        </div>
    </div>
    <!--4 tabs : end-->

    <!--paragraph : start-->
    <div class="intro-y flex items-center mt-8">
        <div class="intro-y grid grid-cols-12 gap-6 w-full">
            <div class="col-span-12 ">
                <div class="intro-y box">
                    <div
                        class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 class="font-medium text-base mr-auto">{{
                            $t("match_validati_details.Determinazione_Confidenza_Match") }}</h2>
                    </div>
                    <div class="p-5">

                        <div>
                            <b>{{ detail.scorepartite }}</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--paragraph : end-->

    <!--varied tab: start-->
    <div class="intro-y grid grid-cols-12 gap-9 mt-5">
        <!--left tab : start-->
        <template v-for="item in detail.movimenti" :key="item">
            <div class="col-span-12 lg:col-span-5 flex justify-center items-center">
                <div class="intro-y box float-left w-full">
                    <div class="p-5">

                        <table class="table-list-block w-full">
                            <tbody>
                                <td colspan="3">
                                    <div class="font-extrabold">{{ item?.ragionesociale }}</div>
                                </td>
                                <tr>
                                    <td class="py-2 w-40">
                                        {{ $t("match_validata_page.Importo") }}: <span class="font-medium"> {{
                                            currencyFormatter(item?.valuta_importo, item?.valuta)
                                        }}
                                        </span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validata_page.Data_doc") }}: <span class="font-medium">{{
                                            moment(item?.dataregistrazione).format('DD/MM/YYYY')
                                        }}
                                        </span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validata_page.Valuta") }}: <span class="font-medium">{{ item?.valuta
                                        }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validata_page.ID_Movimento") }}: <span class="font-medium">{{
                                            item?.iddbmovimento
                                        }}</span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.Data_Op") }}: <span class="font-medium">{{
                                            moment(item?.dataoperazione).format('DD/MM/YYYY')
                                        }}</span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.Conto") }}: <span class="font-medium">{{ item?.conto
                                        }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.Tipo_doc") }}: <span class="font-medium">{{ item?.tipo
                                        }}</span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.Testo_di_Par") }}: <span class="font-medium">{{
                                            item?.codice_piteco
                                        }}</span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.Nome_doc") }}: <span class="font-medium">{{
                                            item?.iddocumento
                                        }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3">
                                        {{ $t("match_validati_details.Note") }}: <span class="block inline font-medium">{{
                                            item?.notemovimento
                                        }}</span>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                        <div>
                            <button @click="openPDoc('', item?.iddocumento)"
                                class="btn btn-outline-secondary  bg-white px-4 w-48 xl:w-42 mt-3 mb-4 xl:mt-0  ml-auto btn-sm float-right ">
                                <FileTextIcon class="w-4 h-4 mr-2 font-bold" /> {{
                                    $t("match_validati_details.Visualizza_Documento") }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <!--left tab : end-->
        <!--center : start-->
        <div class="col-span-12 lg:col-span-2 self-center">
            <div class="">

                <div class="rounded-full flex justify-center items-center w-24 h-4"></div>
                <div class="w-full flex justify-center border-b-2 border-slate-300 dark:border-darkmode-800 mt-2 relative">
                    <div
                        class="bg-white dark:bg-darkmode-600 px-5 -mt-3 text-slate-500 w-24 h-24 rounded-full flex justify-center items-center -mt-8 absolute -top-4 package-box-block">
                        <img alt="Enigma Tailwind HTML Admin Template" class="logo__image w-6"
                            src="@/assets/images/big_match_valid.svg" />
                    </div>
                </div>
            </div>
        </div>
        <!--center : end-->
        <!--right tab : start-->
        <div class="col-span-12 lg:col-span-5">
            <template v-for="item in detail.partite" :key="item">
                <div class="intro-y box float-left w-full mt-5">
                    <div class="p-5">
                        <table class="table-list-block w-full">
                            <tbody>
                                <td colspan="3">
                                    <div class="font-extrabold">{{ item?.ragionesociale }}</div>
                                </td>
                                <tr>
                                    <td class="py-2 w-40">
                                        {{ $t("match_validata_page.Importo") }}: <span class="font-medium"> {{
                                            currencyFormatter(item?.valutalordo,
                                                item?.valuta)
                                        }}
                                        </span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validata_page.Data_doc") }}: <span class="font-medium">{{
                                            moment(item?.datadocumento).format('DD/MM/YYYY')
                                        }}
                                        </span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.Divisa") }}: <span class="font-medium">{{ item?.valuta
                                        }} </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.Numero_Doc") }}: <span class="font-medium">{{
                                            item?.numerodocumento
                                        }}</span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.Data_Scad") }}: <span class="font-medium">{{
                                            moment(item?.datascadenza).format('DD/MM/YYYY')
                                        }}</span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.SAP_ID") }}: <span class="font-medium">{{ item?.sapid
                                        }}</span>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                        <div>
                            <button @click="openPDoc(item?.numerodocumento, item?.iddocumento)"
                                class="btn btn-outline-secondary  bg-white px-4 w-48 xl:w-42 mt-3 mb-4 xl:mt-0  ml-auto btn-sm float-right ">
                                <FileTextIcon class="w-4 h-4 mr-2 font-bold" /> {{
                                    $t("match_validati_details.Visualizza_Documento") }}
                            </button>
                        </div>
                    </div>

                </div>
            </template>
            <!-- <div class="intro-y box mt-5  float-left w-full">

                <div class="p-5">
                   
                    <table class="table-list-block w-full">
                        <tbody>
                            <td colspan="3">
                                <div class="font-extrabold">{{ detail?.movimenti?.[0]?.ragionesociale }}</div>
                            </td>
                            <tr>
                                <td class="py-2 w-40">
                                    Importo: <span class="font-medium"> ${{ detail?.partite?.[0]?.valutalordo }} </span>
                                </td>
                                <td class="py-1 w-40">
                                    Date Doc: <span class="font-medium">{{
                                        moment(detail?.partite?.[0]?.datadocumento).format('DD/MM/YYYY')
                                    }}
                                    </span>
                                </td>
                                <td class="py-1 w-40">
                                    Divisa: <span class="font-medium">{{ detail?.partite?.[0]?.valuta }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="py-1 w-40">
                                    Numero doc: <span class="font-medium">{{
                                        detail?.partite?.[0]?.numerodocumento
                                    }}</span>
                                </td>
                                <td class="py-1 w-40">
                                    Date scad: <span class="font-medium">{{
                                        moment(detail?.partite?.[0]?.datascadenza).format('DD/MM/YYYY')
                                    }}</span>
                                </td>
                                <td class="py-1 w-40">
                                    Sap ID: <span class="font-medium">{{ detail?.partite?.[0]?.sapid }}</span>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                    <div>
                        <button
                            class="btn btn-outline-secondary  bg-white px-4 w-48 xl:w-42 mt-3 mb-4 xl:mt-0  ml-auto btn-sm float-right ">
                            <FileTextIcon class="w-4 h-4 mr-2 font-bold" /> Visualizza Documento
                        </button>
                    </div>
                </div>
            </div> -->

        </div>
        <!--right tab : end-->
        <!--Visualiza Documento Modal : start-->
        <Modal class="new-doc-model" :show="showDocumento" @hidden="showDocumento = false" @click.self="closeModal">
            <ModalHeader>
                <h2 class="font-medium text-base mr-auto">{{ $t("match_validati_details.Numero_Doc") }}: {{
                    nomeFileOriginale }} : {{
        idDoc
    }}</h2>
                <button>
                    <XCircleIcon class="w-16 h-8 text-danger ml-auto mt-3" @click="closeModal" />
                </button>
                <!-- <XCircleIcon class="w-16 h-8 text-danger ml-auto mt-3" @click="closeModal" /> -->
            </ModalHeader>
            <ModalBody>
                <embed v-if="isPdf" :src=url type="application/pdf" width="100%" height="100%" :download=fileName>
                <div v-if="isHTML" v-html="myTable" style="overflow: scroll;"></div>
                <v-textarea v-if="isText" auto-grow v-model="myText" color="teal">
                </v-textarea>
            </ModalBody>
        </Modal>
        <!--Visualiza Documento Modal : end-->
    </div>
    <!--varied tab: end-->
</template>
<script setup>
import { read, utils } from 'xlsx';
import { ref, onMounted } from "vue";
import router from "@/router";
import { useMatchStore } from "@/stores/match";
import moment from "moment";
let matchStore = useMatchStore();
let theMatch = ref([])
const detail = ref([])
const deleteConfirmationModal = ref(false)
const showDocumento = ref(false)
const nomeFileOriginale = ref('')
const idDoc = ref('')
const isPdf = ref(false)
const isHTML = ref(false)
const isText = ref(false)
const url = ref('')
const fileName = ref('')
const riferimento = ref([])
const myTable = ref(null)
const items_t = ref([])
onMounted(async () => {
    var pathname = window.location.pathname.split('/')
    console.log(pathname[3])

    let params = new URLSearchParams();
    var newObj = {
        'params': params,
        'soloAperti': false
    }
    console.log("params")
    console.log(params)
    await matchStore.LoadMatches(newObj)
    items_t.value = matchStore.matchesChiusi.items
    theMatch = items_t.value.find(item => { return item.idmatch == pathname[3] })
    detail.value = theMatch
    console.log(detail.value)

})
async function deleteMatch() {
    console.log("delete match!!")
    try {
        var theId = window.location.pathname.split('/')
        console.log(theId[3])
        console.log("Cancella Match for id: " + theId[3])
        let theMatch = matchStore.getMatchesChiusi.items.find(item => { return item.idmatch == theId[3] })
        await matchStore.DeleteMatch(theMatch)
        deleteConfirmationModal.value = false;
        router.push({ name: "top-menu-match" });

    } catch (error) {
        console.log("there was an error");
        console.log(error);
    }
}
function backButton() {
    router.push({ name: "top-menu-match" });
}
function closeModal() {
    showDocumento.value = false
}
async function openPDoc(aNumerodocumento, anIddocumento) {
    if (aNumerodocumento != "") {

        riferimento.value = { colonna: "Numero documento", idPartita: aNumerodocumento, iddocumento: anIddocumento };
    } else {

    }

    idDoc.value = anIddocumento
    await matchStore.LoadDocumento(anIddocumento)

    let currentDoc = matchStore.getDocumentoCorrente.doc
    console.log(currentDoc)

    let currentFile = matchStore.getDocumentoCorrente.fileName;

    nomeFileOriginale.value = matchStore.getDocumento(idDoc.value).nomefileoriginario;

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
        if (riferimento) {
            let aoa = utils.sheet_to_json(ws, { header: 1, raw: false })
            console.log("ws rows: " + aoa.length + " cols: " + aoa[0].length);
            let filtered = aoa.filter((row, index) => {
                if (index == 0) return true;
                if (row[5] && riferimento.idPartita) {
                    return row[5].toString() === riferimento.idPartita.toString();
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
}
function currencyFormatter(data, cFormate) {
    let newCurrency = new Intl.NumberFormat(undefined, { style: 'currency', currency: cFormate, maximumFractionDigits: 0 }).format(data);
    return newCurrency
}
</script>


<style>
.package-box-block svg {
    margin-right: 0;
}

.new-doc-model .modal-dialog {
    width: 90% !important;
}

.new-doc-model .modal-dialog .modal-body {
    height: 90vh !important;
    padding-bottom: 40px;
}

.box-card {
    min-height: 180px;
}</style>