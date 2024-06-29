## 使用

```js
// 引入 Modal 组件
import Modal from '@/custom-components/modal/index.js';

// 将 Modal 组件挂载到 vue 原型上
Vue.prototype.$modal = Modal;
```

```js
// 传入对象参数
this.$modal({
  title: '提示',
  content: '这是一段提示信息',
  left_buttton: '取消',
  right_buttton: '确定',
  onOk: () => {
    console.log('ok');
  },
  onCancel: () => {
    console.log('cancel');
  }
});

// 传入字符串参数（该参数会做为参数中 content 属性的值，回调函数为空）
this.$modal('这是一段提示信息2');
```
