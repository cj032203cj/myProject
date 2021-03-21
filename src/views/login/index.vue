<template>
  <div class="login-container">
    123
    <div class="login-left"></div>
    <div class="company-center">
      <div>医疗服务质控中心系统</div>
      <div class="en-name">Medical service quality control center system</div>
    </div>
    <div class="company-name">
      瑞思云（武汉）科技有限公司
    </div>
    <el-form ref="loginForm" v-if="isLogin"  :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
          <div class="title">登录系统</div>
          <div class="title-line"></div>
      </div>
      <el-form-item prop="username" class="change-style">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          class="input-style"
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password"  class="change-style">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-link class="forget-pas" @click="isLogin=false">忘记密码</el-link>
      <el-button :loading="loading" type="primary" class="login-btn" @click.native.prevent="handleLogin">登 录</el-button>
      <div class="sm-rsy"></div>
    </el-form>
    <el-form ref="fogForm" v-else :model="form" :rules="rules" class="login-form forget" autocomplete="on" label-position="left">
      <div class="title-container disFlex">
        <div>
          <div class="title">忘记密码</div>
          <div class="title-line bg-fff"></div>
        </div>
        <el-link class="back_up" @click="isLogin=true">返回上一步</el-link>
      </div>
      <el-form-item label="手机号：" prop="phone">
        <el-input v-model="form.phone" class="the_input" placeholder="请输入11位手机号"></el-input>
      </el-form-item>
      <!--<div class="label_name disFlex">-->
        <!--<div style="line-height: 36px">验证码：</div>-->
        <!--<el-button type="primary" class="getRlues" plain style="margin-left: 10px" @click="getPic">图文校验</el-button>-->
      <!--</div>-->
      <el-form-item label="短信验证码：">
        <el-input v-model="form.pwd" class="the_input" placeholdaer="请输入短信码"></el-input>
        <span class="show-dx" @click="getPic">
            {{value_get}}
          </span>
      </el-form-item>
      <el-button :loading="loading" type="primary" :disabled="!can_click&&!form.pwd" class="login-btn next-btn" @click="toChange">下一步</el-button>
      <div class="sm-rsy"></div>
    </el-form>
    <el-dialog title="忘记密码" :visible.sync="showDialog" width="500px">
      <el-form ref="form" :model="formNew" :rules="rules" label-width="100px">
        <el-form-item label="新密码" prop="psd">
          <el-input v-model="formNew.psd" type="password" auto-complete="new-password" placeholder="请输入新密码" style="width: 300px;color: #000" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="new_psd" >
          <el-input v-model="formNew.new_psd" type="password" auto-complete="new-password" placeholder="请输入新密码"  style="width: 300px;color: #000" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消修改</el-button>
        <el-button type="primary" @click="confirmPwd">确认修改</el-button>
      </div>
    </el-dialog>
    <slide-verify
      v-if="show_yzm"
      class="slide-box"
      ref="slideblock"
      :imgs="imgArray"
      @again="onAgain"
      @fulfilled="onFulfilled"
      @success="onSuccess"
      @fail="onFail"
      @refresh="onRefresh"
      :accuracy="accuracy"
      :slider-text="text"
    ></slide-verify>
  </div>
</template>

