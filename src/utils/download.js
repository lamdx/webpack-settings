import { LoadingBar, Message } from 'iview';
import request from './http';
export function downloadBlob(blob, fileName) {
  // IE
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    let linkEl = document.createElement('a');
    linkEl.download = fileName;
    linkEl.style.display = 'none';
    linkEl.href = window.URL.createObjectURL(blob);
    document.body.appendChild(linkEl); // mount
    linkEl.click(); // trigger click
    window.URL.revokeObjectURL(linkEl.href); // 释放 URL 对象
    document.body.removeChild(linkEl);
  }
}
/**
 * 文件下载公共方法
 */
export function handleDownload(config) {
  LoadingBar.start();
  request({
    url: '',
    method: 'get',
    responseType: 'blob'
  })
    .then(res => {
      downloadFileReader(res)
        .then(data => {
          downloadBlob(
            new Blob([data]),
            `${config.srcFlieName}.${config.fileFormat}`
          );
          LoadingBar.finish();
        })
        .catch(err => {
          LoadingBar.error();
          Message.err(err || '下载文件失败');
        });
    })
    .catch(err => {
      console.error(err);
      LoadingBar.error();
    });
}

/**
 * 处理文件流下载报错
 */
export function downloadFileReader(res) {
  return new Promise((resolve, reject) => {
    if (res.type === 'application/json') {
      try {
        let reader = new FileReader();
        reader.addEventListener('loadend', function (e) {
          let data = JSON.parse(e.target.result || '{}');
          let msg = data.errorMessage || '下载文件失败';
          reject(msg);
        });
        reader.readAsText(res);
      } catch (error) {
        reject(error);
      }
    } else {
      resolve(res);
    }
  });
}
