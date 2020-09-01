<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <!-- 所属角色 -->
        <el-form-item label="所属角色" prop="roleid">
          <el-select v-model="form.roleid">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" label-width="80px">
          <el-input v-model="form.password" autocomplete="off" type="password" show-password></el-input>
        </el-form-item>
        <!-- 菜单地址 -->
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
import { requestManageAdd,requestManageDetail,requestManageUpdate } from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
export default {
  props: ["info"],
  data() {
    return {
      form: {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      },
        rules: {
          username: [
            { required: true, message: '请按正确格式输入用户名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
           roleid: [
            { required: true, message: '请选择所属角色', trigger: 'change' }
          ],
        }
    };
  },
  mounted() {
    if (this.roleList.length == 0) {
      this.requestRoleList();
    }
  },

  computed: {
    ...mapGetters({
      roleList: "role/list",
     
    }),
  },
  methods: {
    ...mapActions({
      requestRoleList: "role/requestList",
      requestManageList:"manage/requestList",
      requestTotal:"manage/requestTotal"
    }),
    // 弹框消失
    cancel() {
      this.info.show = false;
    },
    // 置空
    empyt() {
      this.form = {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      };
    },
    // 点击添加
    add(form) {

           // 正则验证
      this.$refs[form].validate((valid) => {
        if (valid) {
              requestManageAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          // 弹框消失
          this.cancel();
            //清空
          this.empyt();
            //重新获取角色列表数据
          this.requestManageList();
          // 重新获取总的数量
        this.requestTotal()
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
    getDetail(id){
        requestManageDetail({uid:id}).then((res)=>{
            this.form=res.data.list;
            this.form.password=""
        })
    },
    // 点击修改
    update(){
        requestManageUpdate(this.form).then((res)=>{
            if(res.data.code=200){
                successAlert("修改成功")
                    this.cancel();
                    this.empyt();
                    
                    this.requestManageList()
            }else{
                warningAlert(res.data.msg)
            }
        })
    }
  },
};
</script>

<style>
</style>