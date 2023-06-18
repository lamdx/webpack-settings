<template>
  <div class="pd-56">
    <CampAnimation />
    <br />
    <CampBar />
    <br />
    <MyCheckbox @on-select="checkboxConfirm" />
    <FlowChart />
    <FoldingPanel />
    <MyHeader title="测试头部" />
    <PopupRadio
      v-model="popupRadiostatus"
      :placeholder="'请选择'"
      :options="popupRadioOptions"
      title="mobile单选弹框"
      @onhide="popupRadioOnHide"
    >
      <p slot="popup_header" class="popup_header">请选择质押保险办理状态</p>
    </PopupRadio>
    <ScrollArea />
    <Tabbar />
    <MyTabs v-model="tabVal" @on-click="clickTab">
      <MyTabPane
        v-for="(item, i) in tabList"
        :key="i"
        :label="item.label"
        :name="item.name"
        :count="item.count"
      >
        <MyList v-if="tabVal === item.name"></MyList>
      </MyTabPane>
      <MyTabPane label="标签十三" name="13">标签十三内容</MyTabPane>
    </MyTabs>
    <TextExpandAndCollapse :content="content" />
    <TextExpandedAndClosed :content="content" />
    <TimeAxis />
    <ViewAll :left="'文件查看'" :right="'查看全部'" @go="goback"></ViewAll>
    <ListHeader></ListHeader>
  </div>
</template>

<script>
import compare from '@/mixins/compare';
export default {
  name: 'Demo',
  mixins: [compare],
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('vm ===', vm);
    });
  },
  data() {
    return {
      content:
        '康德说："我天生就是一个追求真理的人，对知识感到热切渴望。曾经一度认为只有这种知识与渴望才是人的荣耀所在，我鄙视一般无知的人。但是卢梭更正了我的盲目偏见，使我懂得了尊重人性。人性足以使所有人具有生命价值，足以确立他们作为人的权利。如果我不能抱持这种观点，就连一般工人也不如。"',
      popupRadiostatus: '',
      popupRadioOptions: [
        { key: '01', value: '无需办理' },
        { key: '02', value: '办理中' },
        { key: '03', value: '待办中' },
        { key: '04', value: '已办理' }
      ],
      tabList: [
        {
          label: h => {
            return h('div', [
              h('span', '1世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '1',
          count: 1
        },
        {
          label: h => {
            return h('div', [
              h('span', '2世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '2',
          count: 2
        },
        {
          label: h => {
            return h('div', [
              h('span', '3世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '3',
          count: 3
        },
        {
          label: h => {
            return h('div', [
              h('span', '4世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '4',
          count: 4
        },
        {
          label: h => {
            return h('div', [
              h('span', '5世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '5',
          count: 5
        },
        {
          label: h => {
            return h('div', [
              h('span', '6世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '6',
          count: 6
        },
        {
          label: h => {
            return h('div', [
              h('span', '7世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '7',
          count: 7
        },
        {
          label: h => {
            return h('div', [
              h('span', '8世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '8',
          count: 8
        },
        {
          label: h => {
            return h('div', [
              h('span', '9世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '9',
          count: 9
        },
        {
          label: h => {
            return h('div', [
              h('span', '10世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '10',
          count: 10
        },
        {
          label: h => {
            return h('div', [
              h('span', '11世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '11',
          count: 11
        },
        {
          label: h => {
            return h('div', [
              h('span', '12世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '12',
          count: 12
        }
      ],
      tabVal: ''
    };
  },
  watch: {
    // 首次不会被监听到所以需要 immediate: true
    // 监听 $route 需要特别注意，路由 enter & leave 都会触发监听
    $route: {
      handler(to) {
        // to 相当于 newValue
        if (/\/demo1/.test(to.path)) {
          this.tabVal = to.query.name;
        }
      },
      immediate: true
    }
  },
  methods: {
    checkboxConfirm(data) {
      console.log('checkboxConfirm data ===', data);
    },
    popupRadioOnHide() {
      console.log('popup-radio：可以进行校验/发起请求');
    },
    goback() {},
    clickTab(name) {
      console.log(name);
    }
  }
};
</script>
