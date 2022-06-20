<template>
  <div class="homeinstall">
    <div class="top">
      <div class="calendar">
        <div style="width: 335px;height: 400px;margin: 30px auto">
          <ele-calendar
            :render-content="renderContent"
            :data="datedef"
            :prop="prop"
            @pick="datePick"
            @date-change="getMonth"
          ></ele-calendar>
        </div>
      </div>
      <aaa style="width:800px;"
        :chartData="通道数据"
        @brushselected="data => brushselected(data, 1)"
        @selectedComponent="selectedComponent"
      />
      <div class="text">
        <div class="text1">信息栏</div>
        <div class="text1">分析起点时间：{{startTime}}</div>
        <div class="text1">分析终点时间：{{endTime}}</div>
        <div class="text1">放电时长：{{duration1}}</div>
        <div class="text1">放电次数：{{endTime}}</div>
        <div class="text1">数据最大值：{{endTime}}</div>
        <div class="text1">Y轴单位</div>
        <div class="text1">
          <el-radio v-model="radio" label="1">dBW</el-radio>
          <el-radio v-model="radio" label="2">mV</el-radio>
        </div>
        <div class="text1">
          <div class="text1">相位偏移</div>
          <div>
            <el-input-number v-model="num" controls-position="right" :min="0" ></el-input-number>
            <el-button size="mini">修改</el-button>
            <el-button size="mini">恢复</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="chart">
        <ccc :chartData="柱状图数据"/>
      </div>
      <div class="chart">
        <bbb :chartData="过滤后的散点图数据" @brushselected='data => brushselected(data, 2)'/>
      </div>
      <div class="chart" >
        <ddd :chartData="波形图数据"/>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import aaa from "./homeinstall/a.vue";
import bbb from "./homeinstall/b.vue";
import ccc from "./homeinstall/c.vue";
import ddd from "./homeinstall/d.vue";
import {散点图数据, 通道数据, 柱状图数据, 波形图数据} from './homeinstall/data'
import eleCalendar from 'ele-calendar'
import 'ele-calendar/dist/vue-calendar.css'
export default {
  components: {
    aaa,
    bbb,
    ccc,
    ddd,
    eleCalendar
  },
  data() {
    return {
      days: [1, 1.5, 2, 2.5],
      data1: [
        [10, 2, 120],
        [5, 3, 150],
        [8, 1.5, 20],
      ],
      通道数据: Object.freeze(通道数据),
      散点图数据: Object.freeze(散点图数据),
      柱状图数据: Object.freeze(柱状图数据),
      波形图数据: Object.freeze(波形图数据),
      散点图选中的数据: [],
      过滤后的散点图数据: [],
      datedef: [
        {"date": "2020-03-30", "content": null, "cid": null},
        {"date": "2020-03-26", "content": null, "cid": null},
      ],
      prop: 'date', //对应日期字段名
      startTime:'12:10：52',
      endTime:'14:10：52',
      radio:'1',
      num:0,
      duration1:0
    };
  },
  created() {
    this.过滤后的散点图数据 = this.散点图数据
  },
  methods: {
      renderContent(h, parmas) {
        // 自定义样式,我返回的是小点(橘黄色)
        const loop = (data) => {
          return data.defvalue.value ? h('div',
            [
              h('div', data.defvalue.text), h('div',{
              style: {
                width: '4px',
                height:'4px',
                margin: '0 auto',
                borderRadius: '4px',
                backgroundColor:'red',
              }
            }, '')]) : h('div', [h('div', data.defvalue.text)
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
      datePick(date, event, row, dome) {     
        console.log(date,event, row, dome); // Tue Mar 03 2020 00:00:00 GMT+0800 (中国标准时间)        
          var d = new Date(date);
          console.log(d.getDate()); //  点击日
          console.log(d.getMonth() + 1);    // 点击月    

      },
      // 点击切换月/年按钮时返回的数据 格式为标准格式
      getMonth(data){
        console.log(data); // Fri Apr 03 2020 00:00:00 GMT+0800 (中国标准时间)
          var d = new Date(data); // 点击月
          console.log(d.getMonth() + 1)
          //d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + 	
          //d.getSeconds()		// 标准时间转化       方法
      },

    过滤散点图数据() {
      this.过滤后的散点图数据 = this.散点图选中的数据
    },
    散点图框选(data) {
      this.散点图选中的数据 = Object.freeze(data)
      this.过滤散点图数据()
    },
    通道图框选() {},
    /** 选择通道的时候触发 */
    selectedComponent(index) {
      console.log(index);
    },
    /** 当框选的内容发生变化的时候触发 */
    brushselected(data, type) {
      console.log(data)
      this.startTime = data[0];
      this.endTime = data[1];
      this.duration1 = this.duration(['08:20', '17:20']);
      let map = {
        1: this.通道图框选,
        2: this.散点图框选
      }
      map[type](data)
    },
    duration({timeRanges}) {
      if(timeRanges.length < 2) return 0
        let start = timeRanges[0]
        let end = timeRanges[1]
        start = start.split(':').map(el => +el)
        end = end.split(':').map(el => +el)
        start = start[0] * 60 + start[1]
        end = end[0] * 60 + end[1]
        let duration = end - start
        return `${~~(duration / 60)}:${duration % 60}`
      }
  },
};
</script>
<style scoped>
.homeinstall {
  width: 100%;
  height: 882px;
  background-color: #fff;
  padding: 3px 8px;
  /* background-color: #30335f */
}
.top {
  width: 100%;
  height: 50%;
  display: flex;
}
.bottom {
  width: 100%;
  height: 30%;
  border: 1px solid;
  display: flex;
}
.chart {
  flex: 1;
  margin-left: 10px;
  padding: 5px;
  border: 1px solid;
}
.calendar {
  width: 400px;
  height:500px;
  border:0;
}
.text {
  padding: 20px 0;
}
.text1 {
  margin-bottom: 10px;
}
.homeinstall /deep/ .el-input-number{
  width: 110px !important;
}
.day {
  background: pink;
}
</style>