<script setup>
import { reactive, ref, onMounted } from "vue";
import { mdiAccount, mdiArrowLeft } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import moment from "moment";
const mainStore = useMainStore();
const router = useRouter();
const detail = ref([]);
const screenName = ref("Create Task")
const selectOptions = [
  { id: 1, label: "Complete" },
  { id: 2, label: "In Progress" },
];
onMounted(async()=>{

  if (window.location.href.indexOf("add-todo") > -1) {
    console.log("WWWW")
  }else{
    console.log("PPPPP")
    var pathname = window.location.href.split('/edit-todo/')
   
    console.log(pathname[1])
    await mainStore.getDataById(pathname[1])
    // debugger
    if(mainStore.toDoById != {}){
      detail.value =  mainStore.toDoById
      form.name = detail.value.Name
      form.description = detail.value.Description
      form.dueDate = moment(detail.value.DueDate).format('YYYY-MM-DD')
      form.status = (detail.value.IsCompleted == true ? selectOptions[0] : selectOptions[1])
    }
  }
 
})
const form = reactive({
  name: "",
  dueDate: "",
  status: selectOptions[1],
  description: "",
});

const submit = () => {
  console.log("formformform", form);
};
function previousPage(){
  router.push("/");
}
function reset(){
  
  form.name = ""
  form.dueDate = ""
  form.status =  selectOptions[1]
  form.description = ""
}
async function submitForm(){
  
  let toDoData = {}
  //Edit
  if(detail.value != []){
    toDoData.Id = detail.value.Id
  }else{
    //Add To Do
    toDoData.id = null
  }
  toDoData.Name = form.name
  toDoData.Description = form.description
  toDoData.IsCompleted = (form.status.label == "Complete") ? true : false
  toDoData.DueDate = moment(form.dueDate).format('YYYY-MM-DDTHH:MM:SS.sssZ')
  //debugger
  await mainStore.saveToDoData(toDoData)
  previousPage()
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      
      <CardBox>
        <div class="text-center flex items-center justify-center bg-slate-100 relative min-h-[50px]">
        <BaseButtons type="flex items-center space-x-2 absolute left-2 top-2" no-wrap>
          <BaseButton color="info" :icon="mdiArrowLeft" large @click="previousPage()" />
        </BaseButtons>
        <b class=" text-3xl font-serif">{{screenName}}</b>
      </div>
      <BaseDivider />
        <form @submit.prevent="submitForm()">
          <FormField label="Name">
            <FormControl v-model="form.name" type="text" :icon="mdiAccount" required=""/>
          </FormField>
          <FormField
            label="Description"
            help="Your Description. Max 255 characters"
          >
            <FormControl
              type="textarea"
              placeholder="Enter Your to do here"
              v-model="form.description"
              required=""
            />
          </FormField>

          <FormField label="Due Date">
            <FormControl v-model="form.dueDate" type="date" required=""/>
          </FormField>

          <FormField label="Is Complete ?">
            <FormControl v-model="form.status" :options="selectOptions" placeholder="Enter the current status" />
          </FormField>

          <BaseDivider />

         
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit" />
            <BaseButton type="reset" color="info" outline label="Reset" @click="reset()" />
          </BaseButtons>
        </form>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
