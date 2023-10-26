<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-white text-primary">
        <prassi-round-button icon="fa fa-bars" @click="menuClick" />
        <img
          v-if="$env.edition === 'tcw'"
          class="prassi-logo"
          alt="Tcw logo"
          src="~assets/tcw-logo-icon.png"
        />
        <img
          v-if="$env.edition === 'sheltia'"
          class="prassi-logo"
          alt="Sheltia logo"
          src="~assets/sheltia-logo-icon.png"
        />
        <q-toolbar-title> <url-breadcrumbs /> </q-toolbar-title>
        <div class="p-pdm-title-section ellipsis q-mr-md">{{ username }}</div>
        <q-avatar>
          <img src="/avatar.svg" />
          <q-menu v-model="showing" content-class="bg-white text-primary" auto-close>
            <q-list separator link>
              <q-item clickable v-close-popup @click.native="doSomething" v-if="!$env.alpha">
                <q-item-section>{{ $t('default.settings') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click.native="logout">
                <q-item-section>{{ $t('default.exit') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer
      :content-class="['bg-menu-background', 'no-shadow']"
      :breakpoint="1023"
      :mini="mini"
      v-model="leftDrawerOpen"
    >
      <q-list no-border inset-delimiter dark>
        <q-item
          v-if="menuItems.profile"
          class="btn-icon-item href-link"
          link
          exact
          :to="`/promoters/${loginId}/company`"
        >
          <q-item-section avatar>
            <prassi-round-button dark border-color="menu-1st-section" icon="fa fa-settings" />
          </q-item-section>
          <q-item-section v-if="!mini">
            {{ $t('default.myprofile') }}
          </q-item-section>
        </q-item>

        <q-expansion-item v-if="menuItems.clientsFolder" class="q-collapsible">
          <template slot="header">
            <q-item-section avatar>
              <prassi-round-button
                dark
                border-color="menu-1st-section"
                icon="fa fa-user-friends"
                @click="
                  $env.edition === 'sheltia-new'
                    ? $router.push('/persons')
                    : $router.push('/customers')
                "
              />
            </q-item-section>
            <q-item-section v-if="!mini">
              {{ $t('default.customersTitle') }}
            </q-item-section>
          </template>

          <q-item
            v-if="menuItems.clients"
            class="q-collapsible-indent"
            link
            exact
            :to="`${$env.edition === 'sheltia' ? '/persons' : '/customers'}`"
          >
            <q-item-section>{{ $t('default.customersTitle') }}</q-item-section>
          </q-item>
          <q-item
            v-if="menuItems.identityCards"
            class="q-collapsible-indent"
            link
            exact
            to="/customers-identity-cards"
          >
            <q-item-section>{{ $t('default.identityCards') }}</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item v-if="menuItems.precontractual" class="q-collapsible">
          <template slot="header">
            <q-item-section avatar>
              <prassi-round-button dark border-color="menu-1st-section" icon="fa fa-list" />
            </q-item-section>
            <q-item-section v-if="!mini">
              {{ $t('default.lists') }}
            </q-item-section>
          </template>
          <q-item class="q-collapsible-indent" clickable exact to="/precontractuals">
            <q-item-section>
              {{ $t('default.precontractuals') }}
            </q-item-section>
          </q-item>
          <q-item class="q-collapsible-indent" clickable exact to="/inquiry-surveys">
            <q-item-section>
              {{ $t('default.inquirySurveys') }}
            </q-item-section>
          </q-item>
          <q-item class="q-collapsible-indent" clickable exact to="/consulting">
            <q-item-section>
              {{ $t('default.consultings') }}
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item v-if="menuItems.files" class="q-collapsible">
          <template slot="header">
            <q-item-section avatar>
              <prassi-round-button
                dark
                border-color="menu-1st-section"
                icon="fa fa-sitemap"
                @click="$router.push('/contracts')"
              />
            </q-item-section>
            <q-item-section v-if="!mini">
              {{ $t('default.practice') }}
            </q-item-section>
          </template>

          <q-item v-if="menuItems.dossiers" class="q-collapsible-indent" link exact to="/proposals">
            <q-item-section>{{ $t('default.proposals') }}</q-item-section>
          </q-item>
          <q-item
            v-if="menuItems.packs"
            class="q-collapsible-indent"
            link
            exact
            to="/proposal-package"
          >
            <q-item-section>{{ $t('default.proposalPackage') }}</q-item-section>
          </q-item>
          <q-item
            v-if="menuItems.contracts"
            class="q-collapsible-indent"
            link
            exact
            to="/contracts"
          >
            <q-item-section>{{ $t('default.contracts') }}</q-item-section>
          </q-item>
          <q-item
            v-if="menuItems.production"
            class="q-collapsible-indent"
            link
            exact
            to="/production"
          >
            <q-item-section>{{ $t('default.production') }}</q-item-section>
          </q-item>
          <q-item
            v-if="menuItems.negative"
            class="q-collapsible-indent"
            link
            exact
            to="/negative-production"
          >
            <q-item-section>{{ $t('default.negativeProduction') }}</q-item-section>
          </q-item>
          <q-item v-if="menuItems.backlog" class="q-collapsible-indent" link exact to="/overdue">
            <q-item-section>{{ $t('default.accountingOverdue') }}</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item v-if="menuItems.people" class="q-collapsible">
          <template slot="header">
            <q-item-section avatar>
              <prassi-round-button
                dark
                border-color="menu-1st-section"
                icon="fa fa-users"
                @click="$router.push('/promoters')"
              />
            </q-item-section>
            <q-item-section v-if="!mini">
              {{ $t('default.personal') }}
            </q-item-section>
          </template>
          <q-item
            v-if="menuItems.users"
            class="q-collapsible-indent"
            clickable
            exact
            to="/promoters"
          >
            <q-item-section>
              {{ $t('default.promoters') }}
            </q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.onboarding"
            class="btn-icon-item href-link q-collapsible-indent"
            link
            exact
            tag="a"
            target="_self"
            :href="`${this.$env.legacyBaseUrl}/#/login/list?token=${this.token}`"
          >
            <q-item-section>
              {{ $t('default.onboarding') }}
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item v-if="menuItems.network" class="btn-icon-item href-link" link exact to="/tree">
          <q-item-section avatar>
            <prassi-round-button dark border-color="menu-1st-section" icon="fas fa-network-wired" />
          </q-item-section>
          <q-item-section>
            {{ $t('default.tree') }}
          </q-item-section>
        </q-item>

        <q-expansion-item v-if="menuItems.events" class="q-collapsible">
          <template slot="header">
            <q-item-section avatar>
              <prassi-round-button
                dark
                border-color="menu-1st-section"
                icon="fa fa-list"
                type="a"
                :href="`${this.$env.legacyBaseUrl}/#/notifications?token=${this.token}`"
              />
            </q-item-section>
            <q-item-section v-if="!mini">
              {{ $t('default.events') }}
            </q-item-section>
          </template>

          <q-item
            v-if="menuItems.notification"
            class="btn-icon-item href-link q-collapsible-indent"
            link
            exact
            tag="a"
            target="_self"
            :href="`${this.$env.legacyBaseUrl}/#/notifications?token=${this.token}`"
          >
            <q-item-section>
              {{ $t('default.notifications') }}
            </q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.activity"
            class="btn-icon-item href-link q-collapsible-indent"
            link
            exact
            tag="a"
            target="_self"
            :href="`${this.$env.legacyBaseUrl}/#/attivita?token=${this.token}`"
          >
            <q-item-section v-if="!mini">
              {{ $t('default.activities') }}
            </q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.calendar"
            class="btn-icon-item href-link q-collapsible-indent"
            link
            exact
            tag="a"
            target="_self"
            :href="`${this.$env.legacyBaseUrl}/#/calendario?token=${this.token}`"
          >
            <q-item-section>
              {{ $t('default.calendar') }}
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item v-if="menuItems.management" class="q-collapsible">
          <template slot="header">
            <q-item-section avatar>
              <prassi-round-button
                dark
                border-color="menu-1st-section"
                icon="fa fa-list"
                type="a"
                :href="`${this.$env.legacyBaseUrl}/#/numerazioni?token=${this.token}`"
              />
            </q-item-section>
            <q-item-section v-if="!mini">
              {{ $t('default.management') }}
            </q-item-section>
          </template>

          <q-item
            v-if="menuItems.assignments"
            class="btn-icon-item href-link q-collapsible-indent"
            link
            exact
            tag="a"
            target="_self"
            :href="`${this.$env.legacyBaseUrl}/#/numerazioni?token=${this.token}`"
          >
            <q-item-section v-if="!mini">
              {{ $t('default.assignments') }}
            </q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.approvals"
            class="btn-icon-item href-link q-collapsible-indent"
            link
            exact
            tag="a"
            target="_self"
            :href="`${this.$env.legacyBaseUrl}/#/approvazione?token=${this.token}`"
          >
            <q-item-section v-if="!mini">
              {{ $t('default.approve') }}
            </q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.exchange"
            class="btn-icon-item href-link q-collapsible-indent"
            link
            exact
            tag="a"
            target="_self"
            :href="`${this.$env.legacyBaseUrl}/#/scambioFile?token=${this.token}`"
          >
            <q-item-section>
              {{ $t('default.fileExchange') }}
            </q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.target"
            class="btn-icon-item href-link q-collapsible-indent"
            link
            exact
            tag="a"
            target="_self"
            :href="`${this.$env.legacyBaseUrl}/#/target?token=${this.token}`"
          >
            <q-item-section v-if="!mini">
              {{ $t('default.target') }}
            </q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.report"
            class="btn-icon-item href-link q-collapsible-indent"
            link
            exact
            tag="a"
            target="_self"
            :href="`${this.$env.legacyBaseUrl}/#/report?token=${this.token}`"
          >
            <q-item-section>
              {{ $t('default.report') }}
            </q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.sync"
            class="btn-icon-item href-link q-collapsible-indent"
            link
            exact
            to="/sync"
          >
            <q-item-section v-if="!mini">
              {{ $t('default.sync') }}
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item
          v-if="menuItems.attachments"
          class="btn-icon-item href-link"
          link
          exact
          tag="a"
          target="_self"
          :href="`${this.$env.legacyBaseUrl}/#/documenti/?token=${this.token}`"
        >
          <q-item-section avatar>
            <prassi-round-button dark border-color="menu-1st-section" icon="fas fa-paperclip" />
          </q-item-section>
          <q-item-section v-if="!mini">
            {{ $t('default.attachments') }}
          </q-item-section>
        </q-item>

        <q-expansion-item v-if="menuItems.commissioningTop" class="q-collapsible">
          <template slot="header">
            <q-item-section avatar>
              <prassi-round-button
                dark
                border-color="menu-1st-section"
                icon="fa fa-numbers"
                @click="$router.push('/letters')"
              />
            </q-item-section>
            <q-item-section v-if="!mini">
              {{ $t('default.commissioning') }}
            </q-item-section>
          </template>

          <q-item v-if="menuItems.letter" class="q-collapsible-indent" link exact to="/letters">
            <q-item-section>{{ $t('default.letters') }}</q-item-section>
          </q-item>

          <q-item v-if="menuItems.receipts" class="q-collapsible-indent" link exact to="/pay-in">
            <q-item-section>{{ $t('default.payIn') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.installments"
            class="q-collapsible-indent"
            link
            exact
            to="/installments"
          >
            <q-item-section>{{ $t('default.installments') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.commissioning"
            class="q-collapsible-indent"
            link
            exact
            to="/commissioning"
          >
            <q-item-section>{{ $t('default.commissioning') }}</q-item-section>
          </q-item>

          <q-item v-if="menuItems.invoices" class="q-collapsible-indent" link exact to="/invoicing">
            <q-item-section>{{ $t('default.invoicing') }}</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item
          v-if="menuItems.accounting"
          class="q-collapsible"
          indent
          v-model="accountingOpened"
        >
          <template slot="header">
            <q-item-section avatar>
              <prassi-round-button
                dark
                border-color="menu-1st-section"
                icon="fa fa-accounting"
                @click="$router.push('/accounting')"
              />
            </q-item-section>
            <q-item-section v-if="!mini">
              {{ $t('default.accountingShort') }}
            </q-item-section>
          </template>

          <q-item
            v-if="menuItems.industrial"
            class="q-collapsible-indent"
            link
            exact
            to="/accounting"
          >
            <q-item-section>{{ $t('default.accountingIndustrial') }}</q-item-section>
          </q-item>

          <q-item
            class="q-collapsible-indent"
            v-if="menuItems.forecast"
            link
            exact
            to="/accounting/forecast"
          >
            <q-item-section>{{ $t('default.accountingForecast') }}</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item v-if="menuItems.configs" class="q-collapsible">
          <template slot="header">
            <q-item-section avatar>
              <prassi-round-button
                dark
                border-color="menu-1st-section"
                icon="fa fa-briefcase"
                type="a"
                :href="`${this.$env.legacyBaseUrl}/#/configurazioneCompagniaList?token=${this.token}`"
              />
            </q-item-section>
            <q-item-section v-if="!mini">
              {{ $t('default.configs') }}
            </q-item-section>
          </template>

          <q-item
            v-if="menuItems.company"
            class="btn-icon-item href-link q-collapsible-indent"
            link
            exact
            tag="a"
            target="_self"
            :href="`${this.$env.legacyBaseUrl}/#/configurazioneCompagniaList?token=${this.token}`"
          >
            <q-item-section>
              {{ $t('default.companyConfiguration') }}
            </q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.system"
            class="btn-icon-item href-link q-collapsible-indent"
            link
            exact
            tag="a"
            target="_self"
            :href="`${this.$env.legacyBaseUrl}/#/systemConfiguration?token=${this.token}`"
          >
            <q-item-section>
              {{ $t('default.systemConfiguration') }}
            </q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.productLegacy"
            class="btn-icon-item href-link q-collapsible-indent"
            link
            exact
            tag="a"
            target="_self"
            :href="`${this.$env.legacyBaseUrl}/#/prodotto?token=${this.token}`"
          >
            <q-item-section>
              {{ $t('default.products') }}
            </q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.clientDossier"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/customer-insurer"
          >
            <q-item-section>{{ $t('default.configurationCustomerInsurer') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.dossierInsurer"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/dossier-insurer"
          >
            <q-item-section>{{ $t('default.configurationProductsRoles') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.productComm"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/products"
          >
            <q-item-section>{{ $t('default.configurationProducts') }}</q-item-section>
          </q-item>
          <q-item
            v-if="menuItems.baseRole"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/roles"
          >
            <q-item-section>{{ $t('default.configurationRuoli') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.productSignaller"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/signaler-products"
          >
            <q-item-section>{{ $t('default.configurationSignalerProducts') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.productComm"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/products-survey"
          >
            <q-item-section>{{ $t('default.configurationProductsSurvey') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.productComm"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/products-numbers"
          >
            <q-item-section>{{ $t('default.configurationProductsNumbers') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.productComm"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/sepa-numbers"
          >
            <q-item-section>{{ $t('default.configurationSepaNumbers') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.roles"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/jobs"
          >
            <q-item-section>{{ $t('default.configurationJobs') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.mfee"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/management-fee"
          >
            <q-item-section>{{ $t('default.configurationManagementFee') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.premium"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/adjusted-premium"
          >
            <q-item-section>{{ $t('default.configurationAdjustedPremium') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.commConf && $env.edition === 'sheltia'"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/sheltia-commissioning"
          >
            <q-item-section>{{ $t('default.commissioning') }}</q-item-section>
          </q-item>
          <q-item
            v-if="menuItems.commConf && $env.edition === 'tcw'"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/tcw-commissioning"
          >
            <q-item-section>{{ $t('default.commissioning') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.commDynConf"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/tcw-commissioning-dynamic"
          >
            <q-item-section>{{ $t('default.commissioningDynamic') }}</q-item-section>
          </q-item>

          <q-item
            v-if="menuItems.survey"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/surveys"
          >
            <q-item-section>{{ $t('default.configurationSurveys') }}</q-item-section>
          </q-item>
          <q-item
            v-if="menuItems.questions"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/questions"
          >
            <q-item-section>{{ $t('default.configurationQuestions') }}</q-item-section>
          </q-item>
          <q-item
            v-if="menuItems.menu"
            class="q-collapsible-indent"
            link
            exact
            to="/configuration/menu-permissions"
          >
            <q-item-section>{{ $t('default.configurationMenuPermissions') }}</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item
          v-if="menuItems.estimates"
          class="btn-icon-item href-link"
          link
          exact
          tag="a"
          target="_self"
          :href="`${this.$env.legacyBaseUrl}/#/preventivatori/index?token=${this.token}`"
        >
          <q-item-section avatar>
            <prassi-round-button dark border-color="menu-1st-section" icon="fas fa-calculator" />
          </q-item-section>
          <q-item-section v-if="!mini">
            {{ $t('default.quotation') }}
          </q-item-section>
        </q-item>

        <q-item v-if="menuItems.log" class="btn-icon-item" link exact to="/log-events">
          <q-item-section avatar>
            <prassi-round-button
              dark
              border-color="menu-1st-section"
              icon="fa fa-clipboard-list"
              @click="$router.push('/log-events')"
            />
          </q-item-section>
          <q-item-section v-if="!mini">
            {{ $t('default.logEvents') }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <transition appear enter-active-class="animated fadeIn" mode="out-in">
        <router-view class="gt-xs" />
      </transition>

      <q-page class="lt-sm flex flex-center column q-ma-md">
        <img class="animated bounce slogo" alt="Tcw logo" src="~assets/small-browser.svg" />
        <div class="q-mt-sm text-center">{{ $t('default.browserTooSmall') }}</div>
      </q-page>
      <offline @detected-condition="handleConnectivityChange" />
    </q-page-container>

    <q-page-sticky position="bottom-left" :offset="[23, 23]" v-if="!network">
      <q-btn color="red" :label="$t('main.network')" />
    </q-page-sticky>

    <q-page-sticky position="bottom-left" :offset="[23, 23]" v-if="exportInProgress">
      <q-btn :loading="true" color="orange" style="width: 250px">
        <template #loading>
          {{ $t('main.exportInProgress') }}
          <q-spinner-hourglass class="on-right" />
        </template>
      </q-btn>
    </q-page-sticky>

    <q-page-sticky position="bottom-left" :offset="[23, 23]" v-if="exportCompleted">
      <q-btn
        :loading="downloadStarted"
        color="secondary"
        icon-right="fas fa-download"
        :label="$t('main.exportCompleted')"
        @click="downloadExport"
      />
    </q-page-sticky>
  </q-layout>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import download from 'getfile-rename-js';
import offline from 'v-offline';
import * as types from '../store/const';
import urlBreadcrumbs from '../components/base/url-breadcrumbs';

export default {
  name: 'DefaultLayout',
  components: {
    offline,
    urlBreadcrumbs,
  },
  data() {
    return {
      mini: true,
      leftDrawerOpen: this.$q.screen.gt.sm,
      showing: false,
      accountingOpened: false,
      downloadStarted: false,
      menuItems: {
        profile: false,

        clientsFolder: false,
        persons: false,
        precontractual: false,
        clients: false,
        identityCards: false,

        files: false,
        dossiers: false,
        packs: false,
        contracts: false,
        production: false,
        negative: false,
        backlog: false,

        people: false,
        users: false,
        onboarding: false,

        network: false,

        events: false,
        notification: false,
        activity: false,
        calendar: false,

        management: false,
        assignments: false,
        approvals: false,
        exchange: false,
        target: false,
        report: false,
        sync: false,

        attachments: false,

        commissioningTop: false,
        letter: false,
        receipts: false,
        installments: false,
        commissioning: false,
        invoices: false,

        accounting: false,
        industrial: false,
        forecast: false,

        configs: false,
        company: false,
        system: false,
        productLegacy: false,
        clientDossier: false,
        dossierInsurer: false,
        productComm: false,
        productSignaller: false,
        roles: false,
        mfee: false,
        premium: false,
        commConf: false,
        commDynConf: false,
        survey: false,
        questions: false,
        baseRole: false,
        menu: false,

        estimates: false,
        log: false,
      },
    };
  },
  created() {
    this.$utils.log('DEFAULT', 'created');
    this.fetchRoles();
    this.fetchMenuPermissions();
    this.fetchLetterTypes();
    this.fetchAllCompanies();
    this.fetchAllProducts();
    this.fetchNoteTypes();
    this.fetchSections();
    this.fetchBuckets();
    this.fetchTypes();
  },
  computed: {
    ...mapState({
      username: (state) => state.login.username,
      logged: (state) => state.login.logged,
      loginId: (state) => state.login._id,
      token: (state) => state.login.token,
      isFetching: (state) => state.error.isFetching,
      error: (state) => state.error.error,
      errorType: (state) => state.error.errorType,
      errorMessage: (state) => state.error.errorMessage,
      network: (state) => state.error.network,
      menu: (state) => state.configuration.menu,
      exportInProgress: (state) => state.documents.exportInProgress,
      exportCompleted: (state) => state.documents.exportCompleted,
      document: (state) => state.documents.document.item,
    }),
  },
  watch: {
    logged(logged) {
      if (!logged) this.$router.replace('/login');
    },
    errorType(errorType) {
      this.$utils.log('DEFAULT-LAYOUT', `error ${errorType}`);
      switch (errorType) {
        case types.ERROR_CONNECTION:
          this.$utils.err('DEFAULT-LAYOUT', `no error ${this.$t('promoters.errConnection')}`);
          this.resetError();
          break;
        case types.ERROR_INTERNAL:
          this.$q.notify(this.errorMessage);
          this.resetError();
          break;
        default:
          this.$utils.log('DEFAULT-LAYOUT', `no error ${errorType}`);
          break;
      }
    },
    menu: {
      immediate: true,
      handler(menu) {
        this.$utils.logobj('MENU', 'watch menu', menu);
        if (!menu) return;
        this.menuItems.profile = this.valueMenuExist(menu, 'profile');

        this.menuItems.clients = this.valueMenuExist(menu, 'clients');
        this.menuItems.persons = this.valueMenuExist(menu, 'persons');
        this.menuItems.precontractual = this.valueMenuExist(menu, 'precontractual');
        this.menuItems.identityCards = this.valueMenuExist(menu, 'identityCards');

        this.menuItems.clientsFolder = this.checkTrue([
          this.menuItems.clients,
          this.menuItems.persons,
          this.menuItems.identityCards,
        ]);

        this.menuItems.dossiers = this.valueMenuExist(menu, 'dossiers');
        this.menuItems.packs = this.valueMenuExist(menu, 'packs');
        this.menuItems.contracts = this.valueMenuExist(menu, 'contracts');
        this.menuItems.production = this.valueMenuExist(menu, 'production');
        this.menuItems.negative = this.valueMenuExist(menu, 'negative');
        this.menuItems.backlog = this.valueMenuExist(menu, 'backlog');

        this.menuItems.files = this.checkTrue([
          this.menuItems.dossiers,
          this.menuItems.packs,
          this.menuItems.contracts,
          this.menuItems.production,
          this.menuItems.negative,
          this.menuItems.backlog,
        ]);

        this.menuItems.users = this.valueMenuExist(menu, 'users');
        this.menuItems.onboarding = this.valueMenuExist(menu, 'onboarding');

        this.menuItems.people = this.checkTrue([this.menuItems.users, this.menuItems.onboarding]);

        this.menuItems.network = this.valueMenuExist(menu, 'network');

        this.menuItems.notification = this.valueMenuExist(menu, 'notification');
        this.menuItems.activity = this.valueMenuExist(menu, 'activity');
        this.menuItems.calendar = this.valueMenuExist(menu, 'calendar');

        this.menuItems.events = this.checkTrue([
          this.menuItems.notification,
          this.menuItems.activity,
          this.menuItems.calendar,
        ]);

        this.menuItems.management = this.valueMenuExist(menu, 'management');
        this.menuItems.assignments = this.valueMenuExist(menu, 'assignments');
        this.menuItems.approvals = this.valueMenuExist(menu, 'approvals');
        this.menuItems.exchange = this.valueMenuExist(menu, 'exchange');
        this.menuItems.target = this.valueMenuExist(menu, 'target');
        this.menuItems.report = this.valueMenuExist(menu, 'report');
        this.menuItems.sync = this.valueMenuExist(menu, 'sync');

        this.menuItems.management = this.checkTrue([
          this.menuItems.assignments,
          this.menuItems.approvals,
          this.menuItems.exchange,
          this.menuItems.target,
          this.menuItems.report,
          this.menuItems.sync,
        ]);

        this.menuItems.attachments = this.valueMenuExist(menu, 'attachments');

        this.menuItems.letter = this.valueMenuExist(menu, 'letter');
        this.menuItems.receipts = this.valueMenuExist(menu, 'receipts');
        this.menuItems.installments = this.valueMenuExist(menu, 'installments');
        this.menuItems.commissioning = this.valueMenuExist(menu, 'commissioning');
        this.menuItems.invoices = this.valueMenuExist(menu, 'invoices');

        this.menuItems.commissioningTop = this.checkTrue([
          this.menuItems.letter,
          this.menuItems.receipts,
          this.menuItems.installments,
          this.menuItems.commissioning,
          this.menuItems.invoices,
        ]);

        this.menuItems.industrial = this.valueMenuExist(menu, 'industrial');
        this.menuItems.forecast = this.valueMenuExist(menu, 'forecast');

        this.menuItems.accounting = this.checkTrue([
          this.menuItems.industrial,
          this.menuItems.forecast,
        ]);

        this.menuItems.company = this.valueMenuExist(menu, 'company');
        this.menuItems.system = this.valueMenuExist(menu, 'system');
        this.menuItems.productLegacy = this.valueMenuExist(menu, 'product-legacy');
        this.menuItems.clientDossier = this.valueMenuExist(menu, 'client-dossier');
        this.menuItems.dossierInsurer = this.valueMenuExist(menu, 'dossier-insurer');
        this.menuItems.productComm = this.valueMenuExist(menu, 'product-comm');
        this.menuItems.productSignaller = this.valueMenuExist(menu, 'product-signaller');
        this.menuItems.roles = this.valueMenuExist(menu, 'roles');
        this.menuItems.mfee = this.valueMenuExist(menu, 'mfee');
        this.menuItems.premium = this.valueMenuExist(menu, 'premium');
        this.menuItems.commConf = this.valueMenuExist(menu, 'comm-conf');
        this.menuItems.commDynConf = this.valueMenuExist(menu, 'comm-dyn-conf');
        this.menuItems.survey = this.valueMenuExist(menu, 'survey');
        this.menuItems.questions = this.valueMenuExist(menu, 'questions');
        this.menuItems.baseRole = this.valueMenuExist(menu, 'baseRole');
        this.menuItems.menu = this.valueMenuExist(menu, 'menu');

        this.menuItems.configs = this.checkTrue([
          this.menuItems.company,
          this.menuItems.system,
          this.menuItems.productLegacy,
          this.menuItems.clientDossier,
          this.menuItems.dossierInsurer,
          this.menuItems.productComm,
          this.menuItems.productSignaller,
          this.menuItems.roles,
          this.menuItems.mfee,
          this.menuItems.premium,
          this.menuItems.commConf,
          this.menuItems.commDynConf,
          this.menuItems.survey,
          this.menuItems.questions,
          this.menuItems.baseRole,
          this.menuItems.menu,
        ]);

        this.menuItems.estimates = this.valueMenuExist(menu, 'estimates');
        this.menuItems.log = this.valueMenuExist(menu, 'log');
      },
    },
  },
  methods: {
    ...mapActions({
      fetchRoles: 'promoters/fetchRoles',
      fetchLetterTypes: 'promoters/fetchLetterTypes',
      fetchAllCompanies: 'acquittance/fetchAllCompanies',
      fetchAllProducts: 'accounting/fetchAllProducts',
      fetchNoteTypes: 'promoters/fetchNoteTypes',
      fetchSections: 'configuration/fetchSections',
      fetchBuckets: 'configuration/fetchBuckets',
      fetchTypes: 'configuration/fetchTypes',
      fetchMenuPermissions: 'configuration/fetchMenuPermissions',
    }),
    ...mapMutations({
      logout: 'login/requestLogout',
      setNetwork: 'error/setNetwork',
      resetError: 'error/resetError',
      changeExportCompletedState: 'documents/changeExportCompletedState',
    }),
    handleConnectivityChange(status) {
      this.setNetwork(status);
    },
    valueMenuExist(arr, value) {
      return arr.some((el) => el.menuId === value);
    },
    checkTrue(arr) {
      return arr.includes(true);
    },
    menuClick() {
      if (this.$q.screen.gt.sm) {
        this.mini = !this.mini;
        this.$utils.logobj('DEFAULT', 'menuClick mini', this.mini);
      } else {
        this.mini = false;
        this.leftDrawerOpen = !this.leftDrawerOpen;
        this.$utils.logobj('DEFAULT', 'menuClick leftDrawerOpen', this.leftDrawerOpen);
      }
    },
    downloadExport() {
      this.$utils.log('DEFAULT', 'downloadExport');
      download(this.document.url, this.document.displayName);
      this.downloadStarted = true;
      setTimeout(() => {
        this.changeExportCompletedState(false);
        this.downloadStarted = false;
      }, 2000);
    },
  },
};
</script>

<style lang="stylus" scoped>
.q-toolbar
  height 70px
.prassi-logo
  height 50px
  padding-left 15px
  padding-right 15px
  margin-left 12px
  border-color $border-menu
  border-width 1px
  border-left-style solid
  border-right-style solid
.q-toolbar-title
  font-size 22px
.button-border-left
  padding-left 15px
  padding-right 15px
  border-color $border-menu
  border-width 1px
  border-left-style solid
.button-border-right
  border-right-style solid
.q-header
  box-shadow 0 0 3px 0 rgba(0, 0, 0, 0.4)
.href-link
  text-decoration none
  cursor pointer
.q-list
  font-size 20px
.q-collapsible-indent
  margin-left 55px
</style>
