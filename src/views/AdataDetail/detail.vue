<template>
  <div class="detail">
    <div class="top-header">
      <div class="top-info">
        <el-row class="grid-center-row">
          <el-col :span="8">
            <div style="visibility: hidden">none</div>
          </el-col>
          <el-col :span="8" class="middle-text" style="">
            <div>提交日期：2020-08-12 19：00</div>
          </el-col>
          <el-col :span="7" class="right-text">
            <div>
              <el-button icon="el-icon-printer" type="primary" size="small" round>打印</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="grid-center">
      <el-row class="grid-center-row">
        <el-col :span="8">
          <div class="left-title">
            <div>{{titleObject.title_all}}</div>
            <div class="left-list">

              <el-timeline style="padding-left: 0;margin-top: 20px">
                <el-timeline-item
                  style="cursor: pointer"
                  v-for="(activity, index) in activities"
                  :key="index"
                  :color="activity.color"
                  :timestamp="activity.timestamp">
                  <div @click="chose_activity(activity,index)" :class="{active_color:index==chose_index}">
                    {{activity.content}}
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </el-col>
        <el-col :span="16" class="right-info-box">
          <div>
            <div class="grid-title">{{titleObject.title_all}}</div>
            <div class="grid-org">{{titleObject.title_org}}</div>
            <div class="grid-disc">
              根据国家微生物发乎大数据的斯柯达斯柯达拉萨扩大了大苏打萨达萨达萨达撒旦·大撒大撒大苏打撒旦活动按期开始活动按期开始活动活开始活动按期开始活动按期开始活动活开始活动按期开始活动按期开始活动活开始
            </div>
          </div>
          <div style="margin-top: 40px" v-for="(item_0,index_0) in titleObject.subjectList">
            <div class="list-title">{{index_0+1}}.活动按期开始活动按期开始活动活开始</div>
            <div class="list-desc" v-for="(item,index) in 5" :key="index">{{index+1}}.{{item_0.subjDesc}}</div>
            <div>
              <div v-for="(item,index) in item_0.subjListChild" class="li-form">
                <div>实际开放床数</div>
                <div class="li-forminfo">
                  <template v-if="item.type==0">
                    <el-input style="width: 120px"></el-input>
                  </template>
                  <template v-if="item.type==1">
                    <el-radio-group v-model="radio">
                      <el-radio :label="3">备选项</el-radio>
                      <el-radio :label="6">备选项</el-radio>
                      <el-radio :label="9">备选项</el-radio>
                    </el-radio-group>
                  </template>
                  <template v-if="item.type==2">
                    <el-checkbox-group v-model="checkList">
                      <el-checkbox label="复选框 A"></el-checkbox>
                      <el-checkbox label="复选框 B"></el-checkbox>
                      <el-checkbox label="复选框 C"></el-checkbox>
                    </el-checkbox-group>
                  </template>
                  <template v-if="item.type==3">
                    <el-input style="width: 360px" type="textarea"></el-input>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
  import { questPreview } from '@/api/AdataCenter'

  export default {
    name: "AdataDetail",
    data() {
      return {
          radio: -1,
        checkList: [],
        titleList0: [{}, {}],
        titleObject:{
          title_all:'关于填报国家医疗服务质量与安全报告抽样调查',
          title_org:'药水部',
          title_desc:'总说明',
          subjectList:[
            {
              subjTitle:'1.这是第一道大题',
              subjDesc:'说明1XMB说明2XMB说明3XMB说明4XMB',
              subjListChild: [
                {
                  id:"FDS234324FDSF",
                  type: 0,
                  value:'这是存放input答案的位置',
                  list:[]
                },
                {
                  id:"FDS234324FDSF",
                  type: 1,
                  value:'这是存放单选答案的位置',
                  list:[
                    {
                      label:"是",
                      value:1
                    },
                    {
                      label:"否",
                      value:0
                    },
                  ]
                },
                {
                  id:"FDS234324FDSF",
                  type: 2,
                  value:'这是存放多选框答案的位置',
                  list:[
                    {
                      label:"答案1",
                      value:0
                    },
                    {
                      label:"答案2",
                      value:2
                    },
                    {
                      label:"答案3",
                      value:3
                    },
                    {
                      label:"答案4",
                      value:4
                    },
                  ]
                },
                {
                  id:"FDS234324FDSF",
                  type: 3,
                  value:'这是存放简单题答案的位置',
                  list:[]
                },
              ],
            },
            {
              subjTitle:'1.这是第一道大题',
              subjDesc:'说明1XMB说明2XMB说明3XMB说明4XMB',
              subjListChild: [
                {
                  id:"FDS234324FDSF",
                  type: 0,
                  value:'这是存放input答案的位置',
                  list:[]
                },
                {
                  id:"FDS234324FDSF",
                  type: 2,
                  value:'这是存放单选答案的位置',
                  list:[
                    {
                      label:"是",
                      value:1
                    },
                    {
                      label:"否",
                      value:0
                    },
                  ]
                },
                {
                  id:"FDS234324FDSF",
                  type: 3,
                  value:'这是存放多选框答案的位置',
                  list:[
                    {
                      label:"答案1",
                      value:0
                    },
                    {
                      label:"答案2",
                      value:2
                    },
                    {
                      label:"答案3",
                      value:3
                    },
                    {
                      label:"答案4",
                      value:4
                    },
                  ]
                },
                {
                  id:"FDS234324FDSF",
                  type: 4,
                  value:'这是存放简单题答案的位置',
                  list:[]
                },
              ],
            },
            {
              subjTitle:'1.这是第一道大题',
              subjDesc:'说明1XMB说明2XMB说明3XMB说明4XMB',
              subjListChild: [
                {
                  id:"FDS234324FDSF",
                  type: 0,
                  value:'这是存放input答案的位置',
                  list:[]
                },
                {
                  id:"FDS234324FDSF",
                  type: 2,
                  value:'这是存放单选答案的位置',
                  list:[
                    {
                      label:"是",
                      value:1
                    },
                    {
                      label:"否",
                      value:0
                    },
                  ]
                },
                {
                  id:"FDS234324FDSF",
                  type: 3,
                  value:'这是存放多选框答案的位置',
                  list:[
                    {
                      label:"答案1",
                      value:0
                    },
                    {
                      label:"答案2",
                      value:2
                    },
                    {
                      label:"答案3",
                      value:3
                    },
                    {
                      label:"答案4",
                      value:4
                    },
                  ]
                },
                {
                  id:"FDS234324FDSF",
                  type: 4,
                  value:'这是存放简单题答案的位置',
                  list:[]
                },
              ],
            }
          ],

        },

        chose_index: -1,
        reverse: true,
        activities: [{
          content: '1.活动按期开始活动按期开始活动活开始',
          color: '#B5B5B5'
        }, {
          content: '2.通过审核通过审核通过审核通过审核通过审核',
          color: '#B5B5B5'
        }, {
          content: '3.创建成功创建成功创建成功创建成功功',
          color: '#B5B5B5'
        }]
      }
    },
    mounted() {
      this.getDataList()
    },
    methods: {
      getDataList(){
        questPreview({
          requestData: {
            curPage: this.pageIndex,
            dept_name: this.dataForm.dept_name,
            title: this.dataForm.title,
            pageSize: this.pageSize,
          },
        }).then(res => {
          that.dataList=res.data.pageData
          that.totalPage=res.data.totalSize
        })
      },
      chose_activity(item, index) {
        this.chose_index = index
        this.activities.forEach(item => {
          item.color = '#B5B5B5'
        })
        this.activities[index].color = '#2375FE'
        console.log(this.activities)
      }
    }
  }
