//const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
export default {
	mode: 'spa',
	/*
	 ** Headers of the page
	 */
	head: {
		title: '倚天机构数字化管理平台',//process.env.npm_package_name ||
		meta: [{
				charset: 'utf-8'
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: process.env.npm_package_description || ''
			},
			{ name: 'apple-mobile-web-app-capable', content: 'yes' }, // iOS浏览器禁止缩放
			{ name: 'renderer', content: 'webkit' }, // 强制让360浏览器使用Webkit内核
      { name: 'force-rendering', content: 'webkit' }, // 强制Chromium内核，作用于其他双核浏览器
			{ 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
		],
		link: [{
			rel: 'icon',
			type: 'image/x-icon',
			href: '/favicon.ico'
		}]
	},
	/*
	 ** Customize the progress-bar color
	 */
	loading: {
		color: '#fff'
	},
	/*
	 ** Global CSS
	 */
	css: [
		'element-ui/lib/theme-chalk/index.css',
		'~assets/css/common/main.css'
		//,'highlight.js/styles/github.css' // 代码高亮风格，选择更多风格需导入 node_modules/hightlight.js/styles/ 目录下其它css文件
	],
	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: [
		'@/plugins/element-ui'
		//,'@/plugins/highlight'
	],
	/*
	 ** Nuxt.js dev-modules
	 */
	buildModules: [],
	/*
	 ** Nuxt.js modules
	 */
	modules: [
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios',
		'@nuxtjs/pwa',
	],
	/*
	 ** Axios module configuration
	 ** See https://axios.nuxtjs.org/options
	 */
	axios: {},
	/*
	 ** Build configuration
	 */
	build: {
		// optimization: {
		// 	splitChunks:{
		// 		minSize:10000,
		// 		maxSize:250000
		// 	}
		// },
		transpile: [/^element-ui/],
		/*
		 ** You can extend webpack config here
		 */
		// extend(config, ctx) {
		// 	config.plugins.unshift(new LodashModuleReplacementPlugin)
		// 	config.module.rules[2].use[0].options.plugins = ['lodash']
		// },
		// // 开启打包分析
  //   analyze: true,
  //   assetFilter: function(assetFilename) {
  //       return assetFilename.endsWith('.js')
  //   }
	},
	server: {
    port: 3333, // default: 3000
    host: '0.0.0.0', // default: localhost,
  },
  render: {
		resourceHints: false
	}
}
