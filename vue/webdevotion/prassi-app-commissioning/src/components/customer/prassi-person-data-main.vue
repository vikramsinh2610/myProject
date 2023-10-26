<template>
  <div>
    <q-card class="text-primary" inline flat>
      <q-card-section>
        <q-item class="items-start row no-wrap">
          <div class="col-5 row" style="height: 109px">
            <div class="col-3">
              <div class="company q-pt-sm q-pr-sm">
                <img v-if="!customer.isCompany" src="avatar.svg" class="q-item-avatar" />
                <img v-if="customer.isCompany" src="avatar-company.png" class="q-item-avatar" />
              </div>
            </div>
            <div class="col">
              <div class="p-pdm-title-section ellipsis">
                {{ customer.isCompany ? customer.companyName : customer.displayname }}
              </div>
              <div class="p-pdm-text row no-wrap items-start">
                <div class="text-truncate text-no-wrap ellipsis grey-text">
                  {{ customer.fiscalCode }}
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="p-pdm-text row no-wrap items-start">
                <q-icon class="q-ma-sm" name="fa fa-briefcase-grey" size="15px" />
                <div class="text-truncate text-no-wrap ellipsis" style="padding-top: 3px">
                  {{ customer.promoterName }}
                </div>
              </div>
            </div>
          </div>
          <div class="vertical-separator col-1" />
          <div class="col-12 row">
            <div class="col-4 column justify-start">
              <div class="column justify-center full-width" style="height: 41px">
                <div class="p-pdm-text row no-wrap items-start full-width">
                  <q-icon
                    class="q-ma-sm"
                    name="fa fa-map-marker"
                    style="color: #a9b0bb"
                    size="15px"
                  />
                  <div class="lt-lg text-truncate ellipsis">
                    {{ addressFirstLine }} <br />
                    {{ addressSecondLine }}
                    <q-tooltip>
                      {{ addressFirstLine }} <br />
                      {{ addressSecondLine }}
                    </q-tooltip>
                  </div>
                  <div class="gt-md align-text-content" style="line-height: 19px">
                    {{ addressFirstLine }} <br />
                    {{ addressSecondLine }}
                  </div>
                </div>
              </div>
              <div class="p-pdm-text row no-wrap items-start full-width">
                <q-icon class="q-ma-sm" name="fa fa-envelope" style="color: #a9b0bb" size="15px" />
                <div class="text-truncate ellipsis align-text-content">
                  {{ customer.email || '-' }}
                  <q-tooltip>
                    {{ customer.email || '-' }}
                  </q-tooltip>
                </div>
              </div>
            </div>

            <div class="col-3 column justify-start">
              <div class="column justify-center" style="height: 41px">
                <div class="p-pdm-text row no-wrap items-center">
                  <q-icon class="q-ma-sm" name="fa fa-phone" style="color: #a9b0bb" size="15px" />
                  <div class="lt-lg ellipsis" style="line-height: 19px" v-html="phone"></div>
                  <div class="gt-md" style="line-height: 19px" v-html="phone"></div>
                </div>
              </div>
              <div class="p-pdm-text row no-wrap items-start">
                <q-icon
                  class="q-ma-sm text-no-wrap text-truncate"
                  name="fa fa-birthday-cake"
                  style="color: #a9b0bb"
                  size="15px"
                />
                <div class="align-text-content">
                  {{
                    customer.birthDate
                      ? $utils.isoToDisplayDate(customer.birthDate, $d.bind(this))
                      : '-'
                  }}
                </div>
              </div>
              <div class="p-pdm-text row no-wrap items-start"></div>
            </div>

            <div class="col-12">
              <div class="p-pdm-text row no-wrap items-start full-width">
                <q-icon class="q-ma-sm" name="fa fa-organization-grey" size="15px" />
                <div class="text-truncate text-no-wrap ellipsis" style="padding-top: 3px">
                  {{ customer.networkHierarchy }}
                  <q-tooltip>
                    {{ customer.networkHierarchy }}
                  </q-tooltip>
                </div>
              </div>
            </div>
          </div>
        </q-item>

        <div class="old-menu">
          <q-separator />
          <q-tabs inverted no-pane-border align="justify" v-model="menuInternal">
            <q-tab name="dashboard" :label="$t('customerDataMain.dashboard')" />
            <q-tab name="precontractual-list" :label="$t('customerDataMain.precontractual')" />
            <q-tab name="inquiry-survey-list" :label="$t('customerDataMain.inquirySurveys')" />
            <q-tab name="consulting-list" :label="$t('customerDataMain.consulting')" />
            <q-tab name="dossiers" :label="$t('customerDataMain.dossiers')" />
          </q-tabs>
        </div>
      </q-card-section>
    </q-card>

    <q-page-sticky position="bottom-right" :offset="[18, 18]" style="z-index: 3">
      <q-btn round size="17px" color="secondary" text-color="white" icon="fa fa-chevron-up">
        <q-menu auto-close :offset="[0, 18]">
          <q-tabs vertical switch-indicator v-model="menuInternal" style="padding: 5px">
            <q-tab name="dashboard" :label="$t('customerDataMain.dashboard')" />
            <q-tab name="dashboard-legacy" :label="$t('customerDataMain.dashboardLegacy')" />
            <q-tab name="precontractual" :label="$t('customerDataMain.precontractual')" />
            <q-tab name="detail" :label="$t('customerDataMain.detail')" />
            <q-tab name="identity" :label="$t('customerDataMain.identity')" />
            <q-tab
              name="persons"
              :label="$t('customerDataMain.persons')"
              v-if="customer.isCompany"
            />
            <q-tab
              name="companies"
              :label="$t('customerDataMain.companies')"
              v-if="!customer.isCompany"
            />
            <q-tab name="history" :label="$t('customerDataMain.history')" />
            <q-tab name="dossiers" :label="$t('customerDataMain.dossiers')" />
            <q-tab name="relations" :label="$t('customerDataMain.relations')" />
            <q-tab name="survey-results" :label="$t('customerDataMain.surveys')" />
          </q-tabs>
        </q-menu>
      </q-btn>
    </q-page-sticky>
  </div>
