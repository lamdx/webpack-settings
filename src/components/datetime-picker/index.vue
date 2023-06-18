<template>
  <div>
    <smooth-picker ref="smoothPicker" :data="timeList" :change="changeTime" />
    <button @click="confirm">确定</button>
  </div>
</template>

<script>
import 'vue-smooth-picker/dist/css/style.css';
import { SmoothPicker } from 'vue-smooth-picker';
let allMinute = [];
for (let index = 0; index < 60; index++) {
  const str = index + '';
  allMinute.push(str.padStart(2, '0'));
}
const partMinute = allMinute.slice(0, 31);
const allHour = ['09', '10', '11', '13', '14', '15'];

export default {
  name: 'DatetimePicker',
  components: { SmoothPicker },
  props: {
    time: { type: String, default: '' }
  },
  data() {
    return {
      timeList: [
        // 初始时间为 09:00 15:29
        {
          currentIndex: 0, // 展示的默认值为列表 list[0] 的值
          flex: 3,
          list: allHour, // 列表展示的枚举值
          onClick: this.clickOnHour,
          textAlign: 'center',
          className: 'row-group'
        },
        {
          divider: true,
          flex: 1,
          text: ':',
          textAlign: 'center',
          className: 'divider'
        },
        {
          currentIndex: 0,
          flex: 3,
          list: allMinute,
          onClick: this.clickOnMinute,
          textAlign: 'center',
          className: 'row-group'
        },
        {
          divider: true,
          flex: 1,
          text: '~',
          textAlign: 'center',
          className: 'divider'
        },
        {
          currentIndex: 5,
          flex: 3,
          list: allHour,
          onClick: this.clickOnHour,
          textAlign: 'center',
          className: 'item-group'
        },
        {
          divider: true,
          flex: 1,
          text: ':',
          textAlign: 'center',
          className: 'divider'
        },
        {
          currentIndex: 29,
          flex: 3,
          list: partMinute,
          onClick: this.clickOnMinute,
          textAlign: 'center',
          className: 'item-group'
        }
      ]
    };
  },
  mounted() {
    this.handleTime();
  },
  methods: {
    handleTime() {
      // 回显时间 时间格式 10:10~15:29
      if (this.time) {
        const { timeList, $refs } = this;
        const str = this.time.replace('~', ':');
        const arr = str.split(':');
        const [startHour, startMinute, endHour, endMinute] = arr;
        const colIndexMap = {
          startHour: 0,
          startMinute: 2,
          endHour: 4,
          endMinute: 6
        };
        const timeMap = {
          startHour,
          startMinute,
          endHour,
          endMinute
        };
        for (let key in timeMap) {
          const colIndex = colIndexMap[key];
          const value = timeMap[key];
          const currentIndex = timeList[colIndex].list.findIndex(
            item => item === value
          );
          $refs.smoothPicker.setGroupData(
            colIndex,
            Object.assign({}, timeList[colIndex], { currentIndex })
          );
        }
      }
    },
    changeTime(colIndex, currentIndex) {
      console.info(
        '当前列的 index & 当前列的展示值的 index',
        colIndex,
        currentIndex
      );
      const { timeList } = this;
      this.$refs.smoothPicker.setGroupData(
        colIndex,
        Object.assign({}, timeList[colIndex], { currentIndex })
      );
      // colIndex === 0 || colIndex === 4 小时列
      if (colIndex === 0 || colIndex === 4) {
        let list = [];
        // allHour = ['09', '10', '11', '13', '14', '15'];
        switch (currentIndex) {
          case 0:
          case 1:
          case 3:
          case 4:
            list = allMinute;
            break;
          case 2:
          case 5:
            list = partMinute;
            break;
          default:
            list = allMinute;
        }
        const hourAndMinuteMap = {
          0: 2, // 第一列小时列 影响 第三列分钟列
          4: 6 // 第五列小时列 影响 第七列分钟列
        };
        this.$refs.smoothPicker.setGroupData(
          hourAndMinuteMap[colIndex],
          // currentIndex: 0 => 小时列数据变化后，分钟列的展示默认值都取 第一个
          Object.assign({}, timeList[colIndex], { currentIndex: 0, list })
        );
      }
      // 这里处理 开始时间结束时间逻辑会比较复杂
      // if (colIndex === 0) {
      //   console.log(currentIndex, timeList[4].currentIndex);
      //   if (currentIndex > timeList[4].currentIndex) {
      //     console.log('开始时间不能大于结束时间');
      //   }
      // }
      // if (colIndex === 4) {
      //   console.log(currentIndex, timeList[0].currentIndex);
      //   if (currentIndex < timeList[0].currentIndex) {
      //     console.log('结束时间不能小于开始时间');
      //   }
      // }
      // if (colIndex === 2) {
      //   console.log(currentIndex, timeList[6].currentIndex);
      //   debugger;
      //   if (timeList[0].currentIndex === timeList[4].currentIndex) {
      //     if (currentIndex > timeList[6].currentIndex) {
      //       console.log('开始时间不能大于结束时间');
      //     }
      //   }
      // }
      // if (colIndex === 6) {
      //   console.log(currentIndex, timeList[2].currentIndex);
      //   if (timeList[0].currentIndex === timeList[4].currentIndex) {
      //     if (currentIndex < timeList[2].currentIndex) {
      //       console.log('结束时间不能小于开始时间');
      //     }
      //   }
      // }
    },
    clickOnHour(colIndex, currentIndex) {
      window.alert(
        'Clicked hour: ' + this.timeList[colIndex].list[currentIndex]
      );
    },
    clickOnMinute(colIndex, currentIndex) {
      window.alert(
        'Clicked Minute: ' + this.timeList[colIndex].list[currentIndex]
      );
    },
    confirm() {
      const { timeList, $refs } = this;
      const currentIndexList = $refs.smoothPicker.getCurrentIndexList();
      console.log(currentIndexList);
      const startHour = timeList[0].list[currentIndexList[0]];
      const startMinute = timeList[2].list[currentIndexList[2]];
      const endHour = timeList[4].list[currentIndexList[4]];
      const endMinute = timeList[6].list[currentIndexList[6]];
      if (
        startHour > endHour ||
        (startHour === endHour && startMinute > endMinute)
      ) {
        console.log('开始时间不能小于结束时间');
      }
      alert(`${startHour}:${startMinute}~${endHour}:${endMinute}`);
    }
  }
};
</script>
