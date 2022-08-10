
<template>
<div class="homewave">
  <div class="arrow-left" v-if="showTable" @click="goWave"></div>
  <div class="table-con" v-if="showTable">
    <el-table
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      class="table_box_table"
      :cell-style="cellStyle"
      @sort-change="onSortChange">
      <el-table-column prop="showId" label="序号"  width="60" align="center">
      </el-table-column>
      <el-table-column prop="time" label="时间" width="80" sortable="custom" :sort-orders="['ascending','descending']" align="center">
      </el-table-column>
      <el-table-column prop="c1" label="C1" width="70" sortable="custom" :sort-orders="['ascending','descending']" align="center">
      </el-table-column>
      <el-table-column prop="c2" label="C2" width="70" sortable="custom" :sort-orders="['ascending','descending']" align="center">
      </el-table-column>
      <el-table-column prop="c3" label="C3" width="70" sortable="custom" :sort-orders="['ascending','descending']" align="center">
      </el-table-column>
      <el-table-column prop="c4" label="C4" width="70" sortable="custom" :sort-orders="['ascending','descending']" align="center">
      </el-table-column>
      <el-table-column prop="time12" label="1超前2" sortable="custom" :sort-orders="['ascending','descending']" align="center">
      </el-table-column>
      <el-table-column prop="time13" label="1超前3" sortable="custom" :sort-orders="['ascending','descending']" align="center">
      </el-table-column>
      <el-table-column prop="time14" label="1超前4" sortable="custom" :sort-orders="['ascending','descending']" align="center">
      </el-table-column>
      <el-table-column prop="time23" label="2超前3" sortable="custom" :sort-orders="['ascending','descending']" align="center">
      </el-table-column>
      <el-table-column prop="time24" label="2超前4" sortable="custom" :sort-orders="['ascending','descending']" align="center">
      </el-table-column>
      <el-table-column prop="time34" label="3超前4" sortable="custom" :sort-orders="['ascending','descending']" align="center">
      </el-table-column>
      <el-table-column prop="note" label="说明" align="center">
      </el-table-column>
      <el-table-column label="操作" width="60" align="center">
        <template slot-scope="scope">
          <!-- <el-button size="mini" >查看</el-button> -->
          <div @click="check(scope.row)">
            <img src="../../assets/image/menu/detail-icon.png" class="detail-icon" alt="">
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom" v-show="tableData.length > 0">
      <div class="pa_pager">
        <div style="position: relative;">
          <div id="singlePageNum" @click="handleSingPage">
            <span>{{singlePageNum}}</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <div class="option" v-show="optionShow">
            <div v-for="(item,index) in 4" :key="index" @click="change(index+1)">{{index+1}}0</div>
          </div>
        </div>
        <div class="btns">
          <el-pagination
            background
            layout="prev, pager, next"
            :pager-count="9"
            :page-size="singlePageNum"
            :total="totalList"
            :current-page.sync="pagesize"
            @current-change="handleCurrentChange"
            >
          </el-pagination>
          <div style="font-size:18px; color: #666;">
            共{{totalPage}}页,
            跳转至<input type="text" class="pa_pageNum" v-model="currentPage">页
          </div>
          <div class="go" @click="goPage">确定</div>
        </div>
        <div class="allList">
          共{{totalList}}条
        </div>
      </div>
    </div>
  </div>
  <template v-else>
    <home-wave :table-id="tableId" :show-table-id="showId" @goTable="goTable"></home-wave>
  </template>
</div>
</template>
<script>
import BottomPage from "./BottomPage.vue"
import HomeWave from "./HomeWave.vue"
import { mapState } from "vuex";

export default {
  components: {BottomPage, HomeWave},
  data () {
    return {
      tableData: [],
      pagesize: 1,
      singlePageNum: 10,
      currentPage: 1,
      totalPage: 0,
      totalList: 0,
      optionShow:false,
      showTable: true,
      tableId: null,
      showId: null,
      dataProp: '',
      sortWay: null
    }
  },
	created(){
		let token = localStorage.getItem('token');
		if(!token){
			this.$router.push('/login');
		}
	},

  computed: {
    ...mapState(['scatterIds', 'locationIds']),
  },

  mounted(){
    if(this.$route.query.id) {
      this.showTable = false
      this.tableId = Number(this.$route.query.id)
    }
    else {
      this.showTable = true;
      this.getList({pagesize: this.pagesize,singlePageNum: this.singlePageNum}, this.dataProp, this.sortWay);
      this.$nextTick(()=>{
        let btnprev = document.getElementsByClassName("btn-prev");
        let btnnext = document.getElementsByClassName("btn-next");
        btnprev[0].innerText = "上一页";
        btnnext[0].innerText = "下一页";
      })
    }
  },
  methods:{
    goWave() {
      this.showTable = false
    },
    goTable(data) {
      if(data) {
        this.showTable = true
        this.getList({pagesize: this.pagesize,singlePageNum: this.singlePageNum}, this.dataProp, this.sortWay);
      }
    },
    getList(data, sort, asc){
      this.$http.post('/scatter_data/list', {
        dbId: Number(sessionStorage.getItem('sourceId')),
        day: sessionStorage.getItem('toDay'),
        startTime: '',
        endTime: '',
        selectedIds: this.scatterIds,
        excludeIds: [],
        sort: sort,
        asc: asc,
        page: data.pagesize,
        pageSize: data.singlePageNum,
        locationIds: this.locationIds !== '' ? this.locationIds : []
      }).then(res=>{
        const data = res.data;
        this.tableData = data.data;
        this.totalPage = data.totalPage;
        this.totalList = data.totalSize;
      })
    },

    check(data){
      this.tableId = Number(data.id);
      this.showId = Number(data.showId);
      this.showTable = false;
    },

    onSortChange(data){
      if(this.tableData.length === 0) return
      if(data.order === 'descending'){
        this.sortWay = false
      }else {
        this.sortWay = true
      }
      this.dataProp = data.prop
      this.getList({pagesize: this.pagesize,singlePageNum: this.singlePageNum}, this.dataProp, this.sortWay);
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 == 1) {
        return 'background:rgb(238,244,255)'
      }else {
        // return 'background:rgb(238,244,255)'
      }
    },
    handleSingPage(){
      this.optionShow = !this.optionShow
    },
    change(data){
      this.singlePageNum = Number(data+'0');
      this.optionShow = false;
      this.pagesize = 1;
      this.getList({pagesize: this.pagesize,singlePageNum: this.singlePageNum}, this.dataProp, this.sortWay);
    },
    handleCurrentChange(data){
      this.pagesize = data
      this.getList({pagesize: this.pagesize,singlePageNum: this.singlePageNum}, this.dataProp, this.sortWay);
    },
    goPage(){
      if(this.currentPage > this.totalPage){
        this.currentPage = this.totalPage;
      }else if(this.currentPage <= 0){
        this.currentPage = 1;
      }
      this.pagesize = Number(this.currentPage);
      this.getList({pagesize: this.pagesize,singlePageNum: this.singlePageNum}, this.dataProp, this.sortWay);
    }
  }
}
</script>
<style scoped>
.homewave {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  position: relative;
}

