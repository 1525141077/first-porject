import axios from 'axios'
import {
  option
} from '../static/config'

export class userInfo {
  static saveLoginResult (obj) {
    if (!obj) {
      return
    }
    let now = new Date()
    // Manager.setAccessToken(Manager.buildNewToken(obj.access.token, now))
    // Manager.setRefreshToken(Manager.buildNewToken(obj.refresh.token, now))
    // Manager.setAvatar(obj.avatar)
    // Manager.setContext(obj.subject)
  }
  static setRefreshToken (token) {
    if (token) {
      _refresh = token
      SessionHelper._save('user.refresh', token)
    }
  }
  static getRefreshToken () {
    if (!_refresh) {
      _refresh = SessionHelper._load('user.refresh')
    }
    return _refresh
  }
  static setAccessToken (token) {
    if (token) {
      _access = token
      SessionHelper._save('user.access', token)
    }
  }
  static getAccessToken () {
    if (!_access) {
      _access = SessionHelper._load('user.access')
    }
    return _access
  }
  getToken() {
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
  getUserInfo () {
    axios.post(option.base_path + 'index/getCurrentUserInfo').then(res => {
      debugger
      userInfo.user_info = data.data;
    })
	}
}
