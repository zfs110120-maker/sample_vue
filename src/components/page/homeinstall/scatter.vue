<template>
  <div ref="echart" class="echart"></div>
</template>

<script>
import * as echarts from "echarts";
import { mapMutations} from "vuex";

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
      filterScatterData: [],
      selectedList: [],
      dataId:[]
    };
  },
  props: {
    chartData: {
      type: Array,
      default: () => [],
    }
  },
  computed: {
    xAxisData({ filterScatterData }) {
      return filterScatterData.map((item) => item.x);
    },
    colorData({ filterScatterData }) {
      return filterScatterData.map((item) => item.c);
    },
    yAxisData({ filterScatterData }) {
      return filterScatterData.map((item) => item.y);
    },
    showData({ filterScatterData }) {
      return filterScatterData.map((el) => [el.x, el.y]);
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
                this.filterScatterData = this.filterScatterData.filter(el => !selectedIdMap[el.id]);
                this.scatterIdsend();
              }
            },
            myFilter: {
              show: true,
              title: '保留',
              icon: 'image://https://res.cdn.changbaimg.com/-/057d97ff7f3bae8c/retain.png',
              onclick: data => {
                if (!this.selectedList.length) return
                if (this.selectedList.length) this.filterScatterData = this.selectedList
                this.scatterIdsend();
              }
            },
            myDefaultData: {
              show: true,
              title: '重置',
              icon: 'image://https://res.cdn.changbaimg.com/-/f2f8588c4558278f/reset.png',
              onclick: () => {
                this.filterScatterData = this.chartData;
                this.scatterIdsend();
              }
            },
            myAllData: {
              show: true,
              title: '查看全部数据',
              icon: 'image://https://res.cdn.changbaimg.com/-/6ef0fa5439a6250c/all.png',
              onclick: () => {
                this.$router.push({ path: "/homeList" });
                const scatterData = []
                this.filterScatterData.forEach((item) => {
                  scatterData.push(item.id)
                })
                this.SETSCATTERIDS(scatterData);
              }
            },
          },
          itemSize: 25,
          right: '5%'
        },
        grid:{
          right: "15px",
        },
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0],
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
            interval: 90
          }
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
            // large: true,
						// largeThreshold: 4000,
						// progressive: 100,
            symbolSize: 4,
            yAxisIndex: 0,
            itemStyle: {
              color: (e) => {
                return this.colorData[e.dataIndex]
              }
            },
            animationDurationUpdate: 'cubicOut'
          },
          {
            type: 'line',
            showSymbol: false,
            smooth: true,
            yAxisIndex: 1,
            color: '#3CB4E6',
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
        this.filterScatterData = val
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations(['SETSCATTERIDS']),

    // 过滤干扰数据
    ilterInterferenceData() {
      this.filterScatterData = this.filterScatterData.filter(el => el.g == 1)
    },
    init() {
      if (this.$refs.echart == null) {
        return
      }
      echarts.dispose(this.$refs.echart)
      let myEchart = echarts.init(this.$refs.echart);
      this.myEchart = myEchart;
      myEchart.setOption(this.echartOptions);

      myEchart.on("click", (params) => {
        let dataIndex = params.dataIndex;
        let node = this.filterScatterData[dataIndex];
        this.$emit("clickNode", node);
      });
      let brushselectedDebounce = debounce((params) => {
        try {
          let selectedList = params.batch[0].selected[0].dataIndex;
          selectedList = this.filterScatterData.filter((item, index) =>
            selectedList.includes(index)
          );
          // selectedList.length && this.$emit("brushselected", selectedList);
          if (selectedList.length) this.selectedList = selectedList
        } catch (error) {
          console.log(error);
        }
      }, 300);
      myEchart.on("brushselected", brushselectedDebounce);
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
      this.filterScatterData.forEach(item=>{
        this.dataId.push(item.id);
      })
    },
    func(x){
      x/=100;
      return Math.sin(x)* Math.cos(x * 2 + 1) * Math.sin(x * 3 + 2) * 500;
    },
    generateData() {
      let data = [];
      let dig=Math.PI/180;
      let y = 0
      for (let x = 0; x < 360; x++) {
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
