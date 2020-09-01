<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <!-- 角色名称 -->
        <el-form-item label="角色名称" label-width="80px" prop="rolename">
          <el-input v-model="form.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 角色权限 -->
        <!-- :default-checked-keys="[]" -->
        <el-form-item label="角色权限" label-width="80px">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            :default-checked-keys="defaultKey"
            ref="tree"
          ></el-tree>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <!-- 添加 -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add('form')" v-if="info.isAdd">添加</el-button>
        <el-button type="primary" @click="update" v-else>修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  requestRoleAdd,
  requestRoleDetail,
  requestRoleUpdate,
} from "../../../util/request";
import { successAlert, warningAlert, errorAlert } from "../../../util/alert";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      menuList: "menu/list",
    }),
  },
  mounted() {
    //如果之前menu的list没有请求，就发请求，请求你过了，就不发了
    if (this.menuList.length === 0) {
      this.requestMenuList();
    }
  },

  data() {
    return {
      form: {
        rolename: "",
        menus: "",
        status: 1,
      },
      rules: {
        rolename: [
          { required: true, message: "请按规定输入角色名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
      },
      defaultKey: [],
      //   树形结构数据
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  methods: {
    ...mapActions({
      requestMenuList: "menu/requestList",
      requestRoleList: "role/requestList",
    }),
    // 清空
    empty() {
      this.form = {
        rolename: "",
        menus: "",
        status: 1,
      };
      // 将树形结构的数据，选中的key置空
      this.$refs.tree.setCheckedKeys([]);
    },
    //取消
    cancel() {
      this.info.show = false;
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //   添加
    add(form) {
      // 获取tree的key赋值给form.menus
      // 正则验证
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      this.$refs[form].validate((valid) => {
        if (valid) {
          // 发起添加角色的请求
          requestRoleAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.list);
              // 清空
              this.empty();
              // 弹框消失
              this.cancel();
              // 重新获取角色列表数据
              this.requestRoleList();
            } else {
              warningAlert(res.data.msg);
            }
          });
        } else {
          warningAlert("亲,请按要求填写哦")
          console.log("error submit!!");
          return false;
        }
      });
    },
    getDetail(id) {
      requestRoleDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
        this.defaultKey = JSON.parse(res.data.list.menus);
      });
    },
    update() {
      // 获取tree的key赋值给form.menus
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      requestRoleUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.requestRoleList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
};
</script>

<style>
</style>