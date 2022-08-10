
<template>
  <div class="homepreview">
    <div class="content_box">
      <div class="head-container">
        <p>监测时长:<span class="time">{{ time }}</span></p>
        <p class="word-style">放电次数: <span class="time">{{ sampleCount }}次</span></p>
        <div class="word-style">
          采集状态：<span :class="dbStatus === 1 ? 'avtive-word-style' : 'inactive-word-style'">{{ dbStatus === 1 ? '采集中' : '未采集' }}</span>
          <el-switch v-model="dbStatus" active-color="#3e80bd" :active-value="1" :inactive-value="0" inactive-color="#ccc" :width="40"
            @change="handlePubChange()">
          </el-switch>
        </div>
      </div>

      <div class="middle-container">
        <div class="progress">
          <div class="location-con">
            <div :style="{ position: 'absolute', left: item.position / positionLength * 100 + '%'}" v-for="(item, index) in positionList" :key="'position' + index" @click="selectPosition(index)">
              <i class="icon iconfont newfontshandian" :class="item.big && 'big-size'" :style="{ color: item.color }"></i>
            </div>
          </div>
          <div class="progress-line"></div>
          <div class="sensor-container">
            <div v-for="(item, index) in collecStatusList" class="sensor-item" :class="index | leftStatus">
              <div class="sensor-con" v-show="item.isShow == 1">
                <div class="circle" :class="index | classStatus"></div>
                <img :src="item.img" class="sensor-img" alt="" />
                <p class="sensor-name">{{ item.sensorName }}</p>
              </div>
              <p class="distance" v-if="(index != 3 && item.distance) && item.isShow == 1">{{ item.distance }}m</p>
            </div>
          </div>
        </div>
        <div class="pie" id="pie"></div>
      </div>
    </div>

    <div class="middle-line"></div>

    <div class="table">
      <el-table
        :data="tableData"
        ref="multipleTableDevice"
        tooltip-effect="dark"
        class="table_box_table"
        :default-sort = "{prop: 'num', order: 'descending'}"
        highlight-current-row
        @selection-change="handleSelectionChange"
        @setCurrentRow="setCurrentRow"
        @row-click="rowClick"
        :cell-style="cellStyle">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="id" label="序号" width="70">
          </el-table-column>
          <el-table-column label="类型" prop="type">
          </el-table-column>
          <el-table-column prop="sampleCount" label="放电次数" sortable>
          </el-table-column>
          <el-table-column prop="strengthMax" label="放电强度最大值(mV)" width="250" sortable>
          </el-table-column>
          <el-table-column sortable label="占比(%)" prop="ratio"></el-table-column>
          <el-table-column prop="caption" label="位置">
          </el-table-column>
      </el-table>
      <button type="button" class="analyse" @click="analyseDS">确认分析</button>
    </div>

    <!-- 采集参数确认 -->
    <popup-get-params :show-get-dialog.sync="showGetDialog" :source-id="isChoseDb" @cancleCollect="cancleCollect" @collect="collect" />

    <!-- 查看数据的提示 -->
    <popup-tips :show-tips-dialog="showTipsDialog" />
  </div>
</template>
<script>
import * as echarts from 'echarts';
import { color } from 'echarts';
import { mapState, mapMutations} from "vuex";
import PopupGetParams from '../common/popup-get-params.vue'
import PopupTips from '../common/popup-tips.vue';
import enums from '../../utils/enums.js'
import '../../assets/icon/iconfont.css'


