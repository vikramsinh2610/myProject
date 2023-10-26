<template>
  <q-page padding class="flex flex-center column">
    <img
      v-if="$env.edition === 'tcw'"
      class="animated bounce slogo"
      alt="Tcw Logo"
      src="~assets/tcw-logo-login.png"
    />
    <img
      v-if="$env.edition === 'sheltia'"
      class="animated bounce slogo"
      alt="Sheltia logo"
      src="~assets/sheltia-logo-login.png"
    />
    <h4>{{ $t('login.welcome') }}</h4>

    <q-stepper
      class="no-shadow"
      ref="stepper"
      v-model="loginStep"
      active-color="secondary"
      :contractable="this.$q.screen.width <= 480"
    >
      <q-step name="login" :title="$t('login.accountTitle')" prefix="1">
        <q-input
          class="q-my-xs"
          v-model="form.username"
          type="email"
          :label="$t('login.username')"
          :error="$v.form.username.$error"
          :error-message="$t('login.userNameError')"
          @blur="$v.form.username.$touch"
          @keyup.enter="submit"
        />
        <q-input
          class="q-my-xs"
          count
          v-model="form.password"
          :type="isPwd ? 'password' : 'text'"
          :label="$t('login.password')"
          :error="$v.form.password.$error"
          :error-message="$t('login.passwordError')"
          @blur="$v.form.password.$touch"
          @keyup.enter="submit"
        >
          <template #append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-stepper-navigation>
          <prassi-standard-button
            :loading="isFetching"
            :label="$t('login.login')"
            @click="submit"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step name="qrcode" :title="$t('login.qrcodeTitle')" prefix="2">
        <img class="qrcode" v-if="qrcode !== ''" alt="QRCode" :src="qrcode" />
        <p class="qr-text">{{ $t('login.qrcodeText') }}</p>
        <a
          class="a-g-auth"
          href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=it"
          >{{ $t('login.qrcodeLinkText') }}</a
        >
        <q-btn
          flat
          size="lg"
          class="p-btn btn-copy"
          color="secondary"
          text-color="secondary"
          v-if="qrcode !== ''"
          :label="$t('login.copySecret')"
          :data-clipboard-text="secret"
        />

        <q-stepper-navigation>
          <prassi-standard-button
            :loading="isFetching"
            :label="$t('login.forwardButton')"
            @click="$refs.stepper.next()"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step name="token2fact" :title="$t('login.tokenTitle')" prefix="3">
        <q-input
          v-model="form2fact.token2fact"
          type="text"
          :label="$t('login.token2fact')"
          :error="$v.form2fact.token2fact.$error"
          :error-message="$t('login.tokenError')"
          @blur="$v.form2fact.token2fact.$touch"
          @keyup.enter="submit2factor"
        />

        <q-stepper-navigation>
          <prassi-standard-button
            :loading="isFetching"
            :label="$t('login.login')"
            @click="submit2factor"
          />
          <q-btn
            class="block margin-auto"
            flat
            text-color="secondary"
            size="sm"
            label="Hai perso il QR Code?"
            @click="submitQrCode"
          />
          <q-btn
            class="block margin-auto"
            flat
            text-color="secondary"
            size="sm"
            label="cambia utente"
            @click="$refs.stepper.goTo('login')"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
import { required, minLength, email } from 'vuelidate/lib/validators';
import { mapActions, mapState } from 'vuex';
import ClipboardJS from 'clipboard';
import * as types from '../store/const';

const clipboard = new ClipboardJS('.btn-copy');
clipboard.on('error', (e) => {
  this.$utils.errobj('LOGIN', 'clipboard', e);
});

export default {
  name: 'Login',
  data() {
    return {
      loginStep: 'login',
      isMobile: this.$q.platform.is.desktop,
      isPwd: true,
      form: {
        username: '',
        password: '',
      },
      form2fact: {
        token2fact: '',
      },
    };
  },
  validations: {
    form: {
      username: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(1),
      },
    },
    form2fact: {
      token2fact: {
        required,
      },
    },
  },
  computed: {
    ...mapState({
      isFetching: (state) => state.login.isFetching,
      error: (state) => state.login.error,
      errorType: (state) => state.login.errorType,
      errorMessage: (state) => state.login.errorMessage,
      logged: (state) => state.login.logged,
      loginStepStore: (state) => state.login.step,
      secret: (state) => state.login.secret,
      qrcode: (state) => state.login.qrcode,
    }),
  },
  watch: {
    logged(logged) {
      this.$utils.log('LOGIN', `logged ${logged}`);
      if (logged) {
        this.$router.replace('/');
      }
    },
    loginStepStore(step) {
      this.$utils.log('LOGIN', `loginStep ${step}`);
      this.loginStep = step;
    },
    errorType(errorType) {
      this.$utils.log('LOGIN', `error ${errorType}`);
      switch (errorType) {
        case types.ERROR_CONNECTION:
          this.$q.notify(this.$t('login.errConnection'));
          break;
        case types.ERROR_CREDENTIALS:
          this.$q.notify(this.$t('login.errCredentials'));
          break;
        case types.ERROR_INTERNAL:
          this.$q.notify(this.errorMessage);
          break;
        default:
          this.$utils.log('LOGIN', `no error ${errorType}`);
          break;
      }
    },
  },
  methods: {
    onResize(size) {
      this.isMobile = size.width <= 480;
    },
    submit() {
      this.$v.form.$touch();

      if (!this.$v.form.$error) {
        this.fetchLogin2fact({ username: this.form.username, password: this.form.password });
      } else {
        this.$q.notify(this.$t('login.noLogin'));
      }
    },
    submit2factor() {
      this.$v.form2fact.$touch();

      if (!this.$v.form2fact.$error) {
        this.$utils.logobj('LOGIN', 'submit2factor', this.form2fact.token2fact);
        this.fetchVerify2fact({ token2fact: this.form2fact.token2fact });
      } else {
        this.$q.notify(this.$t('login.noLoginToken'));
      }
    },
    submitQrCode() {
      this.recoverQrCode({ username: this.form.username, password: this.form.password })
        .then(() => {
          this.$q.notify({
            message: 'richiesta qr code inviata',
            color: 'secondary',
            timeout: 300,
          });
        })
        .catch(() => {
          this.$q.notify('errore richiesta qr code inviata');
        });
    },
    ...mapActions({
      fetchLogin2fact: 'login/fetchLogin2fact',
      fetchVerify2fact: 'login/fetchVerify2fact',
      recoverQrCode: 'login/recoverQrCode',
    }),
  },
};
</script>

<style lang="stylus" scoped>
.q-stepper
  background-color white
  border-radius 4px
  border solid 1px $card-border
.q-layout-page
  background-color $page-background
  padding-bottom: 15vh;
.slogo
  max-width: 200px
.qrcode
  max-width: 300px
  margin auto
  display block
.qr-text
  margin auto
  max-width 300px
  text-align justify
.a-g-auth
  text-align center
  margin 10px auto auto auto
  display block
  width 140px
  color: inherit;
  text-decoration: none;
  box-shadow: inset 0 -2px 0 $primary;
  padding-bottom: 2px;
  transition: all .15s ease-in-out;
.a-g-auth:hover
  color $primary
  box-shadow none
.btn-copy
  display block
  margin-top: 15px
</style>
