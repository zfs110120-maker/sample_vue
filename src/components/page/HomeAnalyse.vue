<template>
  <div class="homeinstall">
    <div class="top">
      <div class="calendar-con" v-if="calendarShow">
        <ele-calendar
          :render-content="renderContent"
          :data="datedef"
          :prop="prop"
          :month="1"
          :default-value="defaultValue"
          @pick="datePick"
          @date-change="getMonth"
          :selectedDate="finalSelectDate"
        ></ele-calendar>
      </div>
      <div class="aaa">
        <div class="text">趋势图</div>
        <aaa
          v-if="echartShow"
          :chartData="trendChartdata"
          @brushselected="data => brushselected(data, 1)"
          @selectedComponent="selectedComponent"
        />
      </div>
      <div class="info-con">
          <eee v-if="defaultValue.length>0" class="eee" ref="eee" :sampleCount="sampleCount" :strengthMax="strengthMax" :timeRanges='timeRanges' @selectedUnit='selectedUnit'/>
          <div class="fenxi">
            <span class="content">相 位 偏 移：</span>
            <div class="eee1">
              <el-input-number v-model="phaseShift" controls-position="right"></el-input-number>
              <div class="btn" @click="changeNum(1)" style="margin:0 8px;">修改</div>
              <div class="btn" @click="changeNum(2)" style="background:#3E80BD">恢复</div>
            </div>
          </div>
      </div>
    </div>
    <div class="bottom">
      <div class="chart">
        <div class="text">柱状图</div>
        <div class="bar-con">
          <ccc style="width:100%;height:100%;" :unit="unit" v-if="showData.DDatasendData.length>0 && DDshow" :chartData="showData.DDatasendData" :phaseShiftNum='phaseShiftNum'/>
        </div>
      </div>
      <div class="chart">
        <div class="text">散点图</div>
        <!-- <dv-border-box-8> -->
          <bbb v-if="echartShow" :chartData="showData.scatterData" @clickNode='clickNode' :phaseShiftNum='phaseShiftNum'/>
        <!-- </dv-border-box-8> -->
      </div>
      <div class="chart" >
        <div class="text">波形图</div>
        <!-- <el-button size="mini" type="primary" class="text1" :disabled="smallWaveform.length == 0" @click="goWave">信号波形</el-button> -->
        <img class="detail-icon" v-show="Object.keys(smallWaveform).length !== 0" @click="goWave" src="../../assets/image/menu/detail-icon.png" alt="" />
        <!-- <dv-border-box-8> -->
          <ddd :whatSize="1" v-if="Object.keys(smallWaveform).length !== 0" :chartData="smallWaveform"/>
        <!-- </dv-border-box-8> -->
      </div>
    </div>
  </div>
