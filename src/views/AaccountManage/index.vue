<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-form-item label="医院名称：">
            <el-input v-model="dataForm.org_name" placeholder="请输入医院名称" />
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh-right" @click="reset()">重置</el-button>
          <el-button type="primary" plain @click="addOrUpdateHandle">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;"
    >
      <el-table-column prop="org_name" header-align="center" align="center" label="医院名称" />
      <el-table-column prop="contact_name" header-align="center" align="center" label="联系人姓名" />
      <el-table-column prop="phone_num" header-align="center" align="center" label="手机号" />
      <el-table-column prop="login_name" header-align="center" align="center" label="用户名" />
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="share(scope.row)">分享</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="del(scope.row.advId)">删除</el-button>
          <!--          <span class="el-dropdown-links"></span>-->
          <!--<el-button type="text" size="small" @click="deleteHandle(scope.row.advId,scope.row.advTitle)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      style="margin-top: 20px"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
    <el-dialog title="分配医院" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="form"  :model="form" :rules="rules" label-width="100px">
        <el-form-item label="医院名称" prop="org_name">
          <el-input v-model="form.org_name" placeholder="请输入医院名称" style="width: 300px" ></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contact_name" >
          <el-input v-model="form.contact_name" placeholder="请输入联系人的姓名"  style="width: 300px" ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone_num">
          <el-input v-model="form.phone_num" placeholder="请输入手机号" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="login_name">
          <el-input v-model="form.login_name" placeholder="请输入用户名" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="密码" >
          <div>密码默认为：qcc123456</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
     >
      <span>{{all_url}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="copyInfo" data-clipboard-action="copy" :data-clipboard-text="all_url" class="tag-copy">一键复制内容</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {orgQuery,addOrg,updateOrg} from '@/api/AdataCenter'
import Clipboard from 'clipboard'
export default {
  name: 'AaccountManage',
  data() {
    return {
      the_org:'',
      all_url:'欢迎贵医院（{{the_org}}）加入医疗质控中心，您可以凭借用户名：{{the_user}}，默认密码密码：qcc123456,登录中心平台：{{website}}',
      the_user:'',
      website:'www.xxxxxx.com',
      dialogVisible:false,
      rules: {
        org_name: [
          {required: true, message: '请输入医院名称', trigger: 'blur'},
        ],
        contact_name: [
          {required: true, message: '请输入联系人的姓名', trigger: 'blur'},
        ]
        ,
        phone_num: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
        ],
        login_name: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        // password: [
        //   {required: true, message: '请输入密码', trigger: 'blur'},
        // ]
      },
      dataForm: {
        org_name: ''
      },
      form:{},
      dataList: [

      ],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dialogFormVisible:false
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    reset(){
      this.dataForm= {
        org_name:''
      }
      this.pageIndex=1
      this.pageSize=10
      this.totalPage=0
      this.getDataList()
    },
    getDataList() {
      orgQuery({
        requestData: {
          curPage: this.pageIndex,
          org_name: this.dataForm.org_name,
          pageSize: this.pageSize,
        },
      }).then(res => {
        this.dataList=res.data.pageData
        this.totalPage=res.data.totalSize
      })
    },
    del(){
      this.$confirm('是否进行删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '是',
        cancelButtonText: '否'
      }).then(() => {
        alert('是')
      }).catch(action => {
        alert('否')
      });
    },
    addOrUpdateHandle(data) {
      if(data){
        this.form={
          login_name:data.login_name,
          org_name:data.login_name,
          phone_num:data.phone_num,
          contact_name:data.contact_name,
          role_id:data.role_id,
          id:data.id,
        }
      }else{
        this.form={}

      }
      this.dialogFormVisible=true
    },
    share(data){
      this.the_org=data.org_name
      this.the_user=data.login_name
      this.all_url='欢迎贵医院（'+data.org_name+'）加入医疗质控中心，您可以凭借用户名：'+data.login_name+'，默认密码密码：qcc123456,登录中心平台：'+this.website
      this.dialogVisible=true
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    copyInfo(){
      var clipboard = new Clipboard(".tag-copy");
      clipboard.on('success', e => {
        this.$message({ type: 'success', message: '复制成功' })
        // 释放内存
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
      })
      this.dialogVisible=false
    },
    confirm(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.confirmHttp()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    confirmHttp(){
      if(this.form.id!=undefined){
        updateOrg({
          requestData: this.form,
        }).then(res => {
          this.$message({
            message: res.returnMsg,
            type: 'success'
          })
          this.dialogFormVisible=false
          this.getDataList()
        })
      }else{
        addOrg({
          requestData: this.form,
        }).then(res => {
          this.$message({
            message: res.returnMsg,
            type: 'success'
          })
          this.dialogFormVisible=false
          this.getDataList()
        })
      }
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>
.documentation-container {
  margin: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;

  .document-btn {
    flex-shrink: 0;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    margin-bottom: 16px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
