<template>
  <div>
    <div class="staDatas">
      <!-- 表头 -->
      <ul class="head" >
        <li class="ranking" v-for="(item,index) in toubu" :key="index" :style="{ width: tou_width + '%' }">{{item.name}}</li>
      </ul>
       <!-- 滚动部分 -->
      <vue-seamless-scroll
        :data="trapDailyListDatas"
        :class-option="optionSetting"
        class="seamless-warps"
      >
        <ul class="item">
          <li
            v-for="(item, i) in trapDailyListDatas"
            :key="i"
            :class="{on:(i+1)%2==0,off:(i+1)%2!=0}"
          >
            <span class="ranking" :style="{ width: tou_width + '%' }" v-text="i+1"></span>
            <span class="ranking" :style="{ width: tou_width + '%' }" v-text="item.trapDaily"></span>
            <span class="ranking" :style="{ width: tou_width + '%' }" v-text="item.isSale"></span>
          </li>
        </ul>
      </vue-seamless-scroll>
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      trapDailyListDatas: [
        {
          F_FullName: "钢胶线",
          trapDaily: "规格型号",
          isSale: "2021",
          noSale: "实验室",
          man: "李贵",
          salePen: "02-25",
          supply: "06-05",
        },
        {
          F_FullName: "钢胶线",
          trapDaily: "规格型号",
          isSale: "2021",
          noSale: "实验室",
          man: "李贵",
          salePen: "02-25",
          supply: "06-05",
        },
        {
          F_FullName: "钢胶线",
          trapDaily: "规格型号",
          isSale: "2021",
          noSale: "实验室",
          man: "李贵",
          salePen: "02-25",
          supply: "06-05",
        },
        {
          F_FullName: "钢胶线",
          trapDaily: "规格型号",
          isSale: "2021",
          noSale: "实验室",
          man: "李贵",
          salePen: "02-25",
          supply: "06-05",
        },
        {
          F_FullName: "钢胶线",
          trapDaily: "规格型号",
          isSale: "2021",
          noSale: "实验室",
          man: "李贵",
          salePen: "02-25",
          supply: "06-05",
        },
        {
          F_FullName: "钢胶线",
          trapDaily: "规格型号",
          isSale: "2021",
          noSale: "实验室",
          man: "李贵",
          salePen: "02-25",
          supply: "06-05",
        },
        {
          F_FullName: "钢胶线",
          trapDaily: "规格型号",
          isSale: "2021",
          noSale: "实验室",
          man: "李贵",
          salePen: "02-25",
          supply: "06-05",
        },
        {
          F_FullName: "钢胶线",
          trapDaily: "规格型号",
          isSale: "2021",
          noSale: "实验室",
          man: "李贵",
          salePen: "02-25",
          supply: "06-05",
        },
        {
          F_FullName: "钢胶线",
          trapDaily: "规格型号",
          isSale: "2021",
          noSale: "实验室",
          man: "李贵",
          salePen: "02-25",
          supply: "06-05",
        },
        {
          F_FullName: "钢胶线",
          trapDaily: "规格型号",
          isSale: "2021",
          noSale: "实验室",
          man: "李贵",
          salePen: "02-25",
          supply: "06-05",
        },
      ],
      toubu:[
        {name:'序号'},
        {name:'样品名称'},
        {name:'规格型号'},
      ],
      tou_width:'',
    };
  },
   mounted(){
     this.tou_width=100 / this.toubu.length;
   },
  computed: {
    optionSetting() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 8, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 100, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
};
</script>
<style  scope>
.staDatas {  
  height: 50%;
padding: 0 5px 5px;
font-size: 12px;
display: flex;
flex-direction: column;
box-sizing: border-box;
}
.staDatas .seamless-warps {
    overflow: hidden;
    flex: 1;
    color: #fff;
    height: 100%;
   
}
.staDatas .seamless-warps  ul {
padding: 0!important;
margin: 0!important;
}
.staDatas .seamless-warps  ul li {
        list-style: none;
        height: 50px;
        /* padding: 0 5px; */
        font-size: 14px;
        display: flex;
        line-height: 50px;
        }
.staDatas .seamless-warps  ul li .ranking {
          display: inline-block;
          width: 15%;
          text-align: center;
        }
.staDatas .seamless-warps  ul li .name {
          width: 13%;
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

        }
.staDatas .seamless-warps  ul li .name  a {
            color: #fff;
            text-decoration: none;
          }
.staDatas .seamless-warps  ul li .Spec {
          display: inline-block;
          width: 13%;
          text-align: center;
        }
.staDatas .seamless-warps  ul li .surveied {
          display: inline-block;

          width: 13%;
          text-align: center;
        }
.staDatas .seamless-warps  ul li .supply {
          width: 13%;
          text-align: center;
        }
.staDatas .seamless-warps  ul li .man {
          width: 13%;
          text-align: center;
        }
.staDatas .seamless-warps  ul li .room {
          display: inline-block;

          width: 13%;
          text-align: center;
        }
.staDatas .seamless-warps  ul li .spen {
          display: inline-block;

          width: 13%;

          text-align: center;
        }
.staDatas .head {
    display: flex;
    /* background: #0a1f5c; */
    height: 50px;
    padding: 0 5px;
    margin: 0;
    color: #ffffff;
    font-weight: 700;
    /* border-bottom: 1px solid #ffffff; */
    line-height: 50px;
}
.staDatas .head li {
    padding: 2px;
    text-align: center;
    list-style: none;
}
.staDatas .head  .ranking {
      text-align: center;
}
.staDatas .head  .name {
      width: 13%;
}
.staDatas .head  .Spec {
      width: 13%;
      text-align: center;
}
.staDatas .head  .surveied {
      width: 13%;
      text-align: center;
}
.staDatas .head  .supply {
      width: 13%;
      text-align: center;
}
.staDatas .head  .man {
      width: 13%;
      text-align: center;
}
.staDatas .head  .room {
      width: 13%;
      text-align: center;
}
.staDatas .head .spen {
      width: 13%;
      text-align: center;
}
.on {
  background: #123aca14;
}
.off {
  background: transparent;
}
</style>