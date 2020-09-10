import {
	serveApi
  } from '../../static/paths.js';
  //声明引用axios组件（类似ajax）
  export default {
	data() {
	  return {
		//左菜单数组
		vData: [],
		//左菜单高度方法值
		conheight: {
		  height: ''
		}
	  }
	},
	//挂载路由实例对象 因为名字一样可以简写（暂时废弃）
	//调用层
	mounted() {
	  this.JsonAjax();
	  this.getHeight();
  
	},
	//实现层
	methods: {
	  //获取左菜单数据
	  JsonAjax: function () {
		var me = this;
		//调用axios.get方法
		//"CASPARAMS":"OFF_INDEX"
		serveApi.menuData()
		  .then(function (data) {
			//赋值全局变量数据
			me.vData = data.data.data.children;
		  })
		  .catch(function (error) {
			console.log(error);
		  });
	  },
	  //获取设置浏览器高度-80后设置给height变量
	  getHeight() {
		this.conheight.height = window.innerHeight - 80 + 'px';
	  },
	  toPage(path) {
		this.$router.push({
		  path: path
		})
	  }
	}
  }
  