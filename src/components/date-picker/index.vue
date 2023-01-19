<template>
  <div>
    起始日期：
    <el-date-picker
      v-model="startTime"
      align="right"
      type="date"
      placeholder="选择日期"
      :clearable="true"
      :format="format"
      :picker-options="startOptions"
      @change="startChange"
    ></el-date-picker>
    结束日期：
    <el-date-picker
      v-model="endTime"
      align="right"
      type="date"
      placeholder="选择日期"
      :clearable="true"
      :format="format"
      :picker-options="endOptions"
      @change="endChange"
    ></el-date-picker>
    <el-button @click="search">查询</el-button>
  </div>
</template>
<script>
export default {
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
    },
    isOverOneYear() {
      const diffDays = (date, otherDate) =>
        Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
      const { startTime, endTime } = this;
      return startTime && endTime && diffDays(startTime, endTime) > 365;
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
    startChange() {
      if (this.isOverOneYear) {
        this.$message({
          message: '时间范围超过1年了，请重新选择结束日期！',
          type: 'warning'
        });
        this.endTime = '';
      }
    },
    endChange() {
      if (this.isOverOneYear) {
        this.$message({
          message: '时间范围超过1年了，请重新选择起始日期！',
          type: 'warning'
        });
        this.startTime = '';
      }
    },
    search() {
      const { startTime, endTime } = this;
      if (!startTime || !endTime) {
        this.init();
      }
      this.$emit('input', { startTime, endTime });
      this.$emit('search', { startTime, endTime });
    }
  }
};
</script>
<style scoped lang="scss"></style>
