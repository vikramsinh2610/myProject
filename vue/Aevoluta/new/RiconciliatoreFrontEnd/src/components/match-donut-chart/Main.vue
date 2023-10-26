<template>
  <div v-if="title" class="col-span-12 text-center">{{ $t("home-page.degree_of_confidence") }}</div>
  <div class="mt-3">
    <ReportDonutChart 
      :width="width"
      :height="height"
      :centerText="centerText"
      :chartData="chartData"
      :labels="labels"
      :chartColors="chartColors"
      :onClick="centerText?onClick:null" />
  </div>
  <div v-if="!title" class="w-52 sm:w-auto mx-auto mt-8">
    <div :class="'flex items-center'+(index>0?' mt-4':'')" v-for="(color, index) in chartColors" :key="index">
      <div class="w-2 h-2 rounded-full mr-3" :style="'--tw-bg-opacity: 1; background-color: '+color"></div>
      <span class="truncate">{{labels[index]}}</span>
      <span class="font-medium ml-auto">{{chartData[index]}}</span><!-- percentuale? -->
    </div>
  </div>
</template>

<script setup>
import ReportDonutChart from "@/components/report-donut-chart/Main.vue";

const props = defineProps({
  width: {
    type: [Number, String],
    default: "auto",
  },
  height: {
    type: [Number, String],
    default: "auto",
  },
  centerText: {
    type: [Number, String],
    default: "",
  },
  title: {
    type: [String],
    default: "",
  },
  chartData: {
    type: [Array],
    default: [],
  },
  labels: {
    type: [Array],
    default: [],
  },
  chartColors: {
    type: [Array],
    default: [],
  },
  onClick: {
    type: [Function],
    default: null,
  },
});
</script>