export default {
  components: {
    PopupGetParams,
    PopupTips
  },
  filters: {
    classStatus(value) {
      return enums(value, {
        0: 'zero-circle',
        1: 'first-circle',
        2: 'second-circle',
        3: 'third-circle'
      });
    },
    leftStatus(value) {
      return enums(value, {
        0: 'zero-left',
        1: 'first-left',
        2: 'second-left',
        3: 'third-left'
      });
    }
  },
  props: {
    isChoseDb: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      showTipsDialog: false,
      collecStatusList: [
        {
          img: require('../../assets/image/menu/sensor1.png'),
          sensorName: '',
          distance: 0,
          isShow: false
        },
        {
          img: require('../../assets/image/menu/sensor2.png'),
          sensorName: '',
          distance: 0,
          isShow: false
        },
        {
          img: require('../../assets/image/menu/sensor3.png'),
          sensorName: '',
          distance: 0,
          isShow: false
        },
        {
          img: require('../../assets/image/menu/sensor4.png'),
          sensorName: '',
          distance: 0,
          isShow: false
        }
      ],
      showGetDialog: false,
      time: '',
      multipleSelection: [],
      tableData: [
        // {id:1, locname: "内部0", position: 0.1, color: "red", ratio: 0.3, type: "内部", sampleCount: 300, strengthMax: 100, posiDescribe: "距左侧0.1m，右侧0.3m"},
        // {id:2, locname: "内部0", position: 0.5, color: "blue", ratio: 0.5, type: "内部", sampleCount: 300, strengthMax: 100, posiDescribe: "距左侧0.1m，右侧0.3m"},
      ],
      positionList:[],
      location: null,
      dbStatus: 0,
      sampleCount: 0,
      detect: null,
      dataIndex: null,
      myPieChart: null,
      positionLength: 0
    }
  },
  computed: {
    ...mapState(['collection']),
  },
  created(){
  	let token = localStorage.getItem('token');
  	if(!token){
  		this.$router.push('/login');
  	}
    if(this.collection || sessionStorage.getItem('model') == 'true') {
      this.dbStatus = 1
      this.detect = setInterval(() => {
        this.locationgRessend(sessionStorage.getItem('samplingDbId'));
      }, 1000)
    }
  },
  watch: {
    isChoseDb(value) {
      this.refresh(value);
    }
  },
  methods:{
    ...mapMutations(['SETCOLLECTION', 'SETDATASETDATE', 'SETLOCATIONID']),

    handlePubChange() {
      if (this.dbStatus) {
        this.showGetDialog = true;
      }
      else {
        this.$emit('showLeft', true)
        this.stopDetect(1);
      }
    },
    cancleCollect(data) {
      if(data) {
        this.dbStatus = 0
        this.$emit('showLeft', true)
      }
      else {
        this.$emit('showLeft', false)
      }
    },
    collect(data) {
      if (data) {
        this.location = setInterval(() => {
          this.locationgRessend(this.isChoseDb);
          this.SETCOLLECTION(true)
        }, 1000)
      }
    },
    refresh(value){
      this.locationgRessend(value);
    },

    /**
     * 获取基本信息
     */
    locationgRessend(value){
      if (!value) {
        return;
      }
      else {
        this.showTipsDialog = true;
      }
      this.$http.get(`db/${value}/stat `).then(res=>{
        this.showTipsDialog = false;
        this.positionList = [];
        this.positionLength = 0
        const data = res.data;
        this.tableData = data.locationList
        this.time = data.monitorDuration
        this.collecStatusList[0].sensorName = data.baseInfo.title1
        this.collecStatusList[1].sensorName = data.baseInfo.title2
        this.collecStatusList[2].sensorName = data.baseInfo.title3
        this.collecStatusList[3].sensorName = data.baseInfo.title4
        this.collecStatusList[0].distance = data.baseInfo.space12 || 0
        this.collecStatusList[1].distance = data.baseInfo.space23 || 0
        this.collecStatusList[2].distance = data.baseInfo.space34 || 0

        this.sampleCount = data.signalNum

        data.baseInfo.channelStateList.forEach((item, index) => {
          this.collecStatusList[index].isShow = item
        })

        this.tableData.forEach(item => {
          if(item.color){
            this.positionList.push({ id:item.id, color:item.color, position: item.displayLocation, big: false });
          };
          this.$nextTick(()=>{
            this.$refs.multipleTableDevice.toggleRowSelection(item);
          })
        })
        this.positionList.forEach(item=>{
          if (item.position < 0) {
            item.position = 0
          }
          this.positionLength += Number(item.position)
        })
        this.getPie();
      })
    },
    stopDetect(type) {
      this.$http.post('/sample/stop').then(res=>{
        clearInterval(this.detect);
        clearInterval(this.location);
        this.SETCOLLECTION(false);
        sessionStorage.setItem('model', false);
        if (type == 0) {
          this.$router.push("/homeinstall");
        }
      })
    },
    analyseDS(){  //确认分析
      if (this.collection || sessionStorage.getItem('model') == 'true') {
        this.$confirm("是否关闭采集", '提示', {
          type: 'warning',
          customClass: "errormessage",
          showCancelButton: false,
          center: "true"
        }).then(() => {
          this.stopDetect(0);
        }).catch(() => {
        });
        return;
      }
      // if(this.multipleSelection.length === 0){
      //   this.$confirm("请至少选择一条数据进行分析", '提示', {
      //     type: 'warning',
      //     customClass: "errormessage",
      //     showCancelButton: false,
      //     center: "true"
      //   }).then(() => {
      //   }).catch(() => {
      //   });
      //   return;
      // }
      let dataSetids = []
      let locationIds = []
      this.multipleSelection.forEach((item, index) => {
        dataSetids.push(...item.dayList)
        locationIds.push(item.id)
      })
      let dataSetid = Array.from(new Set(dataSetids));
      this.SETDATASETDATE(dataSetid);
      if (this.tableData.length == this.multipleSelection.length) {
        this.SETLOCATIONID('');
      }
      else {
        this.SETLOCATIONID(locationIds);
      }


      this.$router.push("/homeinstall");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectPosition(num) {
      this.myPieChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: num
      })
      for(let i = 0; i < this.tableData.length - 1; i++) {
        if (i !== num) {
          this.myPieChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: i
          })
        }
      }
      this.$refs.multipleTableDevice.setCurrentRow(this.$refs.multipleTableDevice.data[num]);
    },
    getPie(){
      let echart = ""
      let data = [];
      this.tableData.forEach(item=>{
        data.push({ value:item.ratio, name:item.id});
      })
      // if (document.getElementById("pie") == null) {
      //   return
      // }
      // echarts.dispose(document.getElementById("pie"))
      echart = document.getElementById("pie");
      this.myPieChart = echarts.init(echart);
      var option = {
        tooltip: {
          trigger: 'item',
          formatter:(parmas)=>{
            return `${parmas.marker}${parmas.name}</br>${parmas.value * 100}%`
          }
        },
        legend: {
          orient: 'vertical',
          right: 0,
          top: 'middle',
          selectedMode:false,
          itemHeight: 18,
          itemWidth:18
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '90%'],
            label: {
              normal: {
                position: 'inner',
                show : false
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },
            data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      option && this.myPieChart.setOption(option, true);
      this.myPieChart.on("click", params => {
        this.$refs.multipleTableDevice.setCurrentRow(this.$refs.multipleTableDevice.data[params.dataIndex]);
        this.positionList[params.dataIndex].big = true;
        for(let i = 0; i < this.tableData.length - 1; i++) {
          if (i != params.dataIndex) {
            this.positionList[i].big = false;
          }
        }
      });
    },
    setCurrentRow() {

    },
    rowClick(row, column, event) {
      this.tableData.forEach((item, index) => {
        if (item.id === row.id) {
          this.myPieChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: index
          })
          this.positionList[index].big = true
        }
        else {
          this.myPieChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: index
          })
          this.positionList[index].big = false
        }
      })
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      // console.log(columnIndex)
      if (columnIndex == 0) {
        // console.log(rowIndex);
        // this.positionList.forEach((item, index) => {
        //   if (rowIndex == index) {
        //     console.log(111)
        //     return `color: ${item.color}`;
        //   }
        // })
      }
    }
  }
}
</script>
<style scoped>
.head-container {
  display: flex;
  margin-top: 72px;
  font-size: 24px;
  font-weight: 400;
  color: #333333;
  margin-bottom: 77px;
}

.el-table .warning-row {
  background: oldlace;
}

.word-style {
  margin-left: 70px;
}

.time {
  font-size: 24px;
  font-weight: bold;
  color: #3e80bd;
}

.avtive-word-style {
  color: #3e80bd;
  font-weight: bold;
}

.inactive-word-style {
  color: #ccc;
  font-weight: bold;
}

.middle-container {
  display: flex;
  align-items: center;
}

.progress {
  position: relative;
}

.flash-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 25px;
}

.location-con {
  display: flex;
  position: relative;
  top: -50px;
}

.big-size::before {
  font-size: 36px !important;
}

.progress-line {
  width: 100%;
  height: 8px;
  background-color: #3E80BD;
  border-radius: 20px;
}

.circle {
  width: 16px;
  height: 16px;
  background: #FFFFFF;
  border-radius: 50%;
}

.zero-circle {
  border: 4px solid #3E80BD;
}

.first-circle {
  border: 4px solid #48CE4E;
}

.second-circle {
  border: 4px solid #3CB4E6;
}

.third-circle {
  border: 4px solid #F5BC4B;
}

.zero-left {
  margin-left: 8px;
}

/* .first-left {
  margin-left: 162px;
}

.second-left {
  margin-left: 162px;
} */

/* .third-left {
  width: 67px !important;
} */

.content_box {
  background: #fff;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sensor-img {
  margin-top: 16px;
  width: 32px;
  height: 32px;
}

.sensor-container {
  display: flex;
}

.sensor-item {
  width: 100%;
  margin-top: -12px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.sensor-con {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
}

.distance {
  margin: 40px 100px 0;
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  font-weight: bold;
  color: #3E80BD;
}

.sensor-name {
  margin-top: 16px;
  font-size: 16px;
  font-weight: 400;
  color: #6D6D6D;
  text-align: center;
}

.middle-line {
  margin-top: 110px;
  margin-bottom: 50px;
  width: 100%;
  height: 1px;
  background-color: #ccc;
}

.pie {
  width: 400px;
  height: 200px;
}

.table {
  height: 420px;
  border-radius: 8px;
  background: #fff;
  position: relative;
  margin: 0 44px;
}

.analyse{
  position: absolute;
  margin-top: 25px;
  right: 52px;
  width: 96px;
  height: 40px;
  background: #3CB4E6;
  border-radius: 2px;
  border: none;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 40px;
  text-align: center;
}

.table /deep/ .el-table__header-wrapper thead th {
  background-color: rgba(197, 207, 215, 0.3) !important;
  font-size: 18px;
  font-weight: bold;
  color: #0A244C;
}

.table /deep/ .el-table th, .el-table tr {
  height: 72px !important;
}

.table /deep/ .el-table__row {
  height: 72px !important;
}

.table /deep/ .el-table {
  font-size: 16px;
}
</style>