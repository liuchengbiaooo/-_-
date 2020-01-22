<template>
  <div>
    <div class="bnt" @click="dialogVisible = true">新增版块</div>
    <div class="fillcontain">
      <template>
        <el-table :data="tableData" style="width: 100%" border :row-class-name="tableRowClassName">
          <el-table-column prop="id" label="编号" width="100" align="center"></el-table-column>
          <el-table-column prop="name" label="版块名称" align="center"></el-table-column>
          <el-table-column prop="platform" label="版块平台" align="center"></el-table-column>
          <el-table-column prop="games_number" label="包含游戏数量" align="center"></el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="updated_at" label="更新时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="removeSection(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 新增 -->
      <el-dialog
        title="新增版块"
        :visible.sync="dialogVisible"
        style="margin-top: 0vh"
        width="40%"
        :modal="false"
      >
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="版块名称">
            <el-input v-model="form.sectionName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSections(form)">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog
        :title="titlieName + `--` +`游戏列表`"
        :visible.sync="gameListShow"
        style="margin-top: 0vh"
        width="70%"
        :modal="false"
      >
        <div class="addBtn" @click="Putaway">新增上架</div>
        <el-table
          :data="sectionGames"
          style="width: 100%"
          border
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="id" label="编号" width="100" align="center"></el-table-column>
          <el-table-column prop="name" label="游戏名称" align="center"></el-table-column>
          <el-table-column prop="icon" label="游戏图标" align="center"></el-table-column>
          <el-table-column prop="type" label="游戏类型" align="center"></el-table-column>
          <el-table-column prop="theme" label="游戏题材" align="center"></el-table-column>
          <el-table-column prop="platform" label="游戏平台" align="center"></el-table-column>
          <el-table-column prop="intro" label="游戏介绍" align="center"></el-table-column>
          <el-table-column prop="url" label="游戏链接" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <!-- <el-checkbox v-model="checked">首页推荐</el-checkbox> -->
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">下架</el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="gameListShow = false">取 消</el-button> -->
          <el-button type="primary" @click="gameListShow = false">保存设置</el-button>
        </span>
      </el-dialog>
      <!-- 新增上架 -->
      <el-dialog
        title="新增上架"
        :visible.sync="addPutaway"
        style="margin-top: 0vh"
        width="30%"
        :modal="false"
      >
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmPutaway">确定上架</el-button>
          <el-button @click="addPutaway = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
var cityOptions = [];
import { gameList } from "../../api/game";
import {
  sectionList,
  addSection,
  sectionGameList,
  allowPutaway,
  soldOutGame,
  deleteSection
} from "../../api/official";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tableData: [],
      form: {
        sectionName: ""
      },
      terraceList: [],
      dialogVisible: false,
      gameListShow: false,
      addPutaway: false,
      titlieName: "",
      sectionGames: [{ id: 0, name: "测试" }],
      checked: "",
      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      isIndeterminate: true,
      OnTheGame: "",
      plateID: ""
    };
  },
  components: {},
  computed: {
    ...mapGetters(["gamePlatforms"])
  },
  async mounted() {
    this.sections();
    let reslut = await gameList();
    if (reslut.code == 200) {
      cityOptions = reslut.data.list;
      this.cities = reslut.data.list;
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    // 编辑
    handleEdit(index, row) {
      this.gameListShow = true;
      this.titlieName = row.name;
      this.plateID = row.id;
      this.section_game();
    },
    //下架游戏
    async handleDelete(index, row) {
      let plate_id = this.plateID;
      let game_id = row.id;
      let reslut = await soldOutGame(plate_id, game_id);
      if (reslut.code == 200) {
        this.$message({
          message: "下架成功!",
          type: "success"
        });
        this.section_game();
      }
    },
    //获取版块内游戏列表
    async section_game() {
      let result = await sectionGameList(this.plateID);
      if (result.code == 200) {
        this.sectionGames = result.data.list;
      }
    },
    //游戏平台
    terrace(event) {
      this.form.gameTerrace = event;
    },
    //新增版块
    async addSections(form) {
      let platform = "web";
      let name = this.form.sectionName;
      let result = await addSection(platform, name);
      if (result.code == 200) {
        this.$message({
          message: "添加成功!",
          type: "success"
        });
        this.sections();
        this.form.sectionName = "";
        this.dialogVisible = false;
      }
    },
    //删除版块
    removeSection(index, row) {
      let id = row.id;
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteSection(id)
            .then(response => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.sections(); //刷新版块列表
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
    //新增上架游戏
    Putaway() {
      this.addPutaway = true;
    },
    //版块列表
    async sections() {
      let platform = "web";
      let result = await sectionList(platform);
      if (result.code == 200) {
        this.tableData = result.data.list;
      }
    },
    //确定上架
    async confirmPutaway() {
      let plate_id = this.plateID;
      let game_id = this.OnTheGame.join(",");
      console.log(game_id, this.plateID);
      let reslut = await allowPutaway(plate_id, game_id);
      if (reslut.code == 200) {
        this.$message({
          message: "上架成功!",
          type: "success"
        });
        this.section_game();
        this.addPutaway = false;
      }
    },
    //多选框操作
    handleCheckAllChange(val) {
      this.checkAll = !!this.checkAll;
      let checked = cityOptions.map(function(item) {
        return item.id;
      });
      this.checkedCities = this.checkAll ? checked : [];
      this.isIndeterminate = false;
      this.OnTheGame = this.checkedCities;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
      this.OnTheGame = value;
    }
  }
};
</script>

<style lang="less" scoped>
.bnt {
  cursor: pointer;
  width: 100px;
  height: 40px;
  background-color: #409eff;
  color: #fff;
  font-size: 16px;
  border-radius: 8px;
  text-align: center;
  line-height: 40px;
  margin: 20px 100px 0px 20px;
}
.addBtn {
  width: 80px;
  height: 30px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  border-radius: 8px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  margin-bottom: 20px;
}
</style>


