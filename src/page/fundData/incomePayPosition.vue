<template>
  <div class="game">
    <div class="bnt" @click="addGames">新增游戏</div>
    <div class="fillcontain">
      <template>
        <el-table :data="tableData" style="width: 100%" border :row-class-name="tableRowClassName">
          <el-table-column prop="id" label="游戏ID" width="100" align="center"></el-table-column>
          <el-table-column prop="name" label="游戏名称" align="center"></el-table-column>
          <el-table-column prop="icon" label="游戏图标" align="center"></el-table-column>
          <el-table-column prop="type" label="游戏类型" align="center"></el-table-column>
          <el-table-column prop="theme" label="游戏题材" align="center"></el-table-column>
          <el-table-column prop="platform" label="游戏平台" align="center"></el-table-column>
          <el-table-column prop="img" label="游戏图片" align="center"></el-table-column>
          <el-table-column prop="intro" label="游戏介绍" align="center"></el-table-column>
          <el-table-column prop="url" label="游戏链接" align="center"></el-table-column>
          <!-- <el-table-column prop="address" label="浮窗显示" align="center"></el-table-column> -->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-dialog
        :title="title + `游戏`"
        :visible.sync="dialogVisible"
        style="margin-top: -10vh"
        width="40%"
        :modal="false"
      >
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="游戏名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="游戏图标">
            <el-upload
              class="avatar-uploader"
              action=" '' "
              :http-request="upload"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="txt_color">尺寸规格:64*64，小于100k</div>
          </el-form-item>
          <el-form-item label="游戏类型">
            <el-input v-model="form.type"></el-input>
          </el-form-item>
          <el-form-item label="游戏题材">
            <el-input v-model="form.theme"></el-input>
          </el-form-item>
          <el-form-item label="游戏链接">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item label="游戏平台">
            <el-select v-model="form.platform" @change="terrace" placeholder="请选择游戏平台">
              <el-option
                v-for="item in gamePlatforms"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="游戏浮窗">
            <el-switch v-model="form.window_display"></el-switch>
          </el-form-item>
          <el-form-item label="游戏介绍">
            <el-input type="textarea" v-model="form.intro" maxlength="300" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="游戏内容图片" class="imgList">
            <el-upload
              action=" '' "
              list-type="picture-card"
              :auto-upload="true"
              :before-upload="beforeUpload"
              :disabled="disabled"
              :http-request="changeRequest"
            >
              <i slot="default" class="el-icon-plus"></i>
            </el-upload>
            <!-- <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>-->
            <div class="txt_color">尺寸要求:60*640,大小:小于200k(最多6张)</div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmGame">确 定</el-button>
        </span>
      </el-dialog>
      <div>
        <el-pagination
          class="paging"
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="1000"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  gameList,
  gameIcon,
  addGame,
  deleteGame,
  compileGame
} from "../../api/game";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      //serverUrl: "http://192.168.3.22/youyi_center/public/admin/upload/icon",
      form: {
        window_display: true,
        intro: "",
        platform: "",
        url: "",
        theme: "",
        type: "",
        name: "",
        icon: ""
      },
      title: "新增",
      imageUrl: "",
      picList: [],
      disabled: false,
      type: "",
      gameID: "",
      page: 1
    };
  },
  mounted() {
    this.games();
    //this.headers = { "Login-Token": this.token };
    //console.log(this.$store)
  },
  computed: {
    ...mapGetters(["gamePlatforms"])
  },
  components: {},
  beforeDestroy() {},
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    //编辑
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.title = "编辑";
      this.gameID = row.id;
      this.form = row;
      this.type = "compile";
    },
    //新增
    addGames() {
      this.dialogVisible = true;
      this.form = {};
      this.type = "add";
    },
    //删除
    handleDelete(scope) {
      let id = scope.row.id;
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteGame(id)
            .then(response => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.games(); //刷新管理员列表
            })
            .catch(err => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //获取游戏库列表
    async games() {
      let page = this.page;
      let result = await gameList(page);
      this.tableData = result.data.list;
    },
    beforeAvatarUpload(file) {
      console.log("file", file);
      const isLt2M = file.size / 1024 < 100;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 100kb!");
      }
      return isLt2M;
    },
    beforeUpload(file) {
      if (this.picList.length == 5) {
        this.disabled = true;
      }
      const isLt = file.size / 1024 < 200;
      if (!isLt) {
        this.$message.error("上传头像图片大小不能超过 200kb!");
      }
      return isLt;
    },
    //图片列表上传
    changeRequest(item) {
      let formDataList = new FormData();
      formDataList.append("file", item.file);
      gameIcon(formDataList)
        .then(res => {
          if (res.code == 200) {
            let result = res.data;
            this.picList.push(result.url);
          }
        })
        .catch(err => {});
    },
    // 上传
    upload(item) {
      let formData = new FormData();
      formData.append("file", item.file);
      gameIcon(formData)
        .then(res => {
          if (res.code == 200) {
            let imageUrl = res.data.whole_url;
            this.imageUrl = imageUrl;
            this.form.icon = res.data.url;
          }
        })
        .catch(err => {});
    },
    //游戏平台选择
    terrace(event) {
      this.form.platform = event;
      console.log(event);
    },
    //分页
    handleCurrentChange(val) {
      this.page = val;
      this.games();
    },
    //确定
    confirmGame() {
      let id = this.gameID;
      let name = this.form.name;
      let icon = this.form.icon;
      let type = this.form.type;
      let theme = this.form.theme;
      let url = this.form.url;
      let platform = this.form.platform;
      let img = this.picList.join("");
      let intro = this.form.intro;
      let window_display = this.form.window_display ? "1" : "0";
      if (this.type == "add") {
        addGame(
          name,
          icon,
          type,
          theme,
          url,
          platform,
          img,
          intro,
          window_display
        )
          .then(res => {
            if (res.code == 200) {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.games();
              this.dialogVisible = false;
            }
          })
          .catch(err => {});
      } else if (this.type == "compile") {
        compileGame(
          id,
          name,
          icon,
          type,
          theme,
          url,
          platform,
          img,
          intro,
          window_display
        )
          .then(res => {
            if (res.code == 200) {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.games();
              this.dialogVisible = false;
            }
          })
          .catch(err => {});
      }
    }
  }
};
</script>


<style lang="less" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed rgb(46, 45, 45);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 1px dotted #dcdfe6;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.game {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  height: 100vh;
  overflow: auto !important;
  .bnt {
    width: 100px;
    height: 40px;
    background-color: #409eff;
    color: #fff;
    font-size: 16px;
    border-radius: 8px;
    text-align: center;
    line-height: 40px;
    margin: 20px 0px 0px 20px;
  }
  .fillcontain {
    flex: 1;
    position: relative;
    margin-bottom: 250px;
    .paging {
      position: absolute;
      right: 0;
    }
    .txt_color {
      color: red;
      font-size: 12px;
    }
  }
}
</style>


