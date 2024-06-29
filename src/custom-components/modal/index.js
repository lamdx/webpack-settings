import Vue from 'vue';
import Modal from './index.vue';

// 创建 Modal 构造器
let ModalConstrutor = Vue.extend(Modal);
let instance;

const modal = function (options = {}) {
  // 设置默认参数为对象，如果参数为字符串，参数中 message 属性等于该参数，回调函数为空
  if (typeof options === 'string') {
    options = {
      content: options,
      onOk: () => {},
      onCancel: () => {}
    };
  }
  // 创建实例
  instance = new ModalConstrutor({
    data: options
  });
  // 将实例挂载到 body 下
  document.body.appendChild(instance.$mount().$el);
};

export default modal;
