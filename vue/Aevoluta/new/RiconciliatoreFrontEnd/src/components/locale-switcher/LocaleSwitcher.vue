<template>
  <div class="locale-switcher">
    <select v-model="locale" class="custom-select white-on-small-screen">
      <option v-for="lang in languageList" :value="lang.codice_iso" :key="lang.codice_iso">{{lang.codice_iso}}</option>
    </select>
  </div>
</template>

<script setup>
import { computed, watch, unref, ref } from "vue";
import { useI18n } from "vue-i18n";
import axios from 'axios';
import { useUtilsStore } from "@/stores/utils";
import { helper as $h } from "@/utils/helper";

const i18n = useI18n();
const locale = ref(unref(i18n.locale))
const utilsStore = useUtilsStore();
const first = ref(true)

const languageList = computed(() => utilsStore.getLanguageList);

const updateMessages = () => {
  utilsStore.setIsLoading(true);
  let messages = {}
  let allMessages = {}
  let lastUpdate = "1900-01-01"
  if (localStorage.getItem('messages')) {
    allMessages = JSON.parse(localStorage.getItem('messages'))
    /*console.log("inizio")
    console.log(JSON.stringify(allMessages))*/
    if (allMessages[locale.value]) {
      messages = allMessages[locale.value].messages
      lastUpdate = allMessages[locale.value].lastUpdate
    }
  }
  axios
    .get('campi-controlli-multilanguage/?lingua=' + unref(locale) + "&data_ultimo_aggiornamento=" + lastUpdate)
    .then(response => {
      if(response.status == 200) {   
        utilsStore.setIsLoading(false);
        /*{
          "codice_front_end_label": 0,
          "campo": "string",
          "codice_lingua": 0,
          "lingua": "string",
          "campo_in_lingua": "string",
          "data_ultimo_aggiornamento": "2022-07-01T15:27:39.561Z"
        }*/
        for(let i in response.data) {
          let message = response.data[i]
          messages[message.campo] = message.campo_in_lingua
        }  
        i18n.setLocaleMessage(unref(locale), messages);
        i18n.locale.value = unref(locale)
        if (!allMessages[locale.value]) allMessages[locale.value] = {}
        allMessages[locale.value]["messages"] = messages
        allMessages[locale.value]["lastUpdate"] = $h.formatDateForAPI(new Date())
        /*console.log("fine")
        console.log(JSON.stringify(allMessages))*/
        localStorage.setItem('messages', JSON.stringify(allMessages))
      }
    })
    .catch(error => {
      // TODO gestione errori
    })
}

utilsStore.setIsLoading(true);
axios
  .get('lingue-list/')
  .then(response => {
    if(response.status == 200) {
      utilsStore.setIsLoading(false);
      utilsStore.setLanguageList(response.data);
      updateMessages(i18n.locale);
    }
  })
  .catch(error => {
    // TODO gestione errori
  })
watch(locale,(newValue) => {
  //console.log("watch ", newValue)
  if (first.value) {
    first.value = false
  }
  else {
    updateMessages();
  }
},{
  immediate:true
});
</script>

<style scoped lang="css">
.custom-select {
  border-color: transparent;
  background-color: transparent;
}
</style>
