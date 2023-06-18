const state = {
  localStore: 'localStore',
  formInstance: null
};

const mutations = {
  updateLocalStore(state, localStore) {
    state.localStore = localStore;
  },
  updateFormInstance(state, formInstance) {
    state.formInstance = formInstance;
  }
};

const actions = {
  setLocalStore({ commit }, localStore) {
    commit('updateLocalStore', localStore);
  },
  setFormInstance({ commit }, formInstance) {
    commit('updateFormInstance', formInstance);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
