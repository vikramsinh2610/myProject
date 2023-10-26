<template>
  <span :style="(onClick)?'cursor: pointer;':''">
    <Chart
      type="doughnut"
      :width="width"
      :height="height"
      :data="data"
      :options="options"
    />
  </span>
</template>

<script setup>
import { computed } from "vue";
import { useDarkModeStore } from "@/stores/dark-mode";
import { useColorSchemeStore } from "@/stores/color-scheme";
import { colors } from "@/utils/colors";

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

const darkMode = computed(() => useDarkModeStore().darkMode);
const colorScheme = computed(() => useColorSchemeStore().colorScheme);

const data = computed(() => {
  return {
    labels: props.labels,
    datasets: [
      {
        data: props.chartData,
        backgroundColor: colorScheme.value ? props.chartColors : "",
        hoverBackgroundColor: colorScheme.value ? props.chartColors : "",
        borderWidth: 5,
        borderColor: darkMode.value ? colors.darkmode[700]() : colors.secondary(0.3),
      },
    ],
  };
});

const options = computed(() => {
  let opts = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false
      },
    },
    cutout: "80%",
    elements: {
      center: {
        text: props.centerText,
        color: darkMode.value ? colors.light(1) : colors.dark(1), // Default is #000000
        fontStyle: 'Roboto', // Default is Arial
        sidePadding: 40, // Default is 20 (as a percentage)
        minFontSize: 12, // Default is 20 (in px), set to false and text will not wrap.
        lineHeight: 25 // Default is 25 (in px), used for when text wraps
      }
    }
  }
  if (props.onClick) opts.onClick = props.onClick
  return opts
});
</script>
