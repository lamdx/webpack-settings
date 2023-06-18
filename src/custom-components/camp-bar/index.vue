<template>
  <div class="flex">
    <div
      :class="{ 'is-radius': isRaidus }"
      :style="setWidth('left')"
      class="bar-item bar-left"
    ></div>
    <div
      :class="{ 'is-radius': isRaidus }"
      :style="setWidth('right')"
      class="bar-item bar-right"
    ></div>
  </div>
</template>

<script>
const campList = [{ votes: 50 }, { votes: 5 }];

export default {
  name: 'CampBar',
  props: {
    campList: {
      type: Array,
      default: () => campList
    }
  },
  computed: {
    leftObj() {
      return this.campList[0] || {};
    },
    rightObj() {
      return this.campList[1] || {};
    },
    percentLeft() {
      const { leftObj, rightObj } = this;
      const left = leftObj.votes;
      const right = rightObj.votes;
      const sum = left + right;
      let rate = (left / sum) * 100;
      // fix rate 不足 1 的情况
      return (rate = rate > 50 ? Math.floor(rate) : Math.ceil(rate));
    },
    percentRight() {
      return 100 - this.percentLeft;
    },
    isRaidus() {
      // true 为圆角
      const { percentLeft, percentRight } = this;
      return (percentLeft && !percentRight) || (!percentLeft && percentRight);
    }
  },
  methods: {
    setWidth(type) {
      const { percentLeft, percentRight, isRaidus } = this;
      let width = type === 'left' ? percentLeft : percentRight;
      let diplay = 'block';
      if (!isRaidus) {
        if (width < 4) {
          // 低于 4% 样式显示 4%
          width = 4;
        }
        // 同理
        if (width > 96) {
          width = 96;
        }
        if (!width) {
          diplay = 'none';
        }
      }
      width += '%';
      return { diplay, width };
    }
  }
};
</script>

<style lang="less" scoped>
// 声明变量的值尽量不要带 '' 例如 @trans: 'transparent'; 因为这样编译后的 css 样式会不生效
@trans: transparent;
@f8: #f8f8f8;
@barHeight: 24px;
@barPadding: 8px;
// 方法/混入
.setBar(@c: @trans, @sc: @trans, @t: 12px, @r: 12px, @b: 12px, @l: 12px) {
  border-radius: @t @r @b @l;
  background: linear-gradient(to right, @c 0%, @sc 100%);
  &:not(.is-radius):after {
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    // 条件判断 & when(@l=12px){}
    & when(@l=12px) {
      right: 2px;
      border-left: @barPadding solid @sc;
      border-bottom: @barHeight solid @f8;
    }
    & when(@r=12px) {
      left: -2px;
      border-right: @barPadding solid @c;
      border-top: @barHeight solid @f8;
    }
  }
}
.bar-item {
  position: relative;
  height: @barHeight;
  &.bar-left {
    .setBar(#ff9247, #ff2927, 12px, 0, 0, 12px);
  }
  &.bar-right {
    .setBar(#1b4dc6, #68b1e8, 0, 12px, 12px, 0);
  }
  &.is-radius {
    border-radius: 12px;
  }
}

.flex {
  display: flex;
}
</style>
