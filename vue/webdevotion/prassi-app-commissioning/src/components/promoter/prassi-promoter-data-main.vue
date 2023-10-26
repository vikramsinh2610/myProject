<template>
  <q-card class="text-primary" inline flat>
    <q-card-section>
      <q-item class="items-start row no-wrap">
        <div class="company q-pt-sm q-pr-sm">
          <img src="/avatar.svg" class="q-item-avatar" />
        </div>
        <div class="col-4" style="height: 109px">
          <div class="p-pdm-title-section ellipsis">{{ promoter.displayName }}</div>
          <div class="p-pdm-text row no-wrap items-start">
            <q-icon class="q-ma-sm" name="fa fa-organization-grey" size="15px" />
            <div class="text-truncate text-no-wrap ellipsis">
              {{
                promoter.displayHierarchy ? promoter.displayHierarchy : $t('promoters.noNetwork')
              }}
            </div>
          </div>
          <div class="p-pdm-text row no-wrap items-start">
            <q-icon class="q-ma-sm" name="fa fa-briefcase-grey" size="15px" />
            <div class="text-truncate text-no-wrap ellipsis">
              {{ $utils.getRoleName(roles, promoter.roleId) }}
            </div>
          </div>
        </div>
        <div class="vertical-separator col-1" />
        <div class="col-4 column justify-between" style="height: 109px">
          <div class="column justify-center full-width" style="height: 41px">
            <div class="p-pdm-text row no-wrap items-start full-width">
              <q-icon class="q-ma-sm" name="fa fa-map-marker" style="color: #a9b0bb" size="15px" />
              <div class="lt-lg ellipsis">
                {{ promoter.displayAddress || '-' }}
                <q-tooltip>
                  {{ promoter.displayAddress || '-' }}
                </q-tooltip>
              </div>
              <div class="gt-md">{{ promoter.displayAddress || '-' }}</div>
            </div>
          </div>
          <div class="p-pdm-text row no-wrap items-start full-width">
            <q-icon class="q-ma-sm" name="fa fa-envelope" style="color: #a9b0bb" size="15px" />
            <div class="ellipsis">
              {{ promoter.username }}
              <q-tooltip>
                {{ promoter.username }}
              </q-tooltip>
            </div>
          </div>
        </div>
        <div class="vertical-separator col-1" />
        <div class="col-2 column justify-between" style="height: 109px">
          <div class="column justify-center" style="height: 41px">
            <div class="p-pdm-text row no-wrap items-start">
              <q-icon class="q-ma-sm" name="fa fa-phone" style="color: #a9b0bb" size="15px" />
              <div class="lt-lg ellipsis">
                {{ promoter.fixedPhone }} {{ promoter.mobilePhone || '-' }}
              </div>
              <div class="gt-md">{{ promoter.fixedPhone }} {{ promoter.mobilePhone || '-' }}</div>
            </div>
          </div>
          <div class="p-pdm-text row no-wrap items-start">
            <q-icon
              class="q-ma-sm text-no-wrap text-truncate"
              name="fa fa-birthday-cake"
              style="color: #a9b0bb"
              size="15px"
            />
            <div>
              {{
                promoter.birthDate
                  ? $utils.isoToDisplayDate(promoter.birthDate, $d.bind(this))
                  : '-'
              }}
            </div>
          </div>
        </div>
      </q-item>
      <q-separator />
      <q-tabs inverted no-pane-border align="justify" v-model="menuInternal">
        <q-tab name="company" :label="$t('promoterDataMain.company')" />
        <q-tab name="letters" :label="$t('promoterDataMain.letters')" />
        <q-tab name="invoices" :label="$t('promoterDataMain.invoices')" />
        <q-tab name="documents" :label="$t('promoterDataMain.documents')" />
        <q-tab name="downloads" :label="$t('promoterDataMain.downloads')" />
        <q-tab name="accounting-notes" :label="$t('promoterDataMain.accountingNotes')" />
        <q-tab
          v-if="$env.edition === 'sheltia' && $user.roleID >= 7"
          name="target"
          :label="$t('promoterDataMain.target')"
        />
      </q-tabs>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'PrassiPromoterDataMain',
  data() {
    return {
      menuInternal: this.menu,
    };
  },
  props: {
    promoter: {
      type: Object,
      default: () => ({}),
    },
    menu: {
      type: String,
      default: 'company',
    },
    roles: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    menu: {
      immediate: true,
      handler(selected) {
        this.$utils.logobj('PRASSI-PROMOTER-DATA-MAIN', 'menu', selected);
        if (selected && selected !== this.menuInternal) {
          this.menuInternal = this.menu;
        }
      },
    },
    menuInternal(selected) {
      this.$utils.logobj('PRASSI-PROMOTER-DATA-MAIN', 'menuInternal', selected);
      this.$emit('changeMenu', selected);
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-card
  border-radius 4px
  border solid 1px $card-border
  height 185px
  min-width 710px
  max-width 960px
.q-card-main
  padding 10px 15px 0
.p-pdm-title-section
  font-size 26px
  font-weight 500
.p-pdm-text
  font-size 18px
  font-weight 100
.q-separator
  background-color $lg-4
  opacity    0.2
  height 1px
  margin-top 0
  margin-bottom 8px
  display block
.q-tab
  padding-top 0
  padding-bottom 0
  height 34px
  min-height 34px
.q-tabs-head
  min-height 34px
.vertical-separator
  background-color #7f8fa4
  opacity 0.2
  width: 1px;
  height: 79px;
  margin: 15px 15px 15px 15px;
</style>
