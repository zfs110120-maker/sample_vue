<template>
<div class="content" :class="whatSize === 2 && 'content-top'">
  <div ref="echart" class="echart"></div>
  <!-- <div class="mv" v-show="whatSize === 2">mV</div> -->
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
      return chartData.t;
    },
    yAxisData({ chartData }) {
      return chartData.channels;
    },
    point({ chartData }) {
      // let data = []
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
      let setAxisLabel = (seriesIndex) => {
        return {
          interval: (index) => {
            return index === showPoint[seriesIndex];
          },
          formatter: ""
        };
      };
      let name1 = this.whatSize == 2 ? 'ns' : '';
      let yname = this.whatSize == 2 ? 'mV' : '';
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
      this.dataZoom = this.whatSize == 2 ? [{ type: "inside", xAxisIndex: "all" }] : [];
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
      isShow = true

      let options = {
        tooltip: this.tooltip,
        axisPointer: this.axisPointer,
        dataZoom: this.dataZoom,
        grid: this.grid,
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
            name: yname,
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
              // 黄色
              color: "rgb(255,153,0)",
            },
            symbolSize: (data, item) => {
              let index = item.dataIndex;
              if (index === showPoint[0]) return 10;
              return 2;
            },
          },
          {
            data: setData(1),
            type: "line",
            yAxisIndex: 1,
            xAxisIndex: 1,
            itemStyle: {
              // 蓝色
              color: "rgb(0,0,255)",
            },
            symbolSize: (data, item) => {
              let index = item.dataIndex;
              if (index === showPoint[1]) return 10;
              return 2;
            },
          },
          {
            data: setData(2),
            type: "line",
            yAxisIndex: 2,
            xAxisIndex: 2,
            itemStyle: {
              // 红色
              color: "#ea5757",
            },
            symbolSize: (data, item) => {
              let index = item.dataIndex;
              if (index === showPoint[2]) return 10;
              return 2;
            },
          },
          {
            data: setData(3),
            type: "line",
            yAxisIndex: 3,
            xAxisIndex: 3,
            itemStyle: {
              // 绿色
              color: "rgb(0,255,0)",
            },
            symbolSize: (data, item) => {
              let index = item.dataIndex;
              if (index === showPoint[3]) return 10;
              return 2;
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
      if (this.whatSize == 2) {
        myEchart.on("click", (data) => {
          let componentIndex = data.componentIndex;
          this.$set(this.showPoint, componentIndex, data.dataIndex);
          // this.$emit("selectedComponent", componentIndex);
          this.$emit("selectedComponent1", data); //大波浪
        });
      }
    },
    xData() {
      let arr = [];
      let min = this.chartData.t[0], max = this.chartData.t[this.chartData.t.length-1];
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
  position: relative;
  padding: 0 32px;
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
