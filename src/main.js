// import 'core-js';
// import count from './js/count';
// import sum from './js/sum';

// 想要 webpack 打包资源，必须引入该资源
import './assets/css/iconfont.css';
import './assets/css/index.css';
import './assets/less/index.less';
import './assets/sass/index.sass';
import './assets/sass/index.scss';
import './assets/stylus/index.styl';

// const result = count(2, 2);
// console.log(result);
// console.log(sum(1, 2, 3, 4));

// !function(){"use strict";console.log(0),console.log(function(){for(var n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return o.reduce((function(n,o){return n+o}),0)}(1,2,3,4))}();

// 添加 promise 代码
const promise = Promise.resolve();
promise.then(() => {
  console.log('hello promise');
});

// 判断是否支持 HMR 功能
// if (module.hot) {
//   module.hot.accept('./js/count.js', function(count) {
//     const result1 = count(2, 1);
//     console.log(result1);
//   });

//   module.hot.accept('./js/sum.js', function(sum) {
//     const result2 = sum(1, 2, 3, 4);
//     console.log(result2);
//   });
// }
