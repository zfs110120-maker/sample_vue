<template>
  <div ref="echart" class="echart"></div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-gl";
import { color, number } from 'echarts';


export default {
  data() {
    return {
      myEchart: null,
      step: 0,
      stepNum: 30,
      sum:0,    //x轴的总和
      timer:null,
      zAxis3D:{},
      end: 20,
      initValue: -10,
      echartData: [],
      endIndex: 0,
      startIndex: 0
    };
  },
  props: {
    chartData: {
      type: Object,
      default: () => {},
    },
    unit:{
      type: String,
    }
  },
  computed: {
    showData({ chartData }) {
      let list = []
      let { x, y, z } = chartData
      let num = 0
      if (this.unit === 'mV') {
        num = 0
      } else {
        num = 80
      }
      for (let i = 0; i < x.length; i++) {
        list.push([x[i], y[i], z[i] + num])
      }
      // if(this.unit != 'mV'){
      //   list.unshift([0, 0, 70])
      // }
      return list
    },
    echartOptions({step}) {
      // let min = this.chartData.x[step]
      // let max = this.chartData.x[step + this.stepNum]
      let min = this.initValue.toFixed(1)
      let max = (this.initValue + 10).toFixed(1)
      // this.echartData = []
      // const echartData = this.showData.slice(step, step + this.stepNum);
      // this.showData.forEach(item => {
      //   if (this.initValue < item[0] < this.initValue + 10) {
      //     this.echartData.push(item);
      //   }
      // })
      for (let i = this.endIndex; i < this.showData.length; i++) {
        if (this.showData[i][0] > this.initValue + 10) {
          this.endIndex = i
          break
        }
      }
      for (let i = this.startIndex; i < this.showData.length; i++) {
        if (this.showData[i][0] >= this.initValue) {
          this.startIndex = i
          break
        }
      }
      this.echartData = this.showData.slice(this.startIndex, this.endIndex)
      if(this.unit === 'mV'){
		    this.zAxis3D = {
          name: '',
          type: "value",
          splitNumber: 5,
          interval: 2500,
          splitLine: { show: false },
          axisLabel:{
            margin: 15,
            formatter:(parmas)=>{
              return parmas
            }
          },
        }
      }else{
		    this.zAxis3D = {
          name: '',
          type: "value",
          splitNumber: 3,
          splitLine: { show: false },
          axisLabel:{
            margin: 15,
            interval:5,
            formatter:(parmas)=>{
              return parmas - 80
            }
          }
        }
      }
      let options = {
        xAxis3D: {
          type: "value",
          name: '',
          containLabel: true,
          splitNumber: 3,
          min,
          max,
          axisLabel:{
            margin: 28
          },
          splitLine: { show: false }
        },
        yAxis3D: {
          name: '',
          type: "value",
          min: 0,
          max: 360,
          interval: 90,
          axisLabel:{
            margin: 5
          },
        },
        zAxis3D: this.zAxis3D,
        grid3D: {
          boxWidth: 150,
          boxHidth: 180,
          boxDepth: 180,
          viewControl: {
            rotateSensitivity: 0,  // 不能旋转
            zoomSensitivity: 0, // 不能缩放
            beta: 55,
            projection: "perspective",
            distance: 300,
            alpha: 15,
            animation: true
          },
          top: -40,
          axisPointer: {
            show: false,
          }
        },
        series: [
          {
            type: "bar3D",
            barSize: 3,
            data: this.echartData,
            grid3DIndex:1,
            label: { show: false },
            itemStyle: {
              color: ({data}) => {
                let x = data[0];
                let color1 = ""
                if(this.unit === 'mV'){
                  if((data[2]>0 && data[2]<400)){
                    color1 = "#0040FF"
                  }else if((data[2]>400&&data[2]<800)){
                    color1 = "#0174DF"
                  }else if((data[2]>800&&data[2]<1200)){
                    color1 = "#01A9DB"
                  }else if((data[2]>1200&&data[2]<1600)){
                    color1 = "#01DFA5"
                  }else if((data[2]>1600&&data[2]<2000)){
                    color1 = "#01DF74"
                  }else if((data[2]>2000&&data[2]<2400)){
                    color1 = "#01DF3A"
                  }else if((data[2]>2400&&data[2]<2800)){
                    color1 = "#01DF01"
                  }else if((data[2]>2800&&data[2]<3200)){
                    color1 = "#3ADF00"
                  }else if((data[2]>3200&&data[2]<3600)){
                    color1 = "#74DF00"
                  }else{
                    color1 = "#D7DF01"
                  }
                }else{
                  if(data[2]>= 0 && data[2]< 10){
                    color1 = "#0040FF"
                  }else if(data[2]>= 10 && data[2]< 20){
                    color1 = "#01A9DB"
                  }else if(data[2]>= 20 && data[2]< 30){
                    color1 = "#01DFA5"
                  }else if(data[2]>= 30 && data[2]< 40){
                    color1 = "#01DF74"
                  }else if(data[2]>= 40 && data[2]< 50){
                    color1 = "#01DF3A"
                  }else if(data[2]>= 50 && data[2]< 60){
                    color1 = "#3ADF00"
                  }else if(data[2]>= 60 && data[2]< 70){
                    color1 = "#74DF00"
                  }else{
                    color1 = "#D7DF01"
                  }
                }
                return color1
              },
            },
            emphasis: {
              label: {
                show: false
              }
            },
            animation: true
          },
        ]
      };
      return options;
    },
  },
  watch: {
    echartOptions(val) {
      this.myChart.setOption(val);
    },
    "unit":{
      handler(){
        clearInterval(this.timer);
        this.timer = null;
        this.step = 0;
        // this.autoMove(data.length);
        this.autoMove();
      }
    }
  },
  mounted() {
    this.init();
    let data = this.chartData.x
    if(data.length>0){
      this.sum = data[data.length-1]
      this.autoMove();
    }
  },
  methods: {
    autoMove() {
      this.timer = setInterval(() => {
        // const stepNum = this.chartData.x.length - 1 - this.step
        // if (stepNum < this.stepNum) {
        //   this.stepNum = stepNum
        // }
        // this.step += this.stepNum;
        // if(this.step >= this.chartData.x.length - 1) this.step = 0
        this.initValue += 0.2
        if (this.initValue > this.showData[this.showData.length - 1][0]) {
          this.initValue = 0
          this.startIndex = 0
          this.endIndex = 0
          this.echartData = []
        }
      }, 200);
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