</script>

<style scoped lang="scss">
  .detail {
    height: 100vh;
    width: 100vw;
    background: #fff;
    overflow: hidden;

    .top-header {
      height: 80px;
      width: 100%;
      position: fixed;
      background: #fff;
      top: 0;
      left: 0px;

      .top-info {
        width: calc(100vw - 240px);
        background: #EBF1FE;
        height: 80px;
        margin: 0 120px;

        .middle-text {
          text-align: center;
          line-height: 80px;
          color: #1F72FA;
        }

        .right-text {
          vertical-align: middle;
          height: 80px;
          line-height: 80px;
          text-align: right;
        }
      }
    }

    .grid-center {
      margin: 0 120px;
      margin-top: 80px;
      height: calc(100vh - 80px);

      .grid-center-row {
        height: 800px;

        .left-title {
          font-size: 14px;
          font-weight: bold;
          width: 160px;
          line-height: 20px;
          margin-top: 130px;

          .left-list {
            width: 100%;
            margin-top: 24px;
            border-top: 1px solid #E9EEF2;
          }
        }

        .grid-title {
          margin-top: 40px;
          margin-bottom: 32px;
          font-weight: bold;
          text-align: center;
        }

        .grid-org {
          margin-bottom: 24px;
          text-align: center;
        }

        .grid-disc {
          text-indent: 36px;
          line-height: 24px;
          font-size: 18px;
        }

        .list-desc {
          margin-top: 16px;
          color: #ccc;
          font-size: 18px;
          text-indent: 18px;
          margin-bottom: 40px;
        }

        .li-form {
          margin-bottom: 32px;
        }

        .li-forminfo {
          margin-top: 16px;
        }

        .right-info-box {
          height: calc(100vh - 80px);
          overflow: auto;
        }
      }
    }
  }

  .active_color {
    color: #1F72FA;
  }

</style>
