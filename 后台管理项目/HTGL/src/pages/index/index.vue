<template>
  <div class="sy-box">
    <!-- 左边导航栏 -->
    <el-container>
      <el-aside width="200px" class="left-color">
        <el-col :span="24">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
          >
            <el-menu-item index="/home">
             <i class="el-icon-setting"></i>
              <span slot="title">首页</span>
            </el-menu-item>
           
           
          <!-- 有目录的循环  -->
            <el-submenu v-show="hasChildren" :index="item.id+''" v-for="item in user.menus" :key="item.id">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item v-for="i in item.children" :key="i.id" :index="i.url">{{i.title}}</el-menu-item>
              
            </el-submenu>

          <!-- 没有目录，只有菜单 -->
           <el-menu-item v-show="!hasChildren" :index="i.url" v-for="i in user.menus" :key="i.id">
              <span slot="title">{{i.title}}</span>
            </el-menu-item>



          </el-menu>
        </el-col>
      </el-aside>
      <el-container>
        <!-- 头部内容区 -->
        <el-header class="heder-color">
          <span class="tb-yh">
           {{user.username}}
            <el-button type="primary" @click="exit">退出</el-button>
          </span>
        </el-header>
        <!-- 主体内容 -->
        <el-main>
          <!-- <div>{{$route.name}}</div> -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path:'/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
    
          </el-breadcrumb>
          <router-view class="view"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {mapGetters,mapActions} from "vuex"
export default {
  computed:{
    ...mapGetters({
      user:"user"
    }),
    // 用来判断是否有目录
    hasChildren(){
     return this.user.menus[0].children?true:false
    }
  },

  methods: {
    ...mapActions({
      "changeUser":"changeUser"
    }),
    // 退出
      exit(){
          this.changeUser(null);
          this.$router.push("/login")
      }
  
  }
};
</script>

<style>
.sy-box {
  width: 100vm;
  height: 100vh;
}
.left-color {
  background: #20222a;
  height: 100vh;
}
.el-menu-vertical-demo{
  border: 0px;
}
.heder-color {
  background: #b3c0d1;
}
.tb-yh {
  float: right;
  line-height: 60px;
  font-size: 16px;
}
.view{
  margin-top: 20px;
}
</style>