<template>
  <div>
    <el-table :data="list" stripe style="width: 100%">
   
      <el-table-column prop="title" label="活动名称" width="140"></el-table-column>


    <!-- 状态 -->
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
        <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
        <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>

    <!-- 操作 -->
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
        <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
        <!-- 删除 -->
        <del-btn @confirm="del(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {mapGetters,mapActions} from "vuex"
import { successAlert, warningAlert } from '../../../util/alert'
import {requestSeckillDelete} from "../../../util/request"
export default {
    data(){
        return {
            aaa:[],
            from:{
                name:"",
            }
        }
    },
    computed: {
    ...mapGetters({
      list: "seckill/list",
      
    }),
  },
  methods:{
        ...mapActions({
      requestList: "seckill/requestList",
    }),
    edit(id){
        this.$emit("edit",id)
    },
    // 擅长
    del(id){
      requestSeckillDelete({id:id}).then((res)=>{
        if(res.data.code==200){
          successAlert(res.data.msg)
          // 刷新页面
          this.requestList()
        }else{
          warningAlert(res.data.msg)
        }
      })
    }
  },
  mounted(){
    this.requestList();
  }
}
</script>

<style>

</style>