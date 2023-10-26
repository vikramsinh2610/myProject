<template>
  <main class="page-dashboard">
    <prassi-dashboard-pane>
      <template #header>
        <div class="title">Prevendita</div>
        <div class="actions">
          <prassi-round-button
            @click="openSections.prevendita = !openSections.prevendita"
            size="20px"
            class="p-p-button"
            :icon="accordionIcon(openSections.prevendita)"
          />
        </div>
      </template>
    </prassi-dashboard-pane>

    <q-expansion-item header-style="display: none" v-model="openSections.prevendita">
      <section class="grid box-min box-border box-min-header">
        <prassi-dashboard-pane>
          <template #header>
            <div class="title title-sm">Referral</div>
            <div class="actions"></div>
          </template>

          <template #body>
            <q-card flat bordered class="box-flex">
              <div class="flex">
                <div class="info">N/A</div>
              </div>
            </q-card>
          </template>
        </prassi-dashboard-pane>

        <prassi-dashboard-pane>
          <template #header>
            <div class="title title-sm">
              {{ person.isCompany ? 'Persone' : 'Aziende' }} collegate
            </div>
            <div class="info">{{ person.isCompany ? persons.length : companies.length }}</div>
            <div class="actions">
              <prassi-round-button size="20px" class="p-p-button" icon="fa fa-plus" />
            </div>
          </template>

          <template #body>
            <q-card flat bordered class="box-flex">
              <div v-if="lastLinkedPerson" @click="personClick()" class="pointer">
                <div>
                  <div>{{ lastLinkedPerson.name }} {{ lastLinkedPerson.surname }}</div>
                  <div class="green">{{ lastLinkedPerson.company }}</div>
                  <div class="info">{{ lastLinkedPerson.email }}</div>
                </div>
                <div class="flex">
                  <div class="info">{{ lastLinkedPerson.mobilePhone || '-' }}</div>
                </div>
              </div>
              <div class="info" v-else>
                Nessuna {{ person.isCompany ? 'persona' : 'azienda' }} collegata
              </div>
            </q-card>
          </template>
        </prassi-dashboard-pane>
      </section>
    </q-expansion-item>

    <prassi-dashboard-pane class="top-box">
      <template #header>
        <div class="title title-click" @click="precontractualListClick">Mandato & Privacy</div>
        <div :class="`status ${precontractualStatusClass}`">{{ precontractualStatus }}</div>
        <div class="info">{{ precontractuals.length }} DOCS</div>
        <div class="actions">
          <prassi-round-button
            size="20px"
            class="p-p-button"
            icon="fa fa-plus"
            @click="precontractualCreateClick"
          />
          <prassi-round-button
            @click="openSections.precontractual = !openSections.precontractual"
            size="20px"
            class="p-p-button"
            :icon="accordionIcon(openSections.precontractual)"
          />
        </div>
      </template>

      <template #body>
        <q-expansion-item header-style="display: none" v-model="openSections.precontractual">
          <prassi-header-list class="p-pl-item header-sub" :blocks="precontrattualeHeader" />
          <prassi-empty-list v-if="precontractuals.length === 0 && !isFetching" />
          <div class="container-link-card">
            <div
              v-for="precontractual in precontractuals"
              :key="precontractual.id"
              @click="precontractualClick(precontractual.id)"
              class="link-card"
            >
              <prassi-body-list
                class="q-card-thin"
                :blocks="precontractualBody(precontractual)"
                :id="'some id'"
              />
            </div>
          </div>
        </q-expansion-item>
      </template>
    </prassi-dashboard-pane>

    <prassi-dashboard-pane class="top-box" v-if="precontractualDone">
      <template #header>
        <div class="title title-click" @click="surveyListClick">Analisi dei Bisogni</div>
        <div :class="`status ${statusSurveyStyle}`">{{ statusSurvey }}</div>
        <div class="info">{{ surveys.length }} DOCS</div>
        <div class="actions">
          <prassi-round-button
            size="20px"
            class="p-p-button"
            icon="fa fa-plus"
            @click="createNewSurvey()"
          />
          <prassi-round-button
            @click="openSections.survey = !openSections.survey"
            size="20px"
            class="p-p-button"
            :icon="accordionIcon(openSections.survey)"
          />
        </div>
      </template>

      <template #body>
        <q-expansion-item header-style="display: none" v-model="openSections.survey">
          <prassi-header-list class="p-pl-item header-sub" :blocks="surveyHeader" />
          <div class="container-link-card">
            <div
              v-for="survey in surveys"
              :key="survey._id"
              @click="() => surveyClick(survey)"
              class="link-card"
            >
              <prassi-body-list
                class="q-card-thin"
                :blocks="surveyBody(survey)"
                :id="'some other id'"
              />
            </div>
          </div>
        </q-expansion-item>
      </template>
    </prassi-dashboard-pane>

    <prassi-dashboard-pane class="top-box" v-if="consultingPaneVisible('noninv')">
      <template #header>
        <div class="title title-click" @click="consultingNonInvListClick">
          Consulenza Non Investimento
        </div>
        <div :class="`status ${consultingNonInv.style}`">{{ consultingNonInv.status }}</div>
        <div class="info">{{ consultingList.filter((x) => x.type === 'noninv').length }} DOCS</div>
        <div class="actions">
          <prassi-round-button
            size="20px"
            class="p-p-button"
            icon="fa fa-plus"
            v-if="canCreateConsulting('noninv')"
            @click="() => createNewConsulting('noninv')"
          />
          <prassi-round-button
            @click="openSections.consultingNonInv = !openSections.consultingNonInv"
            size="20px"
            class="p-p-button"
            :icon="accordionIcon(openSections.consultingNonInv)"
          />
        </div>
      </template>

      <template #body>
        <q-expansion-item header-style="display: none" v-model="openSections.consultingNonInv">
          <prassi-header-list class="p-pl-item header-sub" :blocks="consultingHeader" />
          <div class="container-link-card">
            <div
              v-for="consulting in consultingList.filter((x) => x.type === 'noninv')"
              :key="consulting._id"
              @click="() => consultingClick(consulting)"
              class="link-card"
            >
              <prassi-body-list
                class="q-card-thin"
                :blocks="consultingBody(consulting)"
                :id="'consulting body'"
              />
            </div>
          </div>
        </q-expansion-item>
      </template>
    </prassi-dashboard-pane>

    <prassi-dashboard-pane class="top-box" v-if="consultingPaneVisible('inv')">
      <template #header>
        <div class="title title-click" @click="consultingNonInvListClick">
          Consulenza Investimento
        </div>
        <div :class="`status ${consultingInv.style}`">{{ consultingInv.status }}</div>
        <div class="info">{{ consultingList.filter((x) => x.type === 'inv').length }} DOCS</div>
        <div class="actions">
          <prassi-round-button
            size="20px"
            class="p-p-button"
            icon="fa fa-plus"
            v-if="canCreateConsulting('inv')"
            @click="() => createNewConsulting('inv')"
          />
          <prassi-round-button
            @click="openSections.consultingInv = !openSections.consultingInv"
            size="20px"
            class="p-p-button"
            :icon="accordionIcon(openSections.consultingInv)"
          />
        </div>
      </template>

      <template #body>
        <q-expansion-item header-style="display: none" v-model="openSections.consultingInv">
          <prassi-header-list class="p-pl-item header-sub" :blocks="consultingHeader" />
          <div class="container-link-card">
            <div
              v-for="consulting in consultingList.filter((x) => x.type === 'inv')"
              :key="consulting._id"
              @click="() => consultingClick(consulting)"
              class="link-card"
            >
              <prassi-body-list
                class="q-card-thin"
                :blocks="consultingBody(consulting)"
                :id="'consulting body'"
              />
            </div>
          </div>
        </q-expansion-item>
      </template>
    </prassi-dashboard-pane>

    <prassi-dashboard-pane class="top-box" v-if="lastPraticePresent">
      <template #header>
        <div class="title title-click" @click="praticeListClick">Ultime pratiche</div>
        <div class="green">{{ !isNaN(sumAllIv) ? $n(sumAllIv, 'integer') : '-' }} IV</div>
        <div class="actions">
          <prassi-round-button
            @click="openSections.ultimePratiche = !openSections.ultimePratiche"
            size="20px"
            class="p-p-button"
            :icon="accordionIcon(openSections.ultimePratiche)"
          />
        </div>
      </template>

      <template #body>
        <q-expansion-item header-style="display: none" v-model="openSections.ultimePratiche">
          <section class="grid box-min" style="margin-top: 0.5em">
            <prassi-dashboard-pane>
              <template #header>
                <div class="title title-sm">Proposte in Corso</div>
                <div class="green">
                  {{ !isNaN(sumIv(proposals)) ? $n(sumIv(proposals), 'integer') : '-' }} IV
                </div>
                <div class="info">{{ proposals.length }} DOCS</div>
                <div class="actions"></div>
              </template>

              <template #body>
                <div class="container-dossier">
                  <div class="dossier-single" v-for="item in proposals.slice(0)" :key="item.uuid">
                    <div
                      class="q-chip row inline no-wrap items-center p-c-chip lowercase bg-lg-2 text-primary q-chip--colored q-chip--dense"
                    >
                      <div class="q-chip__content col row no-wrap items-center q-anchor--skip">
                        {{ getChip(item.praticeType) }}
                      </div>
                    </div>
                    <q-card
                      flat
                      bordered
                      @click="dossierClick(item, 'proposal')"
                      class="dossier row"
                    >
                      <div style="width: 40%">
                        <div class="info">{{ item.productName }}</div>
                        <div>{{ item.practiceId }}</div>
                      </div>
                      <div style="width: 30%">
                        <div :class="`status ${getStatusClass(item.statusName)}`">
                          {{ item.iv }} IV
                        </div>
                        <div class="info">{{ item.premiumGross }} €</div>
                      </div>
                      <div style="width: 30%; text-align: right">
                        <div :class="`status ${getStatusClass(item.statusName)}`">
                          {{ item.statusName }}
                        </div>
                        <div class="info">{{ formatDate(item.createdDate) }}</div>
                      </div>
                    </q-card>
                  </div>
                </div>
              </template>
            </prassi-dashboard-pane>

            <prassi-dashboard-pane>
              <template #header>
                <div class="title title-sm">Pacchetti</div>
                <div class="green">
                  {{ !isNaN(sumIv(packages)) ? $n(sumIv(packages), 'integer') : '-' }} IV
                </div>
                <div class="info">{{ packages.length }} DOCS</div>
                <div class="actions"></div>
              </template>

              <template #body>
                <div class="container-dossier">
                  <div class="dossier-single" v-for="item in packages.slice(0)" :key="item.uuid">
                    <div
                      class="q-chip row inline no-wrap items-center p-c-chip lowercase bg-lg-2 text-primary q-chip--colored q-chip--dense"
                    >
                      <div class="q-chip__content col row no-wrap items-center q-anchor--skip">
                        {{ getChip(item.praticeType) }}
                      </div>
                    </div>
                    <q-card
                      flat
                      bordered
                      @click="dossierClick(item, 'package')"
                      class="dossier row"
                    >
                      <div style="width: 40%">
                        <div class="info">{{ item.productName }}</div>
                        <div>{{ item.practiceId }}</div>
                      </div>
                      <div style="width: 30%">
                        <div :class="`status ${getStatusClass(item.statusName)}`">
                          {{ item.iv }} IV
                        </div>
                        <div class="info">{{ item.premiumGross }} €</div>
                      </div>
                      <div style="width: 30%; text-align: right">
                        <div :class="`status ${getStatusClass(item.statusName)}`">
                          {{ item.statusName }}
                        </div>
                        <div class="info">{{ formatDate(item.createdDate) }}</div>
                      </div>
                    </q-card>
                  </div>
                </div>
              </template>
            </prassi-dashboard-pane>

            <prassi-dashboard-pane>
              <template #header>
                <div class="title title-sm">Contratti</div>
                <div class="green">
                  {{ !isNaN(sumIv(contracts)) ? $n(sumIv(contracts), 'integer') : '-' }} IV
                </div>
                <div class="info">{{ contracts.length }} DOCS</div>
                <div class="actions"></div>
              </template>

              <template #body>
                <div class="container-dossier">
                  <div class="dossier-single" v-for="item in contracts.slice(0)" :key="item.uuid">
                    <div
                      class="q-chip row inline no-wrap items-center p-c-chip lowercase bg-lg-2 text-primary q-chip--colored q-chip--dense"
                    >
                      <div class="q-chip__content col row no-wrap items-center q-anchor--skip">
                        {{ getChip(item.praticeType) }}
                      </div>
                    </div>
                    <q-card
                      flat
                      bordered
                      @click="dossierClick(item, 'contract')"
                      class="dossier row"
                    >
                      <div style="width: 40%">
                        <div class="info">{{ item.productName }}</div>
                        <div class="info">{{ item.practiceId }}</div>
                        <div>{{ item.contractId }}</div>
                      </div>
                      <div style="width: 30%">
                        <div :class="`status ${getStatusClass(item.statusName)}`">
                          {{ item.iv }} IV
                        </div>
                        <div class="info">{{ item.premiumGross }} €</div>
                      </div>
                      <div style="width: 30%; text-align: right">
                        <div :class="`status ${getStatusClass(item.statusName)}`">
                          {{ item.statusName }}
                        </div>
                        <div class="info">{{ formatDate(item.createdDate) }}</div>
                      </div>
                    </q-card>
                  </div>
                </div>
              </template>
            </prassi-dashboard-pane>
          </section>
        </q-expansion-item>
      </template>
    </prassi-dashboard-pane>

    <prassi-dashboard-pane class="hidden" :chip="'CM'">
      <template #header>
        <div class="title">Attivita'</div>
        <div class="info">3 Eventi</div>
        <div class="actions"><div>icon</div></div>
      </template>

      <template #body>
        <div class="flex">
          <div>Presentazione</div>
          <div class="info">Investimento</div>
        </div>

        <div class="flex">
          <div class="info">29/07/2021</div>
          <div class="info">340/5930127</div>
        </div>
      </template>
    </prassi-dashboard-pane>
    <q-inner-loading :showing="isFetching">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </main>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import moment from 'moment';
