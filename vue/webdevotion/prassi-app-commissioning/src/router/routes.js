import Vue from 'vue';
import LoginLayout from '../layouts/login';
import DefaultLayout from '../layouts/default';
import Login from '../pages/login';
// eslint-disable-next-line unicorn/import-index
import Index from '../pages/index';
import Commissioning from '../pages/commissioning';
import CommissioningList from '../pages/commissioning-list';
import CommissioningDetail from '../pages/commissioning-detail';
import Invoicing from '../pages/invoicing';
import ConfigurationManagementFee from '../pages/configuration-management-fee';
import ConfigurationManagementFeeDetail from '../pages/configuration-management-fee-detail';
import ConfigurationSignalerProducts from '../pages/configuration-signaler-products';
import ConfigurationSignalerProductsDetail from '../pages/configuration-signaler-products-detail';
import ConfigurationDossierInsurer from '../pages/configuration-dossier-insurer';
import ConfigurationCustomerInsurer from '../pages/configuration-customer-insurer';
import ConfigurationSheltiaCommissioning from '../pages/configuration-sheltia-commissioning';
import ConfigurationSheltiaCommissioningDetail from '../pages/configuration-sheltia-commissioning-detail';
import ConfigurationTcwCommissioning from '../pages/configuration-tcw-commissioning';
import ConfigurationTcwCommissioningDetail from '../pages/configuration-tcw-commissioning-detail';
import ConfigurationTcwCommissioningDynamic from '../pages/configuration-tcw-commissioning-dynamic';
import ConfigurationTcwCommissioningDynamicDetail from '../pages/configuration-tcw-commissioning-dynamic-detail';
import ConfigurationJobs from '../pages/configuration-jobs';
import ConfigurationJobsDetail from '../pages/configuration-jobs-detail';
import PayIn from '../pages/pay-in';
import PayInList from '../pages/pay-in-list';
import PayInDetail from '../pages/pay-in-detail';
import Letters from '../pages/letters';
import PromotersDetailLetters from '../pages/promoters-detail-letters';
import Customers from '../pages/customers';
import CustomersIdentityCards from '../pages/customers-identity-cards';
import CustomersDetail from '../pages/customers-detail';
import CustomersDetailHistory from '../pages/customers-detail-history';
import PromotersDetailCompany from '../pages/promoters-detail-company';
import PromotersDetailLetter from '../pages/promoters-detail-letter';
import PromotersDetailDocuments from '../pages/promoters-detail-documents';
import PromotersDetailDownloads from '../pages/promoters-detail-downloads';
import PromotersDetailTarget from '../pages/promoters-detail-target';
import LogEventList from '../pages/log-event-list';
import SyncPractice from '../pages/sync-practice';
import Tree from '../pages/tree';
import ConfigurationSurvey from '../pages/configuration-survey';
import ConfigurationSurveyDetail from '../pages/configuration-survey-detail';
import ConfigurationSurveyQuestions from '../pages/configuration-survey-questions';
import ConfigurationBaseRoles from '../pages/configuration-base-roles';
import ConfigurationMenuPermissions from '../pages/configuration-menu-permissions';
import ConfigurationSurveyQuestionsDetail from '../pages/configuration-survey-questions-detail';
import ConfigurationBaseRolesDetail from '../pages/configuration-base-roles-detail';

