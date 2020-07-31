import axios from 'axios';
import qs from 'qs';
import { message } from "antd";
import { createHashHistory } from 'history';
// import { baseUrl } from "./url";

// axios.defaults.baseURL = baseUrl;
axios.defaults.timeout = 100000;
axios.interceptors.request.use(function (config) {
  config.url.includes('?') ?
    localStorage.getItem('token') && (config.url += `&token=${localStorage.getItem('token')}`) :
    localStorage.getItem('token') && (config.url += `?token=${localStorage.getItem('token')}`);
  return config;
}, function (error) {
  return Promise.reject(error);
});
axios.interceptors.response.use(function (res) {
  const { code } = res.data;
  if (code === 100004) {
    localStorage.removeItem('token');
    createHashHistory().push('/login');
    message.error(res.data.message);
    return;
  } else if (code === 100006) {
    createHashHistory().push('/login');
    return;
  } else if (code === 10002) {
    return res;
  } else if (code === 10010) {
    return res;
  } else if (code !== 0) {
    message.error(res.data.message);
    return;
  } else {
    return res;
  }
}, function (error) {
  message.error('服务未知错误，请稍后再试！');
  return Promise.reject(error);
});

export default class API {

  static get(url) {
    return axios({
      method: 'get',
      url,
    })
  }
  static post(url, params, type) {

    return axios({
      method: 'post',
      url,
      data: type === 'json' ? JSON.stringify(params) : qs.stringify(params),
      headers: {
        'Content-Type': type === 'json' ?
          'application/json;charset=utf-8' :
          'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
  }

  static login(url, params) {
    return axios({
      method: 'post',
      url,
      data: qs.stringify(params),
    })
  }

  static upload(url, formData) {
    return axios({
      method: 'post',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  static downloadFile(url, params = {}) {
    let token = localStorage.getItem("token");
    url += "?token=" + token;
    Object.entries(params).forEach(v => {
      url += ("&" + v[0] + "=" + v[1]);
    })
    let a = document.createElement("a");
    console.log(url, "ZAIXIAZAI")
    a.href = url + "&avoidCache=" + Math.random();
    a.download = true;
    a.click();
  }

}