</template>
<script>
import aaa from "./homeinstall/a.vue";
import bbb from "./homeinstall/b.vue";
import ccc from "./homeinstall/c.vue";
import ddd from "./homeinstall/d.vue";
import eee from "./homeinstall/e.vue";
import {散点图数据, 通道数据, 柱状图数据, 波形图数据} from './homeinstall/data'
import eleCalendar from 'ele-calendar'
import 'ele-calendar/dist/vue-calendar.css'
import { mapMutations, mapState} from "vuex";
export default {
  components: {
    aaa,
    bbb,
    ccc,
    ddd,
    eee,
    eleCalendar
  },
  data() {
    return {
      defaultValue: '', // 默认值,搜索时赋值
      timeRanges: [],
      通道数据: Object.freeze(通道数据),
      散点图数据: Object.freeze(散点图数据),
      柱状图数据: Object.freeze(柱状图数据),
      波形图数据: Object.freeze(波形图数据),
      散点图选中的数据: [],
      过滤后的散点图数据: [],
      datedef: [
        // {"date": "2021-11-30"},
        // {"date": "2021-11-25"},
      ],
      prop: 'date', //对应日期字段名
      phaseShift:0,
      checkId:"",
      trendChartdata:{},    //通道数据
      scatterData:[],   //散点图数据
      smallWaveform: {},     //小波形
      DDatasendData:[],   //3d柱状图数据
      sampleCount:0,
      strengthMax:0,
      phaseShiftNum:0,
	    echartShow:false,
      unit:'mV',
      DDshow:true,
      finalSelectDate:[],
	    calendarShow:true,
      hallway: 'c1',
      sourceId: sessionStorage.getItem('sourceId'),
      channelId: 1,
      startTime: '',
      endTime: ''
    };
  },
  created() {
    let token = localStorage.getItem('token');
    if(!token){
      this.$router.push('/login');
    }
  },
  mounted(){
    this.dataDaysend();
    this.defaultValue = "";
    this.timeRanges = [];
    this.trendChartdata = {};    //通道数据
    this.scatterData = [];   //散点图数据
    this.smallWaveform = {};     //小波形
    this.DDatasendData = [];   //3d柱状图数据
    this.sampleCount = 0;
    this.strengthMax = 0;
    this.phaseShiftNum = 0;
    this.echartShow = false;
    this.num = 0;
    this.unit = 'mV';
    this.finalSelectDate = [];
  },
  computed: {
    ...mapState(['analyse']),
    showData({trendChartdata, scatterData, DDatasendData, smallWaveform}) {
      let result = {trendChartdata, scatterData, DDatasendData, smallWaveform}
      if(this.unit != 'dBW') return result
      let fn = amp => 20 * Math.log10(0.2 * amp) - 80
      if(scatterData) {
        console.log(scatterData)
        result.scatterData = scatterData.map(item => ({...item, ypoint: fn(item.ypoint)}))
      }
      if(DDatasendData) {
        result.DDatasendData = DDatasendData.map(item => ({...item, zpoint: fn(item.zpoint)}))
      }
      return result
    },
  },
  methods: {
	  ...mapMutations(['SETCHECKID','SETCHECKOBJ','SETCOLER','SETANALYSE']),
    goWave(){
      this.$router.push({ path: "/homeList", query: {id: this.checkId} });
    },
    dataDaysend(){
      this.$http.get(`/data/days?dbId=${this.sourceId}`).then(res=>{
        const data = res.data
        this.datedef = [];
        data.forEach(item => {
          this.datedef.push({
            "date": item
          })
        });
        this.calendarShow = true;
        this.defaultValue = data[0];
        this.$nextTick(()=>{
          this.dataDayconfirm(this.defaultValue);
        })
      })
    },
    changeNum(data){
      if(data === 1){   //修改
        this.DDatasend();
        this.scatterDatasend();
      }else{    //恢复
        this.phaseShift = 0;
        this.DDatasend();
        this.scatterDatasend();
      }
    },
    trendChartdatasend(toDay){   //趋势图数据
      // this.$http.get(`/data/trend_charts?dbId=${this.sourceId}&day=${toDay}`).then(res=>{
      this.$http.get(`/data/trend_charts?dbId=${this.sourceId}&day=2021-05-12`).then(res=>{
        const data = res.data
        this.trendChartdata = data.data;
        this.sampleCount = data.sampleCount;
        this.strengthMax = data.strengthMax;
      })
    },

    dateChange(date) {
      if (date) {
        const dateArr = date.split(':')
        dateArr[0] = +dateArr[0];
        if (dateArr[0] === 0) {
          dateArr[0] = 24
        }

        return dateArr.join(':')
      }
    },

    /**
     * 信息栏数据
     */

    infoColumn () {
      this.startTime = this.dateChange(this.startTime)
      this.endTime = this.dateChange(this.endTime)
      console.log(this.startTime, this.endTime)
      this.$http.post('/analysis/infoColumn', {
        hallway: this.hallway,
        startTime: this.startTime,
        endTime: this.endTime,
        phaseShift: this.phaseShift
      }).then(res=>{
        if(res.code === 200){
          // this.scatterDatasend();
          // this.trendChartdata = res.data.trendMap;
          this.sampleCount = Number(res.data.infoColumn.points);  // 放电次数
          this.strengthMax = Number(res.data.infoColumn.cmax);    // 最大值
          // this.startTime = res.data.infoColumn.startTime;
          // this.endTime = res.endTime;
          // this.checkId = this.trendChartdata[0].id;
          this.smallWaveform = {};
          this.SETCOLER('rgba(255, 153, 0, 1)')
          // this.DDatasend();
          // this.scatterDatasend();
        }
      })
    },

    xrangeChange(){   //拖动x两光标后范围变化
      this.DDatasend(this.defaultValue);
      this.scatterDatasend(this.defaultValue);
    },

    DDatasend(toDay){   //3D柱状图数据
      this.$http.get(`/data/histogram?dbId=${this.sourceId}&startTime=${this.startTime}&endTime=${this.endTime}&channelId=${this.channelId}&phaseMove=${this.phaseShift}&day=2021-05-12`).then(res=>{
        this.DDatasendData = res.data;
      })
    },
    scatterDatasend(toDay){   //散点图数据
      this.$http.get(`/data/scatter_graph?dbId=${this.sourceId}&startTime=${this.startTime}&endTime=${this.endTime}&channelId=${this.channelId}&phaseMove=${this.phaseShift}&day=2021-05-12`).then(res=>{
        this.scatterData = res.data;
      })
    },
    scatterPointinfsend(data){   //散点图点选数据
      this.$http.post(`/analysis/scopedScatters`,{dbid:data}).then(res=>{
        if(res.code === 200){
          this.smallWavedatasend(data);
        }
      })
    },
    smallWavedatasend(data){   //小波形图
      this.$http.get(`/analysis/oscillogram/${data}`).then(res=>{
        if(res.code === 200){
          this.smallWaveform = res.data.wave;
          console.log(this.smallWaveform)
        }
      })
    },
    /** 散点图选择数据 */
    clickNode(data) {
      console.log(data,'散点图选择数据')
      this.checkId = data.id
      // this.scatterPointinfsend(data.dbid);
      this.smallWavedatasend(data.dbid);
      this.SETCHECKID(data.dbid)
    },
    renderContent(h, parmas) {
      // 自定义样式,我返回的是小点(橘黄色)
      const loop = (data) => {
        return data.defvalue.value ? h('div',
          [
            h('div', data.defvalue.text), h('div',{
            style: {
              width: "46px",
              height: "44px",
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
              "font-weight": 400
            }
          }, data.defvalue.text)]) : h('div', [h('div', data.defvalue.text)
          ]
        )
      }
      return h('div', {
        // 给div绑定样式
        style: {
            minHeight: '45px'
        },

        click() {
        }
      }, [loop(parmas)])
    },
    // 获取点击的日期 返回为标准格式 使用date.get方法获取想要的数据
    datePick(date) {
      this.finalSelectDate = [];
      this.finalSelectDate.push(date);
      this.defaultValue = date
      var d = new Date(date);
      let Year = d.getFullYear(),
      Month = d.getMonth()+1,
      day = d.getDate();
      if(day < 10){
        day = '0'+day;
      }
      if(Month < 10){
        Month = '0'+Month;
      }
      let toDay = Year+'-'+Month+'-'+day
      if(this.datedef.findIndex((item)=>item.date==toDay) == -1){
        this.$confirm(`${toDay}没有数据`, '提示', {
          type: 'warning',
          customClass: "errormessage",
          showCancelButton: false,
          center: "true"
        }).then(() => {
        }).catch(() => {
        });
      }else{
        this.dataDayconfirm(toDay);
      }
    },
    dataDayconfirm(toDay){
      this.trendChartdatasend(toDay);
      this.echartShow = true;
    },
    // 点击切换月/年按钮时返回的数据 格式为标准格式
    getMonth(data){
      var d = new Date(data); // 点击月
    },
    /** 修改Y轴单位 */
    selectedUnit(val) {
      this.unit = val;
   },

    过滤散点图数据() {
      this.过滤后的散点图数据 = this.散点图选中的数据
    },
    散点图框选(data) {
      // this.散点图选中的数据 = Object.freeze(data)
      // this.过滤散点图数据()
    },
    通道图框选(data) {
      this.smallWaveform = {};
      this.timeRanges = data;
      setTimeout(() => {
        this.xrangeChange();
      })
    },
    /** 选择通道的时候触发 */
    selectedComponent(index) {
      this.channelId = index + 1
      this.num = 0;
      this.selectedUnit('mV');
      this.$refs.eee.yAxisUnit = 'mV';
      this.DDatasend(this.defaultValue);
      this.scatterDatasend(this.defaultValue);
    },
    /** 当框选的内容发生变化的时候触发 */
    brushselected(data, type) {
      this.startTime = data[0]
      this.endTime = data[1]
      let map = {
        1: this.通道图框选,
        2: this.散点图框选
      }
      map[type](data)
    },
  },
  watch:{
    'DDatasendData':{
      handler(){
        this.DDshow = false;
        this.$nextTick(()=>{
          this.DDshow = true;
        })
      }
    },
  }
};
</script>
<style scoped>
.homeinstall {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
.top {
  width: 100%;
  height: 414px;
  display: flex;
}
.bottom {
  width: 100%;
  height: 528px;
  display: flex;
  border-top: 1px solid #ccc;
}

.bar-con {
  padding: 20px;
  width: 100%;
  height: 100%;
}

.info-con {
  margin: 20px 20px 0;
  width: 455px;
  height: 414px;
}

.chart {
  width: 618px;
  height: 528px;
  position: relative;
  background: #fff;
  border-right: 1px solid #ccc;
}

.detail-icon {
  position: absolute;
  width: 32px;
  height: 32px;
  top: 14px;
  right: 52px;
  z-index: 100;
}

.width-230px{
  width: 2.875rem;
}
.aaa{
  width: 932px;
  height: 100%;
  position: relative;
  background:#fff;
  border-right: 1px solid #CCCCCC;
}
.calendar-con {
  padding-right: 20px;
  width: 462px;
  height: 100%;
  border-right: 1px solid #CCCCCC;
  border-bottom: 1px solid #CCCCCC;
}

.el-picker-panel-calendar {
  border: none;
  box-shadow: none;
}

.homeinstall /deep/ .el-input-number {
  width: 1.375rem;
  line-height: .25rem;
}
.homeinstall /deep/ .el-date-table-calendar td div div div:nth-child(1){
  min-height: 44px !important;
  width: 46px;
  height: 44px;
  margin: 9px;
  line-height: 44px;
  color: #666;
  position: relative;
}

.calendar-con /deep/ .el-date-table-calendar td div div div:nth-child(2)::after {
  content: '';
  position: absolute;
  left: 15px;
  bottom: 7px;
  width: 17px;
  height: 2px;
  background-color: #3CB4E6;
}

.calendar-con /deep/ .el-date-table-calendar td.selected div div div:nth-child(2) {
  background: #3CB4E6 !important;
  border-radius: 2px;
  color: #fff !important;
}

.calendar-con /deep/ .el-date-table-calendar td.default div div div:nth-child(2) {
  background: #3CB4E6 !important;
  border-radius: 2px;
  color: #fff !important;
}

.calendar-con /deep/ .el-date-table-calendar td.default div div div:nth-child(2)::after {
  content: '';
  position: absolute;
  left: 15px;
  bottom: 7px;
  width: 17px;
  height: 2px;
  background-color: #fff;
}

.calendar-con /deep/ .el-date-table-calendar td.selected div div div:nth-child(2)::after {
  content: '';
  position: absolute;
  left: 15px;
  bottom: 7px;
  width: 17px;
  height: 2px;
  background-color: #fff;
}

.homeinstall /deep/ .prev-month {
  visibility: hidden;
}
.homeinstall /deep/ .next-month {
  visibility: hidden;
}
.homeinstall /deep/ .el-date-table-calendar td div:nth-child(2){
  position: absolute;
  top: 9px;
  left: 9px;
}
.calendar-con /deep/ .border-box-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
.calendar-con /deep/ .el-date-picker-calendar {
  width: 100%;
  height: 101%;
  border-radius: 10px;
  box-shadow: inherit;
}
.calendar-con /deep/ .el-date-table-calendar td.selected div {
  background: #fff !important;
}

.calendar-con /deep/ .el-date-table-calendar td.selected div div div:nth-child(1) {
  background: #3CB4E6 !important;
  border-radius: 2px;
  color: #fff !important;
}
.text {
  position: absolute;
  left: 3%;
  top: 2%;
  display: flex;
  font-size: 20px;
  font-weight: 400;
  color: #0A244C;
}
.text1 {
  position: absolute;
  right: 3%;
  top: 2%;
  z-index: 100;
  cursor: pointer;
}
.fenxi {
  margin-left: 15px;
  display:flex;
  align-items: center;
  height: 42px;
}
.eee {
  margin-left: 15px;
  padding-top: 10px;
}
.fenxi /deep/ .el-input-number.is-controls-right .el-input-number__decrease, .fenxi /deep/ .el-input-number.is-controls-right .el-input-number__increase {
  height: 13px !important;
  line-height: 13px !important;
}
.fenxi /deep/ .el-input-number.is-controls-right .el-input__inner {
  height: 28px;
}
.eee1 {
  display: flex;
}

.content {
  font-size: 16px;
  font-weight: 400;
  color: #666;
  margin-right: 16px;
}
.eee1 .btn {
  width: 54px;
  height: 24px;
  background: #3CB4E6;
  border-radius: 2px;
  line-height: 24px;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  cursor: pointer;
}
</style>