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
    echartOptions({step}) {
      let min = step / 10
      let max = (step + 20)/10
      if(this.unit === 'mV'){
		    this.zAxis3D = {
          name: '',
          type: "value",
          splitNumber: 3,
          data: [0, 2000],
          axisLabel:{
            margin:40,
            formatter:(parmas)=>{
              return parmas
            }
          },
        }
      }else{
		    this.zAxis3D = {
          type: "value",
          axisLabel:{
            margin:40,
            min:0,
            max:80,
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
          splitNumber: 5,
          min,
          max,
          axisLabel:{
            margin:20,
            formatter:(value)=>{
              return `{a|${value}}`
            },
            rich:{
              a:{
                width:40,
                height:15,
                backgroundColor:"transparent",
              }
            }
          },
        },
        yAxis3D:{
            name: '',
            type: "value",
            // data:[0,90,180,270,360],
            min: 0,
            max: 360,
          },
        zAxis3D: this.zAxis3D,
        grid3D: {
          boxWidth: 150,
          boxHidth: 180,
          boxDepth: 180,
          viewControl: {
            rotateSensitivity: 0, // 不能旋转
            zoomSensitivity: 0, // 不能缩放
            beta: 65,
            projection: "perspective",
            distance: 280,
            alpha: 15,
          },
          top:-40,
          axisPointer:{
            show:false,
          },
        },
        series: [
          {
            type: "bar3D",
            barSize: 3,
            // shading: 'lambert',
            data: this.showData,
            grid3DIndex:1,
            itemStyle: {
              color: ({data}) => {
                let x = data[0];
                let color1 = ""
                if(x > min && x < max-0.1){
                   if(this.unit === 'mV'){
                      if((data[2]>0 && data[2]<200)){
                        color1 = "#0040FF"
                      }else if((data[2]>200&&data[2]<400)){
                        color1 = "#0174DF"
                      }else if((data[2]>400&&data[2]<600)){
                        color1 = "#01A9DB"
                      }else if((data[2]>600&&data[2]<800)){
                        color1 = "#01DFA5"
                      }else if((data[2]>800&&data[2]<1000)){
                        color1 = "#01DF74"
                      }else if((data[2]>1000&&data[2]<1200)){
                        color1 = "#01DF3A"
                      }else if((data[2]>1200&&data[2]<1400)){
                        color1 = "#01DF01"
                      }else if((data[2]>1400&&data[2]<1600)){
                        color1 = "#3ADF00"
                      }else if((data[2]>1600&&data[2]<1800)){
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
                }else{
                  color1 = [0,0,0, 0.001]
                }
                return color1
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
