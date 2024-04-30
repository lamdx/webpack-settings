import Vue from 'vue';
import Router from 'vue-router';

import routes from './routes';

import checkSign from '@/components/check-sign/index.js';

Vue.use(Router);

const router = new Router({
  routes,
  linkActiveClass: 'is_active' // 覆盖默认的路由高亮的类，默认的类叫做 router-link-active
});

let isNoCheck = true;
// isNoCheck = false;

router.beforeEach((to, from, next) => {
  console.log('to ===', to);
  console.log('from ===', from);
  if (isNoCheck) return next();
  checkSign()
    .then(res => {
      console.log('res ===', res);
      next();
    })
    .catch(err => {
      console.log('err ===', err);
      next();
    });
});

export default router;
