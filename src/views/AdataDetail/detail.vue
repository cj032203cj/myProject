<template>
  <div class="detail">
    <div class="top-header">
      <div class="top-info">
        <el-row class="grid-center-row">
          <el-col :span="8">
            <div style="visibility: hidden">none</div>
          </el-col>
          <el-col  :span="8" class="middle-text" style="">
            <div v-if="!requestDataId" class="div1">填报截止日期：{{dataObject.etime }}</div>
            <div v-if="!requestDataId" class="div2">剩余填报时间：{{timeDiff}}</div>
          </el-col>
          <el-col :span="7" class="right-text">
            <div>
              <el-button v-if="edit" type="info" @click="back" size="small">返回</el-button>
              <el-button icon="el-icon-share" type="primary" size="small" style="margin-left: 20px" @click="shareQuest">分配</el-button>
              <el-button icon="el-icon-printer" type="primary" size="small" style="margin-left: 20px" >打印</el-button>
              <el-button type="primary" size="small" v-if="!requestDataId&&edit==1" style="margin-left: 20px" @click="answer" >提交</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="grid-center">
      <el-row class="grid-center-row">
        <el-col :span="8" v-if="!requestDataId">
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
                    <a :href="'#herf_'+activity.id" class="herf_a">{{activity.title}}</a>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </el-col>
        <el-col :span="requestDataId?24:16" class="right-info-box">
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
                      <el-checkbox style="display: block;margin-bottom: 20px" v-for="item_4 in item_2.subjItems" :label="item_4.id" :key="item_4.title">{{item_4.title}}</el-checkbox>
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
    <el-dialog title="待填报内容" :visible.sync="showDialog" width="500px">
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { questPreview ,savePreview,tempPreview,queryNotDistList} from '@/api/AdataCenter'

  export default {
    name: "AdataDetail",
    data() {
      return {
        showDialog:false,
        radio: -1,
        checkList: [],
        chose_index: -1,
        reverse: true,
        requestData:{},
        timer:null,
        requestDataId:'',
        dataObject:{},
        edit:0,
        timeDiff:'',
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
    beforeDestroy() {
      clearInterval(this.timer);
    },
    mounted() {
      if(this.$route.query.org_id){
        this.requestData={
          "org_id": this.$route.query.org_id,
          "que_id":  this.$route.query.que_id,
          "temp_id":  this.$route.query.temp_id
        }
      }else{
        this.requestDataId=this.$route.query.temp_id
      }
      if(this.$route.query.edit){
        this.edit=this.$route.query.edit
      }
      this.getDataList()
    },
    methods: {
      difference(endTime) {
        let dateBegin = new Date();
        let dateEnd = new Date(endTime);
        let dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
        let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
        let leave1 = dateDiff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000));//计算出小时数
        //计算相差分钟数
        let leave2 = leave1 % (3600 * 1000);   //计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
        //计算相差秒数
        let leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数
        let seconds = Math.round(leave3 / 1000);
        this.timeDiff=dayDiff + "天 " + hours + "小时 " + minutes + "分"
      },
      back(){
        this.$router.go(-1)
      },
      shareQuest(){
        this.showDialog=true
        queryNotDistList({
            requestData: {
              "id": JSON.parse(localStorage.getItem('role')).id,
              "org_id": this.$route.query.org_id,
              "publish_id":this.$route.query.que_id
            },
          }).then(res => {
        })
      },
      answer(){
        let that = this
        let answerList=[]
        this.dataObject.subjList.forEach(item=>{
          if(item.subjmxList){
            item.subjmxList.forEach(item_1=>{
              if(item_1.answer){
                const data={}
                if(item_1.type==2){
                  if(item_1.answer.length>0){
                    data.answer=item_1.answer.toString()
                    data.answerid=item_1.answerid
                    data.subjmx_id=item_1.id
                    answerList.push(data)
                  }
                }else{
                  data.answer=item_1.answer
                  data.answerid=item_1.answerid
                  data.subjmx_id=item_1.id
                  answerList.push(data)
                }

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
            setTimeout(function () {
              that.$router.go(-1)

            },500)
          })
        }else{
          this.$message({
            message: '至少填写一个答案',
            type: 'error'
          })
        }

      },
      getDataList(){
        let that = this
        if(this.requestDataId){
          tempPreview({
            requestData: this.requestDataId,
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
                      item_1.answer=item_1.answer.split(',').map(Number)

                    }else{
                      item_1.answer=[]
                    }
                  }
                  if (item_1.answer) {
                    if (item_1.type == 1) {
                      item_1.answer = parseInt(item_1.answer)
                    }
                  }
                })
              }
            })
            this.dataObject=res.data
            this.timer = setInterval(function (){
              that.difference(that.dataObject.etime)
            }, 1000);
          })
        }else{
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
                      item_1.answer=item_1.answer.split(',').map(Number)

                    }else{
                      item_1.answer=[]
                    }
                  }
                  if (item_1.answer) {
                    if (item_1.type == 1) {
                      item_1.answer = parseInt(item_1.answer)
                    }
                  }
                })
              }
            })
            this.dataObject=res.data
            this.timer = setInterval(function (){
              that.difference(that.dataObject.etime)
            }, 1000);

          })
        }

      },
      chose_activity(item, index) {
        this.chose_index = index
        this.dataObject.subjList.forEach(item => {
          item.color = '#B5B5B5'
        })
        this.dataObject.subjList[index].color = '#2375FE'
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
          color: #1F72FA;
          font-size: 16px;
          .div1{
            height: 50px;
            line-height: 60px;
          }
          .div2{
            line-height: 10px;
          }
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
          width: 180px;
          line-height: 20px;
          margin-top: 130px;

          .left-list {
            width: 100%;
            margin-top: 24px;
            border-top: 1px solid #E9EEF2;
            .herf_a{
              color: #999;
            }
          }
        }

        .grid-title {
          margin-top: 40px;
          font-size: 20px;
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
