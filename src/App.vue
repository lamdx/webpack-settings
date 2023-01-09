<template>
  <div>
    <!-- 缓存页面并没有生效，通过 v-if 来判断是否生成 keep-alive，当列表页面 A 符合条件时，内存缓存了组件状态。当跳转到详情页 B 时，不符合条件，由于 v-if 是挂载到 keep-alive 标签上，会把之前 keep-alive 的列表页面 A进行销毁，再次进入到 A会重新创建。 -->
    <!-- <keep-alive v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    <!-- 正确写法：v-if 挂载到 router-view 上面） -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style lang="css">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  margin: 0;
  padding: 0;
}
ul,
li {
  list-style: none;
}
a {
  text-decoration: none;
}
</style>
