<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" style="display: flex;justify-content: space-between">
        <el-form-item>
          <el-form-item label="医院名称：">
            <el-input v-model="dataForm.org_name" placeholder="请输入医院名称" />
          </el-form-item>
          <el-form-item label="调查表：">
            <el-input v-model="dataForm.title" placeholder="请输入调查表" />
          </el-form-item>
          <el-form-item label="部门：">
            <el-input v-model="dataForm.dept_name" placeholder="请输入部门" />
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getDataList()" round  style="margin-right: 18px">搜索</el-button>
          <el-button  icon="el-icon-refresh-right" @click="resetData()" round>重置</el-button>
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
      <el-table-column prop="status"label="填报状态" >
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==2">已提交</el-tag>
          <el-tag type="warning" v-if="scope.row.status==1">未提交</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="org_name"  label="医院名称" />
      <el-table-column prop="title" width="350px" label="调查表名称" >
        <template slot-scope="scope">
          <el-link @click="toDetail(scope.row)">{{scope.row.title}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="dept_name" label="部门" />

      <el-table-column
        prop="submit_time"
        width="180"
        label="提交日期"
      />
      <el-table-column
        prop="etime"
        width="180"
        label="截至日期"
      />
      <!--      <el-table-column header-align="center" align="center" width="150" label="操作">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button type="text" size="small"  @click="addOrUpdateHandle(scope.row.advId)">修改</el-button>-->
      <!--          <span class="el-dropdown-links"></span>-->
      <!--          &lt;!&ndash;<el-button type="text" size="small" @click="deleteHandle(scope.row.advId,scope.row.advTitle)">删除</el-button>&ndash;&gt;-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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
  import DropdownMenu from '@/components/Share/DropdownMenu'
  import {getDataCenter} from '@/api/AdataCenter'

export default {
  name: 'AdataCenter',
  components: { DropdownMenu },
  data() {
    return {
      dataForm: {
        title: '',
        org_name:'',
        dept_name:''
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
    if(JSON.parse(localStorage.getItem('role')).role_code=='user'){
      this.$router.replace({
        path:'/AmyFill'
      })
    }else{
      this.getDataList()
    }
  },
  methods: {
    resetData(){
      this.dataForm= {
        title: '',
        org_name:'',
        dept_name:''
      }
      this.pageIndex=1
      this.pageSize=10
      this.totalPage=0
      this.getDataList()
    },
    getDataList() {
      getDataCenter({
        requestData: {
         curPage: this.pageIndex,
         dept_name: this.dataForm.dept_name,
         org_name: this.dataForm.org_name,
         title: this.dataForm.title,
         pageSize: this.pageSize,
        },
    }).then(res => {

        this.dataList=res.data.pageData
        this.totalPage=res.data.totalSize
      })
    },
    toDetail(data){
      let url = this.$router.resolve(
        {
          path:'/AdataDetail',
          query: {
            "org_id": data.org_id,
            "que_id":  data.que_id,
            "temp_id":  data.temp_id,
          }
        }
      )
      window.open(url.href,'_blank')
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
