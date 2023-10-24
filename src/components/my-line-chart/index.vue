<template>
  <div>
    <h3>区间收益 {{ title }}</h3>
    <div id="line-chart"></div>
  </div>
</template>
<script>
// import echarts from 'echarts'; // 如果采用 cdn，echart 只能全量引入使用，因为 echart 按需引入后，externals 无法识别 echart，所以不会忽略打包，还是会把 echart 打包进去
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts/core';

// 引入折线图图表，图表后缀都为 Chart
import { LineChart } from 'echarts/charts';

// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  VisualMapComponent,
  MarkAreaComponent,
  MarkPointComponent
} from 'echarts/components';

// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LineChart,
  LegendComponent,
  VisualMapComponent,
  MarkAreaComponent,
  MarkPointComponent // fix: markPoint 不生效
]);

/**
 * 处理 x 轴数据 axisLabel 显示，第一个居右显示，最后一个靠左显示
 * @param {Array} axisData x 坐标数据
 * @returns axisData
 */
const setAxisLabelAlign = axisData => {
  const len = axisData?.length - 1;
  const map = {
    0: 'left',
    [len]: 'right'
  };
  return axisData?.map((item, i) => ({
    value: item,
    textStyle: { align: map[i] || 'center' }
  }));
};

/**
 * 根据 y 坐标数据计算 折线图最小值、最大值、y 轴刻度间的间距
 * @param {Array} seriesData y 坐标数据
 * @returns yMin: 折线图最小值、yMax: 最大值 、yInterval: y 轴刻度间的间距
 */
const getYAxisMinMaxInterval = seriesData => {
  if (!seriesData || seriesData.length === 0) {
    // 没有数据时 y坐标 默认展示
    return { yMin: 0, yMax: 5000, yInterval: 1000 };
  }
  let yMax = Math.max(...seriesData) || 0,
    yMin = Math.min(...seriesData) || 0;
  if (yMax === yMin) {
    yMax += 1;
    yMin -= 1;
  }
  const yInterval = (yMax - yMin) / 4;
  return { yMin, yMax, yInterval };
};

/**
 * 设置区域填充样式 填充的颜色 options.color
 * @param {String} min y 轴最小值
 * @param {String} max y 轴最大值
 * @returns Object
 */
const setAreaStyle = (min, max) => {
  // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
  const options = {
    origin: 'auto',
    opacity: 0.3,
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: []
    }
  };
  // 都大于 0
  if (min >= 0) {
    options.color.colorStops = [
      { offset: 0, color: 'rgba(215, 57, 57, 1)' },
      { offset: 1, color: 'rgba(255, 156, 156, 0.57)' }
    ];
    return options;
  }
  // 都小于 0
  if (max <= 0) {
    options.color.colorStops = [
      { offset: 0, color: 'rgba(152, 234, 183, 0.57)' },
      { offset: 1, color: 'rgba(43, 177, 94, 1)' }
    ];
    return options;
  }
  // 既有负数又有正数
  const splitRate =
    Number((Math.abs(max) / (Math.abs(min) + Math.abs(max))).toFixed(2)) ||
    0.01;
  options.color.colorStops = [
    { offset: 0, color: 'rgba(215, 57, 57, 1)' },
    { offset: splitRate - 0.01, color: 'rgba(255, 156, 156, 0.57)' },
    {
      offset: splitRate + 0.01 > 1 ? 1 : splitRate + 0.01,
      color: 'rgba(152, 234, 183, 0.57)'
    },
    { offset: 1, color: 'rgba(43, 177, 94, 1)' }
  ];
  return options;
};

/**
 * @description 判断最大最小值绝对值是否在 1 万范围内
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns Boolean
 */
const isRange = (min, max) => {
  if (!isNaN(min) && !isNaN(max)) {
    return Math.abs(min) <= 10000 && Math.abs(max) <= 10000;
  } else {
    return true;
  }
};

/**
 * @description 处理 y 轴 label 展示
 * @description 如果所有坐标都在万元以下，则都显示元，保留两位小数点
 * @description 如果所有坐标都在万元以上，则都显示万元，保留两位小数点
 * @description 如果所有坐标跨度元到万元，则都显示万元，保留两位小数点，100 元以下都做 0.01 万元显示
 * @param {Object} options toFix:保留几位小数，showPlus:是否显示正号，min：y 轴最小值，max:y 轴最大值
 */
