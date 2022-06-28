<template>
  <div class="login">
    <img class="logo-img" src="./assets/image/login/login_pic.png" alt="" />
    <div class="box">
      <p class="login-title">科技股份有限公司</p>
      <div class="name-con">
        <div class="logo-con">
          <div class="circle-one">
            <div class="circle-two"></div>
          </div>
        </div>
        <p class="name-word">设备检测系统</p>
      </div>
      <input v-model="username" placeholder="账号" class="username-word">
      <input v-model="password" placeholder="密码" type="password" class="password-word">
      <div class="btn" @click="submitForm">登录</div>
    </div>
  </div>
</template>
<script>
import { mapMutations} from "vuex";

export default {
  data() {
    return {
      username: "",
      password: "",
    }
  },
  methods: {
    ...mapMutations(['SETCOLLECTION']),
    submitForm() {
      this.$http.post('/admin/login',{
        name: this.username,
        password: this.password
      }).then(res=>{
        const data = res.data
        sessionStorage.setItem('username', data.name);
        localStorage.setItem("token", data.token);
        this.checkState();
        this.$notify({
          title: '成功',
          message: '登录成功',
          type: 'success',
          position: 'bottom-right',
        });
      })
    },
    checkState(){
      this.$http.get('/sample/status').then(res=>{
        this.password = "";
        this.username = "";
        // res.isSampling为true说明前端上次关闭时后端正在采集
        this.SETCOLLECTION(res.data.isSampling);
        sessionStorage.setItem('model', res.data.isSampling);
        sessionStorage.setItem('samplingDbId', res.data.dbId)
        this.$router.push("/homedata");
      })

    }
  }
}
</script>
<style scoped>
.login {
  width: 100%;
  height: 100%;
  min-height: 6.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: url("./assets/image/login/login_background.png") no-repeat 0 0;
  background-size: 100% 100%;
  position: relative;
}

.logo-img{
  width: 877px;
  height: 532px;
}

.box {
  position: absolute;
  left: 47%;
  border-radius: 2px;
  width: 414px;
  height: 612px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-title {
  margin-top: 110px;
  width: 100%;
  height: 21px;
  font-size: 16px;
  font-weight: 400;
  color: #0A244C;
  line-height: 19px;
  letter-spacing: 4px;
  text-align: center;
}

.name-con {
  margin-top: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-con {
  width: 44px;
  height: 44px;
  background: #3e80bd;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-one {
  width: 30px;
  height: 30px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-two {
  width: 20px;
  height: 20px;
  background: #3e80bd;
  border-radius: 50%;
}

.name-word {
  margin-left: 31px;
  font-size: 24px;
  font-weight: bold;
  color: #666666;
  line-height: 28px;
  letter-spacing: 6px;
}

input {
  width: 294px;
  height: 42px;
  background: #fff;
  border-radius: 2px;
  font-size: 20px;
  border: 1px solid #666666;
  padding-left: 22px;
}

input::placeholder {
  font-size: 20px;
  font-weight: 400;
  color: #c4c4c4;
}


.username-word {
  margin-top: 51px;
}

.password-word {
  margin-top: 16px;
}

.btn {
  margin-top: 16px;
  width: 294px;
  height: 42px;
  background: #3e80bd;
  border-radius: 2px;
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  color: #fff;
  line-height: 42px;
}
</style>
