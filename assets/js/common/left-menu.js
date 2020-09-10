import axios from '../../../service/http';
import { option } from '../../../static/config';
//声明引用axios组件（类似ajax）
export default {
  data() {
    return {
      //左菜单数组
      vData: [],
      //左菜单高度方法值
      conheight: {
        height: ''
      },
      activeRouter: '',
      defaultOpeneds: []
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
      axios.get(option.menu_path).then(function (data) {
          //赋值全局变量数据
          me.vData =  data.data.data.children;
          console.log(data)
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
      this.$router.replace({
        path: path
      })
    },
    routerSelect (path, index) {
      this.activeRouter = path
      if (index.parentId) {
        this.defaultOpeneds = [index.parentId]
      }
    }
  },
  watch:  {
    $route: {
      handler (index, old) {
        this.routerSelect(index.path, index)
      },
      deep:true
    }
  }
}
