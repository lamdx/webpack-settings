<template>
  <div class="pd-32">
    <!-- <img :src="getImage('logo')" alt="" /> -->
    <br />
    <router-link to="/demo">demo</router-link>
    <router-link to="/custom-demo">custom-demo</router-link>
    <input type="button" value="减" @click="minus" />
    <input id="num" v-model="num" type="text" />
    {{ num }}
    <input type="button" value="加" @click="add" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'Home',
  beforeRouteEnter(to, from, next) {
    console.log('beforeRouteEnter ===');
    console.log('to ===', to);
    console.log('from ===', from);
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('beforeRouteLeave ===');
    console.log('to ===', to);
    console.log('from ===', from);
    next();
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('app', ['num'])
  },
  watch: {
    $route: {
      handler() {
        console.log('route 123 ===', 123);
      }
      // immediate: true
    }
  },
  created() {
    console.log('created ===');
    // 添加 promise 代码
    const promise = Promise.resolve();
    promise.then(() => {
      console.log('hello promise');
    });
    console.log('process.env ===', process.env);
  },
  mounted() {
    console.log('mounted ===');
  },
  activated() {
    console.log('activated ===');
  },
  deactivated() {
    console.log('deactivated ===');
  },
  methods: {
    ...mapMutations('app', ['setNum']),
    minus() {
      const res = this.num - 1;
      this.setNum(res);
    },
    add() {
      const res = this.num + 1;
      this.setNum(res);
    },
    getImage(bankType = 'logo') {
      const { $banksMap } = this;
      console.log('$banksMap ===', $banksMap);
      return require(`@/assets/images/bank/${$banksMap[bankType]}`);
    }
  }
};
</script>
<style scoped lang="scss"></style>