</template>

<script>
export default {
  name: 'PrassiPersonDataMain',
  data() {
    return {
      menuInternal: this.menu,
    };
  },
  props: {
    customer: {
      type: Object,
      default: () => ({}),
    },
    menu: {
      type: String,
      default: 'detail',
    },
  },
  computed: {
    addressFirstLine() {
      if (this.customer.legalAddress.route) {
        return `${this.customer.legalAddress.route}, ${this.customer.legalAddress.streetNumber}`;
      }
      if (this.customer.address.route) {
        return `${this.customer.address.route}, ${this.customer.address.streetNumber}`;
      }
      return `-`;
    },
    addressSecondLine() {
      if (this.customer.legalAddress.route) {
        return `${this.customer.legalAddress.postalCode}, ${this.customer.legalAddress.city} (${this.customer.legalAddress.province})`;
      }
      if (this.customer.address.route) {
        return `${this.customer.address.postalCode}, ${this.customer.address.city} (${this.customer.address.province})`;
      }
      return ``;
    },
    phone() {
      if (this.customer.mobilePhone && this.customer.fixedPhone) {
        return `${this.customer.mobilePhone} <br/> ${this.customer.fixedPhone}`;
      }
      if (this.customer.mobilePhone) {
        return `${this.customer.mobilePhone}`;
      }
      if (this.customer.fixedPhone) {
        return `${this.customer.fixedPhone}`;
      }
      return `-`;
    },
  },
  watch: {
    menu: {
      immediate: true,
      handler(selected) {
        this.$utils.logobj('PRASSI-PERSON-DATA-MAIN', 'menu', selected);
        if (selected && selected !== this.menuInternal) {
          this.menuInternal = this.menu;
        }
      },
    },
    menuInternal(selected) {
      this.$utils.logobj('PRASSI-PERSON-DATA-MAIN', 'menuInternal', selected);
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
  font-size 16px
  font-weight 100
.q-separator
  background-color $lg-4
  opacity    0.2
  height 1px
  margin-top 0
  margin-bottom 8px
  display block
.align-text-content
  padding-top 3px
.q-tab
  padding-top 0
  padding-bottom 0
  height 34px
  min-height 34px
  padding-left 25px
  padding-right 25px
.grey-text
  font-size: 19px;
  color: #7f8fa4;
  font-weight: 500;
.q-tabs-head
  min-height 34px
.vertical-separator
  background-color #7f8fa4
  opacity 0.2
  width: 1px;
  height: 79px;
  margin: 15px 15px 15px 15px;
</style>
