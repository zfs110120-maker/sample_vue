<template>
<div class="content" :class="whatSize === 2 && 'content-top'">
  <div ref="echart" class="echart"></div>
  <div class="mv" v-show="whatSize === 2">mV</div>
</div>
</template>

<script>
import * as echarts from "echarts";
import { number } from "echarts";

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
      return chartData.datax;
    },
    yAxisData({ chartData }) {
      let yAxisArr = []
      if (chartData.wave1) {
        yAxisArr.push(chartData.wave1);
      }

      if (chartData.wave2) {
        yAxisArr.push(chartData.wave2);
      }

      if (chartData.wave3) {
        yAxisArr.push(chartData.wave3);
      }

      if (chartData.wave4) {
        console.log(chartData.wave4);
        yAxisArr.push(chartData.wave4);
      }
      return yAxisArr
    },
    point({ chartData }) {
      let data = []

      if (chartData.wave1Pointx) {
        data.push(chartData.datax.indexOf(chartData.wave1Pointx))
      }

      if (chartData.wave2Pointx) {
        data.push(chartData.datax.indexOf(chartData.wave2Pointx))
      }

      if (chartData.wave3Pointx) {
        data.push(chartData.datax.indexOf(chartData.wave3Pointx))
      }

      if (chartData.wave4Pointx) {
        console.log(chartData.wave4Pointx)
        data.push(chartData.datax.indexOf(chartData.wave4Pointx))
      }
      // let data = chartData.map((item) => item.datax.indexOf(item.pointx));
      return data;
    },
    echartOptions({ showY, xAxisData, showPoint }) {
      let setData = (index) => {
        if (!showY[index]) {
          return new Array(xAxisData.length).fill(0)
        }
        let data = showY[index];
        let _index = showPoint[index];
        data = [...data];
        console.log(_index)
        data[_index] = {
          value: data[_index],

          // symbolSize: 20,
          symbol: "circle",
          itemStyle: {
            color: "red",
            borderWidth: 100,
            borderType: "solid",
          },
        };
        return data;
      };
      let setAxisLabel = (seriesIndex) => {
        return {
          interval: (index) => {
            return index === showPoint[seriesIndex];
          },
          formatter: ""
        };
      };
      let name1 = "";
      let isShow = false;
      //小波形
      this.tooltip = {
        trigger: "axis",
        formatter: (parmas) => {
          let str = "";
          let num1 = 0;
          let num = 0;
          parmas.forEach((item) => {
            if (!(item.data.toString() == number)) {
              num1 = Number(item.name).toFixed(1);
              num = item.data.toFixed(1);
              str += `${num1}</br>${item.marker}:${num}</br>`;
            }
          });
          return str;
        },
      };
      this.axisPointer = {
        link: {
          xAxisIndex: "all", // 实现多个图的贯穿 X 轴提示线
        },
      };
      this.dataZoom = [{ type: "inside", xAxisIndex: "all" }];
      this.axisLine = { show: true };
      this.axisLabel = { show: true };
      this.grid = [
        {left:"60px",right:"40px", top: "3%", height: "21.2%" },
        {left:"60px",right:"40px", top: "26%", height: "21.2%" },
        {left:"60px",right:"40px", top: "49%", height: "21.2%" },
        {left:"60px",right:"40px", top: "72%", height: "21.2%" },
        {left:"60px",right:"40px", top: "14%", height: "81%" },
        {left:"60px",right:"40px", top: "95%", height: "1%" },
      ];
      name1 = "";
      isShow = true

      let options = {
        tooltip: this.tooltip,
        axisPointer: this.axisPointer,
        grid: this.grid,
        dataZoom: this.dataZoom,
        xAxis: [
          {
            type: "category",
            gridIndex: 0,
            axisTick: {
              show: false,
            },
            axisLabel: setAxisLabel(0),
            data: xAxisData,
            axisLine: {
              lineStyle: {
                color: "#e0e6f1",
              },
            },
          },
          {
            data: xAxisData,
            type: "category",
            gridIndex: 1,
            axisLabel: setAxisLabel(1),
            axisLine: {
              lineStyle: {
                color: "#e0e6f1",
              },
            },
          },
          {
            data: xAxisData,
            type: "category",
            gridIndex: 2,
            axisLabel: setAxisLabel(2),
            axisLine: {
              lineStyle: {
                color: "#e0e6f1",
              },
            },
          },
          {
            data: xAxisData,
            type: "category",
            gridIndex: 3,
            axisLabel: setAxisLabel(3),
            axisLine: {
              lineStyle: {
                color: "#e0e6f1",
              },
            },
          },
          {
            // data: this.xData(),
            data:xAxisData,
            gridIndex: 4,
            name: name1,
            nameGap: 10,
            nameTextStyle: { fontSize: 20 },
            show:false
          },
          {
            data: this.xData(),
            name: name1,
            nameGap: 10,
            nameTextStyle: { fontSize: 20 },
            gridIndex: 5,
            position:"bottom",
            show:isShow
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            splitNumber: 3,
            axisLine: this.axisLine,
            axisLabel: this.axisLabel,
          },
          {
            gridIndex: 1,
            splitNumber: 3,
            axisLine: this.axisLine,
            axisLabel: this.axisLabel,
          },
          {
            gridIndex: 2,
            splitNumber: 3,
            axisLine: this.axisLine,
            axisLabel: this.axisLabel,
          },
          {
            gridIndex: 3,
            splitNumber: 3,
            axisLine: this.axisLine,
            axisLabel: this.axisLabel,
          },
          {
            gridIndex: 4,
            splitNumber: 3,
            axisLine: this.axisLine,
            axisLabel: this.axisLabel,
          },
          {
            gridIndex: 5,
            splitNumber: 3,
            axisLine: this.axisLine,
            axisLabel: this.axisLabel,
          },
        ],
        series: [
          {
            data: setData(0),
            type: "line",
            yAxisIndex: 0,
            xAxisIndex: 0,
            itemStyle: {
              color: "rgb(255,153,0)",
            },
            symbolSize: (data, item) => {
              let index = item.dataIndex;
              if (index === showPoint[0]) return 10;
              return 8;
            },
          },
          {
            data: setData(1),
            type: "line",
            yAxisIndex: 1,
            xAxisIndex: 1,
            itemStyle: {
              color: "rgb(0,255,0)",
            },
            symbolSize: (data, item) => {
              let index = item.dataIndex;
              if (index === showPoint[1]) return 10;
              return 8;
            },
          },
          {
            data: setData(2),
            type: "line",
            yAxisIndex: 2,
            xAxisIndex: 2,
            itemStyle: {
              color: "rgb(0,0,255)",
            },
            symbolSize: (data, item) => {
              let index = item.dataIndex;
              if (index === showPoint[2]) return 10;
              return 8;
            },
          },
          {
            data: setData(3),
            type: "line",
            yAxisIndex: 3,
            xAxisIndex: 3,
            itemStyle: {
              color: "rgb(255,0,0)",
            },
            symbolSize: (data, item) => {
              let index = item.dataIndex;
              if (index === showPoint[3]) return 10;
              return 8;
            },
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
    whatSize: {
      type: Number,
    },
  },
  watch: {
    point: {
      handler(val) {
        this.showPoint = val;
        console.log(this.showPoint);
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
        console.log(data);
        let componentIndex = data.componentIndex;
        this.$set(this.showPoint, componentIndex, data.dataIndex);
        // this.$emit("selectedComponent", componentIndex);
        this.$emit("selectedComponent1", data); //大波浪
      });
    },
    xData() {
      let arr = [];
      let min = this.chartData.datax[0], max = this.chartData.datax[this.chartData.datax.length-1];
      min = Math.floor(min);
      max = Math.ceil(max);
      for (let i = min; i < max; i++) {
        arr.push(i);
      }
      return arr;
    },
  },
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 32px;
  padding-top: 40px;
}

.content-top {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 32px;
  margin-top: 128px;
}

.echart {
  height: 100%;
}
.mv {
  position: absolute;
  top: 0;
  left: 50px;
}
</style>
