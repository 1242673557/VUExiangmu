<template>
  <div>
    <el-table :data="list" stripe style="width: 100%"
      row-key="id"
      border
      :tree-props="{children:'children'}"
    >
      <el-table-column prop="id" label="分类编号" width="180"></el-table-column>
      <el-table-column prop="catename" label="分类名称" width="180"></el-table-column>


       <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="$imgPre+scope.row.img" alt />
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-button  type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button v-else type="info" >禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <!-- 删除 -->            
          <!-- <del-btn @confirm="del(scope.row.id)"></del-btn> -->
          <del-btn type="danger" @confirm="del(scope.row.id)">删除</del-btn>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {mapGetters,mapActions} from "vuex"
import {requestCateDelete} from "../../../util/request"
import {successAlert,warningAlert} from "../../../util/alert"
export default {
  computed:{
    ...mapGetters({
      list:"cate/list"
    })
  },
  methods:{
    ...mapActions({
      requestList:"cate/requestList"
    }),
    edit(id){
      this.$emit("edit",id)
    },
      // 删除
  del(id){
    requestCateDelete({id:id}).then((res)=>{
       if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.requestList();
        } else {
          warningAlert(res.data.msg);
        }
    })
  }
  },
  mounted(){
    this.requestList()
  },

}
</script>

<style>
  img{
    width: 80px;
    height: 80px;
  }
</style>