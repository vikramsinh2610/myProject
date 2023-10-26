<template>
  <q-page class="q-px-sm q-pt-sm p-centered-container column"> <router-view /> </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'Letters',
  data() {
    return {
      menuPromoter: 'company',
    };
  },
  mounted() {
    this.resetPromoterLetters();
  },
  computed: {
    ...mapState({
      errorNotFound: (state) => state.error.errorNotFound,
    }),
  },
  watch: {
    errorNotFound(error) {
      this.$utils.log('LETTERS', `not found ${error}`);
      if (error) this.$router.replace('/letters');
    },
    '$route.name': {
      immediate: true,
      handler(name) {
        this.$utils.logobj('LETTERS', `ROUTE ${name}`, this.$route.matched);
        if (!name) return;

        switch (name) {
          case 'letters':
            this.resetPromoterLetters();
            break;
          case 'letter':
            this.resetPromoterLetter();
            break;
          case 'company':
            break;
          default:
            break;
        }

        this.menuPromoter = name;
      },
    },
  },
  methods: {
    ...mapActions({
      fetchLetters: 'promoters/fetchLetters',
      fetchPromoterLetter: 'promoters/fetchPromoterLetter',
      fetchPromoterLetterSettings: 'promoters/fetchPromoterLetterSettings',
      fetchPromoterLetterAttachments: 'promoters/fetchPromoterLetterAttachments',
    }),
    ...mapMutations({
      resetPromoterLetters: 'promoters/resetPromoterLetters',
      resetPromoterLetter: 'promoters/resetPromoterLetter',
      resetPromoterLetterAttachments: 'promoters/resetPromoterLetterAttachments',
    }),
    changeMenuPromoter(menu) {
      this.$utils.log('PROMOTERS-DETAIL', `menuPromoter ${menu}`);
      switch (menu) {
        case 'letters':
          this.$router.push(`/promoters/${this.$route.params.id}/letters`);
          break;
        case 'company':
          this.$router.push(`/promoters/${this.$route.params.id}/company`);
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
