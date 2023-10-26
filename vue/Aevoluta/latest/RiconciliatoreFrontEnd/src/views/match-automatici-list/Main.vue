<template>
  <div class="intro-y block md:flex md:justify-between items-center py-4">
    <div class="flex justify-between items-center">
      <button class="btn btn-secondary mr-1 bg-white" @click="backValidare">
        <ArrowLeftIcon class="block mx-auto" />
      </button>
      <h1 class="text-lg font-medium truncate ml-2">{{ $t("automatici_da_validar.match_con_confidenza") }}</h1>
    </div>

    <button
      :class="(mutilpleValidMatchBtn) ? 'btn btn-primary w-45 mr-2 mb-2 h-10 ml-auto' : 'btn btn-secondary w-full md:w-56 mr-2 mb-2 h-10 ml-auto mt-4 md:mt-0'"
      @click="multiMatchValida()">
      <CheckIcon class="w-4 h-4 mr-2" /> {{ $t("automatici_da_validar.valida_match_selezionati") }}
    </button>
  </div>
  <div class="grid grid-cols-12 gap-6">
    <div class="w-full intro-y col-span-12 flex flex-wrap sm:mt-0 sm:ml-auto md:ml-0 items-center mt-3">
      <button class="btn bg-white i ntro-y flex items-center w-full md:w-40" v-on:click="filterdiv = !filterdiv">
        <SlidersIcon class="w-4 h-4 mr-2" />{{ filterName }}
      </button>
      <div class="hidden md:block mx-auto text-slate-500">
        {{ $t("commons.showing") }} {{ startPagenumber }} {{ $t("commons.to") }} {{ endPagenumber }} {{ $t("commons.of")
        }}
        {{ total }} {{ $t("commons.entries") }}
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12  block justify-between md:flex md:justify-between">
      <div class="col-span-12 xl:col-span-4 left-part bg-white mr-5 rounded-lg md:w-1/5 w-full h-80 mb-5"
        v-if="!filterdiv">
        <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center py-4">
            <h2 class="text-lg font-medium truncate mr-5">
              {{ $t("commons.Filtri") }}
            </h2>
            <a class="text-primary w-45 ml-auto" @click="reset()"> {{ $t("commons.reset") }} </a>
          </div>
          <div>
            <div class="border border-slate-200/60 rounded mb-2">
              <!-- <div v-for="val in valute" :key="val"> -->
              <h1>{{ items_t.valuteFiltrate }}</h1>
              <!-- </div> -->

              <select id="update-profile-form-8" class="form-select box pr-10 font-medium text-slate-900"
                :key="filtroMAValuta" v-model="filtroMAValuta">
                <option value="" disabled hidden selected>{{ $t("match_validata_page.Valuta") }}</option>
                <option value="all">{{ $t("match_validata_page.Tutte") }}</option>
                <option value="euro">{{ $t("match_validata_page.Euro") }}</option>
                <option value="sterlina iglese">{{ $t("match_validata_page.Sterlina_Inglese") }}</option>
              </select>
            </div>
            <div class="border border-slate-200/60 rounded mb-2">
              <div class="relative w-full">
                <input type="text" class="form-control w-56 box pr-10 text-slate-900"
                  :placeholder="$t('match_validata_page.Ragione_Sociale')" v-model="ragione" />
                <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
              </div>
            </div>
            <div class="border border-slate-200/60 rounded mb-2">
              <div class="w-56 relative p-2">
                <input id="horizontal-form-3" class="form-check-input border-2 border-b-green-600" type="checkbox"
                  v-model="saldo_zero" />
                <label class="form-check-label font-medium text-slate-900" for="horizontal-form-3">{{
                  $t("automatici_da_validar.saldo_filter")
                }}</label>
              </div>
            </div>
            <button class="btn btn-sm btn-primary w-18 mt-3 float-right mb-2" @click="applyFilters">
              {{ $t("commons.applica") }}
            </button>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto w-full" :class="active ? '' : 'inactive'">
        <table class="table table-report -mt-2">
          <tbody>
            <tr v-for="(item, index) in items_t" :key="item" class="intro-x">
              <!-- Icon -->
              <td>
                <div class="flex">
                  <div class="w-16 h-10 image-fit zoom-in flex justify-between items-center">
                    <input v-if="item.differenzamonetizzatainvalutaconimportoscontato === 0"
                      class="form-check-input border-2" type="checkbox" :id="'Partite' + index"
                      @click="checkMatch(item.idmatch)" />

                    <div class="w-7 h-7 image-fit">
                      <img class="logo__image w-4" src="@/assets/images/big_match_automatic.svg" />
                    </div>
                    <!-- <BoxIcon
                      class="intro-y flex report-box__icon truncate text-danger"
                    /> -->
                  </div>
                </div>
              </td>
              <!-- MOVIMENTI -->
              <template v-for="movi in item.movimenti" :key="movi">
                <td>
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
                    {{ $t("match_validata_page.Valuta") }}: <b>{{ movi.valuta }}</b>
                  </div>
                </td>
                <td>
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.Data_Movimento") }}:
                    <b>{{
                      moment(movi.dataoperazione).format("DD/MM/YYYY")
                    }}</b>
                  </div>
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.ID_Movimento") }} : 855
                  </div>
                </td>
              </template>
              <!--end Movimenti-->
              <!--start Confidenza-->
              <td>
                <div class="btn btn-rounded-primary nonclickCursor w-36 mr-1 mb-2"
                  :class="returnClassNameConfidenza(item.score)">
                  <span v-if="!active"> {{ $t("match_validata_page.Confidenza") }} {{ item.score }}% </span>
                  <span v-if="active"> {{ item.score }}% </span>
                </div>
              </td>
              <!--end Confidenza-->
              <!--start Partite-->
              <!-- <template v-for="par in item.partite" :key="par"> -->
              <td class="w-40">
                <template v-for="par in item.partite" :key="par">
                  <div class="font-medium whitespace-nowrap">
                    {{ par.ragionesociale }}
                  </div>
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.Importo") }}:
                    <b>{{ currencyFormatter(par.valutalordo, par.valuta) }}</b>
                  </div>
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.Valuta") }}: <b>{{ par.valuta }}</b>
                  </div>
                </template>
              </td>
              <td class="w-40">
                <template v-for="par in item.partite" :key="par">
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.Data_doc") }}:
                    <b>{{ moment(par.datadocumento).format("DD/MM/YYYY") }}</b>
                  </div>
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ $t("match_validata_page.ID_Partita") }}: <b>{{ par.numerodocumento }}</b>
                  </div>
                </template>
              </td>
              <!-- </template> -->
              <!--end Partite-->
              <td class="w-40 border border-t-0 border-r-0">
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
                  {{ $t("match_validata_page.ID_match") }}: <b>{{ item.idmatch }}</b>
                </div>
                <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                  {{ $t("match_validata_page.Data_Chiusura") }}:
                  <b>{{
                    moment(item.datachiusuramatch).format("DD/MM/YYYY")
                  }}</b>
                </div>
              </td>
              <td>
                <button id="searchDiv" class="btn mr-2 mb-2" @click="loadDetailPage(item.idmatch)">
                  <SearchIcon class="w-4 h-4" /><span v-if="!active">{{ $t("match_validata_page.Visualizza") }}</span>
                </button>
              </td>
              <td>
                <button class="btn btn-primary w-36 mr-2 mb-2 h-10 ml-auto" @click="setMatchValidaModal(item)">
                  <CheckCircleIcon class="w-4 h-4 mr-2" /><span v-if="!active">{{
                    $t("movimento_da_associare.valida_match")
                  }}</span>
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
    <!-- END: Data List-->
  </div>
  <!--BEGIN: Manual Match Valida functionality-->
  <Modal class="validaMatch" :show="manualMatchModal" @hidden="manualMatchModal = false">
    <ModalBody class="p-0">

      <div class="flex justify-between items-center border-b p-4">
        <h4 class="text-xl">{{ $t("movimento_da_associare.valida_match") }}</h4>
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
          <input id="tabulator-html-filter-value" type="number" class="form-control sm:w-1/3 mt-2 sm:mt-0" placeholder=""
            v-model="add.differenzeValue" :disabled="!(add.nomeconto['codicesapconto'] != '')" />
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
        <button type="button" :disabled="!btnValidaDisable" class="btn btn-primary w-24" @click="matchValida()">{{
          $t("documenti_da_validare.Valida") }}</button>
      </div>
    </ModalBody>
  </Modal>
  <!--END: Manual Match Valida-->
  <!--BEGIN: Auto Match Valida-->
  <Modal :show="autoMatchModal" @hidden="autoMatchModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <CheckCircleIcon class="w-16 h-16 text-primary mx-auto mt-3" />
        <div class="text-3xl mt-5">{{ $t("movimento_da_associare.valida_match") }}</div>
        <div class="text-slate-500 mt-2">
          {{$t("automatici_da_validar.valida_match_heading1")}}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button type="button" @click="autoMatchModal = false" class="btn btn-outline-secondary w-24 mr-1">
          {{ $t("match_validati_details.Annula") }}
        </button>
        <button type="button" class="btn btn-primary w-24" @click="matchValida()">{{ $t("documenti_da_validare.Valida")
        }}</button>
      </div>
    </ModalBody>
  </Modal>
  <!--END: Auto Match Valida-->
