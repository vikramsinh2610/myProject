<template>
  <div class="row no-wrap">
    <q-stepper
      class="no-shadow q-mr-sm min-w-170"
      vertical
      header-nav
      ref="stepper"
      v-model="personStep"
      active-color="secondary"
    >
      <q-step prefix="c" :order="1" name="contact" :title="$t('person.contact')" />
      <q-step prefix="f" :order="2" name="fiscal" :title="$t('person.fiscal')" />
      <q-step
        prefix="l"
        :order="3"
        name="legalAddress"
        :title="person.isCompany ? $t('person.companyLegalAddress') : $t('person.legalAddress')"
      />
      <q-step
        prefix="a"
        :order="4"
        name="address"
        :title="person.isCompany ? $t('person.companyAddress') : $t('person.address')"
      />
    </q-stepper>

    <prassi-person-contact
      class="col"
      v-if="personStep === 'contact'"
      :person="person"
      @changeData="savePersonClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-fiscal
      class="col"
      v-if="personStep === 'fiscal'"
      :person="person"
      @changeData="savePersonClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-address
      class="col"
      v-if="personStep === 'address'"
      :person="person"
      @changeData="savePersonClick"
      @nextStep="$refs.stepper.next()"
    />

    <prassi-person-legal-address
      class="col"
      v-if="personStep === 'legalAddress'"
      :person="person"
      @changeData="savePersonClick"
      @nextStep="$refs.stepper.next()"
    />

    <q-page-sticky
      v-if="$user.roleID >= 7"
      position="bottom-right"
      :offset="[18, 18]"
      class="first-menu"
    >
      <q-fab icon="fa fa-chevron-up" active-icon="fa fa-times" direction="up" color="secondary">
        <q-fab-action @click="addNewPracticeClick" color="secondary" icon="fa fa-plus-white">
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('customer.addCustomerContract') }}
          </q-tooltip>
        </q-fab-action>
        <q-fab-action
          v-if="$user.roleID >= 7"
          @click="deletePersonClick"
          color="red"
          icon="fa fa-trash"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :content-style="{ 'background-color': '#354052', 'font-size': '14px' }"
          >
            {{ $t('customer.deleteCustomer') }}
          </q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-page-sticky>

    <q-dialog v-model="showDelPersonDialog">
      <q-card style="width: 800px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            {{ $t('person.confirmDelete') }}
          </div>
        </q-card-section>
        <q-card-section>
          <prassi-standard-button
            color="red"
            :label="$t('configurationProduct.delete')"
            @click="deletePersonConfirmed"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import PrassiPersonContact from '../person/prassi-person-contact';
import PrassiPersonFiscal from '../person/prassi-person-fiscal';
import PrassiPersonAddress from '../person/prassi-person-address';
import PrassiPersonLegalAddress from '../person/prassi-person-legal-address';

export default {
  name: 'PrassiPersonEdit',
  components: {
    PrassiPersonFiscal,
    PrassiPersonContact,
    PrassiPersonAddress,
    PrassiPersonLegalAddress,
  },
  data() {
    return {
      personStep: 'contact',
      showDelPersonDialog: false,
    };
  },
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    person: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    ...mapActions({
      savePerson: 'dossiers/savePerson',
      deletePerson: 'dossiers/deletePerson',
    }),
    addNewPracticeClick() {
      this.$utils.log('PRASSI-PERSON-EDIT', 'addNewPracticeClick');
      const { id } = this.$route.params;
      const msId = id.split('-');
      const msId1 =
        msId[0].slice(6, 8) + msId[0].slice(4, 6) + msId[0].slice(2, 4) + msId[0].slice(0, 2);
      const msId2 = msId[1].slice(2, 4) + msId[1].slice(0, 2);
      const msId3 = msId[2].slice(2, 4) + msId[2].slice(0, 2);
      window.open(
        `${this.$env.legacyBaseUrl}/#/nuovaProposta/${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}`,
        '_self',
      );
    },
    deletePersonClick() {
      this.$utils.log('PRASSI-PERSON-EDIT', 'deletePersonClick');
      this.showDelPersonDialog = true;
    },
    deletePersonConfirmed() {
      this.$utils.logobj('PRASSI-PERSON-EDIT', 'deletePersonConfirmed', this.person.id);
      this.deletePerson({
        personId: this.person.id,
      }).then(() => {
        this.$utils.log('PRASSI-PERSON-EDIT', 'deletePerson');
        this.$nextTick().then(() => {
          this.$q.notify({
            message: this.$t('person.deletedOk'),
            color: 'secondary',
            timeout: 300,
          });

          this.$router.push('/persons');
        });
      });
    },

    // eslint-disable-next-line sonarjs/cognitive-complexity
    savePersonClick(item) {
      this.$utils.logobj('PRASSI-PERSON-EDIT', 'savePersonClick item', item);
      this.savePerson({
        body: item,
        // eslint-disable-next-line sonarjs/no-identical-functions
      }).then(async () => {
        this.$utils.log('PRASSI-PERSON-EDIT', 'savePersonClick');
        this.$q.notify({
          message: this.$t('person.savedOk'),
          color: 'secondary',
          timeout: 300,
        });
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-stepper
  background-color white
  border-radius 4px
  border solid 1px $card-border
.first-menu
  bottom 70px
</style>
