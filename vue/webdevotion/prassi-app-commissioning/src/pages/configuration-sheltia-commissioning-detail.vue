<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <q-card inline flat color="white" text-color="primary">
      <q-card-section>
        <div class="p-pc-title-section">{{ $t('configurationCommissioning.title') }}</div>
        <div>
          <div class="row justify-between q-my-xs">
            <q-field class="col-4" :error-label="$t('configurationProduct.errorLabel')">
              <q-input
                :readonly="true"
                v-model="form.roleId"
                type="text"
                :label="$t('configurationCommissioningHeader.roleId')"
                dense
              />
            </q-field>
            <q-field class="col-3" :error-label="$t('configurationProduct.errorLabel')">
              <q-input
                :readonly="true"
                v-model="form.fromProductivePeriod"
                type="text"
                :label="$t('configurationCommissioningHeader.fromProductivePeriod')"
                dense
              />
            </q-field>
          </div>
          <div class="row justify-between q-my-xs">
            <q-field class="col-3 float-right" :error-label="$t('configurationProduct.errorLabel')">
              <q-input
                v-model="form.directProductionPercentage"
                type="number"
                :label="$t('configurationCommissioning.directProductionPercentage')"
                dense
                @keyup.enter="submit"
                :suffix="computeCurrencySymbol('percentage')"
              />
            </q-field>
            <q-field class="col-3 float-right" :error-label="$t('configurationProduct.errorLabel')">
              <q-input
                v-model="form.indirectProductionPercentage"
                type="number"
                :label="$t('configurationCommissioning.indirectProductionPercentage')"
                dense
                @keyup.enter="submit"
                :suffix="computeCurrencySymbol('percentage')"
              />
            </q-field>
          </div>
          <div class="row justify-between q-my-xs">
            <q-field class="col-3 float-right" :error-label="$t('configurationProduct.errorLabel')">
              <q-checkbox
                v-model="form.directIrpefStyle"
                :label="$t('configurationCommissioning.directIrpefStyle')"
                dense
                @keyup.enter="submit"
              />
            </q-field>
            <q-field class="col-3 float-right" :error-label="$t('configurationProduct.errorLabel')">
              <q-checkbox
                v-model="form.indirectIrpefStyle"
                :label="$t('configurationCommissioning.indirectIrpefStyle')"
                dense
                @keyup.enter="submit"
              />
            </q-field>
          </div>
          <div class="row justify-between q-my-xs">
            <q-field class="col-3 float-right" :error-label="$t('configurationProduct.errorLabel')">
              <q-input
                v-model="form.advanceDirectProductionPercentage"
                type="number"
                :label="$t('configurationCommissioning.advanceDirectProductionPercentage')"
                dense
                @keyup.enter="submit"
                :suffix="computeCurrencySymbol('percentage')"
              />
            </q-field>
            <q-field class="col-3 float-right" :error-label="$t('configurationProduct.errorLabel')">
              <q-input
                v-model="form.advanceIndirectProductionPercentage"
                type="number"
                :label="$t('configurationCommissioning.advanceIndirectProductionPercentage')"
                dense
                @keyup.enter="submit"
                :suffix="computeCurrencySymbol('percentage')"
              />
            </q-field>
          </div>
          <q-table
            :title="$t(`configurationCommissioning.tableTitleDirectProductionSlots`)"
            class="q-my-lg"
            :pagination.sync="pagination"
            :data="tableDataDirectProductionSlots"
            :columns="columnsDirectProductionSlots"
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
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  :type="col.currency !== 'text' ? 'number' : 'text'"
                  :suffix="computeCurrencySymbol(col.currency)"
                  v-model="props.row[col.field]"
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
                      @click.stop="moveRowUpDirectProductionSlots(props.row)"
                    />
                    <q-btn
                      round
                      dense
                      flat
                      size="sm"
                      icon="fa fa-chevron-down"
                      @click.stop="moveRowDownDirectProductionSlots(props.row)"
                    />
                  </div>
                  <q-btn
                    round
                    dense
                    flat
                    icon="fas fa-times"
                    @click.stop="removeRowDirectProductionSlots(props.row)"
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
                @click="addRowDirectProductionSlots"
              />
            </div>
          </q-table>
          <q-table
            :title="$t(`configurationCommissioning.tableTitleIndirectProductionSlots`)"
            class="q-my-lg"
            :pagination.sync="pagination"
            :data="tableDataIndirectProductionSlots"
            :columns="columnsIndirectProductionSlots"
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
                  v-if="col.currency !== 'roleId'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  :type="col.currency !== 'text' ? 'number' : 'text'"
                  :suffix="computeCurrencySymbol(col.currency)"
                  v-model="props.row[col.field]"
                />
                <q-select
                  v-if="col.currency === 'roleId'"
                  class="col-12"
                  v-model="props.row[col.field]"
                  :label="$t('configurationJobs.roleId')"
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
                      @click.stop="moveRowUpIndirectProductionSlots(props.row)"
                    />
                    <q-btn
                      round
                      dense
                      flat
                      size="sm"
                      icon="fa fa-chevron-down"
                      @click.stop="moveRowDownIndirectProductionSlots(props.row)"
                    />
                  </div>
                  <q-btn
                    round
                    dense
                    flat
                    icon="fas fa-times"
                    @click.stop="removeRowIndirectProductionSlots(props.row)"
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
                @click="addRowIndirectProductionSlots"
              />
            </div>
          </q-table>
          <q-table
            :title="$t(`configurationCommissioning.tableTitleSlots`)"
            class="q-my-lg"
            :pagination.sync="pagination"
            :data="tableDataSlots"
            :columns="columnsSlots"
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
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  :type="col.currency !== 'text' ? 'number' : 'text'"
                  :suffix="computeCurrencySymbol(col.currency)"
                  v-model="props.row[col.field]"
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
                      @click.stop="moveRowUpSlots(props.row)"
                    />
                    <q-btn
                      round
                      dense
                      flat
                      size="sm"
                      icon="fa fa-chevron-down"
                      @click.stop="moveRowDownSlots(props.row)"
                    />
                  </div>
                  <q-btn
                    round
                    dense
                    flat
                    icon="fas fa-times"
                    @click.stop="removeRowSlots(props.row)"
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
                @click="addRowSlots"
              />
            </div>
          </q-table>
          <q-table
            :title="$t(`configurationCommissioning.tableTitleCashIn`)"
            class="q-my-lg"
            :pagination.sync="pagination"
            :data="tableDataCashIn"
            :columns="columnsCashIn"
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
                <q-select
                  v-if="col.field == 'productId'"
                  v-model="props.row[col.field]"
                  :options="productsBaseList"
                  @input="updateProductsList()"
                />
                <q-input
                  v-if="col.field != 'productId'"
                  class="table-input"
                  :style="`width: ${col.length}px;`"
                  :type="col.currency !== 'text' ? 'number' : 'text'"
                  :suffix="computeCurrencySymbol(col.currency)"
                  v-model="props.row[col.field]"
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
                      @click.stop="moveRowUpCashIn(props.row)"
                    />
                    <q-btn
                      round
                      dense
                      flat
                      size="sm"
                      icon="fa fa-chevron-down"
                      @click.stop="moveRowDownCashIn(props.row)"
                    />
                  </div>
                  <q-btn
                    round
                    dense
                    flat
                    icon="fas fa-times"
                    @click.stop="removeRowCashIn(props.row)"
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
                @click="addRowCashIn"
              />
            </div>
          </q-table>
        </div>
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
import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions } from 'vuex';
import arrayMove from 'array-move';

