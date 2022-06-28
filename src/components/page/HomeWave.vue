
<template>
  <div class="wave-con">
    <div class="wave-table-back">
      <div class="wave-arrow-left" @click="goTable"></div>
    </div>
    <div class="left">
      <div class="change-con" @click="changeEchart">
        <img src="../../assets/image/menu/change-chart-icon.png" class="change-chart-icon" alt="Change">
        显示模式切换
      </div>
      <ddd v-if="Object.keys(WaveformData).length !== 0 && !showMoreLine" :whatSize="2" :chartData="WaveformData"  @selectedComponent1="selectedComponent1"/>
      <more-line-echart v-if="showMoreLine" :chartData="WaveformData"></more-line-echart>
    </div>
    <div class="right">
      <div class="right_card">
        <p class="card-title">相关信息</p>
        <div v-for="(o,index) in list" :key="index" class="card-desc">
          <span class="name">{{o.name}}:</span>  <span class="informationcontent">{{o.content}}</span>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="right_card">
        <p class="card-title">时间差(ns)</p>
        <div v-for="(o,index) in list2" :key="index" class="card-desc">
          <span>{{o.name}}:</span>  <span class="informationcontent">{{o.content}}</span>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="right_card">
        <p class="card-title">说明</p>
        <div style="padding: 10px 10px;">
          <el-input type="textarea" v-model="information" :rows="3"  show-word-limit style="width: 100%;height: 109px;"></el-input>
          <div class="btn" :class='disable ? "disable":""' @click="preservation">确认</div>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="btn-con">
        <button type="button" class="btn-previous" :disabled='disable' @click="previous(1)">上一个</button>
        <button type="button" class="btn-next" :disabled='disable' @click="previous(2)">下一个</button>
        <button type="button" class="btn-filter" @click="filterdatasend">{{ filteringName }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import ddd from './homeinstall/d.vue'
import MoreLineEchart from './homeinstall/MoreLineEchart.vue'
import {波形图数据} from './homeinstall/data'
import { mapState, mapMutations} from "vuex";
export default {
  props: {
    tableId: {
      type: Number,
      default: null
    }
  },
  components: {
    ddd,
    MoreLineEchart
  },
  data () {
    return {
      information:'',
      波形图数据: Object.freeze(波形图数据),
      list:[
        {name:'序号',content:""},
        {name:'时间',content:""},
        {name:'设备',content:""},
        {name:'通道1',content:""},
        {name:'通道2',content:""},
        {name:'通道3',content:""},
        {name:'通道4',content:""}
        ],
      list2:[
        {name:'1超前2',content:''},
        {name:'1超前3',content:''},
        {name:'1超前4',content:''},
        {name:'2超前3',content:''},
        {name:'2超前4',content:''},
        {name:'3超前4',content:''},
     ],
     WaveformData: {},//波形图数据
		 id:"",
     tableData:[],
     index:"",
     filteringName: "滤波",
     disable: false,
     pointx:[],
     showMoreLine: false
    }
  },
  watch: {
    tableId: {
      handler(value) {
        this.id = value;
        if (value) {
          this.getWaveData(value)
        }
      },
      immediate: true
    }
  },
	created(){
		let token = localStorage.getItem('token');
		if(!token){
			this.$router.push('/login');
		}
	},
  mounted(){
  },
  computed: {
    ...mapState(['checkObj','checkId']),
  },
  methods:{
    goTable() {
      this.$emit('goTable', true);
    },
    changeEchart() {
      this.showMoreLine = !this.showMoreLine;
    },
    getWaveData(value) {
      this.$http.get(`/data/wave_graph?day=${sessionStorage.getItem('toDay')}&id=${value}&getInfo=true`).then(res=>{
        this.WaveformData = res.data;
        const info = res.data.info;
        this.list[0].content = info.signalTime;
        this.list[1].content = info.duration;
        this.list[2].content = info.path;
        this.list[3].content = info.cList[0];
        this.list[4].content = info.cList[1];
        this.list[5].content = info.cList[2];
        this.list[6].content = info.cList[3];
        this.list2[0].content = info.time12;
        this.list2[1].content = info.time13;
        this.list2[2].content = info.time14;
        this.list2[3].content = info.time23;
        this.list2[4].content = info.time24;
        this.list2[5].content = info.time34;
        this.information = info.note
        this.pointx = []
        this.WaveformData.channels.forEach((item, index) => {
          this.pointx.push(item.head_x)
        })
      })
    },

    preservation(){   //说明保存
      this.$http.put('/signal',{
        id: this.id,
        day: sessionStorage.getItem('toDay'),
        note: this.information
      }).then(res=>{
        this.$confirm('更新成功！', '提示', {
          type: 'success',
          showCancelButton: false,
          center: "true"
        }).then(() => {
        }).catch(() => {
        });
      })
    },
    previous(data){   //上一个下一个
      if(data === 1){
        if(this.id <= 1){
          this.$confirm("已经是第一条数据了", '提示', {
            type: 'warning',
            customClass: "errormessage",
            showCancelButton: false,
            center: "true"
          }).then(() => {
          }).catch(() => {
          });
        }else{
          this.id -= 1
          this.getWaveData(this.id);
        }
      }else{
        this.id += 1
        this.getWaveData(this.id);
      }
      this.filteringName = '滤波';
    },

    filterdatasend(){     //滤波
      if(this.filteringName === '滤波'){
        this.$http.get(`/data/wave_graph?day=${sessionStorage.getItem('toDay')}&id=${this.id}&getInfo=true&filterWave=true`).then(res=>{
          this.WaveformData = res.data;
          const info = res.data.info;
          this.list[0].content = info.signalTime;
          this.list[1].content = info.duration;
          this.list[2].content = info.path;
          this.list[3].content = info.cList[0];
          this.list[4].content = info.cList[1];
          this.list[5].content = info.cList[2];
          this.list[6].content = info.cList[3];
          this.list2[0].content = info.time12;
          this.list2[1].content = info.time13;
          this.list2[2].content = info.time14;
          this.list2[3].content = info.time23;
          this.list2[4].content = info.time24;
          this.list2[5].content = info.time34;
          this.information = info.note
          this.pointx = []
          this.WaveformData.channels.forEach((item, index) => {
            this.pointx.push(item.head_x)
          })
          this.filteringName = "恢复";
        })
      }else{
        this.getWaveData(this.id);
        this.filteringName = "滤波";
      }
    },
    /** 选择小红点的时候触发 */
    selectedComponent1(data) {
      this.pointx[data.componentIndex]  = Number(data.name)
      this.list2[0].content = (this.pointx[1]!= null && this.pointx[0]!= null) ? (this.pointx[1]-this.pointx[0]).toFixed(1) : "";
      this.list2[1].content = (this.pointx[2]!= null && this.pointx[0]!= null) ? (this.pointx[2]-this.pointx[0]).toFixed(1) : "";
      this.list2[2].content = (this.pointx[3]!= null && this.pointx[0]!= null) ? (this.pointx[3]-this.pointx[0]).toFixed(1) : "";
      this.list2[3].content = (this.pointx[2]!= null && this.pointx[1]!= null) ? (this.pointx[2]-this.pointx[1]).toFixed(1) : "";
      this.list2[4].content = (this.pointx[3]!= null && this.pointx[1]!= null) ? (this.pointx[3]-this.pointx[1]).toFixed(1) : "";
      this.list2[5].content = (this.pointx[3]!= null && this.pointx[2]!= null) ? (this.pointx[3]-this.pointx[2]).toFixed(1) : "";
    },
  }
}
</script>
<style scoped>
.wave-con {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
}
.left{
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.wave-table-back {
  width: 99px;
  height: 100%;
  background-color: #ccc;
  position: relative;
}

.wave-arrow-left {
  position: absolute;
  top: 35px;
  right: 29px;
  width: 18px;
  height: 18px;
  border-top: 4px solid #3E80BD;
  border-right: 4px solid #3E80BD;
  transform: rotate(45deg);
}

.change-con {
  position: absolute;
  top: 49px;
  right: 36px;
  font-size: 20px;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  font-weight: bold;
  color: #3E80BD;
  display: flex;
  align-items: center;
}

.change-chart-icon {
  margin-right: 9px;
  width: 26px;
  height: 22px;
}

.right{
  width: 495px;
  height: 100%;
  overflow-y: scroll;
}

.right_card {
  margin-left: 56px;
}

.card-title {
  margin: 36px auto 15px;
  font-size: 20px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #0A244C;
  line-height: 23px;
}

.card-desc {
  margin-bottom: 12px;
  font-size: 18px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #666666;
}

.informationcontent{
  margin-left: 16px;
}

.clearfix {
  margin-top: 34px;
  margin-bottom: 36px;
  width: 494px;
  height: 1px;
  background: #CCCCCC;
}

.wave-con /deep/ .el-textarea__inner {
  height: 92px;
}

.btn {
  width: 64px;
  height: 28px;
  background: #3CB4E6;
  border-radius: 2px;
  text-align: center;
  line-height: 28px;
  color: #fff;
  font-size: 14px;
  margin-top: 14px;
  cursor: pointer;
}

.disable {
  opacity: 0.5;
}

.btn-con {
  display: flex;
  justify-content: space-around;
}

button {
  border: none;
  font-size: 16px;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 20px;
  width: 120px;
  height: 40px;
  border-radius: 2px;
}

.btn-previous {
  background: #3CB4E6;
}

.btn-next {
  background: #3E80BD;
}

.btn-filter {
  background: #FF9500;
}
</style>