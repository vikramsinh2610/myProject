<template>
  <div class="py-5 md:py-0">
    <MobileMenu />
    <TopBar class="top-bar-boxed--top-menu" />
    <!-- BEGIN: Top Menu -->
    <nav class="top-nav">
      <ul class="gap-5">
        <li v-for="(menu, menuKey) in formattedMenu" :key="menuKey">
          <a :href="
            menu.subMenu
              ? 'javascript:;'
              : router.resolve({ name: menu.pageName }).path
          " class="top-menu w-36" :class="{
  'top-menu--active': menu.active,
}" @click="linkTo(menu, router, $event)">
            <div class="top-menu__icon">
              <!-- <component :is="menu.icon" /> -->
              <img class="logo__image h-6 w-6" :src="menu.icon" />
            </div>
            <div class="top-menu__title">
              {{ $t("menu."+menu.title) }}
              <ChevronDownIcon v-if="menu.subMenu" class="top-menu__sub-icon" />
            </div>
          </a>
          <!-- BEGIN: Second Child -->
          <ul class="top-menu-inner" v-if="menu.subMenu">
            <li v-for="(subMenu, subMenuKey) in menu.subMenu" :key="subMenuKey">
              <a :href="
                subMenu.subMenu
                  ? 'javascript:;'
                  : router.resolve({ name: subMenu.pageName }).path
              " class="top-menu" @click="linkTo(subMenu, router, $event)">
                <div class="top-menu__icon">
                  <img class="logo__image h-6 w-6" :src="subMenu.icon" />
                </div>
                <div class="top-menu__title">
                  {{ $t("menu."+subMenu.title) }}
                  <!-- {{ $t("menu"+subMenu.title) }} -->
                  <ChevronDownIcon v-if="subMenu.subMenu" class="top-menu__sub-icon" />
                </div>
              </a>
              <!-- BEGIN: Third Child -->
              <ul v-if="subMenu.subMenu">
                <li v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu" :key="lastSubMenuKey">
                  <a :href="
                    lastSubMenu.subMenu
                      ? 'javascript:;'
                      : router.resolve({ name: lastSubMenu.pageName }).path
                  " class="top-menu" @click="linkTo(lastSubMenu, router, $event)">
                    <div class="top-menu__icon">
                      <component :is="'zap-icon'" />
                    </div>
                    <div class="top-menu__title">
                      {{ lastSubMenu.title }}
                    </div>
                  </a>
                </li>
              </ul>
              <!-- END: Third Child -->
            </li>
          </ul>
          <!-- END: Second Child -->
        </li>
      </ul>
    </nav>
    <!-- END: Top Menu -->
    <!-- BEGIN: Content -->
    <div class="content content--top-nav">
      <router-view />
    </div>
    <!-- END: Content -->
  </div>
</template>

<script setup>
import { computed, onMounted, provide, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTopMenuStore } from "@/stores/top-menu";
import { helper as $h } from "@/utils/helper";
import TopBar from "@/components/top-bar/Main.vue";
import MobileMenu from "@/components/mobile-menu/Main.vue";
import { nestedMenu, linkTo } from "@/layouts/side-menu";
import dom from "@left4code/tw-starter/dist/js/dom";

const route = useRoute();
const router = useRouter();
const formattedMenu = ref([]);
const topMenuStore = useTopMenuStore();
const topMenu = computed(() => nestedMenu(topMenuStore.menu, route));

provide("forceActiveMenu", (pageName) => {
  route.forceActiveMenu = pageName;
  formattedMenu.value = $h.toRaw(topMenu.value);
});

watch(
  computed(() => route.path),
  () => {
    delete route.forceActiveMenu;
    formattedMenu.value = $h.toRaw(topMenu.value);
  }
);

onMounted(() => {
  dom("body").removeClass("error-page").removeClass("login").addClass("main");
  formattedMenu.value = $h.toRaw(topMenu.value);
});
</script>

<style>
.top-menu {
  margin-right: 0 !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
}
</style>