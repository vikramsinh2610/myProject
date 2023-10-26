<template>
  <div>
    <prassi-header-list class="p-pl-item header-sub" :blocks="surveyHeader" />
    <div
      v-for="survey in surveys"
      :key="survey._id"
      @click="() => surveyClick(survey)"
      class="link-card"
    >
      <prassi-body-list class="q-card-thin" :blocks="surveyBody(survey)" :id="'some other id'" />
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
  name: 'PersonInquirySurveyList',
  components: { PrassiHeaderList, PrassiBodyList },

  async mounted() {
    const customerId = this.$route.params.id;
    await this.fetchInquirySurveyResults({ customerId });
    await this.fetchRoles();

    // fetch related promoters
    const allPromoters = new Set();

    this.surveys.forEach((survey) => {
      if (survey.userId) allPromoters.add(survey.userId);
    });

    const promoters = await Promise.all([...allPromoters].map((id) => this.fetchPromoter(id)));
    this.promoters = promoters.map((p) => p.item);
  },

  computed: {
    ...mapState({
      token: (state) => state.login.token,
      person: (state) => state.dossiers.customer,
      surveyResults: (state) => state.surveys.inquiryList,
      roles: (state) => state.promoters.roles.items,
      isFetching: (state) => state.error.isFetching,
    }),

    surveys() {
      return this.surveyResults;
      // return [...this.surveyResults].filter(
      // (x) => x.type === 'inquiry' || x.type === 'company-inquiry',
      // );
    },
  },

  methods: {
    ...mapActions({
      fetchInquirySurveyResults: 'surveys/fetchInquirySurveyResults',
      fetchPromoter: 'promoters/fetchPromoter',
      fetchRoles: 'promoters/fetchRoles',
    }),

    surveyClick(survey) {
      this.$router.push(`survey-results/${survey._id}`);
    },

    surveyBody(survey) {
      const { signature, codeSurveyResult, creationDate, categories, userId } = survey;
      const status = signature?.procedureCompleted ? 'Firmato' : 'Bozza';
      const promoter = this.promoters.find((p) => p._id === userId) || {};

      return [
        {
          _id: 'ab00',
          type: 'chip',
          icon: 'fa fa-check',
          chipText: 'AB',
        },
        {
          _id: 'ab0',
          label: parseDate(signature?.signedDate),
          sublabel: parseDate(creationDate),
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: 'ab1',
          label: codeSurveyResult,
          className: 'text-big',
          size: 'small',
          weight: 'normal',
          width: 200,
          type: '2rows',
        },
        {
          _id: 'ab2',
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
          _id: 'ab8',
          label: (categories || []).filter((x) => x).join(', '),
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
      promoters: [],
      surveyHeader: [
        {
          _id: 'ab0',
          label: 'Data firma',
          sublabel: 'Data creazione',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: 'ab1',
          label: 'Numero',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 200,
        },
        {
          _id: 'ab7',
          label: 'Stato firma',
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
          _id: 'ab8',
          label: 'Categorie',
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