</template>
<script setup>
import router from "@/router";
import { ref, watch, onMounted, computed, onBeforeMount } from "vue";
import { useMatchStore } from "@/stores/match";
import moment from "moment";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";

const filterName = ref("Mostra Filtri");
const filterdiv = ref(true);
const active = ref(false);
const items_t = ref([]);
const matchStore = useMatchStore();
const filtroMAValuta = ref("");
const ragione = ref("");
const saldo_zero = ref(false);

const total = ref("");
const currentPage = ref(1);
const perPageRecords = ref(10);
const totalPages = ref(1);
const perPageOption = ref([10, 20, 30, 40]);
const isRecord = ref(false);
const startPagenumber = ref(1);
const endPagenumber = ref(1);
const confidence = ref('')
const manualMatchModal = ref(false)
const autoMatchModal = ref(false)
const addDifferenze = ref([]);
const differenzePartiteCodici = ref([])
const saldoFinal = ref('')
const btnValidaDisable = ref(false)
const saldo = ref('')
const detail = ref([])
const mutilpleValidMatchBtn = ref(false)
const selectedPartite = ref([])
saldoFinal.value = computed(() => {
  let final = Number(saldo.value) + Number(differenzaTotale())
  if (final == 0) {

    btnValidaDisable.value = true
  } else {
    btnValidaDisable.value = false
  }

  return final
})
onBeforeMount(async () => {
  await matchStore.LoadContiDifferenzeIncassiPartite()
  differenzePartiteCodici.value = matchStore.contiDifferenzeIncassiPartite;
  console.log("###########:    ", differenzePartiteCodici.value)
})
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
function backValidare() {
  router.push({ name: "top-menu-home" });
}
function loadDetailPage(matchId) {
  router.push({ name: "match-validare-detail/" + confidence.value, params: { id: matchId } });

}
async function getMatchData() {
  let queryString = window.location.search;
  let params = new URLSearchParams(queryString);
  let getScore = "";
  if (params.has("match")) {
    getScore = params.get("match");
    let minscoring = 0;
    let maxscoring = 0;
    if (getScore === "elevata") {
      minscoring = 60;
      maxscoring = 100;
    }
    if (getScore === "intermedia") {
      minscoring = 40;
      maxscoring = 60;
    }
    if (getScore === "bassa") {
      minscoring = 0;
      maxscoring = 40;
    }
    params.append("minscoring", minscoring);
    params.append("maxscoring", maxscoring);
  }
  params.append("page", currentPage.value);
  params.append("size", perPageRecords.value);
  params.append("saldo_zero", saldo_zero.value);

  if (filtroMAValuta.value != "") {
    if (filtroMAValuta.value == "euro") {
      params.append("valuta", "EUR");
    } else if (filtroMAValuta.value == "sterlina iglese") {
      params.append("valuta", "GBP");
    }
  }
  if (ragione.value != "") {
    if (ragione.value != "") {
      params.append("ragionesociale", ragione.value.toLowerCase());
    } else {
    }
  }
  var newObj = {
    params: params,
    soloAperti: true,
  };

  await matchStore.LoadMatches(newObj);
  items_t.value = matchStore.matches.items;
  total.value = matchStore.matches.total;
  totalPages.value =
    matchStore.matches.total / matchStore.matches.size;
  if (items_t.value.length > 0) {
    isRecord.value = true;
  } else {
    isRecord.value = false;
  }
  startPagenumber.value =
    matchStore.matches.size * (matchStore.matches.page - 1) + 1;
  if (
    matchStore.matches.page * matchStore.matches.size >
    matchStore.matches.total
  ) {
    endPagenumber.value = matchStore.matches.total;
  } else {
    endPagenumber.value =
      startPagenumber.value + matchStore.matches.size - 1;
  }
  // debugger

}
onMounted(async () => {
  var pathname = window.location.pathname.split('/')
  var path = window.location.href.split('?')
  if (path[1] && path[1] == 'match=intermedia') {
    confidence.value = 'intermedia'
  } else if (path[1] && path[1] == 'match=bassa') {
    confidence.value = 'bassa'
  } else {
    confidence.value = 'elevata'
  }
  getMatchData();
});
watch(filtroMAValuta, (newValue, old) => {
  if (newValue == "all") {
    reset(false);
  } else {
  }
});
function currencyFormatter(data, cFormate) {
  let newCurrency = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: cFormate,
    maximumFractionDigits: 0,
  }).format(data);
  return newCurrency;
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
function reset(isReset) {
  filtroMAValuta.value = "";
  ragione.value = "";
  if (isReset) {
    getMatchData();
  }
}
function applyFilters() {
  getMatchData();
}
function onPerPage(p) {
  perPageRecords.value = p;
  getMatchData();
}
function onChangeCodice(id, name, add) {
  console.log(id, name, add)

  add.nomeconto.nomecontoD = name
  add.nomeconto.codicesapconto = id
}
function AddDifferenzeItem() {
  addDifferenze.value.push({ nomeconto: { nomecontoD: "Codice", codicesapconto: "" }, differenzeValue: '' })
}
function RemoveDifferenzeItem(item) {
  let rindex = addDifferenze.value.indexOf(item)
  addDifferenze.value.splice(rindex, 1)
  console.log("Removed!! Remaining array length:    ", addDifferenze.value.length)
}
function setMatchValidaModal(item) {
  detail.value = item
  saldo.value = item.differenzamonetizzatainvalutaconimportoscontato

  if (saldo.value != "" && saldo.value != 0) {
    manualMatchModal.value = true
    autoMatchModal.value = false
  } else {
    autoMatchModal.value = true
    manualMatchModal.value = false
  }
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
function multiMatchValida() {
  //get the selected data for multiMatchValida
  if (selectedPartite.value != undefined) {
    let items = items_t.value.filter(function (item) {
      return selectedPartite.value.indexOf(item.idmatch) !== -1;
    });
    console.log("--Selected data--", items.length, "--data--", items)


    items.forEach(async function (detail) {

      let differenze = [];
      let listaPartite = [];
      let listaMovimenti = [];
      listaMovimenti.push(detail.movimenti[0].artificial_id_movimento)

      for (const item of detail.partite) {

        listaPartite.push(item.iddb);
      }
      let creaEChiudi = {
        listaPartite: listaPartite,
        listaMovimenti: listaMovimenti,
        differenze: differenze
      }
      await matchStore.CreaESalvaMatch(creaEChiudi)
      console.log("********************************")
    });

  }
  for (var i = 0; i < items_t.value.length; i++) {
    document.getElementById("Partite" + i).checked = false;
  }
  selectedPartite.value = []
  mutilpleValidMatchBtn.value = false
  getMatchData()
}
async function matchValida() {
  let differenze = [];
  if (saldo.value != "" && saldo.value != 0) {
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
  getMatchData()
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
function checkMatch(idmatch) {

  if (selectedPartite.value.includes(idmatch)) {
    const index = selectedPartite.value.indexOf(idmatch)
    if (index > -1) {
      selectedPartite.value.splice(index, 1)

    }
  } else {
    selectedPartite.value[selectedPartite.value.length] = idmatch


  }

  console.log(selectedPartite.value)
  if (selectedPartite.value.length == 0) {
    mutilpleValidMatchBtn.value = false

  } else {
    mutilpleValidMatchBtn.value = true

  }
}
</script>
<style>
.active {
  width: 88%;
}

.inactive {
  /* display: contents; */
  display: block;
  width: 100%;
}

.filter-block-list .table {
  margin: -8px 0;
}

/* .filter-block-list {
  display: flex;
  justify-content: space-between;
} */
</style>
