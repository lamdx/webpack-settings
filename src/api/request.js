import axios from 'axios';
// import qs from 'qs';

// 基准 URL
const baseURL = '';

const instance = axios.create({
  baseURL,
  timeout: 120 * 1000,
  // responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded'
  }
});

// 请求 拦截
instance.interceptors.request.use(config => {
  if (config.loading) {
    // Spin.show();
  }
  const headers = { token: window.localStorage.getItem('token') || 'token' };
  // 业务代码的 headers 优先级高于公共配置的 headers
  config.headers = Object.assign(headers, config.headers);
  const menuCode = window.localStorage.getItem('menuCode') || 'menuCode';
  // FormData qs 这里还有问题
  if (config.method.toLowerCase() === 'post') {
    // config.data = qs.stringify(config.data);
    // FormData 不能直接追加参数
    if (config.data instanceof FormData) {
      // 业务代码的 menuCode 优先级高于公共配置的 menuCode
      config.data.append('menuCode', menuCode);
    } else {
      config.data = Object.assign({ menuCode }, config.data);
    }
  }
  // config = { baseURL, data, headers, method, responseType, timeout, url, NO_GLOBAL_MSG };
  return config;
});

// 响应 拦截
instance.interceptors.response.use(
  response => {
    // response = { config: {}, data: {}, headers: {}, request: {}, status: 200, statusText: 'ok' };
    if (response?.config?.loading) {
      // Spin.hide();
    }
    const res = response.data;
    if (!res) {
      alert('响应报文未返回数据!');
      // 抛出错误，使其在业务代码 catch 中能捕获处理到
      return Promise.reject(response);
    }
    // 只有当交易正常才进入业务逻辑代码中
    if (String(res?.errorCode) === '0000') {
      return res;
    } else if (res instanceof ArrayBuffer || res instanceof Blob) {
      // 如果是文件类型
      return res;
    } else if (String(res?.errorCode) === '401') {
      if (confirm('抱歉，你的操作超时，请重新登录')) {
        window.localStorage.clear();
        window.sessionStorage.clear();
        window.location.href = 'redirectUrl';
      }
      return Promise.reject(res);
    } else {
      // 如果与后端约定好状态码 errorCode，需要在业务逻辑中处理，不需要 http 中拦截报错，则需要请求时配置 NO_GLOBAL_MSG
      if (!response?.config?.NO_GLOBAL_MSG) {
        alert(res?.errorMsg || res?.errorCode || '服务正忙，请稍后再试！');
      }
      return Promise.reject(res);
    }
  },
  error => {
    // Spin.hide();
    const err = error?.response || {};
    // err = { data, status, statusText, headers, config, baseURL }
    const statusMap = {
      400: '400 Bad Request',
      401: 'login Timeout',
      404: '404 Not Found',
      405: '405 Method Not Allowed',
      500: '500 网络请求无响应！',
      502: '502 Bad Gateway',
      504: '504 Gateway Timeout'
    };
    const msg =
      err.data || statusMap[err.status] || '网络请求异常，请稍后重试！';
    if (!err.config?.NO_GLOBAL_MSG) {
      alert(msg);
    }
    // 抛出错误，使其在业务代码 catch 中能捕获处理到
    return Promise.reject(error);
  }
);

const request = config => instance.request(config);

export default request;
