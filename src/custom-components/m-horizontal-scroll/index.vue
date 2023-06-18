<template>
  <div class="main">
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
  </div>
</template>

<script>
export default {
  /**
   * better-scroll
   * 移动端横向滑动
   */
  name: 'MHorizontalScroll'
};
</script>

<style lang="less" scoped>
.main {
  display: flex;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .item {
    width: 100px;
    height: 100px;
    flex: none;
    background-color: #68b1e8;
    margin-right: 16px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
