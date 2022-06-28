
<template>
  <div class="home">
  <!-- 顶部 -->
    <div class="top">
      <div class="name-con">
        <div class="logo-con">
          <div class="circle-one">
            <div class="circle-two"></div>
          </div>
        </div>
        <p class="name-word">设备检测系统</p>
      </div>

      <div class="tab_box">
        <div class="tab" v-for="(item, index) in tabList" :key="'tab' + index" :class="tabActive === item.path && 'active-style'">
          <div class="left-tab-con">
            <img v-if="tabActive === item.path" src="../../assets/image/login/select.png" class="icon" alt="" />
            <img v-else src="../../assets/image/login/unselect.png" class="icon" alt="" />
            <p>{{ item.text }}</p>
          </div>
          <div v-if="index !== tabList.length - 1" class="line"></div>
        </div>

        <div class="back" v-if="tabActive != '/homedata'" @click="goBack">返回</div>
      </div>

      <div class="user_info">
        <div class="user_info1">
          <img class="user_img" src="../../assets/image/login/user.png" alt="" />
          <span class="user_info2">{{ username }}</span>
          <i @click="goOut" class="el-icon-caret-bottom"></i>
        </div>
      </div>
    </div>

    <div class="middleContent">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations} from "vuex";
export default {
  data () {
    return {
      tabActive: "/homedata",
      username: sessionStorage.getItem("username"),
      tabList:[
        {id:1,text:'数据目录',path:'/homedata'},
        {id:2,text:'数据分析',path:'/homeinstall'},
        {id:3,text:'波形分析',path:'/homeList'}
      ]
    }
  },
  mounted() {
    if (sessionStorage.getItem('tabActive')) {
      this.tabActive = sessionStorage.getItem('tabActive')
    }
  },
  methods:{
    goOut(){
      this.$confirm("确定退出当前登录吗？", '提示', {
        type: 'warning',
        customClass: "errormessage",
        showCancelButton: false,
        center: "true"
      }).then(() => {
        console.log(localStorage.getItem('token'));
        this.$http.post('/admin/logout', {} ,{
          headers: {'token': localStorage.getItem('token') }
        }).then(res=>{
          sessionStorage.setItem('username',"");
          localStorage.removeItem('token');
          sessionStorage.setItem('samplingDbId', "")
          sessionStorage.setItem('choseDbId', "")
          sessionStorage.setItem('startTime', '')
          sessionStorage.setItem('endTime', '')
          sessionStorage.setItem('channelId', '')
          this.$router.push("/login")
        })
      }).catch(() => {
      });
    },
    goBack() {
      let num = 0
      this.tabList.forEach((tab, index) => {
        if (this.tabActive == tab.path) {
          num = index
        }
      })
      if (num >= 0) {
        this.tabActive = this.tabList[num - 1].path
      }
      else {
        return
      }
      this.$router.push({
        path: this.tabActive
      })
    }
  },
  watch:{
    '$route':{
      handler(){
        this.tabActive = this.$route.path;
        sessionStorage.setItem('tabActive', this.$route.path);
      }
    }
  }
}
</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
  background: #fff;
}

.name-con {
  margin-left: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-con {
  width: 44px;
  height: 44px;
  background: #fff;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-one {
  width: 30px;
  height: 30px;
  background: #0a244c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-two {
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
}

.name-word {
  margin-left: 31px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  line-height: 88px;
  letter-spacing: 6px;
}

.top {
  height: 88px;
  width: 100%;
  background: #0a244c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.user_info {
  display: flex;
  margin-right: 63px;
}

.user-img {
  width: 32px;
  height: 32px;
}

.user_info1 {
  display: flex;
  align-items: center;
  justify-content: center;
}

.user_info2 {
  margin-left: 24px;
  margin-right: 13px;
  font-size: 20px;
  font-weight: 400;
  color: #fff;
}

.tab_box {
  display: flex;
  width: 650px;
}

.back {
  margin-left: 55px;
  font-size: 18px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #FFFFFF;
  cursor: pointer;
}

.left-tab-con {
  display: flex;
  align-items: center;
  width: 112px;
}

.tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 400;
  color: #c4c4c4;
  cursor: pointer;
}

.icon {
  margin-right: 16px;
  width: 16px;
  height: 16px;
}

.active-style {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}

.line {
  margin: 0 11px;
  width: 80px;
  height: 2px;
  background: #c4c4c4;
}

.middleContent{
  width: 100%;
  height: calc(100% - 98px);
  overflow: hidden;
}
</style>