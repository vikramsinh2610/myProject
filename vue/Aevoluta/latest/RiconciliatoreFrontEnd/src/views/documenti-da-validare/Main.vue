<template>
  <!-- <h2 class="intro-y text-lg font-medium mt-10">Product List dofa</h2> -->
  <div class="intro-y flex items-center py-4">
    <h1 class="text-lg font-medium truncate mr-5">
      {{ $t("documenti_da_validare.Documenti_Da_Validare") }}
    </h1>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <!--buttons above the content-->
    <div class="w-full intro-y col-span-12 flex flex-wrap sm:mt-0 sm:ml-auto md:ml-0 items-center mt-3">
      <button class="btn filter-btn bg-white intro-y flex items-center" v-on:click="filterdiv = !filterdiv">
        <SlidersIcon class="w-4 h-4 mr-2" />{{ (filterdiv == true) ? $t('commons.mostra_filtri') : $t('commons.nascondi_filtri') }}
      </button>
      <div class="hidden md:block mx-auto text-slate-500">
        {{ $t("commons.showing") }} {{ startPagenumber }}
        {{ $t("commons.to") }} {{ endPagenumber }} {{ $t("commons.of") }}
        {{ total }}
        {{ $t("commons.entries") }}
      </div>
    </div>
    <!--end: buttons above the content-->

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible filter-block-list">
      <!--filter side-->
      <div class="col-span-12 xl:col-span-4 left-part bg-white -ml-5 mr-5 rounded-lg" v-if="!filterdiv">
        <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center py-4">
            <h2 class="text-lg font-medium truncate mr-5">{{ $t("commons.Filtri") }}</h2>
            <button class="text-primary w-45 ml-auto" @click="reset(true)">
              {{ $t("commons.reset") }}
            </button>
          </div>
          <div>
            <div class="border border-slate-200/60 rounded mb-2">
              <div class="w-56 relative">
                <input type="text" class="form-control w-56 box pr-10 text-slate-700" :placeholder="$t('match_validati_details.Nome_Documento')"
                  v-model="nomDocumento" />
                <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
              </div>
            </div>
            <div class="border border-slate-200/60 rounded mb-2 date-range">
              <div class="w-56 relative">
                <vue-tailwind-datepicker :clearable="true" :options="datepickerOptions" v-model="filterDateRange"
                  :key="filterDateRange" :placeholder="$t('documenti_da_validare.Data_Contenuto')"
                  input-classes="form-control w-56 box pr-10 text-slate-700" use-range :formatter="datepickerFormatter"
                  :start-from="datepickerStartFrom" :disable-date="dDate" />
              </div>
            </div>
            <!-- <div class="border border-slate-200/60 rounded mb-2 date-range"> -->
              <div class="w-56 relative">
                 <!-- BEGIN: Dropdown with close button -->
              <PreviewComponent v-slot="{ toggle }">

                <div class="mb-3">
                  <Preview>
                    <!-- <div class="text-center"> -->
                    <Dropdown class="" placement="bottom-start" v-slot="{ dismiss }">
                      <DropdownToggle class="btn bg-white w-full flex justify-between">
                        {{ documentoDaCercare['descrizione'] }} {{ documentoDaCercare['iddb'] }}
                        <ChevronDownIcon class="w-4 h-4 ml-2" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownContent>
                          <DropdownItem v-for="tipi in tipidocumento" :key="tipi.iddb"
                            @click="onChangeTipiDocumento(tipi.iddb, tipi.descrizione)">{{ tipi.descrizione }} - {{ tipi.iddb }} 
                          </DropdownItem>
                        </DropdownContent>
                      </DropdownMenu>
                    </Dropdown>
                    <!-- </div> -->
                  </Preview>
                </div>
              </PreviewComponent>
              <!-- END: Dropdown with close button -->

              </div>
            <!-- </div> -->
            <button class="btn btn-sm btn-primary w-18 mt-3 float-right mb-2" @click="applyFilters">
              {{ $t("commons.applica") }}
            </button>
          </div>
        </div>
      </div>
      <!--end: filter side-->
      <!--Content side-->
      <div :class="active ? 'active' : 'inactive'">
        <table class="table table-report -mt-2">
          <tbody>
            <tr v-for="item in items_t" :key="item">
              <td>
                <FileXIcon class="w-6 h-6 mr-3 text-primary" />
              </td>
              <td>
                <strong>{{ item.nomefileoriginario }}</strong>
                <br />
                {{ item.notecheck }}
              </td>
              <td>
                <span>{{ $t("documenti_da_validare.Data_Contenuto") }}:</span><strong><b>{{
                  moment(item.datacontenutodocumento).format("DD/MM/YYYY")
                }}</b></strong><br />
              </td>
              <td>
                <span>{{ $t("documenti_da_validare.ID_File") }}:
                  <strong>{{ item.idfile }}</strong></span><br />
                <!-- <span
                  >Data:
                  <b>{{
                    moment(item.dataupload).format("DD/MM/YYYY")
                  }}</b></span
                > -->
              </td>
              <td>
                <span>{{ $t("documenti_da_validare.Tipo_Document") }}:
                  <strong>{{ item.codtipofile }}</strong></span><br />
                <!-- <span>{{ $t("documenti_da_validare.Valore_in_valuta") }}</span> -->
              </td>
              <td>
                <button id="searchDiv" class="btn mr-2 mb-2" @click="openDoc(item.idfile)">
                  <SearchIcon class="w-4 h-4" /><span v-if="!active">{{
                    $t("documenti_da_validare.Visualizza")
                  }}</span>
                </button>
                <button id="searchDiv" @click="loadDeleteModule(item.idfile)" class="btn mr-2 mb-2">
                  <Trash2Icon class="w-4 h-4" /><span v-if="!active">{{
                    $t("documenti_da_validare.Scarta")
                  }}</span>
                </button>
                <button id="searchDiv" @click="validaDeleteModule(item.idfile)" class="btn mr-2 mb-2 btn-primary">
                  <CheckCircleIcon class="w-4 h-4" /><span v-if="!active">{{
                    $t("documenti_da_validare.Valida")
                  }}</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex flex-wrap justify-between items-center p-2" v-if="isRecord">
          <div class="">
            <v-pagination class="intro-y" v-model="currentPage" :pages="totalPages" :range-size="1" active-color="#ffffff"
              @update:modelValue="getMatchData" />
          </div>
          <div class="">
            <select class="w-20 form-select box mt-3 sm:mt-0" name="onPerPage" id="onPerPage"
              @change="onPerPage(perPageRecords)" v-model="perPageRecords">
              <option v-for="item in perPageOption" :value="item">
                {{ item }}
              </option>
            </select>
          </div>
        </div>
        <!-- Pagination -->
      </div>
    </div>
    <!-- END: Data List -->
    <!-- BEGIN: Pagination -->

    <!-- END: Pagination -->
  </div>
  <!-- BEGIN: Delete Confirmation Modal -->
  <Modal :show="deleteConfirmationModal" @hidden="deleteConfirmationModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <AlertCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">
          {{ $t("documenti_da_validare.Scarta") }}
        </div>
        <div class="text-slate-500 mt-2">
          {{
            $t(
              "documenti_da_validare.Sei_sicuro_di_voler_scartare_il_Movimento"
            )
          }}<br />
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button type="button" @click="deleteConfirmationModal = false" class="btn btn-outline-secondary w-24 mr-1">
          {{ $t("documenti_da_validare.Annulla") }}
        </button>
        <button type="button" class="btn btn-danger w-24" @click="scarta(currentRowId)">
          {{ $t("documenti_da_validare.Scarta") }}
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Delete Confirmation Modal -->
  <!--Begin : Update Notes Modal-->
  <Modal :show="validaConfirmationModal" @hidden="validaConfirmationModal = false">
    <ModalBody class="p-0">
      <div class="p-5">
        <div class="text-3xl mt-5">
          {{ $t("documenti_da_validare.Valida_Documento") }}?
        </div>
      </div>
      <div class="border-y-2">
        <div class="p-5">
          <div class="text-slate-500 mt-2">
            {{
              $t(
                "documenti_da_validare.Per_validare_il_documento_inserisci_qui_le_note"
              )
            }}
          </div>
          <div>
            <input id="modal-form-1" type="text" class="form-control" placeholder="" v-model="note" />
          </div>
        </div>
      </div>
      <div class="px-5 pt-5 pb-8 text-end">
        <button type="button" @click="validaConfirmationModal = false" class="btn btn-secondary w-24 mr-1">
          {{ $t("documenti_da_validare.Annulla") }}
        </button>
        <button type="button" class="btn btn-primary w-24" @click="accetta(currentRowId)">
          {{ $t("documenti_da_validare.Valida") }}
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!--End : Update Notes Modal-->
  <!--Begin : Visualizza-->
  <DocOpened v-if="showDocumento" :idDoc="idDoc" theme="" @close="closeModal">
  </DocOpened>
  <!--End : Visualizza-->
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import router from "@/router";
import moment from "moment";
import { useMatchStore } from "@/stores/match";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import DocOpened from '@/components/document/Main.vue'

