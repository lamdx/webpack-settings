<template>
  <div :class="isTotal ? 'total' : 'part'">
    <div ref="content" :title="content" class="content">
      <div>{{ content }}</div>
      <div v-if="isShowButton" class="button" @click="toggle">
        <span v-if="isTotal">收起</span>
        <span v-else>展开</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 这个文字展开收起组件 没有办法展示多种样式，不灵活
  name: 'TextExpandAndCollapse',
  props: {
    content: { type: String, default: '' }
  },
  data() {
    return {
      isTotal: true, // 这个初始值必须为 true，才能获取 getComputedStyle
      isShowButton: false
    };
  },
  watch: {
    content: {
      handler() {
        // 以下这部分函数体可以在 mounted 钩子函数中执行，写在 watch 方便调试各种情况
        this.isTotal = true; // isTotal 的值必须为 true，才能获取到真正的内容高度
        this.$nextTick(() => {
          if (!this.$refs.content) return;
          // const contentHeight = window
          //   .getComputedStyle(this.$refs.content)
          //   .height.replace('px', '');
          // lineHeight webkitLineClamp 的值须与样式中的值保持一致
          const lineHeight = 20;
          const webkitLineClamp = 1;
          if (this.$refs.content.offsetHeight > lineHeight * webkitLineClamp) {
            this.isShowButton = true;
          } else {
            this.isShowButton = false;
          }
          // 设置初始状态为收起
          this.isTotal = false;
        });
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    toggle() {
      this.isTotal = !this.isTotal;
    }
  }
};
</script>

<style lang="less" scoped>
@webkitLineClamp: 1;
@lineHeight: 20px;
@fontSize: 14px;
@fontColor: #666;
@backGroundColor: #fff;
@buttonWidth: 3em;
@buttonColor: #68b1e8;
.total {
  position: relative;
  padding-left: 4px;
  height: auto;
  overflow: hidden;
  color: @fontColor;
  font-size: @fontSize;
  text-align: left;
  .content {
    line-height: @lineHeight;
  }
  .button {
    position: absolute;
    z-index: 1;
    width: @buttonWidth;
    height: @lineHeight;
    right: 0;
    bottom: 0;
    color: @buttonColor;
    text-align: center;
  }
}
.part {
  position: relative;
  overflow: hidden;
  font-size: @fontSize;
  .content {
    // 最大高度设为 @webkitLineClamp 倍的行间距
    max-height: @lineHeight * @webkitLineClamp;
    line-height: @lineHeight;
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-all;
    background-color: @backGroundColor;
    color: @backGroundColor;
    &::after,
    &::before {
      content: attr(title);
      position: absolute;
      left: 0;
      top: 0;
      color: @fontColor;
    }
    &::before {
      display: block;
      overflow: hidden;
      z-index: 1;
      max-height: @lineHeight * (@webkitLineClamp - 1);
      background: @backGroundColor;
    }
    &::after {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      // 截取行数
      -webkit-line-clamp: @webkitLineClamp;
      text-overflow: ellipsis;
      box-sizing: border-box;
      // 行首缩进字符数，值为[(截取行数-1)*尾部留空字符数]
      text-indent: -(@webkitLineClamp - 1) * @buttonWidth;
      // 尾部留空字符数
      padding-right: @buttonWidth;
    }
    .button {
      position: absolute;
      z-index: 1;
      width: @buttonWidth;
      height: @lineHeight;
      right: 0;
      bottom: 0;
      color: @buttonColor;
      text-align: center;
    }
  }
}
</style>
