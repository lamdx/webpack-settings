import Vue from 'vue';
// 创建弹窗组件的构造函数

let instance = null; // 存储单例实例

// 创建一个函数
export const createVue2JsCall =
  (component, option = {}) =>
  props => {
    const { customListeners = {} } = option;
    const ModalConstructor = Vue.extend(component);

    const createInstance = () => {
      instance = new ModalConstructor({
        el: document.createElement('div')
      });
    };
    const resetInstance = () => {
      instance.$destroy();
      instance.$el.remove();
      instance = null; // 清除 instance
    };
    return new Promise((resolve, reject) => {
      try {
        if (
          instance ||
          (instance?.$el && document.body.contains(instance?.$el))
        ) {
          // 如果实例存在或者在 body 中，重置之前的实例
          resetInstance();
        }
        createInstance();

        instance = Object.assign(instance, props);

        const eventFainilyCall = cb => data => {
          resetInstance();
          cb && cb(data);
        };
        // 在成功事件触发后执行操作
        instance.$on('success', eventFainilyCall(resolve));
        // 在失败事件触发后执行操作
        instance.$on('fail', eventFainilyCall(reject));
        // 拓展 custom listeners
        Object.keys(customListeners).forEach(k =>
          instance.$on(k, () => {
            customListeners[k]();
            // instance.$off(k)
          })
        );
        document.body.appendChild(instance.$el);
      } catch (error) {
        console.log(error);
      }
    });
  };

import CheckSign from './index.vue';

const checkSign = createVue2JsCall(CheckSign);

export default checkSign;
