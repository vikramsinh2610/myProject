<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <q-card inline flat color="white" text-color="primary">
      <q-card-section>
        <div class="p-pc-title-section">{{ $t('default.commissioningDynamic') }}</div>
        <div v-for="(dataRole, index) in tableData" :key="index">
          <q-table
            :title="dataRole.id"
            class="q-my-lg"
            :data="dataRole.roles"
            :columns="columns"
            row-key="roleId"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
          >
            <template #top>
              <div class="fit row wrap justify-between items-start content-start">
                <q-input
                  class="q-ml-sm"
                  :style="`width: 300 px;`"
                  :type="'text'"
                  v-model="dataRole.id"
                  :error-message="$t('configurationQuestion.errorLabel')"
                />
                <q-btn
                  class="q-ml-sm"
                  round
                  color="primary"
                  icon="fas fa-times"
                  @click="removeBlockRow(dataRole)"
                ></q-btn>
              </div>
            </template>
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
                  v-if="col.field === 'roleId'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  :type="col.currency !== 'text' ? 'number' : 'text'"
                  :suffix="computeCurrencySymbol(col.currency)"
                  v-model="props.row[col.field]"
                  :error-message="$t('configurationQuestion.errorLabel')"
                />
                <q-input
                  v-if="col.field === 'directProductionPercentage'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  :type="col.currency !== 'text' ? 'number' : 'text'"
                  :suffix="computeCurrencySymbol('percentage')"
                  v-model="props.row[col.field]"
                  :error-message="$t('configurationQuestion.errorLabel')"
                />
                <q-input
                  v-if="col.field === 'indirectProductionPercentage'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  :type="col.currency !== 'text' ? 'number' : 'text'"
                  :suffix="computeCurrencySymbol('percentage')"
                  v-model="props.row[col.field]"
                  :error-message="$t('configurationQuestion.errorLabel')"
                />
                <q-input
                  v-if="col.field === 'isIndirectProductionCombinable'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  v-model="props.row[col.field]"
                  :error-message="$t('configurationQuestion.errorLabel')"
                />
                <q-input
                  v-if="col.field === 'directProductionForfait'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  :type="col.currency !== 'text' ? 'number' : 'text'"
                  v-model="props.row[col.field]"
                  :error-message="$t('configurationQuestion.errorLabel')"
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
                      @click.stop="moveRowUp(dataRole, props.row)"
                    />
                    <q-btn
                      round
                      dense
                      flat
                      size="sm"
                      icon="fa fa-chevron-down"
                      @click.stop="moveRowDown(dataRole, props.row)"
                    />
                  </div>
                  <q-btn
                    round
                    dense
                    flat
                    icon="fas fa-times"
                    @click.stop="removeRow(dataRole, props.row)"
                  />
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
                @click="addRow(dataRole)"
              />
            </div>
          </q-table>
        </div>
        <prassi-standard-button
          class="q-mb-lg q-mt-xl"
          :loading="isFetching"
          :label="$t('default.commissioningDynamicAdd')"
          @click="addBlockRow()"
        />
        <prassi-standard-button
          class="q-mb-lg"
          color="red"
          :loading="isFetching"
          :label="$t('configurationCommissioning.delete')"
          @click="cancel"
        />
        <prassi-standard-button
          class="q-mb-lg"
          :loading="isFetching"
          :label="$t('configurationCommissioning.save')"
          @click="submit"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import arrayMove from 'array-move';

