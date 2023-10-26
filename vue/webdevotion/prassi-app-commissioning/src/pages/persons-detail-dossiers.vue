<template>
  <div class="fill-available column">
    <prassi-persons-dossier-list
      ref="dossierList"
      :is-fetching="isFetching"
      :dossiers="dossiers"
      :roles="roles"
      @loadMore="loadMoreDossiers"
      @viewDossier="viewDossier($event)"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import PrassiPersonsDossierList from '../components/dossier/prassi-persons-dossier-list';
import CONSTANTS from '../constants';

export default {
  name: 'PersonsDetailDossiers',
  components: {
    PrassiPersonsDossierList,
  },
  data() {
    return {
      showAddDialog: false,
      showDelDialog: false,
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
      personTypeList: [
        {
          label: 'Assicurato',
          value: 1,
        },
        {
          label: 'Procuratore',
          value: 2,
        },
        {
          label: 'Beneficiario',
          value: 3,
        },
        {
          label: 'Titolare effettivo',
          value: 4,
        },
        {
          label: 'Legale rappresentante',
          value: 5,
        },
        {
          label: 'Contraente',
          value: 6,
        },
        {
          label: 'Beneficiario complementari',
          value: 7,
        },
        {
          label: 'Contraente EuropAssistance',
          value: 8,
        },
        {
          label: 'Assicurato EuropAssistance',
          value: 9,
        },
        {
          label: 'Commercialista',
          value: 10,
        },
        {
          label: 'Persona Collegata',
          value: 11,
        },
        {
          label: 'Referente Aziendale',
          value: 12,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      error: (state) => state.error.error,
      dossiers: (state) => state.dossiers.dossiers.items,
      last: (state) => state.dossiers.dossiers.lastRecord,
      isFetching: (state) => state.error.isFetching,
      roles: (state) => state.promoters.roles.items,
      token: (state) => state.login.token,
      loginId: (state) => state.login._id,
    }),
  },
  methods: {
    ...mapActions({
      fetchPersonDossiers: 'dossiers/fetchPersonDossiers',
    }),
    ...mapMutations({
      resetDossiers: 'dossiers/resetDossiers',
    }),
    viewDossier(item) {
      this.$utils.logobj('AAA PERSONS-DETAIL-DOSSIERS', 'viewDossier', item);

      let page = 'contratto';

      const isVA = item.practiceType === 'additional-income';
      const doVA = () => {
        const relatedContractId = this.dossiers.find((c) => c.contractId === item.contractId);
        if (!relatedContractId) throw new Error("Can't find related contract for VA proposal");

        return `versamentoAggiuntivo/${relatedContractId.legacyViewId}`;
      };

      // se bozza su pratica,
      // se inviabile true su pacchetto
      // e se poi è in vigore su contratto
      // https://github.com/EleverSrl/prassi-app-commissioning/issues/867

      if (item.status === CONSTANTS.practiceStatus.BOZZA) {
        if (item.practiceType === 'subscription') page = 'dettaglioProposta';
        if (isVA) page = doVA();

        if (item.isSendable) {
          page = 'dettaglioPacchettoProposta';
          if (isVA) page = doVA();
        }
      }

      const url = `${this.$env.legacyBaseUrl}/#/${page}/${item.legacyViewId}?token=${this.token}`;
      window.open(url, '_self');
    },
    // eslint-disable-next-line no-unused-vars
    loadMoreDossiers({ index, done }) {
      if (this.last || this.error) {
        this.$refs.dossierList.stopScrolling();
      } else {
        this.$utils.logobj('PERSON-DETAIL-DOSSIERS', 'loadMoreDossiers', index);
        this.fetchPersonDossiers({
          customerId: this.$route.params.id,
          promoterId: this.loginId,
        }).finally(() => done());
      }
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
