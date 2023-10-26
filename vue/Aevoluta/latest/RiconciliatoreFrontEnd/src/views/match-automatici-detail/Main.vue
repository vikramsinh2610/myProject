<template>
    <div class="intro-y flex items-center py-4">
        <button class="btn btn-secondary bg-white btn-md" @click="backValidare">
            <ArrowLeftIcon class="block mx-auto h-5 w-4 text-neutral-800" />
        </button>
        <h1 class="text-lg font-medium truncate ml-5">{{ $t("automatici_da_validar.dettaglio_match") }}</h1>
        <button
            class="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top ml-auto bg-white border-0 btn-md"
            @click="deleteConfirmationModal = true">
            <MinusCircleIcon class="w-4 h-4 mr-2" /> {{ $t("automatici_da_validar.disassocia") }}
        </button>
        <button class="btn btn-primary py-3 px-4 ml-2 xl:mt-0 align-top bg-primary border-0 btn-md"
            @click="((saldo != 0) ? manualMatchModal = true : autoMatchModal = true)">
            <CheckIcon class="w-4 h-4 mr-2" /> {{ $t("movimento_da_associare.valida_match") }}
        </button>
    </div>
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
                    <div class="text-base text-slate-500 mt-1">{{ $t("movimento_da_associare.saldo") }}</div>
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
                                        {{ $t("movimento_da_associare.importo") }}: <span class="font-medium">{{
                                            currencyFormatter(item?.valuta_importo, item?.valuta)
                                        }}
                                        </span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("movimento_da_associare.data_doc") }}: <span class="font-medium">{{
                                            moment(item?.dataregistrazione).format('DD/MM/YYYY')
                                        }}
                                        </span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("movimento_da_associare.valuta") }}: <span class="font-medium">{{ item?.valuta
                                        }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validata_page.ID_Movimento") }}: <span class="font-medium">{{
                                            item?.iddbmovimento }}</span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.Data_Op") }}: <span class="font-medium">{{
                                            moment(item?.dataoperazione).format('DD/MM/YYYY') }}</span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.Conto") }}: <span class="font-medium">{{ item?.conto
                                        }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.Tipo_doc") }}:<span class="font-medium">{{ item?.tipo
                                        }}</span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.Testo_di_Par") }}: <span class="font-medium">{{
                                            item?.codice_piteco }}</span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validati_details.Nome_doc") }}: <span class="font-medium">{{
                                            item?.iddocumento
                                        }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="py-1 w-40" colspan="3">
                                        {{ $t("match_validati_details.Note") }}:<span class="font-medium">{{
                                            item?.notemovimento
                                        }}</span>
                                    </td>

                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <button @click="openPDoc('', item?.iddocumento)"
                                class="btn btn-outline-secondary  bg-white px-4 w-48 xl:w-42 mt-3 mb-4 xl:mt-0  ml-auto btn-sm float-right ">
                                <FileTextIcon class="w-4 h-4 mr-2 font-bold" />
                                {{ $t("match_validati_details.Visualizza_Documento") }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <!--left tab : end-->
        <!--Start : Centre-->
        <div class="col-span-12 lg:col-span-2 self-center">
            <div class="">

                <div class="rounded-full flex justify-center items-center w-24 h-4"></div>
                <div class="w-full flex justify-center border-b-2 border-slate-300 dark:border-darkmode-800 mt-2 relative">
                    <div
                        class="bg-white dark:bg-darkmode-600 px-5 -mt-3 text-slate-500 w-24 h-24 rounded-full flex justify-center items-center -mt-8 absolute -top-4 package-box-block">
                        <!-- <BoxIcon class="w-48 h-48 mr-2" /> -->
                        <div class="w-10 h-10 image-fit">
                            <img class="logo__image w-4" src="@/assets/images/big_match_automatic.svg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--End : Centre-->
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
                                        }}</span>
                                    </td>
                                    <td class="py-1 w-40">
                                        {{ $t("match_validata_page.Data_doc") }}: <span class="font-medium">{{
                                            moment(item?.datadocumento).format('DD/MM/YYYY')
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
                                <FileTextIcon class="w-4 h-4 mr-2 font-bold" />
                                {{ $t("match_validati_details.Visualizza_Documento") }}
                            </button>
                        </div>
                    </div>
                </div>
            </template>
        </div>

    </div>
    <!--Visualiza Documento Modal : start-->
    <Modal class="new-doc-model" :show="showDocumento" @hidden="showDocumento = false" @click.self="closeModal">
        <ModalHeader>
            <h2 class="font-medium text-base mr-auto">{{ $t("match_validati_details.Numero_Doc") }}: {{
                nomeFileOriginale }} : {{ idDoc }}</h2>
            <button>
                <XCircleIcon class="w-16 h-8 text-danger ml-auto mt-3" @click="closeModal" />
            </button>

        </ModalHeader>
        <ModalBody>
            <embed v-if="isPdf" :src=url type="application/pdf" width="100%" height="100%" :download=fileName>
            <div v-if="isHTML" v-html="myTable" style="overflow: scroll;"></div>
            <v-textarea v-if="isText" auto-grow v-model="myText" color="teal">
            </v-textarea>
        </ModalBody>
    </Modal>
    <!--Visualiza Documento Modal : end-->
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
    <!--end delete confirmation -->
    <!-- BEGIN: Basic Non Sticky Notification Content -->
    <Notification refKey="basicDeleteNotification" :options="{
        duration: 3000,
    }" class="flex flex-col sm:flex-row bg-green-500">
        <div class="font-medium">Deleted Successfully!</div>
        <!-- <a class="font-medium text-primary dark:text-slate-400 mt-1 sm:mt-0 sm:ml-40" href="">Review Changes</a> -->
    </Notification>
    <!-- END: Basic Non Sticky Notification Content -->
    <!--BEGIN: Manual Match Valida functionality-->
    <Modal class="validaMatch" :show="manualMatchModal" @hidden="manualMatchModal = false">
        <ModalBody class="p-0">

            <div class="flex justify-between items-center border-b p-4">
                <h4 class="text-xl">{{ $t("movimento_da_associare.valida_match") }} </h4>
                <div class="text-right">{{$t("automatici_da_validar.saldo_iniziale")}}: <span> {{ saldo }}</span></div>
            </div>
            <div class="p-4">
                <p class="text-slate-500 mb-4">
                    {{$t("automatici_da_validar.valida_match_heading2")}}:
                </p>
            </div>
            <div v-if="addDifferenze.length > 0" class="p-4" v-for="(add, index) in addDifferenze">

                <div class="sm:flex items-center">
                    <!-- BEGIN: Dropdown with close button -->
                    <PreviewComponent class="sm:w-1/3" v-slot="{ toggle }">
                        <Preview>
                            <!-- <div class="text-center"> -->
                            <Dropdown class="" placement="bottom-start" v-slot="{ dismiss }">
                                <DropdownToggle class="btn bg-white w-full flex justify-between">
                                    {{ add.nomeconto['nomecontoD'] }}
                                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownContent>
                                        <DropdownItem v-for="tipi in differenzePartiteCodici" :key="tipi.codicesapconto"
                                            @click="onChangeCodice(tipi.codicesapconto, tipi.nomeconto, add)">{{
                                                tipi.nomeconto }}
                                        </DropdownItem>
                                    </DropdownContent>
                                </DropdownMenu>
                            </Dropdown>
                            <!-- </div> -->
                        </Preview>
                    </PreviewComponent>
                    <!-- END: Dropdown with close button -->
                    <div class="w-12 flex-none xl:flex-initial sm:w-1/4 text-center">{{$t("automatici_da_validar.value")}}</div>
                    <input id="tabulator-html-filter-value" type="number" class="form-control sm:w-1/3 mt-2 sm:mt-0"
                        placeholder="" v-model="add.differenzeValue" :disabled="!(add.nomeconto['codicesapconto'] != '')" />
                    <MinusCircleIcon class="w-7 h-8 text-primary ml-auto" @click="RemoveDifferenzeItem(add)" />
                </div>
            </div>
            <div class="p-4">
                <div class="sm:flex items-center mt-4">
                    <PlusCircleIcon class="w-7 h-8 text-primary ml-auto" @click="AddDifferenzeItem()" />
                </div>
            </div>
            <div class="p-4 text-right border-t">
                <p class="text-slate-500 mb-4 w-full">
                    {{$t("automatici_da_validar.saldo_final")}} : {{ saldoFinal }}
                </p>
                <button type="button" @click="manualMatchModal = false" class="btn btn-outline-secondary w-24 mr-4">
                    {{ $t("match_validati_details.Annula") }}
                </button>
                <button type="button" :disabled="!btnValidaDisable" class="btn btn-primary w-24"
                    @click="matchValida()">{{$t("documenti_da_validare.Valida")}}</button>
            </div>
        </ModalBody>
    </Modal>
    <!--END: Manual Match Valida-->
    <!--BEGIN: Auto Match Valida-->
    <Modal :show="autoMatchModal" @hidden="autoMatchModal = false">
        <ModalBody class="p-0">
            <div class="p-5 text-center">
                <CheckCircleIcon class="w-16 h-16 text-primary mx-auto mt-3" />
                <div class="text-3xl mt-5">{{$t("movimento_da_associare.valida_match")}}</div>
                <div class="text-slate-500 mt-2">
                    {{$t("automatici_da_validar.valida_match_heading1")}}
                </div>
            </div>
            <div class="px-5 pb-8 text-center">
                <button type="button" @click="autoMatchModal = false" class="btn btn-outline-secondary w-24 mr-1">
                    {{ $t("match_validati_details.Annula") }}
                </button>
                <button type="button" class="btn btn-primary w-24" @click="matchValida()">{{$t("documenti_da_validare.Valida")}}</button>
            </div>
        </ModalBody>
    </Modal>
    <!--END: Auto Match Valida-->
</template>
<script setup>
import router from "@/router";
import { read, utils } from 'xlsx';
import { useMatchStore } from "@/stores/match";
import { ref, provide, onMounted, computed, onBeforeMount } from "vue";
import moment from "moment";
let matchStore = useMatchStore();
const detail = ref([])
const items_t = ref([])
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
const confidence = ref('')
const basicDeleteNotification = ref();
const differenzePartiteCodici = ref([])
const saldo = ref('')
const saldoFinal = ref('')
const btnValidaDisable = ref(false)
const addDifferenze = ref([]);
const manualMatchModal = ref(false)
const autoMatchModal = ref(false)
provide("bind[basicDeleteNotification]", (el) => {
    // Binding
    basicDeleteNotification.value = el;
});
onBeforeMount(async () => {
    await matchStore.LoadContiDifferenzeIncassiPartite()
    differenzePartiteCodici.value = matchStore.contiDifferenzeIncassiPartite;
    console.log("###########:    ", differenzePartiteCodici.value)
    // debugger
    var pathname = window.location.pathname.split('/')
    console.log(pathname[3])
    let params = new URLSearchParams();
    var newObj = {
        'params': params,
        'soloAperti': false
    }
    console.log("params")
    console.log(params)
    confidence.value = pathname[2]
    await matchStore.LoadMatches(newObj)
    items_t.value = matchStore.matchesChiusi.items
    let theMatch = items_t.value.find(item => { return item.idmatch == pathname[3] })
    detail.value = theMatch
    console.log(detail.value)

    saldo.value = detail.value.differenzamonetizzatainvalutaconimportoscontato
})

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
    confidence.value = pathname[2]
    await matchStore.LoadMatches(newObj)
    items_t.value = matchStore.matchesChiusi.items
    let theMatch = items_t.value.find(item => { return item.idmatch == pathname[3] })
    detail.value = theMatch
    console.log(detail.value)

    saldo.value = detail.value.differenzamonetizzatainvalutaconimportoscontato
    //saldoFinal.value = saldo.value
})
saldoFinal.value = computed(() => {
    let final = Number(saldo.value) + Number(differenzaTotale())
    if (final == 0) {

        btnValidaDisable.value = true
    } else {
        btnValidaDisable.value = false
    }

    return final
})

