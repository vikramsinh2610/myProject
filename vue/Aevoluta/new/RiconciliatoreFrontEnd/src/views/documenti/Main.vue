<template>
  <!-- Title -->
  <div class="intro-y flex items-center py-4">
    <h1 class="text-lg font-medium truncate mr-5">
      {{ $t("documenti.documenti") }}
    </h1>
  </div>
  <!-- End Title -->

  <div class="grid grid-cols-12 gap-6 mt-5">
    <!--Start : buttons-->
    <div class="w-full intro-y col-span-12 flex flex-wrap sm:mt-0 sm:ml-auto md:ml-0 items-center mt-3">
      <button class="btn filter-btn bg-white intro-y flex items-center" v-on:click="filterdiv = !filterdiv">
        <SlidersIcon class="w-4 h-4 mr-2" />{{ (filterdiv == true) ? $t('commons.mostra_filtri') :
          $t('commons.nascondi_filtri') }}
      </button>
      <div class="hidden md:block mx-auto text-slate-500">
        {{ $t("commons.showing") }} {{ startPagenumber }}
        {{ $t("commons.to") }} {{ endPagenumber }} {{ $t("commons.of") }}
        {{ total }}
        {{ $t("commons.entries") }}
      </div>
    </div>
    <!--End : buttons-->
    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible filter-block-list">
      <!-- Filter Part -->
      <div class="col-span-12 xl:col-span-4 left-part bg-white mr-5 rounded-lg" v-if="!filterdiv">
        <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center py-4">
            <h2 class="text-lg font-medium truncate mr-5">{{ $t("commons.Filtri") }}</h2>
            <button class="text-primary w-45 ml-auto" @click="reset()">
              {{ $t("commons.reset") }}
            </button>
          </div>
          <div>
            <div class="border border-slate-200/60 rounded mb-2">
              <div class="w-56 relative">
                <input type="text" class="form-control w-56 box pr-10 text-slate-700"
                  :placeholder="$t('match_validati_details.Nome_Documento')" v-model="nomDocumento" />
                <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
              </div>
            </div>
            <!-- <div class="border border-slate-200/60 rounded mb-2 date-range"> -->
            <div class="w-56 relative">

              <!-- BEGIN: Dropdown with close button -->
              <PreviewComponent v-slot="{ toggle }">

                <div class="mb-3">
                  <Preview>
                    <!-- <div class="text-center"> -->
                    <Dropdown class="" placement="bottom-start" v-slot="{ dismiss }" refKey="dropDownRef">
                      <DropdownToggle class="btn bg-white w-full flex justify-between">
                        {{ documentoDaCercare['descrizione'] }} {{ documentoDaCercare['iddb'] }}
                        <ChevronDownIcon class="w-4 h-4 ml-2" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownContent>
                          <DropdownItem v-for="tipi in tipidocumento" :key="tipi.iddb"
                            @click="onChangeTipiDocumento(tipi.iddb, tipi.descrizione)">{{ tipi.descrizione }} - {{
                              tipi.iddb }}
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
            <div class="border border-slate-200/60 rounded mb-2 date-range">
              <div class="w-56 relative">
                <vue-tailwind-datepicker :clearable="true" :options="datepickerOptions" v-model="filterDateUploadRange"
                  :key="filterDateUploadRange" :placeholder="$t('documenti.Data_Upload')"
                  input-classes="form-control w-56 box pr-10 text-slate-700" use-range :formatter="datepickerFormatter"
                  :start-from="datepickerStartFrom" :disable-date="dDate" />
              </div>
            </div>
            <div class="border border-slate-200/60 rounded mb-2 date-range">
              <div class="w-56 relative">
                <vue-tailwind-datepicker :clearable="true" :options="datepickerOptions" v-model="filterDateDocumentoRange"
                  :key="filterDateDocumentoRange" :placeholder="$t('documenti.Data_Documento')"
                  input-classes="form-control w-56 box pr-10 text-slate-700" use-range :formatter="datepickerFormatter"
                  :start-from="datepickerStartFrom" :disable-date="dDate" />
              </div>
            </div>
            <button class="btn btn-sm btn-primary w-18 mt-3 float-right mb-2" @click="applyFilters">
              {{ $t("commons.applica") }}
            </button>
          </div>
        </div>
      </div>
      <!-- Filter Part -->

      <!-- Table Render -->
      <div :class="active ? 'active' : 'inactive'">
        <table class="table table-report -mt-2">
          <tbody>
            <tr v-for="item in items_t" :key="item">
              <td>
                <FileTextIcon class="w-6 h-6 mr-3 text-primary" />
              </td>
              <td>
                <strong>{{ item.nomefileoriginario }}</strong>
              </td>
              <td><span>{{ $t("match_validati_details.Tipo_doc") }}:</span><strong>{{ item?.codtipofile }}</strong></td>
              <td>
                <span>{{ $t("documenti.Data_Upload") }}: <strong>{{
                  moment(item?.dataupload).format("DD/MM/YYYY") }}</strong></span>
              </td>
              <td>
                <span>{{ $t("documenti.Data_Documento") }}:<strong>{{ (item.datacontenutodocumento != null) ?
                  moment(item?.datacontenutodocumento).format("DD/MM/YYYY") : '-' }}</strong></span>
              </td>
              <td>
                <button id="searchDiv" class="btn mr-2 mb-2" @click="openDoc(item.idfile)">
                  <SearchIcon class="w-4 h-4" /><span v-if="!active">{{ $t("documenti_da_validare.Visualizza") }}</span>
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
  </div>
  <!--Begin : Visualizza-->
  <DocOpened v-if="showDocumento" :idDoc="idDoc" theme="" @close="closeModal">
  </DocOpened>
  <!--End : Visualizza-->
