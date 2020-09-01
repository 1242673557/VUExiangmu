<template>
  <div>
    <!-- @opened="createEditor" -->
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form" >
        <!-- 商品名称 -->
        <el-form-item label="标题" label-width="80px"  prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <!-- 图片 -->
        <el-form-item label="图片" label-width="80px">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeImg"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" v-if="info.isAdd" @click="add('form')">添加</el-button>
        <el-button type="primary" v-else @click="update">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { requestBannerAdd, requestBannerDetail,requestBannerUpdate } from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  computed:{
       ...mapGetters({
      bannerList: "banner/list",
    }),
  },
  data() {
    return {
      imageUrl: null,
      form: {
        title: "",
        img: null,
        status: 1,
      },
       rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        }
    };
  },
  methods: {
        ...mapActions({
      requestList: "banner/requestList",
    }),
    changeImg(e) {
      let file = e.raw;
      this.imageUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
    // 取消弹框
    cancel() {
      this.info.show = false;
    },
    // 清空
    empty() {
      this.form = {
        title: "",
        img: "",
        status: 1,
      };
      this.imageUrl = "";
    },
    // 添加
    add(form) {
      // 正则验证
      this.$refs[form].validate((valid) => {
          if (valid) {
           
          requestBannerAdd(this.form).then((res) => {
          if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.requestList();
        }
      });
       } else {
          warningAlert('亲,请输入标题哦!')
            console.log('error submit!!');
            return false;
          }
        });

    },
    // 获取一条数据
    getDetail(id) {
      requestBannerDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.imageUrl = this.$imgPre + res.data.list.img;
        this.form.id = id;
      });
    },
    // 修改
    update(){
        requestBannerUpdate(this.form).then((res)=>{
           if (res.data.code == 200) {
          successAlert("修改成功");
          this.empty();
          this.cancel();
          this.requestList();
        } else {
          warningAlert(res.data.msg);
        }
        })
    }
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