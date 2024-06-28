<template>
  <el-drawer
    title="开通条件"
    :visible.sync="isShow"
    :direction="direction"
    @close="close"
  >
    <p v-for="(item, index) in list" :key="index">
      <span>{{ index + 1 }}</span>
      <span>、</span>
      <span class="link">{{ item.name }} > </span>
    </p>
    <el-button type="primary" @click="doSign">签署协议</el-button>
  </el-drawer>
</template>

<script>
const api = [false, true, true];

const isOpenAgreement = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (api[0]) {
        resolve({ code: 1, msg: 'isOpenAgreement true' });
      } else {
        resolve({ code: 0, msg: 'isOpenAgreement false' });
      }
    }, 200);
  });
};

const checkPermissions = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (api[1]) {
        resolve({
          code: 1,
          msg: 'checkPermissions success',
          list: [
            { name: '协议1', pdfUrl: 'https://www.baidu.com' },
            { name: '协议2', pdfUrl: 'https://www.baidu.com' }
          ]
        });
      } else {
        reject({ code: 0, msg: 'checkPermissions fail' });
      }
    }, 200);
  });

const openingAgreement = async () => {
  const res = await new Promise((resolve, reject) => {
    setTimeout(() => {
      if (api[2]) {
        resolve({ code: 1, msg: 'openingAgreement success' });
      } else {
        reject({ code: 0, msg: 'openingAgreement fail' });
      }
    }, 200);
  });
  return res;
};

export default {
  name: 'CheckSign',
  props: {
    account: { type: String, default: '' }
  },
  data() {
    return {
      list: [], // 待签署协议列表
      isShow: false,
      direction: 'btt'
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    async init() {
      try {
        const { account } = this;
        const isopenedRes = await isOpenAgreement(account);
        console.log('isopenedRes ===', isopenedRes);
        if (isopenedRes.code === 1) {
          this.$emit('success');
          return;
        }
        const newcheckRes = await checkPermissions();
        console.log('newcheckRes ===', newcheckRes);
        const list = newcheckRes.list;
        this.list = list;
        this.isShow = true;
      } catch (error) {
        this.$emit('fail', error);
      }
    },
    async doSign() {
      try {
        await openingAgreement();
        this.onSuccess();
      } catch (error) {
        console.log('doAmsSign', error);
        this.$emit('fail', error);
      }
    },
    openPdf(item) {
      const { pdfUrl } = item;
      window.open(pdfUrl);
    },
    onSuccess() {
      this.isShow = false;
      this.$emit('success');
    },
    close() {
      if (confirm('取消签署协议')) {
        const error = { message: '取消签署协议' };
        this.$emit('fail', error);
      } else {
        this.isShow = true;
      }
    },
    onFail() {
      this.isShow = false;
      const error = this.list.length ? '' : { message: '取消签署协议' };
      this.$emit('fail', error);
    }
  }
};
</script>

<style lang="scss">
.link {
  cursor: pointer;
  color: #1989fa;
}
</style>
