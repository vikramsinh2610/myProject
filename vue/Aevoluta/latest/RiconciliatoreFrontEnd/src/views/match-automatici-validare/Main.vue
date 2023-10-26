<template>
    <div class="intro-y flex items-center py-4">
        <h1 class="text-lg font-medium truncate mr-5">{{ $t("match_automatici_validare.Match_Automatici_da_Validare") }}</h1>
    </div>
    <div class="automatici-main flex">
        <div class="col-span-12 left-part">
            <div class="col-span-12 sm:col-span-6 lg:col-span-3">
                <div class="grid grid-cols-12 gap-5">
                    <!-- <button @click="automaticiList"> -->
                    <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                        <div class="report-box zoom-in">
                            <!-- <button @click="automaticiList"  class="box p-5 "> -->
                            <div class="box p-5 " @click="automaticiList" >
                                <div class="ml-auto intro-y flex">
                                    <!-- <button @click="automaticiList"> -->
                                    <!-- <BoxIcon class="report-box__icon truncate text-primary" /> -->
                                    <!-- </button> -->
                                    <div class="truncate ml-auto">
                                        <MoreVerticalIcon class="w-4 h-4 ml-0.5" />
                                    </div>
                                </div>
                                <div class="text-3xl font-medium leading-8 mt-6">825 di 1.320</div>
                                <div class="text-base text-slate-500 mt-1">Match con Confidenza Elevata</div>
                            </div>
                            <!-- </button> -->
                        </div>
                    </div>
                    <!-- </button> -->
                    <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                        <div class="report-box zoom-in">
                            <div class="box p-5 ">
                                <div class="ml-auto intro-y flex">
                                    <BoxIcon class="report-box__icon truncate text-primary" />
                                    <div class="truncate ml-auto">
                                        <MoreVerticalIcon class="w-4 h-4 ml-0.5" />
                                    </div>
                                </div>
                                <div class="text-3xl font-medium leading-8 mt-6">825 di 1.320</div>
                                <div class="text-base text-slate-500 mt-1">Match con Confidenza Intermedia</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                        <div class="report-box zoom-in">
                            <div class="box p-5 ">
                                <div class="ml-auto intro-y flex">
                                    <BoxIcon class="report-box__icon truncate text-primary" />
                                    <div class="truncate ml-auto">
                                        <MoreVerticalIcon class="w-4 h-4 ml-0.5" />
                                    </div>
                                </div>
                                <div class="text-3xl font-medium leading-8 mt-6">825 di 1.320</div>
                                <div class="text-base text-slate-500 mt-1">Match con Confidenza Bassa</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="intro-y box">
                    <div
                        class="flex  sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400 mt-9">
                        <h2 class="font-medium text-base mr-auto">Distribuzione confidenza</h2>
                    </div>
                    <div class="p-5">
                        <h2 class="font-medium text-base mr-auto">Completion rates</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-4 right-part">
            <div class="intro-x box">
                <div class="p-5">
                    <div
                        class="flex  sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400  ">
                        <h2 class="font-medium text-base mr-auto ">{{ $t("match_automatici_validare.Match_Automatici_Totali") }}</h2>
                    </div>
                    <div class="flex">
                        <div
                            class="intro-y flex-1 border-t border-b lg:border-t-0 lg:border-b-0   border-slate-200/60 dark:border-darkmode-400 py-16 lg:ml-8">


                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted } from "vue";
import router from "@/router";
function automaticiList() {
    router.push({ name: "match-validare-list" });
}
</script>
<style>
.automatici-main .left-part {
    width: 75%;
    padding-right: 15px;
}

.automatici-main .right-part {
    width: 25%;
    padding-left: 15px;
}

.automatici-main .right-part .col-span-12,
.automatici-main .right-part .col-span-12 .intro-y.box,
.automatici-main .right-part .intro-x.box {
    height: 100%;
}
</style>