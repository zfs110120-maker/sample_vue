<template>
<div class="content">
  <div ref="echart" class="echart"></div>
</div>
</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      myEchart: null,
      showY: [],
      seriesIndex: null,
      isMove: false,
      dataIndex: null,
      dataValue: null,
      showPoint: [],
      tooltip: {},
      axisPointer: {},
      dataZoom: [],
      axisLine: {},
      axisLabel: {},
      grid:[]
    };
  },
  computed: {
    xAxisData({ chartData }) {
      return chartData.t;
    },
    yAxisData({ chartData }) {
      return chartData.channels
    },
    echartOptions({ xAxisData, yAxisData }) {
      let option = {
        dataZoom: [{ type: "inside", xAxisIndex: "all" }],
        yAxis: [
            {
                type: 'value',
                // 让表格的刻度向靠里侧显示
                axisTick: {
                  show: true,
                  inside: true,
                },
                axisLabel: {
                  inside: true,
                },
                // 设置刻度线的颜色等样式
                axisLine: {
                show: true,
                  lineStyle: {
                      color: 'red',
                      width: 3,
                  },
                },
                splitLine: {
                    show: true, //想要不显示网格线，改为false
                    lineStyle: {
                        // 设置网格为虚线
                        type: 'dashed',
                    },
                },
            },
            {
                type: 'value',
                axisTick: {
                  show: true,
                  inside: false,
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: 'orange',
                    width: 3,
                  },
                },
                offset: -1320,
                splitLine: {
                    show: false, //想要不显示网格线，改为false
                },
            },
            {
                type: 'value',
                axisTick: {
                show: true,
                inside: true,
                },
                axisLabel: {
                inside: true,
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: 'green',
                    width: 3,
                  },
                },
                splitLine: {
                  show: false, //想要不显示网格线，改为false
                },
            },
            {
                type: 'value',
                axisTick: {
                show: true,
                inside: true,
                },
                offset: 70,
                axisLabel: {
                  inside: true,
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: 'blue',
                    width: 3,
                  }
                },
                splitLine: {
                    show: false, //想要不显示网格线，改为false
                },
            }
        ],
        xAxis: {
            name: '',
            data: xAxisData,
            // boundaryGap: false, //x下标在刻度处显示
            splitLine: {
                show: true, //想要不显示网格线，改为false
                lineStyle: {
                    // 设置网格为虚线
                    type: 'dashed',
                },
            },
            // splitArea: { show: true }, //保留网格区域
            // 设置刻度线的颜色等样式
            axisLine: {
                lineStyle: {
                    color: 'black',
                    width: 1,
                },
            },
        },
        // 调整表格两边空白的区域
        grid: {
            // 左侧
            x: '5%',
            // 上部
            // y: 25,
            // 右侧
            x2: '5%',
            // 下部
            // y2: 35
        },

        series: [
            {
                // 曲线数据配置
                data: yAxisData[0].y,
                // data: [[-10,0],[50,50],[100,100],[200,2000]],
                // data: [[0,0],[50,50],[100,100],[200,-10]],
                // 曲线名
                name: '通道1',
                // 设置参数对应的y坐标轴的索引
                yAxisIndex: 0,
                type: 'line',
                // 曲线平滑设置
                smooth: true,
            },
            {
                data: yAxisData[1].y,
                // 曲线名
                name: '通道2',
                // 设置所在曲线对应的y坐标轴的索引
                yAxisIndex: 1,
                type: 'line',
                // 曲线平滑设置
                smooth: true,
            },
            {
                data: yAxisData[2].y,
                name: '通道3',
                // 设置参数对应的y坐标轴的索引
                yAxisIndex: 2,
                type: 'line',
                // 曲线平滑设置
                smooth: true,
            },
            {
                data: yAxisData[3].y,
                name: '通道4',
                // 设置参数对应的y坐标轴的索引
                yAxisIndex: 3,
                type: 'line',
                // 曲线平滑设置
                smooth: true,
            }
        ],
        tooltip: {
            trigger: 'axis', // 有3个属性值 axis   item   none
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985', //配置展示方块的背景颜色
                },
            },
        },
        legend: {
            // 调整图样文字
            data: ['通道1', '通道2', '通道3', '通道4'],
        },
        color: ['red', 'orange', 'green', 'blue']
      };
      return option;
    },
  },
  props: {
    chartData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let myEchart = echarts.init(this.$refs.echart);
      this.myEchart = myEchart;
      myEchart.setOption(this.echartOptions);
    }
  },
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 32px;
  margin-top: 128px;
}
.echart {
  width: 100%;
  height: 100%;
}
.mv {
  position: absolute;
  top: 0;
  left: 50px;
}
</style>
