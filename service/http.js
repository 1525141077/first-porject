import axios from 'axios'
import qs from 'qs'
import {
  Message
} from 'element-ui'
import {
  option
} from '../static/config'


// axios 配置
axios.defaults.timeout = 30000; // 接口请求超时时间
axios.defaults.withCredentials = true; // 让ajax携带cookie
// axios.defaults.baseURL = option.base_path // 后台地址配置
// 增加请求头写法
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
// axios.defaults.headers['Access-Control-Allow-Credentials'] = 'true'
// axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
// axios.defaults.headers['Cookie'] = 'JSESSIONID=D13DCF9178ADB180E5B67937B9B92A9E; THEMEURL='

function getToken() {
  var cookies = document.cookie.split(";");
  var dynamicKey = "";
  if (cookies.length > 0) {
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].split("=");
      if (cookie[0].toString().trim() == option.ytAclCookieKey)
        dynamicKey = unescape(cookie[1]);
    }
  }
  return dynamicKey;
}

// http request 拦截器
axios.interceptors.request.use(
  config => {

    config.data = config.data || {}
    //配置url
		if(config.url.indexOf("http://") != 0) {
			config.url = option.base_path + config.url;
		}
    //请求头内容
		var contentType = "application/x-www-form-urlencoded; charset=utf-8";
    //统一参数配置
    var dynamicKey = getToken();
    var cookieKey = option.ytAclCookieKey;
    //var currentUserInfo = $yt_common.user_info;
    var ytParams = {
      ajax: 1,
      dynamicKey: dynamicKey,
      systemCode: option.systemCode
    }
    ytParams[cookieKey] = dynamicKey;
    //config.contentType = contentType;
    if (option.is_origin) {
      /*配置跨域请求开始*/
      config.beforeSend = function (xhr) {
        xhr.withCredentials = true;
      }
      config.xhrFields = {
        withCredentials: true
      }
      config.crossDomain = true;
      /*配置跨域请求结束*/
    }

    if (Object.prototype.toString.call(config.data) == '[object FormData]') {
        // 请求拦截器处理
        for (let key in ytParams) {
          config.data.append(key, ytParams[key])
        }
    } else if (config.method  === 'post') {
      config.data[cookieKey] = ytParams[cookieKey];
      config.data.ajax = ytParams.ajax;
      config.data.systemCode = ytParams.systemCode;
      config.data.userItCode = ytParams.userItCode;
      config.data.dynamicKey = ytParams.dynamicKey;
      config.data = qs.stringify(config.data);
    }
    if (config.method  === 'get') {
      let paramsStr = ''
      // for (params in ytParams) {
      //   paramsStr += '&' + params + '=' + ytParams[params]
      // }
      config.url += paramsStr
    }
    console.log(config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)


// http response 拦截器
axios.interceptors.response.use(
  response => {
    // token 已过期，重定向到登录页面
    try {
      if ((response.data.flag == undefined ? "" : response.data.flag.toString()) == "1") {
        //$yt_common.login_state = false;
        var loginUrl = response.data.data.ssoVerifyAddress;
        location.href = loginUrl;
      }
    } catch (e) {}
    return response
  },
  err => {
    // if (err.config.disabled) {
    //   return Promise.reject(err)
    // }
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误,服务器不理解请求的语法(400)'
          if (err.response.data) {
            err.message = err.response.data.reason
          }
          break
          // 返回 401 清除token信息并跳转到登录页面
        case 401:
          // Manager.logOut()
          err.message = '未授权，请重新登录(401)'
          break
        case 403:
          err.message = '服务器拒绝访问(403)';
          break
        case 404:
          err.message = '服务器找不到请求的网页(404)';
          break
        case 405:
          err.message = '禁用请求中所指定的方法(405)';
          break
        case 406:
          err.message = '无法使用请求的内容特性来响应请求的网页(406)';
          break
        case 408:
          err.message = '服务器等候请求超时(408)';
          break
        case 409:
          err.message = '服务器在完成请求时发生冲突(409)';
          break
        case 410:
          err.message = '请求的资源已被删除(410)';
          break
        case 413:
          err.message = '请求实体过大,服务器无法处理请求(413)';
          break
        case 414:
          err.message = '请求的URI过长(414)';
          break
        case 500:
          err.message = '服务器内部错误,无法完成请求(500)';
          break
        case 501:
          err.message = '服务未实现(501)';
          break
        case 502:
          err.message = '网络错误(502)';
          break
        case 503:
          err.message = '服务不可用(503)';
          break
        case 504:
          err.message = '网络超时(504)';
          break
        case 505:
          err.message = 'HTTP版本不受支持(505)';
          break
        default:
          err.message = `连接出错(${err.response.status})!`
      }
      Message.warning({
        message: err.message
      })
    } else {
      Message.warning({
        message: err.message
      })
    }
    return Promise.reject(err)
  })


export default axios
