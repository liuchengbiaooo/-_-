<template>
  <div class="login_page">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer">
        <div class="manage_tip">
          <span class="title">有一配置后台</span>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="loginForm">
          <el-form-item prop="username" class="login-item">
            <span class="fa-tips">
              <i class="fa fa-user"></i>
            </span>
            <el-input
              @keyup.enter.native="submitForm('loginForm')"
              class="area"
              type="text"
              placeholder="用户名"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" class="login-item">
            <span class="fa-tips">
              <i class="fa fa-lock"></i>
            </span>
            <el-input
              @keyup.enter.native="submitForm('loginForm')"
              class="area"
              type="password"
              placeholder="密码"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登 录</el-button>
          </el-form-item>
          <!-- <div class="tiparea">
						<p class="wxtip">温馨提示：</p>
						<p class="tip">用户名为：admin</p>
						<p class="tip">密码为：youyi.123</p>
          </div>-->
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  mounted() {},
  methods: {
    showMessage(type, message) {
      this.$message({
        type: type,
        message: message
      });
    },
    submitForm(loginForm) {
      this.$refs[loginForm].validate(valid => {
        if (valid) {
          this.loading = true;
          let userinfo = this.loginForm;
          // console.log("loginForm", this.loginForm);
          this.$store
            .dispatch("Login", userinfo)
            .then(res => {
				console.log(res)
              if (res.code == 200) {
                console.log(res, "gagagaga");
                this.$router.push({ path: this.redirect || "/" });
                this.$store.dispatch("initLeftMenu"); //设置左边菜单始终为展开状态
              }
            })
            .catch(err => {});
          // console.log("Agag")
          // this.$router.push({ path: '/' })
          // this.$store.dispatch('initLeftMenu');
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_page {
  position: absolute;
  width: 100%;
  height: 100%;
  // background: url(../assets/img/bg9.jpg) no-repeat center center;
  // background-size: 100% 100%;
  background-color: #2d3a4b;
}
.loginForm {
  background-color: #fff;
  padding: 20px;
  border-radius: 3px;
  box-shadow: 5px 5px 10px #01144c;
  .fa-tips {
    position: absolute;
    left: 10px;
    z-index: 20;
    color: #ff7c1a;
    font-size: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.manage_tip {
  margin-bottom: 20px;
  .title {
    font-family: cursive;
    font-weight: bold;
    font-size: 26px;
    color: #fff;
  }
  .logo {
    width: 60px;
    height: 60px;
  }
}
.form_contianer {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 20%;
  left: 39%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  font-size: 16px;
  .submit_btn {
    width: 100%;
    font-size: 16px;
    //letter-spacing:20px;
  }
}
.tiparea {
  text-align: left;
  font-size: 12px;
  color: #4cbb15;
  .tip {
    margin-left: 54px;
  }
  .tips {
    color: red;
  }
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
.loginForm {
  .el-button--primary {
    background-color: #409eff;
    border: 1px solid #409eff;
  }
}
.sanFangArea {
  border-top: 1px solid #dcdfe6;
  margin-top: 5px;
  padding: 5px;
  display: none;
  .title {
    font-size: 14px;
    color: #8b9196;
  }
  ul {
    li {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        width: 40px;
        height: 40px;
      }
    }
  }
}
</style>
