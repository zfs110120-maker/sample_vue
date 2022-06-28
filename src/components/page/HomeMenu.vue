<template>
  <div class="homedata">
    <div class="content_box">
      <!-- 左侧区域 -->
      <div class="left_box" v-if="isShowLeft">
        <div class="top">
          <div v-for="(item, index) in headList" :key="'head' + index" @click="handleHead(index)">
            <img class="head-icon" :src="item.img" alt=""/>
            <p>{{ item.name }}</p>
          </div>
        </div>

        <div class="line-middle"></div>

        <el-tree class="table-con" :data="askFilelist" ref="dataConfigTree" node-key="id" highlight-current default-expand-all @node-click="getReadDbcontents">
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <img class="img-icon" v-if="data.type === 'db'" src="../../assets/image/menu/db.png" alt="">
            <span class="db-name">{{ data.name }}</span>
          </div>
        </el-tree>

      </div>
      <!-- 右侧 -->
      <div class="right_box">
        <home-free @showLeft="showLeft" :is-chose-db="sourceId"></home-free>
      </div>
    </div>

    <!-- 新建文件夹 -->
    <popup-create-file :show-create-dialog.sync="showCreateDialog" :parent-id="parentId" :db-id="dbDir" :file-name="fileName" :is-edit="isEdit" @createNewMenu="createNewMenu" />

    <!-- 填写通道名称和说明弹出框 -->
    <popup-create-db :show-create-db-dialog.sync="showCreateDbDialog" :parent-id="parentId" :pid="sourceId" :is-edit="isEdit" @createNewTable="createNewTable" />

    <!-- 查看数据的提示 -->
    <popup-tips :show-tips-dialog.sync="showTipsDialog" />
  </div>
</template>
<script>
import { mapState, mapMutations} from "vuex";
import HomeFree from './HomeFree.vue';
import PopupCreateFile from '../common/popup-create-file.vue';
import PopupCreateDb from '../common/popup-create-db.vue';
import PopupTips from '../common/popup-tips.vue';

