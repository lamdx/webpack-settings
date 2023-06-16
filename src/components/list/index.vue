<template>
  <div class="list_wrapper">
    <!-- state(:state="state" :page="true" :msg="stateMsg" @retry="init")
    scroll(ref="scroll" :hasLoad="hasLoad" :hasRefresh="hasRefresh" @load="loadMore" @refresh="init")
      slot
      //- slot(:list="listData") -->
  </div>
</template>
<script>
export default {
  name: 'List',
  props: {
    list: { type: Array },
    autoRequest: { type: Boolean, default: true }, // requestParams 请求参数异步的话，就设置为 false
    requestMethod: { type: Function, default: () => ({}) },
    pageSettings: {
      type: Object,
      default: () => ({
        pageNumber: 1,
        pageSize: 15,
        pageKey: 'page',
        sizeKey: 'size'
      })
    },
    requestParams: { type: Object, default: () => ({}) },
    beforeRequest: { type: Function, default: () => ({}) },
    handleResult: {
      type: Function,
      default: res =>
        Array.isArray(
          res?.data?.list || res?.content?.rows || res?.data || res?.content
        )
          ? res?.data?.list || res?.content?.rows || res?.data || res?.content
          : []
    },
    afterRequest: { type: Function, default: () => {} },
    // scroll
    hasLoad: { type: Boolean, default: true },
    hasRefresh: { type: Boolean, default: true },
    emptyText: { type: String, default: '暂无数据' }
  },
  data() {
    return {
      state: '',
      stateMsg: { error: this.emptyText },
      page: this.pageSettings.pageNumber,
      size: this.pageSettings.pageSize,
      listData: [],
      isDone: false // 是否加载结束
    };
  },
  computed: {
    canLoad() {
      return !this.list?.length && this.hasLoad;
    },
    canRefresh() {
      return !this.list?.length && this.hasRefresh;
    }
  },
  created() {
    // 如果有自定义数据 list 就不请求了
    if (this.list) {
      return this.setState(this.list);
    }
    if (this.autoRequest) {
      this.init();
    }
  },
  methods: {
    setState(list) {
      const len = list?.length || 0;
      this.state = len ? '' : 'error';
      this.listData = list;
    },
    async handleQuery(done, isRefresh) {
      try {
        const {
          pageSettings,
          requestParams,
          beforeRequest,
          requestMethod,
          handleResult,
          afterRequest
        } = this;
        let params = {};
        if (isRefresh) {
          this.page = pageSettings.pageNumber;
          this.state = 'loading';
        }
        params[pageSettings.pageKey] = this.page;
        params[pageSettings.sizeKey] = this.size;
        if (requestParams) Object.assign(params, requestParams);
        if (beforeRequest) {
          const reqParams = beforeRequest(isRefresh);
          if (reqParams) {
            params = Object.assign(params, reqParams);
          }
        }
        const res = await requestMethod(params);
        const data = handleResult(res);
        this.listData = isRefresh ? data : this.listData.concat(data);
        this.setState(this.listData);
        this.$emit('request-success', this.listData);
        const len = data?.length || 0;
        let isDone = len < this.size || len > this.size; // 如果超出了预定长度关闭加载更多，不支持分页处理
        if (!isDone) {
          this.page += 1;
        }
        afterRequest && afterRequest();
        this.isDone = isDone;
        done && done(isDone);
      } catch (err) {
        console.log(err);
        // this.state = 'error' // error 这个状态 只是一个文案 获取数据失败，请重试！
        this.state = 'network'; // network 这个状态点击重试按钮，在当前页面就可以重新刷新页面，交互更加友好
      }
    },
    loadMore(done) {
      const { isDone } = this;
      isDone ? done(isDone) : this.handleQuery(done);
    },
    init() {
      this.handleQuery(null, true);
    }
  }
};
</script>

<style>
.list_wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
