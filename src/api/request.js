import axios from 'axios';
// import qs from 'qs';

// 基准 URL
const baseURL = '';

const instance = axios.create({
  baseURL,
  timeout: 10 * 1000, // 10s
  // responseType: 'json',
  // retry: 2, // 请求超时重新发送请求次数
  // retryDelay: 500, // 重新发送请求间隔 500ms
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
    } else if (config.data instanceof ArrayBuffer) {
      // 二进制数据流格式上传文件 不处理
      config.data = Object.assign(config.data);
    } else {
      config.data = Object.assign({ menuCode }, config.data);
    }
  }
  // config = { baseURL, data, headers, method, responseType, timeout, url, NO_GLOBAL_MSG }; // 包含上方 create 中设置的基础参数，以及 instance 传过来的参数
  return config;
});

// 响应 拦截
instance.interceptors.response.use(
  response => {
    // response = { config: {}, data: {}, headers: {}, request: {}, status: 200, statusText: 'ok' };
    const { config = {}, data } = response;
    if (config.loading) {
      // Spin.hide();
    }
    const res = data;
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
      if (!config.NO_GLOBAL_MSG) {
        alert(res?.errorMsg || res?.errorCode || '服务正忙，请稍后再试！');
      }
      return Promise.reject(res);
    }
  },
  error => {
    // Spin.hide();
    // error.config 是一个对象，包含上方 create 中设置的基础参数
    // error.response = { config, data, headers, status, statusText }
    const { config = {}, response = {} } = error;
    const statusMap = {
      400: '400 Bad Request',
      401: 'login Timeout',
      404: '404 Not Found',
      405: '405 Method Not Allowed',
      500: '500 网络请求无响应！',
      502: '502 Bad Gateway',
      504: '504 Gateway Timeout'
    };
    console.log('interceptors error ===', error);
    const msg =
      response?.data?.message ||
      statusMap[response.status] ||
      '网络请求异常，请稍后重试！';

    if (!config.retry) {
      if (config.NO_GLOBAL_MSG) {
        // 抛出错误，使其在业务代码 catch 中能捕获处理到
        return Promise.reject(error);
      } else {
        // 全局统一处理错误
        return alert(msg);
      }
    }

    // 如果有响应内容，即没有超时，就直接返回错误信息，不再发送请求
    if (response.data) {
      return Promise.reject(response.data);
    }

    // 超时处理
    // __retryCount 用来记录当前是第几次发送请求
    config.__retryCount = config.__retryCount || 0;

    // 如果当前发送的请求大于等于设置好的请求次数时，不再发送请求，返回最终的错误信息
    if (config.__retryCount >= config.retry) {
      return Promise.reject(error);
    }

    // 记录请求次数+1
    config.__retryCount += 1;

    // 设置请求间隔，在发送下一次请求之前停留一段时间
    const backoff = new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, config.retryDelay || 500); // 500ms
    });

    // 再次发送请求
    return backoff.then(function () {
      return instance(config);
    });
  }
);

const request = config => instance.request(config);

export default request;
