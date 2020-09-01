<template>
  <div>
    <!-- 弹框 -->
    <v-add :info="info" ref="add"></v-add>
    <!-- 表单 -->
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
        show:false
      }
    }
  },
  methods:{
    edit(id){
      this.info.show=true;
      this.$refs.add.getDetail(id)
    }
  }
};
</script>

<style>
</style>