.table-con {
  padding: 50px 123px;
  width: 100%;
  height: 100%;
}

.arrow-left {
  position: absolute;
  top: 35px;
  right: 41px;
  width: 18px;
  height: 18px;
  border-top: 4px solid #3E80BD;
  border-right: 4px solid #3E80BD;
  transform: rotate(-135deg);
}

.table_box_table /deep/ .el-table__header-wrapper thead th {
  background-color: rgba(197, 207, 215, 0.3) !important;
  font-size: 18px;
  font-weight: bold;
  color: #0A244C;
}

.table_box_table /deep/ .el-table th, .el-table tr {
  height: 72px !important;
}

.table_box_table /deep/ .el-table__row {
  height: 72px !important;
}

.table_box_table /deep/ .el-table {
  font-size: 16px;
}
  .homewave /deep/ .table_box_table {
    height: 93% !important;
    /* height:200px; */
    width: 100% !important;
    overflow-y: auto;
  }
  .homewave /deep/ .el-table__body-wrapper {
    overflow-y: auto !important;
  }
  .homewave /deep/ .el-table__body {
    width: 100% !important;
    font-size: 16px;
  }
.bottom {
  height: 32px;
  background: #fff;
  position: absolute;
  bottom: 50px;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
}
.homewave >>> ::-webkit-scrollbar {  
  width: 0px !important;  /*滚动条宽度*/
}
.homewave >>> .el-table .sort-caret {
  width: 12px;
  height: 10px;
}
.homewave /deep/ .el-table__header {
  background:rgb(238,244,255) !important;
  font-size: 16px;
}
.homewave /deep/ .el-table th, .el-table tr {
  background:rgb(238,244,255) !important;
}
.pa_pager {
    display: flex;
    align-items: center;
    margin-top: 15px;
    justify-content: center;
  }
 #singlePageNum {
    width: 72px;
    height: 32px;
    border: 1px solid #666;
    border-radius: 2px;
    position: relative;
    display: flex;
    align-items: center;
  }
  #singlePageNum i {
    position: absolute;
    right: 5px;
    line-height: 32px;
    color: #ccc;
  }
  #singlePageNum span{
    margin-left: 17px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
  }
  .option {
    position: absolute;
    top: -105px;
    left: 0;
    width: 74px;
    text-align: center;
    border: 1px solid #999999;
    border-radius: 5px;
    cursor: pointer;
    height: 105px;
    background: #fff;
    z-index: 1000;
    font-size: 18px;
    color: #666;
  }
  .btns {
    display: flex;
    align-items: center;
    margin-left: 208px;
    margin-right: 188px;
  }
  .btns /deep/ .btn-prev, .btns /deep/ .btn-next{
    width: 72px;
    height: 32px;
    border-radius: 2px;
  }
  .btns /deep/ .el-pagination.is-background .btn-next {
    background-color: #fff
  }
  .btns /deep/ .el-pagination.is-background .el-pager li{
    width: 32px;
    height: 32px;
    border: 1px solid #666;
    border-radius: 2px;
    background: #fff;
    line-height: 32px;
    color: #666;
  }

  .btns /deep/ .el-pagination.is-background {
    display: flex;
  }

  .btns /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #3CB4E6 !important;
    color: white;
    border: none;
  }
  .btns /deep/ .el-pagination.is-background .btn-next{
    background: #3CB4E6;
    color: #fff;
  }
  .btns /deep/ .el-pagination.is-background .btn-prev:disabled, .btns /deep/ .el-pagination.is-background .btn-next:disabled {
    background: white !important;
    border: 1px solid #666666;
    color: #000;
  }
  .pa_pageNum {
    width: 32px;
    height: 32px;
    border: 1px solid #666;
    border-radius: 2px;
    font-size: 18px;
    margin: 0 10px;
    color: #666;
  }
  .go {
    width: 72px;
    height: 32px;
    background: #3CB4E6;
    border-radius: 2px;
    font-size: 18px;
    color: #fff;
    line-height: 32px;
    text-align: center;
    margin-left: 10px;
    cursor: pointer;
  }
  .allList {
    font-size: 18px;
    font-weight: 400;
    color: #666;
    width: 80px;
  }
  .btns /deep/ .el-pager {
    width: 420px;
  }

.detail-icon {
  width: 32px;
  height: 32px;
}
</style>