<template>
  <div>
    <el-dialog title="会员修改" :visible.sync="info.show">
      <el-form :model="form">
        <!-- 手机号 -->
        <el-form-item label="手机号" label-width="80px">
          <el-input v-model.number="form.phone" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item label="昵称" label-width="80px">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" label-width="80px">
          <el-input v-model="form.password" clearable show-password autocomplete="off"></el-input>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <!-- 添加 -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>

        <el-button type="primary" @click="update">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  requestMemberDetail,
  requestMemberUpdate,
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
export default {
  props: ["info"],
  data() {
    return {
      form: {
        uid: "",
        nickname: "",
        password: "",
        status: "",
        phone: "",
      },
    };
  },
  methods: {
    ...mapActions({
      requestList: "member/requestList",
    }),
    //   清除
    cancel() {
      this.info.show = false;
    },
    //   置空
    empty() {
      this.form = {
        uid: "",
        nickname: "",
        password: "",
        status: "",
        phone: "",
      };
    },
    update() {
      if (this.form.password != "") {
        requestMemberUpdate(this.form).then((res) => {
          if (res.data.code == 200) {
            successAlert("修改成功");
            this.cancel();
            this.empty();
            this.requestList();
          }else{
              warningAlert(res.data.msg)
          }
        });
      }else{
          warningAlert("密码不能为空")
      }
    },
    //   获取一条数据
    getDetail(id) {
      // ajax
      requestMemberDetail({ uid: id }).then((res) => {
        this.form = res.data.list;
        this.form.password = "";
      });
    },
  },
};
</script>

<style>
</style>