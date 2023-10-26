<template>
  <q-card inline flat color="white" text-color="primary">
    <q-card-section>
      <div class="p-pc-title-section">
        {{ $t('promoterInsertLetter.detailData') }} {{ name }}
        <prassi-round-button
          class="float-right"
          icon="fa fa-chevron-up"
          @click="$emit('previousStep')"
        />
      </div>
      <div>
        <q-table
          v-if="$user.roleID >= 7"
          class="q-my-lg"
          :pagination.sync="pagination"
          :data="tableData"
          :columns="columns"
          row-key="name"
        >
          <q-tr slot="header" slot-scope="props" :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              <div>
                {{ col.label }}
              </div>
            </q-th>
          </q-tr>

          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <q-input
                v-if="col.field === 'date'"
                :readonly="$user.roleID < 7"
                class="table-input"
                :style="`width: ${col.length}px;`"
                :type="col.type"
                v-model="props.row[col.field]"
              />
              <q-input
                v-if="col.field !== 'date' && col.field !== 'roleId' && col.field !== 'state'"
                :readonly="true"
                class="table-input"
                :style="`width: ${col.length}px;`"
                :type="col.type"
                v-model="props.row[col.field]"
              />
              <q-select
                v-if="col.field === 'roleId'"
                :readonly="true"
                v-model="props.row[col.field]"
                :options="roleTypeList"
              />
              <q-select
                v-if="col.field === 'state'"
                :readonly="$user.roleID < 7"
                v-model="props.row[col.field]"
                :options="stateTypeList"
              />
            </q-td>
          </q-tr>
        </q-table>
      </div>
      <prassi-standard-button
        class="q-my-lg"
        v-if="$user.roleID >= 7"
        :loading="isFetching"
        :label="$t('promoterCompany.save')"
        @click="submit"
      />
      <prassi-round-button
        class="q-mb-md float-right"
        icon="fa fa-chevron-down"
        @click="nextStep"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { required, between } from 'vuelidate/lib/validators';
import arrayMove from 'array-move';

