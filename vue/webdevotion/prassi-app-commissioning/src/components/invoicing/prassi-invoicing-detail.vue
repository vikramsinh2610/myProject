<template>
  <div>
    <prassi-navigate
      v-if="!notNavigate && !onlyDetails && !readonly"
      :button="!readonly"
      :button-label="buttonLabel"
      @buttonClicked="$emit(confirmOrRemove, invoice._id)"
      @backwardClicked="$emit('previous', invoice._id)"
      @forwardClicked="$emit('next', invoice._id)"
    />

    <prassi-body-list
      v-if="!onlyDetails"
      class="body-promoter-class"
      no-bottom-border
      :blocks="myBodyPromoter()"
      id="0"
      :menu="!confirmed && !readonly"
      menu-icon="fa fa-edit "
      @menuClick="changeTaxRegime"
    />

    <prassi-header-list
      v-if="!onlyDetails"
      class="p-item"
      :blocks="myHeaderMain"
      :placeholder="!confirmed && !readonly"
      menu-delete
      no-scrollbar
    />
    <div style="height: 6px" />

    <prassi-empty-list
      v-if="
        invoice.accountingNotes &&
        invoice.accountingNotes.length === 0 &&
        !isFetching &&
        !onlyDetails
      "
    />

    <div class="p-item" v-for="note in invoice.accountingNotes" :key="note._id">
      <prassi-body-list
        :blocks="myBody(note, true)"
        :id="note._id"
        menu-delete
        :hide-menu-delete="
          !(note.additionalData.kpi && note.additionalData.kpi.length > 0) &&
          !(note.additionalData.installments && note.additionalData.installments.length > 0)
        "
        delete-icon="fa fa-list-ol"
        :menu="!confirmed && !readonly"
        menu-icon="fa fa-times"
        @menuClick="$emit('removeNote', $event)"
        @deleteClick="showKpisOrInstallments($event)"
      />
    </div>

    <div style="height: 10px" />

    <prassi-body-list
      v-if="!invoice.issued && !onlyDetails && !confirmed"
      class="body-promoter-class"
      no-bottom-border
      :blocks="myBodyPromoterNotIncluded()"
      id="1"
    />

    <prassi-header-list
      v-if="!invoice.issued && !confirmed"
      class="p-item"
      :blocks="myHeader"
      :placeholder="!confirmed && !readonly"
      :menu-delete="!readonly"
      no-scrollbar
    />
    <div style="height: 6px" />

    <prassi-empty-list v-if="notes.length === 0 && !isFetching && !invoice.issued" />

    <div class="p-item" v-for="extraNote in notes" :key="extraNote._id">
      <prassi-body-list
        v-if="!invoice.issued && !confirmed"
        :menu-delete="!onlyDetails && !readonly"
        delete-icon="fa fa-check"
        :blocks="myBody(extraNote, false)"
        :id="extraNote._id"
        :menu="!confirmed && !readonly"
        @menuClick="menuClick($event)"
        @deleteClick="$emit('addNote', $event)"
      />
    </div>
    <div class="full-width q-pa-xl" />

    <q-dialog v-model="showDossiersDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('commissioning.dossiersDialog') }}</div>
        </q-card-section>
        <q-card-section>
          <q-table
            class="q-my-lg"
            :pagination.sync="pagination"
            :data="tableDataInstallments"
            :columns="columnsInstallments"
            row-key="name"
          >
            <q-tr slot="header" slot-scope="props" :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <div>{{ col.label }}</div>
                <div>{{ col.option ? computeProduct(col.option) : '' }}</div>
              </q-th>
            </q-tr>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showKpiDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('invoicing.kpiDialog') }}</div>
        </q-card-section>
        <q-card-section>
          <q-table
            class="q-my-lg"
            :pagination.sync="pagination"
            :data="tableData"
            :columns="columns"
            row-key="name"
          >
            <q-tr slot="header" slot-scope="props" :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <div>{{ col.label }}</div>
                <div>{{ col.option ? computeProduct(col.option) : '' }}</div>
              </q-th>
            </q-tr>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showChangeTaxDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('invoicing.changeTaxDialog') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="column justify-between">
            <q-select
              class="col-6"
              v-model="companySelected"
              :label="$t('invoicing.companyNames')"
              :options="headingsList"
            />
            <q-input v-model="invoiceHeading.name" type="text" :label="$t('invoicing.name')" />
            <q-input
              v-model="invoiceHeading.vatNumber"
              type="text"
              :label="$t('invoicing.vatNumber')"
            />
            <q-input
              v-model="invoiceHeading.fiscalCode"
              type="text"
              :label="$t('invoicing.fiscalCode')"
            />
            <q-input v-model="invoiceHeading.prefix" type="text" :label="$t('invoicing.prefix')" />
            <q-input
              v-model="invoiceHeading.address.route"
              type="text"
              :label="$t('invoicing.route')"
            />
            <q-input
              v-model="invoiceHeading.address.houseNumber"
              type="text"
              :label="$t('invoicing.houseNumber')"
            />
            <q-input
              v-model="invoiceHeading.address.postalCode"
              type="text"
              :label="$t('invoicing.postalCode')"
            />
            <q-input
              v-model="invoiceHeading.address.city"
              type="text"
              :label="$t('invoicing.city')"
            />
            <q-input
              v-model="invoiceHeading.address.province"
              type="text"
              :label="$t('invoicing.province')"
            />
            <q-input
              v-model="invoiceHeading.address.country"
              type="text"
              :label="$t('invoicing.country')"
            />
            <q-select
              class="col-6"
              v-model="taxRegime"
              :label="$t('invoicing.taxRegimeList')"
              :options="taxRegimeList"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button :label="$t('default.changeButton')" @click="comfirmChangeTax" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import PrassiHeaderList from '../base/prassi-header-list';
