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
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;"
    >
      <el-table-column prop="title" header-align="center" align="center" label="模板内容" />
      <el-table-column prop="dept_name" header-align="center" align="center" label="部门" />
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small"  @click="addOrUpdateHandle(scope.row)">查看</el-button>
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
  import {tempQuery} from '@/api/AdataCenter'

  export default {
    name: 'AtempManage',
    data() {
      return {
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
      }
    },
    mounted() {
      this.getDataList()
    },
    methods: {
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
        tempQuery({
          requestData: {
            curPage: this.pageIndex,
            dept_name: this.dataForm.dept_name,
            title: this.dataForm.title,
            pageSize: this.pageSize,
          },
        }).then(res => {
          this.dataList=res.data.pageData
          this.totalPage=res.data.totalSize
        })
      },
      addOrUpdateHandle(data) {
        let url = this.$router.resolve(
          {
            path:'/AdataDetail',
            query: {
              "temp_id": data.id}
          }
        )
        window.open(url.href,'_blank')
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
