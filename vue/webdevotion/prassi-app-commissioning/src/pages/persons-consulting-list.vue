<template>
  <div>
    <prassi-header-list class="p-pl-item header-sub" :blocks="consultingHeader" />
    <div
      v-for="consulting in consultingList /*.filter((x) => x.type === 'noninv') */"
      :key="consulting._id"
      @click="() => consultingClick(consulting)"
      class="link-card"
    >
      <prassi-body-list
        class="q-card-thin"
        :blocks="consultingBody(consulting)"
        :id="'consulting body'"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import PrassiHeaderList from '../components/base/prassi-header-list';
import PrassiBodyList from '../components/base/prassi-body-list';

const parseDate = (v) => (v ? moment(v).format('DD/MM/YYYY') : '-');

export default {
  name: 'PersonConsultingList',
  components: { PrassiHeaderList, PrassiBodyList },

  async mounted() {
    const customerId = this.$route.params.id;
    await this.fetchConsultingList({ customerId });
    await this.fetchRoles();
  },

  computed: {
    ...mapState({
      token: (state) => state.login.token,
      loginId: (state) => state.login._id,
      person: (state) => state.dossiers.customer,
      consultingList: (state) => state.consulting.list,
      promoter: (state) => state.promoters.promoter,
      roles: (state) => state.promoters.roles.items,
      isFetching: (state) => state.error.isFetching,
    }),
  },

  methods: {
    ...mapActions({
      fetchConsultingList: 'consulting/fetchList',
      fetchRoles: 'promoters/fetchRoles',
    }),

    consultingClick(consulting) {
      this.$router.push(`consulting/${consulting._id}`);
    },

    consultingBody(consulting) {
      const { type, signature, product, creationDate, proposalNumber, promoter } = consulting;
      let status = signature?.procedureCompleted ? 'Firmato' : 'Bozza';
      if (product?.isClosed) status = 'Chiusa';

      return [
        {
          _id: 'cs00',
          type: 'chip',
          icon: 'fa fa-check',
          chipText: type === 'inv' ? 'CI' : 'CN',
        },
        {
          _id: 'cs0',
          label: parseDate(signature?.signedDate),
          sublabel: parseDate(creationDate),
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: 'cs1',
          label: proposalNumber,
          className: 'text-big',
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: 'cs2',
          label: status,
          className: signature?.procedureCompleted ? 'text-green text-big' : 'text-red text-big',
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: 'cs3',
          label: promoter.displayName,
          sublabel: promoter.displayHierarchy,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, promoter.roleId),
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: 'cs4',
          label: product.name,
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
      ];
    },
  },

  data() {
    return {
      consultingHeader: [
        {
          _id: 'cs0',
          label: 'Data firma',
          sublabel: 'Data creazione',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: 'cs1',
          label: 'Numero',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: 'cs7',
          label: 'Stato Firma',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: 'cs8',
          label: 'Promotore',
          sublabel: 'Rete',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: 'cs9',
          label: 'Prodotto',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
      ],
    };
  },
};
</script>
