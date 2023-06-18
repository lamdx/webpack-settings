export default {
  install(Vue) {
    // 插件 可以给 Vue 定义全局过滤器、指令、混入
    // 全局过滤器
    Vue.filter('mySlice', function (value) {
      return value.slice(0, 4);
    });
    Vue.directive('fbind', {
      // 指令和元素成功绑定时(一上来)
      bind(element, binding) {
        element.value = binding.value;
      },
      // 指令所在的元素被插入到页面时
      inserted(element, binding) {
        // 涉及到 dom 操作 需要在合适的时机操作
        element.focus();
      },
      // 指令所在的模板被重新解析时
      update(element, binding) {
        element.value = binding.value;
      }
    });
    Vue.mixin({
      data() {
        return {
          x: 100
        };
      }
    });
    // 也可以给 Vue 原型上添加一个方法，vm 和 vc 都可以使用
    Vue.prototype.hello = () => {
      alert('hello wworld');
    };
  }
};
