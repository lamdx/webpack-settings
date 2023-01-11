<template>
  <div v-if="refresh">
    <el-table
      ref="table"
      v-bind="$attrs"
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
    </el-table>
    <div v-show="total > 0">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
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
import { deepCopy } from '@/utils/index';
import { getItem, setItem } from '@/utils/storage.js';
export default {
  name: 'MyTable',
  props: {
    tableColumns: { tpye: Array, default: () => [] },
    searchParams: { tpye: Array, default: () => ({}) }
  },
  data() {
    return {
      refresh: true,
      loading: false,
      params: {},
      currentPage: 5,
      total: 100,
      pageSize: 10,
      dictList: [{ key: 'hobby', fn: this.$api.getOptions }],
      dictMap: {}
    };
  },
  watch: {
    searchParams: {
      handler(val) {
        this.params = deepCopy(val);
      }
    }
  },
  created() {
    console.log('this.$attrs ===', this.$attrs);
    this.init();
  },
  methods: {
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`);
      // this.searchParams.pageNumber = 1;
      // this.searchParams.pageSize = size;
      this.currentPage = 1;
      this.pageSize = size;
      this.handleQuery();
    },
    handleCurrentChange(number) {
      console.log(`当前页: ${number}`);
      // this.searchParams.pageNumber = number;
      this.currentPage = number;
      this.handleQuery();
    },
    init() {
      this.initDicts(this.dictList, this.initTableColumns);
    },
    initDicts(cacheList, callback) {
      cacheList = [...new Set(cacheList)];
      const promises = [];
      cacheList.forEach(item => {
        promises.push(this.getDicts(item));
      });
      Promise.all(promises).then(res => {
        console.log('Promise.all res ===', res);
        res.forEach((item, i) => {
          this.dictMap[cacheList[i].key] = item;
        });
        console.log('dictMap ===', this.dictMap);
        callback && callback();
      });
    },
    getDicts(item) {
      return new Promise(resolve => {
        const list = getItem(item.key, 'session');
        console.log('getItem list ===', list);
        // if (list?.length > 0) {
        //   resolve(list);
        //   return;
        // }
        item
          .fn()
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
      if (this.tableColumns.length > 0) {
        this.tableColumns.forEach(column => {
          if (column.isNeedTransfer === true) {
            column.formatter = row => {
              const options = this.dictMap[column.prop];
              console.log('init options ===', options);
              const obj = options.find(item => item.value === row[column.prop]);
              return obj.label;
            };
          }
        });
        this.handleQuery();
      }
    },
    handleQuery() {
      if (!this.searchParams) {
        return false;
      }
      // 数据加载中
      this.loading = true;
      this.$api
        .getList()
        .then(res => {
          console.log('getList res ===', res);
          const list = res?.list || [];
          this.$emit('request-success', list);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style scoped></style>
