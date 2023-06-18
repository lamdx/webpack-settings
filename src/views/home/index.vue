<template>
  <div class="pd-20">
    <!-- <img :src="getImage('logo')" alt="" /> -->
    <br />
    <router-link to="/demo">to demo</router-link>
    <input type="button" value="减" @click="minus" />
    <input id="num" v-model="num" type="text" />
    {{ num }}
    <input type="button" value="加" @click="add" />
    <MySelect
      v-model="svalue"
      placeholder="请选择"
      clearable
      :requestMethod="$api.getOptions"
    >
      <template v-slot:option="{ item }">
        <div class="flex-space-between">
          <span>{{ item.label }}</span>
          <span>{{ item.value }}</span>
        </div>
      </template>
    </MySelect>
    <MySelect :options="options" multiple collapse-tags></MySelect>
    <!-- <TimeAxis></TimeAxis> -->
    <!-- <MyLineChart></MyLineChart> -->
    <!-- <ListHeader></ListHeader> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'Home',
  data() {
    return {
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      svalue: ''
    };
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
