<template>
  <div>
    <q-card flat bordered class="box">
      <div style="padding: 1em">
        <div class="hidden" style="font-size: 10px">IV - PZ</div>
        <section style="text-align: center">
          <h5>
            {{ !isNaN(summary.iv) ? $n(summary.iv / 100, 'integer') : '-' }} IV –
            {{ !isNaN(summary.pc) ? $n(summary.pc / 100, 'integer') : '-' }} PZ
          </h5>
          <div class="p-pd-title-section">In vigore</div>
        </section>
        <section class="small-box">
          <div class="button-data">
            <q-btn
              id="left"
              dense
              flat
              size="25px"
              color="tertiary"
              aria-label="year sub"
              @click="subtract"
              icon="keyboard_arrow_left"
            />
          </div>

          <div class="container-data">
            <div class="box-data" ref="first-elem">
              <div class="text-team">
                {{ !isNaN(toSend.iv) ? $n(toSend.iv / 100, 'integer') : '-' }} IV -
                {{ !isNaN(toSend.pc) ? $n(toSend.pc / 100, 'integer') : '-' }} PZ
              </div>
              <div class="p-pd-title-section">Da inviare</div>
            </div>
            <div class="box-data">
              <div class="text-red">
                {{ !isNaN(inDraft.iv) ? $n(inDraft.iv / 100, 'integer') : '-' }} IV -
                {{ !isNaN(inDraft.pc) ? $n(inDraft.pc / 100, 'integer') : '-' }} PZ
              </div>
              <div class="p-pd-title-section">In bozza</div>
            </div>
            <div class="box-data" ref="last-elem">
              <div class="text-team">
                {{ !isNaN(approved.iv) ? $n(approved.iv / 100, 'integer') : '-' }} IV -
                {{ !isNaN(approved.pc) ? $n(approved.pc / 100, 'integer') : '-' }} PZ
              </div>
              <div class="p-pd-title-section">Approvati</div>
            </div>
          </div>

          <div class="button-data">
            <q-btn
              id="right"
              dense
              flat
              size="25px"
              color="tertiary"
              aria-label="year add"
              @click="add"
              icon="keyboard_arrow_right"
            />
          </div>
        </section>
        <div class="p-pd-title-section-bottom">
          Stato: {{ $utils.customerStatus(customer.status) }}
        </div>
      </div>
    </q-card>

    <q-card inline flat color="white" class="hidden text-primary">
      <q-card-section>
        <div class="column justify-between">
          <span class="row no-wrap justify-between items-baseline">
            <span class="p-pd-text-description">{{ $t('customerDataSmall.fiscalCode') }}</span>
            <span class="p-pd-text-large ellipsis">{{ customer.fiscalCode || '' }}</span>
          </span>
          <span class="row no-wrap justify-between items-baseline">
            <span class="p-pd-text-description">{{ $t('customerDataSmall.created') }}</span>
            <span class="p-pd-text-medium q-ml-xs ellipsis">
              {{ customer.creationDate ? $d(new Date(customer.creationDate)) : '' }}
            </span>
          </span>
          <span class="row no-wrap justify-between items-baseline">
            <span class="p-pd-text-description">{{ $t('customerDataSmall.status') }}</span>
            <span class="p-pd-text-medium q-ml-xs ellipsis">
              {{ customer.status }}
            </span>
          </span>
          <span class="row no-wrap justify-between items-baseline">
            <span class="p-pd-text-description">{{ $t('customerDataSmall.type') }}</span>
            <span class="p-pd-text-medium q-ml-xs ellipsis">
              {{ customer.type }}
            </span>
          </span>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

const STATUS = {
  BOZZA: 1,
  INVIATA: 2,
  APPROVATA: 3,
  IN_VIGORE: 6,
};

export default {
  name: 'PrassiPersonDataSmall',
  props: {
    customer: {
      type: Object,
      default: () => ({}),
    },
    summary: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      toSend: [],
      inDraft: [],
      approved: [],
      current: [],
    };
  },

  async mounted() {
    this.toSend = (
      await this.fetchPersonsSummary({
        promoterId: this.loginId,
        practiceStatus: STATUS.INVIATA,
        skipReceive: true,
      })
    ).item;

    this.inDraft = (
      await this.fetchPersonsSummary({
        promoterId: this.loginId,
        practiceStatus: STATUS.BOZZA,
        skipReceive: true,
      })
    ).item;

    this.approved = (
      await this.fetchPersonsSummary({
        promoterId: this.loginId,
        practiceStatus: STATUS.APPROVATA,
        skipReceive: true,
      })
    ).item;

    this.current = (
      await this.fetchPersonsSummary({
        promoterId: this.loginId,
        practiceStatus: STATUS.IN_VIGORE,
        skipReceive: true,
      })
    ).item;
  },

  computed: {
    ...mapState({
      loginId: (state) => state.login._id,
      isFetching: (state) => state.error.isFetching,
    }),
  },
  methods: {
    ...mapActions({
      fetchPersonsSummary: 'dossiers/fetchPersonsSummary',
    }),
    subtract() {
      this.$refs['first-elem'].scrollIntoView(false);
    },
    add() {
      this.$refs['last-elem'].scrollIntoView(false);
    },
  },
};
</script>

<style lang="stylus" scoped>
#right
  position: absolute;
  right: 5px;
#left
  position: absolute;
  left: 5px;
.q-card
  border-radius 4px
  border solid 1px $card-border
  height 185px
h5
  font-size 1.5rem
  margin: 0
section
  padding: 0.5em 0
  border-bottom: 1px solid $lg-2

.container-data
  display: flex
  justify-content: space-between
  overflow-x: scroll

.small-box
  width: 275px
  display: flex
  justify-content: space-between

.button-data
  width 60px

.p-pd-title-section
  font-size 16px
  color $text-opaque
  font-weight 100
  line-height 14px
  padding-bottom 4px

.p-pd-title-section-bottom
  padding-top 10px
  font-size 16px
  color $text-opaque
  font-weight 500
  font-family SairaSemiCondensed

.box-data
  min-width 150px

.q-separator
  background-color $lg-4
  opacity 0.2
  height 1px
  margin-top 0
  margin-bottom 8px
  display block
.p-pd-text-description
  margin-left 10px
  font-size 16px
  font-weight 100
.p-pd-text-large
  font-size 20px
  font-weight 500
.p-pd-text-medium
  font-size 18px
  font-weight 500
</style>
