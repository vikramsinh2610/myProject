<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <q-card inline flat color="white" text-color="primary">
      <q-card-section>
        <!-- riassunto info consulente -->
        <q-item class="items-start row no-wrap">
          <div class="company q-pt-sm q-pr-sm">
            <img src="/avatar.svg" class="q-item-avatar" />
          </div>
          <div class="col-6" style="height: 109px">
            <div class="p-pdm-title-section ellipsis">{{ promoter.displayName }}</div>
            <div class="p-pdm-text row no-wrap items-start">
              <q-icon class="q-ma-sm" name="fa fa-organization-grey" size="15px" />
              <div class="text-truncate text-no-wrap ellipsis">
                {{
                  promoter.displayHierarchy ? promoter.displayHierarchy : $t('promoters.noNetwork')
                }}
              </div>
            </div>
            <div class="p-pdm-text row no-wrap items-start">
              <q-icon class="q-ma-sm" name="fa fa-briefcase-grey" size="15px" />
              <div class="text-truncate text-no-wrap ellipsis">
                {{ $utils.getRoleName(roles, promoter.roleId) }}
              </div>
            </div>
          </div>
        </q-item>

        <q-separator />

        <div>
          <q-table
            :title="$t(`configurationJobs.tableTitle`)"
            class="q-my-lg"
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
                  v-if="col.field !== 'roleId'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  :type="col.type"
                  v-model="props.row[col.field]"
                />
                <q-select
                  v-if="col.field === 'roleId'"
                  v-model="props.row[col.field]"
                  :options="roleTypeList"
                />
              </q-td>
              <q-td>
                <div class="row items-center" style="min-width: 60px">
                  <div class="column">
                    <q-btn
                      round
                      dense
                      flat
                      size="sm"
                      icon="fa fa-chevron-up"
                      @click.stop="moveRowUp(props.row)"
                    />
                    <q-btn
                      round
                      dense
                      flat
                      size="sm"
                      icon="fa fa-chevron-down"
                      @click.stop="moveRowDown(props.row)"
                    />
                  </div>
                  <q-btn round dense flat icon="fas fa-times" @click.stop="removeRow(props.row)" />
                </div>
              </q-td>
            </q-tr>

            <!--eslint-disable-next-line vue/no-unused-vars-->
            <div slot="bottom" slot-scope="props" class="row fit">
              <q-btn
                rounded
                flat
                icon="fa fa-plus"
                class="p-btn-icon block"
                color="secondary"
                text-color="secondary"
                :label="$t('configurationProduct.addRow')"
                @click="addRow"
              />
            </div>
          </q-table>
        </div>
        <prassi-standard-button
          class="q-mb-lg"
          :loading="isFetching"
          :label="$t('configurationProduct.save')"
          @click="submit"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import arrayMove from 'array-move';

export default {
  name: 'ConfigurationJobsDetail',
  data() {
    return {
      columns: [
        {
          name: 'Year',
          type: 'number',
          required: true,
          label: this.$t(`configurationJobs.fromProductivePeriodYear`),
          align: 'left',
          field: 'fromProductivePeriodYear',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
          length: '250',
        },
        {
          name: 'Month',
          type: 'number',
          required: true,
          label: this.$t(`configurationJobs.fromProductivePeriodMonth`),
          align: 'left',
          field: 'fromProductivePeriodMonth',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
          length: '250',
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
      ],
      tableData: [],
    };
  },
  computed: {
    ...mapState({
      promoter: (state) => state.configuration.promoter,
      jobs: (state) => state.configuration.jobs,
      isFetching: (state) => state.error.isFetching,
      roles: (state) => state.promoters.roles.items,
      roleTypeList() {
        const roleTypeList = [];
        this.roles.forEach((el) => {
          roleTypeList.unshift({
            label: el.name,
            value: el.networkId,
          });
        });
        return roleTypeList;
      },
    }),
  },
  created() {
    this.resetConfigurationPromoter();
    this.fetchConfigurationPromoter(this.$route.params.id);
    this.fetchPromoterJobs(this.$route.params.id);
  },
  watch: {
    jobs: {
      immediate: true,
      handler(jobs) {
        this.$utils.logobj('CONFIGURATION-JOBS-DETAIL', 'jobs', jobs);

        this.tableData = [];
        jobs.forEach((job) => {
          const rowColumn = {
            _id: job._id,
            fromProductivePeriodYear: job.fromProductivePeriodYear,
            fromProductivePeriodMonth: job.fromProductivePeriodMonth,
            roleId: {
              label: this.roleTypeList.find((el) => job.roleId === el.value).label,
              value: job.roleId,
            },
          };
          this.tableData.push(rowColumn);
        });

        if (jobs.length === 0) this.addDefaultRow();
      },
    },
  },
  methods: {
    ...mapActions({
      fetchConfigurationPromoter: 'configuration/fetchPromoter',
      fetchPromoterJobs: 'configuration/fetchJobs',
      saveConfigurationJobs: 'configuration/saveJobs',
    }),
    ...mapMutations({
      resetConfigurationPromoter: 'configuration/resetPromoter',
    }),
    addRow() {
      const today = new Date();
      const rowBonus = {
        _id: 'DEFAULT',
        fromProductivePeriodYear: today.getFullYear(),
        fromProductivePeriodMonth: today.getMonth() + 1,
        roleId: {
          label: this.roleTypeList.find((el) => el.value === 'promoter').label,
          value: 'promoter',
        },
      };
      this.tableData.push(rowBonus);
    },
    addDefaultRow() {
      const rowBonus = {
        _id: 'DEFAULT',
        fromProductivePeriodYear: 0,
        fromProductivePeriodMonth: 0,
        roleId: {
          label: this.roleTypeList[this.roleTypeList.length - 1].label,
          value: this.roleTypeList[this.roleTypeList.length - 1].value,
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
    submit() {
      this.$utils.logobj('CONFIGURATION-JOBS-DETAIL', 'submit changed jobs', this.tableData);
      this.saveConfigurationJobs({
        promoterId: this.$route.params.id,
        jobs: this.tableData.map((el) => ({ ...el, roleId: el.roleId.value })),
      }).then(() => {
        this.$q.notify({
          message: this.$t('configurationProduct.saveOk'),
          color: 'secondary',
          timeout: 300,
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
.p-pdm-title-section
  font-size 26px
  font-weight 500
.p-pdm-text
  font-size 18px
  font-weight 100
</style>
