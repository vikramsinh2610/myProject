<template>
  <q-card inline flat color="white" class="text-primary">
    <q-card-section>
      <div class="p-pc-title-section">
        {{ $t('promoterCompany.company') }}
      </div>
      <div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="q-mr-xl p-pc-large-field"
            :readonly="$env.alpha || $user.roleID < 7"
            v-model="form.serialNumber"
            type="text"
            :label="$t('promoterCompany.serialNumber')"
            :error="!$env.alpha && $v.form.serialNumber.$error"
            :error-message="$t('promoterCompany.serialNumberError')"
            @blur="$v.form.serialNumber.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="p-pc-date"
            v-model="form.networkEnterDate"
            mask="##-##-####"
            :label="$t('promoterCompany.dateAssigned')"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="form.networkEnterDate"
                    mask="DD-MM-YYYY"
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="q-mr-xl p-pc-large-field"
            :readonly="$user.roleID < 7"
            v-model="form.ivassCode"
            type="text"
            :label="$t('promoterCompany.ivass')"
            :error="!$env.alpha && $v.form.ivassCode.$error"
            :error-message="$t('promoterCompany.ivassError')"
            @blur="$v.form.ivassCode.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="p-pc-date"
            v-model="form.approvationDate"
            mask="##-##-####"
            :label="$t('promoterCompany.dateApproved')"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="form.approvationDate"
                    mask="DD-MM-YYYY"
                    @input="() => $refs.qDateProxy2.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="row justify-end q-my-xs">
          <q-input
            class="p-pc-date"
            v-model="form.networkExitDate"
            mask="##-##-####"
            :label="$t('promoterHeader.dateGone')"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="form.networkExitDate"
                    mask="DD-MM-YYYY"
                    @input="() => $refs.qDateProxy2.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="row justify-between q-my-xs">
          <q-select
            class="q-mr-xl p-pc-large-field"
            v-model="form.role"
            :label="$t('promoterCompany.role')"
            :options="roleTypeList"
            :error-message="$t('promoterCompany.roleError')"
            @keyup.enter="submit"
          />
        </div>
        <div class="row justify-between q-ma-lg">
          <q-toggle
            class="p-pc-toggle"
            :readonly="$env.alpha || $user.roleID < 7"
            left-label
            v-model="form.director"
            :label="$t('promoterCompany.headquarter')"
            color="secondary"
          />
          <q-toggle
            class="p-pc-toggle"
            :readonly="$env.alpha || $user.roleID < 7"
            left-label
            v-model="form.employed"
            :label="$t('promoterCompany.employed')"
            color="secondary"
          />
        </div>
        <div class="row justify-between q-ma-lg">
          <q-toggle
            class="p-pc-toggle"
            :readonly="$env.alpha || $user.roleID < 7"
            left-label
            v-model="form.guest"
            :label="$t('promoterCompany.guest')"
            color="secondary"
          />
          <q-toggle
            class="p-pc-toggle"
            :readonly="$env.alpha || $user.roleID < 7"
            left-label
            v-model="form.enabled"
            :label="$t('promoterCompany.enabled')"
            color="secondary"
          />
        </div>
      </div>
      <prassi-standard-button
        v-if="$user.roleID >= 7"
        class="q-my-lg"
        :label="$t('promoterCompany.save')"
        :loading="isFetching"
        @click="submit"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { date } from 'quasar';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'PrassiPromoterCompany',
  data() {
    return {
      form: {
        serialNumber: '',
        ivassCode: '',
        approvationDate: date.formatDate(Date.now(), 'DD-MM-YYYY'),
        networkEnterDate: date.formatDate(Date.now(), 'DD-MM-YYYY'),
        networkExitDate: date.formatDate(Date.now(), 'DD-MM-YYYY'),
        director: false,
        employed: false,
        guest: false,
        enabled: false,
        role: {},
      },
    };
  },
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    promoter: {
      type: Object,
      default: () => ({}),
    },
    roles: {
      type: Array,
      default: () => [],
    },
  },
  validations: {
    form: {
      serialNumber: {
        required,
      },
      ivassCode: {
        required,
      },
      approvationDate: {
        required,
      },
      networkEnterDate: {
        required,
      },
    },
  },
  watch: {
    promoter: {
      immediate: true,
      handler(promoter) {
        this.$utils.logobj('PRASSI-PROMOTER-COMPANY', 'promoter', promoter);
        this.form.serialNumber = promoter.serialNumber;
        this.form.ivassCode = promoter.ivassCode;
        this.form.networkEnterDate = date.formatDate(promoter.networkEnterDate, 'DD-MM-YYYY');
        this.form.approvationDate = date.formatDate(promoter.approvationDate, 'DD-MM-YYYY');
        this.form.director = promoter.director;
        this.form.employed = promoter.employed;
        this.form.guest = promoter.guest;
        this.form.enabled = promoter.enabled;
        this.form.role = { label: promoter.role.value, value: promoter.role.key };
      },
    },
  },
  computed: {
    roleTypeList() {
      const roleTypeList = [];

      this.roles.forEach((el) => {
        if (roleTypeList.findIndex((role) => role.value === el.authenticationId) === -1) {
          roleTypeList.unshift({
            label: el.authenticationName,
            value: el.authenticationId,
          });
        }
      });

      return roleTypeList;
    },
  },
  methods: {
    submit() {
      this.$v.form.$touch();

      if (!this.$v.form.$error) {
        this.$utils.logobj('LOGIN', 'submit company profile', this.form);
        this.$emit('changeData', {
          ...this.form,
          role: { value: this.form.role.label, key: Number.parseInt(this.form.role.value, 10) },
          networkEnterDate: date
            .extractDate(this.form.networkEnterDate, 'DD-MM-YYYY')
            .toISOString(),
          approvationDate: date.extractDate(this.form.approvationDate, 'DD-MM-YYYY').toISOString(),
        });
      } else {
        this.$q.notify(this.$t('promoterCompany.cantSave'));
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-radius 4px
  border solid 1px $card-border
  min-height 280px
  min-width 710px
.q-card-main
  padding 10px 15px 0
  min-height 34px
.p-pc-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  margin-bottom 20px
.p-pc-large-field
  min-width 270px
.p-pc-toggle
  width 45%
  justify-content space-between
  font-size 22px
.p-pc-date
  width 200px
</style>