export default [
  {
    path: '/login',
    component: LoginLayout,
    children: [
      { path: '', component: Login },
      { path: '*', component: () => import('pages/404') },
    ],
  },
  {
    path: '/login-system',
    component: LoginLayout,
    children: [
      { path: '', component: Login },
      { path: '*', component: () => import('pages/404') },
    ],
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', component: Index },
      {
        path: '/contracts',
        component: () => import('../pages/contracts'),
        meta: {
          title: 'default.contracts',
          getBreadcrumbs: () => [{ name: 'Contratti', path: 'contracts' }],
        },
      },
      {
        path: '/proposals',
        component: () => import('../pages/proposals'),
        meta: {
          title: 'default.proposals',
          getBreadcrumbs: () => [{ name: 'Proposte', path: 'proposals' }],
        },
      },
      {
        path: '/proposal-package',
        component: () => import('../pages/proposal-package'),
        meta: {
          title: 'default.proposalPackage',
          getBreadcrumbs: () => [{ name: 'Pacchetto Proposta', path: 'proposal-package' }],
        },
      },
      {
        path: '/overdue',
        component: () => import('../pages/overdue'),
        meta: {
          title: 'default.overdue',
          getBreadcrumbs: () => [{ name: 'Arretrati', path: 'overdue' }],
        },
      },
      {
        path: '/production',
        component: () => import('../pages/production'),
        meta: {
          title: 'default.production',
          getBreadcrumbs: () => [{ name: 'Produzione', path: 'production' }],
        },
      },
      {
        path: '/negative-production',
        component: () => import('../pages/negative-production'),
        meta: {
          title: 'default.negativeProduction',
          getBreadcrumbs: () => [{ name: 'Produzione Negativa', path: 'negative-production' }],
        },
      },
      {
        path: '/log-events',
        component: LogEventList,
        meta: {
          title: 'default.logEvents',
          getBreadcrumbs: () => [{ name: 'Log Events', path: 'log-events' }],
        },
      },
      {
        path: '/sync',
        component: SyncPractice,
        meta: {
          title: 'default.sync',
          getBreadcrumbs: () => [{ name: 'Sync Pratiche', path: 'sync' }],
        },
      },
      {
        path: '/installments',
        component: () => import('../pages/installments'),
        meta: {
          title: 'default.installments',
          getBreadcrumbs: () => [{ name: 'Rate', path: 'installments' }],
        },
      },
      {
        path: '/inquiry-surveys',
        component: () => import('../pages/global-inquiry-survey-list'),
        meta: {
          title: 'Lista Analisi dei Bisogni',
          getBreadcrumbs: () => [{ name: 'Analisi dei Bisogni', path: 'inquiry-surveys' }],
        },
      },
      {
        path: '/precontractuals',
        component: () => import('../pages/global-precontractual-list'),
        meta: {
          title: 'Lista Mandato & Privacy',
          getBreadcrumbs: () => [{ name: 'Lista Mandato & Privacy', path: 'precontractuals' }],
        },
      },
      {
        path: '/consulting',
        component: () => import('../pages/global-consulting-list'),
        meta: {
          title: 'Lista Consulenze',
          getBreadcrumbs: () => [{ name: 'Consulenze', path: 'consulting' }],
        },
      },
      {
        path: '/commissioning',
        component: Commissioning,
        meta: {
          title: 'default.commissioning',
          getBreadcrumbs: () => [{ name: 'Commissioning', path: 'commissioning' }],
        },
        children: [
          {
            path: '',
            name: 'commissionings',
            component: CommissioningList,
            meta: {
              title: 'default.commissioningList',
              getBreadcrumbs: () => [{ name: 'Commissioning', path: 'commissioning' }],
            },
          },
          {
            path: ':id',
            name: 'commissioning',
            component: CommissioningDetail,
            meta: {
              title: 'default.commissioningDetail',
              getBreadcrumbs: (params) => [
                { name: 'Commissioning', path: 'commissioning' },
                {
                  name: Vue.prototype.$utils.getFullMonthAndYearFromDateStr(params.id),
                  path: params.id,
                },
              ],
            },
          },
        ],
      },
      {
        path: '/invoicing',
        component: Invoicing,
        meta: {
          title: 'default.invoicing',
          getBreadcrumbs: () => [{ name: 'Fatturazione', path: 'invoicing' }],
        },
        children: [
          {
            path: '',
            name: 'invoicings',
            component: () => import('../pages/invoicing-list'),
            meta: {
              title: 'default.invoicingList',
              getBreadcrumbs: () => [{ name: 'Fatturazione', path: 'invoicing' }],
            },
          },
          {
            path: ':id',
            name: 'invoicing',
            component: () => import('../pages/invoicing-detail'),
            meta: {
              title: 'default.invoicingDetail',
              getBreadcrumbs: (params) => [
                { name: 'Fatturazione', path: 'invoicing' },
                {
                  name: Vue.prototype.$utils.getFullMonthAndYearFromDateStr(params.id),
                  path: params.id,
                },
              ],
            },
          },
        ],
      },
      {
        path: '/configuration/surveys',
        component: ConfigurationSurvey,
        meta: {
          title: 'default.configurationSurveys',
          getBreadcrumbs: () => [
            { name: 'Configurazione Questionari', path: 'configuration/surveys' },
          ],
        },
      },
      {
        path: '/configuration/surveys/:id',
        component: ConfigurationSurveyDetail,
        props: true,
        meta: {
          title: 'default.configurationSurveys',
          getBreadcrumbs: (params, store) => [
            { name: 'Configurazione Questionario', path: 'configuration/surveys' },
            {
              name: Vue.prototype.$utils.getSurveyName(params.id, store),
              path: params.id,
            },
          ],
        },
      },
      {
        path: '/configuration/questions',
        component: ConfigurationSurveyQuestions,
        meta: {
          title: 'default.configurationQuestions',
          getBreadcrumbs: () => [
            { name: 'Configurazione Domande', path: 'configuration/questions' },
          ],
        },
      },
      {
        path: '/configuration/roles',
        component: ConfigurationBaseRoles,
        meta: {
          title: 'default.configurationRuoli',
          getBreadcrumbs: () => [{ name: 'Configurazione Ruoli', path: 'configuration/roles' }],
        },
      },
      {
        path: '/configuration/questions/:id',
        component: ConfigurationSurveyQuestionsDetail,
        props: true,
        meta: {
          title: 'Configurazione domanda',
          getBreadcrumbs: (params) => [
            { name: 'Configurazione Domande', path: 'configuration/questions' },
            {
              name: params.id,
              path: params.id,
            },
          ],
        },
      },
      {
        path: '/configuration/roles/:id',
        component: ConfigurationBaseRolesDetail,
        props: true,
        meta: {
          title: 'Configurazione Ruoli',
          getBreadcrumbs: (params) => [
            { name: 'Configurazione Ruoli', path: 'configuration/roles' },
            {
              name: params.id === 'new-role' ? 'Nuovo Ruolo' : params.id,
              path: params.id,
            },
          ],
        },
      },
      {
        path: '/configuration/menu-permissions',
        component: ConfigurationMenuPermissions,
        meta: {
          title: 'default.configurationMenuPermissions',
          getBreadcrumbs: () => [
            { name: 'Configurazione Permessi del Menu', path: 'configuration/menu-permissions' },
          ],
        },
      },
      {
        path: '/configuration/products',
        component: () => import('../pages/configuration-products'),
        meta: {
          title: 'default.configurationProducts',
          getBreadcrumbs: () => [
            { name: 'Configurazione Prodotti', path: 'configuration/products' },
          ],
        },
      },
      {
        path: '/configuration/products/:id',
        component: () => import('../pages/configuration-products-detail'),
        props: true,
        meta: {
          title: 'Configurazione prodotto',
          getBreadcrumbs: (params, store) => [
            { name: 'Configurazione Prodotti', path: 'configuration/products' },
            {
              name: Vue.prototype.$utils.getProductName(params.id, store),
              path: params.id,
            },
          ],
        },
      },
      {
        path: '/configuration/signaler-products',
        component: ConfigurationSignalerProducts,
        meta: {
          title: 'default.configurationSignalerProducts',
          getBreadcrumbs: () => [
            {
              name: 'Configurazione Prodotti Segnalatori',
              path: 'configuration/signaler-products',
            },
          ],
        },
      },
      {
        path: '/configuration/signaler-products/:id',
        component: ConfigurationSignalerProductsDetail,
        props: true,
        meta: {
          title: 'Configurazione prodotto segnalatori',
          getBreadcrumbs: (params, store) => [
            {
              name: 'Configurazione Prodotti Segnalatori',
              path: 'configuration/signaler-products',
            },
            {
              name: Vue.prototype.$utils.getProductSignalerName(params.id, store),
              path: params.id,
            },
          ],
        },
      },
      {
        path: '/configuration/products-survey',
        component: () => import('../pages/configuration-products-survey'),
        meta: {
          title: 'default.configurationProductsSurvey',
          getBreadcrumbs: () => [
            {
              name: 'Configurazione Prodotti (Analisi dei Bisogni)',
              path: 'configuration/products-survey',
            },
          ],
        },
      },
      {
        path: '/configuration/products-numbers',
        component: () => import('../pages/configuration-products-numbers'),
        meta: {
          title: 'default.configurationProductsNumbers',
          getBreadcrumbs: () => [
            {
              name: 'Configurazione Numeriche',
              path: 'configuration/products-numbers',
            },
          ],
        },
      },
      {
        path: '/configuration/sepa-numbers',
        component: () => import('../pages/configuration-sepa-numbers'),
        meta: {
          title: 'default.configurationSepaNumbers',
          getBreadcrumbs: () => [
            {
              name: 'Configurazione Numeriche SEPA',
              path: 'configuration/sepa-numbers',
            },
          ],
        },
      },
      {
        path: '/configuration/dossier-insurer',
        component: ConfigurationDossierInsurer,
        meta: {
          title: 'default.configurationSignalerProducts',
          getBreadcrumbs: () => [
            {
              name: 'Configurazione Pratica Consulente',
              path: 'configuration/dossier-insurer',
            },
          ],
        },
      },
      {
        path: '/configuration/customer-insurer',
        component: ConfigurationCustomerInsurer,
        meta: {
          title: 'default.configurationSignalerProducts',
          getBreadcrumbs: () => [
            {
              name: 'Configurazione Cliente Consulente',
              path: 'configuration/customer-insurer',
            },
          ],
        },
      },
      {
        path: '/configuration/jobs',
        component: ConfigurationJobs,
        meta: {
          title: 'default.configurationJobs',
          getBreadcrumbs: () => [{ name: 'Configurazione Ruoli', path: 'configuration/jobs' }],
        },
      },
      {
        path: '/configuration/jobs/:id',
        component: ConfigurationJobsDetail,
        props: true,
        meta: {
          title: 'Configurazione ruoli',
          getBreadcrumbs: (params, store) => [
            { name: 'Configurazione Ruoli', path: 'configuration/jobs' },
            {
              name: Vue.prototype.$utils.getPromoterDisplayNameJob(params.id, store),
              path: params.id,
            },
          ],
        },
      },
      {
        path: '/configuration/management-fee',
        component: ConfigurationManagementFee,
        meta: {
          title: 'default.configurationManagementFee',
          getBreadcrumbs: () => [
            { name: 'Configurazione Management Fee', path: 'configuration/management-fee' },
          ],
        },
      },
      {
        path: '/configuration/management-fee/:id',
        component: ConfigurationManagementFeeDetail,
        props: true,
        meta: {
          title: 'Configurazione Management Fee',
          getBreadcrumbs: (params) => [
            { name: 'Configurazione Management Fee', path: 'configuration/management-fee' },
            {
              name: params.id,
              path: params.id,
            },
          ],
        },
      },
      {
        path: '/configuration/sheltia-commissioning',
        component: ConfigurationSheltiaCommissioning,
        meta: {
          title: 'default.configurationCommissioning',
          getBreadcrumbs: () => [
            { name: 'Configurazione Commissioning', path: 'configuration/sheltia-commissioning' },
          ],
        },
      },
      {
        path: '/configuration/sheltia-commissioning/:id',
        component: ConfigurationSheltiaCommissioningDetail,
        props: true,
        meta: {
          title: 'Configurazione Commissioning',
          getBreadcrumbs: (params) => [
            { name: 'Configurazione Commissioning', path: 'configuration/sheltia-commissioning' },
            {
              name: params.id,
              path: params.id,
            },
          ],
        },
      },
      {
        path: '/configuration/tcw-commissioning',
        component: ConfigurationTcwCommissioning,
        meta: {
          title: 'default.configurationCommissioning',
          getBreadcrumbs: () => [
            { name: 'Configurazione Commissioning', path: 'configuration/tcw-commissioning' },
          ],
        },
      },
      {
        path: '/configuration/tcw-commissioning/:id',
        component: ConfigurationTcwCommissioningDetail,
        props: true,
        meta: {
          title: 'Configurazione Commissioning',
          getBreadcrumbs: (params) => [
            { name: 'Configurazione Commissioning', path: 'configuration/tcw-commissioning' },
            {
              name: params.id,
              path: params.id,
            },
          ],
        },
      },
      {
        path: '/configuration/tcw-commissioning-dynamic',
        component: ConfigurationTcwCommissioningDynamic,
        meta: {
          title: 'default.configurationCommissioningDynamic',
          getBreadcrumbs: () => [
            {
              name: 'Configurazione Commissioning Dynamic',
              path: 'configuration/tcw-commissioning-dynamic',
            },
          ],
        },
      },
      {
        path: '/configuration/tcw-commissioning-dynamic/:id',
        component: ConfigurationTcwCommissioningDynamicDetail,
        props: true,
        meta: {
          title: 'Configurazione Commissioning Dynamic',
          getBreadcrumbs: (params) => [
            {
              name: 'Configurazione Commissioning Dynamic',
              path: 'configuration/tcw-commissioning-dynamic',
            },
            {
              name: params.id,
              path: params.id,
            },
          ],
        },
      },
      {
        path: '/configuration/adjusted-premium',
        component: () => import('../pages/configuration-adjusted-premium'),
        meta: {
          title: 'Configurazione Adjusted Premium',
          getBreadcrumbs: () => [
            { name: 'Configurazione Adjusted Premium', path: 'configuration/adjusted-premium' },
          ],
        },
      },
      {
        path: '/configuration/adjusted-premium/:id',
        component: () => import('../pages/configuration-adjusted-premium-detail'),
        props: true,
        meta: {
          title: 'Configurazione Adjusted Premium',
          getBreadcrumbs: (params) => [
            { name: 'Configurazione Adjusted Premium', path: 'configuration/adjusted-premium' },
            {
              name: params.id,
              path: params.id,
            },
          ],
        },
      },
      {
        path: '/accounting',
        component: () => import('../pages/accounting'),
        meta: {
          title: 'default.accounting',
          getBreadcrumbs: () => [{ name: 'Contabilità', path: 'accounting' }],
        },
      },
      {
        path: '/accounting/forecast',
        component: () => import('../pages/accounting-forecast'),
        meta: {
          title: 'default.accountingForecastTitle',
          getBreadcrumbs: () => [
            { name: 'Contabilità', path: 'accounting' },
            { name: 'Previsionale', path: 'forecast' },
          ],
        },
      },
      {
        path: '/pay-in',
        component: PayIn,
        meta: {
          title: 'default.payIn',
          getBreadcrumbs: () => [{ name: 'Quietanze', path: 'pay-in' }],
        },
        children: [
          {
            path: '',
            name: 'payins',
            component: PayInList,
            meta: {
              title: 'default.payInList',
              getBreadcrumbs: () => [{ name: 'Quietanze', path: 'pay-in' }],
            },
          },
          {
            path: ':id',
            name: 'payin',
            component: PayInDetail,
            meta: {
              title: 'default.payInDetail',
              getBreadcrumbs: (params, store) => [
                { name: 'Quietanze', path: 'pay-in' },
                {
                  name: Vue.prototype.$utils.getAcquittanceId(params.id, store),
                  path: params.id,
                },
              ],
            },
          },
        ],
      },
      {
        path: '/letters',
        component: Letters,
        meta: {
          title: 'default.letters',
          getBreadcrumbs: () => [{ name: 'Lettere', path: 'letters' }],
        },
        children: [
          {
            path: '',
            name: 'letters-all',
            component: PromotersDetailLetters,
            meta: {
              title: 'default.letters',
              getBreadcrumbs: () => [{ name: 'Lettere', path: 'letters' }],
            },
          },
        ],
      },
      {
        path: '/promoters',
        component: () => import('../pages/promoters'),
        meta: {
          title: 'default.promotersTitle',
          getBreadcrumbs: () => [{ name: 'Consulenti', path: 'promoters' }],
        },
      },
      {
        path: '/persons',
        component: () => import('../pages/persons'),
        meta: {
          title: 'default.personsTitle',
          getBreadcrumbs: () => [{ name: 'Anagrafica', path: 'persons' }],
        },
      },
      {
        path: '/persons/:id',
        redirect: (to) => `${to.path}/dashboard`,
        component: () => import('../pages/persons-detail'),
        meta: {
          title: 'default.personsDetail',
          getBreadcrumbs: (params, store) => [
            { name: 'Anagrafica', path: 'persons' },
            {
              name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
              path: params.id,
            },
          ],
        },
        children: [
          {
            path: 'dashboard',
            name: 'dashboard',
            component: () => import('../pages/persons-detail-dashboard'),
            meta: {
              title: 'default.personsDetailDashboard',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Dashboard', path: '' },
              ],
            },
          },
          {
            path: 'detail',
            name: 'detail',
            component: () => import('../pages/persons-detail-detail'),
            meta: {
              title: 'default.personsDetailDetail',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Dettaglio', path: '' },
              ],
            },
          },
          {
            path: 'history',
            name: 'history',
            component: () => import('../pages/persons-detail-history'),
            meta: {
              title: 'default.personsDetailHistory',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Storico Rete', path: '' },
              ],
            },
          },
          {
            path: 'identity',
            name: 'identity',
            component: () => import('../pages/persons-detail-identity'),
            meta: {
              title: 'default.personsDetailIdentity',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Documenti di identità', path: '' },
              ],
            },
          },
          {
            path: 'persons',
            name: 'persons',
            component: () => import('../pages/persons-detail-persons'),
            meta: {
              title: 'default.personsDetailPersons',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Persone Collegate', path: '' },
              ],
            },
          },
          {
            path: 'companies',
            name: 'companies',
            component: () => import('../pages/persons-detail-companies'),
            meta: {
              title: 'default.personsDetailCompanies',
              // eslint-disable-next-line sonarjs/no-identical-functions
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Aziende Collegate', path: '' },
              ],
            },
          },
          {
            path: 'dossiers',
            name: 'dossiers',
            component: () => import('../pages/persons-detail-dossiers'),
            meta: {
              title: 'default.personsDetailDossiers',
              // eslint-disable-next-line sonarjs/no-identical-functions
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Pratiche Collegate', path: '' },
              ],
            },
          },
          {
            path: 'relations',
            name: 'relations',
            component: () => import('../pages/persons-detail-relations'),
            meta: {
              title: 'default.personsDetailRelations',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Relazioni', path: '' },
              ],
            },
          },
          {
            path: 'duplicates',
            name: 'duplicates',
            component: () => import('../pages/persons-detail-duplicated'),
            meta: {
              title: 'default.personsDetailDuplicates',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Duplicati', path: '' },
              ],
            },
          },
          {
            path: 'surveys/:surveyId',
            name: 'surveys',
            component: () => import('../pages/persons-detail-surveys'),
            meta: {
              title: 'default.personsDetailSurveys',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Nuovo Questionario', path: 'survey-results' },
                {
                  name: Vue.prototype.$utils.getSurveyDisplayName(store),
                  path: '',
                },
              ],
            },
          },
          {
            path: 'survey-results',
            name: 'survey-results',
            component: () => import('../pages/persons-detail-survey-results'),
            meta: {
              title: 'default.personsDetailSurveyResults',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Questionari Compilati', path: '' },
              ],
            },
          },
          {
            path: 'survey-results/:resultId',
            name: 'survey-result-show',
            component: () => import('../pages/persons-detail-survey-result-show'),
            meta: {
              title: 'default.personsDetailSurveyResultShow',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Questionari Compilati', path: 'survey-results' },
                {
                  name: Vue.prototype.$utils.getSurveyDisplayName(store),
                  path: '',
                },
              ],
            },
          },
          {
            path: 'precontractual/:precontractualId',
            name: 'precontractual ',
            component: () => import('../pages/persons-detail-precontractual'),
            meta: {
              title: 'default.personsDetailPrecontractual',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Mandato & Privacy', path: '' },
              ],
            },
          },
          {
            path: 'consulting',
            name: 'consulting-list',
            component: () => import('../pages/persons-consulting-list'),
            meta: {
              title: 'default.personsConsultingList',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Lista Consulenze', path: '' },
              ],
            },
          },
          {
            path: 'inquiry-survey',
            name: 'inquiry-survey-list',
            component: () => import('../pages/persons-inquiry-survey-list'),
            meta: {
              title: 'default.personsInquirySurveyList',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Lista Analisi dei Bisogni', path: '' },
              ],
            },
          },
          {
            path: 'precontractual-list',
            name: 'precontractual-list',
            component: () => import('../pages/persons-precontractual-list'),
            meta: {
              title: 'default.personsInquirySurveyList',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Lista Mandati & Privacy', path: '' },
              ],
            },
          },
          {
            path: 'consulting/:resultId',
            name: 'consulting',
            component: () => import('../pages/persons-detail-consulting'),
            meta: {
              title: 'default.personsDetailConsulting',
              getBreadcrumbs: (params, store) => [
                { name: 'Anagrafica', path: 'persons' },
                {
                  name: Vue.prototype.$utils.getPersonDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Consulenza', path: '' },
              ],
            },
          },
        ],
      },
      {
        path: '/customers',
        component: Customers,
        meta: {
          title: 'default.customersTitle',
          getBreadcrumbs: () => [{ name: 'Clienti', path: 'customers' }],
        },
      },
      {
        path: '/customers-identity-cards',
        component: CustomersIdentityCards,
        meta: {
          title: 'default.identityCards',
          getBreadcrumbs: () => [{ name: "Documenti d'identità", path: 'customers' }],
        },
      },
      {
        path: '/customers/:id',
        redirect: (to) => `${to.path}/history`,
        component: CustomersDetail,
        meta: {
          title: 'default.customersDetail',
          getBreadcrumbs: (params, store) => [
            { name: 'Clienti', path: 'customers' },
            {
              name: Vue.prototype.$utils.getCustomerDisplayName(params.id, store),
              path: params.id,
            },
          ],
        },
        children: [
          {
            path: 'history',
            name: 'history',
            component: CustomersDetailHistory,
            meta: {
              title: 'default.customersDetailHistory',
              getBreadcrumbs: (params, store) => [
                { name: 'Clienti', path: 'customers' },
                {
                  name: Vue.prototype.$utils.getCustomerDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Storico Rete', path: '' },
              ],
            },
          },
        ],
      },
      {
        path: '/tree',
        component: Tree,
        meta: {
          title: 'default.tree',
          getBreadcrumbs: () => [{ name: 'Rete', path: 'tree' }],
        },
      },
      {
        path: '/promoters/:id',
        redirect: (to) => `${to.path}/company`,
        component: () => import('../pages/promoters-detail'),
        meta: {
          title: 'default.promotersDetail',
          getBreadcrumbs: (params, store) => [
            { name: 'Consulenti', path: 'promoters' },
            {
              name: Vue.prototype.$utils.getPromoterDisplayName(params.id, store),
              path: params.id,
            },
          ],
        },
        children: [
          {
            path: 'company',
            name: 'company',
            component: PromotersDetailCompany,
            meta: {
              title: 'default.promotersDetailCompany',
              getBreadcrumbs: (params, store) => [
                { name: 'Consulenti', path: 'promoters' },
                {
                  name: Vue.prototype.$utils.getPromoterDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Aziendale', path: '' },
              ],
            },
          },
          {
            path: 'letters',
            name: 'letters',
            component: PromotersDetailLetters,
            meta: {
              title: 'default.promotersDetailLetters',
              // eslint-disable-next-line sonarjs/no-identical-functions
              getBreadcrumbs: (params, store) => [
                { name: 'Consulenti', path: 'promoters' },
                {
                  name: Vue.prototype.$utils.getPromoterDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Lettere', path: 'letters' },
              ],
            },
          },
          {
            path: 'letters/:letter',
            name: 'letter',
            component: PromotersDetailLetter,
            meta: {
              title: 'default.promotersDetailLetters',
              // eslint-disable-next-line sonarjs/no-identical-functions
              getBreadcrumbs: (params, store) => [
                { name: 'Consulenti', path: 'promoters' },
                {
                  name: Vue.prototype.$utils.getPromoterDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Lettere', path: 'letters' },
                {
                  name: params.letter,
                  path: params.letter,
                },
              ],
            },
          },
          {
            path: 'invoices',
            name: 'invoices',
            component: () => import('../pages/promoters-detail-invoices'),
            meta: {
              title: 'default.promotersDetailInvoices',
              // eslint-disable-next-line sonarjs/no-identical-functions
              getBreadcrumbs: (params, store) => [
                { name: 'Consulenti', path: 'promoters' },
                {
                  name: Vue.prototype.$utils.getPromoterDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Fatture', path: 'invoices' },
              ],
            },
          },
          {
            path: 'accounting-notes',
            name: 'accounting-notes',
            component: () => import('../pages/promoters-detail-accounting-notes'),
            meta: {
              title: 'default.promotersDetailAccountingNotes',
              // eslint-disable-next-line sonarjs/no-identical-functions
              getBreadcrumbs: (params, store) => [
                { name: 'Consulenti', path: 'promoters' },
                {
                  name: Vue.prototype.$utils.getPromoterDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Recuperi', path: 'accounting-notes' },
              ],
            },
          },
          {
            path: 'invoices/:invoice',
            name: 'invoice',
            component: () => import('../pages/promoters-detail-invoice'),
            meta: {
              title: 'default.promotersDetailInvoices',
              // eslint-disable-next-line sonarjs/no-identical-functions
              getBreadcrumbs: (params, store) => [
                { name: 'Consulenti', path: 'promoters' },
                {
                  name: Vue.prototype.$utils.getPromoterDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Fatture', path: 'invoices' },
                {
                  name: Vue.prototype.$utils.getInvoiceNumber(params.invoice, store),
                  path: params.invoice,
                },
              ],
            },
          },
          {
            path: 'documents',
            name: 'documents',
            component: PromotersDetailDocuments,
            meta: {
              title: 'default.promotersDetailDocuments',
              // eslint-disable-next-line sonarjs/no-identical-functions
              getBreadcrumbs: (params, store) => [
                { name: 'Consulenti', path: 'promoters' },
                {
                  name: Vue.prototype.$utils.getPromoterDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Documenti', path: 'documents' },
              ],
            },
          },
          {
            path: 'downloads',
            name: 'downloads',
            component: PromotersDetailDownloads,
            meta: {
              title: 'default.promotersDetailDownloads',
              // eslint-disable-next-line sonarjs/no-identical-functions
              getBreadcrumbs: (params, store) => [
                { name: 'Consulenti', path: 'promoters' },
                {
                  name: Vue.prototype.$utils.getPromoterDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Downloads', path: 'downloads' },
              ],
            },
          },
          {
            path: 'target',
            name: 'target',
            component: PromotersDetailTarget,
            meta: {
              title: 'default.promotersDetailTarget',
              // eslint-disable-next-line sonarjs/no-identical-functions
              getBreadcrumbs: (params, store) => [
                { name: 'Consulenti', path: 'promoters' },
                {
                  name: Vue.prototype.$utils.getPromoterDisplayName(params.id, store),
                  path: params.id,
                },
                { name: 'Target', path: 'target' },
              ],
            },
          },
        ],
      },
      { path: '*', component: () => import('pages/404') },
    ],
  },
  {
    // Always leave this as last one
    path: '*',
    component: () => import('pages/404'),
  },
];
