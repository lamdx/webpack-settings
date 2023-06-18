<template>
  <!-- 复选框 -->
  <div class="checkbox">
    <ul>
      <li v-for="(item, i) in checkboxList" :key="i" @click="handle(item)">
        <p :class="{ acitive: find(item), disable: item.disable }">
          <i v-if="find(item)">✔</i>
        </p>
        <div class="item">
          <div class="title">{{ item.title }}</div>
          <div class="subtitle">{{ item.desc }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
const checkboxList = [
  { id: 1, title: '复选框1', desc: '描述1', disable: true },
  { id: 2, title: '复选框2', desc: '描述2' },
  { id: 3, title: '复选框3', desc: '描述3' }
];
export default {
  name: 'MyCheckbox',
  props: {
    checkboxList: {
      type: Array,
      default: () => checkboxList
    }
  },
  data() {
    return {
      selected: [] // 选中的数据
    };
  },
  methods: {
    // 点击选项触发的函数
    handle(item) {
      // 如果 disable 为真则不能被选中，直接 return
      if (item.disable) return;
      // 如果当前点击选项不在已选中数组内，则添加进去，否则就清除出去
      if (!this.find(item)) {
        this.selected.push(item);
      } else {
        let i = this.find(item, true).index;
        this.selected.splice(i, 1);
      }
      this.$emit('on-select', this.selected); // 传值父组件
    },
    // 去重操作
    /**
     * 参数说明：
     *  item 当前选项 (必传)
     *  isremove 是否删除 (可选)
     */
    find(item, isremove) {
      let flag = false;
      let index;
      for (let i = 0; i < this.selected.length; i++) {
        if (item === this.selected[i]) {
          flag = true;
          index = i;
        }
      }
      if (isremove) {
        return { flag, index };
      } else {
        return flag;
      }
    }
  }
};
</script>
<style scoped lang="less">
.checkbox {
  ul {
    margin: 0;
    padding: 0;
    background: #fff;
    list-style: none;
    li {
      display: flex;
      box-sizing: border-box;
      align-items: center;
      // align-items: flex-start;
      text-align: left;
      line-height: 22px;
      font-size: 14px;
      .item {
        width: 100%;
        box-sizing: border-box;
        .title {
          margin: 4px;
          color: #333;
          font-size: 16px;
          word-break: break-all;
          text-overflow: ellipsis;
        }
        .subtitle {
          margin: 4px;
          color: #999;
          font-size: 14px;
          word-break: break-all;
        }
      }
      p {
        min-width: 18px;
        min-height: 18px;
        width: 18px;
        height: 18px;
        display: flex;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
        margin: 6px 15px;
        border: 1px solid #ccc;
        border-radius: 4px;
        &.acitive {
          background: #4c91eb;
          border: 1px solid #4c91eb;
          color: #ffffff;
        }
        &.disable {
          background: #eee;
        }
      }
    }
  }
}
</style>
