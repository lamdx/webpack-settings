<template>
  <div class="home">
    <h1>homePage</h1>
    <!-- <img :src="getImage('logo')" alt="" /> -->
    <br />
    <input type="button" value="减" @click="minus" />
    <input id="num" v-model="searchParams.other" type="text" />
    <input type="button" value="加" @click="add" />
    <MySelect
      v-model="value"
      placeholder="请选择"
      clearable
      :req="$api.getOptions"
    >
      <template v-slot:option="{ item }">
        <div class="opt">
          <span>{{ item.label }}</span>
          <span>{{ item.value }}</span>
        </div>
        <!-- <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{
          item.value
        }}</span> -->
      </template>
    </MySelect>
    <h1>
      123
      {{ value }}
    </h1>
    <MySelect :options="options" multiple collapse-tags></MySelect>
    <!-- <TimeAxis></TimeAxis>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="changeress" label="地址"> </el-table-column>
    </el-table> -->
    <MyTable
      :requestMethod="$api.getList"
      :searchParams="searchParams"
      :tableData="tableData"
      :tableColumns="tableColumns"
      stripe
      border
      highlight-current-row
      @request-success="requestSuccess"
      @selection-change="change"
    >
      <template v-slot:header-name>
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
      </template>
      <template v-slot:name="{ row }">
        <p>{{ row.name }}</p>
        <p>{{ row.changeress }}</p>
      </template>
      <template v-slot:expand="{ row }">
        <el-form label-position="left" class="demo-table-expand">
          <el-form-item label="商品名称">
            <span>{{ row.name }}</span>
          </el-form-item>
          <el-form-item label="所属店铺">
            <span>{{ row.changeress }}</span>
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
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'Home',
  data() {
    return {
      options: [],
      value: '',
      search: '',
      tableData: [],
      remoteData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          changeress: '上海市普陀区金沙江路 1518 弄',
          hobby: '1'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          hobby: '2'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          hobby: '3'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          hobby: '1'
        }
      ],
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
  computed: {
    ...mapState('app', ['num'])
  },
  created() {
    // 添加 promise 代码
    const promise = Promise.resolve();
    promise.then(() => {
      console.log('hello promise');
    });
    console.log('process.env ===', process.env);
  },
  methods: {
    ...mapMutations('app', ['setNum']),
    minus() {
      this.searchParams.other -= 1;
      const res = this.num - 1;
      this.setNum(res);
    },
    dd() {
      this.$api.getOptions().then(res => {
        this.options = res.options;
      });
      setTimeout(() => {
        console.log(123);
      }, 1000);
    },
    add() {
      this.searchParams.other += 1;
      const res = this.num + 1;
      this.setNum(res);
    },
    getImage(bankType = 'logo') {
      const { $banksMap } = this;
      console.log('$banksMap ===', $banksMap);
      return require(`@/assets/images/bank/${$banksMap[bankType]}`);
    },
    deleteRow(row) {
      console.log('row ===', row);
    },
    change(selection) {
      console.log('selection ===', selection);
    },
    requestSuccess(list) {
      this.tableData = list;
    }
  }
};
</script>
<style scoped lang="less">
.home {
  height: 100%;
  padding: 32px;
}
.opt {
  display: flex;
  justify-content: space-between;
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
