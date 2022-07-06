<template>
  <div class="popup-create-file" v-show="isShowGetDialog">
    <div class="container">
      <div class="title-con">
        <p class="title">采集参数确认</p>
        <img class="close-icon" src="../../assets/image/menu/close-icon.png" alt="" @click="clickClose" />
      </div>

      <div class="line"></div>

      <div class="content-con">
        <p>时基设置</p>
        <input v-model="timeBase" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入内容" class="file-name">
      </div>

      <div class="content-con">
        <p>阈值设置</p>
        <input v-model="threshold" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入内容" class="file-name">
      </div>

      <div class="btn-group">
        <button class="cancle-btn" type="button" @click="clickClose">取消</button>
        <button class="submit-btn" type="button" @click="handCollectionOk">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showGetDialog: {
      type: Boolean,
      default: false
    },
    sourceId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      timeBase: null,
      threshold: null,
      isShowGetDialog: false
    }
  },
  watch: {
    showGetDialog(value) {
      this.isShowGetDialog = value;
    }
  },
  methods: {
    clickClose() {
      this.$emit('update:showGetDialog', false);
      this.$emit('cancleCollect', true)
    },
    handCollectionOk() {
      this.$emit('cancleCollect', false)
      this.$http.post('/sample/start', {
        dbId: this.sourceId,
        argTime: Number(this.timeBase),
        argThreshold: Number(this.threshold)
      }).then(res=>{
        // this.setStartTime();
        this.$emit('update:showGetDialog', false);
        this.$emit('collect', true)
      })
    }
  }
}
</script>

<style scoped>
.popup-create-file {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(127, 127, 127, 0.8);
  z-index: 199;
}

.container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 750px;
  height: 302px;
  background: #fff;
  text-align: center;
}

.title-con {
  display: flex;
  justify-content: space-between;
  margin-top: 26px;
  margin-left: 74px;
  font-size: 24px;
  font-weight: 400;
  color: #0a244c;
  letter-spacing: 6px;
}

.close-icon {
  width: 32px;
  height: 32px;
  margin-right: 79px;
}

.line {
  margin: 24px auto;
  width: 686px;
  height: 1px;
  background-color: #c4c4c4;
}

.content-con {
  display: flex;
  justify-content: center;
  font-size: 20px;
  font-weight: 400;
  color: #666;
  margin-bottom: 24px;
}

.file-name {
  margin-left: 28px;
  width: 494px;
  height: 32px;
  background: #fff;
  border-radius: 2px;
  font-size: 16px;
  font-weight: 400;
  border: 1px solid #666666;
  padding-left: 17px;
}

input:placeholder {
  color: #c4c4c4;
}

button {
  border: none;
}

.btn-group {
  position: absolute;
  right: 74px;
  bottom: 32px;
  font-size: ;
  font-weight: 400;
  color: #a8a3a3;
  text-align: center;
  line-height: 40px;
}

.cancle-btn {
  width: 96px;
  height: 40px;
  background: #fff;
  border-radius: 2px;
  border: 1px solid #6d6d6d;
}

.submit-btn {
  width: 96px;
  height: 40px;
  background: #3cb4e6;
  border-radius: 2px;
  color: #fff;
}
</style>