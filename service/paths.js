import axios from './http';

//coso地址变量
let url = 'http://localhost:8888/coso/';
//官网测试地址变量
let url2 = 'http://localhost:8888/sasac-train/';

//国资委测试地址变量
let url3 = 'http://localhost:8888/sasac-business/';

let getToken = function () {
    var cookies = document.cookie.split(";");
    var dynamicKey = "";
    if (cookies.length > 0) {
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split("=");
  
        //if($.trim(cookie[0]) == $yt_baseElement.ytAclCookieKey)
        dynamicKey = unescape(cookie[1]);
      }
    }
    return dynamicKey;
  }
export class serveApi {

  //我的申请列表地址
  static myApplicationAppInfo(data) {
    let urls = url + 'sz/applyApp/myApplicationAppInfo';
    //urls = urls + '?CASPARAMS=OFF_INDEX'//getToken()
    // urls = urls + '&startDate='//getToken()
    // urls = urls + '&endDate='//getToken()
    // urls = urls + '&queryParams='//getToken()
    // urls = urls + '&formType='//getToken()
    // urls = urls + '&startAmount='//getToken()
    // urls = urls + '&endAmount='//getToken()
    // urls = urls + '&pageIndex=1'//getToken()
    // urls = urls + '&pageNum=15'//getToken()
    // urls = urls + '&yitianSSODynamicKey=064C7A1E8F532D08D79CD69C63674954469610D424F7E508BEE422292CA6899D'
    return axios.post(urls, data).then(res => res);
  }
  //官网首页培训列表地址
  static getNewsLunBoInfo(data) {
    let urls = url2 + 'cmsNewsLunBo/getNewsLunBoInfo';
    data['dynamicKey'] = '064C7A1E8F532D08D79CD69C63674954469610D424F7E508BEE422292CA6899D'//getToken()
    data['yitianSSODynamicKey'] = '064C7A1E8F532D08D79CD69C63674954469610D424F7E508BEE422292CA6899D'
    return axios.post(urls, data).then(res => res);
  }
  //getNewsLunBoInfo: url2 + 'cmsNewsLunBo/getNewsLunBoInfo',
  //本地左菜单json
  //jsonPath: 'http://localhost:3000/json/data.json'
  //我的申请列表地址
  static menuData(data) {
    return axios.get('http://localhost:3000/json/menuData.json').then(res => res);
  }
}
