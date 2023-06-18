<template>
  <!-- 单选弹框 -->
  <div class="popup_radio">
    <!-- 弹出层 -->
    <div class="pop">
      <div v-if="showScreen" class="popup_bg" @click="closeFun"></div>
      <div
        :class="{ open: showScreen }"
        class="popup_content"
        @click="getselectval"
      >
        <slot name="popup_header"></slot>
        <p v-for="(item, i) in options" :key="i" :data-index="i">
          <span>{{ item.value }}</span>
          <span v-if="value === item.key" class="right">✔</span>
        </p>
      </div>
    </div>
    <!-- 展示区 -->
    <div class="popup_trigger" @click="showScreen = true">
      <p>
        <span>{{ title }}</span>
        <span :class="{ unselected: true, selected: value !== '' }">
          {{ format(value) }}
        </span>
      </p>
    </div>
    <!-- 父组件 template -->
    <!-- <popup_radio
      :title="'质押保险办理状态'"
      :placeholder="'请选择'"
      v-model="list[0].key"
      :options="options"
      @onhide="updateInfo"
    >
      <p slot="popup_header" class="popup_header">
        请选择质押保险办理状态
      </p>
    </popup_radio> -->
  </div>
</template>
<script>
export default {
  name: 'PopupRadio',
  props: {
    title: { type: String, default: '' },
    value: { type: String, default: '' },
    placeholder: { type: String, default: '请选择' },
    options: {
      type: Array,
      default: () => [
        { key: '01', value: '无需办理' },
        { key: '02', value: '办理中' },
        { key: '03', value: '待办中' },
        { key: '04', value: '已办理' }
      ]
    }
  },
  data() {
    return {
      showScreen: false
    };
  },
  methods: {
    format(value) {
      if (value === '') {
        return this.placeholder;
      }
      let temp = this.options.filter(item => item.key === value);
      return temp[0].value;
    },
    getselectval(e) {
      if (e.target.dataset.index && e.target.nodeName === 'P') {
        // 修改父组件 v-model 的值
        console.log(e.target.dataset.index);
        this.$emit('input', this.options[e.target.dataset.index].key);
        // 这里可以进行校验 和发起异步
        this.$emit('onhide');
        this.closeFun();
      }
    },
    closeFun() {
      this.showScreen = false;
    }
  }
};
</script>
<style scoped lang="less">
.popup_radio {
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
  word-break: break-all;
  .pop {
    .popup_bg {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1100;
      background: rgba(0, 0, 0, 0.5);
    }
    .popup_content {
      width: 100%;
      // height: 50%;
      // overflow-y: scroll;
      position: fixed;
      left: 0;
      bottom: -100%;
      background: #fff;
      z-index: 1200;
      transition: all 0.35s ease;
      &.open {
        bottom: 0;
      }
      p {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #ededed;
        margin: 0 15px;
        padding: 12px 0;
        &.popup_header {
          display: block;
          margin: 0;
          padding: 12px 0;
          background: #ededed;
          line-height: 22px;
          font-size: 18px;
          text-align: center;
        }
        &:last-child {
          border: 0;
        }
        span {
          width: 300px;
          &.right {
            width: 40px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            color: #ff7635;
            font-size: 18px;
          }
        }
      }
    }
  }
  .popup_trigger {
    padding: 0 15px;
    border-bottom: 1px solid #ededed;
    p {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      span {
        width: 60%;
        color: #999;
        &.unselected {
          width: 40%;
          padding: 0 15px;
          position: relative;
          text-align: right;
          &::after {
            content: '';
            width: 10px;
            height: 10px;
            display: inline-block;
            position: absolute;
            top: 50%;
            right: 0;
            border-width: 2px 2px 0 0;
            border-style: solid;
            border-color: #ccc;
            transform: translateY(-50%) rotate(45deg);
          }
        }
        &.selected {
          color: #333;
        }
      }
    }
  }
}
</style>
