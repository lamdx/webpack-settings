export default {
  loadingBtn(el) {
    let dom = this.getBtn(el);
    if (!dom) return false;
    if (!dom.classList.contains('is-loading')) {
      dom.classList.add('is-loading');
    }
    let loading = document.createElement('i');
    loading.setAttribute('class', 'el-icon-loading');
    dom.insertBefore(loading, dom.children[0]);
  },
  removeLoadingBtn(el) {
    let dom = this.getBtn(el);
    if (!dom) return false;
    let loading = dom.querySelector('.el-icon-loading');
    if (dom.classList.contains('is-loading')) {
      dom.classList.remove('is-loading');
    }
    if (loading) {
      dom.removeChild(loading);
    }
  },
  getBtn(el) {
    let dom = null;
    if (el.tagName === 'BUTTON' || el.tagName === 'button') {
      dom = el;
    } else {
      let btns = el.querySelectorAll('button');
      let res = [];
      for (let i = 0; i < btns.length; i++) {
        const element = btns[i];
        if (element.classList.contains('el-button--primary')) {
          res.push(element);
        }
      }
      if (res.length > 1) {
        return false;
      }
      dom = res[0];
    }
    return dom;
  }
};