import uuid from 'uuid';
import PrassiHeaderList from '../components/base/prassi-header-list';
import PrassiBodyList from '../components/base/prassi-body-list';
import PrassiEmptyList from '../components/base/prassi-empty-list';
import PrassiDashboardPane from '../components/customer/prassi-dashboard-pane';

const parseDate = (v) => (v ? moment(v).format('DD/MM/YYYY') : '-');

export default {
  name: 'PersonDetailDashboard',
  components: { PrassiHeaderList, PrassiBodyList, PrassiEmptyList, PrassiDashboardPane },

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async mounted() {
    const customerId = this.$route.params.id;

    this.resetPersonPersons();
    this.resetPersonCompanies();
    this.resetPrecontractuals();
    this.resetPrecontractual();
    await this.fetchRoles();
    await this.syncCustomerPractices(customerId);

    await this.fetchPrecontractualSummmary(customerId);

    // eslint-disable-next-line unicorn/prefer-ternary
    if (this.person.isCompany) {
      await this.fetchPersonPersons(customerId);
      if (this.persons.length) {
        const res = await this.fetchPerson(this.persons[0].uuid);
        this.lastLinkedPerson = res.item;
      }
    } else {
      await this.fetchPersonCompanies(customerId);
      if (this.companies.length) {
        const res = await this.fetchPerson(this.companies[0].uuid);
        this.lastLinkedPerson = res.item;
      }
    }

    await this.fetchInquirySurveyResults({ customerId });

    await this.initUltimePratiche(customerId);
    await this.fetchConsultingList({ customerId });
  },

  computed: {
    ...mapState({
      token: (state) => state.login.token,
      person: (state) => state.dossiers.customer,
      roles: (state) => state.promoters.roles.items,
      persons: (state) => state.dossiers.personPersons.items,
      precontractuals: (state) => state.dossiers.precontractuals.items,
      companies: (state) => state.dossiers.personCompanies.items,
      surveyResults: (state) => state.surveys.inquiryList,
      consultingList: (state) => state.consulting.list,
      isFetching: (state) => state.error.isFetching,
    }),
    sumAllIv() {
      return this.sumIv(this.contracts) + this.sumIv(this.packages) + this.sumIv(this.proposals);
    },
    lastPraticePresent() {
      return this.proposals.length > 0 || this.packages.length > 0 || this.contracts.length;
    },

    precontractualDone() {
      return this.precontractuals && this.precontractuals.find((x) => x.status === 1);
    },

    precontractualStatus() {
      if (!this.precontractuals.length > 0) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.openSections.precontractual = false;
        return '';
      }
      if (this.precontractuals && this.precontractuals.every((x) => x.status === 1)) {
        if (
          this.precontractuals.find((x) => moment().diff(moment(x.signedDate), 'years', true) > 3)
        ) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.openSections.precontractual = true;
          return 'Da risolvere';
        }
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.openSections.precontractual = false;
        return 'Completo';
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.openSections.precontractual = true;
      return 'In corso';
    },
    precontractualStatusClass() {
      if (this.precontractuals && this.precontractuals.every((x) => x.status === 1)) {
        if (
          this.precontractuals.find((x) => moment().diff(moment(x.signedDate), 'years', true) > 3)
        ) {
          return 'red';
        }
        return 'green';
      }
      return 'yellow';
    },
    statusSurvey() {
      if (!this.surveys.length > 0) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.openSections.survey = false;
        return '';
      }
      if (this.surveys && this.surveys.every((x) => x.signature?.procedureCompleted)) {
        if (
          this.surveys.find((x) => moment().diff(moment(x.signature.signedDate), 'years', true) > 1)
        ) {
          return 'red';
        }
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.openSections.survey = false;
        return 'Completo';
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.openSections.survey = true;
      return 'In corso';
    },
    statusSurveyStyle() {
      if (this.surveys && this.surveys.every((x) => x.signature?.procedureCompleted)) {
        return 'green';
      }
      return 'yellow';
    },

    consultingNonInv() {
      const consultingListNonInv = this.consultingList.filter((x) => x.type === 'noninv');
      if (!consultingListNonInv.length > 0) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.openSections.consultingNonInv = false;
        return {
          status: '',
          style: '',
        };
      }
      if (consultingListNonInv.every((x) => x.signature?.procedureCompleted)) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.openSections.consultingNonInv = false;
        return {
          status: 'Completo',
          style: 'green',
        };
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.openSections.consultingNonInv = true;
      return {
        status: 'In corso',
        style: 'yellow',
      };
    },
    consultingInv() {
      const consultingListInv = this.consultingList.filter((x) => x.type === 'inv');
      if (!consultingListInv.length > 0) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.openSections.consultingInv = false;
        return {
          status: '',
          style: '',
        };
      }
      if (consultingListInv.every((x) => x.signature?.procedureCompleted)) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.openSections.consultingInv = false;
        return {
          status: 'Completo',
          style: 'green',
        };
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.openSections.consultingInv = true;
      return {
        status: 'In corso',
        style: 'yellow',
      };
    },
    lastSignedPrecontractual() {
      return [...this.precontractuals].reverse().find((x) => x.status === 1);
    },

    surveys() {
      return this.surveyResults;
      // return [...this.surveyResults].filter(
      // (x) => x.type === 'inquiry' || x.type === 'company-inquiry',
      // );
    },

    lastSignedSurvey() {
      return [...this.surveys].reverse().find((x) => x.signature?.procedureCompleted);
    },
  },

  methods: {
    ...mapActions({
      fetchPerson: 'surveys/fetchPerson',
      createPrecontractual: 'dossiers/createPrecontractual',
      fetchPrecontractualSummmary: 'dossiers/fetchPrecontractualSummmary',
      fetchPersonPersons: 'dossiers/fetchPersonPersons',
      fetchPersonCompanies: 'dossiers/fetchPersonCompanies',
      fetchInquirySurveyResults: 'surveys/fetchInquirySurveyResults',
      fetchPersonDossiers: 'dossiers/fetchPersonDossiers',
      fetchConsultingResult: 'consulting/fetchResult',
      fetchConsultingList: 'consulting/fetchList',
      fetchRoles: 'promoters/fetchRoles',
      syncCustomerPractices: 'dossiers/syncCustomerPractices',
    }),

    ...mapMutations({
      setTime: 'dossiers/setTime',
      setCustomerSearchFilter: 'dossiers/setCustomerSearchFilter',
      setCustomerFilterAll: 'dossiers/setCustomerFilterAll',
      resetDossiersSearch: 'dossiers/resetDossiersSearch',
      resetPersonPersons: 'dossiers/resetPersonPersons',
      resetPrecontractual: 'dossiers/resetPrecontractual',
      resetPrecontractuals: 'dossiers/resetPrecontractuals',
      resetPersonCompanies: 'dossiers/resetPersonCompanies',
    }),

    async initUltimePratiche(customerId) {
      const init = async (key, practiceType) => {
        const res = await this.fetchPersonDossiers({
          customerId,
          practiceType,
          promoterId: this.loginId,
          skipReceive: true,
        });
        this[key] = res.items;
      };

      await Promise.all([
        init('contracts', 'contract'),
        init('proposals', 'proposal'),
        init('packages', 'package'),
      ]);
    },

    sumIv(items) {
      return items.reduce((sum, item) => sum + item.iv, 0);
    },

    getChip(type) {
      if (type === 'subscription' || type === 'Sottoscrizione') {
        return 'SO';
      }
      if (type === 'total-ransom' || type === 'Riscatto totale') {
        return 'TR';
      }
      return 'VA';
    },

    getStatusClass(state) {
      if (state === 'Bozza') {
        return 'yellow';
      }
      if (state === 'Inviata') {
        return 'yellow';
      }
      if (state === 'Approvata') {
        return 'green';
      }
      if (state === 'In elaborazione') {
        return 'yellow';
      }
      if (state === 'Annullata') {
        return 'red';
      }
      if (state === 'In vigore') {
        return 'green';
      }
      if (state === 'Chiusa') {
        return 'red';
      }
      if (state === 'Incompleta') {
        return 'red';
      }
      if (state === 'Sospesa') {
        return 'red';
      }
      if (state === 'Al Corrente') {
        return 'green';
      }
      return 'yellow';
    },

    accordionIcon(open) {
      return open ? 'fa fa-chevron-up' : 'fa fa-chevron-down';
    },

    async precontractualCreateClick() {
      const resp = await this.createPrecontractual(this.$route.params.id);
      const preId = resp.item.id;
      if (preId) {
        this.$router.push(`/persons/${this.$route.params.id}/precontractual/${preId}/`);
      }
    },

    precontractualClick(preId) {
      this.$router.push(`/persons/${this.$route.params.id}/precontractual/${preId}/`);
    },

    precontractualListClick() {
      this.$router.push(`/persons/${this.$route.params.id}/precontractual-list`);
    },

    consultingNonInvListClick() {
      this.$router.push(`/persons/${this.$route.params.id}/consulting`);
    },

    praticeListClick() {
      this.$router.push(`/persons/${this.$route.params.id}/dossiers`);
    },

    surveyListClick() {
      this.$router.push(`/persons/${this.$route.params.id}/inquiry-survey`);
    },

    personClick() {
      window.location.href = `/persons/${this.lastLinkedPerson.uuid}`;
    },

    dossierClick(item, type) {
      let page;

      const isVA = item.practiceType === 'additional-income';
      const doVA = () => {
        const relatedContractId = this.contracts.find((c) => c.contractId === item.contractId);
        if (!relatedContractId) throw new Error("Can't find related contract for VA proposal");

        return `versamentoAggiuntivo/${relatedContractId.legacyViewId}`;
      };

      if (type === 'contract') page = 'contratto';
      if (type === 'contract' && item.practiceType === 'special') {
        page = 'dettaglioPropostaEsterna';
      }

      if (type === 'package') {
        page = 'dettaglioPacchettoProposta';
        if (isVA) page = doVA();
      }

      if (type === 'proposal') {
        if (item.practiceType === 'subscription') page = 'dettaglioProposta';
        if (isVA) page = doVA();
      }

      if (!page) {
        this.$q.notify({
          message: `tipo proposta non gestito ${type} ${item.uuid}`,
          type: 'warning',
          timeout: 2000,
        });
        return;
      }

      const url = `${this.$env.legacyBaseUrl}/#/${page}/${item.legacyViewId}?token=${this.token}`;
      window.open(url, '_self');
    },

    surveyClick(survey) {
      this.$router.push(`survey-results/${survey._id}`);
    },

    createNewSurvey() {
      const INQUIRY_ID = '50ad3529-7fe2-4841-b734-9cf564f309f4';
      const COMPANY_INQUIRY_ID = 'deb06a45-c680-4415-a4f3-74f5c1aabad1';

      if (this.person.isCompany) {
        this.$router.push(`surveys/${COMPANY_INQUIRY_ID}`);
      } else {
        this.$router.push(`surveys/${INQUIRY_ID}`);
      }
    },

    consultingClick(consulting) {
      this.$router.push(`consulting/${consulting._id}`);
    },

    createNewConsulting(type) {
      this.$router.push(
        `consulting/${uuid()}?type=${type}&inquiryResultId=${this.lastSignedSurvey._id}`,
      );
    },

    consultingPaneVisible(type) {
      return this.consultingList.some((x) => x.type === type) || this.canCreateConsulting(type);
    },

    canCreateConsulting(type) {
      if (!this.precontractualDone) return false;
      if (!this.lastSignedSurvey) return false;
      if (this.documentsSignatureExpired()) return false;

      const categories = this.lastSignedSurvey.categories?.map((c) => c.toLowerCase());
      if (!categories) return false;

      if (type === 'noninv') {
        return categories.some((c) => c.includes('previdenza') || c.includes('protezione'));
      }
      if (type === 'inv') {
        return categories.some((c) => c.includes('investimento'));
      }

      return false;
    },

    documentsSignatureExpired() {
      const today = moment();

      const precontractualExpiration = this.$utils.precontractualExpiration(
        this.lastSignedPrecontractual,
      );
      if (today > precontractualExpiration) return true;

      const inquirySurveyExpiration = this.$utils.inquirySurveyExpiration(this.lastSignedSurvey);
      if (today > inquirySurveyExpiration) return true;

      return false;
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },

    precontractualBody(pre) {
      const creationDate = pre.createdDate ? moment(pre.createdDate).format('DD/MM/YYYY') : '-';

      const creationDateYear = pre.createdDate ? moment(pre.createdDate).format('YYYY') : '-';

      const signedDate = pre.signedDate ? moment(pre.signedDate).format('DD/MM/YYYY') : '-';

      const precontractualExpiration = this.$utils.precontractualExpiration(pre);

      const isExpired = moment().diff(moment(pre.signedDate), 'years', true) > 3;

      let status = pre.status === 1 ? 'Firmato' : 'Bozza';
      let classStatus = pre.status === 1 ? 'green' : 'yellow';
      const { stepper } = pre.stepperStatus;
      const opt = stepper.find(({ name }) => name === 'otp');
      if (opt && opt.status === 'completed' && pre.status !== 1) {
        status = 'Da firmare';
        classStatus = 'yellow';
      }

      if (isExpired && pre.status === 1) {
        status = 'Scaduto';
        classStatus = 'red';
      }

      const precontractualExpirationDate = precontractualExpiration
        ? precontractualExpiration.format('DD/MM/YYYY')
        : '-';

      return [
        {
          _id: '00',
          type: 'chip',
          className: 'chip-circle',
          icon: 'fa fa-check',
          chipText: 'FE',
        },
        {
          _id: 'pre1',
          label: signedDate,
          sublabel: creationDate,
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: 'pre2',
          label: `FE-${pre.id}-${creationDateYear}`,
          className: 'text-big',
          size: 'small',
          weight: 'normal',
          width: 120,
          type: '2rows',
        },
        {
          _id: 'pre3',
          label: status,
          className: `${classStatus} text-big`,
          size: 'small',
          weight: 'normal',
          width: 130,
          type: '2rows',
        },
        {
          _id: 'pre4',
          label: this.person.promoterName,
          sublabel: this.person.networkHierarchy,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, this.person.roleId),
          size: 'large',
          weight: 'light',
          width: 240,
          type: '2rows',
          col: true,
        },
        {
          _id: 'pre5',
          label: precontractualExpirationDate,
          className: `${isExpired ? classStatus : ''}`,
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
      ];
    },

    surveyBody(survey) {
      const { signature, codeSurveyResult, creationDate, categories } = survey;

      const inquirySurveyExpiration = this.$utils.inquirySurveyExpiration(survey);
      const inquirySurveyExpirationDate = inquirySurveyExpiration
        ? inquirySurveyExpiration.format('DD/MM/YYYY')
        : '-';

      let status = signature?.procedureCompleted ? 'Firmato' : 'Bozza';
      let classStatus = signature?.procedureCompleted ? 'green' : 'yellow';

      if (signature) {
        const isExpired = moment().diff(moment(signature.signedDate), 'years', true) > 1;
        if (isExpired) {
          status = 'Scaduto';
          classStatus = 'red';
        }
      }

      const first = 'Risparmio/Investimento';
      let products = categories || [];

      if (categories.length > 1 && categories.find((x) => x === first)) {
        const filtered = categories.filter((x) => first !== x);
        products = [first, ...filtered];
      }

      return [
        {
          _id: 'ab00',
          type: 'chip',
          className: 'chip-circle',
          icon: 'fa fa-check',
          chipText: 'AB',
        },
        {
          _id: 'ab0',
          label: parseDate(signature?.signedDate),
          sublabel: parseDate(creationDate),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: 'ab1',
          label: codeSurveyResult,
          className: 'text-big',
          size: 'small',
          weight: 'normal',
          width: 120,
          type: '2rows',
        },
        {
          _id: 'ab2',
          label: status,
          className: `${classStatus} text-big`,
          size: 'small',
          weight: 'normal',
          width: 130,
          type: '2rows',
        },
        {
          _id: 'ab3',
          label: this.person.promoterName,
          sublabel: this.person.networkHierarchy,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, this.person.roleId),
          size: 'large',
          weight: 'light',
          width: 100,
          type: '2rows',
          col: true,
        },
        {
          _id: 'ab8',
          label: products.filter((x) => x).join(', '),
          size: 'small',
          weight: 'normal',
          className: 'text-uppercase text-big text-center no-ellipsis',
          width: 250,
          type: '2rows',
        },
        {
          _id: 'pre5',
          label: inquirySurveyExpirationDate,
          className: '',
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
      ];
    },

    consultingBody(consulting) {
      const { signature, product, creationDate, proposalNumber } = consulting;
      let status = signature?.procedureCompleted ? 'Firmato' : 'Bozza';
      let classStatus = signature?.procedureCompleted ? 'green' : 'yellow';

      if (product?.isClosed) {
        status = 'Chiusa';
        classStatus = 'red';
      }

      return [
        {
          _id: 'cs00',
          type: 'chip',
          className: 'chip-circle',
          icon: 'fa fa-check',
          chipText: 'CS',
        },
        {
          _id: 'cs0',
          label: parseDate(signature?.signedDate),
          sublabel: parseDate(creationDate),
          size: 'small',
          weight: 'normal',
          width: 100,
          type: '2rows',
        },
        {
          _id: 'cs1',
          label: proposalNumber,
          className: 'text-big',
          size: 'small',
          weight: 'normal',
          width: 120,
          type: '2rows',
        },
        {
          _id: 'cs2',
          label: status,
          className: `${classStatus} text-big`,
          size: 'small',
          weight: 'normal',
          width: 130,
          type: '2rows',
        },
        {
          _id: 'cs3',
          label: this.person.promoterName,
          sublabel: this.person.networkHierarchy,
          sublabelChip: true,
          color: this.$utils.getRoleColor(this.roles, this.person.roleId),
          size: 'large',
          weight: 'light',
          type: '2rows',
          col: true,
        },
        {
          _id: 'cs4',
          label: product.name,
          size: 'small',
          weight: 'normal',
          className: 'categories-product',
          width: 300,
          type: '2rows',
        },
      ];
    },
  },

  data() {
    return {
      dossiers: [],
      promoters: [],
      lastLinkedPerson: undefined,
      packages: [],
      proposals: [],
      contracts: [],
      statusPrecontractual: '',
      statusPrecontractualStyle: '',

      openSections: {
        prevendita: true,
        ultimePratiche: true,
        precontractual: false,
        consultingNonInv: false,
        consultingInv: false,
        survey: false,
      },

      precontrattualeHeader: [
        {
          _id: '0',
          label: 'Data firma',
          sublabel: 'Data creazione',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
        {
          _id: '1',
          label: 'Numero',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 130,
        },
        {
          _id: '2',
          label: 'Stato firma',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 120,
        },
        {
          _id: '3',
          label: 'Promotore',
          sublabel: 'Rete',
          size: 'small',
          weight: 'normal',
          width: 600,
        },
        {
          _id: '4',
          label: 'Valida fino al:',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
      ],

      precontrattualeBody: [],

      surveyHeader: [
        {
          _id: 'ab0',
          label: 'Data firma',
          sublabel: 'Data creazione',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
        {
          _id: 'ab1',
          label: 'Numero',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 130,
        },
        {
          _id: 'ab7',
          label: 'Stato firma',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 120,
        },
        {
          _id: 'ab3',
          label: 'Promotore',
          sublabel: 'Rete',
          size: 'small',
          weight: 'normal',
          width: 330,
        },
        {
          _id: 'ab8',
          label: 'Categorie prodotti collocabili',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 220,
        },
        {
          _id: 'ab4',
          label: 'Valida fino al:',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
      ],

      consultingHeader: [
        {
          _id: 'cs0',
          label: 'Data firma',
          sublabel: 'Data creazione',
          size: 'small',
          weight: 'normal',
          width: 100,
        },
        {
          _id: 'cs1',
          label: 'Numero',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 130,
        },
        {
          _id: 'cs7',
          label: 'Stato firma',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 120,
        },
        {
          _id: 'cs8',
          label: 'Promotore',
          sublabel: 'Rete',
          size: 'small',
          weight: 'normal',
          width: 430,
        },
        {
          _id: 'cs9',
          label: 'Prodotto',
          sublabel: '',
          size: 'small',
          weight: 'normal',
          width: 250,
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.box .info {
  color: #aaa;
}

.page-dashboard {
  .q-card {
    margin: 0.5em 0;
    padding: 1em;
    border: 0;
  }

  .q-card.listing-header-container {
    border: solid 1px #dfe2e5;
    border-top: 0;
    margin: 0 0 0.2rem;
  }

  .q-card-thin .q-card {
    padding-top: 0.3em;
    padding-bottom: 0.3em;
  }

  .q-card-thin > div {
    border: solid 1px #dfe2e5;
    border-radius: 4px;
  }

  .q-btn--dense.q-btn--round .q-btn__wrapper {
    min-width: 36px;
    min-height: 36px;
  }

  .dossier {
    border: solid 1px #dfe2e5;
    border-radius: 4px;
  }

  .red {
    color: #db424f;
  }

  .green {
    color: #86c24c;
  }

  .yellow {
    color: #f5b945;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .box {
    margin-bottom: 0.5em;
  }

  > .top-box {
    margin: 1.5em 0;
  }

  .box .title {
    text-transform: uppercase;
    border: 0;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  }

  .box-min-header {
    .q-card {
      margin: 0;
    }
  }

  .box-min {
    .box header {
      height: 65px;
    }
    .box-flex {
      min-height: 85px;
    }
  }

  .box-border {
    .box {
      border: solid 1px #dfe2e5;
      border-radius: 4px;
    }
    .box header {
      border: 0;
      position: relative;
    }
    .box header:after {
      position: absolute;
      content: '';
      border-bottom: solid 1px #dfe2e5;
      width: 95%;
      transform: translateX(-50%);
      bottom: 0px;
      left: 50%;
    }
  }

  .status {
    min-width: 250px;
  }

  .dossier .status {
    min-width: auto;
  }

  .container-dossier {
    overflow: scroll;
    max-height: 190px;
  }

  .box header {
    display: flex;
    align-items: center;
    background: #fff;
    border: solid 1px #dfe2e5;
    border-radius: 4px;
  }

  .text-big {
    font-size: 20px;
  }

  .header-sub {
    padding-top: 0.2em;
    padding-bottom: 0.2em;
    .p-tr-main-text-small {
      color: #7f8fa4 !important;
      line-height: 16px;
      font-size: 16px;
    }
    .p-tr-small-text-small {
      font-size: 14px;
    }
  }
  .box header .title {
    font-size: 24px;
  }
  .box header .title-sm {
    font-size: 16px;
  }
  .box header .actions {
    flex-grow: 1;
    justify-content: flex-end;
    display: flex;
    border: 0;
  }
  .box header .actions > * {
    margin: 0 0.25em;
  }

  .link-card {
    cursor: pointer;
    padding-left: 12px;
  }

  .categories {
    text-transform: uppercase;
  }

  .box header > * {
    border: 0 solid #eee;
    border-left-width: 1px;
    border-right-width: 0px;
    padding: 1em 1.25rem;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  }

  .box .pane {
    position: relative;
  }

  .box .pane .flex {
    display: flex;
    justify-content: space-between;
  }

  .box .pane.with-chip .flex {
    padding-left: 10px;
  }

  .box .p-c-chip {
    position: absolute;
    left: -27px;
    top: 50%;
    margin-top: -10px;
    font-size: 20px;
  }

  .container-link-card {
    overflow: scroll;
    max-height: 165px;
  }

  .title-click {
    cursor: pointer;
    min-width: 540px;
  }

  .dossier {
    margin-bottom: 1em;
    cursor: pointer;
  }

  .text-yellow {
    color: #f5b945 !important;
  }

  .pointer {
    cursor: pointer;
  }

  .dossier-single {
    position: relative;
    padding-left: 12px;
    .p-c-chip {
      left: 2px;
      font-size: 14px;
      z-index: 20;
    }
  }

  .link-card .q-chip:first-child {
    font-size: 14px;
    width: 24px;
    text-align: center;
  }

  .no-ellipsis.ellipsis {
    text-overflow: unset;
    white-space: normal;
  }
}
</style>
