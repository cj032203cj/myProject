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
          <el-button type="primary" icon="el-icon-refresh-right" @click="getDataList()">重置</el-button>
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
      <el-table-column prop="dept_name " header-align="center" align="center" label="部门" />
      <el-table-column prop="status" header-align="center" align="center" label="填报状态" >
        <template slot-scope="scope">
          <div v-if="scope.row.status==1">未提交</div>
          <div v-if="scope.row.status==2">已提交</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="etime"
        header-align="center"
        align="center"
        width="180"
        label="截至日期"
      />
      <el-table-column prop="percentage " header-align="center" align="center" label="完成度" >
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.percentage"></el-progress>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small"  @click="addOrUpdateHandle(scope.row.advId)">去填报</el-button>
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
      this.getDataList()
    },
    methods: {
      getDataList() {
        myQuest({
          requestData: {
            org_id:this.$store.getters.roles[0].id,
            curPage: this.pageIndex,
            title: this.dataForm.title,
            pageSize: this.pageSize,
            org_name:'',
            dept_name: this.dataForm.dept_name,
          },
        }).then(res => {
          this.dataList=res.data.pageData
          this.totalPage=res.data.totalSize
        })
      },
      addOrUpdateHandle() {

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