const formatNumber = (value, options = {}) => {
  // if (isNonSenseValue(value)) return value
  const { toFix = 2, showPlus = true, min = '', max = '' } = options;
  let number = Number(value);
  const symbol = showPlus && number > 0 ? '+' : '';

  // 如果数据绝对值都小于 1 万，则单位为元
  if (isRange(min, max)) {
    return `${symbol}${number.toFixed(toFix)}`;
  } else {
    // 如果数据绝对值都在万元上，或者跨越万元，则单位为万元；当数据的绝对值小于 100，则统一置为 0.01万元
    number =
      Math.abs(number) < 100 && number !== 0
        ? (number / Math.abs(number)) * 100
        : number;
    return `${symbol}${(number / 10000).toFixed(toFix)}万`;
  }
};

const setMarkPoint = seriesData => {
  const len = seriesData.length - 1,
    yAxis = seriesData[len] || '',
    fontSize = 12;
  return {
    symbolRotate: 90,
    symbolSize: val => {
      // 根据当前数据确定标注容器宽高，数值位数 * fontSize 作为其宽
      const len = val.toString().length || 2,
        width = (len + 3) * fontSize, // +3 是为了修复数据在标注显示的位置
        height = 50;
      // 因为 symbolRotate 旋转了 90 度，所以宽高位置
      return [height, width];
    },
    label: {
      fontSize,
      color: '#fff',
      position: [fontSize, 10]
    },
    itemStyle: { color: 'green' }, // 标注背景色
    data: [
      {
        name: '某个坐标',
        coord: [len, yAxis], // 某个坐标 标注坐标
        value: `${yAxis}` // 标注值
      }
    ],
    animation: false,
    zlevel: 220,
    z: 220
  };
};

const setEndLabel = seriesData => {
  const len = seriesData.length - 1,
    prefix = '累计收益：',
    fontSize = 12,
    val = seriesData[len] || '',
    offsetX = (val.toString().length + prefix.length) * fontSize * -1,
    offsetY = fontSize * -1;
  console.log('val ===', val);
  console.log('width ===', offsetX);
  return {
    show: true,
    offset: [offsetX, offsetY],
    color: '#3d3ae9', // #3d3ae9 蓝色
    formatter: params => `${prefix}${params.value}`
  };
};

// x 坐标数据
const axisData = [
  '2022-04-12',
  '2022-04-13',
  '2022-04-14',
  '2022-04-15',
  '2022-04-16',
  '2022-04-17',
  '2022-04-18',
  '2022-04-19',
  '2022-04-20',
  '2022-04-21'
];

// y 坐标数据
const seriesData = [10, 22, -3, 0.01, 37, 14, 26, -20, 38, 49];
const xAxisData = setAxisLabelAlign(axisData),
  markPoint = setMarkPoint(seriesData),
  endLabel = setEndLabel(seriesData);
const { yMin, yMax, yInterval } = getYAxisMinMaxInterval(seriesData),
  areaStyle = setAreaStyle(yMin, yMax);
const yAxisLabelFormatter = v => formatNumber(v, { min: yMin, max: yMax });
// echart 配置项
const option = {
  title: {
    text: '累计收益曲线',
    left: 'center'
  },
  // 坐标系
  grid: {
    show: false,
    left: 16,
    right: 16,
    top: 24,
    bottom: 16,
    containLabel: true
    // borderWidth: 0 // 边框
  },
  tooltip: { show: false },
  xAxis: {
    show: false, // 不显示坐标轴线、坐标轴刻度线和坐标轴上的坐标值
    type: 'category',
    boundaryGap: false,
    axisTick: { show: false }, // 坐标轴刻度线
    splitLine: { show: false }, // 坐标轴网格辅助线
    axisPointer: {
      show: true,
      snap: true,
      label: {
        show: true,
        margin: 0,
        backgroundColor: 'rgba(102, 102, 102)',
        formatter: params => {
          // console.log('formatter params ===', params);
          if (params.seriesData && params.seriesData[0]) {
            const { data } = params.seriesData[0];
            this.title = data;
          }
          return params.value;
        }
      }
    },
    // 坐标轴线
    axisLine: {
      show: false,
      lineStyle: { color: '#333' }
    },
    // 坐标轴线坐标值
    axisLabel: {
      show: true,
      // margin: 16,
      color: '#999',
      fontSize: 10,
      interval: 1000000, // 只展示 首尾坐标值
      showMinLabel: true,
      showMaxLabel: true
    },
    data: xAxisData
  },
  yAxis: {
    type: 'value',
    animation: false,
    min: yMin, // y 轴最小值
    max: yMax, // y 轴最大值
    interval: yInterval, // y 轴坐标之间的间距
    name: '(元)', // 坐标轴名称
    nameLocation: 'end', // 坐标轴名称显示位置
    nameGap: 10, // 坐标轴名称与轴线之间的距离
    nameTextStyle: {
      color: '#bbb',
      fontWeight: 400,
      fontSize: 10,
      padding: [0, 60, 0, 0] // css 样式一致 上 右 下 左
    },
    axisTick: { show: false },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#eee'],
        width: 1
      }
    },
    axisPointer: {
      show: true,
      label: {
        show: true,
        margin: 0,
        backgroundColor: 'rgba(102, 102, 102)',
        formatter: params => {
          if (params.seriesData && params.seriesData[0]) {
            const { data } = params.seriesData[0];
            this.title = data;
          }
          return params.value.toFixed(2);
        }
      }
    },
    axisLine: {
      show: false,
      lineStyle: { color: '#333' }
    },
    // eCharts 图表中 y 轴的分段数太多，显示起来不太好看，需要减少分段的数量，一开始设置 interval 属性，一直不生效，因为 y 轴默认划分为 5 个分段
    splitNumber: 1,
    axisLabel: {
      show: true,
      margin: 16,
      color: '#bbb',
      fontSize: 10,
      showMinLabel: true,
      showMaxLabel: true,
      formatter: yAxisLabelFormatter
    }
  },
  series: [
    {
      data: seriesData,
      type: 'line',
      areaStyle,
      symbol: 'circle',
      showSymbol: true,
      symbolSize: 2,
      hoverAnimation: true,
      animationDuration: 10, // 动画时间
      // 折线图的高亮状态
      emphasis: {
        itemStyle: {
          borderwidth: 1.5,
          // borderColor: '#e92424',
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 6
        }
      },
      zlevel: 2,
      markPoint,
      endLabel
    }
  ],
  // 视觉映射 折线图颜色
  visualMap: {
    show: false,
    type: 'piecewise',
    pieces: [
      { lt: 1, color: '#e92424' },
      { gt: 0, color: '#e92424' },
      { lt: 0, color: '#17a129' }
    ]
    // outOfRange: { color: '#e92424' }
  }
};

