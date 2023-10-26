<template>
  <!-- <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 2xl:col-span-9"> -->
  <div class="intro-y flex items-center py-4">
    <h2 class="text-lg font-medium truncate mr-5">{{ $t("daily_report") }}</h2>
    <!-- <button class="btn btn-primary w-45 mr-2 mb-2 h-10 ml-auto">
      <DownloadIcon class="w-4 h-4 mr-2" />
      {{ $t("export_everything_to_excel") }}
    </button> -->
  </div>
  <div class="dashboard-main block justify-between md:flex md:justify-between">
    <!-- BEGIN: Match associati -->
    <div class="col-span-full w-full lg:w-3/4 md:w-3/5">
      <div class="col-span-12 sm:col-span-6 lg:col-span-3">
        <div class="grid grid-cols-12 gap-5">
          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box h-full zoom-in">
              <div class="box p-5 h-full" @click="automaticiList('elevata')">
                <div class="ml-auto intro-y flex">
                  <div class="w-10 h-10 image-fit">
                    <img class="logo__image w-6" src="@/assets/images/big_match_automatic.svg" />
                  </div>
                  <!-- <div class="truncate ml-auto">
                    <MoreVerticalIcon class="w-4 h-4 ml-0.5" />
                  </div> -->
                </div>
                <div class="text-3xl font-medium leading-8 mt-6">
                  {{ homeReport?.high_confidence }}
                </div>
                <div class="text-base text-slate-500 mt-1">
                  {{ $t("home-page.match_con_confidenza_elevata") }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box h-full zoom-in">
              <div class="box p-5 h-full" @click="automaticiList('intermedia')">
                <div class="ml-auto intro-y flex">
                  <div class="w-10 h-10 image-fit">
                    <svg width="40px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>276B0B75-1E37-4E15-B457-BFF69570522E</title>
                      <g id="Styleguide" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="10.03-Icone" transform="translate(-1058.000000, -343.000000)" fill="#3584f1"
                          fill-rule="nonzero">
                          <g id="icon-/-big-/big_match_automatic" transform="translate(1058.000000, 343.000000)">
                            <path
                              d="M22.4,3 C25.0887547,3 27.2818181,5.12230671 27.3953805,7.78311038 L27.4,8 L27.4,12.6 L32,12.6 C34.6887547,12.6 36.8818181,14.7223067 36.9953805,17.3831104 L37,17.6 L37,32 C37,34.6887547 34.8776933,36.8818181 32.2168896,36.9953805 L32,37 L17.6,37 C14.9112453,37 12.7181819,34.8776933 12.6046195,32.2168896 L12.6,32 L12.6,27.4 L8,27.4 C5.3112453,27.4 3.11818189,25.2776933 3.00461951,22.6168896 L3,22.4 L3,8 C3,5.3112453 5.12230671,3.11818189 7.78311038,3.00461951 L8,3 L22.4,3 Z M32,14.6 L17.6,14.6 C16.0023191,14.6 14.6963391,15.84892 14.6050927,17.4237272 L14.6,17.6 L14.6,32 C14.6,33.5976809 15.84892,34.9036609 17.4237272,34.9949073 L17.6,35 L32,35 C33.5976809,35 34.9036609,33.75108 34.9949073,32.1762728 L35,32 L35,17.6 C35,16.0023191 33.75108,14.6963391 32.1762728,14.6050927 L32,14.6 Z M26.0176589,18.1382498 L30.709645,30.5366742 C30.8841255,30.9977334 30.6518076,31.5129401 30.1907484,31.6874206 C30.0897997,31.7256231 29.982759,31.7451995 29.8748235,31.7451995 L29.2914449,31.7451995 C28.8668387,31.7451995 28.488528,31.4770567 28.3478907,31.0764177 L27.4177452,28.4266755 L27.4177452,28.4266755 L21.8966609,28.4266755 L20.9751954,31.0739363 C20.8352945,31.4758552 20.4563453,31.7451995 20.0307738,31.7451995 L19.4542663,31.7451995 C18.9628484,31.7451995 18.5644755,31.3468266 18.5644755,30.8554087 C18.5644755,30.7479927 18.5839252,30.6414642 18.6218834,30.5409784 L23.3067677,18.1388119 C23.4537593,17.7496851 23.8262851,17.4921875 24.2422493,17.4921875 L25.0823899,17.4921875 C25.4981343,17.4921875 25.8705113,17.749417 26.0176589,18.1382498 Z M24.657203,20.5170369 L22.591691,26.4296875 L26.7227151,26.4296875 L24.657203,20.5170369 Z M22.4,5 L8,5 C6.40231912,5 5.09633912,6.24891996 5.00509269,7.82372721 L5,8 L5,22.4 C5,23.9976809 6.24891996,25.3036609 7.82372721,25.3949073 L8,25.4 L12.6,25.4 L12.6,17.6 C12.6,14.9112453 14.7223067,12.7181819 17.3831104,12.6046195 L17.6,12.6 L25.4,12.6 L25.4,8 C25.4,6.40231912 24.15108,5.09633912 22.5762728,5.00509269 L22.4,5 Z"
                              id="Shape"></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <!-- <div class="truncate ml-auto">
                    <MoreVerticalIcon class="w-4 h-4 ml-0.5" />
                  </div> -->
                </div>
                <div class="text-3xl font-medium leading-8 mt-6">
                  {{ homeReport?.medium_confidence }}
                </div>
                <div class="text-base text-slate-500 mt-1">
                  {{ $t("home-page.match_con_confidenza_intermedia") }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box h-full zoom-in">
              <div class="box p-5 h-full" @click="automaticiList('bassa')">
                <div class="ml-auto intro-y flex">
                  <div class="w-10 h-10 image-fit">
                    <!-- <img class="logo__image w-6 text-black" src="@/assets/images/big_match_automatic.svg" /> -->
                    <svg width="40px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>276B0B75-1E37-4E15-B457-BFF69570522E</title>
                      <g id="Styleguide" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="10.03-Icone" transform="translate(-1058.000000, -343.000000)" fill="#73b6ff"
                          fill-rule="nonzero">
                          <g id="icon-/-big-/big_match_automatic" transform="translate(1058.000000, 343.000000)">
                            <path
                              d="M22.4,3 C25.0887547,3 27.2818181,5.12230671 27.3953805,7.78311038 L27.4,8 L27.4,12.6 L32,12.6 C34.6887547,12.6 36.8818181,14.7223067 36.9953805,17.3831104 L37,17.6 L37,32 C37,34.6887547 34.8776933,36.8818181 32.2168896,36.9953805 L32,37 L17.6,37 C14.9112453,37 12.7181819,34.8776933 12.6046195,32.2168896 L12.6,32 L12.6,27.4 L8,27.4 C5.3112453,27.4 3.11818189,25.2776933 3.00461951,22.6168896 L3,22.4 L3,8 C3,5.3112453 5.12230671,3.11818189 7.78311038,3.00461951 L8,3 L22.4,3 Z M32,14.6 L17.6,14.6 C16.0023191,14.6 14.6963391,15.84892 14.6050927,17.4237272 L14.6,17.6 L14.6,32 C14.6,33.5976809 15.84892,34.9036609 17.4237272,34.9949073 L17.6,35 L32,35 C33.5976809,35 34.9036609,33.75108 34.9949073,32.1762728 L35,32 L35,17.6 C35,16.0023191 33.75108,14.6963391 32.1762728,14.6050927 L32,14.6 Z M26.0176589,18.1382498 L30.709645,30.5366742 C30.8841255,30.9977334 30.6518076,31.5129401 30.1907484,31.6874206 C30.0897997,31.7256231 29.982759,31.7451995 29.8748235,31.7451995 L29.2914449,31.7451995 C28.8668387,31.7451995 28.488528,31.4770567 28.3478907,31.0764177 L27.4177452,28.4266755 L27.4177452,28.4266755 L21.8966609,28.4266755 L20.9751954,31.0739363 C20.8352945,31.4758552 20.4563453,31.7451995 20.0307738,31.7451995 L19.4542663,31.7451995 C18.9628484,31.7451995 18.5644755,31.3468266 18.5644755,30.8554087 C18.5644755,30.7479927 18.5839252,30.6414642 18.6218834,30.5409784 L23.3067677,18.1388119 C23.4537593,17.7496851 23.8262851,17.4921875 24.2422493,17.4921875 L25.0823899,17.4921875 C25.4981343,17.4921875 25.8705113,17.749417 26.0176589,18.1382498 Z M24.657203,20.5170369 L22.591691,26.4296875 L26.7227151,26.4296875 L24.657203,20.5170369 Z M22.4,5 L8,5 C6.40231912,5 5.09633912,6.24891996 5.00509269,7.82372721 L5,8 L5,22.4 C5,23.9976809 6.24891996,25.3036609 7.82372721,25.3949073 L8,25.4 L12.6,25.4 L12.6,17.6 C12.6,14.9112453 14.7223067,12.7181819 17.3831104,12.6046195 L17.6,12.6 L25.4,12.6 L25.4,8 C25.4,6.40231912 24.15108,5.09633912 22.5762728,5.00509269 L22.4,5 Z"
                              id="Shape"></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <!-- <div class="ml-auto truncate">
                    <MoreVerticalIcon class="w-4 h-4 ml-0.5" />
                  </div> -->
                </div>
                <div class="text-3xl font-medium leading-8 mt-6">
                  {{ homeReport?.low_confidence }}
                </div>
                <div class="text-base text-slate-500 mt-1">
                  {{ $t("home-page.match_con_confidenza_bassa") }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box h-full zoom-in">
              <div class="p-5 h-full box" @click="movimentiMatchare()">
                <div class="ml-auto intro-y flex">
                  <div class="w-10 h-10 image-fit">
                    <img class="logo__image w-6" src="@/assets/images/big_match_manual.svg" />
                  </div>
                  <!-- <div class="ml-auto truncate">
                    <MoreVerticalIcon class="w-4 h-4 ml-0.5" />
                  </div> -->
                </div>
                <div class="text-3xl font-medium leading-8 mt-6">
                  {{ homeReport?.movements_to_associate }}
                </div>
                <div class="text-base text-slate-500 mt-1">
                  {{ $t("home-page.movimenti_da_associati") }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="intro-y box">
          <div class="flex sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400 mt-9">
            <h2 class="font-medium text-base mr-auto">
              {{
                $t("home-page.distribuzione_confidenza_dei_match_automatici")
              }}
            </h2>
          </div>
          <div class="p-8">
            <PreviewComponent class="intro-y mt-5">
              <Preview style="display: flex">
                <div class="progress"
                  style="width: 24%;
                    padding: 0 2px;
                    height: 100%;
                    background: transparent;
                    text-align: center; ">
                  <div class="progress-bar h-8" role="progressbar" aria-valuenow="0" aria-valuemin="0"
                    aria-valuemax="100" style="border-radius: 15px; background-color: #1d4ed8">
                    {{
                      (homeReport?.relative_high_confidence * 100)
                        .toString()
                        .split(".")[0]
                    }}%
                  </div>
                  <h4 class="text-base font-medium truncate mt-3">
                    {{ $t("home-page.elevata") }}
                  </h4>
                </div>
                <div class="progress"
                  style="
                                                                                                                                                                                                width: 42%;
                                                                                                                                                                                                padding: 0 2px;
                                                                                                                                                                                                height: 100%;
                                                                                                                                                                                                background: transparent;
                                                                                                                                                                                                text-align: center;
                                              ">
                  <div class="progress-bar h-8" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                    style="border-radius: 15px; background-color: #3584f1">
                    {{
                      (homeReport?.relative_medium_confidence * 100)
                        .toString()
                        .split(".")[0]
                    }}%
                  </div>
                  <h4 class="text-base font-medium truncate mt-3">
                    {{ $t("home-page.intermedia") }}
                  </h4>
                </div>
                <div class="progress"
                  style="
                                                                                                                                                                                                width: 34%;
                                                                                                                                                                                                padding: 0 2px;
                                                                                                                                                                                                height: 100%;
                                                                                                                                                                                                background: transparent;
                                                                                                                                                                                                text-align: center;
                                                                                                                                                                                              ">
                  <!-- :style="`width:${homeReport?.relative_low_confidence}%;padding: 0 2px;height: 100%;background: transparent;text-align: center;`" -->
                  <div class="progress-bar h-8" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                    style="border-radius: 15px; background-color: #73b6ff">
                    {{
                      (homeReport?.relative_low_confidence * 100)
                        .toString()
                        .split(".")[0]
                    }}%
                  </div>
                  <h4 class="text-base font-medium truncate mt-3">
                    {{ $t("home-page.bassa") }}
                  </h4>
                </div>
              </Preview>
            </PreviewComponent>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 xl:col-span-4 w-full  md:w-2/5 lg:w-1/4 pl-0 md:pl-5 md:mt-0 mt-10">
      <div class="col-span-12 sm:col-span-6 lg:col-span-3 h-full">
        <div class="intro-y box p-5 h-full">
          <div class="mt-3">
            <MatchDonutChart :height="200" :centerText="matchHigh" :chartData="[
              homeReport?.relative_closed,
              homeReport?.relative_auto,
              homeReport?.relative_movements_to_associate,
            ]" :labels="['ottanta', 'venti', 'vf']" :chartColors="['#22c55e', '#1d4ed8', '#db2777']"
              :onClick="clickHigh" :title="'Degree of confidence'" />
            <div class="font-small absolute w-full h-full flex items-center justify-center top-0 left-0">
              {{ $t("home-page.match_totali") }}
            </div>
          </div>
          <div class="w-52 sm:w-auto mx-auto mt-8">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-primary rounded-full mr-3" style="background-color: #22c55e"></div>
              <span class="truncate">{{ $t("menu.Match Validati") }}</span>
              <span class="font-medium ml-auto">{{ homeReport?.relative_closed * 100 }}%</span>
            </div>
            <div class="flex items-center mt-6">
              <div class="w-2 h-2 bg-pending rounded-full mr-3" style="background-color: #1d4ed8"></div>
              <span class="truncate">{{
                $t("menu.Match Automatici da Validare")
              }}</span>
              <span class="font-medium ml-auto">{{ homeReport?.relative_auto * 100 }}%</span>
            </div>
            <div class="flex items-center mt-4">
              <div class="w-2 h-2 bg-warning rounded-full mr-3" style="background-color: #db2777"></div>
              <span class="truncate">{{ $t("menu.Movimenti da Associare") }}</span>
              <span class="font-medium ml-auto">{{ homeReport?.relative_movements_to_associate * 100 }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="col-span-12 sm:col-span-6 lg:col-span-4 mt-8">
          <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Match associati (alta confidenza)</h2>
          </div>
          <div class="intro-y box p-5 mt-5">
            <MatchDonutChart
              :width="'auto'"
              :height="213"
              :centerText="matchHigh"
              :chartData="[80,20]"
              :labels="['ottanta','venti']"
              :chartColors="['rgb(0, 214, 64)','green']"
              :onClick="clickHigh"
              :title="'80%-100%'" />
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 lg:col-span-4 mt-8">
          <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Match associati (media confidenza)</h2>
          </div>
          <div class="intro-y box p-5 mt-5">
            <MatchDonutChart
              :width="'auto'"
              :height="213"
              :centerText="matchMedium"
              :chartData="[60,20,20]"
              :labels="['','','']"
              :chartColors="['transparent', '#ff6f00', 'transparent']"
              :onClick="clickMedium"
              :title="'60%-80%'" />
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 lg:col-span-4 mt-8">
          <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Match associati (bassa confidenza)</h2>
          </div>
          <div class="intro-y box p-5 mt-5">
            <MatchDonutChart
              :width="'auto'"
              :height="213"
              :centerText="matchLow"
              :chartData="[40,60]"
              :labels="['','']"
              :chartColors="['rgb(255, 0, 0)', 'transparent']"
              :onClick="clickLow"
              :title="'0%-40%'" />
          </div>
        </div> -->
    <!-- END: Match associati -->
  </div>
  <!-- <div class="intro-y flex items-center py-4 mt-5">
    <h2 class="text-lg font-medium truncate mr-5"> {{ $t("reconciler_analysis") }}</h2>
    <Dropdown class="dropdown intro-y flex items-center ml-auto" placement="bottom-start" v-slot="{ dismiss }">
      <DropdownToggle class="btn bg-white">
        {{ $t("last_12_months") }}
        <ChevronDownIcon class="w-4 h-4 ml-2" />
      </DropdownToggle>
    </Dropdown>
  </div> -->
  <!-- <div class="dashboard-main flex"> -->
  <!-- <div class="col-span-12 mt-8"> -->
  <!-- <div class="col-span-12 xl:col-span-8 left-part"> -->
  <!-- <div class="col-span-12 mt-8"> -->
  <!-- <div class="intro-y box p-5">
        <div class="flex  sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400  ">
          <h2 class="font-medium text-base mr-auto ">Andamento Match Automatici</h2>
        </div>
        <PreviewComponent>
          <Preview>
            <VerticalBarChart :height="400" />
          </Preview>
        </PreviewComponent>
      </div> -->

  <!-- </div>
    <div class="col-span-12 xl:col-span-4 right-part">
      <div class="intro-x box">
        <div class="p-5">
          <div class="flex  sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400  ">
          <h2 class="font-medium text-base mr-auto ">Match Automatici Totali</h2>
        </div>
          <div class="flex">
            <div
              class="intro-y flex-1 border-t border-b lg:border-t-0 lg:border-b-0   border-slate-200/60 dark:border-darkmode-400 py-16 lg:ml-8">
              
              
            </div>
          </div>
        </div>
      </div>
    </div> -->
  <!-- </div> -->
  <!-- </div> -->
  <!-- </div>
  </div> -->
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useMatchStore } from "@/stores/match";
import { useAuthStore } from "@/stores/auth";
import MatchDonutChart from "@/components/match-donut-chart/Main.vue";
import VerticalBarChart from "@/components/vertical-bar-chart/Main.vue";
import ReportPieChart from "@/components/report-pie-chart/Main.vue";
import router from "@/router";

const matchStore = useMatchStore();
const authStore = useAuthStore();

matchStore.LoadMatchesByConfidence();
const homeReport = ref("");

function automaticiList(confidence) {
  if(confidence == 'elevata'){
    router.push({name: "Match con Confidenza Elevata" });
  }else if (confidence =='intermedia'){
    router.push({name: 'Match con Confidenza Intermedia'});
  }else if(confidence == 'bassa'){
    router.push({name:'Match con Confidenza Bassa'});
  }
  
}

onMounted(async () => {
  await matchStore.HomeReport();
  homeReport.value = matchStore?.homeReport;
});

const movimentiMatchare = computed(() => router.push(`/movimenti-matchare`));

const matchLow = computed(() =>
  matchStore.getMatchesByConfidence &&
    matchStore.getMatchesByConfidence.low_confidence
    ? matchStore.getMatchesByConfidence.low_confidence
    : 0
);
const matchMedium = computed(() =>
  matchStore.getMatchesByConfidence &&
    matchStore.getMatchesByConfidence.medium_confidence
    ? matchStore.getMatchesByConfidence.medium_confidence
    : 0
);
const matchHigh = computed(() =>
  matchStore.getHomeReport && matchStore.getHomeReport.total
    ? matchStore.getHomeReport.total
    : 0
);

const caricaMatch = async (tipo) => {
  console.log("tipo: " + tipo);
  let min = 0;
  let max = 100;
  // loading data
  switch (tipo) {
    case 2:
      min = 0;
      max = 60;
      break;
    case 1:
      min = 60;
      max = 80;
      break;
    case 0:
      min = 80;
      max = 100;
  }
  let params = new URLSearchParams();
  params.append("minscoring", min);
  params.append("maxscoring", max);
  matchStore.setFiltroMARagioneSociale("");
  matchStore.setFiltroMAValuta("");
  // HomeReport
  await matchStore.LoadMatches({ params: params, soloAperti: true });
  router.push({ name: "top-menu-associated-matches" });
};

const clickHigh = (e) => {
  caricaMatch(0);
};

const clickMedium = (e) => {
  caricaMatch(1);
};

const clickLow = (e) => {
  caricaMatch(2);
};
</script>
<style>
.dashboard-main .left-part {
  width: 75%;
  padding-right: 15px;
}

.dashboard-main .right-part {
  width: 25%;
  padding-left: 15px;
}

.dashboard-main .right-part .col-span-12,
.dashboard-main .right-part .col-span-12 .intro-y.box,
.dashboard-main .right-part .intro-x.box {
  height: 100%;
}

.content.content--top-nav {
  border-radius: 0;
}
</style>
