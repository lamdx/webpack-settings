/**
 * 自动滚动至可视区域
 */
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.scrollIntoView();
    });
  },
  methods: {
    scrollIntoView() {
      setTimeout(() => {
        const dom = document.getElementsByClassName('ivu-tabs-tab-active')[0];
        if (dom) {
          dom.scrollIntoView({ behavior: 'smooth' }, 0);
        }
      }, 100);
    }
  }
};
