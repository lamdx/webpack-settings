<template>
  <div id="__mytabs__">
    <div v-if="showArrow" class="arrow left" @click="hander('left')">
      <i class="left"></i>
    </div>
    <div v-if="showArrow" class="arrow right" @click="hander('right')">
      <i class="right"></i>
    </div>
    <div ref="wrap" class="wrap">
      <div
        ref="tabs"
        :style="{
          transition: 'transform 0.5s',
          transform: 'translateX(-' + translate + 'px)'
        }"
        class="tabs"
      >
        <!-- 标签页标题 -->
        <div
          v-for="(item, index) in navList"
          :key="item.name"
          :class="tabCls(item)"
          @click="emitChange(index)"
        >
          <Render
            v-if="item.labelType === 'function'"
            :render="item.label"
          ></Render>
          <template v-else>{{ item.label }}</template>
        </div>
      </div>
    </div>
    <div class="tabs__content">
      <!-- slot放置 pane 组件内容 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Render from './render.js';
export default {
  name: 'MyTabs',
  components: { Render },
  props: {
    value: [String, Number]
    // required: true
  },
  data() {
    return {
      currentValue: this.value,
      navList: [],
      translate: 0,
      showArrow: false,
      maxWidth: 0,
      wrapWidth: 0
    };
  },
  watch: {
    value: {
      handler: function (val) {
        this.currentValue = val;
        this.scrollIntoView();
        this.updateStatus();
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.onResize();
    });
    // 监听 window.resize 事件
    window.addEventListener('resize', this.resizeThrottle);
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeThrottle);
  },
  methods: {
    throttle(method, context) {
      clearTimeout(method.tId);
      method.tId = setTimeout(function () {
        method.call(context);
      }, 100);
    },
    onResize() {
      this.wrapWidth = this.$refs.wrap.offsetWidth;
      this.maxWidth = 0;
      let domArr = document.getElementsByClassName('tabs__tab');
      for (let index = 0; index < domArr.length; index++) {
        const element = domArr[index];
        // 16 边距
        this.maxWidth += element.offsetWidth + 16;
      }
      if (this.maxWidth > this.wrapWidth) {
        this.showArrow = true;
      } else {
        this.showArrow = false;
      }
    },
    resizeThrottle() {
      this.throttle(this.onResize);
    },
    hander(type) {
      if (type === 'left') {
        this.translate =
          this.translate > this.wrapWidth ? this.translate - this.wrapWidth : 0;
      } else {
        this.translate =
          this.maxWidth - this.wrapWidth - this.translate < this.wrapWidth
            ? this.maxWidth - this.wrapWidth
            : this.translate + this.wrapWidth;
      }
      console.log(this.translate, 'this.translate');
    },
    tabCls(item) {
      return [
        'tabs__tab',
        {
          tabs__tab__active: item.name === this.currentValue
        }
      ];
    },
    getTabs() {
      // 获取 pane
      let tabPanes = [];
      tabPanes = this.$children.filter(
        item => item.$options.name === 'MyTabPane'
      );
      // 可设置 count，使其从小到大排序 这里排序在低版本浏览器会有问题，导致乱序
      tabPanes.sort((a, b) => {
        if (a.count && b.count) {
          return a.count > b.count ? 1 : -1;
        }
      });
      return tabPanes;
    },
    updateNav() {
      // 获取 pane 标题 name，并放置到 navList 数组中
      this.navList = [];
      this.getTabs().forEach((pane, index) => {
        this.navList.push({
          labelType: typeof pane.label,
          label: pane.label,
          name: pane.name || index,
          count: pane.count
        });
        if (!pane.name) pane.name = index;
        if (index === 0) {
          if (!this.currentValue) this.currentValue = pane.name || index;
        }
      });
      this.updateStatus();
    },
    updateStatus() {
      let tabs = this.getTabs();
      tabs.forEach(tab => {
        let temp = tab.name === this.currentValue;
        tab.show = temp;
      });
    },
    emitChange(index) {
      let nav = this.navList[index];
      let name = nav.name;
      if (this.currentValue === name) return;
      this.currentValue = name;
      this.$emit('input', name);
      this.$emit('on-click', name);
    },
    scrollIntoView() {
      setTimeout(() => {
        let dom = document.getElementsByClassName('tabs__tab__active')[0];
        // 位移比率
        let rate = Math.floor(dom.offsetLeft / this.wrapWidth);
        // 位移量
        this.translate = this.wrapWidth * rate;
        // 屏幕右边最后一个 pane 被遮挡的位移偏差
        if (dom.offsetWidth + dom.offsetLeft > this.wrapWidth * (rate || 1)) {
          this.translate += dom.offsetWidth;
        }
        // 屏幕左边边第一个 pane 被遮挡的位移偏差
        if (dom.offsetLeft < this.translate) {
          this.translate -= dom.offsetWidth;
        }
        // 点击第一个 Pane 位移校正
        if (dom.offsetLeft === 0) {
          this.translate = 0;
        }
        // 防止点击最后一屏的第一个 Pane 倒退
        if (dom.offsetLeft > this.maxWidth - this.wrapWidth) {
          this.translate = this.maxWidth - this.wrapWidth;
        }
      }, 100);
    }
  }
};
</script>

<style scoped lang="less">
[v-cloak] {
  display: none;
}
#__mytabs__ {
  position: relative;
  .arrow {
    width: 22px;
    height: 56px;
    position: absolute;
    background: #fff;
    opacity: 0.5;
    cursor: pointer;
    z-index: 999;
    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }
    i {
      display: inline-block;
      padding: 5px;
      position: absolute;
      top: calc(50% - 5px);
      border: solid black;
      border-width: 0 1px 1px 0;
      &.left {
        transform: rotate(135deg);
        -webkit-transform: rotate(135deg);
      }
      &.right {
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
      }
    }
  }
  .wrap {
    font-size: 14px;
    color: #657180;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid #d7dde4;
    .tabs {
      // 浮动布局 父元素设置 float，子元素可以撑开父元素的宽度
      float: left;
      white-space: nowrap;
      .tabs__tab {
        margin: 0 8px;
        padding: 14px 16px;
        display: inline-block;
        box-sizing: border-box;
        // vertical-align: top;
        background: #fff;
        cursor: pointer;
        line-height: 24px;
        font-size: 16px;
        &.tabs__tab__active {
          color: #3399ff;
          border-bottom: 3px solid #3399ff;
        }
        sup {
          padding: 1px 5px;
          background: red;
          // 想设置圆柱体，border-radius 不能用百分比，必须用 px
          border-radius: 12px;
          font-size: 12px;
          color: #fff;
        }
      }
    }
  }
  .tabs__content {
    padding: 8px 0;
  }
}
</style>
