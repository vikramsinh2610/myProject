<template>
  <div
    class="auth-layout-wrap"
    :style="{ backgroundImage: 'url(' + bgImage + ')' }"
  >
    <!-- <p v-once class="typo__p" v-if="submitStatus === 'OK'">
      {{ makeToastTwo("success") }}
    </p> -->
    <p v-once class="typo__p" v-if="submitStatus === 'ERROR'">
      {{ makeToast("danger") }}
    </p>

    <div class="auth-content">
      <div class="card o-hidden">
        <div class="row">
          <div class="col-md-6">
            <div class="p-4">
              <div class="auth-logo text-center mb-30">
                <img :src="logo" />
              </div>
              <h1 class="mb-3 text-18">Sign In</h1>
              <b-form @submit.prevent="formSubmit">
                <b-form-group label="Email Address" class="text-12">
                  <b-form-input
                    class="form-control-rounded"
                    type="email"
                    v-model="form.email"
                    email
                    required
                  ></b-form-input>
                </b-form-group>

                <b-form-group label="Password" class="text-12">
                  <b-form-input
                    class="form-control-rounded"
                    type="password"
                    v-model="form.password"
                    required
                  ></b-form-input>
                </b-form-group>

                <!-- <b-button block to="/" variant="primary btn-rounded mt-2"
                  >Sign In</b-button
                >-->
                <b-button
                  type="submit"
                  tag="button"
                  class="btn-rounded btn-block mt-2"
                  variant="primary mt-2"
                  :disabled="loading"
                  >SignIn</b-button
                >
                <div v-once class="typo__p" v-if="loading">
                  <div class="spinner sm spinner-primary mt-3"></div>
                </div>
                <b-button
                  to="signUp"
                  block
                  variant="primary mt-2"
                  class="btn-rounded"
                  >Create an account</b-button
                >
              </b-form>

              <div class="mt-3 text-center">
                <router-link to="forgot" tag="a" class="text-muted">
                  <u>Forgot Password?</u>
                </router-link>
              </div>
            </div>
          </div>

          <b-col
            md="6"
            class="text-center"
            style="backgroundsize: cover"
            :style="{ backgroundImage: 'url(' + signInImage + ')' }"
          >
            <div class="pr-3 auth-right">
              <router-link
                to="signUp"
                class="btn btn-rounded btn-outline-primary btn-outline-email btn-block btn-icon-text"
                href="signup.html"
              >
                <i class="i-Mail-with-At-Sign"></i> Sign up with Email
              </router-link>
              <a
                class="btn btn-rounded btn-outline-primary btn-outline-google btn-block btn-icon-text"
              >
                <i class="i-Google-Plus"></i> Sign up with Google
              </a>
              <a
                class="btn btn-rounded btn-outline-primary btn-block btn-icon-text btn-outline-facebook"
              >
                <i class="i-Facebook-2"></i> Sign up with Facebook
              </a>
            </div>
          </b-col>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ConfigSetting } from "../../../data/config";
const filename = "login";
import axios from "axios";
import { mapState, mapActions } from "vuex";
import { required, sameAs, minLength } from "vuelidate/lib/validators";
export default {
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "SignIn",
  },
  data() {
    return {
      loading: false,
      errorMsg: "",
      submitStatus: null,
      bgImage: require("@/assets/images/photo-wide-4.jpg"),
      logo: require("@/assets/images/logo.png"),
      signInImage: require("@/assets/images/photo-long-3.jpg"),
      form: {
        email: "",
        password: "",
      },
    };
  },

  validations: {
    form: {
      email: { required },
      password: { required },
    },
  },

  computed: {
    // ...mapState("account", ["status"]),
  },
  created() {
    // this.logout();
  },
  methods: {
    // ...mapActions("account", ["login", "logout"]),

    formSubmit(e) {
      e.preventDefault();
      this.$v.form.$touch();
      if (this.$v.form.$invalid) {
        this.submitStatus = "ERROR";
        this.errorMsg = "Please fill the form correctly.";
      } else {
        this.loading = true;
        if (this.form.email && this.form.password) {
          const body = { email: this.form.email, password: this.form.password };
          axios
            .post(`${ConfigSetting.apiUrl}` + filename, body)
            .then((response) => {
              if (response.data.success) {
                console.log(response.data);

                localStorage.setItem("token", response.data.data.access_token);
                localStorage.setItem(
                  "userInfo",
                  JSON.stringify(response.data.data)
                );

                this.loading = false;
                this.$emit("authenticated", true);
                this.$router.push("/app/pages/blank");
              } else {
                this.loading = false;
                this.submitStatus = "ERROR";
                this.errorMsg = response.message;
              }
            })
            .catch((error) => {
              this.loading = false;
              this.submitStatus = "ERROR";
              this.errorMsg = error.response.data.message;
            });

          // debugger;
          // this.login({ email: this.form.email, password: this.form.password });
        }
      }
    },

    makeToast(variant = null) {
      this.$bvToast.toast(this.errorMsg, {
        title: ``,
        variant: variant,
        solid: true,
      });
    },
  },
};
</script>

<style>
.spinner.sm {
  height: 2em;
  width: 2em;
}
</style>
