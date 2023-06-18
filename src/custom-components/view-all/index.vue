<template>
  <div class="view_all" @click="go">
    <span>{{ left }}</span>
    <span>{{ right }}</span>
  </div>
</template>
<script>
export default {
  name: 'ViewAll',
  props: {
    left: {
      type: String,
      default: ''
    },
    right: {
      type: String,
      default: ''
    }
  },
  methods: {
    go() {
      this.$emit('go');
    }
  }
};
</script>
<style scoped lang="less">
.view_all {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 15px;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  line-height: 24px;
  word-wrap: break-word;
  word-break: break-all;
  span {
    padding-right: 15px;
    font-size: 14px;
    text-align: left;
    &:first-child {
      flex: 4;
      color: #999;
    }
    &:last-child {
      flex: 6;
      position: relative;
      color: #333;
      text-align: right;
      &::after {
        content: '';
        width: 10px;
        height: 10px;
        display: inline-block;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%) rotate(45deg);
        border-width: 2px 2px 0 0;
        border-style: solid;
        border-color: #ccc;
      }
    }
  }
  i {
    display: inline-block;
    padding: 5px;
    border: solid black;
    border-width: 0 1px 1px 0;
    font-size: 14px;
  }
  .down {
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }
  .up {
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
  }
  .right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
}
</style>
