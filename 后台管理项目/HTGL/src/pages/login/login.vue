<template>
  <div class="bj-color">
    <div class="login-box">
      <h1>登录</h1>
      <el-input class="input" v-model="user.username" clearable></el-input>
      <el-input class="input" clearable show-password v-model="user.password"></el-input>
      <div class="btn-box">
        <el-button type="primary" class="login-btn" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {requestLogin} from "../../util/request"
import {successAlert,warningAlert} from "../../util/alert"
import {mapActions} from "vuex"

export default {
  data(){
    return {
      user:{
        username:"",
        password:""
      }
    }
  },
  methods:{
    ...mapActions({
      "changeUser":"changeUser"
    }),
    login(){
      requestLogin(this.user).then(res=>{
        if(res.data.code===200){
          // 登录
          successAlert("登录成功")
          // vuex保存了用户信息
          this.changeUser(res.data.list)
          // 跳转页面
          this.$router.push("/home")
        }else{
          warningAlert(res.data.msg)
        }
      })
    }
  }
  
};
</script>

<style>
.bj-color {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #563444, #313d5f);
}
.login-box {
  width: 400px;
  height: 250px;
  background-color: #ffffff;
  border-radius: 10px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
h1 {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  line-height: 50px;
  padding-top: 20px;
}
.input {
 /* margin-left: 30px; */
 width: 340px;
 margin-left: 30px;
  margin-bottom: 20px;
}
.login-btn{
    width: 340px;
 margin-left: 30px;
}
</style>