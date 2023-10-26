<script setup>
import SectionMain from "@/components/SectionMain.vue";
import TableTodoList from "@/components/TableTodoList.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain class="mt-9 items-center justify-center place-content-center">
      <CardBox class="mb-6 mt-9 place-content-center " has-table>
        <TableTodoList checkable/>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
