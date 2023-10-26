<template>
  <div class="row">
    <prassi-promoter-target
      class="col-9 q-mr-sm q-mb-sm"
      :targets="targets"
      @changeData="saveTargets"
    />
    <prassi-year-range-block class="col q-mb-sm" :filter="filter" @changed="filterDateChange" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import PrassiPromoterTarget from '../components/promoter/prassi-promoter-target';
import PrassiYearRangeBlock from '../components/base/prassi-year-range-block';

export default {
  name: 'PromotersDetailTarget',
  components: {
    PrassiPromoterTarget,
    PrassiYearRangeBlock,
  },
  data() {
    return {
      filter: {
        year: new Date().getFullYear(),
      },
    };
  },
  mounted() {
    this.fetchPromoterTargets({
      promoterId: this.$route.params.id,
      productivePeriodYear: 2018,
      productivePeriodMonth: 1,
    });
  },
  computed: {
    ...mapState({
      targets: (state) => state.promoters.targets.items,
    }),
  },
  methods: {
    ...mapActions({
      fetchPromoterTargets: 'promoters/fetchPromoterTargets',
      savePromoterTargets: 'promoters/savePromoterTargets',
    }),
    filterDateChange(filterDate) {
      this.$utils.logobj('PROMOTERS-DETAIL-TARGET', 'filterDate', filterDate);
      this.$q.loading.show({ delay: 200 });
      this.fetchPromoterTargets({
        promoterId: this.$route.params.id,
        productivePeriodYear: filterDate.year,
      }).finally(() => {
        this.$q.loading.hide();
      });

      this.filter = filterDate;
    },
    saveTargets(targets) {
      this.$utils.logobj('PROMOTERS-DETAIL-TARGET', 'saveTargets', targets);
      this.savePromoterTargets({
        promoterId: this.$route.params.id,
        body: targets,
        year: this.filter.year,
      }).then(async () => {
        this.$utils.log('PROMOTERS-DETAIL-TARGET', 'saveTargets');
        this.$q.notify({ message: this.$t('promoterCompany.savedOk'), color: 'secondary' });
      });
    },
  },
};
</script>

<style lang="stylus" scoped></style>
