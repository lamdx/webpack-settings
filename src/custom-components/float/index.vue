<template>
  <div class="container" :class="{ auto: isExpanded }">
    <div class="more" @click="toggle">{{ btnText }}</div>
    <div class="more" v-if="!isExpanded">{{ ellipsis }}</div>
    <div class="content" :class="{ auto: isExpanded }" :style="contentStyle">
      {{ content }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'Float',
  data() {
    return {
      btn: '收起',
      ellipsis: '...',
      content:
        '在继续阅读下文之前，你可以先缓一缓。尝',
      isExpanded: false,
      contentStyle: {}
    };
  },
  computed: {
    btnText() {
      return this.isExpanded ? '收起' : '展开';
    }
  },
  mounted() {},
  methods: {
    initData() {},
    toggle() {
      this.isExpanded = !this.isExpanded;
      this.$nextTick(() => {
        const content = document.querySelector('.content');
        const container = document.querySelector('.container');
        const lineHight = 25;
        console.log('content.offsetHeight ===', content.offsetHeight);
        console.log('container.offsetHeight ===', container.offsetHeight);
        const style = document.createElement('style');
        const height = content.offsetHeight;
        const isOdd = (height / lineHight) % 2 === 0;
        console.log('isOdd ===', isOdd);

        const beforeHeight = `${isOdd ? height - 25 : height}px`;
        const mt = `-${isOdd ? height - 25 : height}px`;
        style.textContent = `
          .container::before {
            height: ${this.isExpanded ? beforeHeight : '0px'} !important;
          }
        `;

        document.head.append(style);
        this.contentStyle = this.isExpanded ? { 'margin-top': `${mt}` } : {};
      });
    }
  }
};
</script>
<style lang="less">
.container {
  // border: 1px solid #000;
  // padding: 5px;
  background: #ccc;
  height: 25px;
}

// 将内容挤下去
.container::before {
  content: ' ';
  display: block;
  height: 0px;
  // height: 250px;
}

.content {
  height: 25px;
  line-height: 25px;
  background: #eee;
  // margin-top: -250px;
  overflow: hidden;
}

.more {
  float: right;
  line-height: 25px;
  font-size: 16px;
}

.auto {
  height: auto;
}
</style>
