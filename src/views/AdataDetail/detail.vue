<template>
  <div class="detail">
    <div v-if="!loading">
      <div v-if="!needPwd">
        <div class="top-header">
          <div class="top-info">
            <el-row class="grid-center-row">
              <el-col :span="8">
                <div style="visibility: hidden">none</div>
              </el-col>
              <el-col :span="8" class="middle-text" style="">
                <div v-if="!requestDataId" class="div1">填报截止日期：{{dataObject.etime }}</div>
                <div v-if="!requestDataId&&has_time" class="div2">剩余填报时间：{{timeDiff}}</div>
                <div style="visibility: hidden" v-else>none</div>
              </el-col>
              <el-col :span="7" class="right-text">


                <el-button type="info" v-if="edit==1||edit==2" @click.stop.prevent="back" size="small" round>返回</el-button>
                <el-button icon="el-icon-share" v-if="!requestDataId&&!sharePage&&has_time&&edit==1" type="primary"
                           size="small" style="margin-left: 20px" @click.stop.prevent="shareQuest" round plain>分配
                </el-button>
                <div style="display: inline-block;margin-left: 20px">
                  <el-button icon="el-icon-printer" v-if="!sharePage" type="primary" size="small" v-print="printObj" round plain>
                    打印
                  </el-button>
                </div>
                <el-button type="primary" size="small" v-if="((!requestDataId&&edit==1)||sharePage)&&has_time"
                           style="margin-left: 20px" @click.stop.prevent="answer" round>提交
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="grid-center">
          <el-row class="grid-center-row">
            <el-scrollbar class="left-title" v-if="!requestDataId">
              <div>{{dataObject.title}}</div>
              <div class="left-list">
                <el-timeline style="padding-left: 2px;margin-top: 20px">
                  <el-timeline-item
                    style="cursor: pointer"
                    v-for="(activity, index) in dataObject.subjList"
                    :key="index"
                    :color="activity.color"
                    :timestamp="activity.timestamp">
                    <div @click="chose_activity(activity,index)" :class="{active_color:index==chose_index}">
                      <a>{{parseInt(index+1)}}.{{activity.title}}</a>
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-scrollbar>
            <el-col :span="8" v-if="!requestDataId">
              <div style="visibility: hidden">none</div>
            </el-col>
            <el-col :span="requestDataId?24:16" class="right-info-box">
              <div id="printMe">
                <div>
                  <div class="grid-title"
                       style="margin-top: 40px;font-size: 20px; margin-bottom: 32px;font-weight: bold;text-align: center;">
                    {{dataObject.title}}
                  </div>
                  <div class="grid-org" style="margin-bottom: 24px;text-align: center;">{{dataObject.dept_name}}</div>
                  <div class="grid-disc" style="text-indent: 36px; line-height: 24px;font-size: 18px;">
                    {{dataObject.que_desc}}
                  </div>
                </div>
                <div style="margin-top: 40px" v-for="(item_0,index_0) in dataObject.subjList">
                  <div class="list-title" style="font-weight: bold" :id="'herf_'+index_0">
                    {{parseInt(index_0+1)}}.{{item_0.title}}
                  </div>
                  <ul>
                    <li class="list-desc"
                        style="margin-top: 16px;color: #656565;font-size: 16px;text-indent: 18px;margin-bottom: 20px;list-style-type: disc;line-height: 28px"
                        v-for="(item_1,index_1) in item_0.desc" :key="item_1">{{item_1}}
                    </li>
                  </ul>
                  <div>
                    <div v-for="(item_2,index_2) in item_0.subjmxList" :key="index_2" class="li-form"
                         style="margin-bottom: 32px">
                      <div>{{item_2.title}}</div>
                      <div class="li-forminfo" style="margin-top: 16px;">
                        <template v-if="item_2.type==3">
                          <el-input style="width: 120px;"
                                    :disabled="((requestDataId!=''||edit==0||edit==2)&&!sharePage)||!has_time"
                                    v-model="item_2.answer"></el-input>
                        </template>
                        <template v-if="item_2.type==1">
                          <el-radio-group v-model="item_2.answer" style="margin-left: 10px">
                            <el-radio v-for="item_3 in item_2.subjItems"
                                      :disabled="((requestDataId!=''||edit==0||edit==2)&&!sharePage)||!has_time"
                                      :label="item_3.id" class="mr-20">{{item_3.title}}
                            </el-radio>
                          </el-radio-group>
                        </template>
                        <template v-if="item_2.type==2">
                          <el-checkbox-group v-model="item_2.answer">
                            <el-checkbox style="display: block;margin-bottom: 20px" v-for="item_4 in item_2.subjItems"
                                         :disabled="((requestDataId!=''||edit==0||edit==2)&&!sharePage)||!has_time"
                                         :label="item_4.id" :key="item_4.title">{{item_4.title}}
                            </el-checkbox>
                          </el-checkbox-group>
                        </template>
                        <template v-if="item_2.type==4">
                          <el-input style="width: 360px" type="textarea"
                                    :disabled="((requestDataId!=''||edit==0||edit==2)&&!sharePage)||!has_time"
                                    v-model="item_2.answer"></el-input>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-dialog title="请输入密码" :visible.sync="needPwd" width="400px">
        <el-input type="text" style="width:200px;margin-right: 20px" v-model="share_pwd" placeholder="输入密码"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="firmPwd">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog title="待填报内容" :visible.sync="showDialog" width="1000px">

        <el-table
          :data="dataHasAnswerList"
          max-height="250"
          size="small"
          stripe
          :header-cell-style="{
            background:'#F1F5F9',
            color:'#333',
            height:'44px',
          }"
          :row-style="{height:'44px'}"
          style="width: 100%;font-size: 14px;margin-bottom: 20px"
        >

          <el-table-column prop="percentage" label="完成度">
            <template slot-scope="scope">
              <div class="less-height">
                <el-progress size="small" :percentage="scope.row.percentage"></el-progress>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="subjStr" label="已分配标题"></el-table-column>
          <el-table-column prop="title" width="400px" label="分配内容">
            <template slot-scope="scope">
              <div v-if="scope.row.pwd">请打开<el-link type="primary" style="display: inline">{{windowUrl}}?share_id={{scope.row.shareid}}</el-link>,填报第{{scope.row.subjStr}}题的内容,查看密码为<el-link type="primary" style="display: inline">{{scope.row.pwd}}</el-link></div>
              <div v-else>请打开<el-link type="primary" style="display: inline">{{windowUrl}}?share_id={{scope.row.shareid}}</el-link>,填报第{{scope.row.subjStr}}题的内容</div>
            </template>
          </el-table-column>
          <el-table-column prop="created_time" label="生成时间"/>
          <el-table-column prop="title"  label="操作" width="180px">
            <template slot-scope="scope">
              <el-link type="danger" @click="chexiao(scope.row)">撤销</el-link>
              <span class="el-dropdown-links_line"></span>
              <el-button type="text" style="margin-left: 20px;margin-right: 20px" data-clipboard-action="copy"
                         :data-clipboard-text="scope.row.the_url" :class="'tag-copy'+scope.row.id"
                         @click="copyText(scope)">复制
              </el-button>
              <span class="el-dropdown-links_line"></span>
              <el-button type="text" @click="setThisPwd(scope.row,1)">设置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: space-between;margin-bottom: 10px">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
          </el-checkbox>
          <el-button type="primary" size="small" @click="fenpei">分配</el-button>
        </div>
        <el-checkbox-group v-model="choseAnswer" @change="handleCheckedCitiesChange">
          <div style="height: 200px;overflow-y: auto;background: #F1F5F9;">
            <el-checkbox v-for="city in dataAnswerList" :label="city.id" :key="city.id"
                         style="display: block;height: 30px;line-height: 30px;padding-left: 10px;color: #000">
              {{city.sort_no}}. {{city.title}}
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </el-dialog>
      <el-dialog title="设置密码" :visible.sync="showDialogNext" width="600px">
        <el-radio-group v-model="switchRoles" @change="changeValue">
          <el-radio :label="1">
            所有人
          </el-radio>
          <el-radio :label="2">
            密码查看
          </el-radio>
        </el-radio-group>
        <div v-if="switchRoles==2" class="disFlex" style="margin-top: 30px">
          <el-input type="text" style="width:200px;margin-right: 20px" v-model="setPwd" placeholder="输入密码"></el-input>
          <el-button type="primary" @click="setPwdFn">保存密码</el-button>
        </div>
        <div v-if="set_url">
          <div   style="width: 496px;background: #F2F6F9;color:#616367;line-height: 32px;padding:16px;margin-top: 42px">{{set_url}}</div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="copyContent" v-if="set_url" class="copy-content" data-clipboard-action="copy" :data-clipboard-text="set_url" type="primary" plain>复制内容</el-button>
          <el-button @click="showDialogNext = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-else v-loading="true"></div>
  </div>
