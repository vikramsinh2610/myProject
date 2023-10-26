// Configuration for your app

module.exports = function (ctx) {
  return {
    // app boot (/src/boot)
    boot: ['env', 'i18n', 'vuelidate', 'axios', 'utils', 'composition-api'],
    css: ['app.styl'],
    extras: [
      'material-icons',
      'fontawesome-v5',
      'ionicons-v4',
      // 'mdi-v3',
    ],
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack(cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/,
        });
      },
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true, // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      lang: 'it',
      components: [
        'QLayout',
        'QHeader',
        'QFooter',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QSeparator',
        'QSpinner',
        'QInfiniteScroll',
        'QInnerLoading',
        'QSpinnerDots',
        'QSpinnerBall',
        'QSpinnerGears',
        'QSpinnerHourglass',
        'QSpinnerIos',
        'QExpansionItem',
        'QTabs',
        'QTab',
        'QInput',
        'QField',
        'QStepper',
        'QStep',
        'QStepperNavigation',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QChip',
        'QTree',
        'QSlideTransition',
        'QPageSticky',
        'QToggle',
        'QSelect',
        'QUploader',
        'QDialog',
        'QCheckbox',
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QPopupEdit',
        'QTooltip',
        'QAvatar',
        'QMenu',
        'QDate',
        'QPopupProxy',
        'QFab',
        'QFabAction',
        'QOptionGroup',
        'QRadio',
        'QBtnToggle',
      ],
      directives: ['Ripple', 'ClosePopup'],
      // Quasar plugins
      plugins: ['Screen', 'Notify', 'Loading', 'BottomSheet', 'Dialog'],
      config: {
        notify: { color: 'red' },
      },
    },
    // animations: 'all' --- includes all animations
    animations: 'all',
    pwa: {
      workboxOptions: { skipWaiting: true },
      manifest: {
        name: 'Prassi Commissioning',
        short_name: 'Prassi',
        description: 'Prassi Commissioning App',
        display: 'standalone',
        orientation: 'landscape',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack(cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Window only
        // win32metadata: { ... }
      },
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.3',
  };
};
