<template>
  <!-- 时间轴 -->
  <div class="options_list">
    <div v-for="(item, i) in list" :key="i" class="item">
      <p class="title">{{ item.title }}</p>
      <p class="time">{{ item.time }}</p>
      <div class="body">
        <i class="dot"></i>
        <p :class="{ base: true, option: item.memo }">{{ item.memo }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TimeAxis',
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
<style scoped lang="scss">
.options_list {
  font-size: 12px;
  .item {
    margin-top: 8px;
    &:last-of-type {
      .body {
        border-left-color: #fff;
        &::before,
        &::after {
          background: #fff;
        }
      }
    }
    .title {
      padding: 0 0 0 20px;
      line-height: 20px;
      font-size: 14px;
    }
    .time {
      padding: 0 0 0 20px;
      line-height: 17px;
    }
    .body {
      margin-top: 8px;
      padding: 0 0 0 20px;
      position: relative;
      border-left: 1px solid #ff710e;
      &::before,
      &::after {
        content: '';
        width: 1px;
        height: 15px;
        position: absolute;
        left: -1px;
        background: #ff710e;
      }
      &::before {
        top: -15px;
      }
      .dot {
        width: 8px;
        height: 8px;
        position: absolute;
        left: -5px;
        top: -30px;
        background: #ff710e;
        border-radius: 50%;
      }
      .base {
        height: 0;
        padding: 0;
        background: #fafafa;
        border: 1px solid #fff;
        border-radius: 4px;
        line-height: 14px;
        &.option {
          height: 72px;
          padding: 16px;
          border: 1px solid #fafafa;
        }
      }
    }
  }
}
</style>
