import count from './count';
const result = count(128, 2);
console.log('b.js', result);
import(/* webpackChunkName: "math" */ './math')
  .then(res => {
    console.log('b.js加载模块 math 成功', res);
  })
  .catch(err => {
    console.log('b.js加载模块 math 失败', err);
  });
import(/* webpackChunkName: "sum" */ './sum')
  .then(res => {
    console.log('b.js加载模块 sum 成功', res);
  })
  .catch(err => {
    console.log('b.js加载模块 sum 失败', err);
  });