const matchStore = useMatchStore();
const deleteConfirmationModal = ref(false);
const validaConfirmationModal = ref(false);
const filterdiv = ref(true);
const active = ref(false);
const total = ref("");
const filterName = ref("Mostra Filtri");
const items_t = ref();
const currentRowId = ref();
// paginantion
const currentPage = ref(1);
const perPageRecords = ref(10);
const totalPages = ref(1);
const perPageOption = ref([10, 20, 30, 40]);
const isRecord = ref(false);
const startPagenumber = ref(1);
const endPagenumber = ref(1);
let datepickerStartFrom = new Date();
datepickerStartFrom.setMonth(datepickerStartFrom.getMonth() - 1);
//Drawer Filter
const nomDocumento = ref("");
const filterDateRange = ref("");
const tipoDocumento = ref("");
const note = ref("");
const showDocumento = ref(false)
const idDoc = ref("");
const datepickerOptions = ref({
  shortcuts: {
    today: "Oggi",
    yesterday: "Ieri",
    past: (period) => "Ultimi " + period + " giorni",
    currentMonth: "Mese corrente",
    pastMonth: "Mese scorso",
  },
  footer: {
    apply: "Applica",
    cancel: "Annulla",
  },
});
const documentoDaCercare = ref({
  iddb: "",
  descrizione: "Tipo Documento",
});
const tipidocumento = ref(null);
const dDate = (date) => {
  return date > new Date();
};
const datepickerFormatter = { date: "YYYY-MM-DD", month: "MMM" };
onMounted(async () => {
  await matchStore.LoadTipoDocumenti();
  getMatchData();
  tipidocumento.value = matchStore.tipiDocumento
  tipidocumento.value.unshift({
      descrizione: "Tutti",
      iddb: "0",
    });
});
const valute = computed(() => {});
watch(
  filterdiv,
  (newValue) => {
    if (newValue == true) {
      active.value = false;
      filterName.value = "Mostra Filtri";
    } else {
      active.value = true;
      filterName.value = "Nascondi Filtri";
    }
  },
  {
    immediate: true,
  }
);
function openDoc(anIdDocumento) {

  console.log("Apri documento: " + anIdDocumento);
  idDoc.value = anIdDocumento;
  console.log("idDoc: " + idDoc.value);
  showDocumento.value = !showDocumento.value
}
function closeModal() {
  showDocumento.value = false
}
function onChangeTipiDocumento(id, desc) {
  console.log(id + ' - ' + desc);
  documentoDaCercare.value.iddb = id
  documentoDaCercare.value.descrizione = desc
}
async function getMatchData() {
  let params = new URLSearchParams();
  params.append("page", currentPage.value);
  params.append("size", perPageRecords.value);
  if(nomDocumento.value != ''){
    params.append("nomedocumentolike", nomDocumento.value)
  }
  if (filterDateRange._rawValue.length > 0) {

    let dateSplit = filterDateRange._rawValue.toString().trim().split('~');
    params.append("datacontenutodocmin",  moment(dateSplit[0]).format("YYYY-MM-DDTHH:MM:SS"));
    params.append("datacontenutodocmax", moment(dateSplit[1]).format("YYYY-MM-DDTHH:MM:SS"));
  }
  if (documentoDaCercare.value.descrizione == 'Tipo Documento' || documentoDaCercare.value.iddb == '0') {
    params.append("codtipofile", -1);
  }
  else {
    params.append("codtipofile", documentoDaCercare.value.iddb);
  }
  var newObj = {
    params: params,
    soloAperti: false,
  };
  await matchStore.LoadDocumentiDaVerificare(newObj);
  console.log(matchStore.matchesDocumentDaVali.items)
  items_t.value = matchStore.matchesDocumentDaVali.items;
  total.value = matchStore.matchesDocumentDaVali.total;
  totalPages.value =
    matchStore.matchesDocumentDaVali.total /
    matchStore.matchesDocumentDaVali.size;
  if (items_t.value.length > 0) {
    isRecord.value = true;
  } else {
    isRecord.value = false;
  }
  startPagenumber.value =
    matchStore.matchesDocumentDaVali.size *
    (matchStore.matchesDocumentDaVali.page - 1) +
    1;
  if (
    matchStore.matchesDocumentDaVali.page *
    matchStore.matchesDocumentDaVali.size >
    matchStore.matchesDocumentDaVali.total
  ) {
    endPagenumber.value = matchStore.matchesDocumentDaVali.total;
  } else {
    endPagenumber.value =
      startPagenumber.value + matchStore.matchesDocumentDaVali.size - 1;
  }
}
function onPerPage(p) {
  perPageRecords.value = p;
  getMatchData();
}
function applyFilters() {
  getMatchData();
}
function loadDeleteModule(id) {
  currentRowId.value = id;
  deleteConfirmationModal.value = true;
}
async function accetta(anIdDocumento) {
  //await matchStore.LoadDocumentUpdate({idDoc: anIdDocumento, note:note.value});
  validaConfirmationModal.value = false;
  getMatchData();
  note.value = ''
}
async function scarta(anIdDocumento) {
  //await matchStore.LoadDocumentDelete({idDoc: anIdDocumento});

  deleteConfirmationModal.value = false;
  getMatchData();
}
function validaDeleteModule(id) {
  currentRowId.value = id;
  validaConfirmationModal.value = true;
}
function currencyFormatter(data, cFormate) {
  let newCurrency = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: cFormate,
    maximumFractionDigits: 0,
  }).format(data);
  return newCurrency;
}
function reset() {
 
  getMatchData();
  documentoDaCercare.value = { iddb: "",
  descrizione: "Tipo Documento"};
  nomDocumento.value = "";
  filterDateRange.value = "";
}
</script>
<style>
.active {
  width: 88%;
}

.filter-block-list .table {
  margin: -8px 0;
}

.inactive {
  display: block;
  width: 100%;
}

.filter-block-list {
  display: flex;
  justify-content: space-between;
}

.filter-btn svg {
  transform: rotate(90deg);
}

.blue-theme {
  --tw-bg-opacity: 0.3 !important;
  --tw-border-opacity: 0.3 !important;
}

.pink-theme {
  --tw-bg-opacity: 0.6 !important;
  --tw-border-opacity: 0.6 !important;
}

.dark-blue-theme {
  --tw-bg-opacity: 1 !important;
  --tw-border-opacity: 1 !important;
}

.lightblue {
  background: lightblue !important;
}

.intermediateblue {
  background: mediumblue !important;
}

.deepblue {
  background: darkblue !important;
}

.nonclickCursor {
  cursor: auto !important;
}

.intro-y li.PaginationControl {
  margin: 0 10px;
}

.intro-y button.Page {
  padding: 15px;
  border: none;
  margin: 0 5px;
}

.table-btn-block {
  min-width: 200px;
}
</style>
