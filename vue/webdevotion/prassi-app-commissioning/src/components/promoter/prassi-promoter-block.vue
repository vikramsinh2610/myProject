<template>
  <div>
    <q-card
      class="relative-position"
      style="width: 100%"
      inline
      flat
      color="white"
      text-color="primary"
    >
      <q-card-section class="row justify-between">
        <div>
          <div class="p-th-main-text ellipsis">{{ name }}</div>
          <q-chip :color="color" text-color="white" dense tag> {{ area }} </q-chip>
        </div>
        <div class="p-th-right row">
          <prassi-two-rows-block
            :label="$n(consultants, 'nodecimals')"
            :sublabel="$t('proposals.consultants')"
            :width="80"
            border
          />
          <prassi-two-rows-block
            :label="$n(insured, 'nodecimals')"
            :sublabel="$t('proposals.insured')"
            :width="80"
            border
          />
          <prassi-two-rows-block
            :label="$n(premiums, 'nodecimals')"
            :sublabel="$t('proposals.yearlyPremium')"
            :width="115"
            border
          />
          <prassi-two-rows-block
            :label="$n(iv, 'nodecimals')"
            :sublabel="$t('proposals.iv')"
            :width="115"
            border
          />
          <prassi-two-rows-block
            :label="$n(pc, 'nodecimals')"
            :sublabel="$t('proposals.pc')"
            :width="80"
          />
        </div>
        <prassi-round-button
          class="p-p-button"
          :icon="open ? 'fa fa-chevron-up' : 'fa fa-chevron-down'"
          @click="emitLazyLoadClick"
        />
      </q-card-section>
      <q-inner-loading :visible="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-card>

    <q-slide-transition>
      <prassi-proposal-list v-if="open" :proposals="proposals" />
    </q-slide-transition>

    <q-btn
      v-if="open"
      class="p-p-more-btn"
      round
      color="secondary"
      icon="cloud_download"
      :loading="loading"
      @click="loadMoreIndirectItems"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import PrassiTwoRowsBlock from '../base/prassi-two-rows-block';
import PrassiProposalList from '../proposal/prassi-proposal-list';

export default {
  name: 'PrassiPromoterBlock',
  components: { PrassiProposalList, PrassiTwoRowsBlock },
  data: () => ({
    open: false,
    loading: false,
  }),
  props: {
    id: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: 'name',
    },
    area: {
      type: String,
      default: 'area',
    },
    color: {
      type: String,
      default: 'blue',
    },
    consultants: {
      type: Number,
      default: 0,
    },
    insured: {
      type: Number,
      default: 0,
    },
    premiums: {
      type: Number,
      default: 0,
    },
    iv: {
      type: Number,
      default: 0,
    },
    pc: {
      type: Number,
      default: 0,
    },
    proposals: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    ...mapActions({
      fetchProposalsIndirectItems: 'proposals/fetchProposalsIndirectItems',
    }),
    emitLazyLoadClick() {
      if (!this.open) {
        this.loading = true;
        this.fetchProposalsIndirectItems(this.id).finally(() => {
          this.$utils.logobj('PROMOTER-BLOCK', 'emitLazyLoadClick', this.id);
          setTimeout(() => {
            this.loading = false;
            this.open = true;
          }, 350);
        });
      } else {
        this.open = false;
      }
    },
    loadMoreIndirectItems() {
      this.loading = true;
      this.fetchProposalsIndirectItems(this.id).finally(() => {
        this.$utils.logobj('PROMOTER-BLOCK', 'loadMoreIndirectItems', this.id);
        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  margin-bottom 5px
  border-radius 4px
  border solid 1px $card-border
  min-width 1180px
.q-card-main
  width 100%
  padding 9px 16px 9px 16px
  align-items center
.p-th-main-text
  width fit-content
  font-size 16px
  text-transform uppercase
.p-th-right
  margin-left auto
  align-items center
.q-chip
  width 100%
  text-transform uppercase
.p-p-button
  margin-left 55px
.p-p-more-btn
  display block
  margin 0 auto 10px auto
</style>
