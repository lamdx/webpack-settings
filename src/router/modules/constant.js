const constantRoutes = [
  {
    path: '/comp',
    name: 'comp',
    component: () => import(/* webpackChunkName: "comp" */ '@/views/demo')
  }
];
export default constantRoutes;
