<template>
  <div class="demo">
    <el-button :disabled="!selection.length" @click="toOrder">去下单</el-button>
    <DatePicker></DatePicker>
    <DatePicker :start="start" :end="end"></DatePicker>
    <MyTable
      :tableData="tableData"
      :tableColumns="tableColumns"
      :requestMethod="$api.getList"
      :searchParams="searchParams"
      border
      stripe
      highlight-current-row
      @request-success="requestSuccess"
      @selection-change="changeSelection"
    >
      <template v-slot:header-name>
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
      </template>
      <template v-slot:name="{ row }">
        <div class="flex-center">
          <el-form
            :ref="row.id"
            :model="row"
            :class="{ 'el-form-item-16': row.error }"
          >
            <el-form-item
              prop="number"
              :rules="[
                {
                  validator: (rule, value, callback) =>
                    getRule(rule, value, callback, row),
                  trigger: ['change', 'blur']
                }
              ]"
            >
              <el-input v-model="row.number" :maxlength="13"></el-input>
            </el-form-item>
          </el-form>
          <div :class="{ 'mb-16': row.error }">张</div>
        </div>
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
      <template slot="empty">暂无数据！</template>
    </MyTable>
    <SlotTable
      :tableData="tableData"
      :tableColumns="tableColumns"
      :requestMethod="$api.getList"
      :searchParams="searchParams"
      border
      stripe
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
    </SlotTable>
  </div>
</template>

<script>
export default {
  name: 'Demo',
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
        }
        // fix: 这个 fixed 会影响表单校验的 clearValidate resetFields
        // {
        //   label: '操作',
        //   fixed: 'right', // 列是否固定在左侧或者右侧，true 表示固定在左侧 'left' 'right' true
        //   slot: 'action'
        // }
      ],
      searchParams: {
        other: 1,
        pageNumber: 1,
        pageSize: 20
      },
      selection: []
    };
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
    console.log('created ===');
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
    getRule(rule, value, callback, row) {
      value = value + '';
      value = value.replace(/[^\d]+/g, '');
      this.$set(row, 'number', value);
      let tips = '';
      if (!value) {
        this.$set(row, 'error', true);
        tips = '数量不能为空';
        return callback(new Error(tips));
      }
      if (row.number % 10) {
        this.$set(row, 'error', true);
        tips = '数量应该为10的倍数';
        return callback(new Error(tips));
      }
      this.$set(row, 'error', false);
      callback();
    },
    deleteRow(row) {
      console.log('row ===', row);
    },
    changeSelection(selection) {
      // console.log('selection ===', selection);
      this.selection = selection;
      // 清除未选中的数据的校验
      this.tableData.forEach(item => {
        this.$set(item, 'error', false);
        this.$refs[item.id].clearValidate();
      });
      this.validateQuantity();
    },
    // 校验选中的数据
    validateQuantity() {
      this.selection.forEach(item => {
        this.$refs[item.id].validate(valid => (item.isValidated = valid));
      });
    },
    toOrder() {
      // 重置未选中的数据，及其校验
      const filterList = this.tableData.filter(
        item => !this.selection.some(sel => item.id === sel.id)
      );
      console.log('filterList ===', filterList);
      filterList.forEach(item => {
        this.$refs[item.id].resetFields();
      });
      this.validateQuantity();
      // 判断选中的数据是否全部通过
      const isAllValidated = this.selection.every(item => item.isValidated);
      if (!isAllValidated) {
        const dom = document.querySelector('.el-form-item__error');
        dom &&
          dom.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'center'
          });
        return;
      }
    },
    requestSuccess(list) {
      this.tableData = [...list];
    }
  }
};
</script>
<style scoped lang="scss">
.demo {
  padding: 32px;
}

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

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-form-item {
  margin-bottom: 0;
}
.mb-16 {
  margin-bottom: 16px;
}

.el-form-item-16 {
  @extend .mb-16;
}
</style>
