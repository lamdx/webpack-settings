<template>
  <div class="header">
    {{ title }}
    <i v-if="flag" class="left" @click="goback"></i>
  </div>
</template>
<script>
export default {
  name: 'MyHeader',
  props: {
    title: { type: String, default: '' },
    flag: { type: Boolean, default: true }
  },
  methods: {
    goback() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped lang="less">
.header {
  width: 100%;
  height: 50px;
  position: relative;
  background: #fff;
  border-bottom: 1px solid #000;
  text-align: center;
  line-height: 50px;
  font-size: 16px;
  font-weight: bold;
  i {
    display: inline-block;
    padding: 5px;
    position: absolute;
    left: 15px;
    top: 20px;
    border: solid black;
    border-width: 0px 1px 1px 0;
  }
  .right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }

  .left {
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
  }
}
</style>
