<template>
  <div
    :style="{
      width: `${width}px`,
      height: `${height}px`,
    }"
  >
    <canvas ref="chartRef" :class="class"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, inject, watch } from "vue";
import Chart from "chart.js/auto";

// plugin per aggiungere testo al centro del chart
// https://stackoverflow.com/questions/20966817/how-to-add-text-inside-the-doughnut-chart-using-chart-js
// http://jsfiddle.net/danieljoeblack/feq1tpgm/6/
Chart.register({
  id: 'doughnut-centertext',
  beforeDraw: function(chart) {
    if (chart.config.options.elements && chart.config.options.elements.center) {
        // Get ctx from string
        var ctx = chart.ctx;

        // Get options from the center object in options
        var centerConfig = chart.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'Arial';
        var txt = centerConfig.text;
        var color = centerConfig.color || '#000';
        var maxFontSize = centerConfig.maxFontSize || 75;
        var sidePadding = centerConfig.sidePadding || 20;
        var innerRadius = chart._metasets[chart._metasets.length-1].data[0] && chart._metasets[chart._metasets.length-1].data[0].innerRadius ? chart._metasets[chart._metasets.length-1].data[0].innerRadius : 100
        var sidePaddingCalculated = (sidePadding / 100) * (innerRadius * 2)
        // Start with a base font of 30px
        ctx.font = "30px " + fontStyle;

        // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = (innerRadius * 2) - sidePaddingCalculated;            

        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = (innerRadius * 2);

        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
        var minFontSize = centerConfig.minFontSize;
        var lineHeight = centerConfig.lineHeight || 25;
        var wrapText = false;

        if (minFontSize === undefined) {
            minFontSize = 20;
        }

        if (minFontSize && fontSizeToUse < minFontSize) {
            fontSizeToUse = minFontSize;
            wrapText = true;
        }

        // Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        ctx.font = fontSizeToUse + "px " + fontStyle;
        ctx.fillStyle = color;

        if (!wrapText) {
            ctx.fillText(txt, centerX, centerY);
            return;
        }

        var words = txt.split(' ');
        var line = '';
        var lines = [];

        // Break words up into multiple lines if necessary
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > elementWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }

        // Move the center up depending on line height and number of lines
        centerY -= (lines.length / 2) * lineHeight;

        for (var n = 0; n < lines.length; n++) {
            ctx.fillText(lines[n], centerX, centerY);
            centerY += lineHeight;
        }
        //Draw text in center
        ctx.fillText(line, centerX, centerY);
    }
}
});

const props = defineProps({
  type: {
    type: String,
    required: true,
    default: "line",
    validator: (value) => {
      return ["line", "pie", "doughnut", "bar"].indexOf(value) !== -1;
    },
  },
  data: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  width: {
    type: [Number, String],
    default: "auto",
  },
  height: {
    type: [Number, String],
    default: "auto",
  },
  refKey: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: "",
  },
});

const chartRef = ref();
const init = () => {
  const canvas = chartRef.value?.getContext("2d");
  const chart = new Chart(canvas, {
    type: props.type,
    data: props.data,
    options: props.options,
  });

  watch(props, () => {
    chart.data = props.data;
    chart.options = props.options;
    chart.update();
  });

  // Attach ChartJs instance
  chartRef.value.instance = chart;
};

const bindInstance = () => {
  if (props.refKey) {
    const bind = inject(`bind[${props.refKey}]`);
    if (bind) {
      bind(chartRef.value);
    }
  }
};

onMounted(() => {
  bindInstance();
  init();
});
</script>
