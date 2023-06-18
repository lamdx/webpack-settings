import dynamicStore from './dynamic-store.js';
import { createNamespacedHelpers } from 'vuex';
const { mapState, mapMutations } = createNamespacedHelpers('dynamicStore');

export default {
  computed: {
    // ...mapState('dynamicStore', ['localStore', 'formInstance']),
    ...mapState(['localStore', 'formInstance'])
  },
  methods: {
    // ...mapMutations('dynamicStore', [('updateLocalStore', 'updateFormInstance')]),
    ...mapMutations(['updateLocalStore', 'updateFormInstance']),
    init() {
      console.log(this.localStore);
      // this.$store.commit('dynamicStore/updateLocalStore', 'hello world');
      this.updateLocalStore('hello world');
      console.log(this.localStore);
    }
  },
  beforeCreate() {
    //  动态注册 store 空间
    if (!this.$store.hasModule('dynamicStore')) {
      this.$store.registerModule('dynamicStore', dynamicStore);
    }
  },
  beforeDestroy() {
    // 动态卸载模块 并没有清空该 store 中 state 存储的值
    this.$store.unregisterModule('dynamicStore');
  },
  created() {
    this.init();
  }
};
