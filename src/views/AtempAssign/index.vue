<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-form-item label="模板内容：">
            <el-input v-model="dataForm.title" placeholder="模板内容" />
          </el-form-item>
          <el-form-item label="部门：">
            <el-input v-model="dataForm.dept_name" placeholder="请输入部门" />
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh-right" @click="reset()">重置</el-button>
<!--          <el-button type="primary" @click="getDataList()">新建</el-button>-->
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;"
    >
      <el-table-column prop="title" header-align="center" width="400px" align="center" label="模板内容" />
      <el-table-column prop="created_time" header-align="center" align="center" label="创建时间" />
      <el-table-column prop="etime" header-align="center" align="center" label="截至日期" />
      <el-table-column prop="dept_name" header-align="center" align="center" label="部门" />
      <el-table-column prop="distunm" header-align="center" align="center" label="已分配的医院(家)" >
        <template slot-scope="scope">
          {{scope.row.distunm}}
          <el-tooltip class="item" effect="dark" :content="scope.row.contentName" placement="top-start">
            <i class="el-icon-info"></i>
        </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small"  @click="addOrUpdateHandle(scope.row)">分配</el-button>
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
    <el-dialog title="分配医院" :visible.sync="dialogFormVisible" width="800px">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="截至日期：" prop="etime">
          <el-date-picker
            v-model="form.etime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-transfer v-model="form.value" :titles="leftRight" :data="data"></el-transfer>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {questDistList,questHsp,doPublish}from '@/api/AdataCenter'
  import moment from 'moment';
  export default {
    name: 'AtempAssign',
    data() {
      return {
        form:{
          value:[]
        },
        leftRight:["一键全选","一键全选"],
        data: [],
        dialogFormVisible:false,
        dataForm: {
          title: '',
          dept_name:''
        },
        rules:{
          etime:[
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ]},
        dataList: [
        ],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        publish_id:''
      }
    },
    mounted() {
      this.getDataList()
    },
    methods: {
      confirm(){
        if(this.form.value.length==0){
          this.$message({
            message: '请选择医院进行分配',
            type: 'error'
          })
          return false
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$confirm('是否进行分配操作？', '确认信息', {
              distinguishCancelAndClose: true,
              confirmButtonText: '是',
              cancelButtonText: '否'
            }).then(() => {
              this.confirmHttp()
            }).catch(action => {
              this.dialogFormVisible=false
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      confirmHttp(){
        doPublish({
          requestData: {
            "etime": moment(this.form.etime).format("YYYY-MM-DD HH:MM:SS"),
            "orgList": this.form.value,
            "publish_id": this.publish_id
          },
        }).then(res => {
          this.$message({
            message: res.returnMsg,
            type: 'success'
          })
          this.dialogFormVisible=false
          this.getDataList()
        })
      },
      addOrUpdateHandle(data){
        this.form={
          etime:data.etime?new Date(data.etime):'',
          value: []
        }
        this.publish_id = data.id
        this.dialogFormVisible=true
        this.questHspFn(data.contentId)
      },
      questHspFn(data){
        let that = this
        that.data=[]
        questHsp({
          requestData: {
          },
        }).then(res => {
          res.data.pageData.forEach((item, index) => {
            const the_data={}
              the_data.label=item.org_name
              the_data.key=item.id
              that.data.push(the_data)
            if(data.indexOf(item.id)!=-1){
              the_data.label=item.org_name
              the_data.key=item.id
              that.form.value.push(item.id)
            }
          });
        })
      },
      reset(){
        this.dataForm= {
          title: '',
          dept_name:''
        }
        this.pageIndex=1
        this.pageSize=10
        this.totalPage=0
        this.getDataList()
      },
      getDataList() {
        questDistList({
          requestData: {
            curPage: this.pageIndex,
            dept_name: this.dataForm.dept_name,
            title: this.dataForm.title,
            pageSize: this.pageSize,
          },
        }).then(res => {
          res.data.pageData.forEach(item=>{
            if(item.orgList!=null&&item.orgList.length>0){
              let contentName=[]
              let contentId=[]
              item.orgList.forEach(item_1=>{
                if(item_1.status==2){
                  contentName.push(item_1.org_name)
                  contentId.push(item_1.org_id)
                }
              })
              item.contentName=contentName.toString()
              item.contentId=contentId
            }
          })
          this.dataList=res.data.pageData
          this.totalPage=res.data.totalSize
        })
      },

      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
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
