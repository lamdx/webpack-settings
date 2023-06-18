// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';

// 项目样式
import './assets/style/style.scss';

// 统一管理请求 api
import * as API from '@/api';
// 自动化注册全局组件
import './components';
import './custom-components';
// 动态引入图片
import '@/assets/images';
// filter 过滤器
import './filters';
// 自定义指令
import './directives';

// 按需引入 element-ui
import '@/element-ui';

// 关闭 Vue 在启动时生成生产提示
Vue.config.productionTip = false;

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   store,
//   components: { App },
//   template: '<App/>'
// });

//  el: '#app', 等价于 vm.$mount('#app'); 但是 vm.$mount('#app'); 更加灵活

// 完整版的 vue.js 包含 核心功能 + 模板解析器 177kb
// vue.runtime.js 是运行版的 Vue，只包含核心功能，没有模板解析器；创建实例的时候不能使用 template: '<App/>'
// vue.runtime.js 较 vue.js 小了近三分之一；创建实例的时候只能使用 render 函数 136kb
const vm = new Vue({
  beforeCreate() {
    // 安装全局事件总线
    Vue.prototype.$bus = this;
    Vue.prototype.$api = API;
  },
  router,
  store,
  render: h => h(App)
});

// mock 数据执行方法只在指定的演示环境触发
// if (location.origin === process.env.MOCK_ENV || process.env.IS_DEMO_ENV) {
// import(/* webpackChunkName:"mock-data" */ '@/mock/index.js').then(res => {
//   res.mockFilter();
// });
// }

vm.$mount('#app');
