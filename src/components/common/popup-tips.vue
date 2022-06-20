<template>
  <div class="popup-tips-file" v-show="isShowTipsDialog">
    <div class="container">
      <p class="title">提示</p>

      <div class="line"></div>

      <p class="tips-word">数据正在处理中，请稍后</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showTipsDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowTipsDialog: false
    }
  },
  watch: {
    showTipsDialog(value) {
      this.isShowTipsDialog = value;
    }
  }
}
</script>

<style scoped>
.popup-tips-file {
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
  width: 418px;
  height: 200px;
  background: #fff;
  text-align: center;
  border-radius: 2px;
}

.title {
  margin-top: 26px;
  margin-left: 74px;
  font-size: 24px;
  font-weight: 400;
  color: #0a244c;
  letter-spacing: 6px;
}

.line {
  margin: 24px auto 36px;
  width: 686px;
  height: 1px;
  background-color: #c4c4c4;
}

.tips-word {
  font-size: 20px;
  font-weight: 400;
  color: #666;
}
</style>