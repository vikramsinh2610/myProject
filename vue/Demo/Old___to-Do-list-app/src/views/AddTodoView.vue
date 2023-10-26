<script setup>
import { reactive, ref } from "vue";
import { mdiAccount } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";

const selectOptions = [
  { id: 1, label: "Complete" },
  { id: 2, label: "In Progress" },
];

const form = reactive({
  name: "",
  dueDate: "",
  status: selectOptions[0],
  description: "",
});

const submit = () => {
  console.log("formformform", form);
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CardBox>
        <form @submit.prevent="submit">
          <FormField label="Name">
            <FormControl v-model="form.name" type="text" :icon="mdiAccount" required=""/>
          </FormField>
          <FormField label="Due date">
            <FormControl v-model="form.dueDate" type="date" required=""/>
          </FormField>

          <FormField label="Status">
            <FormControl v-model="form.status" :options="selectOptions" />
          </FormField>

          <BaseDivider />

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

          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit" />
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons>
        </form>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
