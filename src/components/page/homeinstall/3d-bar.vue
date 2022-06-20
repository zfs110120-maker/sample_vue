<template>
  <div ref="echart" class="echart"></div>
</template>

<script>
import * as d3 from "d3";
import * as d3X3d from "d3-x3d";


export default {
  data() {
    return {
      myEchart: null,
      step: -20,
      sum:0,    //x轴的总和
      timer:null,
      zAxis3D:{},
      end: 20
    };
  },
  props: {
    chartData: {
      type: Array,
      default: () => [],
    },
    phaseShiftNum: {
      type: Number,
      default: 0
    },
    unit:{
      type: String,
    }
  },
  computed: {
    showData({ chartData }) {
      let list = []
      // chartData = chartData[0]
      let { xdata, ydata, zdata } = chartData
      let num = 0
      if(this.unit === 'mV'){
        num = 0
      }else{
        num = 80
      }
      chartData.forEach((item, index) => {
        list.push([item.xpoint, item.ypoint, item.zpoint + num])
      })
      // for (let i = 0; i < xdata.length; i++) {
      //   list.push([xdata[i], ydata[i], zdata[i]+num])
      // }
      if(this.unit != 'mV'){
        list.unshift([0, 0, 70])
      }
      return list
    },
    echartOptions() {

    },
  },
  watch: {
    echartOptions(val) {
      this.myChart.setOption(val, true);
    },
    "unit":{
      handler(){
        clearInterval(this.timer);
        this.timer = null;
        this.step = -20;
        // this.autoMove(data.length);
        this.循环前进();
      }
    }
  },
  mounted() {
    this.init();
    let data = []
    this.chartData.forEach((item, index) => {
      data.push(item.xpoint)
    })
    // let data = this.chartData[0].xdata;
    if(data.length>0){
      this.sum = data[data.length-1]
      this.循环前进();
    }
  },
  methods: {
    循环前进() {
      this.timer = setInterval(() => {
        this.step += 3
        if(this.step > this.sum*10) this.step = -20
      }, 300);
      this.$once("hook:beforeDestroy", () => {
        clearInterval(this.timer);
        this.timer = null;
      });
    },
    init() {
      let myChart = echarts.init(this.$refs.echart);
      this.myChart = myChart;
      var option = this.echartOptions;
      this.myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
.echart {
  height: 100%;
}
</style>
