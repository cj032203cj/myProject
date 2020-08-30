<template>
    <div class="detail">
      <div class="top-header">
        <div class="top-info">
          <el-row class="grid-center-row">
            <el-col :span="8">
              <div style="visibility: hidden">none</div>
            </el-col>
            <el-col :span="8" class="middle-text" style="">
              <div>提交日期：2020-08-12 19：00 </div>
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
              <div>关于填报国家医疗服务质量与安全报告抽样调查</div>
              <div class="left-list">
<!--                <el-steps direction="vertical" space="50px" :active="1">-->
<!--                  <el-step description="这是一段很长很长很长的描述性文字"></el-step>-->
<!--                  <el-step description="这是一段很长很长很长的描述性文字"></el-step>-->
<!--                  <el-step  description="这是一段很321312长很长很长的描述性文字"></el-step>-->
<!--                  <el-step  description="这是一段很13213长很长很长的描述性文字"></el-step>-->
<!--                  <el-step  description="这是一段很长很长很长的描述性文字"></el-step>-->
<!--                  <el-step  description="这是一段很13123长很长很长的描述性文字"></el-step>-->
<!--                  <el-step  description="这是一段很长很长很长的描述性文字"></el-step>-->
<!--                </el-steps>-->
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
          <el-col :span="16">
            <div class="grid-title">关于填报国家医疗服务质量与安全报告抽样调查</div>
            <div class="grid-org">药水部</div>
            <div class="grid-disc">根据国家微生物发乎大数据的斯柯达斯柯达拉萨扩大了大苏打萨达萨达萨达撒旦·大撒大撒大苏打撒旦活动按期开始活动按期开始活动活开始活动按期开始活动按期开始活动活开始活动按期开始活动按期开始活动活开始</div>
          </el-col>
        </el-row>
      </div>

    </div>
</template>

<script>
    export default {
      name: "AdataDetail",
      data(){
        return{
          chose_index:-1,
          reverse: true,
          activities: [{
            content: '1.活动按期开始活动按期开始活动活开始',
            color:'#B5B5B5'
          }, {
            content: '2.通过审核通过审核通过审核通过审核通过审核',
            color:'#B5B5B5'
          }, {
            content: '3.创建成功创建成功创建成功创建成功功',
            color:'#B5B5B5'
          }]
        }
      },
      methods:{
        chose_activity(item,index){
          this.chose_index=  index
          this.activities.forEach(item=>{
            item.color='#B5B5B5'
          })
          this.activities[index].color='#2375FE'
          console.log(this.activities)
        }
      }
    }
</script>

<style scoped lang="scss">
  .detail{
    height: 100vh;
    width: 100vw;
    background: #fff;
    overflow: hidden;
    .top-header{
      height: 80px;
      width: 100%;
      position: fixed;
      background: #fff;
      top: 0;
      left: 0px;
      .top-info{
        width: calc( 100vw - 240px );
        background: #EBF1FE;
        height: 80px;
        margin: 0 120px;
        .middle-text{
          text-align: center;
          line-height: 80px;
          color: #1F72FA;
        }
        .right-text{
          vertical-align: middle;
          height: 80px;
          line-height: 80px;
          text-align: right;
        }
      }
    }
    .grid-center{
      margin: 0 120px;
      margin-top: 80px;
      height: calc( 100vh - 80px);
      .grid-center-row{
        height: 800px;
        .left-title{
          font-size: 14px;
          font-weight: bold;
          width: 160px;
          line-height: 20px;
          margin-top: 130px;
          .left-list{
            width: 100%;
            margin-top: 24px;
            border-top: 1px solid #E9EEF2;
          }
        }
        .grid-title{
          margin-top: 40px;
          margin-bottom: 32px;
          font-weight: bold;
          text-align: center;
        }
        .grid-org{
          margin-bottom: 24px;
          text-align: center;
        }
        .grid-disc{
          text-indent: 36px;
          line-height: 24px;
          font-size: 12px;
        }
      }
    }
  }
  .active_color{
    color: #1F72FA;
  }

</style>
