const files = require.context('./modules/', true, /\.js$/);
let modules = [];
files.keys().forEach(key => {
  if (key === './index.js') return;
  modules = modules.concat(files(key).default);
});

import home from '@/views/home';

export default [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/custom-demo',
    name: 'custom-demo',
    component: () =>
      import(/* webpackChunkName: "custom-demo" */ '@/views/custom-demo')
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import(/* webpackChunkName: "demo" */ '@/views/demo'),
    meta: { keepAlive: true },
    // 路由组件可以通过 props 接收路由跳转传递的参数(params 和 query 是可以同时存在的)
    // 如果路由传参携带了 params 参数，跳转的时候只能使用 name 跳转，不能使用 path

    // 布尔值，路由组件可以通过 props 接收路由的 params，且只能接收 params
    // props: true,
    // 对象，可以额外地给路由组件传递一些 props
    // props: { a: 1, b: 2 },
    // 函数，可以将路由 params 参数、query 参数，通过 props 传递给路由组件
    props: $route => ({ keyword: $route.params.keyword, k: $route.query.k })
    // 传递的参数只有在页面级别的组件中的 props 才能获取到
  },
  ...modules
];
