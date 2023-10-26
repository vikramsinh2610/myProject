<template>
  <!-- Title -->
  <div class="intro-y flex items-center py-4">
    <h1 class="text-lg font-medium truncate mr-5">
      {{ $t("Ragioni_Sociali.Ragioni_Sociali") }}
    </h1>
  </div>
  <!-- End Title -->
  <div class="grid grid-cols-12 gap-6 mt-5">
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
    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible filter-block-list">
      <!-- Filter Part -->
      <div class="col-span-12 xl:col-span-4 left-part bg-white -ml-5 mr-5 rounded-lg" v-if="!filterdiv">
        <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center py-4">
            <h2 class="text-lg font-medium truncate mr-5">
              {{ $t("commons.Filtri") }}
            </h2>
            <button class="text-primary w-45 ml-auto" @click="reset()">
              {{ $t("commons.reset") }}
            </button>
          </div>
          <div>
            <div class="border border-slate-200/60 rounded mb-2">
              <div class="w-56 relative">
                <input type="text" class="form-control w-56 box pr-10 text-slate-700" :placeholder="$t('Ragioni_Sociali.Ragioni_Sociali')"
                  v-model="ragionesocialelike" />
                <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
              </div>
            </div>
            <div class="border border-slate-200/60 rounded mb-2">
              <div class="w-56 relative">
                <input type="text" class="form-control w-56 box pr-10 text-slate-700" :placeholder="$t('Ragioni_Sociali.Indirizzo')"
                  v-model="stato" />
                <MapPinIcon class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
              </div>
            </div>
            <button class="btn btn-sm btn-primary w-18 mt-3 float-right mb-2" @click="applyFilters">
              {{ $t("commons.applica") }}
            </button>
          </div>
        </div>
      </div>
      <div :class="active ? 'active' : 'inactive'">
        <table class="table table-report -mt-2">
          <tbody>
            <tr v-for="item in items_t" :key="item">
              <td>
                <FileTextIcon class="w-6 h-6 mr-3 text-primary" />
              </td>
              <td>
                <strong>{{ item.ragionesociale }}</strong>
              </td>
              <td>
                <span>{{ $t("match_validati_details.SAP_ID") }}:</span><strong>{{ item.sapid }}</strong>
              </td>
              <td>
                <span>{{ $t("Ragioni_Sociali.Indirizzo") }}:
                  <strong>{{ item.stato }}</strong></span>
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
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useMatchStore } from "@/stores/match";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
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
const ragionesocialelike = ref("");
const stato = ref("");
onMounted(async () => {
  getMatchData();
});
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
async function getMatchData() {
  let params = new URLSearchParams();
  params.append("page", currentPage.value);
  params.append("size", perPageRecords.value);
  if (ragionesocialelike.value != "") {
    params.append("ragionesocialelike", ragionesocialelike.value);
  }
  if (stato.value != "") {
    params.append("stato", stato.value);
  }
 
  var newObj = {
    params: params,
    soloAperti: false,
  };
 
  await matchStore.LoadStakeholders(newObj);
  items_t.value = matchStore.stakeholders.items;
  total.value = matchStore.stakeholders.total;
  totalPages.value =
    matchStore.stakeholders.total / matchStore.stakeholders.size;
  if (items_t.value.length > 0) {
    isRecord.value = true;
  } else {
    isRecord.value = false;
  }
  startPagenumber.value =
    matchStore.stakeholders.size * (matchStore.stakeholders.page - 1) + 1;
  if (
    matchStore.stakeholders.page * matchStore.stakeholders.size >
    matchStore.stakeholders.total
  ) {
    endPagenumber.value = matchStore.stakeholders.total;
  } else {
    endPagenumber.value =
      startPagenumber.value + matchStore.stakeholders.size - 1;
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

  ragionesocialelike.value = "";
  stato.value = "";

  getMatchData();
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
