<template>
  <div ref="echart" class="echart"></div>
</template>

<script>
import * as echarts from "echarts";

function debounce(callback = () => {}, wait = 200) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
      timer = null;
    }, wait);
  };
}

export default {
  data() {
    return {
      myEchart: null,
      selectedSeriesIndex: 0
    };
  },
  computed: {
    xAxisData({ chartData }) {
      let xData = []
      if (chartData.x) {
        xData = chartData.x
      }
      return xData
    },
    yAxisData({ chartData }) {
      let yData = []
      if (chartData.y) {
        yData = chartData.y
      }
      return yData
    },
    echartOptions({ yAxisData, xAxisData, selectedSeriesIndex}) {
      const setColor = index => {
        let colorMap = {
          0: `rgba(255, 153, 0, ${index === selectedSeriesIndex ? 1 : 0.4})`,
          1: `rgba(0,255,0, ${index === selectedSeriesIndex ? 1 : 0.4})`,
          2: `rgba(0,0,255, ${index === selectedSeriesIndex ? 1 : 0.4})`,
          3: `rgba(255,0,0, ${index === selectedSeriesIndex ? 1 : 0.4})`,
        }
        return colorMap[index]
      }
      let options = {
        brush: {
          xAxisIndex: "all",
          brushLink: "all",
          // 设置框选样式
          brushStyle: {
            borderWidth: 2,
            color: "rgba(255,255,255,0.1)",
            borderColor: "#0A244C",
            borderTop: 0,
            borderBottom: 0,
            borderCap: 'round',
            borderDashOffset: 1,
            borderType: [5, 3],
            borderJoin: 'round'
          },
        },
        toolbox: {
          show: false,
        },
        tooltip: {
          // trigger: "axis",
        },
        axisPointer: {
          link: {
            xAxisIndex: "all", // 实现多个图的贯穿 X 轴提示线
          },
        },
        grid: [
          {left:"26px",right:"40px", top: "10%", height: "20%" },
          {left:"26px",right:"40px", top: "30%", height: "20%" },
          {left:"26px",right:"40px", top: "50%", height: "20%" },
          {left:"26px",right:"40px", top: "70%", height: "20%" },
          {left:"26px",right:"40px", top: "10%", height: "80%" },
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: "all",
            // start: 0,
            // end: 100
          },
        ],
        xAxis: [
          {
            type: "category",
            gridIndex: 0,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            data: xAxisData,
          },
          {
            data: xAxisData,
            type: "category",
            gridIndex: 1,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
          {
            data: xAxisData,
            type: "category",
            gridIndex: 2,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
          {
            data: xAxisData,
            type: "category",
            gridIndex: 3,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
          {
            data: xAxisData,
            gridIndex: 4,
            // show: false,
          },
        ],
        yAxis: [
          { gridIndex: 0, splitNumber: 3, axisLine:{show:true},axisLabel:{show:false}, },
          { gridIndex: 1, splitNumber: 3, axisLine:{show:true},axisLabel:{show:false}, },
          { gridIndex: 2, splitNumber: 3, axisLine:{show:true},axisLabel:{show:false}, },
          { gridIndex: 3, splitNumber: 3, axisLine:{show:true},axisLabel:{show:false}, },
          { gridIndex: 4, splitNumber: 3, axisLine:{show:true},axisLabel:{show:false}, },
        ],

        series: [
          {
            data: yAxisData[0],
            type: "line",
            yAxisIndex: 0,
            xAxisIndex: 0,
            color: setColor(0),
          },
          {
            data: yAxisData[1],
            type: "line",
            yAxisIndex: 1,
            xAxisIndex: 1,
            color: setColor(1),
          },
          {
            data: yAxisData[2],
            type: "line",
            yAxisIndex: 2,
            xAxisIndex: 2,
            color: setColor(2),
          },
          {
            data: yAxisData[3],
            type: "line",
            yAxisIndex: 3,
            xAxisIndex: 3,
            color: setColor(3),
          },
        ],
      };
      return options;
    },
  },
  props: {
    chartData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    echartOptions(val) {
      this.init();
    }
  },
  methods: {
    init() {
      let myEchart = echarts.init(this.$refs.echart);
      myEchart.setOption(this.echartOptions);
      this.myEchart = myEchart
      // 框选的范围发生变化的时候触发, 做了防抖处理
      let brushselectedHeadle = debounce((data) => {
        try {
          // X 轴起始索引数组 [start, end]
          let selectedList = data.batch[0].areas[0].coordRange;
          this.$emit(
            "brushselected",
            selectedList.map((index) => this.xAxisData[index])
          );
        } catch (error) {}
      });
      myEchart.on("brushselected", brushselectedHeadle);

      myEchart.getZr().on('click', data => {
        console.log(data,'pppp');
        let list = [data.offsetX, data.offsetY]
        let index = 0
        // 判断点击的坐标在不在坐标系内
        while(!myEchart.containPixel({gridIndex: index}, list) && index < 4) {
          index++
        }
        // 如果 index > 3, 说明点击的是空白区域
        if(index > 3) return
        // 点击相同通道，不处理
        if(index === this.selectedSeriesIndex) return
        this.$emit("selectedComponent", index);
        this.selectedSeriesIndex = index
      })

      // 初始化默认的框选范围
      myEchart.dispatchAction({
        type: "brush",
        areas: [
          {
            brushType: "lineX",
            coordRange: [100, 200],
            gridIndex: 4,
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
.echart {
  height: 100%;
}
</style>
