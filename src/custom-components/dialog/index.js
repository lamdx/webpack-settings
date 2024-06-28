import Vue from 'vue';
import Dialog from './index.vue';

// 创建 Dialog 构造器
let DialogConstrutor = Vue.extend(Dialog);
let instance;

const dialog = function (options = {}) {
  // 设置默认参数为对象，如果参数为字符串，参数中 message 属性等于该参数，回调函数为空
  if (typeof options === 'string') {
    options = {
      content: options,
      onOk: () => {},
      onCancel: () => {}
    };
  }
  // 创建实例
  instance = new DialogConstrutor({
    data: options
  });
  // 将实例挂载到 body 下
  document.body.appendChild(instance.$mount().$el);
};

export default dialog;