export default {
  name: 'ConfigurationCommissioningDynamicDetail',
  data() {
    return {
      idCommissioning: this.$route.params.id,
      tableData: [],
      pagination: {
        page: 1,
        rowsPerPage: 0,
      },
      columns: [
        {
          name: 'roleId',
          currency: 'text',
          required: true,
          label: this.$t(`configurationCommissioningHeader.roleId`),
          align: 'left',
          field: 'roleId',
          length: '300',
        },
        {
          name: 'directProductionPercentage',
          currency: 'number',
          required: true,
          label: this.$t(`configurationCommissioning.directProductionPercentage`),
          align: 'left',
          field: 'directProductionPercentage',
          length: '70',
        },
        {
          name: 'indirectProductionPercentage',
          currency: 'number',
          required: true,
          label: this.$t(`configurationCommissioning.indirectProductionPercentage`),
          align: 'left',
          field: 'indirectProductionPercentage',
          length: '70',
        },
        {
          name: 'isIndirectProductionCombinable',
          currency: true,
          required: true,
          label: this.$t(`configurationCommissioningHeader.indirectProductionCombinable`),
          align: 'left',
          field: 'isIndirectProductionCombinable',
          length: '70',
        },
        {
          name: 'directProductionForfait',
          currency: 'number',
          required: true,
          label: this.$t(`configurationCommissioningHeader.directProductionForfait`),
          align: 'left',
          field: 'directProductionForfait',
          length: '70',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      commissioning: (state) => state.configuration.tcwCommissioningDynamic,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  created() {
    this.fetchConfigurationTcwCommissioningDynamic(this.$route.params.id);
  },
  watch: {
    commissioning: {
      immediate: true,
      handler(commissioning) {
        this.tableData = [];
        commissioning.config.forEach((cb) => {
          const roleFixed = [];
          cb.roles.forEach((role) => {
            roleFixed.push({
              roleId: role.roleId,
              directProductionPercentage: role.directProductionPercentage / 100,
              indirectProductionPercentage: role.indirectProductionPercentage / 100,
              isIndirectProductionCombinable: role.isIndirectProductionCombinable,
              directProductionForfait: role.directProductionForfait,
            });
          });
          const rowColumn = {
            id: cb.id,
            roles: roleFixed,
          };
          this.tableData.push(rowColumn);
        });
      },
    },
  },
  methods: {
    ...mapActions({
      fetchConfigurationTcwCommissioningDynamic: 'configuration/fetchTcwCommissioningDynamic',
      saveConfigurationTcwCommissioningDynamic: 'configuration/saveTcwCommissioningDynamic',
      deleteConfigurationTcwCommissioningDynamic: 'configuration/deleteTcwCommissioningDynamic',
    }),
    computeCurrencySymbol(symbol) {
      switch (symbol) {
        case 'currency':
          return '€';
        case 'percentage':
          return '%';
        default:
          return '';
      }
    },
    addRow(data) {
      const rowBonus = {
        roleId: '',
        directProductionPercentage: 0,
        indirectProductionPercentage: 0,
        isIndirectProductionCombinable: false,
        directProductionForfait: 0,
      };
      data.roles.push(rowBonus);
    },
    removeRow(data, row) {
      const position = data.roles.indexOf(row);
      if (data.roles.length > 1) {
        data.roles.splice(position, 1);
      }
    },
    removeBlockRow(data) {
      const position = this.tableData.indexOf(data);
      if (this.tableData.length > 1) {
        this.tableData.splice(position, 1);
      }
    },
    addBlockRow() {
      const rowBonus = {
        roleId: '',
        directProductionPercentage: 0,
        indirectProductionPercentage: 0,
        isIndirectProductionCombinable: false,
        directProductionForfait: 0,
      };
      const blockRow = {
        id: '',
        roles: [rowBonus],
      };
      this.tableData.push(blockRow);
    },
    moveRowUp(data, row) {
      const position = data.roles.indexOf(row);
      if (position >= 1) {
        arrayMove.mutate(data.roles, position, position - 1);
      }
    },
    moveRowDown(data, row) {
      const position = data.roles.indexOf(row);
      if (position < data.roles.length - 1) {
        arrayMove.mutate(data.roles, position, position + 1);
      }
    },
    submit() {
      const tableConfigRendered = [];
      this.tableData.forEach((cb) => {
        const roleFixed = [];
        cb.roles.forEach((role) => {
          roleFixed.push({
            roleId: role.roleId,
            directProductionPercentage: role.directProductionPercentage * 100,
            indirectProductionPercentage: role.indirectProductionPercentage * 100,
            isIndirectProductionCombinable: role.isIndirectProductionCombinable,
            directProductionForfait: role.directProductionForfait,
          });
        });
        const rowColumn = {
          id: cb.id,
          roles: roleFixed,
        };
        tableConfigRendered.push(rowColumn);
      });

      this.saveConfigurationTcwCommissioningDynamic({
        idCommissioning: this.commissioning._id,
        body: {
          _id: this.commissioning._id,
          config: tableConfigRendered,
        },
      }).then(() => {
        this.$q.notify({
          message: this.$t('configurationProduct.saveOk'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
    cancel() {
      this.deleteConfigurationTcwCommissioningDynamic(this.idCommissioning).then(() => {
        this.$q.notify({
          message: this.$t('default.deleteOk'),
          color: 'secondary',
          timeout: 300,
        });
        this.$router.push('/configuration/tcw-commissioning-dynamic');
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
