<template>
  <div class="home">
    <h1>homePage</h1>
    <!-- <img :src="getImage('logo')" alt="" /> -->
    <br />
    <input type="button" value="减" @click="minus" />
    <input id="num" v-model="num" type="text" />
    <input type="button" value="加" @click="add" />
    <!-- <TimeAxis></TimeAxis>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table> -->
    <MyTable
      :data="tableData"
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
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'Home',
  data() {
    return {
      search: '',
      tableData: [],
      tableData1: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      tableColumns: [
        {
          type: 'selection',
          selected: (row, index) => {
            // console.log('index ===', index);
            return row.status !== 1;
          }
        },
        { type: 'expand', fixed: 'left' },
        { label: '序号', type: 'index', fixed: 'left' },
        {
          label: '日期',
          prop: 'date',
          sortable: true,
          fixed: 'left',
          width: 150,
          formatter: (row, column) => {
            // console.log('column ===', column);
            return new Date(row.date).getTime();
          }
        },
        {
          label: '姓名',
          header: 'name',
          align: 'left',
          slot: 'name',
          minWidth: 300
        },
        {
          label: '爱好',
          prop: 'hobby',
          width: 150,
          isNeedTransfer: true
        },
        { label: '地址', prop: 'address', width: 200, isTooltip: true },
        { label: '操作', fixed: 'right', slot: 'action' }
      ]
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
    // this.$api
    //   .getData({})
    //   .then(res => {
    //     console.log('res ===', res);
    //   })
    //   .catch(err => {
    //     console.log('err ===', err);
    //   });
  },
  methods: {
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
    },
    deleteRow(row) {
      console.log('row ===', row);
    },
    change(selection) {
      console.log('selection ===', selection);
    },
    requestSuccess(list) {
      this.tableData = list;
      console.log('list ===', JSON.stringify(list));
    }
  }
};
</script>
<style scoped lang="less">
.home {
  height: 100%;
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
