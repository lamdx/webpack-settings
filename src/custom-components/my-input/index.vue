<template>
  <div class="my-input">
    <div class="flex-space-between">
      <div>{{ label }}</div>
      <div class="step" :class="{ disabled: inputNumberDisabled }">
        <transition name="fade">
          <div class="tips" v-show="timeId && currentValue">
            <div v-html="tooltip && tooltip()"></div>
            <slot name="transition"></slot>
          </div>
        </transition>
        <div class="sub" :class="{ disabled: minDisabled }" @click="decrease">
          <div class="minus"></div>
        </div>

        <input
          :value="displayValue"
          :placeholder="placeholder"
          :style="[cptColorVar]"
          align="center"
          maxlength="11"
          @blur="handleBlur"
          @input="handleInput"
          @focus="handleFocus"
        />
        <div v-if="isFocus && displayValue" class="close" @click="clearContent">
          x
        </div>

        <div class="add" :class="{ disabled: maxDisabled }" @click="increase">
          +
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'MyInput',
  props: {
    label: { type: String, default: '' },
    placeholder: { type: String, default: '请输入' },
    step: { type: Number, default: 1 },
    addStep: { type: Number }, // 允许加减步长不一致
    subtractStep: { type: Number }, // 允许加减步长不一致
    stepStrictly: { type: Boolean, default: false },
    max: { type: Number, default: Infinity },
    min: { type: Number, default: -Infinity },
    value: {},
    disabled: Boolean,
    // 设置 precision 属性可以控制数值精度，接收一个 Number
    precision: {
      type: Number,
      validator(val) {
        return val >= 0 && val === parseInt(val, 10);
      }
    },
    format: { type: [Boolean, Function], default: false },
    tooltip: { type: Function },
    validator: { type: Function, default: () => {} },
    initVal: {
      type: Number,
      validator(val) {
        return val >= 0;
      }
    },
    color: { type: String, default: '' },
    otherAnimation: {}
  },
  data() {
    return {
      isFocus: false,
      currentValue: 0,
      userInput: null,
      timeId: null
    };
  },
  computed: {
    cptColorVar() {
      const map = {
        'txt-up': '#E93a40',
        'txt-down': '#18a85b'
      };
      return {
        '--color': map[this.color]
      };
    },
    minDisabled() {
      // return this._decrease(this.value, this.step) < this.min
      return false;
    },
    maxDisabled() {
      if (this.initVal && !this.value) {
        return this.initVal > this.max;
      } else {
        return this._increase(this.value, this.step) > this.max;
      }
    },
    numPrecision() {
      const { value, step, getPrecision, precision } = this;
      const stepPrecision = getPrecision(step);
      if (precision !== undefined) {
        if (stepPrecision > precision) {
          console.warn('precision 的值不能小于 step 的小数位数');
        }
        return precision;
      } else {
        return Math.max(getPrecision(value), stepPrecision);
      }
    },
    inputNumberDisabled() {
      return this.disabled;
    },
    displayValue() {
      if (this.userInput !== null) {
        return this.userInput;
      }

      let currentValue = this.currentValue;
      if (currentValue === 0) return '';

      if (typeof currentValue === 'number') {
        if (this.stepStrictly) {
          const stepPrecision = this.getPrecision(this.step);
          const precisionFactor = Math.pow(10, stepPrecision);
          currentValue =
            (Math.round(currentValue / this.step) *
              precisionFactor *
              this.step) /
            precisionFactor;
        }

        if (this.precision !== undefined) {
          currentValue = currentValue.toFixed(this.precision);
        }

        if (!this.userInput && this.format) {
          if (typeof this.format === 'function') {
            currentValue = this.format(currentValue);
          } else {
            // 默认格式化
            currentValue = `${currentValue > 0 ? '+' : ''}${currentValue}%`;
          }
        }
      }

      return currentValue;
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        let newVal = value === undefined ? value : Number(value);
        if (newVal !== undefined) {
          if (isNaN(newVal)) {
            return;
          }

          if (this.stepStrictly) {
            const stepPrecision = this.getPrecision(this.step);
            const precisionFactor = Math.pow(10, stepPrecision);
            newVal =
              (Math.round(newVal / this.step) * precisionFactor * this.step) /
              precisionFactor;
          }

          if (this.precision !== undefined) {
            newVal = this.toPrecision(newVal, this.precision);
          }
        }
        if (newVal >= this.max) newVal = this.max;
        if (newVal <= this.min) newVal = this.min;
        this.currentValue = newVal;
        this.userInput = null;
        this.animation();
        this.$emit('input', newVal);
      }
    },
    otherAnimation(val) {
      val && this.animation();
    }
  },
  methods: {
    toPrecision(num, precision) {
      if (precision === undefined) precision = this.numPrecision;
      return parseFloat(
        Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
      );
    },
    getPrecision(value) {
      if (value === undefined) return 0;
      const valueString = value.toString();
      const dotPosition = valueString.indexOf('.');
      let precision = 0;
      if (dotPosition !== -1) {
        precision = valueString.length - dotPosition - 1;
      }
      return precision;
    },
    _increase(val, step) {
      if (typeof val !== 'number' && val !== undefined)
        return this.currentValue;

      const precisionFactor = Math.pow(10, this.numPrecision);

      return this.toPrecision(
        (precisionFactor * val + precisionFactor * step) / precisionFactor
      );
    },
    _decrease(val, step) {
      if (typeof val !== 'number' && val !== undefined)
        return this.currentValue;
      const precisionFactor = Math.pow(10, this.numPrecision);

      return this.toPrecision(
        (precisionFactor * val - precisionFactor * step) / precisionFactor
      );
    },
    increase() {
      if (this.userInput) return;
      if (this.inputNumberDisabled || this.maxDisabled) return;
      const value = this.currentValue || 0;
      const { addStep, step } = this;
      const newVal = this._increase(value, addStep ? addStep : step);
      const initVal = this.initVal && !value ? this.initVal : newVal;
      this.setCurrentValue(initVal);
    },
    decrease() {
      if (this.userInput) return;
      if (this.inputNumberDisabled || this.minDisabled) return;
      const value = this.currentValue || 0;
      const { subtractStep, step } = this;
      const newVal = this._decrease(value, subtractStep ? subtractStep : step);
      this.setCurrentValue(newVal);
    },
    setCurrentValue(newVal) {
      // const oldVal = this.currentValue
      if (typeof newVal === 'number' && this.precision !== undefined) {
        newVal = this.toPrecision(newVal, this.precision);
      }
      if (newVal >= this.max) newVal = this.max;
      if (newVal <= this.min) newVal = this.min;
      // if (oldVal === newVal) return
      this.userInput = null;
      this.$emit('input', newVal);
      // this.$emit('change', newVal, oldVal)
      this.currentValue = newVal;
      // this.animation()
      this.validator(newVal);
    },
    handleFocus(event) {
      this.isFocus = true;
      this.userInput = this.currentValue ? this.currentValue : null;
      this.$emit('focus', event);
    },
    handleBlur(event) {
      this.handleInputChange();
      setTimeout(() => {
        this.isFocus = false;
      }, 200);
      this.$emit('blur', event);
    },
    handleInput(event) {
      const value = event.target.value;
      this.userInput = value;
      if (value === '') {
        // 如果直接清空 input 所有数据
        this.handleInputChange();
      }
    },
    handleInputChange() {
      const newVal = this.userInput === '' ? undefined : Number(this.userInput);
      if (!isNaN(newVal) || this.userInput === '') {
        this.setCurrentValue(newVal);
      }
      this.userInput = null;
    },
    animation() {
      if (this.tooltip) {
        clearTimeout(this.timeId);
        this.timeId = setTimeout(() => {
          clearTimeout(this.timeId);
          this.timeId = null;
        }, 1500);
      }
    },
    clearContent() {
      this.setCurrentValue('');
    }
  }
};
</script>

