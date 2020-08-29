<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-form-item label="医院名称：">
            <el-input v-model="dataForm.name" placeholder="请输入医院名称" />
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh-right" @click="getDataList()">重置</el-button>
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
      <el-table-column prop="hostName" header-align="center" align="center" label="医院名称" />
      <el-table-column prop="realName" header-align="center" align="center" label="联系人姓名" />
      <el-table-column prop="phone" header-align="center" align="center" label="手机号" />
      <el-table-column prop="userName" header-align="center" align="center" label="用户名" />
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
          realName: '陈杰',
          phone: '13147166760',
          userName: '陈陈陈'
        },
        {
          hostName: '广西自治区人民医院',
          realName: '陈杰',
          phone: '13147166760',
          userName: '陈陈陈'
        },
        {
          hostName: '广西自治区人民医院',
          realName: '陈杰',
          phone: '13147166760',
          userName: '陈陈陈'
        },
        {
          hostName: '广西自治区人民医院',
          realName: '陈杰',
          phone: '13147166760',
          userName: '陈陈陈'
        },
        {
          hostName: '广西自治区人民医院',
          realName: '陈杰',
          phone: '13147166760',
          userName: '陈陈陈'
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
