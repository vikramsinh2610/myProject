<template>
<div style="width:100%; height:100%; min-height:1000px; text-align: center; margin-top:8%">
    <CircularChart ></CircularChart>
</div>

</template>

<script>
import CircularChart from "@/components/CircularChart.vue";

export default ({
    components: {
    CircularChart
},
})
</script>
<style >
.btnBackStyle{
    background-color: transparent !important;
    margin: 30px 10px 20px 10px;
}
</style>