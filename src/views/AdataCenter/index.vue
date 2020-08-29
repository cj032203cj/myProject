<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.key" placeholder="广告名称/广告位" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
          <el-button type="primary"  @click="addOrUpdateHandle()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;"
    >
      <el-table-column prop="advTitle" header-align="center" align="center" label="广告标题"  ></el-table-column>
      <el-table-column
        prop="startDate"
        header-align="center"
        align="center"
        width="180"
        label="开始时间"
      ></el-table-column>
      <el-table-column prop="endDate" header-align="center" align="center" width="180" label="结束时间"></el-table-column>
      <el-table-column prop="sort" header-align="center" align="center" width="80" label="排序"  maxlength=12></el-table-column>
      <el-table-column
        prop="apName"
        header-align="center"
        align="center"
        label="所属广告位">
      </el-table-column>

      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small"  @click="addOrUpdateHandle(scope.row.advId)">修改</el-button>
          <span class="el-dropdown-links"></span>
          <!--<el-button type="text" size="small" @click="deleteHandle(scope.row.advId,scope.row.advTitle)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      style="margin-top: 20px"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import DropdownMenu from '@/components/Share/DropdownMenu'

export default {
  name: 'Documentation',
  components: { DropdownMenu },
  data() {
    return {
      dataForm: {
        key: ""
      },
      dataList:[{},{},{},{},{},{},{},{},{},{}],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading:false,
    }
  },
  methods:{
    getDataList(){

    },
    addOrUpdateHandle(){

    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
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
