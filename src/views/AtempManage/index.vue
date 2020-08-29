<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-form-item label="医院名称：">
            <el-input v-model="dataForm.name" placeholder="请输入医院名称" />
          </el-form-item>
          <el-form-item label="调查表：">
            <el-input v-model="dataForm.name" placeholder="请输入调查表" />
          </el-form-item>
          <el-form-item label="部门：">
            <el-input v-model="dataForm.name" placeholder="请输入部门" />
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
      <el-table-column prop="hostName" header-align="center" align="center" label="医院名称" />
      <el-table-column prop="questName" header-align="center" align="center" label="调查表名称" />
      <el-table-column prop="org" header-align="center" align="center" label="部门" />
      <el-table-column prop="status" header-align="center" align="center" label="填报状态" />
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
        width="180"
        label="提交日期"
      />
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
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

export default {
  name: 'Documentation',
  components: { DropdownMenu },
  data() {
    return {
      dataForm: {
        key: ''
      },
      dataList: [
        {
          hostName: '广西自治区人民医院',
          questName: '关于填报国家医疗服务质量与安全报告抽样调查表',
          org: '关于填报国家医疗服务质量与安全报告抽样调查表',
          status: '关于填报国家医疗服务质量与安全报告抽样调查表',
          startTime: '2019-08-12 09:12:23',
          endTime: '2020-08-12 09:12:23'
        },
        {
          hostName: '广西自治区人民医院',
          questName: '关于填报国家医疗服务质量与安全报告抽样调查表',
          org: '关于填报国家医疗服务质量与安全报告抽样调查表',
          status: '关于填报国家医疗服务质量与安全报告抽样调查表',
          startTime: '2019-08-12 09:12:23',
          endTime: '2020-08-12 09:12:23'
        },
        {
          hostName: '广西自治区人民医院',
          questName: '关于填报国家医疗服务质量与安全报告抽样调查表',
          org: '关于填报国家医疗服务质量与安全报告抽样调查表',
          status: '关于填报国家医疗服务质量与安全报告抽样调查表',
          startTime: '2019-08-12 09:12:23',
          endTime: '2020-08-12 09:12:23'
        },
        {
          hostName: '广西自治区人民医院',
          questName: '关于填报国家医疗服务质量与安全报告抽样调查表',
          org: '关于填报国家医疗服务质量与安全报告抽样调查表',
          status: '关于填报国家医疗服务质量与安全报告抽样调查表',
          startTime: '2019-08-12 09:12:23',
          endTime: '2020-08-12 09:12:23'
        },
        {
          hostName: '广西自治区人民医院',
          questName: '关于填报国家医疗服务质量与安全报告抽样调查表',
          org: '关于填报国家医疗服务质量与安全报告抽样调查表',
          status: '关于填报国家医疗服务质量与安全报告抽样调查表',
          startTime: '2019-08-12 09:12:23',
          endTime: '2020-08-12 09:12:23'
        }
      ],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false
    }
  },
  methods: {
    getDataList() {

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