function onChangeCodice(id, name, add) {
    console.log(id, name, add)
    //debugger
    add.nomeconto.nomecontoD = name
    add.nomeconto.codicesapconto = id
    // nomeconto.value.nomecontoD = name;
    // nomeconto.value.codicesapconto = id;
}
function AddDifferenzeItem() {
    addDifferenze.value.push({ nomeconto: { nomecontoD: "Codice", codicesapconto: "" }, differenzeValue: '' })
    // if(addDifferenze.value.length == 0){
    //     addDifferenze.value.push({nomeconto:{nomecontoD: "Codice", codicesapconto: ""},differenzeValue:''})
    // }else{
    //     //debugger
    //     if((nomeconto.codicesapconto && nomeconto.codicesapconto != "") && (Number(differenzeValue.value) || Math.floor(differenzeValue.value))){
    //         console.log("correct------------------------",differenzeValue)
    //     }else{
    //         console.log("incorrect------", differenzeValue)
    //         debugger

    //     }
    // }

}
function RemoveDifferenzeItem(item) {

    let rindex = addDifferenze.value.indexOf(item)
    addDifferenze.value.splice(rindex, 1)
    console.log("Removed!! Remaining array length:    ", addDifferenze.value.length)
}
//calculation of items added in ValidaMatch
function differenzaTotale() {
    let differenzaTotale = 0;
    console.log(addDifferenze.value);
    for (const item of addDifferenze.value) {

        console.log("Codice: " + item.nomeconto.codicesapconto)
        if (item.nomeconto.codicesapconto && (item.nomeconto.codicesapconto != "")) {
            console.log("Passato: " + item.nomeconto.codicesapconto + "  differenzeValue === " + item.differenzeValue)
            if (segnoPerCodice(item) === "+") {
                console.log("==============", item.differenzeValue)
                differenzaTotale += Number(item.differenzeValue);
            } else {
                console.log("88888888888888 ", item.differenzeValue)
                differenzaTotale -= Number(item.differenzeValue);
            }
        }
    }
    //return 0
    console.log("---------------------------------------->>", differenzaTotale)
    return differenzaTotale;
}
function segnoPerCodice(item) {
    console.log("Segno per codice: " + item.nomeconto.codicesapconto + " with " + differenzePartiteCodici.value);
    if (
        differenzePartiteCodici.value.find(differenza => {
            return differenza.codicesapconto === item.nomeconto.codicesapconto;
        }
        )
        &&
        differenzePartiteCodici.value.find(differenza => {
            return differenza.codicesapconto === item.nomeconto.codicesapconto;
        }).iscontoinavere
    ) {
        return "-";
    } else {
        return "+"
    }
}
function backValidare() {
    router.push(`/match-automatici-list?match=${confidence.value}`);
}
function currencyFormatter(data, cFormate) {
    let newCurrency = new Intl.NumberFormat(undefined, { style: 'currency', currency: cFormate, maximumFractionDigits: 0 }).format(data);
    return newCurrency
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
function closeModal() {
    showDocumento.value = false
}
async function deleteMatch() {
    console.log("delete match!!")
    try {
        var theId = window.location.pathname.split('/')
        console.log(theId[2])
        console.log("Cancella Match for id: " + theId[3])
        let theMatch = matchStore.getMatchesChiusi.items.find(item => { return item.idmatch == theId[3] })
        //  await matchStore.DeleteMatch(theMatch)
        deleteConfirmationModal.value = false;
        // Show notification
        basicDeleteNotification.value.showToast();

        router.push(`/match-automatici-list?match=${confidence.value}`);

    } catch (error) {
        console.log("there was an error");
        console.log(error);
    }
}
async function matchValida() {
    let differenze = [];
    if (saldo.value != "" || saldo.value != 0) {
        differenze = differenzeSintetiche()
    }

    let listaPartite = [];
    let listaMovimenti = [];

    listaMovimenti.push(detail.value.movimenti[0].artificial_id_movimento)

    for (const item of detail.value.partite) {

        listaPartite.push(item.iddb);
    }
    let creaEChiudi = {
        listaPartite: listaPartite,
        listaMovimenti: listaMovimenti,
        differenze: differenze
    }
    // debugger
    await matchStore.CreaESalvaMatch(creaEChiudi)
    console.log("*************", creaEChiudi)
    manualMatchModal.value = false;
    autoMatchModal.value = false;
    addDifferenze.value = []

}

function differenzeSintetiche() {
    let diffrenzeDaInviare = [];
    for (const item of addDifferenze.value) {

        const cod_sap = item.nomeconto.codicesapconto;

        let cod = differenzePartiteCodici.value
            .find(diff => diff.codicesapconto === cod_sap)
            .codiceinternoconto;
        let importo = item.differenzeValue;
        //let id = item.idPartita;
        let diff = {};

        diff = { cod, importo };

        console.log(diff);
        diffrenzeDaInviare.push(diff);

    }
    return diffrenzeDaInviare;
}
function setValidaModal() {

    if (saldo.value != 0) {
        manualMatchModal.value = true;
        autoMatchModal.value = false;
    } else {
        autoMatchModal.value = true;
        manualMatchModal.value = false;
    }
}
</script>