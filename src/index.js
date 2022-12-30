// import 'core-js';
import count from './js/count';
import sum from './js/sum';

// 想要 webpack 打包资源，必须引入该资源
import './assets/css/iconfont.css';
import './assets/css/index.css';
import './assets/less/index.less';
import './assets/sass/index.sass';
import './assets/sass/index.scss';
import './assets/stylus/index.styl';

const result = count(2, 2);
console.log(result);
console.log(sum(1, 2, 3, 4));

// !function(){"use strict";console.log(0),console.log(function(){for(var n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return o.reduce((function(n,o){return n+o}),0)}(1,2,3,4))}();

// 添加 promise 代码
const promise = Promise.resolve();
promise.then(() => {
  console.log('hello promise');
});

// 验证代码分割 splitChunks
import('./js/a');
import('./js/b');
import('./js/c');
import('./js/d');

// css 支持 HMR 是因为 style-loader 做了处理， js 是不支持 HMR 的，所以需要判断是否支持 HMR 功能，在项目中不需要些以下代码(很麻烦)，可以借助 vue-loader、react-hot-loader
if (module.hot) {
  module.hot.accept('./js/count.js');
  module.hot.accept('./js/sum.js');
}

document.getElementById('btn').onclick = function() {
  // import 动态导入：会将动态导入的文件代码分割(拆分成单独模块)，在需要使用的时候自动加载
  import(/* webpackChunkName: "count" */ './js/count')
    .then(res => {
      console.log('模块加载成功', res.default(2, 5));
    })
    .catch(err => {
      console.log('模块加载失败', err);
    });
};

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('./service-worker.js')
//       .then(registration => {
//         console.log('SW registered: ', registration);
//       })
//       .catch(registrationError => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }
