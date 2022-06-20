
<template>
  <div class="wave-con">
    <div class="wave-table-back">

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
        <button :disabled='disable' type="button" class="btn-filter" @click="filterdatasend">{{filteringName}}</button>
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
      default: 0
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
     filteringName:"滤波",
     disable: false,
     pointx:[],
     showMoreLine: false
    }
  },
  watch: {
    tableId: {
      handler(value) {
        this.id = value;
        this.getWaveData(value)
        this.getDetail(value)
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
    // let arr = [];
    // arr.push(this.getList())
    // console.log(this.checkObj.id,this.checkId);
    // if(this.checkObj.id){
	  //   this.id = this.checkObj.id;
    //   Promise.all(arr).then(res=>{
    //     this.index = this.tableData.findIndex((item)=>item === this.checkObj.id);
    //   })
    //   this.bigWavedatasend();
    // }else if(this.checkId){
		// 	this.id = this.checkId;
    //   Promise.all(arr).then(res=>{
    //     this.index = this.tableData.findIndex((item)=>item === this.checkId);
    //   })
		// 	this.bigWavedatasend();
		// }else{
    //   this.disable = true;
    // }
  },
  computed: {
    ...mapState(['checkObj','checkId']),
  },
  methods:{
    changeEchart() {
      this.showMoreLine = !this.showMoreLine;
    },
    getWaveData(value) {
      this.$http.get(`/wave/getWave/${value}`).then(res=>{
        if(res.code === 200){
          this.WaveformData = res.data.wave;
          console.log(this.WaveformData)
        }
        else {
          this.$confirm("已经是最后一条数据了", '提示', {
            type: 'warning',
            customClass: "errormessage",
            showCancelButton: false,
            center: "true"
          }).then(() => {
          }).catch(() => {
          });
        }
      })
    },

    getDetail(value) {
      this.$http.get(`/list/details/${value}`).then(res=>{
        if(res.code === 200){
          const data = res.data
          this.list[0].content = value;
          this.list[1].content = data.time;
          this.list[2].content = data.deviceName;
          this.list[3].content = data.head1;
          this.list[4].content = data.head2;
          this.list[5].content = data.head3;
          this.list[6].content = data.head4;
          this.list2[0].content = data.onePassTwo;
          this.list2[1].content = data.onePassThree;
          this.list2[2].content = data.onePassFour;
          this.list2[3].content = data.twoPassThree;
          this.list2[4].content = data.twoPassFour;
          this.list2[5].content = data.threePassFour;
          this.information = data.inf
        }
      })
    },

    preservation(){   //说明保存
      this.$http.put(`/wave/editInf/${this.id}`,{ newInf: this.information }).then(res=>{
        if (res.code === 200){
          this.$confirm(res.message, '提示', {
            type: 'success',
            showCancelButton: false,
            center: "true"
          }).then(() => {
          }).catch(() => {
          });
        }
      })
    },
    previous(data){   //上一个下一个
      if(data === 1){
        if(this.id < 0){
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
          this.getDetail(this.id)
        }
      }else{
        this.id += 1
        this.getWaveData(this.id);
        this.getDetail(this.id)
      }
      this.filteringName = '滤波';
    },

    filterdatasend(){     //滤波
      if(this.filteringName === '滤波'){
        this.$http.get(`/wave/filterWave/${this.id}`).then(res=>{
          if(res.code === 200){
            this.WaveformData = res.data.wave;
            this.filteringName = "恢复";
            // this.information = res.infData.remark;
            this.disable = false;
            // this.list[0].content = res.infData.id;
            // this.list[1].content = res.infData.time;
            // this.list[2].content = res.infData.equipment;
            // this.list[3].content = res.infData.channel1;
            // this.list[4].content = res.infData.channel2;
            // this.list[5].content = res.infData.channel3;
            // this.list[6].content = res.infData.channel4;

            // this.list2[0].content = res.infData.time12 ? (res.infData.time12).toFixed(1) : "";
            // this.list2[1].content = res.infData.time13 ? (res.infData.time13).toFixed(1) : "";
            // this.list2[2].content = res.infData.time14 ? (res.infData.time14).toFixed(1) : "";
            // this.list2[3].content = res.infData.time23 ? (res.infData.time23).toFixed(1) : "";
            // this.list2[4].content = res.infData.time24 ? (res.infData.time24).toFixed(1) : "";
            // this.list2[5].content = res.infData.time34 ? (res.infData.time34).toFixed(1) : "";
            // this.pointx = [];
            // this.WaveformData.forEach(item=>{
            //   this.pointx.push(item.pointx)
            // })
          }
        })
      }else{
        this.getWaveData(this.id);
        this.getDetail(this.id)
        this.filteringName = "滤波";
      }
    },
    /** 选择小红点的时候触发 */
    selectedComponent1(data) {
      console.log(data);
      this.pointx[data.componentIndex]  = Number(data.name)
      this.list2[0].content = (this.pointx[1]!= null && this.pointx[0]!= null) ? (this.pointx[1]-this.pointx[0]).toFixed(1) : "";
      this.list2[1].content = (this.pointx[2]!= null && this.pointx[0]!= null) ? (this.pointx[2]-this.pointx[0]).toFixed(1) : "";
      this.list2[2].content = (this.pointx[3]!= null && this.pointx[0]!= null) ? (this.pointx[3]-this.pointx[0]).toFixed(1) : "";
      this.list2[3].content = (this.pointx[2]!= null && this.pointx[0]!= null) ? (this.pointx[2]-this.pointx[1]).toFixed(1) : "";
      this.list2[4].content = (this.pointx[3]!= null && this.pointx[0]!= null) ? (this.pointx[3]-this.pointx[1]).toFixed(1) : "";
      this.list2[5].content = (this.pointx[3]!= null && this.pointx[0]!= null) ? (this.pointx[3]-this.pointx[2]).toFixed(1) : "";
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
  border-left: 1px solid #ccc;
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