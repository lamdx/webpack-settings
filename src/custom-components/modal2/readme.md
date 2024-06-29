## 使用

1.使用插件
在你的主应用文件中注册插件，例如在 main.js 中：

```js
import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

import ModalPlugin from '@/custom-components/modal2/index.js';
Vue.use(ModalPlugin);

new Vue({
  render: h => h(App)
}).$mount('#app');
```

2.在父组件中使用弹框组件
在父组件中使用 v-model 来控制弹框：

```vue
<template>
  <div>
    <button @click="showModal = true">Open Modal via v-model</button>
    <Modal v-model="showModal" :options="modalOptions">
      <template v-slot:header>
        <h3>Custom Header</h3>
      </template>
      <template>
        <p>Custom Body Content</p>
      </template>
      <template v-slot:footer>
        <button @click="handleConfirm">Confirm</button>
        <button @click="handleCancel">Cancel</button>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/custom-components/modal2/index.vue';

export default {
  components: {
    Modal
  },
  data() {
    return {
      showModal: false,
      modalOptions: {
        header: 'Header via v-model',
        body: 'Body via v-model',
        footer: 'Footer via v-model',
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      }
    };
  },
  methods: {
    handleConfirm() {
      console.log('Confirmed!');
      this.showModal = false;
    },
    handleCancel() {
      console.log('Cancelled!');
      this.showModal = false;
    }
  }
};
</script>
```

3.在组件中通过 JavaScript 调用弹框
通过 this.$modal.open() 在组件中调用弹框：

```vue
<template>
  <div>
    <button @click="openModal">Open Modal via js</button>
  </div>
</template>

<script>
export default {
  methods: {
    openModal() {
      this.$modal.open({
        header: 'Header via JS',
        body: 'Body via JS',
        footer: 'Footer via JS',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: this.handleConfirm,
        onCancel: this.handleCancel
      });
    },
    handleConfirm() {
      console.log('Confirmed via JS!');
    },
    handleCancel() {
      console.log('Cancelled via JS!');
    }
  }
};
</script>
```
