<template>
  <div class="camp">
    <div
      v-for="(item, index) in campData"
      :key="index"
      :style="{ width: item.width + '%' }"
      :class="campStyle[index].positionClass"
    >
      <div
        v-show="item.rate && item.rate < 100"
        v-if="index === 1"
        class="right-bevel-edge"
      ></div>
      <div
        :style="{ 'border-radius': item.rate === 100 ? '12px' : '' }"
        :class="campStyle[index].barClass"
      ></div>
      <div
        v-show="item.rate && item.rate < 100"
        v-if="index === 0"
        class="left-bevel-edge"
      ></div>
    </div>
    <!-- <div class="left" :style="{ width: leftObj.width + '%' }">
      <div
        class="left-bar"
        :style="{ 'border-radius': leftObj.rate === 100 ? '12px' : '' }"
      ></div>
      <div
        class="left-bevel-edge"
        v-show="leftObj.rate > 0 && leftObj.rate < 100"
      ></div>
    </div>
    <div class="right" :style="{ width: rightObj.width + '%' }">
      <div
        class="right-bevel-edge"
        v-show="rightObj.rate > 0 && rightObj.rate < 100"
      ></div>
      <div
        class="right-bar"
        :style="{ 'border-radius': rightObj.rate === 100 ? '12px' : '' }"
      ></div>
    </div> -->
  </div>
</template>
<script>
const campList = [{ votes: 1 }, { votes: 1 }];

export default {
  name: 'CampAnimation',
  props: {
    campList: {
      type: Array,
      default: () => campList
    },
    animation: { type: Boolean, default: true }
  },
  data() {
    return {
      campStyle: [
        { positionClass: 'left', barClass: 'left-bar' },
        { positionClass: 'right', barClass: 'right-bar' }
      ],
      campData: []
    };
  },
  computed: {
    leftObj() {
      return this.campData[0] || {};
    },
    rightObj() {
      return this.campData[1] || {};
    }
  },
  mounted() {
    this.initData();
    this.dynamicSetWidth();
  },
  methods: {
    initData() {
      this.campData = this.campList.map(item => ({
        ...item,
        width: 0,
        rate: 0
      }));
      const sum = this.campData[0].votes + this.campData[1].votes;
      // 总数为 0，则不显示
      if (!sum) return;
      const rate = (this.campData[0].votes / sum) * 100;
      this.campData[0].rate = rate > 50 ? Math.floor(rate) : Math.ceil(rate);
      // 优化斜角显示问题 百分比小于 3 或者 大于 97 保证显示效果
      if (this.campData[0].rate !== 0 && this.campData[0].rate < 3) {
        this.campData[0].rate = 3;
      } else if (this.campData[0].rate !== 100 && this.campData[0].rate > 97) {
        this.campData[0].rate = 97;
      }
      this.campData[1].rate = 100 - this.campData[0].rate;
    },
    dynamicSetWidth() {
      for (let index = 0; index < this.campData.length; index++) {
        if (this.animation) {
          let timeId = setInterval(() => {
            if (this.campData[index].width >= this.campData[index].rate) {
              clearInterval(timeId);
            } else {
              this.campData[index].width += 1;
            }
          }, 10);
        } else {
          this.campData[index].width = this.campData[index].rate;
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
.camp {
  position: relative;
  display: flex;
}

.left {
  position: absolute;
  left: 0;
  display: flex;
  width: 100%;
  height: 24px;
}

.right {
  position: absolute;
  right: 0;
  display: flex;
  width: 100%;
  height: 24px;
}

.left-bar {
  width: 100%;
  height: 24px;
  background: linear-gradient(to right, #ff9247 0%, #ff2927 100%);
  border-radius: 12px 0 0 12px;
}

.right-bar {
  width: 100%;
  height: 24px;
  border-radius: 0 12px 12px 0;
  background: linear-gradient(to right, #1b4dc6 0%, #68b1e8 100%);
}

.left-bevel-edge {
  border-color: #ff2927 transparent transparent;
  border-style: solid;
  border-width: 24px 12px 0 0;
}

.right-bevel-edge {
  border-color: transparent transparent #1b4dc6;
  border-style: solid;
  border-width: 0 0 24px 12px;
}
</style>
