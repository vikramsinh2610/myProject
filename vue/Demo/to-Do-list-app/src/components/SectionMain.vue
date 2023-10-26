<script setup>
import { containerMaxW } from "@/config.js";
</script>

<template>
  <section class="p-6 shadow-2xl" :class="containerMaxW">
    <slot />
  </section>
</template>
