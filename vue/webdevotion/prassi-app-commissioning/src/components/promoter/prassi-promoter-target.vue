<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section">{{ $t('promoterTarget.target') }}</div>
      <div>
        <div class="row justify-between q-my-xs">
          <q-input
            class="p-pc-large-field"
            v-model="form.targetJanuary"
            :readonly="$user.roleID < 7"
            type="number"
            :decimals="2"
            suffix="IV"
            :label="$t('months.jan')"
            :error-message="$t('promoterTarget.targetError')"
            :error="$v.form.targetJanuary.$error"
            @blur="$v.form.targetJanuary.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="p-pc-large-field"
            v-model="form.targetJuly"
            :readonly="$user.roleID < 7"
            type="number"
            :decimals="2"
            suffix="IV"
            :label="$t('months.jul')"
            :error-message="$t('promoterTarget.targetError')"
            :error="$v.form.targetJuly.$error"
            @blur="$v.form.targetJuly.$touch"
            @keyup.enter="submit"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="p-pc-large-field"
            v-model="form.targetFebruary"
            :readonly="$user.roleID < 7"
            type="number"
            :decimals="2"
            suffix="IV"
            :label="$t('months.feb')"
            :error-message="$t('promoterTarget.targetError')"
            :error="$v.form.targetFebruary.$error"
            @blur="$v.form.targetFebruary.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="p-pc-large-field"
            v-model="form.targetAugust"
            :readonly="$user.roleID < 7"
            type="number"
            :decimals="2"
            suffix="IV"
            :label="$t('months.aug')"
            :error-message="$t('promoterTarget.targetError')"
            :error="$v.form.targetAugust.$error"
            @blur="$v.form.targetAugust.$touch"
            @keyup.enter="submit"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="p-pc-large-field"
            v-model="form.targetMarch"
            :readonly="$user.roleID < 7"
            type="number"
            :decimals="2"
            suffix="IV"
            :label="$t('months.mar')"
            :error-message="$t('promoterTarget.targetError')"
            :error="$v.form.targetMarch.$error"
            @blur="$v.form.targetMarch.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="p-pc-large-field"
            v-model="form.targetSeptember"
            :readonly="$user.roleID < 7"
            type="number"
            :decimals="2"
            suffix="IV"
            :label="$t('months.sep')"
            :error-message="$t('promoterTarget.targetError')"
            :error="$v.form.targetSeptember.$error"
            @blur="$v.form.targetSeptember.$touch"
            @keyup.enter="submit"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="p-pc-large-field"
            v-model="form.targetApril"
            :readonly="$user.roleID < 7"
            type="number"
            :decimals="2"
            suffix="IV"
            :label="$t('months.apr')"
            :error-message="$t('promoterTarget.targetError')"
            :error="$v.form.targetApril.$error"
            @blur="$v.form.targetApril.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="p-pc-large-field"
            v-model="form.targetOctober"
            :readonly="$user.roleID < 7"
            type="number"
            :decimals="2"
            suffix="IV"
            :label="$t('months.oct')"
            :error-message="$t('promoterTarget.targetError')"
            :error="$v.form.targetOctober.$error"
            @blur="$v.form.targetOctober.$touch"
            @keyup.enter="submit"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="p-pc-large-field"
            v-model="form.targetMay"
            :readonly="$user.roleID < 7"
            type="number"
            :decimals="2"
            suffix="IV"
            :label="$t('months.may')"
            :error-message="$t('promoterTarget.targetError')"
            :error="$v.form.targetMay.$error"
            @blur="$v.form.targetMay.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="p-pc-large-field"
            v-model="form.targetNovember"
            :readonly="$user.roleID < 7"
            type="number"
            :decimals="2"
            suffix="IV"
            :label="$t('months.nov')"
            :error-message="$t('promoterTarget.targetError')"
            :error="$v.form.targetNovember.$error"
            @blur="$v.form.targetNovember.$touch"
            @keyup.enter="submit"
          />
        </div>

        <div class="row justify-between q-my-xs">
          <q-input
            class="p-pc-large-field"
            v-model="form.targetJune"
            :readonly="$user.roleID < 7"
            type="number"
            :decimals="2"
            suffix="IV"
            :label="$t('months.jun')"
            :error-message="$t('promoterTarget.targetError')"
            :error="$v.form.targetJune.$error"
            @blur="$v.form.targetJune.$touch"
            @keyup.enter="submit"
          />
          <q-input
            class="p-pc-large-field"
            v-model="form.targetDecember"
            :readonly="$user.roleID < 7"
            type="number"
            :decimals="2"
            suffix="IV"
            :label="$t('months.dec')"
            :error-message="$t('promoterTarget.targetError')"
            :error="$v.form.targetDecember.$error"
            @blur="$v.form.targetDecember.$touch"
            @keyup.enter="submit"
          />
        </div>
      </div>
      <prassi-standard-button
        class="q-my-lg"
        v-if="$user.roleID >= 7"
        :label="$t('promoterCompany.save')"
        :loading="isFetching"
        @click="submit"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators';

