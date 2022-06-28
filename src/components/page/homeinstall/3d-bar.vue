<template>
  <div ref="echart" id="chartholder" class="echart"></div>
</template>

<script>
import * as d3 from "d3";
import * as x3d from "d3-x3d";

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
      type: Object,
      default: () => {},
    },
    unit:{
      type: String,
    }
  },
  computed: {
    // showData({ chartData }) {
    //   let list = []
    //   // chartData = chartData[0]
    //   let { xdata, ydata, zdata } = chartData
    //   let num = 0
    //   if(this.unit === 'mV'){
    //     num = 0
    //   }else{
    //     num = 80
    //   }
    //   chartData.forEach((item, index) => {
    //     list.push([item.xpoint, item.ypoint, item.zpoint + num])
    //   })
    //   // for (let i = 0; i < xdata.length; i++) {
    //   //   list.push([xdata[i], ydata[i], zdata[i]+num])
    //   // }
    //   if(this.unit != 'mV'){
    //     list.unshift([0, 0, 70])
    //   }
    //   return list
    // },
    echartOptions() {
    },
  },
  watch: {
    echartOptions(val) {
      // this.myChart.setOption(val, true);
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
      var width = 500;
      var height = 500;

      // Generate some data
      var data = [
        {
          key: "UK",
          values: [
            { key: "Apples", value: 9 },
            { key: "Oranges", value: 3 },
            { key: "Pears", value: 5 },
            { key: "Bananas", value: 7 }
          ]
        },
        {
          key: "France",
          values: [
            { key: "Apples", value: 5 },
            { key: "Oranges", value: 4 },
            { key: "Pears", value: 6 },
            { key: "Bananas", value: 2 }
          ]
        }
      ];
      console.log(data)

      // Declare the bar chart component
      var viewpoint = x3d.default.component.viewpoint();
      var component = x3d.default.chart.barChartMultiSeries();

      // Create scene
      var scene = d3.select("#chartholder")
        .append("X3D")
        .attr("id", "axis")
        .attr("width", width + "px")
        .attr("height", height + "px")
        .append("Scene");

      scene.call(viewpoint);

      console.log(scene)

      // scene.append("Group").call(axis);

      var chart = scene.append("Group")
        .attr("class", "chart");
      chart.datum(data).call(component);
    },
  },
};
</script>

<style scoped>
.echart {
  height: 400px;
  width: 400px;
}
</style>
