<template>
  <div>
    <div v-if="show" class="message-box">
      <!-- 作用域插槽 -->
      <strong><slot name="title" title="来自message的title"></slot></strong>
      <!-- 具名插槽 -->
      <!-- <strong><slot name="title"></slot></strong> -->
      <!-- 默认插槽 -->
      <slot></slot>
      <span class="message-box-close" @click="$emit('update:show', false)">
        X
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Message',
  props: ['show'],
  data() {
    return {};
  }
};
</script>
<style scoped lang="less">
.message-box {
  padding: 10px 20px;
  background: #4fc08d;
  border: 1px solid #42b983;
}
.message-box-close {
  float: right;
}
</style>
