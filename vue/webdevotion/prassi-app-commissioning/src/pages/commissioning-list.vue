<template>
  <div>
    <prassi-commissioning-list
      :is-fetching="isFetching"
      :commissionings="commissionings"
      @viewClick="viewCommissioning"
      @addCommissioning="showAddCommissioningDialog"
    />

    <q-dialog v-model="showInsertDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('commissioning.insertTitleDialog') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-between q-my-xs">
            <q-input
              class="col-10"
              v-model="dateValue"
              mask="##-##-####"
              :label="$t('commissioning.addDate')"
            >
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="dateValue"
                      mask="DD-MM-YYYY"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row justify-between q-my-xs">
            <q-select
              class="col-6"
              v-model="monthPeriod"
              :label="$t('commissioning.productivePeriodMonth')"
              :options="$utils.productivePeriodMonthList($t.bind(this))"
            />
            <q-input
              class="col-4"
              v-model="yearPeriod"
              type="number"
              :label="$t('commissioning.productivePeriodYear')"
              :error="$v.yearPeriod.$error"
              :error-message="$t('commissioning.productivePeriodYearError')"
              @blur="$v.yearPeriod.$touch"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.applyButton')" @click="addCommissioning" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { date } from 'quasar';
import { mapActions, mapMutations, mapState } from 'vuex';
import { required, between } from 'vuelidate/lib/validators';
import PrassiCommissioningList from '../components/commissioning/prassi-commissioning-list';

export default {
  name: 'CommissioningList',
  components: {
    PrassiCommissioningList,
  },
  mounted() {
    this.resetCommissionings();
    this.resetCommissioning();
  },
  data() {
    return {
      showInsertDialog: false,
      dateValue: date.formatDate(Date.now(), 'DD-MM-YYYY'),
      monthPeriod: {
        label: this.$utils.numberToMonth(new Date().getMonth() + 1, this.$t.bind(this)),
        value: new Date().getMonth() + 1,
      },
      yearPeriod: new Date().getFullYear(),
    };
  },
  validations: {
    yearPeriod: {
      required,
      integer: true,
      between: between(2000, 2999),
    },
  },
  computed: {
    ...mapState({
      rootId: (state) => state.login._id,
      commissionings: (state) => state.commissioning.commissionings.items,
      last: (state) => state.commissioning.commissionings.lastRecord,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  methods: {
    ...mapActions({
      fetchCommissionings: 'commissioning/fetchCommissionings',
      openCommissioning: 'commissioning/openCommissioning',
    }),
    ...mapMutations({
      resetCommissionings: 'commissioning/resetCommissionings',
      resetCommissioning: 'commissioning/resetCommissioning',
      setCommissioningFilterSelected: 'commissioning/setCommissioningFilterSelected',
    }),
    addCommissioning() {
      this.$v.yearPeriod.$touch();
      if (!this.$v.yearPeriod.$error) {
        this.$utils.logobj('PRASSI-COMMISSIONING-LIST', 'confirmAdd', this.yearPeriod);
        this.resetCommissioning();
        this.$q.loading.show({ delay: 200 });
        this.openCommissioning(
          `${this.yearPeriod}${this.monthPeriod.value.toString().padStart(2, '0')}`,
        )
          .then(() => {
            this.$router.push(
              `/commissioning/${this.yearPeriod}${this.monthPeriod.value
                .toString()
                .padStart(2, '0')}`,
            );
          })
          .finally(() => {
            this.$q.loading.hide();
          });
      } else {
        this.error = true;
        this.$q.notify(this.$t('default.cantSave'));
        this.dateValue = date.formatDate(Date.now(), 'DD-MM-YYYY');
        this.monthPeriod = {
          label: this.$utils.numberToMonth(
            this.selectedPayment.productivePeriodMonth,
            this.$t.bind(this),
          ),
          value: new Date().getMonth() + 1,
        };
        this.yearPeriod = new Date().getFullYear();
      }
    },
    showAddCommissioningDialog() {
      this.$utils.log('PRASSI-COMMISSIONING-LIST', 'showAddCommissioningDialog called');
      this.showInsertDialog = true;
    },
    viewCommissioning(id) {
      this.$utils.logobj('PRASSI-COMMISSIONING-LIST', 'viewCommissioning', id);
      this.$router.push(`/commissioning/${id}`);
    },
  },
};
</script>

<style lang="stylus" scoped></style>
