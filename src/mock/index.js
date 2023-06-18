import Mock from 'mockjs';
import Watermark from '@/utils/waterMark';

// 获取 URL 的 key值 或 URL对象
function queryURLParams(url = window.location.href, key) {
  const params = url.split('?')[1] || '';
  if (!params) {
    return {};
  } else {
    const paramsArr = params.split('&');
    const res = {};
    for (let i = 0; i < paramsArr.length; i++) {
      const temp = paramsArr[i].split('=');
      res[temp[0]] = temp[1] ? decodeURI(temp[1]) : '';
    }
    return !key ? res : res[key];
  }
}

export function mockFilter() {
  window.console.info('加载了Mock.js文件');
  // 设置水印
  Watermark.set('演示 Demo');
  Mock.setup = { timeout: 500 };
  // mock 原本存在 responseType 丢失的情况，这里重新追加
  Mock.XHR.prototype.__send = Mock.XHR.prototype.send;
  Mock.XHR.prototype.send = function () {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false;
      this.custom.xhr.responseType = this.responseType;
    }
    this.__send.apply(this, arguments);
  };
  const mockFile = require.context('./mockData', true, /\.js$/);
  const mockArray = [];
  mockFile.keys().forEach(key => {
    if (key !== './index.js') {
      const data = mockFile(key).default;
      data.forEach(i => {
        // get请求加上.*
        if (/get/i.test(i.method) && !i.url.endsWith('.*')) {
          i.url += '.*';
        }
        const commonHttp = mockArray.find(
          item => item.url === i.url && RegExp(item.method, 'i').test(i.method)
        );
        if (commonHttp) {
          commonHttp.data[i.name] = i.data;
        } else {
          i.data = {
            [i.name]: i.data
          };
          mockArray.push(i);
        }
      });
    }
  });
  mockArray.forEach(i => {
    Mock.mock(RegExp(`^${i.url}$`), (i.method || '').toLowerCase(), config => {
      let data = i.data[localStorage.currentPageName] || i.data['home/index'];
      if (data === undefined) {
        window.console.log(
          `%c当前页面：${localStorage.currentPageName}需要添加接口：${i.url}`,
          'color:green'
        );
      } else {
        let result;
        if (localStorage.currentPageName === 'home_index') {
          data = Mock.mock(data);
          result = { ...data };
          if (typeof i.filter === 'function') {
            i.filter(data, result, config);
          }
        } else if (localStorage.currentPageName === 'bugdet') {
          data = Mock.mock(data);
          result = { ...data };
          if (typeof i.filter === 'function') {
            if (/^get$/i.test(config.type)) {
              // get 请求需要自己 set body
              config.body = JSON.stringify(queryURLParams(config.url));
            }
            i.filter(data, result, config);
          }
        } else {
          window.console.log(`%c${i.url}：走了mock接口`, 'color:#000');
          if (data.data) {
            data.data = Mock.mock(data.data);
          } else {
            data = Mock.mock(data);
          }
          result = { ...data };
          if (typeof i.filter === 'function') {
            if (/^get$/i.test(config.type)) {
              config.body = JSON.stringify(queryURLParams(config.url));
            }
            i.filter(data, result, config);
          }
          window.console.log('mock返回数据：', result);
        }
        return result;
      }
    });
  });
}
