<template>
  <div class="demo">
    <DatePicker></DatePicker>
    <DatePicker :start="start" :end="end"></DatePicker>
    <!-- <MyTable
      :requestMethod="$api.getList"
      :searchParams="searchParams"
      :tableData="tableData"
      :tableColumns="tableColumns"
      stripe
      border
      highlight-current-row
      @request-success="requestSuccess"
      @selection-change="changeSelection"
    >
      <template v-slot:header-name>
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
      </template>
      <template v-slot:name="{ row }">
        <p>{{ row.name }}</p>
        <p>{{ row.address }}</p>
      </template>
      <template v-slot:expand="{ row }">
        <el-form label-position="left" class="demo-table-expand">
          <el-form-item label="商品名称">
            <span>{{ row.name }}</span>
          </el-form-item>
          <el-form-item label="所属店铺">
            <span>{{ row.address }}</span>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:action="{ row }">
        <el-button
          type="text"
          size="small"
          @click.native.prevent="deleteRow(row)"
        >
          移除
        </el-button>
      </template>
    </MyTable>
    <SlotTable
      :requestMethod="$api.getList"
      :searchParams="searchParams"
      :tableData="tableData"
      :tableColumns="tableColumns"
      stripe
      border
      highlight-current-row
      @request-success="requestSuccess"
      @selection-change="changeSelection"
    >
      <template slot="header-name">
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
      </template>
      <template slot="name" slot-scope="{ row }">
        <p>{{ row.name }}</p>
        <p>{{ row.address }}</p>
      </template>
      <template slot="expand" slot-scope="{ row }">
        <el-form label-position="left" class="demo-table-expand">
          <el-form-item label="商品名称">
            <span>{{ row.name }}</span>
          </el-form-item>
          <el-form-item label="所属店铺">
            <span>{{ row.address }}</span>
          </el-form-item>
        </el-form>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button
          type="text"
          size="small"
          @click.native.prevent="deleteRow(row)"
        >
          移除
        </el-button>
      </template>
    </SlotTable> -->
  </div>
</template>

<script>
export default {
  name: 'Demo',
  data() {
    return {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-18'),
      search: '',
      tableData: [],
      tableColumns: [
        {
          type: 'selection', // 如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引(从 1 开始计算)；如果设置了 expand 则显示为一个可展开的按钮
          // 多选框是否可以勾选
          selected: (row, index) => {
            // console.log('index ===', index);
            return row.status !== 1;
          }
        },
        { type: 'expand' },
        { label: '序号', type: 'index' },
        {
          label: '日期', // 显示的标题
          prop: 'date', // 对应列内容的字段名
          sortable: true, // 对应列是否可以排序，如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件
          formatter: (row, column) => {
            // 格式化指定列的值
            // console.log('column ===', column);
            return new Date(row.date).getTime();
          }
        },
        {
          label: '姓名',
          header: 'name', // 自定义表头
          slot: 'name', // 自定义内容
          // align: 'left', // 对齐方式
          minWidth: 300 // min-width 会把剩余宽度按比例分配给设置了 min-width 的列
        },
        {
          label: '爱好',
          prop: 'hobby',
          isNeedTransfer: true // 是否需要远程转义
        },
        {
          label: '地址',
          prop: 'address',
          width: 200, // 对应列的宽度
          isTooltip: true // 当内容过长被隐藏时显示 tooltip
        },
        {
          label: '操作',
          fixed: 'right', // 列是否固定在左侧或者右侧，true 表示固定在左侧 'left' 'right' true
          slot: 'action'
        }
      ],
      searchParams: {
        other: 1,
        pageNumber: 1,
        pageSize: 20
      }
    };
  },
  methods: {
    deleteRow(row) {
      console.log('row ===', row);
    },
    changeSelection(selection) {
      console.log('selection ===', selection);
    },
    requestSuccess(list) {
      this.tableData = list;
    }
  }
};
</script>
<style scoped lang="scss">
.demo {
  padding: 32px;
}
</style>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
