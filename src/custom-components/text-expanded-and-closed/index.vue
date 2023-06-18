<template>
  <div class="wrap">
    <div class="content">
      <div ref="content" :class="[expanded ? 'expanded' : 'closed']">
        {{ content }}
      </div>
      <div v-if="isShowButton" class="button" @click="toggle">
        <div v-if="expanded" class="flex">收起<span class="icon">↑</span></div>
        <div v-else class="flex">
          <span style="color: #666">...</span>
          &nbsp;展开
          <span class="icon">↓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 这个文字展开收起组件 段落最后还是尽量还是不要 ... 展示，因为设备宽度 320px 375px 414px以及中英文符号空格占位不一致，切割宽度不好调整，可以考虑用透明度
  name: 'TextExpandedAndClosed',
  props: {
    content: { type: String, default: '' }
  },
  data() {
    return {
      expanded: true,
      isShowButton: false
    };
  },
  watch: {
    content: {
      handler() {
        // 以下这部分函数体可以在 mounted 钩子函数中执行，写在 watch 方便调试各种情况
        this.expanded = true; // expanded 的值必须为 true，才能获取到真正的内容高度
        this.$nextTick(() => {
          if (!this.$refs.content) return;
          // const lineHeight = window.getComputedStyle(this.$refs.content)['line-height'].replace('px', '');
          // lineHeight webkitLineClamp 的值须与样式中的值保持一致
          const lineHeight = 20;
          const webkitLineClamp = 1;
          if (this.$refs.content.offsetHeight > lineHeight * webkitLineClamp) {
            this.isShowButton = true;
          } else {
            this.isShowButton = false;
          }
          // 设置初始状态为收起
          this.expanded = false;
        });
      },
      immediate: true
    }
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded;
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
@buttonColor: #68b1e8;
.wrap {
  .content {
    position: relative;
    color: @fontColor;
    line-height: @lineHeight;
    font-size: @fontSize;
    letter-spacing: 0;
    word-wrap: break-word;
    word-break: break-all;
    text-align: justify; // 这个算是样式关键点之一
    overflow: hidden;
    .expanded {
      height: auto;
      // padding-bottom: @lineHeight;
    }
    .closed {
      max-height: @lineHeight * @webkitLineClamp;
    }
    .button {
      position: absolute;
      bottom: 0;
      right: 0;
      vertical-align: middle;
      color: @buttonColor;
      font-size: @fontSize;
      background: @backGroundColor;
      .flex {
        display: flex;
      }
      .icon {
        width: 1em;
        line-height: @lineHeight * 0.8;
        vertical-align: middle;
        text-align: center;
      }
    }
  }
}
</style>
