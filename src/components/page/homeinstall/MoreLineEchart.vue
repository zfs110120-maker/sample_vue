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
      showPoint: []
    };
  },
  computed: {
    xAxisData({ chartData }) {
      return chartData.t;
    },
    yAxisData({ chartData }) {
      return chartData.channels
    },
    point({ chartData }) {
      let data = chartData.channels.map((item) => chartData.t.indexOf(item.head_x));
      return data;
    },
    echartOptions({ showY, xAxisData, showPoint }) {
      let setData = (index) => {
        let data = showY[index].y;
        let _index = showPoint[index];
        data = [...data];
        data[_index] = {
          value: data[_index],
          symbol: "circle",
          itemStyle: {
            color: "red",
            borderWidth: 100,
            borderType: "solid",
          },
        };
        return data;
      };
      let option = {
        dataZoom: [{ type: "inside", xAxisIndex: "all" },
        { type: "slider", yAxisIndex: 0, left: '7.5%',
        borderColor: 'transparent',
        borderCap: 'round',
        fillerColor: 'rgb(255,153,0)',
        handleIcon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5M36.9,35.8h-1.3z M27.8,35.8 h-1.3H27L27.8,35.8L27.8,35.8z',// 画一个圆形
        handleSize: '100%',
        handleStyle: {
          color: '#3E80BD',
          borderWidth: 0
        },
        width: 10,
        height: 550,
        backgroundColor: 'rgba(37, 46, 100, 0.8)', //两边未选中的滑动条区域的颜色
        filterMode: 'filter',
        top: 'center'},
        { type: "slider", yAxisIndex: 1, left: '3%',
          borderColor: 'transparent',
          borderCap: 'round',
          fillerColor: 'rgb(0,0,255)',
          handleIcon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5M36.9,35.8h-1.3z M27.8,35.8 h-1.3H27L27.8,35.8L27.8,35.8z',// 画一个圆形
          handleSize: '100%',
          handleStyle: {
            color: '#3E80BD',
            borderWidth: 0
          },
          width: 10,
          height: 550,
          backgroundColor: 'rgba(37, 46, 100, 0.8)', //两边未选中的滑动条区域的颜色
          filterMode: 'filter',
          top: 'center' },
        { type: "slider", yAxisIndex: 2,
          left: '91%',
          borderColor: 'transparent',
          borderCap: 'round',
          fillerColor: '#ea5757',
          handleIcon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5M36.9,35.8h-1.3z M27.8,35.8 h-1.3H27L27.8,35.8L27.8,35.8z',// 画一个圆形
          handleSize: '100%',
          handleStyle: {
            color: '#3E80BD',
            borderWidth: 0
          },
          width: 10,
          height: 550,
          backgroundColor: 'rgba(37, 46, 100, 0.8)', //两边未选中的滑动条区域的颜色
          filterMode: 'filter',
          top: 'center'},
          { type: "slider", yAxisIndex: 3, left: '96%',
          borderColor: 'transparent',
          borderCap: 'round',
          fillerColor: 'rgb(0,255,0)',
          handleIcon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5M36.9,35.8h-1.3z M27.8,35.8 h-1.3H27L27.8,35.8L27.8,35.8z',// 画一个圆形
          handleSize: '100%',
          handleStyle: {
            color: '#3E80BD',
            borderWidth: 0
          },
          width: 10,
          height: 550,
          backgroundColor: 'rgba(37, 46, 100, 0.8)', //两边未选中的滑动条区域的颜色
          filterMode: 'filter',
          top: 'center' }],
        yAxis: [
            {
                type: 'value',
                // 让表格的刻度向靠里侧显示
                name: 'mV',
                min: '-5000',
                max: 5000,
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
                      color: 'rgb(255,153,0)',
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
                name: 'mV',
                min: '-5000',
                max: 5000,
                axisTick: {
                  show: true,
                  inside: false,
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: 'rgb(0,0,255)',
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
                name: 'mV',
                min: '-5000',
                max: 5000,
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
                    color: '#ea5757',
                    width: 3,
                  },
                },
                splitLine: {
                  show: false, //想要不显示网格线，改为false
                },
            },
            {
                type: 'value',
                name: 'mV',
                min: '-5000',
                max: 5000,
                axisTick: {
                show: true,
                inside: true,
                },
                offset: 60,
                axisLabel: {
                  inside: true,
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: 'rgb(0,255,0)',
                    width: 3,
                  }
                },
                splitLine: {
                    show: false, //想要不显示网格线，改为false
                },
            }
        ],
        xAxis: {
            name: 'ns',
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
            }
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
              data: setData(0),
              name: '通道1',
              // 设置参数对应的y坐标轴的索引
              yAxisIndex: 0,
              type: 'line',
              // 曲线平滑设置
              smooth: true,
              symbolSize: (data, item) => {
                let index = item.dataIndex;
                if (index === showPoint[0]) return 30;
                return 2;
              }
            },
            {
              data: setData(1),
              name: '通道2',
              // 设置所在曲线对应的y坐标轴的索引
              yAxisIndex: 1,
              type: 'line',
              // 曲线平滑设置
              smooth: true,
              symbolSize: (data, item) => {
                let index = item.dataIndex;
                if (index === showPoint[1]) return 30;
                return 2;
              }
            },
            {
              data: setData(2),
              name: '通道3',
              // 设置参数对应的y坐标轴的索引
              yAxisIndex: 2,
              type: 'line',
              // 曲线平滑设置
              smooth: true,
              symbolSize: (data, item) => {
                let index = item.dataIndex;
                if (index === showPoint[2]) return 30;
                return 2;
              }
            },
            {
              data: setData(3),
              name: '通道4',
              // 设置参数对应的y坐标轴的索引
              yAxisIndex: 3,
              type: 'line',
              // 曲线平滑设置
              smooth: true,
              symbolSize: (data, item) => {
                let index = item.dataIndex;
                if (index === showPoint[3]) return 30;
                return 2;
              }
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
        color: ['rgb(255,153,0)', 'rgb(0,0,255)', '#ea5757', 'rgb(0,255,0)']
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
    point: {
      handler(val) {
        this.showPoint = val;
      },
      immediate: true,
    },
    yAxisData: {
      handler(val) {
        this.showY = val;
      },
      immediate: true,
    },
    echartOptions(val) {
      this.myEchart.setOption(val);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let myEchart = echarts.init(this.$refs.echart);
      this.myEchart = myEchart;
      myEchart.setOption(this.echartOptions);
      myEchart.on("click", (data) => {
        let componentIndex = data.componentIndex;
        this.$set(this.showPoint, componentIndex, data.dataIndex);
        // this.$emit("selectedComponent", componentIndex);
        this.$emit("selectedComponent1", data); //大波浪
      });
    }
  },
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
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
