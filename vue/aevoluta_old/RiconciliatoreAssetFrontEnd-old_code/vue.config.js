
module.exports = {
	// devServer: {
	// 	// proxy: 'https://localhost:8080'
	// 	// proxy: 'https://ricondev.aevoluta.eu:8080'
	// 	host: 'ricondev.aevoluta.eu',
    //     disableHostCheck: true,
    //     port: 8080,
    //     public: 'localhost:8080',
	// 	socketHost: "172.31.17.192:8080",
	// 	https: true
    // },
	devServer: {
		host: 'localhost',
		port: 8080,
		hotOnly: true,
		disableHostCheck: true,
		clientLogLevel: 'warning',
		inline: true,
		headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
		'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
		},
		proxy: {
			'/ws': {
			   target: 'ws://localhost:8080',
			   ws: true
			},
		  },
	},
    publicPath: "/",
	// pwa: {
	// 	name: 'test-app',
	// 	themeColor: '#4DBA87',
	// 	msTileColor: '#000000',
	// 	appleMobileWebAppCapable: 'yes',
	// 	appleMobileWebAppStatusBarStyle: 'black',
	// 	manifestOptions: {
	// 		icons: [
	// 			{
	// 				src: "img/icons/favicon.ico",
	// 				// sizes: "32x32",
	// 				type: "image/png",
	// 			},
	// 		]
	// 	},
	// 	iconPaths: {
	// 		// favicon32: 'img/icons/favicon-32x32.png',
	// 		// favicon16: 'img/icons/favicon-16x16.png',
	// 		// appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
	// 		// maskIcon: 'img/icons/safari-pinned-tab.svg',
	// 		// msTileImage: 'img/icons/msapplication-icon-144x144.png'
	// 		favicon32: 'img/icons/favicon.ico',
	// 		favicon16: 'img/icons/favicon.ico',
	// 		appleTouchIcon: 'img/icons/favicon.ico',
	// 		maskIcon: 'img/icons/favicon.ico',
	// 		msTileImage: 'img/icons/favicon.ico'
	// 	},

	// 	// configure the workbox plugin
	// 	workboxPluginMode: 'GenerateSW',
	// 	// workboxOptions: {
	// 	// 	// swSrc is required in InjectManifest mode.
	// 	// 	swSrc: 'dev/sw.js',
	// 	// 	// ...other Workbox options...
	// 	// }
	// },
}

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  configureWebpack: {
    devtool: 'source-map'
  },
  transpileDependencies: [
    'vuetify'
  ]
})

