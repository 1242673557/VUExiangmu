<template>
  <div>
    <el-table :data="list" stripe style="width: 100%">
      <el-table-column prop="id" label="编号" width="140">

      </el-table-column>
      <el-table-column prop="title" label="轮播图标题" width="140"></el-table-column>


      <!-- 图片 -->
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="$imgPre+scope.row.img" alt />
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
        <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
        <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>

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
import { mapActions, mapGetters } from "vuex";
import {requestBannerDelete} from "../../../util/request"
import {successAlert,warningAlert} from "../../../util/alert"
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      list: "banner/list",
    }),
  },
  methods: {
    ...mapActions({
      requestList: "banner/requestList",
    }),
    edit(id){
        this.$emit("edit",id)
    },
    // 删除
    del(id){
           requestBannerDelete({ id: id }).then((res) => {
        if (res.data.code == 200) {
          successAlert("删除成功");
          this.requestList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    }
  },
  data() {
    return {
      form: {
        title: "",
        img: "",
        status: "",
      },
    };
  },
  mounted() {
    this.requestList();
  },
};
</script>

<style>
img{
    width: 100px;
    height: 100px;
}
</style>