<template>
  <div class="popup-create-db-file" v-show="isShowCreateDbDialog">
    <div class="container">
      <div class="title-con">
        <p class="title">填写通道名称和说明</p>
        <img class="close-icon" src="../../assets/image/menu/close-icon.png" alt="" @click="clickClose" />
      </div>

      <div class="line"></div>

      <div class="content-con">
        <p>数据表</p>
        <input v-model="form.name" placeholder="请输入内容" class="file-name">
      </div>

      <div class="content-con">
        <p>通道一</p>
        <input v-model="form.title1" placeholder="请输入内容" class="file-name">
      </div>

      <div class="content-con">
        <p>通道二</p>
        <input v-model="form.title2" placeholder="请输入内容" class="file-name">
      </div>

      <div class="content-con">
        <p>通道三</p>
        <input v-model="form.title3" placeholder="请输入内容" class="file-name">
      </div>

      <div class="content-con">
        <p>通道四</p>
        <input v-model="form.title4" placeholder="请输入内容" class="file-name">
      </div>

      <div class="collect-con">
        <div v-for="(item, index) in collecStatusList" :key="'status' + index" class="item-con" :class="item.isChose ? 'select-bg' : 'unselect-bg'">
          <div class="isuse">
            <div v-for="(child, num) in radioList" class="radio-item" @click="choseRadio(index, num)">
              <div v-if="item.isChose" :class="item.itemActive == num ? 'active-style' : 'inactive-style'"></div>
              <div v-else class="no-chose"></div>
              <p class="radio-name">{{ child }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="progress">
        <div v-for="(item, index) in collecStatusList" class="progress-line">
          <div :class="[index === 0 ? 'short-line first-line' : 'long-line', item.isChose && item.itemActive === 1 && 'selected-line']"></div>
          <div class="circle" :class="index | classStatus"></div>
          <div v-if="index === 3" class="short-line last-line" :class="item.itemActive === 1 && 'selected-line'"></div>
        </div>
      </div>

      <div class="progress sensor-left">
        <div v-for="(item, index) in collecStatusList" class="progress-line">
          <p class="sensor-name">传感器 {{ index + 1 }}</p>
          <el-input-number v-if="index !== 3" v-model="collecStatusList[index].num" controls-position="right" :disabled="collecStatusList[index + 1].itemActive !== 1" :min="1"></el-input-number>
          <p v-if="index !== 3" class="sensor-m" :class="collecStatusList[index + 1].itemActive === 1 && 'color-change'">M</p>
        </div>
      </div>

      <div class="content-con">
        <div class="question-con">
          <img src="../../assets/image/menu/question-icon.png" class="question-icon" alt="Question" />
          说明
        </div>
        <input v-model="form.note" placeholder="请输入内容" class="file-name">
      </div>

      <div class="btn-group">
        <button class="cancle-btn" type="button" @click="clickClose">取消</button>
        <button class="submit-btn" type="button" @click="confirmBtn">确认分析</button>
      </div>
    </div>
  </div>
</template>

<script>
import enums from '../../utils/enums.js'

export default {
  props: {
    showCreateDbDialog: {
      type: Boolean,
      default: false
    },
    pid: {
      type: Number,
      default: 0
    },
    parentId: {
      type: Number,
      default: 0
    },
    isEdit: {
      type: Boolean,
      default: false
    }
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
  },
  data() {
    return {
      isShowCreateDbDialog: false,
      remark: '',
      form: {
        name: '',
        title1: '',
        title2: '',
        title3: '',
        title4: '',
        note: ''
      },
      collecStatusList: [
        {
          itemActive: null,
          isChose: true
        },
        {
          itemActive: null,
          isChose: false
        },
        {
          itemActive: null,
          isChose: false
        },
        {
          itemActive: null,
          isChose: false
        }
      ],
      radioList: ['停止使用', '投入使用', '环境采集'],
      active: 0
    }
  },
  watch: {
    showCreateDbDialog(value) {
      this.isShowCreateDbDialog = value;
    },
    pid(value) {
      this.isEdit ? this.editDb(this.pid) : this.init()
    },
    isEdit(value) {
      console.log(value)
      value ? this.editDb(this.pid) : this.init()
    }
  },
  methods: {
    init() {
      this.form = {
        name: '',
        head1: '',
        head2: '',
        head3: '',
        head4: '',
        inf: ''
      }
      this.collecStatusList = [
        {
          itemActive: null,
          isChose: true
        },
        {
          itemActive: null,
          isChose: false
        },
        {
          itemActive: null,
          isChose: false
        },
        {
          itemActive: null,
          isChose: false
        }
      ]
    },
    clickClose() {
      this.$emit('update:showCreateDbDialog', false);
      if (!this.isEdit) {
        this.init();
      }
    },
    choseRadio(index, num) {
      if (this.isEdit) {
        return
      }
      if (!this.collecStatusList[index].isChose) {
        return
      }
      this.collecStatusList[index].itemActive = num
      if (num === 1) {
        // this.$set(this.collecStatusList, index + 1, { itemActive: num, isChose:  true })
        this.collecStatusList[index + 1].isChose = true
      } else {
        for (let i = index + 1; i < this.collecStatusList.length; i++) {
          this.collecStatusList[i].itemActive = null;
          this.collecStatusList[i].isChose = false;
        }
      }
    },

    confirmBtn() {
      if (this.isEdit) {
        this.editNewDb()
      }
      else {
        this.creatNewDb()
      }
    },
    /**
     * 新建数据库
     */
    creatNewDb(){
      if(!this.form.name){
        this.$confirm("数据库名称不能为空", '提示', {
          type: 'warning',
          customClass: "errormessage",
          showCancelButton: false,
          center: "true"
        }).then(() => {
        }).catch(() => {
        });
        return;
      }

      const channelStateList = []
      this.collecStatusList.forEach((item) => {
        channelStateList.push(item.itemActive)
      })

      this.$http.post('/db', {
        ...this.form,
        parentMenuId: this.parentId,
        channelStateList: channelStateList,
        space12: this.collecStatusList[0].num || '',
        space23: this.collecStatusList[1].num || '',
        space34: this.collecStatusList[2].num || ''
      }).then(res=>{
        this.clickClose();
        this.$emit('createNewTable', true);
        this.$notify({
          title: '信息提示',
          message: '数据库新建成功',
          type: 'success',
          position: 'bottom-right',
        });
      })
    },
    editNewDb() {
      if(!this.form.name){
        this.$confirm("数据库名称不能为空", '提示', {
          type: 'warning',
          customClass: "errormessage",
          showCancelButton: false,
          center: "true"
        }).then(() => {
        }).catch(() => {
        });
        return;
      }

      const channelStateList = []
      this.collecStatusList.forEach((item) => {
        channelStateList.push(item.itemActive)
      })

      this.$http.put('/db', {
        id: this.pid,
        ...this.form,
        channelStateList: channelStateList,
        space12: this.collecStatusList[0].num || '',
        space23: this.collecStatusList[1].num || '',
        space34: this.collecStatusList[2].num || ''
      }).then(res=>{
        this.clickClose();
        this.$emit('createNewTable', true);
        this.$notify({
          title: '信息提示',
          message: '数据库修改成功',
          type: 'success',
          position: 'bottom-right',
        });
      })
    },
    editDb(value) {
      this.$http.get(`/db/${value}`).then(res=>{
        this.form = res.data
        if (this.form) {
          this.collecStatusList[0].itemActive = this.form.channelStateList[0]
          this.collecStatusList[1].itemActive = this.form.channelStateList[1]
          this.collecStatusList[2].itemActive = this.form.channelStateList[2]
          this.collecStatusList[3].itemActive = this.form.channelStateList[3]
          this.collecStatusList[0].num = this.form.space12
          this.collecStatusList[1].num = this.form.space23
          this.collecStatusList[2].num = this.form.space34 && ''
          this.collecStatusList.forEach((item, index) => {
            if (item.itemActive !== 4) {
              item.isChose = true
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.popup-create-db-file {
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
  width: 956px;
  height: 798px;
  background: #fff;
  text-align: center;
}

.title-con {
  display: flex;
  justify-content: space-between;
  margin-top: 26px;
  margin-left: 69px;
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
  width: 882px;
  height: 1px;
  background-color: #c4c4c4;
}

.content-con {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 400;
  color: #666;
  margin-bottom: 24px;
}

.file-name {
  margin-left: 28px;
  width: 720px;
  height: 32px;
  background: #fff;
  border-radius: 2px;
  font-size: 16px;
  font-weight: 400;
  border: 1px solid #666666;
  padding-left: 18px;
  color: #666;
}

input:placeholder {
  color: #c4c4c4;
}

button {
  border: none;
}

.btn-group {
  position: absolute;
  right: 65px;
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

.question-con {
  display: flex;
}

.question-icon {
  width: 24px;
  height: 24px;
}

.collect-con {
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-con {
  margin-left: 34px;
  margin-right: 34px;
  width: 149px;
  height: 127px;
  background-size: 100% 100%;
}

.select-bg {
  background: url("../../assets/image/menu/bubble_select.png") no-repeat 0 0;
}

.unselect-bg {
  background: url("../../assets/image/menu/bubble_unselect.png") no-repeat 0 0;
}

.isuse {
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-weight: 400;
  color: #666666;
  margin-top: 3px;
}

.radio-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
}

.active-style {
  width: 16px;
  height: 16px;
  background: #3E80BD;
  border-radius: 50%;
}

.inactive-style {
  width: 16px;
  height: 16px;
  border: 2px solid #3E80BD;
  border-radius: 50%;
}

.no-chose {
  width: 16px;
  height: 16px;
  border: 2px solid #A8A3A3;
  border-radius: 50%;
}

.radio-name {
  margin-left: 8px;
}

.progress {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

.progress-line {
  display: flex;
  align-items: center;
}

.short-line {
  width: 57px;
  height: 8px;
  background-color: #E5E5E5;
}

.first-line {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

.last-line {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.long-line {
  width: 202px;
  height: 8px;
  background-color: #E5E5E5;
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

.selected-line {
  background-color: #3E80BD;
}

.sensor-name {
  font-size: 16px;
  font-weight: 400;
  color: #6D6D6D;
  margin-right: 16px;
}

.popup-create-db-file /deep/ .el-input__inner {
  height: 30px;
  line-height: 30px;
  padding-right: 30px;
  padding-left: 5px;
}

.popup-create-db-file /deep/ .el-input-number {
  margin-left: 25px;
  width: 67px;
  line-height: 0;
}

.popup-create-db-file /deep/ .el-input-number__decrease {
  width: 26px;
  height: 15px;
  line-height: 15px;
}

.popup-create-db-file /deep/ .el-input-number__increase {
  width: 26px;
  height: 15px;
  line-height: 15px;
}

.sensor-left {
  margin-top: 11px;
  margin-left: 20px;
  margin-bottom: 79px;
}

.sensor-m {
  width: 32px;
  font-size: 18px;
  font-weight: 400;
  color: #ccc;
  margin-right: 19px;
  text-align: center;
}

.color-change {
  color: #3E80BD;
}
</style>