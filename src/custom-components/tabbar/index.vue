<template>
  <div class="tabbar">
    <router-link to="/home"><span>首页</span><i>图片</i></router-link>
    <router-link to="/home"><span>布局</span><i>图片</i></router-link>
    <router-link to="/comp"><span>Vue组件</span><i>图片</i></router-link>
    <router-link to="/demo"><span>组件demo</span><i>图片</i></router-link>
  </div>
</template>
<script>
export default {
  name: 'Tabbar'
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.tabbar {
  width: 100%;
  height: 50px;
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #000;
  a {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
    color: #000;
  }
}
.is_active {
  background: #d9d9d9;
  color: #a00 !important;
}
</style>
