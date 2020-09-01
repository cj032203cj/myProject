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
          <el-button type="primary" plain>新增</el-button>
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
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.advId)">分享</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.advId)">编辑</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.advId)">删除</el-button>
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
  </div>
</template>

<script>
import {orgQuery} from '@/api/AdataCenter'
export default {
  name: 'AaccountManage',
  data() {
    return {
      dataForm: {
        org_name: ''
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
      let that = this
      orgQuery({
        requestData: {
          curPage: this.pageIndex,
          org_name: this.dataForm.org_name,
          pageSize: this.pageSize,
        },
      }).then(res => {
        that.dataList=res.data.pageData
        that.totalPage=res.data.totalSize
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
