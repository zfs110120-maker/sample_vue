<template>
  <div ref="echart" class="echart"></div>
</template>

<script>
import * as echarts from "echarts";
import { mapState, mapMutations} from "vuex";

function debounce(callback = () => { }, wait = 200) {
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
      过滤后的散点图数据: [],
      selectedList: [],
      dataId:[]
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
    }
  },
  computed: {
    // ...mapState(['color']),
    xAxisData({ 过滤后的散点图数据 }) {
      return 过滤后的散点图数据.map((item) => item.x);
    },
    yAxisData({ 过滤后的散点图数据 }) {
      return 过滤后的散点图数据.map((item) => item.y);
    },
    showData({ 过滤后的散点图数据 }) {
      return 过滤后的散点图数据.map((el) => [el.x, el.y]);
    },
    echartOptions() {
      let _this = this;
      let options = {
        brush: {
          toolbox: ["rect"],
          brushMode:'multiple',
          throttleDelay:"debounce"
        },
        toolbox: {
          feature: {
            myFilterInterferenceData: {
              show: true,
              title: '滤波',
              icon: 'image://https://res.cdn.changbaimg.com/-/187f951aae87f2ff/de-interfere.png',
              onclick: data => {
                // if (!this.selectedList.length) return
                this.ilterInterferenceData();
                this.scatterIdsend();
              }
            },
            brush: {
              type: ['rect'],
              icon: {
                rect: 'image://https://res.cdn.changbaimg.com/-/0d5a78d0dd336e9d/circle-select.png'
              },
              title: {
                rect: '圈选'
              }
            },
            myFilterSelectd: {
              show: true,
              title: '删除',
              icon: 'image://https://res.cdn.changbaimg.com/-/4e349a198ec01e63/delete.png',
              onclick: () => {
                if (!this.selectedList.length) return
                let selectedIdMap = {}
                this.selectedList.forEach(el => {
                  selectedIdMap[el.id] = true
                })
                this.过滤后的散点图数据 = this.chartData.filter(el => !selectedIdMap[el.id]);
                this.scatterIdsend();
              }
            },
            myFilter: {
              show: true,
              title: '保留',
              icon: 'image://https://res.cdn.changbaimg.com/-/057d97ff7f3bae8c/retain.png',
              onclick: data => {
                if (!this.selectedList.length) return
                if (this.selectedList.length) this.过滤后的散点图数据 = this.selectedList
                this.scatterIdsend();
              }
            },
            myDefaultData: {
              show: true,
              title: '重置',
              icon: 'image://https://res.cdn.changbaimg.com/-/f2f8588c4558278f/reset.png',
              onclick: () => {
                this.过滤后的散点图数据 = this.chartData;
                this.scatterIdsend();
              }
            },
            myAllData: {
              show: true,
              title: '查看全部数据',
              icon: 'image://https://res.cdn.changbaimg.com/-/6ef0fa5439a6250c/all.png',
              onclick: () => {
                this.$router.push({ path: "/homeList", query: { sotId: '' }});
              }
            },
          },
          itemSize: 25,
          right: '5%'
        },
        // tooltip: {
        //   trigger: "axis",
        //   axisPointer: {
        //     type: "cross",
        //   },
        // },
        grid:{
          right: "35px",
        },
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0],
            // yAxisIndex: [0],
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            yAxisIndex: [0],
            start: 0,
            end: 100
          }
        ],
        xAxis: [
          {
            type: "value",
            scale: true,
            min:  0,
            max: 360,
            splitNumber:5,
            // show:false
          },
        // {
        //   type: "category",
        //   data:[0,90,180,270,360],
        //   show:true,
        //   position:'bottom'
        // }
        ],
        yAxis: [
          {type: 'value'},
          {
            type: 'value',
            show:false
          }
        ],
        series: [
          {
            data: this.showData,
            type: "scatter",
            symbolSize: 8,
            yAxisIndex: 0,
            color: '#3CB4E6',
            animationDurationUpdate: 'cubicOut'
          },
          {
            type: 'line',
            showSymbol: false,
            smooth: true,
            yAxisIndex: 1,
            data:_this.generateData(),
          },
        ],
      };
      return options
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    echartOptions: {
      handler(val){
        this.myEchart ? this.myEchart.setOption(val) : this.init();
      }
    },
    chartData: {
      handler(val) {
        this.过滤后的散点图数据 = JSON.parse(JSON.stringify(val))
      },
      immediate: true
    }
  },
  methods: {
    // 过滤干扰数据
    ilterInterferenceData() {
      this.过滤后的散点图数据 = this.过滤后的散点图数据.filter(el => el.id == 1)
    },
    init() {
      let myEchart = echarts.init(this.$refs.echart);
      this.myEchart = myEchart;
      myEchart.setOption(this.echartOptions);

      myEchart.on("click", (params) => {
        let dataIndex = params.dataIndex;
        let node = this.过滤后的散点图数据[dataIndex];
        this.$emit("clickNode", node);
      });
      let brushselected = debounce((params) => {
        try {
          let selectedList = params.batch[0].selected[0].dataIndex;
          selectedList = this.过滤后的散点图数据.filter((item, index) =>
            selectedList.includes(index)
          );
          selectedList.length && this.$emit("brushselected", selectedList);
          if (selectedList.length) this.selectedList = selectedList
        } catch (error) {
          console.log(error);
        }
      }, 300);
      myEchart.on("brushselected", brushselected);
    },
    scatterIdsend(){    //散点图刷新反馈
      this.myEchart.dispatchAction({
        type: 'brush',
        areas: []
      });
      this.myEchart.dispatchAction({
        type: 'takeGlobalCursor',
        key: 'brush',
        brushOption:{
          brushType:false,
          brushMode: false
        }
      });
      this.dataId = []
      this.过滤后的散点图数据.forEach(item=>{
        this.dataId.push(item.id);
      })
      // this.$http.post(`/api/dataAnalyse/scatterIdsend`,{dataId:JSON.stringify(this.dataId)}).then(res=>{
      //   this.selectedList = [];
      // })
    },
    func(x){
      x/=100;
      return Math.sin(x)* Math.cos(x * 2 + 1) * Math.sin(x * 3 + 2) * 500;
    },
    generateData() {
      let data = [];
      let dig=Math.PI/180;
      let y = 0
      for (let x = 0; x < 360; x ++) {
        y=800*Math.sin(x*dig)+900;
        data.push([x,y])
      }
      return data;
    },
  },
};
</script>

<style scoped>
.echart {
  height: 100%;
  padding: 20px;
}
</style>
