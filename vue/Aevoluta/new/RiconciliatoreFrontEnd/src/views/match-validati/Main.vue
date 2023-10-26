<template>
  <!-- <h2 class="intro-y text-lg font-medium mt-10">Product List dofa</h2> -->
  <div class="intro-y flex items-center py-4">
    <h1 class="text-lg font-medium truncate mr-5">
      {{ $t("match_validata_page.Match_Validati") }}
    </h1>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="w-full intro-y col-span-12 flex flex-wrap sm:mt-0 sm:ml-auto md:ml-0 items-center mt-3">
      <button class="btn filter-btn bg-white intro-y flex items-center" v-on:click="filterdiv = !filterdiv">
        <SlidersIcon class="w-4 h-4 mr-2" />{{ filterName }}
      </button>
      <div class="hidden md:block mx-auto text-slate-500">
        {{ $t("commons.showing") }} {{ startPagenumber }}
        {{ $t("commons.to") }} {{ endPagenumber }} {{ $t("commons.of") }}
        {{ total }} {{ $t("commons.entries") }}
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 w-full filter-block-list">
      <div class="col-span-12 xl:col-span-4 left-part bg-white mr-5 rounded-lg" v-if="!filterdiv">
        <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center py-4">
            <h2 class="text-lg font-medium truncate mr-5">{{ $t("commons.Filtri") }}</h2>
            <button class="text-primary w-45 ml-auto" @click="reset(true)">
              {{ $t("commons.reset") }}
            </button>
          </div>
          <div>
            <div class="border border-slate-200/60 rounded mb-2">
              <!-- <div v-for="val in valute" :key="val"> -->
              <h1>{{ items_t.valuteFiltrate }}</h1>
              <!-- </div> -->

              <select id="update-profile-form-8" class="form-select w-56 box pr-10" :key="filtroMAValuta"
                v-model="filtroMAValuta">
                <option value="" disabled hidden selected>
                  {{ $t("match_validata_page.Valuta") }}
                </option>
                <option value="all">
                  {{ $t("match_validata_page.Tutte") }}
                </option>
                <option value="euro">
                  {{ $t("match_validata_page.Euro") }}
                </option>
                <option value="sterlina iglese">
                  {{ $t("match_validata_page.Sterlina_Inglese") }}
                </option>
              </select>
            </div>
            <div class="border border-slate-200/60 rounded mb-2">
              <select id="update-profile-form-8" class="form-select w-56 box pr-10" v-model="confidenza">
                <option value="" disabled hidden selected>
                  {{ $t("match_validata_page.Confidenza") }}
                </option>
                <option value="all">
                  {{ $t("match_validata_page.Tutte") }}
                </option>
                <option value="low">
                  {{ $t("match_validata_page.Bassa(0-40)") }}
                </option>
                <option value="medium">
                  {{ $t("match_validata_page.Media(40-60)") }}
                </option>
                <option value="high">
                  {{ $t("match_validata_page.Alta(60-100)") }}
                </option>
              </select>
            </div>
            <div class="border border-slate-200/60 rounded mb-2">
              <div class="w-56 relative">
                <input type="text" class="form-control w-56 box pr-10 text-slate-700" placeholder="Ragioni Sociali"
                  v-model="ragione" />
                <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
              </div>
            </div>
            <div class="mb-2" v-show="dateMovimentoFilter.length > 0">
              <div class="w-56 relative">
                {{ $t("match_validata_page.Data_Movimento") }}
              </div>
            </div>
            <div class="border border-slate-200/60 rounded mb-2 date-range">
              <div class="w-56 relative">
                <vue-tailwind-datepicker :clearable="true" :options="datepickerOptions" v-model="dateMovimentoFilter"
                  :key="'Data Movimento'" :placeholder="'Data Movimento'"
                  input-classes="form-control w-56 box pr-10 text-slate-700" use-range :formatter="datepickerFormatter"
                  :start-from="datepickerStartFrom" :disable-date="dDate" />
              </div>
            </div>
            <div class="mb-2" v-show="dateChiusuraFilter.length > 0">
              <div class="w-56 relative">
                {{ $t("match_validata_page.Data_Chiusura") }}
              </div>
            </div>
            <div class="border border-slate-200/60 rounded mb-2 date-range">
              <div class="w-56 relative">
                <vue-tailwind-datepicker :clearable="true" :options="datepickerOptions" v-model="dateChiusuraFilter"
                  :key="'Data Chiusura'" :placeholder="'Data Chiusura'"
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
      <div class="w-full overflow-x-auto">
        <table class="table table-report -mt-2">
          <tbody>
            <tr v-for="item in items_t" :key="item" class="intro-x">
              <td class="w-1/12">
                <div class="flex">
                  <div class="w-10 h-10 image-fit">
                    <img class="logo__image w-6" src="@/assets/images/big_match_valid.svg" />
                  </div>
                </div>
              </td>
              <!-- start Movimenti-->
              <template v-for="movi in item.movimenti" :key="movi">
                <td class="w-1/8">
                  <div class="font-medium whitespace-nowrap">
                    {{ movi.ragionesociale }}
                  </div>
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.Importo") }}:
                    <b>{{
                      currencyFormatter(movi.valuta_importo, movi.valuta)
                    }}</b>
                  </div>
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.Valuta") }}:
                    <b>{{ movi.valuta }}</b>
                  </div>
                </td>
                <td class="w-1/8">
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.Data_doc") }}:
                    <b>{{
                      moment(movi.dataoperazione).format("DD/MM/YYYY")
                    }}</b>
                  </div>
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.ID_Movimento") }}:
                    <b>{{ movi.iddbmovimento }}</b>
                  </div>
                </td>
              </template>
              <!--end Movimenti-->
              <!--start Confidenza-->
              <td class="text-center w-1/8">
                <div class="btn btn-rounded-primary nonclickCursor w-54 mr-1 mb-2"
                  :class="returnClassNameConfidenza(item.score)">
                  <span v-if="!active">
                    {{ $t("match_validata_page.Confidenza") }} {{ item.score }}%
                  </span>
                  <span v-if="active"> {{ item.score }}% </span>
                </div>
              </td>
              <!--end Confidenza-->
              <!--start Partite-->
              <!-- <template v-for="par in item.partite" :key="par"> -->
              <td class="w-1/8">
                <template v-for="par in item.partite" :key="par">
                  <div class="font-medium whitespace-nowrap">
                    {{ par.ragionesociale }}
                  </div>
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.Importo") }}:
                    <b>{{ currencyFormatter(par.valutalordo, par.valuta) }}</b>
                  </div>
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.Valuta") }}:
                    <b>{{ par.valuta }}</b>
                  </div>
                </template>
              </td>
              <td class="w-1/8">
                <template v-for="par in item.partite" :key="par">
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.Data_doc") }}:
                    <b>{{ moment(par.datadocumento).format("DD/MM/YYYY") }}</b>
                  </div>
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.ID_Partita") }}:
                    <b>{{ par.numerodocumento }}</b>
                  </div>
                </template>
              </td>
              <!-- </template> -->
              <!--end Partite-->
              <td class="w-1/8 border border-t-0 border-r-0">
                <div class="font-medium whitespace-nowrap">
                  {{ $t("match_validata_page.Saldo") }}:
                  <b>{{
                    currencyFormatter(
                      item.differenzamonetizzatainvalutaconimportoscontato,
                      item.movimenti[0].valuta
                    )
                  }}</b>
                </div>
                <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                  {{ $t("match_validata_page.Stato_del_robot") }}: <b>OK</b>
                </div>
                <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                  {{ $t("match_validata_page.ID_match") }}:
                  <b>{{ item.idmatch }}</b>
                </div>
                <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                  {{ $t("match_validata_page.Data_Chiusura") }}:
                  <b>{{
                    moment(item.datachiusuramatch).format("DD/MM/YYYY")
                  }}</b>
                </div>
              </td>
              <td class="w-1/8">
                <button id="searchDiv" class="btn mr-2 mb-2" @click="loadDetailPage(item.idmatch)" v-if="!active">
                  <SearchIcon class="w-4 h-4" />{{
                    $t("match_validata_page.Visualizza")
                  }}
                </button>
                <button id="searchDiv" class="btn mr-2 mb-2" @click="loadDetailPage(item.idmatch)" v-if="active">
                  <SearchIcon class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
        <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">
          {{ $t("match_validata_page.Are_you_sure") }}
        </div>
        <div class="text-slate-500 mt-2">
          {{
            $t("match_validata_page.Do_you_really_want_to_delete_these_records")
          }}
          <br />
          {{ $t("match_validata_page.This_process_cannot_be_undone") }}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button type="button" @click="deleteConfirmationModal = false" class="btn btn-outline-secondary w-24 mr-1">
          {{ $t("commons.cancel") }}
        </button>
        <button type="button" class="btn btn-danger w-24">
          {{ $t("commons.Delete") }}
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Delete Confirmation Modal -->
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import router from "@/router";
import moment from "moment";
import { useMatchStore } from "@/stores/match";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import VueTailwindDatepicker from "vue-tailwind-datepicker";