export default {
  name: 'PrassiPromoterTarget',
  data() {
    return {
      form: {
        targetJanuary: '',
        targetFebruary: '',
        targetMarch: '',
        targetApril: '',
        targetMay: '',
        targetJune: '',
        targetJuly: '',
        targetAugust: '',
        targetSeptember: '',
        targetOctober: '',
        targetNovember: '',
        targetDecember: '',
      },
    };
  },
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    targets: {
      type: Array,
      default: () => [],
    },
  },
  validations: {
    form: {
      targetJanuary: {
        minValue: minValue(0),
        required,
      },
      targetFebruary: {
        minValue: minValue(0),
        required,
      },
      targetMarch: {
        minValue: minValue(0),
        required,
      },
      targetApril: {
        minValue: minValue(0),
        required,
      },
      targetMay: {
        minValue: minValue(0),
        required,
      },
      targetJune: {
        minValue: minValue(0),
        required,
      },
      targetJuly: {
        minValue: minValue(0),
        required,
      },
      targetAugust: {
        minValue: minValue(0),
        required,
      },
      targetSeptember: {
        minValue: minValue(0),
        required,
      },
      targetOctober: {
        minValue: minValue(0),
        required,
      },
      targetNovember: {
        minValue: minValue(0),
        required,
      },
      targetDecember: {
        minValue: minValue(0),
        required,
      },
    },
  },
  watch: {
    targets: {
      immediate: true,
      handler(targets) {
        this.$utils.logobj('PRASSI-PROMOTER-TARGET', 'targets', targets);
        if (targets && targets.length === 12) {
          this.form.targetJanuary = targets[0].targetIv / 100;
          this.form.targetFebruary = targets[1].targetIv / 100;
          this.form.targetMarch = targets[2].targetIv / 100;
          this.form.targetApril = targets[3].targetIv / 100;
          this.form.targetMay = targets[4].targetIv / 100;
          this.form.targetJune = targets[5].targetIv / 100;
          this.form.targetJuly = targets[6].targetIv / 100;
          this.form.targetAugust = targets[7].targetIv / 100;
          this.form.targetSeptember = targets[8].targetIv / 100;
          this.form.targetOctober = targets[9].targetIv / 100;
          this.form.targetNovember = targets[10].targetIv / 100;
          this.form.targetDecember = targets[11].targetIv / 100;
        }
      },
    },
  },
  methods: {
    submit() {
      this.$v.form.$touch();

      if (!this.$v.form.$error) {
        this.$utils.logobj('LOGIN', 'submit company profile', this.form);
        // eslint-disable-next-line vue/no-mutating-props
        this.targets[0].targetIv = this.form.targetJanuary * 100;
        // eslint-disable-next-line vue/no-mutating-props
        this.targets[1].targetIv = this.form.targetFebruary * 100;
        // eslint-disable-next-line vue/no-mutating-props
        this.targets[2].targetIv = this.form.targetMarch * 100;
        // eslint-disable-next-line vue/no-mutating-props
        this.targets[3].targetIv = this.form.targetApril * 100;
        // eslint-disable-next-line vue/no-mutating-props
        this.targets[4].targetIv = this.form.targetMay * 100;
        // eslint-disable-next-line vue/no-mutating-props
        this.targets[5].targetIv = this.form.targetJune * 100;
        // eslint-disable-next-line vue/no-mutating-props
        this.targets[6].targetIv = this.form.targetJuly * 100;
        // eslint-disable-next-line vue/no-mutating-props
        this.targets[7].targetIv = this.form.targetAugust * 100;
        // eslint-disable-next-line vue/no-mutating-props
        this.targets[8].targetIv = this.form.targetSeptember * 100;
        // eslint-disable-next-line vue/no-mutating-props
        this.targets[9].targetIv = this.form.targetOctober * 100;
        // eslint-disable-next-line vue/no-mutating-props
        this.targets[10].targetIv = this.form.targetNovember * 100;
        // eslint-disable-next-line vue/no-mutating-props
        this.targets[11].targetIv = this.form.targetDecember * 100;
        this.$emit('changeData', this.targets);
      } else {
        this.$q.notify(this.$t('promoterTarget.cantSave'));
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
