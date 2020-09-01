
<template>
<!-- 轮播图 -->
  <div>
    <el-button type="primary" @click="add">添加</el-button>
      <!-- 弹窗 -->
      <v-add :info="info" ref="add"></v-add>
      <!-- 表单 -->
      <v-list @edit="edit($event)"></v-list>
  </div>
</template>

<script>
import vAdd from "./components/add";
import vList from "./components/list"
export default {
components:{
  vAdd,
  vList
},
data(){
  return {
    info:{
      show:false,
      title:"轮播图列表",
      isAdd:true
    }
  }
},
methods:{
  add(){
    this.info.show=true
    this.info.title="轮播图列表"
    this.info.isAdd=true
  },
  edit(id){
    this.info.show=true;
    this.info.title="轮播图编辑"
    this.info.isAdd=false
    this.$refs.add.getDetail(id)
  }
}
}
</script>

<style>

</style>