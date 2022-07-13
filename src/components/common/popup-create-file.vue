<template>
  <div class="popup-create-file" v-show="isShowCreateDialog">
    <div class="container">
      <div class="title-con">
        <p class="title">{{ isEdit ? "修改" : '新建'}}文件夹</p>
        <img class="close-icon" src="../../assets/image/menu/close-icon.png" alt="" @click="clickClose" />
      </div>

      <div class="line"></div>

      <div class="content-con">
        <p>文件夹名称</p>
        <input v-model="folderName" placeholder="请输入内容" class="file-name">
      </div>

      <div class="btn-group">
        <button class="cancle-btn" type="button" @click="clickClose">取消</button>
        <button class="submit-btn" type="button" @click="confirmBtn">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showCreateDialog: {
      type: Boolean,
      default: false
    },
    dbId: {
      type: Number,
      default: 0
    },
    parentId: {
      type: Number,
      default: 0
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    fileName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      folderName: '',
      newName: '',
      isShowCreateDialog: false
    }
  },
  watch: {
    showCreateDialog(value) {
      this.isShowCreateDialog = value;
    },
    fileName(value) {
      this.isEdit ? this.folderName = value : this.folderName = '';
    },
    isEdit(value) {
      value ? this.folderName = this.fileName : this.folderName = '';
    }
  },
  methods: {
    clickClose() {
      if (!this.isEdit) {
        this.folderName = ''
      }
      this.$emit('update:showCreateDialog', false);
    },
    confirmBtn() {
      this.isEdit ? this.editFile() : this.creatNewfolder()
    },
    creatNewfolder(){  //添加文件夹
      if(!this.folderName){
        this.$confirm("文件夹名称不能为空", '提示', {
          type: 'warning',
          customClass: "errormessage",
          showCancelButton: false,
          center: "true"
        })
        return;
      }
      console.log( this.parentId);

      this.$http.post('/menu', {
        parentId: this.dbId,
        name: this.folderName
      }).then(res=>{
        this.$emit('createNewMenu', true)
        this.clickClose();
        this.$notify({
          title: '信息提示',
          message: '文件夹新建成功',
          type: 'success',
          position: 'bottom-right',
        });
      })
    },
    editFile() {
      this.$http.put('/menu', {
        id: this.dbId,
        name: this.folderName
      }).then(res=>{
        this.$emit('createNewMenu', true)
        this.clickClose();
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
  height: 246px;
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
</style>