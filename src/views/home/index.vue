<template>
  <div class="pd-32">
    <!-- <img :src="getImage('logo')" alt="" /> -->
    <br />
    <router-link to="/demo">demo</router-link>
    <router-link to="/custom-demo">custom-demo</router-link>
    <input type="button" value="减" @click="minus" />
    <input id="num" v-model="num" type="text" />
    {{ num }}
    <input type="button" value="加" @click="add" />

    <button @click="showDialog = true">Open Dialog via v-model</button>
    <button @click="openDialog">Open Dialog via v-model</button>
    <DDialog v-model="showDialog" :options="dialogOptions">
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
    </DDialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DDialog from '@/custom-components/modal/index.vue';
export default {
  name: 'Home',
  components: {
    DDialog
  },
  beforeRouteEnter(to, from, next) {
    console.log('beforeRouteEnter ===');
    console.log('to ===', to);
    console.log('from ===', from);
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('beforeRouteLeave ===');
    console.log('to ===', to);
    console.log('from ===', from);
    next();
  },
  data() {
    return {
      showDialog: false,
      dialogOptions: {
        header: 'Header via v-model',
        body: 'Body via v-model',
        footer: 'Footer via v-model',
        confirmText: 'Confirm',
        cancelText: 'Cancel'
        // onConfirm: this.handleConfirm,
        // onCancel: this.handleCancel
      }
    };
  },
  computed: {
    ...mapState('app', ['num'])
  },
  watch: {
    $route: {
      handler() {
        console.log('route 123 ===', 123);
      }
      // immediate: true
    }
  },
  created() {
    // 传入对象参数
    // this.$dialog({
    //   title: '提示',
    //   content: '这是一段提示信息1',
    //   left_buttton: '取消',
    //   right_buttton: '确定',
    //   onOk: () => {
    //     console.log('ok');
    //   },
    //   onCancel: () => {
    //     console.log('cancel');
    //   }
    // });

    // 传入字符串参数（该参数会做为参数中 content 属性的值，回调函数为空）
    // this.$dialog('这是一段提示信息2');

    console.log('created ===');
    // 添加 promise 代码
    const promise = Promise.resolve();
    promise.then(() => {
      console.log('hello promise');
    });
    console.log('process.env ===', process.env);
  },
  mounted() {
    console.log('mounted ===');
  },
  activated() {
    console.log('activated ===');
  },
  deactivated() {
    console.log('deactivated ===');
  },
  methods: {
    openDialog() {
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
      console.log('Confirmed!');
      // this.showDialog = false;
    },
    handleCancel() {
      console.log('Cancelled!');
      // this.showDialog = false;
    },
    ...mapMutations('app', ['setNum']),
    minus() {
      const res = this.num - 1;
      this.setNum(res);
    },
    add() {
      const res = this.num + 1;
      this.setNum(res);
    },
    getImage(bankType = 'logo') {
      const { $banksMap } = this;
      console.log('$banksMap ===', $banksMap);
      return require(`@/assets/images/bank/${$banksMap[bankType]}`);
    }
  }
};
</script>
<style scoped lang="scss"></style>
