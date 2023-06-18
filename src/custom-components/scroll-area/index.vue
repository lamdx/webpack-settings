<template>
  <!-- 区域滚动 -->
  <div ref="wrap" class="wrap">
    <div class="arrow left" @click="hander('left')">
      <i class="left"></i>
    </div>
    <div class="arrow right" @click="hander('right')">
      <i class="right"></i>
    </div>
    <div
      :style="{
        width: list.length * adaptiveWidth + 'px',
        transform: 'translateX(-' + translate + 'px)'
      }"
      class="boxes"
    >
      <div
        v-for="(item, i) in list"
        :key="i"
        :style="{ width: adaptiveWidth - 15 + 'px' }"
        class="box"
      >
        <a href="javascript:;">{{ item }}</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ScrollArea',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.adaptiveWidth = document.body.clientWidth <= 1440 ? 205 : 285;
    });
  },
  data() {
    return {
      list: [
        '区域滚动1',
        '区域滚动2',
        '区域滚动3',
        '区域滚动4',
        '区域滚动5',
        '区域滚动6',
        '区域滚动7',
        '区域滚动8',
        '区域滚动9'
      ],
      translate: 0,
      adaptiveWidth: 285
    };
  },
  mounted() {
    // 监听 window.resize 事件
    window.addEventListener('resize', this.onResize.bind(this));
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    hander(type) {
      let wrapWidth = this.$refs.wrap.offsetWidth;
      let maxWidth = this.list.length * this.adaptiveWidth;
      if (type === 'left') {
        this.translate =
          this.translate > this.adaptiveWidth * 2
            ? this.translate - this.adaptiveWidth
            : 0;
      } else {
        this.translate =
          maxWidth - wrapWidth - this.translate < this.adaptiveWidth * 2
            ? maxWidth - wrapWidth - 14
            : this.translate + this.adaptiveWidth;
      }
    },
    onResize() {
      this.adaptiveWidth = document.body.clientWidth <= 1440 ? 205 : 285;
    }
  }
};
</script>
<style scoped lang="less">
.wrap {
  height: 120px;
  position: relative;
  overflow: hidden;
  .arrow {
    width: 30px;
    height: 30px;
    position: absolute;
    /* calc() 里面的表达式 运算符前后要有空格 */
    top: calc(50% - 15px);
    background: #ededed;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0.5;
    z-index: 999;
    &.left {
      left: 10px;
    }
    &.right {
      right: 10px;
    }
    i {
      padding: 5px;
      display: inline-block;
      position: absolute;
      top: 10px;
      border: solid black;
      border-width: 0 1px 1px 0;
      &.left {
        left: 11px;
        transform: rotate(135deg);
        -webkit-transform: rotate(135deg);
      }
      &.right {
        right: 8px;
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
      }
    }
  }
  .boxes {
    /* 区域滚动 white-space: nowrap; */
    white-space: nowrap;
    transition: all 0.2s;
    .box {
      height: 120px;
      display: inline-block;
      margin-right: 15px;
      background: pink;
      /* 调试样式的时候，border 的 1px 影响还是很大的 */
    }
  }
}
</style>
