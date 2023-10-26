<template>
  <div v-if="ready">
    <prassi-header-list class="p-pl-item header-sub" :blocks="precontractualHeader" />
    <div
      v-for="p in precontractualList"
      :key="p.id"
      @click="() => precontractualClick(p)"
      class="link-card"
    >
      <prassi-body-list
        class="q-card-thin"
        :blocks="precontractualBody(p)"
        :id="'precontractual body'"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import moment from 'moment';
import PrassiHeaderList from '../components/base/prassi-header-list';
import PrassiBodyList from '../components/base/prassi-body-list';

export default {
  name: 'PersonPrecontractualList',
  components: { PrassiHeaderList, PrassiBodyList },

  async mounted() {
    this.resetPrecontractuals();

    const customerId = this.$route.params.id;
    await this.fetchPrecontractualSummmary(customerId);
    await this.fetchRoles();

    /*
// TODO promoters not stored yet
    // fetch related promoters
    const allPromoters = new Set();

    this.precontractualList.forEach((p) => {
      const promoter = `TODO${p}`; // TODO
      if (promoter) allPromoters.add(promoter);
    });

    const promoters = await Promise.all([...allPromoters].map((id) => this.fetchPromoter(id)));
    this.promoters = promoters.map((p) => p.item);
    */

    this.ready = true;
  },

  computed: {
    ...mapState({
      token: (state) => state.login.token,
      person: (state) => state.dossiers.customer,
      precontractualList: (state) => state.dossiers.precontractuals.items,
      roles: (state) => state.promoters.roles.items,
      isFetching: (state) => state.error.isFetching,
    }),
  },

  methods: {
    ...mapActions({
      fetchPrecontractualSummmary: 'dossiers/fetchPrecontractualSummmary',
      fetchPromoter: 'promoters/fetchPromoter',
      fetchRoles: 'promoters/fetchRoles',
    }),

    ...mapMutations({
      resetPrecontractuals: 'dossiers/resetPrecontractuals',
    }),

    precontractualClick(p) {
      this.$router.push(`precontractual/${p.id}`);
    },

    precontractualBody(precontractual) {
      const creationDate = precontractual.createdDate
        ? moment(precontractual.createdDate).format('DD/MM/YYYY')
        : '-';

      const creationDateYear = precontractual.createdDate
        ? moment(precontractual.createdDate).format('YYYY')
        : '-';

      const signedDate = precontractual.signedDate
        ? moment(precontractual.signedDate).format('DD/MM/YYYY')
        : '-';

      const precontractualExpiration = precontractual.signedDate
        ? this.$utils.precontractualExpiration(precontractual).format('DD/MM/YY')
        : '-';

      const status = precontractual.status === 1 ? 'Completo' : 'Bozza';

      // eslint-disable-next-line no-unused-vars
      const promoter = this.promoters.find((p) => p._id === 'TODO') || {};

      return [
        {
          _id: '00',
          type: 'chip',
          icon: 'fa fa-check',
          chipText: 'FE',
        },
        {
          _id: '0',
          label: signedDate,
          sublabel: creationDate,
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: '1',
          label: `FE-${precontractual.id}-${creationDateYear}`,
          className: 'text-big',
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: '1',
          label: status,
          className: precontractual.status === 1 ? 'text-green text-big' : 'text-red text-big',
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: 'cs3',
          label: precontractual.displayName,
          sublabel: precontractual.displayHierarchy,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, precontractual.roleId),
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: 'exp',
          label: precontractualExpiration,
          className: 'text-big',
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
      ready: false,
      promoters: [],
      precontractualHeader: [
        {
          _id: '0',
          label: 'Data firma',
          sublabel: 'Data creazione',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '1',
          label: 'Numero',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: '7',
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
          _id: '8',
          label: 'Valido fino al:',
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
