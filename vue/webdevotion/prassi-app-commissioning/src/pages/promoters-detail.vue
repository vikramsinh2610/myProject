<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column">
    <div class="row q-mb-sm no-wrap">
      <prassi-promoter-data-main
        class="col-9 q-mr-sm"
        :promoter="promoter"
        :menu="menuPromoter"
        :roles="roles"
        @changeMenu="changeMenuPromoter"
      />
      <prassi-promoter-data-small class="col" :promoter="companyProfile" />
    </div>

    <router-view />

    <q-spinner-dots v-if="isFetching" class="center-spinner" color="primary" size="40" />
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PrassiPromoterDataMain from '../components/promoter/prassi-promoter-data-main';
import PrassiPromoterDataSmall from '../components/promoter/prassi-promoter-data-small';

export default {
  name: 'PromotersDetail',
  components: {
    PrassiPromoterDataMain,
    PrassiPromoterDataSmall,
  },
  data() {
    return {
      menuPromoter: 'company',
    };
  },
  computed: {
    ...mapState({
      companyProfile: (state) => state.promoters.companyProfile,
      promoter: (state) => state.promoters.promoter,
      isFetching: (state) => state.error.isFetching,
      filter: (state) => state.promoters.filter,
      errorNotFound: (state) => state.error.errorNotFound,
      roles: (state) => state.promoters.roles.items,
    }),
  },
  watch: {
    errorNotFound(error) {
      this.$utils.log('PROMOTERS-DETAIL', `not found ${error}`);
      if (error) this.$router.replace('/promoters');
    },
    '$route.path': {
      immediate: true,
      // eslint-disable-next-line no-unused-vars
      handler(path) {
        this.$utils.logobj('PROMOTERS-DETAIL', `ROUTE ${this.$route.path}`, this.$route.name);
        if (!this.$route.name) return;

        this.$utils.logobj('PROMOTERS-DETAIL', `R ${this.$route.path}`, this.$route.params.id);
        if (this.$route.params.id && this.$route.params.id !== this.promoter._id) {
          this.fetchPromoter(this.$route.params.id);
          this.fetchPromoterLetterSettings(this.$route.params.id);
        }

        switch (this.$route.name) {
          case 'letters':
            this.resetError();
            this.resetPromoterLetters();
            break;
          case 'letter':
            this.resetPromoterLetter();
            this.fetchPromoterLetter({
              promoterId: this.$route.params.id,
              letterId: this.$route.params.letter,
            }).then(async () => {
              this.fetchPromoterLetterAttachments({
                promoterId: this.$route.params.id,
                letterId: this.$route.params.letter,
              });
            });
            break;
          case 'company':
            this.fetchPromoterCompanyProfile(this.$route.params.id);
            break;
          case 'invoices':
            this.resetError();
            this.resetPromoterInvoices();
            break;
          case 'invoice':
            this.fetchPromoterNotes({
              promoterId: this.$route.params.id,
              year: this.$env.edition === 'sheltia' ? 2019 : 2018,
              month: this.$env.edition === 'sheltia' ? 1 : 12,
            });
            this.fetchInvoice(this.$route.params.invoice);
            break;
          case 'accounting-notes':
            this.fetchPromoterNotes({
              promoterId: this.$route.params.id,
              year: this.$env.edition === 'sheltia' ? 2019 : 2018,
              month: this.$env.edition === 'sheltia' ? 1 : 12,
            });
            break;
          case 'documents':
          case 'downloads':
            this.resetError();
            this.resetPromoterDocuments();
            break;
          default:
            break;
        }

        this.menuPromoter = this.$route.name;
      },
    },
  },
  methods: {
    ...mapActions({
      fetchPromoter: 'promoters/fetchPromoter',
      fetchPromoterCompanyProfile: 'promoters/fetchPromoterCompanyProfile',
      fetchPromoterLetters: 'promoters/fetchPromoterLetters',
      fetchPromoterLetter: 'promoters/fetchPromoterLetter',
      fetchPromoterLetterSettings: 'promoters/fetchPromoterLetterSettings',
      savePromoterCompanyProfile: 'promoters/savePromoterCompanyProfile',
      fetchPromoterLetterAttachments: 'promoters/fetchPromoterLetterAttachments',
      fetchPromoterInvoices: 'promoters/fetchPromoterInvoices',
      fetchPromoterDocuments: 'promoters/fetchPromoterDocuments',
      fetchPromoterNotes: 'invoicing/fetchPromoterNotes',
      fetchInvoice: 'invoicing/fetchInvoice',
    }),
    ...mapMutations({
      resetPromoterLetters: 'promoters/resetPromoterLetters',
      resetPromoterLetter: 'promoters/resetPromoterLetter',
      resetPromoterLetterAttachments: 'promoters/resetPromoterLetterAttachments',
      resetPromoterInvoices: 'promoters/resetPromoterInvoices',
      resetPromoterDocuments: 'promoters/resetPromoterDocuments',
      resetError: 'error/resetError',
    }),
    changeMenuPromoter(menu) {
      this.$utils.log('PROMOTERS-DETAIL', `menuPromoter ${menu}`);
      switch (menu) {
        case 'company':
          this.$router.push(`/promoters/${this.$route.params.id}/company`);
          break;
        case 'letters':
          this.$router.push(`/promoters/${this.$route.params.id}/letters`);
          break;
        case 'invoices':
          this.$router.push(`/promoters/${this.$route.params.id}/invoices`);
          break;
        case 'documents':
          this.$router.push(`/promoters/${this.$route.params.id}/documents`);
          break;
        case 'downloads':
          this.$router.push(`/promoters/${this.$route.params.id}/downloads`);
          break;
        case 'target':
          this.$router.push(`/promoters/${this.$route.params.id}/target`);
          break;
        case 'accounting-notes':
          this.$router.push(`/promoters/${this.$route.params.id}/accounting-notes`);
          break;
        default:
          break;
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
.center-spinner
  display block
  margin auto
</style>