<style lang="scss">
.my-input {
  $color: #e93a40;
  $bg-color: #feeeee;

  .step {
    display: flex;
    width: 472px;
    position: relative;
    border: 1px solid $color;
    border-radius: 8px;
    transform: rotateZ(360deg);

    input {
      flex: 1;
      text-align: center;
      padding: 0 16px;
      border: none;
      &:focus {
        outline: none; /* 移除默认的轮廓线 */
      }
      &::-webkit-input-placeholder {
        font-size: 16px;
        color: #ccc;
      }
    }
  }
  .add,
  .sub {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70px;
    height: 70px;
    cursor: pointer;
    user-select: none;
    color: $color;
    font-size: 50px;
    background: $bg-color;
  }
  .sub {
    border-right: 1px solid $color;
    border-radius: 8px 0 0 8px;
    .minus {
      width: 28px;
      height: 4px;
      background: $color;
      border-radius: 1px;
    }
  }
  .add {
    border-left: 1px solid $color;
    border-radius: 0 8px 8px 0;
  }

  .close {
    position: absolute;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 80px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    background: #eee;
    cursor: pointer;
  }
  .disabled {
    // background: #f5f5f5 !important;
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;
  }
  .tips {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    top: -40px;
    z-index: 1;
    padding: 4px 12px;
    transform: translateX(-50%);
    background: rgba($color: #222222, $alpha: 0.8);
    border-radius: 10px;
    color: #fff;
    white-space: nowrap;
    &::after {
      position: absolute;
      content: '';
      display: block;
      width: 0;
      height: 0;
      left: 50%;
      transform: translateX(-50%) translateY(-2%);
      bottom: -24px;
      border-top: 12px solid rgba($color: #222222, $alpha: 0.8);
      border-bottom: 12px solid transparent;
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
    }
  }
  .fade-enter-active {
    transition: all 0.1s;
  }
  .fade-leave-active {
    transition: all 0.1s;
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
}
</style>