</template>

<script setup>
import { ref, watch, onMounted, provide } from "vue";
import router from "@/router";
import moment from "moment";
import { useMatchStore } from "@/stores/match";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import DocOpened from '@/components/document/Main.vue'
const matchStore = useMatchStore();
const filterdiv = ref(true);
const active = ref(false);
const total = ref("");
const filterName = ref("Mostra Filtri");
const items_t = ref();
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
const filterDateUploadRange = ref("");
const filterDateDocumentoRange = ref("");
const codtipofile = ref("");
const showDocumento = ref(false)
const idDoc = ref("");
const tipidocumento = ref(null);
const documentoDaCercare = ref({
  iddb: "",
  descrizione: "Tipo Documento",
});
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
const dDate = (date) => {
  return date > new Date();
};
const datepickerFormatter = { date: "YYYY-MM-DD", month: "MMM" };
const dropDownRef = ref();
provide("bind[dropDownRef]", (el) => {
  // Binding
  dropDownRef.value = el;
});
onMounted(async () => {
  await matchStore.LoadTipoDocumenti();
  getMatchData();
  // debugger
  tipidocumento.value = matchStore.tipiDocumento
  tipidocumento.value.unshift({
    descrizione: "Tutti",
    iddb: "0",
  });


});
watch(
  filterdiv,
  (newValue) => {
    if (newValue == true) {
      active.value = false;
    } else {
      active.value = true;
    }
  },
  {
    immediate: true,
  }
);
function onChangeTipiDocumento(id, desc) {
  console.log(id + ' - ' + desc);
  documentoDaCercare.value.iddb = id
  documentoDaCercare.value.descrizione = desc
  dropDownRef.value.hide()
}
async function getMatchData() {
  let params = new URLSearchParams();
  params.append("page", currentPage.value);
  params.append("size", perPageRecords.value);
  if (documentoDaCercare.value.descrizione == 'Tipo Documento' || documentoDaCercare.value.iddb == '0') {
    params.append("codtipofile", -1);
  }
  else {
    params.append("codtipofile", documentoDaCercare.value.iddb);
  }
  if (nomDocumento.value != "") {
    if (nomDocumento.value != "") {
      params.append("nomedocumentolike", nomDocumento.value.toLowerCase());
    } else {
    }
  }
  if (filterDateUploadRange._rawValue.length > 0) {

    let dateSplit = filterDateUploadRange.value.toString().trim().split(' ~ ');

    params.append("datauploadmin", moment(dateSplit[0]).format("YYYY-MM-DDTHH:MM:SS"));
    params.append("datauploadmax", moment(dateSplit[1]).format("YYYY-MM-DDTHH:MM:SS"));

  }
  if (filterDateDocumentoRange._rawValue.length > 0) {
    let dateSplit = filterDateDocumentoRange.value.toString().trim().split(' ~ ');

    params.append("datacontenutodocmin", moment(dateSplit[0]).format("YYYY-MM-DDTHH:MM:SS"));
    params.append("datacontenutodocmax", moment(dateSplit[1]).format("YYYY-MM-DDTHH:MM:SS"));

  }
  var newObj = {
    params: params,
  };
  await matchStore.LoadDocumenti(newObj);
  items_t.value = matchStore.documenti.items;
  total.value = matchStore.documenti.total;
  totalPages.value =
    matchStore.documenti.total /
    matchStore.documenti.size;
  if (items_t.value.length > 0) {
    isRecord.value = true;
  } else {
    isRecord.value = false;
  }
  startPagenumber.value =
    matchStore.documenti.size *
    (matchStore.documenti.page - 1) +
    1;
  if (
    matchStore.documenti.page *
    matchStore.documenti.size >
    matchStore.documenti.total
  ) {
    endPagenumber.value = matchStore.documenti.total;
  } else {
    endPagenumber.value =
      startPagenumber.value + matchStore.documenti.size - 1;
  }
}
function onPerPage(p) {
  perPageRecords.value = p;
  getMatchData();
}
function applyFilters() {
  getMatchData();
}
function reset() {
  codtipofile.value = "";
  nomDocumento.value = "";
  filterDateUploadRange.value = "";
  filterDateDocumentoRange.value = "";
  documentoDaCercare.value = {
    iddb: "",
    descrizione: "Tipo Documento"
  };
  getMatchData();
}
function openDoc(anIdDocumento) {

  console.log("Documenti: " + anIdDocumento);
  idDoc.value = anIdDocumento;
  console.log("idDoc: " + idDoc.value);
  showDocumento.value = !showDocumento.value
}
function closeModal() {
  showDocumento.value = false
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

.date-range button svg {
  color: #475569 !important;
}
</style>
