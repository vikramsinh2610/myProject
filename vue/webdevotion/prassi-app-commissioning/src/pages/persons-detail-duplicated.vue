<template>
  <div class="fill-available column">
    <prassi-person-list-duplicates
      ref="customerList"
      :customers="customers"
      :roles="roles"
      :is-fetching="isFetching || pendingList"
      :show-progress="pendingList"
      @sort="sortCustomers"
      @loadMore="loadMoreCustomers"
      @viewClick="viewCustomerLegacy"
      @detailClick="gotoCustomer"
      @emailClick="emailCustomer"
      @downloadCustomer="downloadCustomer"
      @addCustomer="addCustomer"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import PrassiPersonListDuplicates from '../components/customer/prassi-person-list-duplicates';

export default {
  name: 'PersonsDetailDuplicated',
  components: {
    PrassiPersonListDuplicates,
  },
  data() {
    return {
      showAddDialog: false,
      showDelDialog: false,
      pendingSummary: false,
      pendingSummaryPrevious: false,
      pendingList: false,
      personToDelete: '',
      form: {
        // eslint-disable-next-line unicorn/no-null
        id: null,
        personId: '',
        // eslint-disable-next-line unicorn/no-null
        personType: null,
        // eslint-disable-next-line unicorn/no-null
        personTypeKey: null,
        linkedPersonId: '',
        // eslint-disable-next-line unicorn/no-null
        linkedPerson: null,
      },
    };
  },
  created() {
    this.resetPromoterSearch();
    this.resetDossiersSearch();
  },
  mounted() {
    this.resetPromoterSearch();
    this.resetDossiersSearch();
    this.setCustomerFilterAll({
      ...this.filter,
      promoterId: this.filter.promoterId === 'no-selection' ? this.loginId : this.filter.promoterId,
      fiscalCode: this.person.fiscalCode,
    });
    this.resetCustomers();
  },
  computed: {
    ...mapState({
      person: (state) => state.dossiers.customer,
      error: (state) => state.error.error,
      customers: (state) => state.dossiers.customers.items,
      loginId: (state) => state.login._id,
      last: (state) => state.dossiers.customers.lastRecord,
      filter: (state) => state.dossiers.filter,
      isFetching: (state) => state.error.isFetching,
      roles: (state) => state.promoters.roles.items,
    }),
  },
  methods: {
    ...mapActions({
      fetchPersons: 'dossiers/fetchPersons',
    }),
    ...mapMutations({
      setCustomerFilterAll: 'dossiers/setCustomerFilterAll',
      resetCustomers: 'dossiers/resetCustomers',
      resetPromoterSearch: 'promoters/resetPromoterSearch',
      resetDossiersSearch: 'dossiers/resetDossiersSearch',
    }),
    // eslint-disable-next-line no-unused-vars
    loadMoreCustomers({ index, done }) {
      this.$utils.log('PERSONS', `loadMoreCustomers called: ${index}`);
      if (this.last || this.error) {
        this.$refs.customerList.stopScrolling();
        this.pendingList = false;
      } else {
        this.fetchPersons(this.filter.fields.promoterId || this.loginId).finally(() => {
          this.pendingList = false;
          done();
        });
      }
    },
    gotoPerson(person) {
      this.$utils.logobj('PERSON-DETAIL-PERSONS', 'gotoPerson', person);
      this.$router.push(`/persons/${person.uuid}`);
    },
    sortCustomers(sort) {
      this.$utils.logobj('PERSONS', 'sortCustomers', sort);
      this.pendingList = true;
      this.setPromotersSorting(sort);
      this.resetCustomers();
    },
    filterNames(value, update) {
      update(() => {
        const needle = value.toLowerCase();
        this.optionsNamesList = this.names
          .filter((v) => v.name.toLowerCase().includes(needle))
          .map((el) => el.name);
      });
    },
    emailCustomer(customer) {
      this.$utils.logobj('PERSONS', 'emailCustomer', customer);
      window.location.href = `mailto:${customer.email}`;
    },
    gotoCustomer(customer) {
      this.$utils.logobj('PERSONS', 'gotoCustomer', customer);
      this.$router.push(`/persons/${customer._id}`);
    },
    viewCustomerLegacy(id) {
      this.$utils.logobj('PERSONS', 'viewCustomerLegacy', id);
      this.$router.push(`/persons/${id}`);
    },
    downloadCustomer() {
      this.$utils.log('PERSONS-DETAIL', 'downloadCustomer');
      this.$q.loading.show({ delay: 200 });
      this.fetchCustomerExport(this.filter.fields.promoterId || this.loginId)
        .then(() => {
          this.changeExportInProgressState(true);
          this.changeExportCompletedState(false);
          this.myExportTimer = setInterval(() => {
            this.fetchExportUrl(this.exportId).then(async () => {
              if (this.document.found) {
                this.changeExportInProgressState(false);
                this.changeExportCompletedState(true);
                clearInterval(this.myExportTimer);
              }
            });
          }, 5000);
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },
    addCustomer() {
      this.$utils.log('PERSONS-DETAIL', 'addCustomer');
      this.addCustomerDialog = true;
    },
    comfirmAddCustomer() {
      if (this.customerType === '1') {
        this.$utils.logobj('PERSONS-DETAIL', 'comfirmAddCustomer', this.customerData);
        this.$v.customerData.$touch();

        if (!this.$v.customerData.$error) {
          this.$utils.logobj('PERSONS-DETAIL', 'comfirmAddCustomer', this.customerData);
          this.executeAddCustomer();
          this.addCustomerDialog = false;
        } else {
          this.$q.notify(this.$t('default.cantSave'));
        }
      } else {
        this.$v.customerDataCompany.$touch();

        if (!this.$v.customerDataCompany.$error) {
          this.$utils.logobj('PERSONS-DETAIL', 'comfirmAddCustomer', this.customerDataCompany);
          this.executeAddCustomer();
          this.addCustomerDialog = false;
        } else {
          this.$q.notify(this.$t('default.cantSave'));
        }
      }
    },
    executeAddCustomer() {
      this.$utils.log('PERSONS-DETAIL', 'executeAddCustomer');
      const thisCustomerToInsert = {
        ...(this.customerType === '1' ? this.customerData : this.customerDataCompany),
        type: this.customerType,
      };
      this.pendingList = true;
      this.pendingSummary = true;
      this.pendingSummaryPrevious = true;
      this.createCustomer({
        body: thisCustomerToInsert,
      })
        .then(() => {
          this.$q.notify({
            message: this.$t('customer.notifyCustomerAdded'),
            color: 'secondary',
            timeout: 300,
          });
          this.viewCustomerLegacy(this.customer._id);
        })
        .finally(() => {
          this.pendingList = false;
          this.pendingSummary = false;
          this.pendingSummaryPrevious = false;
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
.p-centered-container
  margin 0 auto
  min-width 960px
  max-width fit-content
</style>
