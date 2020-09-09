<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
<!--        <search id="header-search" class="right-menu-item" />-->

<!--        <error-log class="errLog-container right-menu-item hover-effect" />-->

<!--        <screenfull id="screenfull" class="right-menu-item hover-effect" />-->

<!--        <el-tooltip content="
" effect="dark" placement="bottom">-->
<!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <div style="font-size: 14px;font-weight: bold">{{userInfo.login_name}}</div>
          <i class="el-icon-caret-bottom" />
        </div>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided @click.native="getInfo(1)">
            <span style="display:block;">账户信息</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="getInfo(2)">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="getInfo(3)">
            <span style="display:block;">反馈问题</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :title="type_name" :visible.sync="showDialog" width="500px">
      <el-form ref="form" :model="formNew" :rules="rules" label-width="100px">
        <el-form-item label="联系人：" v-if="type==1">
          <el-input v-model="formNew.contact_name" disabled style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="用户名：" v-if="type==1">
          <el-input v-model="formNew.org_name" disabled style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" v-if="type==1">
          <el-input v-model="formNew.phone_num" disabled style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="原密码：" v-if="type==2" prop="old_pwd">
          <el-input v-model="formNew.old_pwd" type="password" auto-complete="new-password" placeholder="请输入原密码" style="width: 300px" ></el-input>
        </el-form-item>
        <el-form-item label="新密码：" v-if="type==2" prop="new_pwd">
          <el-input v-model="formNew.new_pwd" type="password" auto-complete="new-password" placeholder="请输入新密码" style="width: 300px" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" v-if="type==2" prop="confirm_pwd">
          <el-input v-model="formNew.confirm_pwd"  type="password" auto-complete="new-password" placeholder="请输入新密码"  style="width: 300px" ></el-input>
        </el-form-item>
        <el-form-item label="反馈问题：" v-if="type==3" prop="feedback">
          <el-input v-model="formNew.feedback" type="textarea" style="width: 300px" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmInfo()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {updPwd,feedback} from '@/api/AdataCenter'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'

export default {
  data(){
    return{
      showDialog:false,
      formNew:{},
      rules: {
        feedback: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ],
        old_pwd: [
          {required: true, message: '请输入原密码', trigger: 'blur'},
        ],
        new_pwd: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
        ],
        confirm_pwd: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
        ],

      },
      userInfo:{},
      type:1,
      type_name:''
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'roles'
    ]),

  },
  mounted(){
    this.userInfo=JSON.parse(localStorage.getItem('role'))
  },
  methods: {
    confirmInfo(){
      if(this.type==1){
        this.showDialog=false
      }else if(this.type==2){
        this.$refs.form.validate(valid => {
          if (valid) {
            updPwd({
              requestData: {
                "confirm_pwd": this.formNew.confirm_pwd,
                "id": JSON.parse(localStorage.getItem('role')).id,
                "new_pwd": this.formNew.new_pwd,
                "old_pwd": this.formNew.old_pwd
              },
            }).then(res => {
              this.$message({
                message: res.returnMsg,
                type: 'success'
              })
              this.showDialog=false
              this.logout()
            })
          }else {
            console.log('error submit!!')
            return false
          }
        })

      }else if(this.type==3){
        this.$refs.form.validate(valid => {
          if (valid) {
            feedback({
              requestData: this.formNew.feedback,
            }).then(res => {
              this.$message({
                message: res.returnMsg,
                type: 'success'
              })
              this.showDialog=false
            })
          }else {
            console.log('error submit!!')
            return false
          }
        })

      }
    },
    getInfo(type){
      if(type==1){
        this.type_name='账户信息'
      }else if(type==2){
        this.type_name='修改密码'
      }else{
        this.type_name='反馈信息'
      }
      this.type= type
      this.showDialog=true
      this.$refs.form.clearValidate();

      this.getDetailInfo(type)
    },
    getDetailInfo(type){
      if(type==1){
        this.formNew={
          phone_num:JSON.parse(localStorage.getItem('role')).phone_num,
          org_name:JSON.parse(localStorage.getItem('role')).org_name,
          contact_name:JSON.parse(localStorage.getItem('role')).contact_name,
        }
      }else if(type==2){
        this.formNew={

        }
      }else{
        this.formNew={
        }
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
     let data= await this.$store.dispatch('user/logout')
      this.$message({
        message: data.returnMsg,
        type: 'success'
      })
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 70px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 66px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 70px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 30px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
