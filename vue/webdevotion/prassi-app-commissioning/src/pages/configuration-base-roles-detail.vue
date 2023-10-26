<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <q-card inline flat class="bg-white text-primary p-centered-container">
      <q-card-section>
        <div class="p-pc-title-section">{{ $t('configurationRole.title') }}</div>
        <div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-12"
              v-model="form.name"
              type="text"
              :label="$t('configurationRole.name')"
              :error-message="errorMessage.name"
              :error="$v.form.name.$error"
              @blur="$v.form.name.$touch"
              @keyup.enter="submit"
            />
          </div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-12"
              v-model="form.color"
              type="text"
              :label="$t('configurationRole.color')"
              :error-message="errorMessage.color"
              :error="$v.form.color.$error"
              @blur="$v.form.color.$touch"
              @keyup.enter="submit"
            />
          </div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-12"
              v-model="form.area"
              type="text"
              :label="$t('configurationRole.area')"
              :error-message="errorMessage.area"
              :error="$v.form.area.$error"
              @blur="$v.form.area.$touch"
              @keyup.enter="submit"
            />
          </div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-12"
              v-model="form.authenticationId"
              type="text"
              :label="$t('configurationRole.authenticationId')"
              :error-message="errorMessage.authenticationId"
              :error="$v.form.authenticationId.$error"
              @blur="$v.form.authenticationId.$touch"
              @keyup.enter="submit"
            />
          </div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-12"
              v-model="form.authenticationName"
              type="text"
              :label="$t('configurationRole.authenticationName')"
              :error-message="errorMessage.authenticationName"
              :error="$v.form.authenticationName.$error"
              @blur="$v.form.authenticationName.$touch"
              @keyup.enter="submit"
            />
          </div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-12"
              v-model="form.networkId"
              type="text"
              :label="$t('configurationRole.networkId')"
              :error-message="errorMessage.networkId"
              :error="$v.form.networkId.$error"
              @blur="$v.form.networkId.$touch"
              @keyup.enter="submit"
            />
          </div>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-12"
              v-model="form.shortName"
              type="text"
              :label="$t('configurationRole.shortName')"
              :error-message="errorMessage.shortName"
              :error="$v.form.shortName.$error"
              @blur="$v.form.shortName.$touch"
              @keyup.enter="submit"
            />
          </div>
        </div>
        <prassi-standard-button
          class="q-mb-lg"
          color="red"
          :loading="isFetching"
          :label="$t('configurationRole.delete')"
          @click="cancel"
        />
        <prassi-standard-button
          class="q-mb-lg"
          :loading="isFetching"
          :label="$t('configurationRole.save')"
          @click="submit"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'ConfigurationSurveyQuestionsDetail',
  data() {
    return {
      pagination: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      form: {
        required: false,
        _id: this.$route.params.id,
        name: '',
        color: '',
        area: '',
        authenticationId: '',
        authenticationName: '',
        networkId: '',
        shortName: '',
      },
      errorMessage: {
        name: '',
        color: '',
        area: '',
        authenticationId: '',
        authenticationName: '',
        networkId: '',
        shortName: '',
      },
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.configuration.role,
      buckets: (state) => state.configuration.buckets,
      types: (state) => state.configuration.types,
      isFetching: (state) => state.error.isFetching,
    }),
    isFieldNotEmpty(field) {
      return field !== undefined && field.length > 1;
    },
  },
  mounted() {
    this.resetRole();
    if (this.$route.params.id !== 'new-role') this.fetchRole(this.$route.params.id);
  },
  validations: {
    form: {
      name: {
        required,
        checkName(value) {
          if (!/^(?!\s)(?![\S\s]*\s$)[ 'a-z]+$/i.test(value) && value !== '') {
            this.errorMessage.name = this.$t('configurationRole.errorName');
            return false;
          }
          if (value === '') {
            this.errorMessage.name = this.$t('configurationRole.errorLabel');
            return false;
          }
          return true;
        },
      },
      color: {
        required,
        checkColor(value) {
          if (!/^(?!\s)(?![\S\s]*\s$)[ 'a-z]+$/i.test(value) && value !== '') {
            this.errorMessage.color = this.$t('configurationRole.errorName');
            return false;
          }
          if (value === '') {
            this.errorMessage.color = this.$t('configurationRole.errorLabel');
            return false;
          }
          return true;
        },
      },
      area: {
        required,
        checkArea(value) {
          if (!/^(?!\s)(?![\S\s]*\s$)[ 'a-z]+$/i.test(value) && value !== '') {
            this.errorMessage.area = this.$t('configurationRole.errorName');
            return false;
          }
          if (value === '') {
            this.errorMessage.area = this.$t('configurationRole.errorLabel');
            return false;
          }
          return true;
        },
      },
      authenticationId: {
        required,
        integer: true,
        checkAuthenticationId(value) {
          if (!/^\d+$/i.test(value) && value !== '') {
            this.errorMessage.authenticationId = this.$t('configurationRole.errorName');
            return false;
          }
          if (value === '') {
            this.errorMessage.authenticationId = this.$t('configurationRole.errorLabel');
            return false;
          }
          return true;
        },
      },
      authenticationName: {
        required,
        checkAuthenticationName(value) {
          if (!/^(?!\s)(?![\S\s]*\s$)[ 'a-z]+$/i.test(value) && value !== '') {
            this.errorMessage.authenticationName = this.$t('configurationRole.errorName');
            return false;
          }
          if (value === '') {
            this.errorMessage.authenticationName = this.$t('configurationRole.errorLabel');
            return false;
          }
          return true;
        },
      },
      networkId: {
        required,
        checkNetworkId(value) {
          if (!/^(?!\s)(?![\S\s]*\s$)[ 'a-z]+$/i.test(value) && value !== '') {
            this.errorMessage.networkId = this.$t('configurationRole.errorName');
            return false;
          }
          if (value === '') {
            this.errorMessage.networkId = this.$t('configurationRole.errorLabel');
            return false;
          }
          return true;
        },
      },
      shortName: {
        required,
        checkShortName(value) {
          if (!/^(?!\s)(?![\S\s]*\s$)[ 'a-z]+$/i.test(value) && value !== '') {
            this.errorMessage.shortName = this.$t('configurationRole.errorName');
            return false;
          }
          if (value === '') {
            this.errorMessage.shortName = this.$t('configurationRole.errorLabel');
            return false;
          }
          return true;
        },
      },
    },
  },
  watch: {
    role: {
      immediate: true,
      handler(role) {
        this.form._id = this.$route.params.id !== 'new-role' ? role?.[0]?._id : '';
        this.form.name = this.$route.params.id !== 'new-role' ? role?.[0]?.name : '';
        this.form.color = this.$route.params.id !== 'new-role' ? role?.[0]?.color : '';
        this.form.area = this.$route.params.id !== 'new-role' ? role?.[0]?.area : '';
        this.form.authenticationId =
          this.$route.params.id !== 'new-role' ? role?.[0]?.authenticationId : '';
        this.form.authenticationName =
          this.$route.params.id !== 'new-role' ? role?.[0]?.authenticationName : '';
        this.form.networkId = this.$route.params.id !== 'new-role' ? role?.[0]?.networkId : '';
        this.form.shortName = this.$route.params.id !== 'new-role' ? role?.[0]?.shortName : '';
      },
    },
  },
  methods: {
    ...mapActions({
      fetchRole: 'configuration/fetchRole',
      saveRole: 'configuration/saveRole',
      deleteRole: 'configuration/deleteRole',
    }),
    ...mapMutations({
      resetRole: 'configuration/resetRole',
    }),
    submit() {
      this.$v.form.$touch();
      if (!this.$v.form.$error) {
        const changedrole = {
          _id: this.form._id !== undefined ? this.form._id : undefined,
          name: this.form.name,
          color: this.form.color,
          area: this.form.area,
          authenticationId: this.form.authenticationId,
          authenticationName: this.form.authenticationName,
          networkId: this.form.networkId,
          shortName: this.form.shortName,
        };
        this.saveRole({ body: changedrole }).then(() => {
          this.$q.notify({
            message: this.$t('configurationRole.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
          this.$router.push('/configuration/roles');
        });
      } else {
        this.$q.notify(this.$t('configurationRole.cantSave'));
      }
    },
    cancel() {
      this.$q
        .dialog({
          title: this.$t('default.titleDeleteDialog'),
          message: this.$t('default.msgDeleteDialog'),
          ok: this.$t('default.okDeleteDialog'),
          cancel: this.$t('default.cancelDeleteDialog'),
        })
        .onOk(() => {
          this.deleteRole(this.form._id).then(() => {
            this.$q.notify({
              message: this.$t('configurationRole.deleteOk'),
              color: 'secondary',
              timeout: 300,
            });
            this.$router.push('/configuration/roles');
          });
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 660px
  max-width 1100px
.q-card
  border-radius 2px
  border solid 2px $card-border
  min-height 280px
.q-card-main
  padding 10px 15px 0
  min-height 34px
.p-pc-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  margin-bottom 20px
.p-pc-toggle
  width 45%
  justify-content space-between
  font-size 22px
</style>
