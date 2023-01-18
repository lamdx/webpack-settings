<template>
  <div>
    起始日期：
    <el-date-picker
      v-model="startTime"
      :format="format"
      align="right"
      type="date"
      placeholder="选择日期"
      :picker-options="startOptions"
      :clearable="false"
    ></el-date-picker>
    结束日期：
    <el-date-picker
      v-model="endTime"
      :format="format"
      align="right"
      type="date"
      placeholder="选择日期"
      :picker-options="endOptions"
      :clearable="false"
    ></el-date-picker>
    <el-button @click="search">查询</el-button>
  </div>
</template>
<script>
export default {
  // TODO 查询限制选择时间范围 1 年
  name: 'DatePicker',
  props: {
    start: { type: Date },
    end: { type: Date },
    hasToday: { type: Boolean }
  },
  data() {
    return {
      format: 'yyyy-MM-dd',
      startTime: '',
      endTime: ''
    };
  },
  computed: {
    now() {
      return this.hasToday ? Date.now() : Date.now() - 3600 * 1000 * 24;
    },
    startOptions() {
      return {
        disabledDate: time => {
          const end = new Date(this.endTime).getTime();
          return time.getTime() > end || time.getTime > this.now;
        }
      };
    },
    endOptions() {
      return {
        disabledDate: time => {
          const start = new Date(this.startTime).getTime();
          return time.getTime() > this.now || time.getTime() < start;
        }
      };
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { start, end, now } = this;
      if (start && end) {
        this.startTime = start;
        this.endTime = end;
      } else {
        this.endTime = now;
        this.startTime = now - 3600 * 1000 * 24 * 30;
      }
    },
    search() {
      const { startTime, endTime } = this;
      this.$emit('input', { startTime, endTime });
      this.$emit('search', { startTime, endTime });
    }
  }
};
</script>
<style scoped lang="scss"></style>
