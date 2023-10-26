<script setup>
import { computed, ref, onUpdated, onBeforeMount } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import { mdiPencil, mdiTrashCan, mdiPlus, mdiFolderMultiple, mdiCheck  } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import moment from "moment";
//import { ConstantTypes } from "@vue/compiler-core";

defineProps({
  checkable: Boolean,
});

const router = useRouter();
const mainStore = useMainStore();
const selectedData = ref("")
const items = ref([]);
//computed(() => mainStore.clients);

onBeforeMount(async() => {
  await getData()

});

async function getData() {

  await mainStore.fetch(selectedData.value)
  console.log(items)
 
  items.value = mainStore.items
}
const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = ref(5);

const currentPage = ref(0);
const deleteId = ref('')
const checkedRows = ref([]);
const isMultiple = ref(false)
const itemsPaginated = computed(() =>
  items.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);
const selectOptions = [
  { id: "all", label: "All" },
  { id: "complete", label: "Complete" },
  { id: "inProgress", label: "In Progress" },
];

const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const AddEditTodo = (id) => {

  if (id == undefined || id == null) {
    console.log("no id")
    //
    //debugger
    router.push({ name: "Add todo" })
  } else {
    console.log("id")

    router.push({ name: "Edit todo", params: { id: id } });
  }

};

// const remove = (arr, cb) => {
//   const newArr = [];

//   arr.forEach((item) => {
//     if (!cb(item)) {
//       newArr.push(item);
//     }
//   });

//   return newArr;
// };
const onChange = (item) => {

  selectedData.value = item.target.value;
  getData();

}

const checked = (client) => {
  if (checkedRows.value.includes(client.Id)) {
    const index = checkedRows.value.indexOf(client.Id);
    if (index > -1) {
      checkedRows.value.splice(index, 1);
      
    }
  } else {
    checkedRows.value[checkedRows.value.length] = client.Id;
   
  }

  if (checkedRows.value.length == 0) {
    isMultiple.value = false
  }else{
    isMultiple.value = true
  }
    console.log("Check the selected data: ", checkedRows.value)
};
const deleteTodo = async() => {
  console.log("deleteToDo: clientId : ", deleteId.value)
  //debugger
  mainStore.deleteToDo(deleteId.value)
  getData()
}
const changeStatusToComplete = async () => {
  console.log("multiple Complete:--")
  //changing the status to complete one by one
  checkedRows.value.forEach(async function (id) {
      mainStore.changeStatusToComplete(id)
      getData();
      console.log("********************************")
    });

  checkedRows.value = [];
  isMultiple.value = false;
}
</script>

<template>
  <CardBoxModal class="bg-gray-100/50 dark:bg-slate-800" v-model="isModalActive" title="Please Confirm!!"
    button="danger" has-cancel @click="changeStatusToComplete();">
    <p>Are you sure you want to update the selected <b>todo</b> to<b> complete?</b></p>
   
  </CardBoxModal>

  <CardBoxModal class="bg-gray-100/50 dark:bg-slate-800" v-model="isModalDangerActive" title="Please Confirm!!"
    button="danger" has-cancel @click="deleteTodo()">
    <p>Are you sure you want to <b>delete this record?</b></p>
   
  </CardBoxModal>
  <div class=" text-center flex items-center justify-center bg-slate-100 relative min-h-[50px]">

    <b class="text-3xl font-serif">To Do List</b>
    <div class="flex items-center space-x-4 absolute right-2 top-2">
      <select
        class="rounded-md bg-blue-600 border-blue-600  flex justify-between focus:border-0 text-left text-white text-sm"
        @change="onChange($event)">
        <!-- <option value="0">{{ selectedData }}</option> -->
        <option v-for="tipi in selectOptions" :key="tipi.id" :value="tipi?.id">
          {{ tipi.label }}
        </option>
      </select>
      <BaseButtons v-if="isMultiple" type="justify-start lg:justify-end" no-wrap>
        <BaseButton color="info" :icon="mdiFolderMultiple " small @click="isModalActive=true" />
      </BaseButtons>
      <BaseButtons type="justify-start lg:justify-end" no-wrap>
        <BaseButton color="info" :icon="mdiPlus" small @click="AddEditTodo(null)" />
      </BaseButtons>

    </div>
  </div>

  <table class="">
    <thead class="">
      <tr>
        <th  />

        <th>Name</th>
        <th>Description</th>
        <th>Due Date</th>
        <th>Completed/InComplete</th>

        <th Actions/>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(client,index) in itemsPaginated" :key="client.Id">
        <!-- <TableCheckboxCell :id="index"
          v-if="checkable"
          @checked="checked( client)"/> -->
          <td data-label="Name">
            <input v-if="!client.IsCompleted" class="form-check-input lg ml-4 mt-5 mr-4 border-2" type="checkbox" :id="index" @click="
                    checked(
                      client
                    )
                  " :key="client.IsCompleted"/>
      <BaseButton v-if="client.IsCompleted" class="lg bg-green-700" :icon="mdiCheck" small @click="AddEditTodo(null)" />
          </td>

        <td data-label="Name">
          {{ client.Name }}
        </td>
        <td data-label="Description">
          {{ client.Description }}
        </td>
        <td data-label="DueDate">
          {{ moment(client.DueDate).format('DD-MM-YYYY') }}
        </td>
        <td data-label="IsComplete" class="lg:w-32">
          <progress class="flex w-2/5 self-center lg:w-full" max="100" :value="(client.IsCompleted == true) ? 100 : 20">
            {{ client.IsCompleted }}
          </progress>
        </td>

        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton color="info" :icon="mdiPencil" small @click="AddEditTodo(client.Id)" />
            <BaseButton color="danger" :icon="mdiTrashCan" small
              @click="isModalDangerActive = true; deleteId = client.Id" />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
