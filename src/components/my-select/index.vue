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
    requestMethod: { type: Function, default: () => Promise.resolve() },
    searchParams: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      svalue: '',
      opts: []
    };
  },
  created() {
    console.log('this.$attrs ===', this.$attrs);
    this.init();
  },
  methods: {
    init() {
      if (this.options.length) {
        this.opts = this.options;
        return;
      }
      this.requestMethod()
        .then(res => {
          this.opts = res?.data || [];
        })
        .catch(err => {
          console.log('err ===', err);
        });
    },
    change() {
      this.$emit('input', this.svalue);
    }
  }
};
</script>
<style scoped></style>
