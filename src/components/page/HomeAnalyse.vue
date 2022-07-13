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
        <channel-line
          v-if="echartShow"
          :chartData="trendChartdata"
          @brushselected="data => brushselected(data)"
          @selectedComponent="selectedComponent"
        />
      </div>
      <div class="info-con">
          <info v-if="defaultValue" class="eee" ref="eee" :sampleCount="sampleCount" :strengthMax="strengthMax" :timeRanges='timeRanges' @selectedUnit='selectedUnit'/>
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
        <div class="text">PRPS图谱</div>
        <div class="bar-con">
          <bar v-if="Object.keys(showData.DDatasendData).length > 0 && DDshow" :unit="unit" :chartData="showData.DDatasendData" />
        </div>
      </div>
      <div class="chart">
        <div class="text">PRPD图谱</div>
        <scatter v-if="echartShow" :chartData="showData.scatterData" @clickNode='clickNode' />
      </div>
      <div class="chart" >
        <div class="text">波形图</div>
        <img class="detail-icon" v-show="Object.keys(smallWaveform).length !== 0" @click="goWave" src="../../assets/image/menu/detail-icon.png" alt="" />
        <wave :whatSize="1" v-if="Object.keys(smallWaveform).length !== 0" :chartData="smallWaveform"/>
      </div>
    </div>
  </div>
</template>
<script>
import channelLine from "./homeinstall/channel-line.vue";
import scatter from "./homeinstall/scatter.vue";
import bar from "./homeinstall/bar.vue";
import wave from "./homeinstall/wave.vue";
import info from "./homeinstall/info.vue";
import eleCalendar from 'ele-calendar'
import 'ele-calendar/dist/vue-calendar.css'
import { mapState } from "vuex";


