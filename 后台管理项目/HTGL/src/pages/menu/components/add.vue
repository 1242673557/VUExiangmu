<template>
  <!-- 商品管理弹框 -->
  <div>
    <!-- 菜单添加 -->
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="菜单名称" label-width="80px" prop="title">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 上级菜单 -->
        <el-form-item label="上级菜单" label-width="80px" prop="pid">
          <el-select v-model="form.pid">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option label="顶级菜单" :value="0"></el-option>
            <!-- 动态数据 -->
            <el-option v-for="item in list" :key="item.id" :label="item.title" :value="item.id"></el-option>

            <!-- title -->
          </el-select>
        </el-form-item>
        <!-- 菜单类型 -->
        <el-form-item label="菜单类型" label-width="80px">
          <el-radio v-model="form.type" :label="1">目录</el-radio>
          <el-radio v-model="form.type" :label="2">菜单</el-radio>
        </el-form-item>
        <!-- 菜单图标 -->
        <el-form-item label="菜单图标" label-width="80px" v-if="form.type==1">
          <el-select v-model="form.icon">
            <el-option label="--请选择--" disabled value></el-option>
            <el-option v-for="item in icon" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- 菜单地址 -->
        <el-form-item label="菜单地址" label-width="80px" v-else>
          <el-select v-model="form.url">
            <el-option label="--请选择--" disabled value></el-option>
            <el-option v-for="item in urls" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- 状态 -->
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add('form')" v-if="info.isAdd">添加</el-button>
        <el-button type="primary" @click="update()" v-else>修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  requestMenuAdd,
  requestMenuDetil,
  requestMenuUpdate,
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  components: {},
  computed: {
    ...mapGetters({
      list: "menu/list",
    }),
  },
  data() {
    return {
      // 图标集合
      icon: [
        "el-icon-goods",
        "el-icon-s-open",
        "el-icon-s-opportunity",
        "el-icon-film",
        "el-icon-present",
      ],
      // 路由集合
      urls: [
        "/banner",
        "/cate",
        "/goods",
        "/home",
        "/manage",
        "/member",
        "/menu",
        "/role",
        "/spec",
        "/seckill",
      ],
      form: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      },
      rules: {
        title: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
        pid: [{ required: true, message: "请选择上级菜单", trigger: "change" }],
      },
    };
  },
  methods: {
    // mapActions
    //
    ...mapActions({
      requestList: "menu/requestList",
    }),
    cancel() {
      this.info.show = false;
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    // 重置内容
    empty() {
      this.form = {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      };
    },
    add(form) {
      // 正则验证
      this.$refs[form].validate((valid) => {
        if (valid) {
          requestMenuAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              // 重置form数据
              this.cancel();
              // 弹框消失
              this.empty();
              // 再次请求list数据
              this.requestList();
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
    // 获取某一条数据
    getDetail(id) {
      requestMenuDetil({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
      });
    },
    // 修改update
    update() {
      requestMenuUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.requestList();
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