let num = JSON.parse(localStorage.getItem('num')) || 1;

const state = {
  userInfo: {},
  num
};

const mutations = {
  setUserInfo: (state, userInfo) => {
    state.userInfo = userInfo;
  },
  // 专门负责修改 state 中的变量
  // this.$store.commit('方法的名称', '按需传递唯一的参数')
  setNum(state, num) {
    state.num = num;
    localStorage.setItem('num', JSON.stringify(state.num));
  }
};

const actions = {
  getUserInfo({ commit }, userInfo) {
    commit('setUserInfo', userInfo);
  }
};

// reduce 这种写法会破坏 vuex 的功能，不建议使用，因为 mutations getters 里面可以书写其他逻辑
// const keysList = Object.keys(state);

// const mutations = keysList.reduce(
//   (prev, key) => ({ ...prev, [key]: (state, data) => (state[key] = data) }),
//   {}
// );

// const getters = keysList.reduce(
//   (prev, key) => ({ ...prev, [key]: state => state[key] }),
//   {}
// );

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