import PrassiBodyList from '../base/prassi-body-list';
import PrassiNavigate from '../base/prassi-navigate';
import PrassiEmptyList from '../base/prassi-empty-list';
import useHeadings from '../../compositions/base/invoice-headings';

export default {
  name: 'PrassiInvoicingDetail',
  setup() {
    const { headingsList } = useHeadings();
    return { headingsList };
  },
  components: {
    PrassiNavigate,
    PrassiHeaderList,
    PrassiBodyList,
    PrassiEmptyList,
  },
  data() {
    return {
      showChangeTaxDialog: false,
      showKpiDialog: false,
      showDossiersDialog: false,
      taxRegime: undefined,
      companySelected: undefined,
      companyNames: [
        {
          label: 'company1',
          value: {
            name: '1',
            vatNumber: '1',
            fiscalCode: '1',
            prefix: 'c1',
            address: {
              route: '1',
              houseNumber: '1',
              postalCode: '1',
              city: '1',
              province: '1',
              country: '1',
            },
          },
        },
        {
          label: 'company2',
          value: {
            name: '2',
            vatNumber: '2',
            fiscalCode: '2',
            prefix: 'c2',
            address: {
              route: '2',
              houseNumber: '2',
              postalCode: '2',
              city: '2',
              province: '2',
              country: '2',
            },
          },
        },
      ],
      invoiceHeading: {
        name: '',
        vatNumber: '',
        fiscalCode: '',
        prefix: '',
        address: {
          route: '',
          houseNumber: '',
          postalCode: '',
          city: '',
          province: '',
          country: '',
        },
      },
      pagination: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      columns: [
        {
          name: 'premium',
          currency: true,
          required: true,
          label: this.$t(`promoterInsertLetter.premium`),
          align: 'left',
          field: 'premium',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
        },
      ],
      columnsInstallments: [
        {
          name: 'cashin',
          currency: true,
          required: true,
          label: this.$t(`commissioning.cashin`),
          align: 'left',
          field: 'cashin',
        },
        {
          name: 'practiceType',
          currency: true,
          required: true,
          label: this.$t(`commissioning.practiceType`),
          align: 'left',
          field: 'practiceType',
        },
        {
          name: 'dossierId',
          currency: true,
          required: true,
          label: this.$t(`commissioning.dossierId`),
          align: 'left',
          field: 'dossierId',
        },
        {
          name: 'installment',
          currency: true,
          required: true,
          label: this.$t(`commissioning.installment`),
          align: 'left',
          field: 'installment',
        },
        {
          name: 'productivePeriod',
          currency: true,
          required: true,
          label: this.$t(`commissioning.productivePeriod`),
          align: 'left',
          field: 'productivePeriod',
        },
        {
          name: 'indirect',
          currency: true,
          required: true,
          label: this.$t(`commissioning.indirect`),
          align: 'left',
          field: 'indirect',
        },
        {
          name: 'iv',
          currency: true,
          required: true,
          label: this.$t(`commissioning.iv`),
          align: 'left',
          field: 'iv',
          format: (value) => `${this.$n(value, 'nodecimals')}`,
        },
      ],
      tableData: [],
      tableDataInstallments: [],
      taxRegimeList: [
        {
          label: 'Non impostato',
          value: 'no-regime',
        },
        {
          label: 'Dipendente',
          value: 'employee',
        },
        {
          label: 'Dipendente Collaboratore',
          value: 'employee-collaborator',
        },
        {
          label: 'Ordinario',
          value: 'ordinary',
        },
        {
          label: 'Ordinario Ridotto',
          value: 'ordinary-reduced',
        },
        {
          label: 'Agevolato',
          value: 'minimum',
        },
        {
          label: 'Occasionale',
          value: 'occasional-performance',
        },
        {
          label: 'Forfettario',
          value: 'flat',
        },
      ],
      myHeaderMain: [
        {
          _id: '-1',
          label: 'invoicing.type',
          sublabel: 'invoicing.description',
          size: 'small',
          weight: 'normal',
          width: 350,
          col: true,
        },
        {
          _id: '0',
          label: 'invoicingHeader.productivePeriod',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 130,
        },
        {
          _id: '1',
          label: 'invoicing.objective',
          sublabel: 'invoicing.deadline',
          size: 'small',
          weight: 'normal',
          width: 110,
        },
        {
          _id: '2',
          label: 'invoicing.percentage',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 80,
        },
        {
          _id: '3',
          label: 'invoicing.totalMonth',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 110,
        },
        {
          _id: '5',
          label: 'invoicing.totalInvoice',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 120,
        },
      ],
      myHeader: [
        {
          _id: '-1',
          label: 'invoicing.type',
          sublabel: 'invoicing.description',
          size: 'small',
          weight: 'normal',
          width: 110,
          col: true,
        },
        {
          _id: '0',
          label: 'invoicingHeader.productivePeriod',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 130,
        },
        {
          _id: '1',
          label: 'invoicing.objective',
          sublabel: 'invoicing.deadline',
          size: 'small',
          weight: 'normal',
          width: 110,
        },
        {
          _id: '2',
          label: 'invoicing.percentage',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 80,
        },
        {
          _id: '3',
          label: '',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 110,
        },
        {
          _id: '4',
          label: 'invoicing.totalNote',
          sublabel: '',
          size: 'small',
          weight: 'light',
          width: 110,
        },
      ],
    };
  },
  props: {
    invoice: {
      type: Object,
      default: () => ({
        accountingNotes: [],
        heading: {
          name: '',
          vatNumber: '',
          fiscalCode: '',
          prefix: '',
          address: {
            route: '',
            houseNumber: '',
            postalCode: '',
            city: '',
            province: '',
            country: '',
          },
        },
      }),
    },
    notes: {
      type: Array,
      default: () => [],
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    notNavigate: {
      type: Boolean,
      default: false,
    },
    onlyDetails: {
      type: Boolean,
      default: false,
    },
    products: {
      type: Array,
      default: () => [],
    },
    roles: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    buttonLabel() {
      return this.confirmed
        ? this.$t('invoicing.unconfirmLabel')
        : this.$t('invoicing.confirmLabel');
    },
    confirmOrRemove() {
      return this.confirmed ? 'remove' : 'confirm';
    },
    totalNotIncluded() {
      // eslint-disable-next-line unicorn/no-reduce
      return this.notes.reduce((acc, el) => acc + el.amount, 0);
    },
  },
  watch: {
    companySelected: {
      immediate: true,
      handler(company) {
        this.$utils.logobj('PRASSI-INVOICING-DETAIL', 'company', company);
        if (company && company.value && company.value.name) {
          this.invoiceHeading = company.value;
        }
      },
    },
    invoice: {
      immediate: true,
      handler(invoice) {
        this.$utils.logobj('PRASSI-INVOICING-DETAIL', 'invoice', invoice);
        if (invoice && invoice.heading && invoice.heading.name) {
          this.invoiceHeading = invoice.heading;
        }
      },
    },
  },
  methods: {
    comfirmChangeTax() {
      if (this.taxRegime) {
        this.$emit('changeTax', {
          taxRegime: this.taxRegime.value,
          invoiceHeading: this.invoiceHeading,
        });
        this.showChangeTaxDialog = false;
      } else {
        this.error = true;
        this.$q.notify(this.$t('default.cantSave'));
      }
    },
    changeTaxRegime() {
      this.$utils.log('INVOICING-DETAIL', 'changTaxRegime');
      this.taxRegime = {
        label: this.taxRegimeList.find((el) => this.invoice.taxRegimeType === el.value).label,
        value: this.invoice.taxRegimeType,
      };
      this.showChangeTaxDialog = true;
    },
    showKpisOrInstallments(id) {
      const note = this.invoice.accountingNotes.find((el) => el._id === id);
      if (!note) return;

      if (note.additionalData.installments && note.additionalData.installments.length > 0) {
        this.showInstallmentsKpis(note);
      } else {
        this.computeKpis(note);
      }
    },
    // eslint-disable-next-line no-unused-vars
    showInstallmentsKpis(note) {
      this.tableDataInstallments = [];
      note.additionalData.installments.forEach((el) => {
        this.tableDataInstallments.push({
          practiceType: el.practiceType.slice(0, 3),
          dossierId: el.dossierId,
          cashin: el.cashin,
          installment: el.installment,
          productivePeriod: el.productivePeriod,
          practiceId: el.practiceId,
          indirect: el.indirect,
          iv: el.iv / 100,
        });
      });
      this.showDossiersDialog = true;
    },
    // eslint-disable-next-line sonarjs/cognitive-complexity
    computeKpis(note) {
      this.columns = [
        {
          name: 'premium',
          currency: true,
          required: true,
          label: this.$t(`promoterInsertLetter.premium`),
          align: 'left',
          field: 'premium',
          format: (value) => `${this.$n(value, 'nodecimals')}€`,
        },
      ];
      this.tableData = [];

      const rowTarget = {
        premium: note.additionalData.targetAmount / 100,
        label: 'Target',
      };
      const rowActual = {
        premium: note.additionalData.accruedAmount / 100,
        label: 'Attuale',
      };
      note.additionalData.kpi.forEach((cc) => {
        // eslint-disable-next-line no-unreachable
        if (cc.targets[0]) {
          const columnName =
            cc.targets[0].kpi._id +
            (cc.targets[0].kpi.options && cc.targets[0].kpi.options.productId
              ? cc.targets[0].kpi.options.productId
              : '');

          rowTarget[columnName] = cc.targets[0].targetValue / 100;
          rowActual[columnName] = cc.targets[0].kpi.value / 100;

          if (this.columns.findIndex((col) => col.name === columnName) === -1) {
            this.columns.unshift({
              name: columnName,
              currency: 'currency',
              originalName: cc.targets[0].kpi._id,
              required: true,
              label: this.$t(`promoterInsertLetter.${cc.targets[0].kpi._id}-SMALL`),
              option: cc.targets[0].kpi.options ? cc.targets[0].kpi.options.productId : undefined,
              align: 'left',
              field: columnName,
              format: (value) => `${this.$n(value, 'nodecimals')}`,
            });
          }
        }
      });
      this.columns.unshift({
        name: 'type',
        required: true,
        label: 'Tipo',
        option: undefined,
        align: 'left',
        field: 'label',
      });
      this.tableData.push(rowTarget);
      this.tableData.push(rowActual);
      this.showKpiDialog = true;
    },
    computeProduct(id) {
      const product = this.products.find((el) => el._id === id);
      return product ? product.name : '';
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
    myBodyPromoter() {
      return [
        {
          _id: '-1',
          label: this.$t('invoicing.includedNotes'),
          size: 'small',
          weight: 'normal',
          width: 160,
          type: '2rows',
        },
        {
          _id: '0',
          label: this.invoice.promoterDisplayName,
          sublabel: this.invoice.promoterNetworkPath,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, this.invoice.promoterRoleId),
          size: 'small',
          weight: 'normal',
          width: 274,
          type: '2rows',
          col: true,
        },
        {
          _id: '0.1',
          label: this.$t(`invoicing.${this.invoice.taxRegimeType}`),
          sublabel: this.$t('invoicing.tax'),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '1',
          label: this.$utils.getRoleShortName(this.roles, this.invoice.promoterRoleId),
          sublabel: this.$t('invoicing.role'),
          size: 'medium',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '2',
          label:
            this.invoice.directCommissionsAmount || this.invoice.indirectCommissionsAmount
              ? `${this.$n(
                  (this.invoice.directCommissionsAmount + this.invoice.indirectCommissionsAmount) /
                    100,
                  'nodecimals',
                )}€`
              : '-',
          sublabel: this.$t('invoicing.totalIncome'),
          size: 'medium',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '3',
          label: this.invoice.otherAmount
            ? `${this.$n(this.invoice.otherAmount / 100, 'nodecimals')}€`
            : '-',
          sublabel: this.$t('invoicing.totalOther'),
          size: 'medium',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '4',
          label: this.invoice.grossAmount
            ? `${this.$n(this.invoice.grossAmount / 100, 'nodecimals')}€`
            : '0',
          sublabel: this.$t('invoicing.totalGross'),
          size: this.invoice.grossAmount >= 0 ? 'medium' : 'red',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
      ];
    },
    myBodyPromoterNotIncluded() {
      return [
        {
          _id: '-1',
          label: this.$t('invoicing.extraNotes'),
          size: 'small',
          weight: 'normal',
          width: 160,
          type: '2rows',
        },
        {
          _id: '0',
          label: this.invoice.promoterDisplayName,
          sublabel: this.invoice.promoterNetworkPath,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, this.invoice.promoterRoleId),
          size: 'small',
          weight: 'normal',
          width: 274,
          type: '2rows',
          col: true,
        },
        {
          _id: '1',
          label: this.$utils.getRoleShortName(this.roles, this.invoice.promoterRoleId),
          sublabel: this.$t('invoicing.role'),
          size: 'medium',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '2',
          label: '',
          size: 'medium',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '3',
          label: '',
          size: 'medium',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: '4',
          label: this.totalNotIncluded
            ? `${this.$n(this.totalNotIncluded / 100, 'nodecimals')}€`
            : '0',
          sublabel: this.$t('invoicing.totalGross'),
          size: this.totalNotIncluded >= 0 ? 'medium' : 'red',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
      ];
    },
    myBody(note, main) {
      return [
        {
          _id: '-1',
          type: 'chip',
          icon: 'fa fa-check',
          chipText: this.$t(`invoicingChipText.${note.origin.replace(/\+/g, '-')}`),
        },
        {
          _id: '0',
          label: this.getType(note),
          sublabel: note.description,
          size: 'small',
          weight: 'normal',
          width: 350,
          type: '2rows',
          col: true,
        },
        {
          _id: '1',
          label: `${this.$utils.numberToMonth(note.productivePeriodMonth, this.$t.bind(this))} ${
            note.productivePeriodYear
          }`,
          size: 'medium',
          weight: 'normal',
          width: 130,
          type: '2rows',
        },
        {
          _id: '2',
          label:
            note.additionalData && note.additionalData.targetAmount
              ? `${this.$n(note.additionalData.targetAmount / 100, 'nodecimals')}€`
              : '-',
          sublabel:
            note.additionalData && note.additionalData.expireDate
              ? this.$utils.isoToDisplayDate(note.additionalData.expireDate, this.$d.bind(this))
              : '-',
          size: 'medium',
          weight: 'normal',
          width: 110,
          type: '2rows',
        },
        {
          _id: '3',
          label:
            note.additionalData && note.additionalData.targetPercentage
              ? `${this.$n(note.additionalData.targetPercentage / 100)}%`
              : '-',
          size: 'small',
          weight: 'normal',
          width: 80,
          type: '2rows',
        },
        !main
          ? {
              _id: '4',
              label: '',
              size: 'medium',
              weight: 'light',
              width: 110,
              type: '2rows',
            }
          : undefined,
        {
          _id: '5',
          label: note.amount ? `${this.$n(note.amount / 100, 'nodecimals')}€` : '-',
          size: 'medium',
          weight: 'light',
          width: 110,
          type: '2rows',
        },
        main
          ? {
              _id: '6',
              label: note.invoiceAmount
                ? `${this.$n(note.invoiceAmount / 100, 'nodecimals')}€`
                : '0',
              size: 'medium',
              weight: 'light',
              width: 120,
              type: '2rows',
            }
          : undefined,
      ];
    },
    getType(note) {
      if (note.origin !== 'manual-import') {
        return (
          this.$t(`invoicing.${note.origin.replace(/\+/g, '-')}`) +
          (note.netToPay ? ' (integrazione al netto)' : '')
        );
      }
      return this.$t(`invoicing.${note.type.replace(/\+/g, '-')}`);
    },
    menuClick(param) {
      this.$utils.logobj('PRASSI-INVOICING-DETAIL', 'menuClick', param);
      const actions = [
        {
          label: this.$t('invoicing.edit'),
          icon: 'fa fa-edit',
          color: 'black',
          handler: () => {
            this.$utils.logobj('PRASSI-INVOICING-DETAIL', 'edit', param);
            this.$emit('editNote', param);
          },
        },
        {
          label: this.$t('invoicing.delete'),
          icon: 'fa fa-trash',
          color: 'red',
          handler: () => {
            this.$utils.logobj('PRASSI-INVOICING-DETAIL', 'remove', param);
            this.$emit('deleteNote', param);
          },
        },
      ];

      if (!this.onlyDetails) {
        actions.unshift({
          label: this.$t('invoicing.add'),
          icon: 'fa fa-check',
          color: 'green',
          handler: () => {
            this.$utils.logobj('PRASSI-INVOICING-DETAIL', 'add', param);
            this.$emit('addNote', param);
          },
        });
      }

      this.$q
        .bottomSheet({
          dismissLabel: 'Quit',
          actions,
        })
        .onOk((action) => {
          action.handler();
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-item
  padding-left 10px
.body-promoter-class
  border-bottom-right-radius 0
  border-bottom-left-radius 0
  border-top solid 1px $card-border
  border-left solid 1px $card-border
  border-right solid 1px $card-border
  border-bottom solid 0 $card-border !important
  height 60px
</style>
