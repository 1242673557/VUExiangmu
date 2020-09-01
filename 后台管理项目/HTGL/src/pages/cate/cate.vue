<template>
<!--商品分类-->
  <div>
    <el-button type="primary" @click="add">添加</el-button>
      <!-- 弹框 -->
      <v-add :info="info" ref="add"></v-add>
      <!-- 列表 -->
      <v-list @edit="edit"></v-list>
  </div>
</template>

<script>
import vAdd from "./components/add";
import vList from "./components/list"
export default {
  components:{
    vAdd,
    vList,
   
  },
  data(){
    return {
      info:{
        show:false,
        title:"分类添加",
         isAdd:true
      }
    }
  },
  methods:{
    add(){
      this.info.show=true;
      this.info.isAdd=true
    },
   
    edit(id){
      this.info.show=true;
      this.info.title="分类编辑"
      this.info.isAdd=false;
      this.$refs.add.getDetail(id)
    }
  }
}
</script>

<style>

</style>