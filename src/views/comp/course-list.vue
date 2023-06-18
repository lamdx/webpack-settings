<template>
  <div>
    <!-- 条件渲染 -->
    <p v-if="courses.length == 0">没有任何课程信息</p>
    <!-- 列表渲染 -->
    <ul>
      <!-- class绑定 -->
      <li
        v-for="(item, i) in courses"
        :key="i"
        :class="{ active: selectedCourse === item }"
        @click="selectedCourse = item"
      >
        {{ item }}
      </li>
      <!-- style绑定 -->
      <!-- <li
        v-for="(item, i) in courses"
        :key="i"
        :style="{
          backgroundColor: selectedCourse === item ? '#ddd' : 'transparent'
        }"
        @click="selectedCourse = item"
      >
        {{ item }}
      </li> -->
    </ul>
  </div>
</template>
<script>
export default {
  name: 'CourseList',
  props: {
    // 新增课程时也要访问 courses，因此作为属性传递
    courses: { type: Array, default: () => [] }
  },
  data() {
    return {
      // 改状态属于 course-list内部状态，因此作为数据
      selectedCourse: ''
    };
  }
};
</script>
<style scoped lang="less">
.active {
  background: red;
}
</style>
