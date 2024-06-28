import Vue from 'vue';
import DialogComponent from './index.vue';

const DialogConstructor = Vue.extend(DialogComponent);

const DialogPlugin = {
  install(Vue) {
    const instance = new DialogConstructor({
      el: document.createElement('div')
    });
    document.body.appendChild(instance.$el);

    Vue.prototype.$modal = {
      open(options) {
        instance.open(options);
      },
      close() {
        instance.close();
      }
    };
  }
};

export default DialogPlugin;
