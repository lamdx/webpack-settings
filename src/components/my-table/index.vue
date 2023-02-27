<template>
  <div v-if="refresh">
    <el-table
      ref="table"
      v-bind="$attrs"
      :data="tableData"
      tooltip-effect="dark"
      v-on="$listeners"
    >
      <el-table-column
        v-for="(item, i) in tableColumns"
        :key="i"
        :type="item.type"
        :label="item.label"
        :prop="item.prop"
        :align="item.align ? item.align : 'center'"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :width="item.width"
        :min-width="item.minWidth"
        :formatter="item.formatter"
        :show-overflow-tooltip="item.isTooltip"
        :selectable="item.selected"
      >
        <!-- 具名插槽使用了 v-slot:代替了 2.6 之前的 slot=的写法，还是比较好看出来的，跟 default 不同就是 v-slot 要写在 template 标签上，否则如果有多个插槽时，会没法控制特定插槽 -->
        <!-- 自定义表格头部 -->
        <template v-if="item.header" v-slot:header>
          <slot :name="'header-' + item.header"></slot>
        </template>
        <!-- 自定义行内容 -->
        <template v-if="item.slot" v-slot="scope">
          <slot :name="item.slot" :row="scope.row"></slot>
        </template>
        <!-- 展开行，当行内容过多并且不想显示横向滚动条时，可以使用 Table 展开行功能 -->
        <template v-else-if="item.type === 'expand'" v-slot="scope">
          <slot name="expand" :row="scope.row"></slot>
        </template>

        <!-- 使用函数式组件进行 dom 渲染 -->
        <!-- <template v-if="item.render" v-slot="scope">
          <render-dom :render="() => item.render(scope.row)"></render-dom>
        </template> -->
      </el-table-column>
      <!-- 空数据时显示的内容 -->
      <template slot="empty">
        <slot name="empty"></slot>
      </template>
    </el-table>
    <div v-show="total > 0">
      <el-pagination
        :current-page="params.pageNumber"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { deepCopy } from '@/utils';
import { getItem, setItem } from '@/utils';
export default {
  name: 'MyTable',
  // v-model默认转换是：value 和 @input，如果想要修改这个行为，可以通过定义 model 选项
  // v-model 中的 prop 就是把 value 用作 prop，input 用作 event，对于子组件来说，允许自定义使用 v-model 时定制 prop 和 event
  model: { prop: 'tableData', event: 'request-success' },
  props: {
    showPagination: { type: Boolean },
    autoRequest: {
      type: Boolean,
      default: true // 默认为 true，如果条件 searchParams 是异步的可以将 autoRequest 设置为 false，父组件通过 $refs 调用 init 方法
    },
    requestMethod: { type: Function, default: () => Promise.resolve() },
    searchParams: { type: Object, default: () => ({}) },
    tableData: { type: Array, default: () => [] },
    tableColumns: { type: Array, default: () => [] }
  },
  data() {
    return {
      refresh: true,
      isLoading: false,
      params: {},
      total: 0,
      dictList: [
        { key: 'hobby', queryMethod: this.$api.getOptions },
        { key: 'hobby1', queryMethod: this.$api.getOptions }
      ],
      dictMap: {}
    };
  },
  watch: {
    searchParams: {
      handler(val) {
        const { pageSize } = this.params;
        // 保留原来的 pageSize，重置第一页
        this.params = Object.assign(deepCopy(val), { pageNumber: 1, pageSize });
        this.init();
      },
      deep: true // 是否开启深度监听，searchParams 是对象，searchParams.xxx 也可以被监听到
      // immediate: true
    }
  },
  created() {
    console.log('this.$attrs ===', this.$attrs);
    if (this.autoRequest) {
      this.params = Object.assign(deepCopy(this.searchParams));
      this.init();
    }
  },
  methods: {
    async init() {
      const needTransferCol = this.tableColumns.filter(
        item => item.isNeedTransfer
      );
      // 如果有对应列内容需要远程转义
      if (needTransferCol.length) {
        this.dictList = this.dictList.filter(dict =>
          needTransferCol.some(col => col.prop === dict.key)
        );
        await this.initDicts();
        this.initTableColumns();
      }
      this.handleQuery(this.params);
    },
    initDicts() {
      return new Promise(resolve => {
        const cacheList = [...this.dictList];
        const promises = [];
        cacheList.forEach(item => {
          promises.push(this.getDict(item));
        });
        Promise.all(promises).then(res => {
          console.log('Promise.all res ===', res);
          res.forEach((item, i) => {
            this.dictMap[cacheList[i].key] = item;
          });
          console.log('dictMap ===', this.dictMap);
          resolve(res);
        });
      });
    },
    getDict(item) {
      return new Promise(resolve => {
        const list = getItem(item.key, 'session');
        console.log('getItem list ===', list);
        if (list?.length > 0) {
          resolve(list);
          return;
        }
        item
          .queryMethod()
          .then(res => {
            setItem(item.key, res.data, 'session');
            resolve(res.data);
          })
          .catch(err => {
            resolve(err);
          });
      });
    },
    initTableColumns() {
      this.tableColumns.forEach(column => {
        if (column.isNeedTransfer === true) {
          column.formatter = row => {
            const options = this.dictMap[column.prop] || [];
            // console.log('init options ===', options);
            const obj = options.find(item => item.value === row[column.prop]);
            return obj?.label || '--';
          };
        }
      });
    },
    handleQuery(params) {
      try {
        if (!params.pageNumber) {
          throw new Error('params.pageNumber 不能为空');
        }
        if (!params.pageSize) {
          throw new Error('params.pageSize 不能为空');
        }
        // 防止重复请求，数据加载中
        if (this.isLoading) return;
        this.isLoading = true;
        this.requestMethod(params)
          .then(res => {
            console.log('getList res ===', res);
            const list = res?.list || [];
            this.total = res?.total || 0;
            this.$emit('request-success', list);
          })
          .catch(err => {
            console.log('getList err ===', err);
          })
          .finally(() => {
            this.isLoading = false;
          });
      } catch (error) {
        console.log(error);
      }
    },
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`);
      this.params.pageNumber = 1;
      this.params.pageSize = size;
      this.handleQuery(this.params);
    },
    handleCurrentChange(number) {
      console.log(`当前页: ${number}`);
      this.params.pageNumber = number;
      this.handleQuery(this.params);
    }
  }
};
</script>
<style scoped></style>
