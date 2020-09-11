<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-form-item label="模板内容：">
            <el-input v-model="dataForm.title" placeholder="请输入模板内容" />
          </el-form-item>
          <el-form-item label="部门：">
            <el-input v-model="dataForm.dept_name" placeholder="请输入部门" />
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh-right" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;"
    >
      <el-table-column prop="title" header-align="center" align="center" label="我的调查表" />
      <el-table-column prop="dept_name" header-align="center" align="center" label="部门" />
<!--      <el-table-column prop="status" header-align="center" align="center" label="填报状态" >-->
<!--        <template slot-scope="scope">-->
<!--          <el-tag type="success" v-if="scope.row.status==2">已填报</el-tag>-->
<!--          <el-tag type="warning" v-if="scope.row.status==1">未填报</el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        prop="etime"
        header-align="center"
        align="center"
        width="180"
        label="截至日期"
      />
      <el-table-column prop="percentage " header-align="center" align="center" label="完成度" >
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.percentage" v-if="scope.row.percentage==100"></el-progress>
          <el-progress :percentage="scope.row.percentage" v-else :color="customColor"></el-progress>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-link type="success" size="small" v-if="scope.row.percentage!=100&&!scope.row.isOver"  @click="addOrUpdateHandle(scope.row)">去填报</el-link>
          <el-link type="primary" size="small" v-if="scope.row.percentage==100||scope.row.isOver"  @click="addOrUpdateHandle(scope.row)">已填报</el-link>
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
  </div>
</template>

<script>
  import {myQuest}from '@/api/AdataCenter'

  export default {
    name: 'AmyFill',
    data() {
      return {
        customColor:'#67c23a',
        dataForm: {
          title:'',
          dept_name:'',
        },
        dataList: [

        ],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false
      }
    },
    mounted() {
      if(JSON.parse(localStorage.getItem('role')).role_code=='admin'){
        this.$router.replace({
          path:'/AdataCenter'
        })
      }else{
        this.getDataList()
      }
    },
    methods: {
      reset(){
        this.dataForm= {
          title:'',
          dept_name:'',
        }
        this.pageIndex=1
        this.pageSize=10
        this.totalPage=0
        this.getDataList()
      },
      getDataList() {
        myQuest({
          requestData: {
            org_id:JSON.parse(localStorage.getItem('role')).id,
            curPage: this.pageIndex,
            title: this.dataForm.title,
            pageSize: this.pageSize,
            org_name:'',
            dept_name: this.dataForm.dept_name,
          },
        }).then(res => {
          res.data.pageData.forEach(item=>{
            if(new Date(item.etime).getTime()<new Date().getTime()){
              item.isOver=true
            }else{
              item.isOver=false
            }
          })
          this.dataList=res.data.pageData
          this.totalPage=res.data.totalSize
        })
      },
      addOrUpdateHandle(data){
        if(data.isOver||data.percentage==100){
          this.$router.push(
            {
              path:'/AdataDetail',
              query: {
                "org_id": data.org_id,
                "que_id":  data.que_id,
                "temp_id":  data.temp_id,
                edit:2
              }
            }
          )
        }else{
          this.$router.push(
            {
              path:'/AdataDetail',
              query: {
                "org_id": data.org_id,
                "que_id":  data.que_id,
                "temp_id":  data.temp_id,
                edit:1
              }
            }
          )
        }

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
