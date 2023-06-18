<template>
  <div>
    <!-- 需要实现 input 的 :value和 @input -->
    <input :value="value" @input="onInput" @keydown.enter="addCourse" />
    <!-- <input :value="val" @change="onChange" @keydown.enter="addCourse" /> -->
    <button v-on:click="addCourse">新增课程</button>
  </div>
</template>
<script>
export default {
  name: 'AddCourse',
  // 接收父组件传递 value，不需要额外维护 course
  // v-model默认转换是: value 和 @input，如果想要修改这个行为，可以通过定义 model 选项
  // event 的值好像只能是 change
  // model: { prop: 'val', event: 'change' },
  // props: ['val'],
  props: ['value'],
  methods: {
    addCourse() {
      // 派发事件不再需要传递数据
      this.$emit('add-course');
    },
    onInput(e) {
      this.$emit('input', e.target.value);
    }
    // onChange(e) {
    //   this.$emit('change', e.target.value);
    // }
  }
};
</script>
<style scoped lang="less"></style>
