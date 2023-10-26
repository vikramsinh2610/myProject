<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
      <div class="grid grid-cols-12 gap-6">
        <!-- BEGIN: Match associati -->
        <div class="col-span-12 sm:col-span-6 lg:col-span-4 mt-8">
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
        </div>
        <!-- END: Match associati -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useMatchStore } from "@/stores/match";
import MatchDonutChart from "@/components/match-donut-chart/Main.vue";
import router from "@/router";

const matchStore = useMatchStore();

matchStore.LoadMatchesByConfidence();

const matchLow = computed(() => (matchStore.getMatchesByConfidence && matchStore.getMatchesByConfidence.low_confidence)?matchStore.getMatchesByConfidence.low_confidence:0);
const matchMedium = computed(() => (matchStore.getMatchesByConfidence && matchStore.getMatchesByConfidence.medium_confidence)?matchStore.getMatchesByConfidence.medium_confidence:0);
const matchHigh = computed(() => (matchStore.getMatchesByConfidence && matchStore.getMatchesByConfidence.high_confidence)?matchStore.getMatchesByConfidence.high_confidence:0);

const caricaMatch = async (tipo) => {
  console.log("tipo: " + tipo);
  let min=0;
  let max=100;
  // loading data
  switch (tipo) {
    case 2:
      min=0
      max=60
      break;
    case 1:
      min=60
      max=80
      break;
    case 0:
      min=80
      max=100
  }
  let params = new URLSearchParams();
  params.append('minscoring', min);
  params.append('maxscoring', max);
  matchStore.setFiltroMARagioneSociale("")
  matchStore.setFiltroMAValuta("")

  await matchStore.LoadMatches({params: params, soloAperti:true});
  router.push({name: "top-menu-associated-matches"});
}

const clickHigh = (e) => {
  caricaMatch(0)
};

const clickMedium = (e) => {
  caricaMatch(1)
};

const clickLow = (e) => {
  caricaMatch(2)
};
</script>
