<template>
  <div>
    <!-- 弹窗 -->
    <el-button type="primary" @click="add">添加</el-button>
    <v-add :info="info"  ref="add"></v-add>
    <!-- 列表 -->
    <v-list @edit="edit($event)"></v-list>
  </div>
</template>

<script>
import vAdd from "./components/add";
import vList from "./components/list";
export default {
  components: {
    vAdd,
    vList,
  },
  data(){
    return {
      info:{
        show:false,
        title:"活动添加",
        isAdd:true
      }
    }
  },
  methods:{
    add(){
      this.info.show=true
      this.info.title="活动添加",
      this.info.isAdd=true
    },
    edit(id){
      this.info.show=true,
        this.info.title="活动编辑",
      this.info.isAdd=false
       this.$refs.add.getDetail(id);
    }
  }
};
</script>

<style>
</style>