import Axios from 'axios'

Vue.prototype.$axios = Axios
Vue.prototype.HOST = "/douban_api"
export default {
	proxyTable: {
		'/douban_api': {
			target: 'http://api.douban.com', //目标接口域名
			pathRewrite: {
				'^/douban_api': '' //重写接口
			},
			changeOrigin: true, //是否跨域
		},

	},
}