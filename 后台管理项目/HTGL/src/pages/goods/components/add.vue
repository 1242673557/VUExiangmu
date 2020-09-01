specList
<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.show" @opened="createEditor">
      <el-form :model="form" :rules="rules" ref="form">
        <!-- 一级分类 -->
        <el-form-item label="一级分类" label-width="80px" prop="first_cateid">
          <el-select v-model="form.first_cateid" @change="changeFirstCateId()">
            <el-option label="请选择" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 二级分类 -->
        <el-form-item label="二级分类" label-width="80px" prop="second_cateid">
          <el-select v-model="form.second_cateid">
            <el-option label="请选择" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in secondCateArr"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 商品名称 -->
        <el-form-item label="商品名称" label-width="80px" prop="goodsname">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>

        <!-- 价格 -->
        <el-form-item label="价格" label-width="80px">
          <el-input v-model="form.price"></el-input>
        </el-form-item>

        <!-- 市场价格 -->
        <el-form-item label="市场价格" label-width="80px">
          <el-input v-model="form.market_price"></el-input>
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
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <!-- 商品规格 -->
        <el-form-item label="商品规格" label-width="80px">
          <el-select v-model="form.specsid" @change="changeSpecsId()">
            <el-option label="请选择" value></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in specList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 规格属性 -->
        <el-form-item label="规格属性" label-width="80px">
          <el-select v-model="form.specsattr" multiple>
            <el-option label="请选择" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option v-for="item in attrsArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <!-- 是否新品 -->
        <el-form-item label="是否新品" label-width="80px">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>

        <!-- 是否热卖 -->
        <el-form-item label="是否热卖" label-width="80px">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>

        <!-- 商品描述  -->
        <el-form-item label="是否热卖" label-width="80px">
          <div id="desc"></div>
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
import { mapGetters, mapActions } from "vuex";
import {
  requestGoodsAdd,
  requestGoodsDetail,
  requestGoodsUpdate,
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import E from "wangeditor";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      // 分类的一级列表
      cateList: "cate/list",
      // 规格列表
      specList: "spec/list",
    }),
  },
  data() {
    return {
      // 编辑器对象
      editor: null,
      // 二级分类的数组
      secondCateArr: [],
      // 商品规格属性值
      attrsArr: [],
      // 图片地址
      imageUrl: "",
      // 提交给后端的数据
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: 0,
        market_price: 0,
        img: null,
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1,
        description: "",
      },
      rules: {
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
        first_cateid: [
          { required: true, message: "请选择一级分类", trigger: "change" },
        ],
        second_cateid: [
          { required: true, message: "请选择二级分类", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    if (this.cateList.length == 0) {
      this.requestCateList();
    }
    // 获取所有规格的数据
    this.requestSpecList(true);
  },

  methods: {
    ...mapActions({
      // 获取分类列表
      requestCateList: "cate/requestList",
      // 获取规格列表
      requestSpecList: "spec/requestList",
      // 获取商品总数
      requestGoodsCount: "goods/requestTotal",
      // 获取商品列表
      requestGoodsList: "goods/requestList",
    }),

    // 删除规格属性
    delAttr(index) {
      this.attrArr.splice(index, 1);
    },
    // 弹框消失
    cancel() {
      this.info.show = false;
    },
    // 置空
    empyt() {
      (this.form = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: 0,
        market_price: 0,
        img: null,
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1,
        description: "",
      }),
        (this.attrArr = [
          {
            value: "",
          },
        ]);
    },
    // 点击添加
    add(form) {
      this.form.description = this.editor.txt.html();
      this.form.specsattr = JSON.stringify(this.form.specsattr);

      // 正则验证
      this.$refs[form].validate((valid) => {
        if (valid) {
          //发起添加请求
          requestGoodsAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              //清空
              this.empyt();
              //弹框消失
              this.cancel();
              // //重新获取角色列表数据
              this.requestGoodsCount();
              // //重新获取总的数量
              this.requestGoodsList();
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
    // 获取修改数据
    getDetail(id) {
      //ajax
      requestGoodsDetail({ id: id }).then((res) => {
        // console.log(res.data)
        this.form = res.data.list;
        this.form.id = id;
        this.imageUrl = this.$imgPre + this.form.img;
        //根据一级分类计算出二级分类的数组
        this.changeFirstCateId(true);
        //根据商品规格计算出商品属性
        this.changeSpecsId(true);
        this.form.specsattr = JSON.parse(this.form.specsattr);
      });
    },
    // 点击修改
    update() {
      this.form.description = this.editor.txt.html();
      this.form.specsattr = JSON.stringify(this.form.specsattr);
      requestGoodsUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          this.cancel();
          this.empyt();

          this.requestList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },

    // 修改了一级分类
    changeFirstCateId(bool) {
      let index = this.cateList.findIndex(
        (item) => item.id == this.form.first_cateid
      );
      this.secondCateArr = this.cateList[index].children;
      if (!bool) {
        this.form.second_cateid = "";
      }
    },
    // 图片发生了修改
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

      let file = e.raw;
      this.imageUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
    // 商品规格发生了改变
    changeSpecsId(bool) {
      let index = this.specList.findIndex(
        (item) => item.id == this.form.specsid
      );
      this.attrsArr = this.specList[index].attrs;
      if (!bool) {
        this.form.specsattr = [];
      }
    },
    //创建编辑器
    createEditor() {
      this.editor = new E("#desc");
      this.editor.create();
      this.editor.txt.html(this.form.description);
    },
  },
};
</script>
 requestGoodsCount
<style >
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