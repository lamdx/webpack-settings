<template>
  <el-select v-model="svalue" v-bind="$attrs" @change="change">
    <el-option
      v-for="item in opts"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    >
      <slot name="option" :item="item"></slot>
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: 'MySelect',
  props: {
    options: { type: Array, default: () => [] },
    req: { type: Function, default: () => {} },
    searchParams: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      svalue: '',
      opts: [
        {
          value: '1',
          label: '黄金糕'
        },
        {
          value: '2',
          label: '双皮奶'
        },
        {
          value: '3',
          label: '蚵仔煎',
          disabled: true
        },
        {
          value: '4',
          label: '龙须面'
        },
        {
          value: '5',
          label: '北京烤鸭'
        }
      ]
    };
  },
  watch: {},
  mounted() {
    this.init();
    console.log(this);
    console.log('this.$attrs ===', this.$attrs);
  },
  methods: {
    init() {
      if (this.options.length) {
        this.opts = this.options;
        return;
      } else {
        console.log(typeof this, 'this.requetMethod');
        // this.req()
        //   .then(res => {
        //     console.log('res ===', res);
        //     this.opts = res?.data || [];
        //   })
        //   .catch(err => {
        //     console.log('err ===', err);
        //   });
      }
    },
    change() {
      console.log(this.svalue);
      this.$emit('input', this.svalue);
    }
  }
};
</script>
<style scoped></style>
