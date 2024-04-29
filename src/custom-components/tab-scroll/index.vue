<template>
  <div class="tab-scroll" ref="scrollWiew">
    <div
      ref="titles"
      class="pd-h-8"
      v-for="(item, i) in list"
      :key="i"
      @click="changeIndex(item, i)"
    >
      <div class="tab-item" :class="{ active: i === index }">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { scrollLeftTo } from './animation';

const list = [
  { name: '担保品买入', type: '01' },
  { name: '融资买入', type: '03' },
  { name: '买券还券', type: '05' },
  { name: '担保品卖出', type: '02' },
  { name: '融券卖出', type: '04' },
  { name: '卖券还款', type: '06' }
];

export default {
  name: 'TabScroll',
  props: {
    value: { type: String, default: '01' }
  },
  data() {
    return {
      index: 0,
      list
    };
  },
  watch: {
    value: {
      handler() {
        this.init();
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const index = this.list.findIndex(item => item.type === this.value);
      this.index = index || 0;
      this.scrollTo(index);
    },
    changeIndex(item, i) {
      this.$emit('input', item.type);
      this.index = i;
      this.$nextTick(() => {
        this.init();
      });
    },
    // 切换标签自动居中
    scrollTo(index) {
      const { scrollWiew, titles } = this.$refs;
      const duration = 0.3;
      const title = titles[index];
      const to =
        title.offsetLeft - (scrollWiew.offsetWidth - title.offsetWidth) / 2;
      /**
       * @param {el} scrollWiew 视图容器
       * @param { Number } to 标签距视图容器中心的距离
       * @param { Number } duration 动画延迟时间
       */
      scrollLeftTo(scrollWiew, to, duration);
    }
  }
};
</script>

<style lang="scss">
.tab-scroll {
  cursor: pointer;
  display: flex;
  padding: 24px 32px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .pd-h-8 {
    padding: 0 8px;
  }
  .tab-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 56px;
    border-radius: 40px;
    white-space: nowrap;
    background: #f8f8f8;
    padding: 0 24px;
  }
  .active {
    color: #ffffff;
    background: #e93a40 !important;
  }
}
</style>