export default {
  name: 'MyLineChart',
  props: {
    lineData: {
      type: Object,
      default: () => ({
        axisData,
        seriesData
      }),
      validator(val) {
        const validatek = Object.keys(val).every(k =>
          ['axisData', 'seriesData'].includes(k)
        );
        const validatev = Object.values(val).every(k => Array.isArray(k));
        return validatek && validatev;
      }
    }
  },
  data() {
    return {
      title: '',
      chartInstance: null,
      option: {}
    };
  },
  watch: {
    lineData: {
      handler(val) {
        this.getOption(val);
        this.$nextTick(() => {
          this.chartInstance.setOption(this.option);
          setTimeout(() => {
            this.chartInstance.setOption({
              series: [{ endLabel: { show: true } }]
            });
          }, 10);
        });
      }
    }
  },
  mounted() {
    this.getOption(this.lineData);
    this.initLine();
  },
  beforeDestroy() {
    // 实例销毁之前调用
    if (!this.chartInstance) return;
    // this.chartInstance.dispose();
    this.chartInstance = null;
  },
  methods: {
    mousedownListener(params) {
      // console.log('mousedownListener params ===', params);
      this.$nextTick(() => {
        this.chartInstance.setOption({
          title: { text: '累计收益曲线' }
        });
        this.chartInstance.setOption({
          xAxis: { axisPointer: { status: 'show' } }
        });
      });
    },
    mouseupListener(params) {
      // console.log('mouseupListener params ===', params);
      this.$nextTick(() => {
        this.chartInstance.setOption({
          title: { text: `${params.name} 累计盈亏：${params.value}` }
        });
        this.chartInstance.setOption({
          xAxis: { axisPointer: { status: 'hide' } }
        });
        this.chartInstance.dispatchAction({ type: 'downplay' });
      });
    },
    getData() {
      return Promise.resolve({ axisData, seriesData });
    },
    getOption(data) {
      console.log('chart getOption data ===', data);
      const { axisData = [], seriesData = [] } = data || {};
      const xAxisData = setAxisLabelAlign(axisData),
        yName = '(元)',
        // titleText = '累计收益曲线',
        titleText = '',
        markPoint = setMarkPoint(seriesData),
        endLabel = setEndLabel(seriesData);

      const { yMin, yMax, yInterval } = getYAxisMinMaxInterval(seriesData),
        areaStyle = setAreaStyle(yMin, yMax);
      console.log('yMax ===', yMax);
      console.log('yMin ===', yMin);
      const yAxisLabelFormatter = v =>
        formatNumber(v, { min: yMin, max: yMax });

      this.option = {
        title: {
          text: titleText,
          left: 'center'
        },
        // 坐标系
        grid: {
          show: false,
          left: 16,
          right: 16,
          top: 24,
          bottom: 16,
          containLabel: true
          // borderWidth: 0 // 边框
        },
        tooltip: { show: false },
        xAxis: {
          show: false, // 不显示坐标轴线、坐标轴刻度线和坐标轴上的坐标值
          type: 'category',
          boundaryGap: false,
          axisTick: { show: false }, // 坐标轴刻度线
          splitLine: { show: false }, // 坐标轴网格辅助线
          axisPointer: {
            show: true,
            snap: true,
            label: {
              show: true,
              margin: 0,
              backgroundColor: 'rgba(102, 102, 102)',
              formatter: params => {
                // console.log('formatter params ===', params);
                if (params.seriesData && params.seriesData[0]) {
                  const { data } = params.seriesData[0];
                  this.title = data;
                }
                return params.value;
              }
            }
          },
          // 坐标轴线
          axisLine: {
            show: false,
            lineStyle: { color: '#333' }
          },
          // 坐标轴线坐标值
          axisLabel: {
            show: true,
            // margin: 16,
            color: '#999',
            fontSize: 10,
            interval: 1000000, // 只展示 首尾坐标值
            showMinLabel: true,
            showMaxLabel: true
          },
          data: xAxisData
        },
        yAxis: {
          type: 'value',
          animation: false,
          min: yMin, // y 轴最小值
          max: yMax, // y 轴最大值
          interval: yInterval, // y 轴坐标之间的间距
          name: yName, // 坐标轴名称
          nameLocation: 'end', // 坐标轴名称显示位置
          nameGap: 10, // 坐标轴名称与轴线之间的距离
          nameTextStyle: {
            color: '#bbb',
            fontWeight: 400,
            fontSize: 10,
            padding: [0, 60, 0, 0] // css 样式一致 上 右 下 左
          },
          axisTick: { show: false },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#eee'],
              width: 1
            }
          },
          axisPointer: {
            show: true,
            label: {
              show: true,
              margin: 0,
              backgroundColor: 'rgba(102, 102, 102)',
              formatter: params => {
                if (params.seriesData && params.seriesData[0]) {
                  const { data } = params.seriesData[0];
                  this.title = data;
                }
                return params.value.toFixed(2);
              }
            }
          },
          axisLine: {
            show: false,
            lineStyle: { color: '#333' }
          },
          // eCharts 图表中 y 轴的分段数太多，显示起来不太好看，需要减少分段的数量，一开始设置 interval 属性，一直不生效，因为 y 轴默认划分为 5 个分段
          splitNumber: 1,
          axisLabel: {
            show: true,
            margin: 16,
            color: '#bbb',
            fontSize: 10,
            showMinLabel: true,
            showMaxLabel: true,
            formatter: yAxisLabelFormatter
          }
        },
        series: [
          {
            data: seriesData,
            type: 'line',
            areaStyle,
            symbol: 'circle',
            showSymbol: true,
            symbolSize: 2,
            hoverAnimation: true,
            animationDuration: 10, // 动画时间
            // 折线图的高亮状态
            emphasis: {
              itemStyle: {
                borderwidth: 1.5,
                // borderColor: '#e92424',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 6
              }
            },
            zlevel: 2,
            // markPoint,
            endLabel
          }
        ],
        // 视觉映射 折线图颜色
        visualMap: {
          show: false,
          type: 'piecewise',
          pieces: [
            { lt: 1, color: '#e92424' },
            { gt: 0, color: '#e92424' },
            { lt: 0, color: '#17a129' }
          ]
          // outOfRange: { color: '#e92424' }
        }
      };
    },
    // 折线图
    initLine() {
      // 基于准备好的 dom，初始化 echarts 实例
      const chartInstance = echarts.init(document.getElementById('line-chart'));
      this.chartInstance = chartInstance;
      // 官方并没对 getZr() 方法进行解释，查看github issue 后多用 Echarts 实例的 getZr() 方法监听到整个画布的 click 事件
      // const chartZr = chartInstance.getZr()
      // // myChart.on('downplay', this.mousedownListener);
      // // myChart.on('highlight', this.mouseupListener);
      // // chartInstance.on('mouseover', this.mouseupListener)
      // // chartInstance.on('mouseout', this.mousedownListener)
      // chartInstance.on('mouseup', this.mouseupListener)
      // chartInstance.on('mousedown', this.mousedownListener)
      // chartZr.on('mouseout', this.mousedownListener)
      // 赋值
      chartInstance.setOption(this.option);
      // 根据页面大小自动响应图表大小
      window.addEventListener('resize', () => {
        chartInstance.resize();
      });
    }
  }
};
</script>
<style scoped>
#line-chart {
  height: 540px;
  color: #17a129;
  color: #e92424;
  color: rgba(102, 102, 102);

  color: rgba(215, 57, 57, 1);
  color: rgba(255, 156, 156, 0.57);
  color: rgba(152, 234, 183, 0.57);
  color: rgba(43, 177, 94, 1);
  color: rgba(0, 0, 0, 0.3);
}
</style>
