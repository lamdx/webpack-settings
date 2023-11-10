<template>
  <!-- 时间轴 -->
  <div class="log_list">
    <div
      v-for="(item, i) in list"
      :key="i"
      :class="{ item: true, line: i !== list.length - 1 }"
    >
      <i class="dot"></i>
      <p class="title">{{ item.title }}</p>
      <p class="title">{{ item.time }}</p>
      <p :class="{ title: true, memo: item.memo }">
        {{ item.memo }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LogList',
  props: {
    list: {
      type: Array,
      default: () => [
        {
          title: '时间轴1',
          time: '2020-12-30',
          memo: ''
        },
        {
          title: '时间轴2',
          time: '2020-12-30',
          memo: '这里是审批意见'
        }
      ]
    }
  }
};
</script>
<style scoped lang="less">
.log_list {
  .item {
    margin-top: 20px;
    position: relative;
    padding-left: 20px;
    // padding-bottom: 20px;
    &.line {
      border-left: 1px solid #e5e5e5;
    }
  }
  .dot {
    width: 8px;
    height: 8px;
    position: absolute;
    left: -4px;
    top: -14px;
    background: #ff710e;
    border-radius: 50%;
  }
  .title {
    position: relative;
    top: -20px;
  }
  .memo {
    height: 72px;
    padding: 16px;
    border: 1px solid #fafafa;
    background: #fafafa;
    border: 1px solid #fff;
    border-radius: 4px;
    line-height: 14px;
  }
}
</style>