export default {
  components: {
    HomeFree,
    PopupCreateFile,
    PopupCreateDb,
    PopupTips
  },
  data() {
    return {
      showCreateDialog: false,
      showCreateDbDialog: false,
      showTipsDialog: false,
      isShowLeft: true,
      headList: [
        {
          name: '新建文件夹',
          img: require('../../assets/image/menu/new_folder.png')
        },
        {
          name: '新建数据库',
          img: require('../../assets/image/menu/new_db.png')
        },
        {
          name: '修改',
          img: require('../../assets/image/menu/rename.png')
        },
        {
          name: '删除',
          img: require('../../assets/image/menu/delete.png')
        }
      ],
      askFilelist : [],
      dbDir: null,
      isEdit: true,
      fileName: '',
      tableData: [],
      sampleCount: 0,
      parentId: null,
      sourceId: null
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
    if(this.collection || sessionStorage.getItem('model') === 'true') {
      this.isShowLeft = false;
      this.$refs.dataConfigTree.setCurrentKey(sessionStorage.getItem('samplingDbId'));
      this.sourceId = sessionStorage.getItem('samplingDbId');
      this.choseDb(sessionStorage.getItem('samplingDbId'));
    }
  },
  mounted(){
    this.getAskFilelist();
    if (sessionStorage.getItem('choseDbId')) {
      this.$refs.dataConfigTree.setCurrentKey(sessionStorage.getItem('choseDbId'));
      this.choseDb(sessionStorage.getItem('choseDbId'));
    }
  },
  methods: {
    showLeft(data) {
      if(!data) {
        this.isShowLeft = false
      }
      else {
        this.isShowLeft = true;
      }
    },
    handleHead(index) {
      switch(index) {
        case 0:
          this.showCreateDialog = true;
          this.isEdit = false;
          break;

        case 1:
          this.showCreateDbDialog = true;
          this.isEdit = false;
          break;

        case 2:
          this.handModify();
          break;

        case 3:
          this.handDelete();
          break;

        default:
          break;
      }
    },
    getAskFilelist(){   //请求文件目录列表
      this.$http.get('/menu/tree').then(res=>{
        this.askFilelist = res.data;
      })
    },

    createNewMenu(data) {
      if(data) {
        this.getAskFilelist()
      }
    },

    createNewTable(data) {
      if(data) {
        this.getAskFilelist()
      }
    },

    /**
     * 删除文件夹
     */
    deleteFolder(){
      this.$http.delete(`/menu/${this.dbDir}`).then(res=>{
        this.getAskFilelist();
        this.$notify({
          title: '信息提示',
          message: '删除成功',
          type: 'success',
          position: 'bottom-right',
        });
      })
    },
    getReadDbcontents(data){
      if(data){
        this.parentId = Number(data.parentId);
        this.sourceId = data.sourceId;
        this.dbDir = Number(data.id);
        this.fileName = data.name;
        this.type = data.type;
      }
      if(this.type == 'folder'){
        this.tableData = [];
        return
      }
      this.$refs.dataConfigTree.setCurrentKey(this.dbDir);
      sessionStorage.setItem('sourceId', data.sourceId);
      this.choseDb(data.id)
    },

    choseDb(value) {
      sessionStorage.setItem('choseDbId', value)
    },

    handDelete(){
      if(!this.dbDir) {
        this.$confirm("请选择一条数据操作", '提示', {
          type: 'warning',
          customClass: "errormessage",
          showCancelButton: false,
          center: "true"
        }).then(() => {
        }).catch(() => {
        });
        return;
      }
      if(this.parentId === 0){
        this.$confirm("根目录不能删除", '提示', {
          type: 'warning',
          customClass: "errormessage",
          showCancelButton: false,
          center: "true"
        }).then(() => {
        }).catch(() => {
        });
        return;
      }
      this.$confirm("确定删除当前数据吗？", '提示', {
        type: 'warning',
        customClass: "errormessage",
        showCancelButton: true,
        center: "true"
      }).then(() => {
        this.deleteFolder();
      })
    },

    handModify(){//修改
      if(!this.dbDir) {
        this.$confirm("请选择一条数据操作", '提示', {
          type: 'warning',
          customClass: "errormessage",
          showCancelButton: false,
          center: "true"
        }).then(() => {
        }).catch(() => {
        });
        return;
      }
      if (this.type === 'folder'){
        this.showCreateDialog = true;
        this.isEdit = true;
      } else {
        this.showCreateDbDialog = true;
        this.isEdit = true;
      }
    }
  }
};
</script>
<style scoped>
.homedata {
  width: 100%;
  height: 100%;
}

.content_box {
  display: flex;
  width: 100%;
  height: 100%;
}

/* 左侧区域 */
.left_box {
  width: 396px;
  padding-left: 30px;
  padding-right: 30px;
  height: 100%;
  background: #fcfbfb;
  border-right: 1px solid #ccc;
  box-shadow: 0px 0px 20px 1px rgba(0, 65, 112, 0.1);
}

.top{
  padding-top: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  color: #666;
}

.top div {
  flex:1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.head-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 5px;
}

.line-middle {
  margin: 34px auto 30px;
  width: 336px;
  height: 1px;
  background: #ccc;
}

.table-con {
  background: #fcfbfb;
  overflow-y: scroll;
  height: 80%;
}

.img-icon {
  width: 24px;
  height: 24px;
}

.db-name {
  margin-left: 19px;
  font-size: 16px;
  font-weight: 400;
  color: #666;
  line-height: 32px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: .1rem;
  height: 48px;
}

.homedata /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background: #e5f2ff !important;
  height: 48px;
}

.homedata /deep/ .el-tree-node__content {
  height: 48px;
}

.homedata /deep/ .el-icon-caret-right:before {
  display: inline-block;
  width: 24px;
  height: 24px;
  content: "";
  background: url("../../assets/image/menu/arrow_merge.png") no-repeat 0 0;
  background-size: 100%;
}

.homedata /deep/ .is-leaf:before {
  background: url("") no-repeat 0 0;
}

/* 右侧区域 */
.right_box {
  overflow: hidden;
  height: 100%;
  background: #fff;
  width: 100%;
  overflow-y: scroll;
}
</style>