</template>

<script>
  import {
    questPreview,
    savePreview,
    questPreviewByShare,
    tempPreview,
    queryNotDistList,
    doDist,
    questShareList,
    cancelDist,
    updSharePwd,
    questShareinfo
  } from '@/api/AdataCenter'
  import Clipboard from 'clipboard'

  export default {
    name: "AdataDetail",
    data() {
      return {
        windowUrl:window.location.href.split('?')[0],
        isSetPwd:false,
        loading: true,
        printObj: {
          id: "printMe",
          popTitle: '打印模板',
          extraHead: ''
        },
        share_pwd: '',
        setPwd: '',
        switchRoles: 1,
        showDialogNext: false,
        checkAll: false,
        isIndeterminate: true,
        showDialog: false,
        radio: -1,
        checkList: [],
        chose_index: -1,
        reverse: true,
        requestData: {},
        timer: null,
        sharePage: false,   //分享模板
        requestDataId: '',   //查看模板
        choseAnswer: [],
        fenpei_id: '',
        dataAnswerList: [],
        dataHasAnswerList: [],
        dataObject: {},
        edit: 0,
        set_url:'',
        needPwd: false,
        timeDiff: '',
        has_time: false,
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
      if (this.$route.query.share_id) {
        this.sharePage = true
        this.getInfoNeedPws()
      } else {
        if (this.$route.query.org_id) {
          this.requestData = {
            "org_id": this.$route.query.org_id,
            "que_id": this.$route.query.que_id,
            "temp_id": this.$route.query.temp_id
          }
        } else {
          this.requestDataId = this.$route.query.temp_id
        }
        if (this.$route.query.edit) {
          this.edit = this.$route.query.edit
        }
        this.getDataList()
      }

    },
    methods: {
      getInfoNeedPws() {
        questShareinfo({
          "requestData": this.$route.query.share_id
        }).then(res => {
          if (res.data.pwd != null&&res.data.pwd!='') {
            this.loading=false
            this.needPwd = true
          } else {
            this.getShareInfo()
          }
        })
      },
      getShareInfo() {
        let that = this
        questPreviewByShare({
          "requestData": {
            pwd: this.share_pwd,
            shareid: this.$route.query.share_id
          }
        }).then(res => {
            if (new Date(res.data.etime.replace(/-/g, '/')).getTime() < new Date().getTime()) {
            this.$message({message: '该调查表已过期', type: 'info'})
          } else {
            this.needPwd = false
          }
          res.data.subjList.forEach(item => {
            let desc = []
            if (item.desc) {
              desc = item.desc.split('&&')
            }
            item.desc = desc
            if (item.subjmxList) {
              item.subjmxList.forEach(item_1 => {
                if (item_1.type == 2) {
                  if (item_1.answer) {
                    item_1.answer = item_1.answer.split(',').map(Number)

                  } else {
                    item_1.answer = []
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
          this.dataObject = res.data
          if(res.data.etime){
            this.timer = setInterval(function () {
              that.difference(that.dataObject.etime)
            }, 1000);
          }else{
            this.loading = false
          }
        })

      },
      firmPwd() {
        this.getShareInfo()
      },
      changeValue(value){
        if(value==1){
          updSharePwd({
            "requestData": {
              id: this.fenpei_id,
              pwd: '',
            }
          }).then(res => {
            if(!this.set_url){
              // this.showDialogNext = false
            }else{
              if(this.set_url.split('内容，').length>1){
                this.set_url = this.set_url.split('内容，')[0]+'内容'
              }
            }
            if(this.setPwd!=''){
              this.$message({
                message: '取消密码成功',
                type: 'success'
              })
            }
            this.setPwd=''
            this.shareQuest()
          })
        }
      },
      setPwdFn() {
        if (!this.setPwd) {
          this.$message({
            message: '请先输入密码',
            type: 'info'
          })
          this.loading = false
          return
        }
        updSharePwd({
          "requestData": {
            id: this.fenpei_id,
            pwd: this.setPwd,
          }
        }).then(res => {
          if(!this.set_url){
            // this.showDialogNext = false
            this.$message({
              message: '保存密码成功',
              type: 'success'
            })
            this.shareQuest()
          }else{
            this.set_url=this.set_url+'，查看密码为'+this.setPwd
            this.$message({
              message: '保存密码成功',
              type: 'success'
            })
            this.shareQuest()
          }

        })
      },
      fenpei() {
        if (this.choseAnswer.length == 0) {
          this.$message({
            message: '请至少选中一项题目',
            type: 'info'
          })
          return
        }
        var min;
        for(var i=0; i<this.choseAnswer.length; i++){
          for(var j=i; j<this.choseAnswer.length;j++){
            if(this.choseAnswer[i]>this.choseAnswer[j]){
              min=this.choseAnswer[j];
              this.choseAnswer[j]=this.choseAnswer[i];
              this.choseAnswer[i]=min;
            }
          }
        }
        doDist({
          requestData: {
            "id": JSON.parse(localStorage.getItem('role')).id,
            "org_id": this.$route.query.org_id,
            "publish_id": this.$route.query.que_id,
            "subjStr": this.choseAnswer.toString()
          }
        }).then(res => {
          this.shareQuest()
          let subjStr={subjStr:this.choseAnswer.toString()}
          let data={...res.data,...subjStr}
          this.setThisPwd(data,2)
        })
      },
      handleCheckAllChange(val) {
        let the_data = []
        this.dataAnswerList.forEach(item => {
          the_data.push(item.id)
        })
        this.choseAnswer = val ? the_data : [];
        this.isIndeterminate = false;
      },
      copyContent(){
        let the_class = '.copy-content'
        let clipboard = new Clipboard(the_class);
        clipboard.on('success', e => {
          this.$message({type: 'success', message: '复制成功'})
          // 释放内存
          clipboard.off('error')
          clipboard.off('success')
          clipboard.destroy()
        })
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.dataAnswerList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataAnswerList.length;
      },
      copyText(scope) {
        let the_class = '.tag-copy' + scope.row.id
        let clipboard = new Clipboard(the_class);
        clipboard.on('success', e => {
          this.$message({type: 'success', message: '复制成功'})
          // 释放内存
          clipboard.off('error')
          clipboard.off('success')
          clipboard.destroy()
        })
      },
      setThisPwd(data,type) {
        // type是判断分配完进入的还是设置密码进入
        this.showDialogNext = true
        this.setPwd = ''
        if (data.pwd) {
          this.setPwd = data.pwd
          this.switchRoles = 2
        } else {
          this.switchRoles = 1
        }
        if(type==2){
          this.choseAnswer=[]
          this.set_url = '请打开' + window.location.href.split('?')[0] + '?share_id=' + data.shareid + ',填报第' + data.subjStr + '题的内容'
        }else{
          this.set_url=''
        }
        this.fenpei_id = data.id
      },
      chexiao(data) {
        cancelDist({
          "requestData": data.id,
        }).then(res => {
          this.$message({
            message: res.returnMsg,
            type: 'success'
          })
          this.shareQuest()
        })
      },
      difference(endTime) {
        let that = this
        let dateBegin = new Date();
        let dateDiff = new Date(endTime.replace(/-/g, '/')).getTime() - dateBegin.getTime();//时间差的毫秒数
        if (dateDiff > 0) {
          this.has_time = true
          if (this.loading == true) {
            this.loading = false
          }
          let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
          let leave1 = dateDiff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
          let hours = Math.floor(leave1 / (3600 * 1000));//计算出小时数
          //计算相差分钟数
          let leave2 = leave1 % (3600 * 1000);   //计算小时数后剩余的毫秒数
          let minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
          //计算相差秒数
          let leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数
          let seconds = Math.round(leave3 / 1000);
          this.timeDiff = dayDiff + "天 " + hours + "小时 " + minutes + "分"
        } else {
          this.has_time = false
          this.loading = false
          clearInterval(that.timer)
        }
      },
      back() {
        this.$router.go(-1)
      },
      shareQuest() {
        this.showDialog = true
        questShareList({
          requestData: {
            "id": JSON.parse(localStorage.getItem('role')).id,
            "org_id": this.$route.query.org_id,
            "publish_id": this.$route.query.que_id
          },
        }).then(res => {
          res.data.forEach(item => {
            let the_url = ''
            if (item.pwd) {
              the_url = '请打开' + window.location.href.split('?')[0] + '?share_id=' + item.shareid + ',填报第' + item.subjStr + '题的内容，查看密码为' + item.pwd
            } else {
              the_url = '请打开' + window.location.href.split('?')[0] + '?share_id=' + item.shareid + ',填报第' + item.subjStr + '题的内容'
            }
            item.the_url = the_url
          })
          this.dataHasAnswerList = res.data
        })
        queryNotDistList({
          requestData: {
            "id": JSON.parse(localStorage.getItem('role')).id,
            "org_id": this.$route.query.org_id,
            "publish_id": this.$route.query.que_id
          },
        }).then(res => {
          this.dataAnswerList = res.data
        })
      },
      answer() {
        let that = this
        let answerList = []
        this.dataObject.subjList.forEach(item => {
          if (item.subjmxList) {
            item.subjmxList.forEach(item_1 => {
              if (item_1.answer) {
                const data = {}
                if (item_1.type == 2) {
                  if (item_1.answer.length > 0) {
                    data.answer = item_1.answer.toString()
                    data.answerid = item_1.answerid
                    data.subjmx_id = item_1.id
                    answerList.push(data)
                  }
                } else {
                  data.answer = item_1.answer
                  data.answerid = item_1.answerid
                  data.subjmx_id = item_1.id
                  answerList.push(data)
                }

              }

            })
          }
        })
        if (answerList.length > 0) {
          let the_data = {}
          if (this.sharePage) {
            the_data = {
              requestData: {
                answerList: answerList,
                shareid: this.$route.query.share_id,
              }
            }
          } else {
            the_data = {
              requestData: {
                answerList: answerList,
                org_id: this.$route.query.org_id,
                publish_id: this.$route.query.que_id,
              }
            }
          }
          savePreview(the_data).then(res => {
            this.$message({
              message: res.returnMsg,
              type: 'success'
            })
            setTimeout(function () {
              if (that.sharePage) {

              } else {
                that.$router.go(-1)
              }


            }, 500)
          })
        } else {
          this.$message({
            message: '至少填写一个答案',
            type: 'error'
          })
        }

      },
      getDataList() {
        let that = this
        if (this.requestDataId) {
          tempPreview({
            requestData: this.requestDataId,
          }).then(res => {
            res.data.subjList.forEach(item => {
              let desc = []
              if (item.desc) {
                desc = item.desc.split('&&')
              }
              item.desc = desc
              if (item.subjmxList) {
                item.subjmxList.forEach(item_1 => {
                  if (item_1.type == 2) {
                    if (item_1.answer) {
                      item_1.answer = item_1.answer.split(',').map(Number)

                    } else {
                      item_1.answer = []
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
            this.dataObject = res.data
            if(res.data.etime){
              this.timer = setInterval(function () {
                that.difference(that.dataObject.etime)
              }, 1000);
            }else{
              this.loading = false
            }

          })
        } else {
          questPreview({
            requestData: this.requestData,
          }).then(res => {
            res.data.subjList.forEach(item => {
              let desc = []
              if (item.desc) {
                desc = item.desc.split('&&')
              }
              item.desc = desc
              if (item.subjmxList) {
                item.subjmxList.forEach(item_1 => {
                  if (item_1.type == 2) {
                    if (item_1.answer) {
                      item_1.answer = item_1.answer.split(',').map(Number)

                    } else {
                      item_1.answer = []
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
            this.dataObject = res.data
            if(res.data.etime){
              this.timer = setInterval(function () {
                that.difference(that.dataObject.etime)
              }, 1000);
            }else{
              this.loading = false
            }
          })
        }
      },
      goAnchor(selector) {
        var anchor = this.$el.querySelector(selector)
        console.log(anchor.offsetTop)
        document.body.scrollTop = anchor.offsetTop - 20; // chrome
        document.documentElement.scrollTop = anchor.offsetTop - 20; // firefox
      },
      chose_activity(item, index) {
        this.chose_index = index
        this.dataObject.subjList.forEach(item => {
          item.color = '#B5B5B5'
        })
        this.dataObject.subjList[index].color = '#2375FE'
        this.goAnchor('#herf_' + parseInt(index))
      }
    }
  }
</script>
<style lang="scss">
  .el-radio__input.is-disabled.is-checked .el-radio__original{
    z-index:100;
    opacity: 1;
    left: -10px;
    top: -8px;
  }
  .el-radio__input.is-disabled.is-checked .el-radio__inner {
   display: none;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__original{

    z-index:100;
    opacity: 1;
    left: -10px;
    width: 14px;
    height: 14px;
    top: -8px;
  }
  .el-checkbox__input.is-disabled.is-checked{
    margin-left: 10px;
  }
  .el-checkbox.is-disabled.is-checked .el-checkbox__label{
    margin-left: 4px;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    display: none;
  }
  .detail .el-loading-parent--relative{
    height: 100%;
  }
  .detail .el-loading-mask{
    height: 100%;
  }
  .less-height .el-progress-circle {
    width: 40px !important;
    height: 40px !important;
  }

  .less-height .el-progress__text {
    font-size: 12px !important;
  }
  .el-table--enable-row-transition .el-table__body td{
    font-weight: normal;
  }
</style>
<style scoped lang="scss">
  .detail {
    height: 100vh;
    width: 100%;
    background: #fff;
    /*overflow: hidden;*/
    .mr-20 {
      margin-right: 20px;
    }

    .top-header {
      height: 80px;
      width: 100vw;
      position: fixed;
      z-index: 1500;
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

          .div1 {
            height: 50px;
            line-height: 60px;
          }

          .div2 {
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
          width: 240px;
          line-height: 20px;
          position: fixed;
          top: 150px;
          height: calc(100vh - 150px);
          z-index: 300;

          .left-list {
            width: 98%;
            margin-top: 24px;
            border-top: 1px solid #E9EEF2;

            .herf_a {
              color: #999;
            }
          }
        }

        /*.grid-title {*/
        /*margin-top: 40px;*/
        /*font-size: 20px;*/
        /*margin-bottom: 32px;*/
        /*font-weight: bold;*/
        /*text-align: center;*/
        /*}*/

        /*.grid-org {*/
        /*margin-bottom: 24px;*/
        /*text-align: center;*/
        /*}*/

        /*.grid-disc {*/
        /*text-indent: 36px;*/
        /*line-height: 24px;*/
        /*font-size: 18px;*/
        /*}*/
        /*.list-title{*/
        /*font-weight: bold;*/
        /*}*/
        /*.list-desc {*/
        /*margin-top: 16px;*/
        /*color: #ccc;*/
        /*font-size: 18px;*/
        /*text-indent: 18px;*/
        /*margin-bottom: 30px;*/
        /*list-style-type: disc;*/
        /*}*/

        /*.li-form {*/
        /*margin-bottom: 32px;*/
        /*}*/

        /*.li-forminfo {*/
        /*margin-top: 16px;*/
        /*}*/

        /*.right-info-box {*/
        /*!*height: 1600px;*!*/
        /*!*overflow: auto;*!*/
        /*}*/
      }
    }
  }

  .active_color {
    color: #1F72FA;
  }

  /*去除页眉页脚*/
  @page {
    /*margin-top: 0mm;*/
    size: auto;   /* auto is the initial value */
    /*margin: 3mm;  !* this affects the margin in the printer settings *!*/
  }

  html {
    background-color: #FFFFFF;
    /*margin: 0;  !* this affects the margin on the html before sending to printer *!*/
  }

  body {
    border: solid 1px blue;
  }

  /*去除页眉页脚*/
</style>