const matchStore = useMatchStore();
const deleteConfirmationModal = ref(false);
const filterdiv = ref(true);
const confidenza = ref("");
const active = ref(false);
const items_t = ref([]);
const item_store = ref([]);
const total = ref("");
const movimento = ref([]);
const chiusura = ref([]);
const filtroMAValuta = ref("");
const ragione = ref("");
const filterName = ref("Mostra Filtri");
const currentPage = ref(1);
const perPageRecords = ref(10);
const totalPages = ref(1);
const perPageOption = ref([10, 20, 30, 40]);
const dateMovimentoFilter = ref([]);
const dateChiusuraFilter = ref([]);
const isRecord = ref(false);
const startPagenumber = ref(1);
const endPagenumber = ref(1);
let datepickerStartFrom = new Date();
datepickerStartFrom.setMonth(datepickerStartFrom.getMonth() - 1);
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
function loadDetailPage(matchId) {
  console.log(matchId);
  //return
  router.push({ name: "Detail", params: { id: matchId } });
}
onMounted(async () => {
  getMatchData();
});
const valute = computed(() => {
  matchStore.getRelevantValute;
  console.log(items_t);
  return matchStore.getRelevantValute;
});
watch(confidenza, (newValue, old) => {
  if (newValue == "all") {
    reset(false);
  } else {
  }
});
watch(filtroMAValuta, (newValue, old) => {
  if (newValue == "all") {
    reset(false);
  } else {
  }
});
watch(
  filterdiv,
  (newValue) => {
    movimento.value = "";
    chiusura.value = "";

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
async function getMatchData() {
  let params = new URLSearchParams();
  params.append("page", currentPage.value);
  params.append("size", perPageRecords.value);
  if (filtroMAValuta.value != "") {
    if (filtroMAValuta.value == "euro") {
      params.append("valuta", "EUR");
    } else if (filtroMAValuta.value == "sterlina iglese") {
      params.append("valuta", "GBP");
    }
  }
  if (confidenza.value != "") {
    if (confidenza.value == "low") {
      params.append("minscoring", 0);
      params.append("maxscoring", 40);
    } else if (confidenza.value == "medium") {
      params.append("minscoring", 40);
      params.append("maxscoring", 60);
    } else if (confidenza.value == "high") {
      params.append("minscoring", 60);
      params.append("maxscoring", 100);
    }
  }
  if (ragione.value != "") {
    if (ragione.value != "") {
      params.append("ragionesociale", ragione.value.toLowerCase());
    } else {
    }
  }
  if (dateMovimentoFilter._rawValue.length > 0) {
    let d1 = dateMovimentoFilter._rawValue[0];
    let d2 = dateMovimentoFilter._rawValue[1];
    params.append("movementdatefrom", d1);
    params.append("movementdateto", d2);
  }
  if (dateChiusuraFilter._rawValue.length > 0) {
    let d1 = dateChiusuraFilter._rawValue[0];
    let d2 = dateChiusuraFilter._rawValue[1];
    params.append("closedatefrom", d1);
    params.append("closedateto", d2);
  }
  var newObj = {
    params: params,
    soloAperti: false,
  };
  await matchStore.LoadMatches(newObj);
  items_t.value = matchStore.matchesChiusi.items;
  item_store.value = matchStore.matchesChiusi.items;
  total.value = matchStore.matchesChiusi.total;
  totalPages.value =
    matchStore.matchesChiusi.total / matchStore.matchesChiusi.size;
  if (items_t.value.length > 0) {
    isRecord.value = true;
  } else {
    isRecord.value = false;
  }
  startPagenumber.value =
    matchStore.matchesChiusi.size * (matchStore.matchesChiusi.page - 1) + 1;
  if (
    matchStore.matchesChiusi.page * matchStore.matchesChiusi.size >
    matchStore.matchesChiusi.total
  ) {
    endPagenumber.value = matchStore.matchesChiusi.total;
  } else {
    endPagenumber.value =
      startPagenumber.value + matchStore.matchesChiusi.size - 1;
  }
}
function reset(isReset) {
  filtroMAValuta.value = "";
  confidenza.value = "";
  ragione.value = "";
  dateMovimentoFilter.value = "";
  dateChiusuraFilter.value = "";
  if (isReset) {
    getMatchData();
  }
}
function onPerPage(p) {
  perPageRecords.value = p;
  getMatchData();
}
function applyFilters() {
  getMatchData();
}

function returnClassNameConfidenza(value) {
  if (value > 0 && value <= 40) {
    return "lightblue";
  } else if (value > 40 && value <= 60) {
    return "intermediateblue";
  } else if (value > 60 && value <= 100) {
    return "deepblue";
  } else {
    return "commoncolor";
  }
}
function currencyFormatter(data, cFormate) {
  let newCurrency = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: cFormate,
    //maximumFractionDigits: 0,
  }).format(data);
  return newCurrency;
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
</style>
