<template>
  <div
    v-if="isRefresh"
    class="flex-center pd-v-16"
    :class="{ 'border-b': border }"
  >
    <div
      v-for="(column, i) in columns"
      :key="i"
      :class="['col-' + columns.length, column.class, column.order]"
    >
      <span>
        {{ column.value }}
      </span>
      <span
        v-if="column.sortable"
        class="caret-wrapper"
        @click="handleSortClick($event, column)"
      >
        <i
          class="sort-caret ascending"
          @click="handleSortClick($event, column, 'ascending')"
        ></i>
        <i
          class="sort-caret descending"
          @click="handleSortClick($event, column, 'descending')"
        ></i>
      </span>
    </div>
  </div>
</template>

<script>
const headerList = [
  { key: 'stockCode', value: '股票', sortable: true },
  { key: 'quantity', value: '数量(股)' },
  {
    key: 'yedayIncome',
    value: '昨日收益(元)',
    sortable: true,
    class: 'txt-right'
  },
  {
    key: 'totalIncome',
    value: '累计收益(元)',
    sortable: true,
    class: 'txt-right'
  }
];

export default {
  name: 'ListHeader',
  props: {
    border: { type: Boolean },
    list: { type: Array, default: () => [...headerList] }
  },
  data() {
    return {
      isRefresh: true,
      activeCol: '',
      columns: []
    };
  },
  created() {
    this.getColumns();
  },
  methods: {
    getColumns() {
      this.columns = this.list.map(item => {
        if (item.sortable) {
          item.order = '';
          item.sortOrders = ['ascending', 'descending', null];
        }
        return item;
      });
    },
    toggleOrder({ order, sortOrders }) {
      if (order === '') return sortOrders[0];
      const index = sortOrders.indexOf(order || null);
      return sortOrders[index > sortOrders.length - 2 ? 0 : index + 1];
    },
    handleSortClick(event, column, givenOrder) {
      event.stopPropagation();
      if (this.activeCol !== column.key) {
        this.columns.forEach(column => (column.order = null));
      }
      this.activeCol = column.key;
      let order =
        column.order === givenOrder
          ? null
          : givenOrder || this.toggleOrder(column);
      let target = event.target;
      while (target && target.tagName !== 'DIV') {
        target = target.parentNode;
      }
      console.log('target ===', target);
      console.log('order ===', order);
      column.order = order;
      console.log('column ===', column);
      this.isRefresh = false;
      this.$nextTick(() => {
        this.isRefresh = true;
      });
      this.$emit('sort-change', { column, order, key: column.key });
    }
  }
};
</script>

<style lang="scss">
.caret-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  height: 40px;
  width: 8px;
  vertical-align: middle;
  cursor: pointer;
  overflow: initial;
  position: relative;
}

.sort-caret {
  width: 0;
  height: 0;
  border: 6px solid transparent;
  position: absolute;
  left: 2px;
}

.sort-caret.ascending {
  border-bottom-color: #c0c4cc;
  top: 5px;
}

.sort-caret.descending {
  border-top-color: #c0c4cc;
  bottom: 7px;
}

.ascending .sort-caret.ascending {
  border-bottom-color: #e93a40;
}

.descending .sort-caret.descending {
  border-top-color: #e93a40;
}
</style>
