<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <!-- 上级分类 -->
        <el-form-item label="上级分类" prop="pid">
          <el-select v-model="form.pid">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option label="顶级分类" :value="0"></el-option>
            <!-- 动态数据 -->
            <el-option v-for="item in list" :key="item.id" :label="item.catename" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 分类名称 -->

        <el-form-item label="分类名称" label-width="80px" prop="catename">
          <el-input v-model="form.catename" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 图片上传 -->
        <el-form-item label="图片" label-width="80px" v-if="form.pid!==0">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeImg"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add('form')" v-if="info.isAdd">添加</el-button>
        <el-button type="primary" @click="update" v-else>修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  requestCateAdd,
  requestCateDetail,
  requestCateUpdate,
} from "../../../util/request";
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../util/alert";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      list: "cate/list",
    }),
  },
  data() {
    //   上传完成后图片的地址
    imageUrl: "";
    return {
      imageUrl: "",
      form: {
        pid: 0,
        catename: "",
        img: null,
        status: 1,
      },
      rules: {
        catename: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
        pid: [{ required: true, message: "请选择上级分类", trigger: "change" }],
      },
    };
  },
  methods: {
    ...mapActions({
      requestList: "cate/requestList",
    }),
    // 修改了图片
    changeImg(e) {
      // 上传的图片不能超过2M
      if (e.size > 2 * 1024 * 1024) {
        warningAlert("上传的图片不能超过2M");
        return;
      }
      // 上传文件的后缀名必须是.png.jpg.gif.jpeg
      var extname = e.name.slice(e.name.lastIndexOf("."));
      var extArr = [".png", ".jpg", ".gif", ".jpeg"];
      if (!extArr.some((item) => item === extname)) {
        warningAlert("上传文件必须是图片");
        return;
      }

      console.log(extname);
      // file是上传的文件
      var file = e.raw;
      // 生成了一个url地址，赋值给imageUrl，展示出来
      this.imageUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
    // 弹框消失
    cancel() {
      this.info.show = false;
    },
    // 内容重置
    empty() {
      this.form = {
        pid: 0,
        catename: "",
        img: null,
        status: 1,
      };
      this.imageUrl = "";
    },
    // 添加
    add(form) {
         // 正则验证
      this.$refs[form].validate((valid) => {
        if (valid) {
          requestCateAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          //   弹框消失
          this.cancel();
          //   重置表单数据
          this.empty();
          //   再次请求list数据
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
      requestCateDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
        this.imageUrl = this.$imgPre + res.data.list.img;
      });
    },
    // 修改
    update() {
      requestCateUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          //   弹框消失
          this.cancel();
          //   重置表单数据
          this.empty();
          //   再次请求list数据
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>