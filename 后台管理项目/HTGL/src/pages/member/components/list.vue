<template>
        <div>
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="用户编号" width="180"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="180"></el-table-column>

        <!-- 状态 -->
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==1"  type="primary">启用</el-button>
          <el-button  type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column prop="form.name" label="操作">
        <template slot-scope="scope">
             <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import {requestMemberList} from "../../../util/request"
import {mapGetters,mapActions} from "vuex"
export default {
   computed:{
       ...mapGetters({
           list:"member/list"
       })
   },
    data(){
        return {
            aaa:[],
            form:{
                name:""
            }
        }
    },
    methods:{
        ...mapActions({
            requestList:"member/requestList"
        }),
        edit(id){
            this.$emit("edit",id)
        }
    },
    mounted(){
        this.requestList();
    }
}



</script>

<style>

</style>