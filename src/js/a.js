import count from './count';
const result = count(64, 2);
console.log('a.js', result);
import(/* webpackChunkName: "math" */ './math')
  .then(res => {
    console.log('a.js加载模块 math 成功', res);
  })
  .catch(err => {
    console.log('a.js加载模块 math 失败', err);
  });
import(/* webpackChunkName: "sum" */ './sum')
  .then(res => {
    console.log('a.js加载模块 sum 成功', res);
  })
  .catch(err => {
    console.log('a.js加载模块 sum 失败', err);
  });
