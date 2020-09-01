<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <!-- 商品名称 -->
        <el-form-item label="活动名称" label-width="80px" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <!-- 日期 -->
        <el-form-item label="活动期限" label-width="80px">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <!-- 一级分类 -->
        <el-form-item label="一级分类" label-width="80px">
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
        <el-form-item label="二级分类" label-width="80px">
          <el-select v-model="form.second_cateid" @change="changeTwo()">
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

        <!-- 商品 -->
        <el-form-item label="商品" label-width="80px">
          <el-select v-model="form.goodsid">
            <el-option label="请选择" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in spArr"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
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
import { mapGetters, mapActions } from "vuex";
import {
  requestGoodsList,
  requestSeckillAdd,
  requestSeckillDetail,
  requestSeckillUpdate,
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      //   一级分类
      cateList: "cate/list",
      // 重新获取列表数据
      list: "seckill/list",
    }),
  },
  data() {
    return {
      time: {
        
      },
      //   二级分类的数组
      secondCateArr: [],
      // 商品数组
      spArr: [],
      form: {
        title: "",
        begintime: "",
        // 一级分类
        first_cateid: "",
        // 二级分类
        second_cateid: "",
        goodsid: "",
        endtime: "",
        status: 1,
      },
      rules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    ...mapActions({
      //   获取一级分类信息
      requestCateList: "cate/requestList",
      // 列表
      requestList: "seckill/requestList",
    }),
    //修改了一级分类
    changeFirstCateId(bool) {
      let index = this.cateList.findIndex(
        (item) => item.id == this.form.first_cateid
      );
      this.secondCateArr = this.cateList[index].children;
    },
    // 触发二级分类
    changeTwo() {
      requestGoodsList({
        fid: this.form.first_cateid,
        sid: this.form.second_cateid,
      }).then((res) => {
        this.spArr = res.data.list;
      });
    },
    // 关掉弹窗
    cancel() {
      this.info.show = false;
    },
    // 清空重置
    empty() {
      this.form = {
        title: "",
        begintime: "",
        // 一级分类
        first_cateid: "",
        // 二级分类
        second_cateid: "",
        goodsid: "",
        endtime: "",
        status: 1,
        time: "",
      };
    },
    // 添加
    add(form) {
      // if (this.time.length == undefined) {
      //   warningAlert("请选择时间");
      // }

     

      // 正则验证
      this.$refs[form].validate((valid) => {
        if (valid) {
           this.form.begintime = this.time[0].getTime();
      this.form.endtime = this.time[1].getTime();
          requestSeckillAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              this.cancel();
              this.empty();
              this.requestList();
            } else {
              warningAlert(res.data.msg);
            }
          });
        } else {
          warningAlert("亲,请按要求填写哦");
          console.log("error submit!!");
          return false;
        }
      });
    },
    //获取一条数据
    getDetail(id) {
      requestSeckillDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        // 根据一级分类计算出二级分类的数组
        this.requestCateList();
        this.changeFirstCateId();
        this.changeTwo();
        // 获取年月日
        this.time = [
          new Date(Number(res.data.list.begintime)),
          new Date(Number(res.data.list.endtime)),
        ];
        // console.log(this.form)
        this.form.id = id;
      });
    },
    // 点击编辑
    update() {
      this.form.begintime = this.time[0].getTime() + "";
      this.form.endtime = this.time[1].getTime() + "";
      requestSeckillUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.requestList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },

  mounted() {
    if (this.cateList.length == 0) {
      this.requestCateList();
      this.form.second_cateid = "";
    }
  },
};
</script>

<style>
</style>