export default {
  name: 'PrassiPromoterLetterJob',
  data() {
    return {
      pagination: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      columns: [
        {
          name: 'Year',
          type: 'number',
          required: true,
          label: this.$t(`configurationJobs.fromProductivePeriodYear`),
          align: 'left',
          field: 'fromProductivePeriodYear',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
          length: '40',
        },
        {
          name: 'Month',
          type: 'number',
          required: true,
          label: this.$t(`configurationJobs.fromProductivePeriodMonth`),
          align: 'left',
          field: 'fromProductivePeriodMonth',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
          length: '40',
        },
        {
          name: 'Role',
          type: 'text',
          required: true,
          label: this.$t(`configurationJobs.roleId`),
          align: 'left',
          field: 'roleId',
          length: '150',
        },
        {
          name: 'Date',
          type: 'date',
          required: true,
          label: this.$t(`configurationJobs.dateInput`),
          align: 'left',
          field: 'date',
          length: '140',
        },
        {
          name: 'State',
          type: 'state',
          required: true,
          label: this.$t(`configurationJobs.stateInput`),
          align: 'left',
          field: 'state',
          length: '150',
        },
      ],
      tableData: [],
      stateTypeList: [
        {
          label: 'Attivo / Iscritto al RUI',
          value: 'active',
        },
        {
          label: 'In formazione',
          value: 'formation',
        },
        {
          label: 'In attesa di firma',
          value: 'signin',
        },
        {
          label: 'Non perfezionato',
          value: 'not-done',
        },
        {
          label: 'Cessato',
          value: 'disactive',
        },
      ],
      form: {
        fromProductivePeriodMonth: {
          label: this.$utils.numberToMonth(new Date().getMonth() + 1, this.$t.bind(this)),
          value: new Date().getMonth() + 1,
        },
        fromProductivePeriodYear: new Date().getFullYear(),
        roleType: undefined,
        _id: '',
      },
    };
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    job: {
      type: Object,
      default: () => ({}),
    },
    jobs: {
      type: Array,
      default: () => [],
    },
    selectedSettings: {
      type: Object,
      default: () => ({}),
    },
    productivePeriod: {
      type: Object,
      default: () => ({}),
    },
  },
  validations: {
    form: {
      fromProductivePeriodMonth: {
        required,
      },
      fromProductivePeriodYear: {
        required,
        integer: true,
        between: between(0, 2200),
      },
    },
  },
  computed: {
    roles: (state) => state.promoters.roles.items,
    roleTypeList() {
      const roleTypeList = [];

      Object.entries(this.selectedSettings.roleType || {}).forEach((key) => {
        roleTypeList.push({
          label: key[1].name,
          value: key[1].networkId,
        });
      });

      return roleTypeList;
    },
  },
  watch: {
    jobs: {
      immediate: true,
      handler(jobs) {
        this.$utils.logobj('PRASSI-LETTER-DETAIL', 'jobs', jobs);
        if (!jobs) return;

        this.tableData = [];
        jobs.forEach((job) => {
          const rowColumn = {
            fromProductivePeriodYear: job.fromProductivePeriodYear,
            fromProductivePeriodMonth: job.fromProductivePeriodMonth,
            roleId: {
              label: this.roleTypeList.find((el) => job.roleId === el.value).label,
              value: job.roleId,
            },
            state: {
              label: job.state
                ? this.stateTypeList.find((el) => job.state === el.value).label
                : 'Attivo / Iscritto al RUI',
              value: job.state ? job.state : 'active',
            },
            date: job.date,
          };
          this.tableData.push(rowColumn);
        });

        if (jobs.length === 0) this.addDefaultRow();
      },
    },
    job: {
      immediate: true,
      handler(job) {
        this.$utils.logobj('PRASSI-LETTER-DETAIL', 'watch job', job);
        if (!job || (this.jobs && this.jobs.length > 0)) return;

        this.form.roleType = {
          label: this.roleTypeList.find((el) => job.roleId === el.value).label,
          value: job.roleId,
        };
        this.tableData = [];
        const rowColumn = {
          fromProductivePeriodYear: this.productivePeriod.fromProductivePeriodYear,
          fromProductivePeriodMonth: this.productivePeriod.fromProductivePeriodMonth,
          roleId: {
            label: this.roleTypeList.find((el) => job.roleId === el.value).label,
            value: job.roleId,
          },
          state: {
            label: 'Attivo / Iscritto al RUI',
            value: 'active',
          },
          date: new Date().toISOString().slice(0, 10),
        };
        this.tableData.push(rowColumn);
      },
    },
    productivePeriod: {
      immediate: true,
      handler(productivePeriod) {
        const thisFromProductivePeriodMonth = productivePeriod.fromProductivePeriodMonth
          ? productivePeriod.fromProductivePeriodMonth
          : new Date().getMonth() + 1;
        this.form.fromProductivePeriodMonth = {
          label: this.$utils.numberToMonth(thisFromProductivePeriodMonth, this.$t.bind(this)),
          value: thisFromProductivePeriodMonth,
        };
        this.form.fromProductivePeriodYear = productivePeriod.fromProductivePeriodYear
          ? productivePeriod.fromProductivePeriodYear
          : new Date().getFullYear();
      },
    },
  },
  methods: {
    addRow() {
      const today = new Date();
      const rowBonus = {
        fromProductivePeriodYear: today.getFullYear(),
        fromProductivePeriodMonth: today.getMonth() + 1,
        roleId: {
          label: this.roleTypeList.find((el) => el.value === 'promoter').label,
          value: 'promoter',
        },
        state: {
          label: 'Attivo / Iscritto al RUI',
          value: 'active',
        },
        date: new Date().toISOString().slice(0, 10),
      };
      this.tableData.push(rowBonus);
    },
    addDefaultRow() {
      const rowBonus = {
        fromProductivePeriodYear: 0,
        fromProductivePeriodMonth: 0,
        roleId: {
          label: this.roleTypeList.find((el) => el.value === 'none').label,
          value: 'none',
        },
      };
      this.tableData.push(rowBonus);
    },
    removeRow(row) {
      const position = this.tableData.indexOf(row);
      if (this.tableData.length > 1) {
        this.tableData.splice(position, 1);
      }
    },
    moveRowUp(row) {
      const position = this.tableData.indexOf(row);
      if (position >= 1) {
        arrayMove.mutate(this.tableData, position, position - 1);
      }
    },
    moveRowDown(row) {
      const position = this.tableData.indexOf(row);
      if (position < this.tableData.length - 1) {
        arrayMove.mutate(this.tableData, position, position + 1);
      }
    },
    nextStep() {
      if (this.status === 'wip' && this.$user.roleID >= 7) {
        this.submit();
      } else {
        this.$emit('nextStep');
      }
    },
    submit() {
      this.$v.form.$touch();

      if (!this.$v.form.$error) {
        this.$utils.logobj('PRASSI-PROMOTER-LETTER-DETAIL', 'submit letter DETAIL', this.form);

        const productivePeriod = {
          fromProductivePeriodYear: this.tableData[0]
            ? this.tableData[0].fromProductivePeriodYear
            : new Date().getFullYear(),
          fromProductivePeriodMonth: this.tableData[0]
            ? this.tableData[0].fromProductivePeriodMonth
            : new Date().getMonth() + 1,
        };

        this.$emit('changeData', {
          productivePeriod,
          jobs: this.tableData.map((el) => ({
            ...el,
            roleId: el.roleId.value,
            state: el.state.value,
          })),
        });
      } else {
        this.$q.notify(this.$t('promoterInsertLetter.cantSave'));
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
.q-card-main
  padding 10px 15px 0
  min-height 34px
.p-pc-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  margin-bottom 20px
.p-pc-small-field
  width 135px
.p-pc-micro-field
  width 75px
.p-pc-toggle
  width 45%
  justify-content space-between
  font-size 22px
.p-pc-date
  width 200px
</style>
