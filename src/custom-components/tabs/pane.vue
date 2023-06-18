<template>
  <div v-show="show" class="pane">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'MyTabPane',
  props: {
    name: { type: String, default: '' },
    label: { type: [String, Function], default: '' },
    count: { type: Number, default: 0 }
  },
  data() {
    return {
      show: true
    };
  },
  watch: {
    label() {
      this.updateNav();
    },
    name() {
      this.updateNav();
    }
  },
  mounted() {
    this.updateNav();
  },
  destroyed() {
    this.updateNav();
  },
  methods: {
    updateNav() {
      this.$parent.updateNav();
    }
  }
};
</script>
<style scoped>
.pane {
  min-height: 100px;
  background-color: red;
}
</style>
