<template>
  <div class="bottom pa_pager">
      <!-- 单页条数 -->
      <div>
        <select id="singlePageNum" v-model="childSinglePageNum" @change="handleSingPage">
          <option value=10>10</option>
          <option value=20>20</option>
          <option value=30>30</option>
          <option value=40>40</option>
        </select>
      </div>
      <span class="Pa_line">|</span>
      <div>
        <!-- <a href="javascript:void(0);" disabled="showFirstPage">首页</a> -->
        <button class="pa_firstPage" :disabled="firstPage" @click="goFirstPage"></button>
        <button class="pa_prePage" :disabled="prePage" @click="goPrePage"></button>
      </div>
      <div>
        <span>|</span>
        <div>
          第<input type="text" class="pa_pageNum" v-model="childCurrentPage">页,共{{childTotalPage}}页
        </div>
        <span>|</span>
        <div>
          <!-- <a  disabled="showFirstPage">首页</a> -->
          <button class="pa_nextPage" :disabled="nextPage" @click="goNextPage"></button>
          <button class="pa_lastPage" :disabled="lastPage" @click="goLastPage"></button>
        </div>
        <span>|</span>
        <div>
          <button class="pa_refresh" @click="goRefresh"></button>
        </div>
        <div>
          <button @click="goPage" style="width:50px;height:21px;line-height:21px">跳转</button>
        </div>
        <div class="Pa_allList">
          共{{childTotalList}}条
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: "BottomPage",
  props: {
    pagesize: {
      type: Number,
      default:null
    },
    singlePageNum: {
      type: [Number,String],
      default: '10'
    },
    currentPage: {
      type: Number,
      default: null
    },
    totalPage: {
      // type:Number,
      default: null
    },
    totalList: {
      // type: Number,
      default: null
    }

  },
  
  data() {
    return {
      // 按钮禁用
      // firstPage: false,
      // prePage: false,
      // nextPage: false,
      // lastPage: false,
      childPagesize: this.pagesize,  //当前页码大小
      childSinglePageNum: this.singlePageNum,  //当前页条数
      childCurrentPage:  this.currentPage,  //当前页码
      childTotalPage: this.totalPage,
      childTotalList: this.totalList,
    }
  },
  computed: {
    firstPage() {
      return this.childCurrentPage <= 1;
    },
    prePage() {
      return this.childCurrentPage <= 1;
    },
    nextPage() {
      return this.childCurrentPage >= this.childTotalPage;
    },
    lastPage() {
      return this.childCurrentPage >= this.childTotalPage;
    },
  },
  methods: {
    // 按钮状态更新
    btnStatus() {
      // this.firstPage = this.childCurrentPage <= 1;
      // this.prePage = this.childCurrentPage <= 1;
      // this.nextPage = this.childCurrentPage >= this.childTotalPage;
      // this.lastPage = this.childCurrentPage >= this.childTotalPage;
    },
    handleSingPage() { //单页多少条数据
      // this.getTableList(1, this.childSinglePageNum)
      // this.getTableList(1,this.childSinglePageNum);
      this.$emit('getTableList',{pagesize: 1,singlePageNum: Number(this.childSinglePageNum)})
      this.childCurrentPage = 1;
      // this.btnStatus()
      // console.log(this.childCurrentPage,this.childTotalPage)
      // console.log(this.nextPage)
    },
    goFirstPage() { //首页
      // this.getTableList(1, this.childSinglePageNum);
      this.$emit('getTableList',{pagesize: 1,singlePageNum: this.childSinglePageNum})
      this.childCurrentPage = 1;
      // this.btnStatus(); //修改按钮状态
    },
    goPrePage() {//上一页
      if (this.childCurrentPage > 1) {
        // this.prePage = true;
        var childPagesize = this.childCurrentPage - 1;
        this.childCurrentPage--;
        this._debounce(childPagesize, this.childSinglePageNum);
        // this.btnStatus(); //修改按钮状态
      }
    },
    goNextPage() { //下一页
      if (this.childCurrentPage <= this.childTotalPage - 1) {
        var childPagesize = this.childCurrentPage - 0 + 1;
        this.childCurrentPage++;
        this._debounce(childPagesize, this.childSinglePageNum);
      } else {
        // this.nextPage = true;
        // this.btnStatus();
      }

    },
    goLastPage() { //最后一页 
      if (this.childCurrentPage <= this.childTotalPage - 1) {
        // this.getTableList(this.childTotalPage, this.childSinglePageNum)
        this.$emit('getTableList',{pagesize: this.childTotalPage,singlePageNum: this.childSinglePageNum})
        this.childCurrentPage = this.totalPage;
        // this.btnStatus(); //修改按钮状态
      }
    },
    goRefresh() { // 刷新
      this.$emit('getTableList',{pagesize: 1,singlePageNum: this.childSinglePageNum})
      this.childCurrentPage = 1;
      // this.btnStatus(); //修改按钮状态
    },
    _debounce(childPagesize, childSinglePageNum) {  //
      if (clickTimer) {
        clearTimeout(clickTimer)
      }
      let clickTimer = setTimeout(() => {
        // this.getTableList(childPagesize, childSinglePageNum);
        this.$emit('getTableList',{pagesize: childPagesize,singlePageNum: childSinglePageNum})
      }, 100)
    },
    goPage() {      //跳转页面
      if(this.childCurrentPage < 1 ) {
        this.childCurrentPage = 1
      } else if(this.childCurrentPage > this.childTotalPage){     //输入的值大于总页数
        this.childCurrentPage = this.childTotalPage
      } 
        this.$emit('getTableList',{pagesize: this.childCurrentPage,singlePageNum: this.childSinglePageNum})
    }
  },
  watch: {
      totalPage(newValue) {
        this.childTotalPage = newValue
      },
      totalList(newValue) {
        this.childTotalList = newValue
      },
      currentPage(newValue) {
        // this.currentPage = 1;
        this.childCurrentPage = 1;
      },
      pagesize(newValue) {
        this.childCurrentPage = newValue;
      }

    }
}
</script>
<style scoped>
  .pa_pager {
    position: relative;
    padding: 0px 7px 0px 7px;
    line-height: 30px;
    /* background: #ccc; */
    display: flex;
    justify-content: center;
    font-size: 20px;
  }
  .pa_pager div {
    display: inline-block;
  }
  .pa_pager div button {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: none;
    vertical-align: middle;
  }
  .pa_pager .pa_line {
    padding: 0 2px;
  }
  .pa_pager .pa_pageNum {
    width: 30px;
    height: 22px;
  }
  .pa_pager .pa_firstPage {
    background: url("../../assets/image/pagination_icons.png") no-repeat 0 0;
  }
  .pa_pager .pa_prePage {
    background: url("../../assets/image/pagination_icons.png") no-repeat -16px 0;
  }
  .pa_pager .pa_nextPage {
    background: url("../../assets/image/pagination_icons.png") no-repeat -32px 0;
  }
  .pa_pager .pa_lastPage {
    background: url("../../assets/image/pagination_icons.png") no-repeat -48px 0;
  }
  .pa_pager .pa_refresh {
    background: url("../../assets/image/pagination_icons.png") no-repeat -64px 0;
  }
  .pa_pager span {
    color: #777;
  }
  .Pa_allList {
    position: absolute;
    right: 20px;
    top: 0px;
  }
</style>