export default {
  name: 'ConfigurationCommissioningDetail',
  data() {
    return {
      pagination: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      productsBaseList: [],
      columnsDirectProductionSlots: [
        {
          name: 'fromIv',
          currency: true,
          required: true,
          label: this.$t(`configurationCommissioning.fromIV`),
          align: 'left',
          field: 'fromIv',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
          length: '150',
        },
        {
          name: 'toIv',
          currency: true,
          required: true,
          label: this.$t(`configurationCommissioning.toIV`),
          align: 'left',
          field: 'toIv',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
          length: '150',
        },
        {
          name: 'percentage',
          currency: 'percentage',
          required: true,
          label: this.$t(`configurationCommissioning.percentage`),
          align: 'left',
          field: 'percentage',
          format: (value) => `${this.$n(value, 'nodecimals')}%`,
          length: '100',
        },
      ],
      columnsIndirectProductionSlots: [
        {
          name: 'fromIv',
          currency: true,
          required: true,
          label: this.$t(`configurationCommissioning.fromIV`),
          align: 'left',
          field: 'fromIv',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
          length: '150',
        },
        {
          name: 'toIv',
          currency: true,
          required: true,
          label: this.$t(`configurationCommissioning.toIV`),
          align: 'left',
          field: 'toIv',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
          length: '150',
        },
        {
          name: 'percentage',
          currency: 'percentage',
          required: true,
          label: this.$t(`configurationCommissioning.percentage`),
          align: 'left',
          field: 'percentage',
          format: (value) => `${this.$n(value, 'nodecimals')}%`,
          length: '100',
        },
        {
          name: 'roleId',
          currency: 'roleId',
          required: true,
          label: this.$t(`configurationCommissioning.roleId`),
          align: 'left',
          field: 'roleId',
          length: '100',
        },
      ],
      columnsSlots: [
        {
          name: 'fromIv',
          currency: true,
          required: true,
          label: this.$t(`configurationCommissioning.fromIV`),
          align: 'left',
          field: 'fromIv',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
          length: '150',
        },
        {
          name: 'toIv',
          currency: true,
          required: true,
          label: this.$t(`configurationCommissioning.toIV`),
          align: 'left',
          field: 'toIv',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
          length: '150',
        },
        {
          name: 'percentage',
          currency: 'percentage',
          required: true,
          label: this.$t(`configurationCommissioning.percentage`),
          align: 'left',
          field: 'percentage',
          format: (value) => `${this.$n(value, 'nodecimals')}%`,
          length: '100',
        },
      ],
      columnsCashIn: [
        {
          name: 'productId',
          currency: 'text',
          required: true,
          label: this.$t(`configurationCommissioning.productId`),
          align: 'left',
          field: 'productId',
          length: '300',
        },
        {
          name: 'amount',
          currency: true,
          required: true,
          label: this.$t(`configurationCommissioning.amount`),
          align: 'left',
          field: 'amount',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
          length: '70',
        },
      ],
      tableDataDirectProductionSlots: [],
      tableDataIndirectProductionSlots: [],
      tableDataSlots: [],
      tableDataCashIn: [
        {
          productId: {
            label: '',
            value: 0,
          },
          amount: 0,
        },
      ],
      form: {
        idCommissioning: this.$route.params.id,
        roleId: '',
        fromProductivePeriod: '',
        fromProductivePeriodMonth: 0,
        fromProductivePeriodYear: 0,
        percentage: 0,
        directProductionPercentage: 0,
        indirectProductionPercentage: 0,
        directIrpefStyle: false,
        indirectIrpefStyle: false,
        advanceDirectProductionPercentage: 0,
        advanceIndirectProductionPercentage: 0,
      },
    };
  },
  props: {
    products: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState({
      productsBase: (state) => state.accounting.products.items,
      commissioning: (state) => state.configuration.sheltiaCommissioning,
      isFetching: (state) => state.error.isFetching,
      roles: (state) => state.promoters.roles.items,
      roleTypeList() {
        const roleTypeList = [];
        this.roles.forEach((el) => {
          if (el === `none`) return;
          roleTypeList.unshift({
            label: el.name,
            value: el.networkId,
          });
        });

        roleTypeList.unshift({
          label: 'Tutti',
          value: 'all',
        });

        return roleTypeList;
      },
    }),
    productList() {
      return this.productsBase.map((el) => ({
        label: el.name,
        value: el._id,
      }));
    },
  },
  created() {
    this.fetchConfigurationSheltiaCommissioning(this.$route.params.id);
  },
  validations: {
    form: {
      percentage: {
        required,
      },
    },
  },
  watch: {
    commissioning: {
      immediate: true,
      handler(commissioning) {
        this.$utils.logobj('CONFIGURATION-COMMISSIONING-DETAIL', 'commissioning', commissioning);
        this.form.idCommissioning = commissioning._id;
        this.form.roleId = this.$utils.getRoleName(this.roles, commissioning.roleId);
        this.form.directIrpefStyle = commissioning.directIrpefStyle
          ? commissioning.directIrpefStyle
          : false;
        this.form.indirectIrpefStyle = commissioning.indirectIrpefStyle
          ? commissioning.indirectIrpefStyle
          : false;
        this.form.fromProductivePeriod = `${this.$utils.numberToMonth(
          commissioning.fromProductivePeriodMonth,
          this.$t.bind(this),
        )} ${commissioning.fromProductivePeriodYear}`;

        this.form.directProductionPercentage =
          commissioning.purchase.basis.directProductionPercentage / 100;
        this.form.indirectProductionPercentage =
          commissioning.purchase.basis.indirectProductionPercentage / 100;
        this.form.advanceIndirectProductionPercentage =
          commissioning.advanceIndirectProductionPercentage / 100;
        this.form.advanceDirectProductionPercentage =
          commissioning.advanceDirectProductionPercentage / 100;

        this.tableDataDirectProductionSlots = [];
        this.tableDataDirectProductionSlots =
          commissioning.purchase.range.directProductionSlots.length > 0
            ? []
            : [
                {
                  fromIv: 0,
                  toIv: 0,
                  percentage: 0,
                },
              ];
        commissioning.purchase.range.directProductionSlots.forEach((cb) => {
          const rowColumn = {
            fromIv: cb.fromIv / 100,
            toIv: cb.toIv / 100,
            percentage: cb.percentage / 100,
          };
          this.tableDataDirectProductionSlots.push(rowColumn);
        });

        this.tableDataIndirectProductionSlots = [];
        this.tableDataIndirectProductionSlots =
          commissioning.purchase.range.indirectProductionSlots.length > 0
            ? []
            : [
                {
                  fromIv: 0,
                  toIv: 0,
                  percentage: 0,
                  roleId: {
                    label: 'Tutti',
                    value: 'all',
                  },
                },
              ];
        commissioning.purchase.range.indirectProductionSlots.forEach((cb) => {
          const rowColumn = {
            fromIv: cb.fromIv / 100,
            toIv: cb.toIv / 100,
            percentage: cb.percentage / 100,
            roleId: cb.roleId
              ? this.roleTypeList.find((el) => el.value === cb.roleId)
              : {
                  label: 'Tutti',
                  value: 'all',
                },
          };
          this.tableDataIndirectProductionSlots.push(rowColumn);
        });

        this.tableDataSlots = [];
        this.tableDataSlots =
          commissioning.purchase.target.slots.length > 0
            ? []
            : [
                {
                  fromIv: 0,
                  toIv: 0,
                  percentage: 0,
                },
              ];
        commissioning.purchase.target.slots.forEach((cb) => {
          const rowColumn = {
            fromIv: cb.fromIv / 100,
            toIv: cb.toIv / 100,
            percentage: cb.percentage / 100,
          };
          this.tableDataSlots.push(rowColumn);
        });

        this.tableDataCashIn =
          commissioning.cashIn.length > 0
            ? []
            : [
                {
                  productId: {
                    label: '',
                    value: 0,
                  },
                  amount: 0,
                },
              ];
        const ids = new Set(this.commissioning.cashIn.map((el) => el.productId));
        this.productsBaseList = this.productsBase
          .filter((el) => !ids.has(el._id))
          .map((el) => ({
            label: el.name,
            value: el._id,
          }));
        commissioning.cashIn.forEach((cb) => {
          const productSelected = this.productList.find((el) => cb.productId === el.value);
          const rowColumn = {
            productId: {
              label: productSelected ? productSelected.label : '',
              value: cb.productId,
            },
            amount: cb.amount / 100,
          };
          this.tableDataCashIn.push(rowColumn);
        });
      },
    },
  },
  methods: {
    ...mapActions({
      fetchConfigurationSheltiaCommissioning: 'configuration/fetchSheltiaCommissioning',
      saveConfigurationSheltiaCommissioning: 'configuration/saveSheltiaCommissioning',
      deleteConfigurationSheltiaCommissioning: 'configuration/deleteSheltiaCommissioning',
    }),
    updateProductsList() {
      const ids = new Set(this.tableDataCashIn.map((el) => el.productId.value));
      this.productsBaseList = this.productsBase
        .filter((el) => !ids.has(el._id))
        .map((el) => ({
          label: el.name,
          value: el._id,
        }));
    },
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
    addRowCashIn() {
      const rowBonus = {
        productId: {
          label: '',
          value: 0,
        },
        amount: 0,
      };
      this.tableDataCashIn.push(rowBonus);
    },
    removeRowCashIn(row) {
      const position = this.tableDataCashIn.indexOf(row);
      if (this.tableDataCashIn.length > 1) {
        this.tableDataCashIn.splice(position, 1);
      } else {
        this.tableDataCashIn = [
          {
            productId: {
              label: '',
              value: 0,
            },
            amount: 0,
          },
        ];
      }
      this.updateProductsList();
    },
    moveRowUpCashIn(row) {
      const position = this.tableDataCashIn.indexOf(row);
      if (position >= 1) {
        arrayMove.mutate(this.tableDataCashIn, position, position - 1);
      }
    },
    moveRowDownCashIn(row) {
      const position = this.tableDataCashIn.indexOf(row);
      if (position < this.tableDataCashIn.length - 1) {
        arrayMove.mutate(this.tableDataCashIn, position, position + 1);
      }
    },
    addRowDirectProductionSlots() {
      const rowBonus = {
        fromIv: 0,
        toIv: 0,
        percentage: 0,
      };
      this.tableDataDirectProductionSlots.push(rowBonus);
    },
    removeRowDirectProductionSlots(row) {
      const position = this.tableDataDirectProductionSlots.indexOf(row);
      if (this.tableDataDirectProductionSlots.length > 1) {
        this.tableDataDirectProductionSlots.splice(position, 1);
      } else {
        this.tableDataDirectProductionSlots = [
          {
            fromIv: 0,
            toIv: 0,
            percentage: 0,
          },
        ];
      }
    },
    moveRowUpDirectProductionSlots(row) {
      const position = this.tableDataDirectProductionSlots.indexOf(row);
      if (position >= 1) {
        arrayMove.mutate(this.tableDataDirectProductionSlots, position, position - 1);
      }
    },
    moveRowDownDirectProductionSlots(row) {
      const position = this.tableDataDirectProductionSlots.indexOf(row);
      if (position < this.tableDataDirectProductionSlots.length - 1) {
        arrayMove.mutate(this.tableDataDirectProductionSlots, position, position + 1);
      }
    },
    addRowIndirectProductionSlots() {
      const rowBonus = {
        fromIv: 0,
        toIv: 0,
        percentage: 0,
        roleId: {
          label: 'Tutti',
          value: 'all',
        },
      };
      this.tableDataIndirectProductionSlots.push(rowBonus);
    },
    removeRowIndirectProductionSlots(row) {
      const position = this.tableDataIndirectProductionSlots.indexOf(row);
      if (this.tableDataIndirectProductionSlots.length > 1) {
        this.tableDataIndirectProductionSlots.splice(position, 1);
      } else {
        this.tableDataIndirectProductionSlots = [
          {
            fromIv: 0,
            toIv: 0,
            percentage: 0,
            roleId: {
              label: 'Tutti',
              value: 'all',
            },
          },
        ];
      }
    },
    moveRowUpIndirectProductionSlots(row) {
      const position = this.tableDataIndirectProductionSlots.indexOf(row);
      if (position >= 1) {
        arrayMove.mutate(this.tableDataIndirectProductionSlots, position, position - 1);
      }
    },
    moveRowDownIndirectProductionSlots(row) {
      const position = this.tableDataIndirectProductionSlots.indexOf(row);
      if (position < this.tableDataIndirectProductionSlots.length - 1) {
        arrayMove.mutate(this.tableDataIndirectProductionSlots, position, position + 1);
      }
    },
    addRowSlots() {
      const rowBonus = {
        fromIv: 0,
        toIv: 0,
        percentage: 0,
      };
      this.tableDataSlots.push(rowBonus);
    },
    removeRowSlots(row) {
      const position = this.tableDataSlots.indexOf(row);
      if (this.tableDataSlots.length > 1) {
        this.tableDataSlots.splice(position, 1);
      } else {
        this.tableDataSlots = [
          {
            fromIv: 0,
            toIv: 0,
            percentage: 0,
          },
        ];
      }
    },
    moveRowUpSlots(row) {
      const position = this.tableDataSlots.indexOf(row);
      if (position >= 1) {
        arrayMove.mutate(this.tableDataSlots, position, position - 1);
      }
    },
    moveRowDownSlots(row) {
      const position = this.tableDataSlots.indexOf(row);
      if (position < this.tableDataSlots.length - 1) {
        arrayMove.mutate(this.tableDataSlots, position, position + 1);
      }
    },
    submit() {
      this.$v.form.$touch();
      if (!this.$v.form.$error) {
        const changedTableDataDirectProductionSlots = [];
        this.tableDataDirectProductionSlots.forEach((row) => {
          const rowOptions = {
            fromIv: Math.trunc(row.fromIv * 100),
            toIv: Math.trunc(row.toIv * 100),
            percentage: Math.trunc(row.percentage * 100),
          };
          if (rowOptions.fromIv !== 0 || rowOptions.toIv !== 0) {
            changedTableDataDirectProductionSlots.push(rowOptions);
          }
        });

        const changedTableDataIndirectProductionSlots = [];
        this.tableDataIndirectProductionSlots.forEach((row) => {
          const rowOptions = {
            fromIv: Math.trunc(row.fromIv * 100),
            toIv: Math.trunc(row.toIv * 100),
            percentage: Math.trunc(row.percentage * 100),
            roleId: row.roleId.value,
          };
          if (rowOptions.fromIv !== 0 || rowOptions.toIv !== 0) {
            changedTableDataIndirectProductionSlots.push(rowOptions);
          }
        });

        const changedTableDataSlots = [];
        this.tableDataSlots.forEach((row) => {
          const rowOptions = {
            fromIv: Math.trunc(row.fromIv * 100),
            toIv: Math.trunc(row.toIv * 100),
            percentage: Math.trunc(row.percentage * 100),
          };
          if (rowOptions.fromIv !== 0 || rowOptions.toIv !== 0) {
            changedTableDataSlots.push(rowOptions);
          }
        });

        const changedTableDataCashIn = [];
        this.tableDataCashIn.forEach((row) => {
          const rowOptions = {
            productId: row.productId.value,
            amount: Math.trunc(row.amount * 100),
          };
          if (rowOptions.productId !== 0) {
            changedTableDataCashIn.push(rowOptions);
          }
        });

        const changedCommissioning = {
          ...this.commissioning,
          directIrpefStyle: this.form.directIrpefStyle,
          indirectIrpefStyle: this.form.indirectIrpefStyle,
          advanceIndirectProductionPercentage: Math.trunc(
            this.form.advanceIndirectProductionPercentage * 100,
          ),
          advanceDirectProductionPercentage: Math.trunc(
            this.form.advanceDirectProductionPercentage * 100,
          ),
          purchase: {
            basis: {
              directProductionPercentage: Math.trunc(this.form.directProductionPercentage * 100),
              indirectProductionPercentage: Math.trunc(
                this.form.indirectProductionPercentage * 100,
              ),
            },
            range: {
              directProductionSlots: changedTableDataDirectProductionSlots,
              indirectProductionSlots: changedTableDataIndirectProductionSlots,
            },
            target: {
              slots: changedTableDataSlots,
            },
          },
          cashIn: changedTableDataCashIn,
        };
        this.saveConfigurationSheltiaCommissioning({
          idCommissioning: this.form.idCommissioning,
          body: changedCommissioning,
        }).then(() => {
          this.$q.notify({
            message: this.$t('configurationProduct.saveOk'),
            color: 'secondary',
            timeout: 300,
          });
        });
      } else {
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    cancel() {
      this.deleteConfigurationSheltiaCommissioning(this.form.idCommissioning).then(() => {
        this.$q.notify({
          message: this.$t('default.deleteOk'),
          color: 'secondary',
          timeout: 300,
        });
        this.$router.push('/configuration/sheltia-commissioning');
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
