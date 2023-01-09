<template>
  <div class="home">
    <h1>homePage</h1>
    <img :src="getImage('logo')" alt="" />
    <br />
    <input type="button" value="减" @click="minus" />
    <input id="num" v-model="num" type="text" />
    <input type="button" value="加" @click="add" />
    <TimeAxis></TimeAxis>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'Home',
  data() {
    return {};
  },
  computed: {
    ...mapState('app', ['num'])
  },
  created() {
    // 添加 promise 代码
    const promise = Promise.resolve();
    promise.then(() => {
      console.log('hello promise');
    });
    console.log('process.env ===', process.env);
    this.$api
      .getData({})
      .then(res => {
        console.log('res ===', res);
      })
      .catch(err => {
        console.log('err ===', err);
      });
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
<style scoped lang="less">
.home {
  height: 100%;
  padding: 32px;
}
</style>
