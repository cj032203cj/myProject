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
              <el-button icon="el-icon-printer" type="primary" size="small">打印</el-button>
              <el-button type="primary" size="small" style="margin-left: 20px" @click="answer">提交</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="grid-center">
      <el-row class="grid-center-row">
        <el-col :span="8">
          <div class="left-title">
            <div>{{dataObject.title}}</div>
            <div class="left-list">

              <el-timeline style="padding-left: 0;margin-top: 20px">
                <el-timeline-item
                  style="cursor: pointer"
                  v-for="(activity, index) in dataObject.subjList"
                  :key="index"
                  :color="activity.color"
                  :timestamp="activity.timestamp">
                  <div @click="chose_activity(activity,index)" :class="{active_color:index==chose_index}">
                    <a :href="'#herf_'+activity.id">{{activity.title}}</a>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </el-col>
        <el-col :span="16" class="right-info-box">
          <div>
            <div class="grid-title">{{dataObject.title}}</div>
            <div class="grid-org">{{dataObject.dept_name}}</div>
            <div class="grid-disc">
              {{dataObject.que_desc}}
            </div>
          </div>
          <div style="margin-top: 40px" v-for="(item_0,index_0) in dataObject.subjList">
            <div class="list-title" :id="'herf_'+item_0.id">{{item_0.title}}</div>
            <ul>
              <li class="list-desc" v-for="(item_1,index_1) in item_0.desc" :key="item_1">{{item_1}}</li>
            </ul>
            <div>
              <div v-for="(item_2,index_2) in item_0.subjmxList" :key="index_2" class="li-form">
                <div>{{item_2.title}}</div>
                <div class="li-forminfo">
                  <template v-if="item_2.type==3">
                    <el-input style="width: 120px" v-model="item_2.answer"></el-input>
                  </template>
                  <template v-if="item_2.type==1">
                    <el-radio-group v-model="item_2.answer">
                      <el-radio v-for="item_3 in item_2.subjItems" :label="item_3.id" class="mr-20">{{item_3.title}}</el-radio>
                    </el-radio-group>
                  </template>
                  <template v-if="item_2.type==2">
                    <el-checkbox-group v-model="item_2.answer">
                      <el-checkbox style="display: block;margin-bottom: 20px" v-for="item_3 in item_2.subjItems" :label="item_3.id" :key="item_3.id">{{item_3.title}}</el-checkbox>
                    </el-checkbox-group>
                  </template>
                  <template v-if="item_2.type==4">
                    <el-input style="width: 360px" type="textarea" v-model="item_2.answer"></el-input>
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
  import { questPreview ,savePreview} from '@/api/AdataCenter'

  export default {
    name: "AdataDetail",
    data() {
      return {
          radio: -1,
        checkList: [],
        chose_index: -1,
        reverse: true,
        requestData:{},
        dataObject:{},
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
      if(this.$route.query.org_id){
        this.requestData={
          "org_id": this.$route.query.org_id,
          "que_id":  this.$route.query.que_id,
          "temp_id":  this.$route.query.temp_id
        }
      }
      this.getDataList()
    },
    methods: {
      answer(){
        let answerList=[]
        this.dataObject.subjList.forEach(item=>{
          if(item.subjmxList){
            item.subjmxList.forEach(item_1=>{
              const data={}
              if(item_1.answer){
                data.answer=item_1.answer
                data.answerid=item_1.answerid
                data.subjmx_id=item_1.id
                answerList.push(data)
              }
            })
          }
        })
        if(answerList.length>0){
          savePreview({
            requestData:{
              answerList:answerList,
              org_id:this.$route.query.org_id,
              publish_id:this.$route.query.que_id,
            } ,
          }).then(res => {
            this.$message({
              message: res.returnMsg,
              type: 'success'
            })
            this.getDataList()
          })
        }else{
          this.$message({
            message: '至少填写一个答案',
            type: 'error'
          })
        }

      },
      getDataList(){
        questPreview({
          requestData: this.requestData,
        }).then(res => {
          res.data.subjList.forEach(item=>{
            let desc=[]
            if(item.desc){
              desc=item.desc.split('&&')
            }
            item.desc=desc
            if(item.subjmxList) {
              item.subjmxList.forEach(item_1 => {
                if(item_1.type == 2){
                  if(item_1.answer){

                  }else{
                    item_1.answer=[]
                  }
                }
                if (item_1.answer) {
                  if (item_1.type == 1 || item_1.type == 2) {
                    item_1.answer = parseInt(item_1.answer)
                  }
                }
              })
            }
          })
          this.dataObject=res.data
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
    /*overflow: hidden;*/
    .mr-20{
      margin-right: 20px;
    }
    .top-header {
      height: 80px;
      width: 100%;
      position: fixed;
      z-index: 2000;
      background: #fff;
      top: 0;
      left: 0px;

      .top-info {
        width: 1200px;
        background: #EBF1FE;
        height: 80px;
        margin: 0 auto;

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
      width: 1200px;
      margin: 0 auto;
      margin-top: 80px;
      /*height: calc(100vh - 80px);*/

      .grid-center-row {
        /*height: 800px;*/

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
        .list-title{
          font-weight: bold;
        }
        .list-desc {
          margin-top: 16px;
          color: #ccc;
          font-size: 18px;
          text-indent: 18px;
          margin-bottom: 30px;
          list-style-type: disc;
        }

        .li-form {
          margin-bottom: 32px;
        }

        .li-forminfo {
          margin-top: 16px;
        }

        .right-info-box {
          /*height: 1600px;*/
          /*overflow: auto;*/
        }
      }
    }
  }

  .active_color {
    color: #1F72FA;
  }

</style>