<script>
import {updPwd,verificationCode,forgetPwdStep1,forgetPwdStep2} from '@/api/AdataCenter'
import img0 from '../../assets/imgs/img.jpg'
import img1 from '../../assets/imgs/img1.jpg'
import img2 from '../../assets/imgs/img2.jpg'
import img3 from '../../assets/imgs/img3.jpg'
import img4 from '../../assets/imgs/img4.jpg'
import img5 from '../../assets/imgs/img5.jpg'
export default {
  name: 'Login',
  data() {
    var validatePhone = (rule, value, callback) => {
      let reg=/^1[3|4|5|7|8][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      rules:{
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      formNew:{
        psd:'',
        new_psd:'',
      },
      value_get:'获取',
      form:{
        phone:'',
        pwd:''
      },
      isLogin:true,
      imgArray:[img0,img1,img2,img4,img3,img5],
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用戶名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      showDialog:false,
      otherQuery: {},
      timer:null,
      msg: '',
      text: '向右滑',
      // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
      accuracy: 1,
      show_yzm:false,
      can_click:false,
      his_id:''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    confirmPwd(){
      forgetPwdStep2({
        requestData: {
          new_pwd:this.formNew.psd,
          id:this.his_id,
          confirm_pwd:this.formNew.new_psd,
        }
      }).then(res => {
        this.$message({ message: res.returnMsg, type: 'success' })
        this.can_click=false
        this.showDialog=false
        this.isLogin=true
      })
    },
    toChange(){
      forgetPwdStep1({
        requestData: {
          "phone_num": this.form.phone,
          "verifCode": this.form.pwd
        }
      }).then(res => {
        this.his_id=res.data.id
        this.formNew={
          new_psd:'',
          psd:''
        }
        this.showDialog=true
      })
    },
    onSuccess(){
      let that = this
      verificationCode({
        requestData: this.form.phone
      }).then(res => {
      })

      this.$message({ message: '验证通过，正在发送短信验证码', type: 'success' })
      this.can_click=true
      this.show_yzm=false
      this.timer = setInterval(function () {
        if(that.value_get=='获取'){
          that.value_get=60
        }else if(that.value_get!=0){
          that.value_get--
        }else if(that.value_get==0){
          that.value_get='获取'
          clearInterval(that.timer)
        }
      }, 1000);
    },
    onFail(){
      this.$message({ message: '验证失败', type: 'error' })
    },
    onRefresh(){
      this.msg = ''
    },
    onFulfilled() {
    },
    onAgain() {
      this.msg = 'try again';
      // 刷新
      this.$refs.slideblock.reset();
    },
    handleClick() {
      // 父组件直接可以调用刷新方法
      this.$refs.slideblock.reset();
    },

    getPic(){
      this.$refs.fogForm.validate(valid => {
        if (valid) {
          this.show_yzm=true
          this.can_click=false
        }else {
          console.log('error submit!!')
          return false
        }
      })

    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(res => {
              this.$message({
                message: res.returnMsg,
                type: 'success'
              })
              if(res.data.orginfo.role_code=='admin'){
                this.$router.push({ path: '/'})
              }else if(res.data.orginfo.role_code=='user'){
                this.$router.push({ path: '/AmyFill'})
              }
              this.loading = false
            })
            .catch((res) => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }

  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
  }
}

/* reset element-ui css */
.login-container {
  .login-form.forget .el-input input{
    width: 372px;
    height: 56px;
    line-height: 56px;
    color: #000;
  }
  .change-style{
    .el-input {
      display: inline-block;
      height: 56px;
      width: 312px;

      input {
        background: #fff;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        height: 56px;
        color: #000;
        border: none;
      }
    }
  }


  .el-form-item.change-style {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border: 2px solid #E3E8F1;
    background: #F4F6F8;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: relative;
  height: 100%;
  width: 100%;
  background: url("../../assets/imgs/bg.png") left top no-repeat;
  background-size: cover;
  overflow: hidden;
  .slide-box{
    position: absolute;
    left: calc(50% - 155px);
    top: calc(50% - 107px);
  }
  .login-left{
    position: absolute;
    left: 48px;
    top: 24px;
    width: 120px;
    height: 40px;
    background: url("../../assets/imgs/rsyBig.png") left top no-repeat;
    background-size: cover;
  }
  .company-center{
    position: absolute;
    left: 84px;
    top: 416px;

    color: #D8E5FE;
    font-size: 36px;
    .en-name{
      margin-top: 24px;
      font-size: 18px;
    }
  }

  .company-name{
    text-align: center;
    position: absolute;
    bottom: 26px;
    left: 0;
    font-size: 12px;
    width: 100%;
    color: #788295;
    }
  .login-form {
    position: relative;
    width: 480px;
    height: 100%;
    background: #fff;
    max-width: 100%;
    padding: 5% 54px 0;
    padding-top: calc(50vh - 260px);
    float: right;
    overflow: hidden;
    .next-btn{
      margin-top: 40px;
    }
  }


  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    height: 56px;
    line-height: 56px;
    text-align: center;
    color: $dark_gray;
    vertical-align: middle;
    width: 56px;
    border-right: 2px solid #E3E8F1;
    display: inline-block;
  }
  .label_name{
    margin-bottom: 14px;
  }

  .getRlues{
    background: #fff;
  }
  .el-button--primary.getRlues.is-plain:hover, .el-button--primary.getRlues.is-plain:focus{
    color: #1890ff;
  }
  .forget-pas{
    float: right;
      font-size: 14px;
    margin-top: 30px;
    margin-bottom: 64px;
    color: #3B86FD;
    cursor: pointer;
  }
  .sm-rsy{
    width: 72px;
    height: 24px;
    margin: 50px auto 0;
    background: url("../../assets/imgs/rsy.png") left top no-repeat;
    background-size: cover;}
  .login-btn{
    height: 60px;
    width: 100%;
    font-size: 20px;
  }
  .title-container {
    position: relative;
    &.disFlex{
      justify-content: space-between;
      .back_up{
        color: #1890ff;
        height: 26px;
        line-height: 26px;
      }
    }
    .title {
      font-size: 26px;
      color: #000;
      margin: 0px  auto;
      text-align: left;
      font-weight: bold;
    }
    .title-line{
      width: 80px;
      height: 4px;
      background: #3B86FD;
      margin-top: 16px;
      margin-bottom: 72px;
      &.bg-fff{
        background: #fff;
        margin-bottom: 36px;
      }
    }
    .input-style{
      border: 2px solid #E3E8F1;
      background: #fff;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .show-dx {
    position: absolute;
    right: 10px;
    top: 48px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