export default {
  components: {
    channelLine,
    scatter,
    bar,
    wave,
    info,
    eleCalendar
  },
  data() {
    return {
      defaultValue: '', // 默认值,搜索时赋值
      timeRanges: [],
      datedef: [
        // {"date": "2021-11-30"}
      ],
      prop: 'date', //对应日期字段名
      phaseShift:0,
      checkId:"",
      trendChartdata:{},    //通道数据
      scatterData:[],   //散点图数据
      smallWaveform: {},     //小波形
      DDatasendData:{},   //3d柱状图数据
      sampleCount:0,
      strengthMax:0,
	    echartShow:false,
      unit:'mV',
      DDshow:true,
      finalSelectDate:[],
	    calendarShow: true,
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
    this.DDatasendData = {};   //3d柱状图数据
    this.sampleCount = 0;
    this.strengthMax = 0;
    this.echartShow = false;
    this.unit = 'mV';
    this.finalSelectDate = [];
  },
  computed: {
    ...mapState(['dataSetid']),

    showData({trendChartdata, scatterData, DDatasendData, smallWaveform}) {
      let result = {trendChartdata, scatterData, DDatasendData, smallWaveform}
      if(this.unit != 'dBW') return result
      let fn = amp => 20 * Math.log10(0.2 * amp) - 80
      if(scatterData) {
        result.scatterData = scatterData.map(item => ({...item, y: fn(item.y)}))
      }
      if(DDatasendData) {
        const obj = {x:[],y:[],z:[]}
        result.DDatasendData.z.forEach((item, index)=> {
          obj.z[index] = fn(item)
        })
        obj.x = result.DDatasendData.x
        obj.y = result.DDatasendData.y
        result.DDatasendData = obj
      }
      return result
    }
  },
  methods: {
    goWave(){
      this.$router.push({ path: "/homeList", query: {id: this.checkId} });
    },
    dataDaysend(){
      let dateList = []
      if(this.dataSetid.length > 0){
        dateList = this.dataSetid

        this.$nextTick(()=>{
          this.datedef = [];
          dateList.forEach(item => {
            this.datedef.push({
              "date": item
            })
          });
          this.calendarShow = true;
          if (sessionStorage.getItem("toDay")) {
            this.defaultValue = sessionStorage.getItem("toDay")
          }
          else {
            this.defaultValue = dateList[dateList.length - 1];
          }
          sessionStorage.setItem('toDay', this.defaultValue);
          this.dataDayconfirm(this.defaultValue);
        })
      }
      else {
        this.$http.get(`/data/days?dbId=${this.sourceId}`).then(res=>{
          dateList = res.data
          this.$nextTick(()=>{
            this.datedef = [];
            dateList.forEach(item => {
              this.datedef.push({
                "date": item
              })
            });
            this.calendarShow = true;
            if (sessionStorage.getItem("toDay")) {
              this.defaultValue = sessionStorage.getItem("toDay")
            }
            else {
              this.defaultValue = dateList[dateList.length - 1];
            }
            sessionStorage.setItem('toDay', this.defaultValue);
            this.dataDayconfirm(this.defaultValue);
          })
        })
      }
    },
    changeNum(data){
      if(data === 2){
        this.phaseShift = 0
      }
      this.DDatasend(this.defaultValue);
      this.scatterDatasend(this.defaultValue);
    },
    trendChartdatasend(toDay){   //趋势图数据
      this.$http.get(`/data/trend_charts?dbId=${this.sourceId}&day=${this.defaultValue}`).then(res=>{
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

    xrangeChange(){   //拖动x两光标后范围变化
      this.DDatasend(this.defaultValue);
      this.scatterDatasend(this.defaultValue);
    },

    DDatasend(toDay){   //3D柱状图数据
      this.$http.get(`/data/histogram?dbId=${this.sourceId}&startTime=${sessionStorage.getItem('startTime')}&endTime=${sessionStorage.getItem('endTime')}&channelId=${sessionStorage.getItem('channelId') || 1}&phaseMove=${this.phaseShift}&day=${sessionStorage.getItem('toDay')}`).then(res=>{
        this.DDatasendData = res.data;
      })
    },
    scatterDatasend(toDay){   //散点图数据
      this.$http.get(`/data/scatter_graph?dbId=${this.sourceId}&startTime=${sessionStorage.getItem('startTime')}&endTime=${sessionStorage.getItem('endTime')}&channelId=${sessionStorage.getItem('channelId') || 1}&phaseMove=${this.phaseShift}&day=${sessionStorage.getItem('toDay')}`).then(res=>{
        this.scatterData = res.data;
      })
    },
    smallWavedatasend(data){   //小波形图
      this.$http.get(`/data/wave_graph?day=${this.defaultValue}&id=${data}&getInfo=false`).then(res=>{
        this.smallWaveform = res.data;
      })
    },
    /** 散点图选择数据 */
    clickNode(data) {
      this.checkId = data.id
      this.smallWavedatasend(data.id);
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
      this.defaultValue = toDay
      sessionStorage.setItem('toDay', this.defaultValue);
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
        this.dataDayconfirm();
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

    channelSelected(data) {
      this.smallWaveform = {};
      this.timeRanges = data;
      setTimeout(() => {
        this.xrangeChange();
      })
    },
    /** 选择通道的时候触发 */
    selectedComponent(index) {
      this.channelId = index + 1
      sessionStorage.setItem('channelId', this.channelId)
      this.selectedUnit('mV');
      this.$refs.eee.yAxisUnit = 'mV';
      this.DDatasend(this.defaultValue);
      this.scatterDatasend(this.defaultValue);
    },
    /** 当框选的内容发生变化的时候触发 */
    brushselected(data) {
      this.startTime = data[0]
      this.endTime = data[1]
      sessionStorage.setItem('startTime', this.startTime);
      sessionStorage.setItem('endTime', this.endTime);
      this.channelSelected(data)
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
  border-bottom: solid 1px #ccc;
}

.bottom {
  width: 100%;
  height: 570px;
  display: flex;
  justify-content: space-between;
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
  width: 100%;
  height: 570px;
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
  border-left: 1px solid #CCCCCC;
}
.calendar-con {
  padding-right: 20px;
  width: 462px;
  height: 99%;
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
  height: 98%;
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