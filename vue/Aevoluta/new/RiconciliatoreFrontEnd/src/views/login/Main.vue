<template>
  <div>
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Login Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <a href="" class="-intro-x flex items-center pt-5">
            <img alt="Midone Tailwind HTML Admin Template" class="w-6" src="@/assets/images/logo.svg" />
            <span class="text-white text-lg ml-3"> Enigma </span>
          </a>
          <div class="my-auto">
            <img alt="Midone Tailwind HTML Admin Template" class="-intro-x w-2/3 -mt-16"
              src="@/assets/images/loginImage.jpg" />
            <!-- <div class="-intro-x text-white font-medium text-4xl leading-tight mt-10">
              {{ $t("signin_t3") }} <br />
              {{ $t("signin_t4") }}
            </div> -->
            <!-- <div class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">
              {{ $t("signin_t5") }}
            </div> -->
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div
            class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
              {{ $t("sign_in") }}
            </h2>
            <div class="intro-x mt-2 text-slate-400 xl:hidden text-center">
              {{ $t("signin_t6") }}
            </div>
            <div class="intro-x mt-8">
              <!-- <input
                type="text"
                class="intro-x login__input form-control py-3 px-4 block"
                :placeholder="$t('email')"
                v-model="username"
                required
              /> -->
              <input id="validation-form-1" v-model.trim="validate.username.$model" type="text" name="name"
                class="intro-x login__input form-control py-3 px-4 block"
                :class="{ 'border-danger': validate.username.$error }" :placeholder="$t('email')" />
              <template v-if="validate.username.$error">
                <div v-for="(error, index) in validate.username.$errors" :key="index" class="text-danger mt-2">
                  {{ error.$message }}
                </div>
              </template>
              <!-- <input
                type="password"
                class="intro-x login__input form-control py-3 px-4 block mt-4"
                :placeholder="$t('password')"
                v-model="password"
                required
              /> -->
              <input id="validation-form-3" v-model.trim="validate.password.$model" type="password" name="password"
                class="intro-x login__input form-control py-3 px-4 block mt-4"
                :class="{ 'border-danger': validate.password.$error }" :placeholder="$t('password')" />
              <template v-if="validate.password.$error">
                <div v-for="(error, index) in validate.password.$errors" :key="index" class="text-danger mt-2">
                  {{ error.$message }}
                </div>
              </template>
            </div>
            <!-- <div
              class="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4"
            >
              <div class="flex items-center mr-auto">
                <input
                  id="remember-me"
                  type="checkbox"
                  class="form-check-input border mr-2"
                />
                <label class="cursor-pointer select-none" for="remember-me">{{
                  $t("remember_me")
                }}</label>
              </div>
              <a href="">{{ $t("forgot_password") }}</a>
            </div> -->
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
              <button @click="submit" class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top">
                {{ $t("login") }}
              </button>
              <!-- <button
                @click="register"
                class="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top"
              >
                {{ $t("register") }}
              </button> -->
              <!-- BEGIN: Failed Notification Content -->
              <div id="failed-notification-content" class="toastify-content hidden flex">
                <XCircleIcon class="text-danger" />
                <div class="ml-4 mr-4">
                  <div class="font-medium">Registration failed!</div>
                  <div class="text-slate-500 mt-1">
                    Please check the filled form.
                  </div>
                </div>
              </div>
              <!-- END: Failed Notification Content -->
            </div>
            <!-- <div
              class="intro-x mt-10 xl:mt-24 text-slate-600 dark:text-slate-500 text-center xl:text-left"
            >
              {{ $t("signin_t1") }}
              <a class="text-primary dark:text-slate-200" href="">{{
                $t("term_&_condition")
              }}</a>
              &
              <a class="text-primary dark:text-slate-200" href="">{{
                $t("signin_t2")
              }}</a>
            </div> -->
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { reactive, toRefs } from "vue";
import { required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useMatchStore } from "@/stores/match";
import router from "@/router";

onMounted(() => {
  dom("body").removeClass("main").removeClass("error-page").addClass("login");
});

const username = ref("");
const password = ref("");
const showError = ref(false);

const formData = reactive({
  username: "",
  password: "",
});

const rules = {
  username: {
    required,
    minLength: minLength(2),
  },
  password: {
    required,
    minLength: minLength(6),
  },
};

const validate = useVuelidate(rules, toRefs(formData));

const submit = async () => {
  validate.value.$touch();
  if (validate.value.$invalid) {
    Toastify({
      node: dom("#failed-notification-content")
        .clone()
        .removeClass("hidden")[0],
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
    }).showToast();
  } else {
    // console.log("formData", formData);
    const User = new FormData();
    User.append("username", formData.username);
    User.append("password", formData.password);
    const authStore = useAuthStore();
    const matchStore = useMatchStore();
    try {
      console.log("Calling login");
      await authStore.LogIn(User);
      //await this.$store.dispatch('auth/LogIn', User);
      console.log("Logged in");
      await matchStore.LoadConfiguration();
      //await this.$store.dispatch('match/LoadConfiguration');
      console.log("Config Loaded");
      const myRoute = authStore.getRequestedPage;
      //const myRoute = this.$store.getters["auth/getRequestedPage"];
      console.log("logged in ok, pushing: " + myRoute + " ok?");
      //console.log(router)
      router.push(myRoute);

      showError.value = false;
    } catch (error) {
      console.log("there was an error");
      console.log(error);
    }
  }
};
const save = async () => {
  const User = new FormData();
  User.append("username", username.value);
  User.append("password", password.value);
  const authStore = useAuthStore();
  const matchStore = useMatchStore();
  try {
    console.log("Calling login");
    await authStore.LogIn(User);
    //await this.$store.dispatch('auth/LogIn', User);
    console.log("Logged in");
    await matchStore.LoadConfiguration();
    //await this.$store.dispatch('match/LoadConfiguration');
    console.log("Config Loaded");
    const myRoute = authStore.getRequestedPage;
    //const myRoute = this.$store.getters["auth/getRequestedPage"];
    console.log("logged in ok, pushing: " + myRoute + " ok?");
    //console.log(router)
    router.push(myRoute);

    showError.value = false;
  } catch (error) {
    console.log("there was an error");
    console.log(error);
  }
};
</script>
