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
          <el-button type="primary" plain @click="addOrUpdateHandle_new">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      size="small"
      stripe
      :header-cell-style="{
        background:'#F1F5F9',
        color:'#333',
        height:'44px',
      }"
      :row-style="{height:'44px'}"
      style="width: 100%;font-size: 14px"
    >
      <el-table-column prop="title" width="400px" label="模板内容" />
      <el-table-column prop="created_time"  label="创建时间" />
      <el-table-column prop="etime"  label="截至日期" />
      <el-table-column prop="dept_name"  label="部门" />
      <el-table-column prop="distunm" label="已分配的医院(家)" >
        <template slot-scope="scope">
          {{scope.row.distunm}}
          <el-tooltip class="item" effect="dark" :content="scope.row.contentName" placement="top-start">
            <i class="el-icon-info"></i>
        </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" :disabled="scope.row.isOver" :title="scope.row.isOver?'已过期':'分配'"  @click="addOrUpdateHandle(scope.row)">分配</el-button>
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
            :picker-options='pickerBeginDateBefore'
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
    <el-dialog title="新增" :visible.sync="dialogVisible" width="400px">
      <el-form ref="form_new" :model="form_new" :rules="rules_new"  label-width="100px">
        <el-form-item label="模板：" prop="template">
          <el-select v-model="form_new.template" placeholder="请选择模板">
            <el-option v-for="item in tempList" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间：" prop="eTime">
          <el-date-picker
            :picker-options='pickerBeginDateBefore'
            v-model="form_new.etime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门：" prop="dept_name">
          <el-input v-model="form_new.dept_name" style="width:200px" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm_new">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {questDistList,questHsp,doPublish,addTem,queryTemp}from '@/api/AdataCenter'
  import moment from 'moment';
  export default {
    name: 'AtempAssign',
    data() {
      return {
        pickerBeginDateBefore:{
          disabledDate(time){
            return time.getTime() < Date.now()-8.64e7   //如果当天可选，就不用减8.64e7
          }
        },
        form:{
          value:[],
          dept_name:'药水部'
        },
        leftRight:["未分配医院","分配医院"],
        data: [],
        dialogFormVisible:false,
        dialogVisible:false,
        dataForm: {
          title: '',
          dept_name:''
        },
        rules_new:{
          etime:[
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]},
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
        publish_id:'',
        tempList:[],
        form_new:{}
      }
    },
    mounted() {
      if(JSON.parse(localStorage.getItem('role')).role_code=='user'){
        this.$router.replace({
          path:'/AmyFill'
        })
      }else{
        this.getDataList()

      }
    },
    methods: {
      confirm_new(){
        this.$refs['form_new'].validate((valid) => {
          if (valid) {
              this.confirmHttp_new()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
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
      confirmHttp_new(){
        if (this.form_new.etime.getTime() < new Date().getTime()) {
          this.$message('截止时间必须大于当前时间')
          return false
        }
        debugger
        addTem({
          requestData: {
            "etime": moment(this.form_new.etime).format("YYYY-MM-DD HH:mm:ss"),
            "dept_name": this.form_new.dept_name,
            "temp_id": this.form_new.template
          },
        }).then(res => {
          this.$message({
            message: res.returnMsg,
            type: 'success'
          })
          this.dialogVisible=false
          this.getDataList()
        })
      },
      confirmHttp(){
        if (this.form.etime.getTime() < new Date().getTime()) {
          this.$message('截止时间必须大于当前时间')
          return false
        }
        doPublish({
          requestData: {
            "etime": moment(this.form.etime).format("YYYY-MM-DD HH:mm:ss"),
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
      addOrUpdateHandle_new(){
        this.dialogVisible=true
        this.getTempList()
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
      getTempList(){
        queryTemp({
          requestData: {
          }
        }).then(res => {
          this.tempList=res.data.pageData
          this.form_new.dept_name=res.data.pageData[0].dept_name
          this.form_new.template=res.data.pageData[0].id
        })
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
              if(new Date(item.etime).getTime()<new Date().getTime()){
                item.isOver=true
              }else{
                item.isOver=false
              }
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
