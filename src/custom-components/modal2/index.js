import Vue from 'vue';
import ModalComponent from './index.vue';

const ModalConstructor = Vue.extend(ModalComponent);

const ModalPlugin = {
  install(Vue) {
    const instance = new ModalConstructor({
      el: document.createElement('div')
    });
    document.body.appendChild(instance.$el);

    Vue.prototype.$modal2 = {
      open(options) {
        instance.open(options);
      },
      close() {
        instance.close();
      }
    };
  }
};

export default ModalPlugin;
