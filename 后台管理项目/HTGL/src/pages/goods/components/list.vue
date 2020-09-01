<template>
  <div>
    <el-table :data="list" stripe style="width: 100%">
      <el-table-column prop="id" label="商品编号" width="140"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称" width="140"></el-table-column>

      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="$imgPre+scope.row.img" alt />
        </template>
      </el-table-column>

      <el-table-column label="是否新品" width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isnew==1" type="primary">是</el-button>
          <el-button v-else type="info">否</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="是否热卖" width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.ishot==1" type="primary">是</el-button>
          <el-button v-else type="info">否</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==1" type="primary">启用</el-button>
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

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="cPage"
      :page-size="size"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { requestGoodsDelete, requestManageCount } from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
export default {
  computed: {
    ...mapGetters({
      list: "goods/list",
      total: "goods/total",
      size: "goods/size",
    }),
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      requestList: "goods/requestList",
      requestTotal: "goods/requestTotal",
      changePage: "goods/changePage",
    }),
    edit(id) {
      this.$emit("edit", id);
    },
    // 删除
    del(id) {
      requestGoodsDelete({ id: id }).then((res) => {
        if (res.data.code == 200) {
          successAlert("删除成功");
          this.requestList();
          // 重新获取总数
          this.requestTotal();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    // 修改页码
    cPage(a) {
      this.changePage(a);
      this.requestList();
    },
  },
  mounted() {
    this.requestList();
    this.requestTotal();
  },
};
</script>
 
<style>
  img{
    width: 80px;
    height: 80px;
  }
</style>