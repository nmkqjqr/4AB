<template>
  <div>
    <el-container>
      <el-header
        style="
          padding-left: 0px;
          margin-bottom: 8px;
          font-size: 14px;
          text-align: left;
        "
      >
        <el-popover placement="left" trigger="hover" width="460px">
          <template #reference>
            <div>
              <h2
                style="
                  padding-left: 6px;
                  margin-top: 0px;
                  margin-bottom: 10px;
                  border-left: 4px solid #1890ff;
                "
              >
                {{ $abT('bpm.office.dynamicSquare', '动态广场') }}
              </h2>

              <el-text type="primary" style="margin-bottom: 5px">
                {{ getContentDesc() }}
              </el-text>
            </div>
          </template>
          <template #default>
            <task-durms :data-list="pieInfo.dataList" style="float: left" />
          </template>
        </el-popover>
      </el-header>
      <el-main
        style="
          padding: 12px 12px 12px 0;
          background-color: #fff;
          border-top: 1px dashed #ccc;
        "
        :style="{ height: discussData.height }"
      >
        <time-line
          :data-list="instanceDymic.nodeDynamicList"
          @add-laud="addLaud"
          @open-dialog="openDialog"
        />
      </el-main>
    </el-container>

    <el-dialog
      v-model="dialogInfo.dialogVisible"
      :destroy-on-close="true"
      :title="dialogInfo.title"
      width="30%"
      @close="canclDialog"
    >
      <el-form
        ref="formRef"
        label-suffix="："
        label-width="100px"
        :model="discussData"
      >
        <el-form-item
          :label="$abT('page.common.content', '内容')"
          prop="content"
          :rules="{
            required: true,
            message: $abT('page.common.required', '必填'),
          }"
        >
          <el-input
            v-model="discussData.content"
            :placeholder="$abT('page.common.pleaseEnterContent', '请输入内容')"
            :rows="4"
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          v-if="dialogInfo.type === 2"
          :label="$abT('bpm.office.sendNotifications', '发送通知')"
          prop="sendMsg"
        >
          <el-switch
            v-model="discussData.sendMsg"
            :active-text="$abT('page.common.yes', '是')"
            :inactive-text="$abT('page.common.no', '否')"
            inline-prompt
          />
        </el-form-item>
        <el-form-item
          v-if="discussData.sendMsg"
          :label="$abT('bpm.office.messageType', '消息类型')"
          prop="msgType"
          :rules="{
            required: true,
            message: $abT(
              'bpm.office.selectOneMsgType',
              '至少选择一个消息类型'
            ),
            trigger: 'change',
          }"
        >
          <ab-msg-type
            v-model="discussData.msgType"
            :not-support-type="['dingding', 'dingdingtodo']"
          />
        </el-form-item>
        <el-form-item
          v-if="discussData.sendMsg"
          :label="$abT('bpm.office.recipient', '接收人')"
          prop="receiverList"
          :rules="{
            required: true,
            message: $abT(
              'bpm.office.selectAtLeastOnePerson',
              '至少选择一个人'
            ),
            trigger: 'change',
          }"
        >
          <el-select
            v-model="discussData.receiverList"
            multiple
            :placeholder="
              $abT('page.common.pleaseSelectPersonnel', '请选择人员')
            "
            style="width: 240px"
            value-key="id"
          >
            <el-option
              v-for="item in discussData.approveList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="discussData.type === 2"
          :label="$abT('bpm.office.private', '私密')"
          prop="secret"
        >
          <el-switch
            v-model="discussData.secret"
            :active-text="$abT('page.common.yes', '是')"
            :inactive-text="$abT('page.common.no', '否')"
            inline-prompt
          />
        </el-form-item>
        <el-form-item :label="$abT('page.common.attachment', '附件')">
          <ab-upload-file
            v-model="discussData.attachment"
            dic-code="ywfj"
            size="default"
            :multiple="true"
            :limit="5"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="canclDialog">
            {{ $abT('page.common.cancel', '取消') }}
          </el-button>
          <el-button type="primary" @click="addDiscuss">
            {{ $abT('page.common.ok', '确定') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  declare interface NodeDynamic {
    nodeName: string
    nodeKey: string
    status: string
    laudCount: number
    estimateCompleteTime: string
    discussesList: NodeDiscuss[]
    candidateNames: string
    approveNames: string[]
    approveIds: string[]
    icon: string
    estimateCompleteTimeStr: string
    approveName: string
    buttonType: number
  }
  declare interface NodeDiscuss {
    content: string
    /**
     * 类型：0:提交，1：附言，2：评论，3：点赞
     */
    type: number
    createTime: string
    creator: string
    opinionId: string
  }
</script>

<script lang="ts" setup>
  import {
    ArrowDownBold,
    CircleCheckFilled,
    Loading,
  } from '@element-plus/icons-vue'
  import { bpmApi, abMsgType, abUtil, abTools, abUploadFile } from '~/agilebpm'
  import { ElMessage, FormInstance } from 'element-plus'
  import { useUserStore } from '@/store/modules/user'
  import taskDurms from './task-durms.vue'
  import timeLine from './time-line.vue'
  import { isSmallScreenWidth } from './myTaskConfig'
  import { abT } from '@/i18n'
  const props = defineProps({
    instance: { type: Object, required: true },
    taskKey: { type: String, required: false, default: null },
  })
  //当前用户信息
  const userInfo = useUserStore().abUser
  //对话框信息
  const dialogInfo: any = reactive({
    dialogVisible: false,
    title: '附言',
    type: 1,
  })
  //提交评论，附言，点赞 数据
  const discussData = reactive({
    instId: props.instance.id,
    opinionId: '',
    taskKey: '',
    taskName: '',
    content: '',
    type: 1,
    secret: false,
    attachment: '',
    msgType: '',
    sendMsg: false,
    receiverList: [] as any,
    approveList: [] as any,
    height: ` ${
      isSmallScreenWidth(window.innerWidth)
        ? window.innerHeight - 150
        : window.innerHeight - 299
    }px`,
  })

  const instanceDymic: any = reactive({
    estimateCompleteTime: '',
    estimateCompleteTimeStr: '',
    nodeDynamicList: [] as NodeDynamic[],
  })

  const pieInfo = reactive({
    visible: false,
    dataList: [] as any,
  })

  const formRef = ref<FormInstance>()

  //获取节点信息
  const getNodeInfoList = () =>
    bpmApi.nodeDynamic.getDiscussNodeInfo(props.instance.id).then((result) => {
      const instanceInfo = result.data
      instanceDymic.estimateCompleteTime = instanceInfo.estimateCompleteTime
      instanceDymic.estimateCompleteTimeStr =
        instanceInfo.estimateCompleteTimeStr
      const nodeList = instanceInfo.nodeDynamicList
      const firstNode = nodeList.shift()
      firstNode.nodeName = abT('bpm.office.start', '开始')
      //填充开始节点的审批人信息
      firstNode.approveInfo = `${instanceInfo.bpmInstance.createBy}-${instanceInfo.bpmInstance.creator}`

      nodeList.splice(0, 0, firstNode)
      //结束节点
      if (
        nodeList.some(
          (item: NodeDynamic) =>
            item.nodeKey.startsWith('EndEvent') ||
            item.nodeKey.startsWith('EndNoneEvent')
        )
      ) {
        nodeList.pop()
      }

      nodeList.push({
        nodeName: abT('constant.OpinionStatus.COMPLETED.value', '结束'),
        nodeKey: 'EndEvent',
        icon: CircleCheckFilled,
        statusValue: abT('constant.OpinionStatus.COMPLETED.value', '结束'),
      })
      pieInfo.dataList.splice(0, pieInfo.dataList.length)
      //填充节点样式
      nodeList.forEach((element: any) => {
        if (element.durMs && element.durMs > 10000) {
          pieInfo.dataList.push({
            value: element.durMs,
            name: `${element.nodeName}${abT(
              'bpm.office.timeConsumingDy',
              '耗时'
            )}:${abUtil.timeLag(element.durMs, 2)}`,
          })
        }
        element.statusLabelCss = '#909399'
        if (element.status === 'processing') {
          element.icon = Loading
          element.statusLabelCss = '#409EFF'
        } else if (
          (element.approveIds && element.approveIds.length > 0) ||
          element.status == 'skip' ||
          element.status == 'start'
        ) {
          element.statusLabelCss = '#67C23A'
        }
        if (!element.icon) {
          element.icon = ArrowDownBold
        }
        if (element.nodeKey.startsWith('EndEvent') && props.instance.endTime) {
          element.statusLabelCss = '#67C23A'
        }
      })
      instanceDymic.nodeDynamicList = nodeList
    })

  const getContentDesc = () => {
    if (props.instance.endTime) {
      return abT('bpm.office.processCompletedOn', '流程于{a}完成', {
        a: props.instance.endTime,
      })
    }

    const estimate = new Date(instanceDymic.estimateCompleteTime)
    const current = new Date()
    const leqt = estimate.getTime() - current.getTime()
    if (leqt > 0) {
      return abT(
        'bpm.office.processCompletedExpectedOn',
        '流程预计于 {a} 完成，大约还需要 {b}。',
        { a: instanceDymic.estimateCompleteTimeStr, b: abUtil.timeLag(leqt, 2) }
      )
    }
    return abT(
      'bpm.office.approximatelyMore',
      '流程预计于 {a} 完成，已超期{b}。',
      {
        a: instanceDymic.estimateCompleteTimeStr,
        b: abUtil.timeLag(current.getTime() - estimate.getTime(), 2),
      }
    )
  }

  const buildDiscussData = (nodeInfo: NodeDynamic, type: number) => {
    discussData.taskKey = nodeInfo.nodeKey
    discussData.taskName = nodeInfo.nodeName
    discussData.type = type
    discussData.opinionId = nodeInfo.discussesList[0].opinionId
  }

  const canclDialog = () => {
    dialogInfo.dialogVisible = false
    discussData.opinionId = ''
    discussData.taskKey = ''
    discussData.taskName = ''
    discussData.content = ''
    discussData.type = 1
    discussData.secret = false
    discussData.attachment = null
    discussData.msgType = ''
    discussData.sendMsg = false
    discussData.receiverList = []
    discussData.approveList = []
  }

  //打开对话框
  const openDialog = (nodeInfo: NodeDynamic, type: number) => {
    dialogInfo.dialogVisible = true
    dialogInfo.title =
      type === 2
        ? abT('bpm.office.comment', '评论')
        : abT('bpm.office.postscript', '附言')
    dialogInfo.type = type
    buildDiscussData(nodeInfo, type)
    //只有评论的时候才发通知
    if (type == 2) {
      discussData.receiverList = getNodeApproveInfo(nodeInfo)
      getApproveList()
    }
  }

  const getNodeApproveInfo = (node: NodeDynamic) => {
    const result = [] as any
    if (!node.approveNames || node.approveNames.length === 0) {
      return result
    }
    const approveListStr = node.approveNames
    if (approveListStr && approveListStr.length > 0) {
      for (const index in approveListStr) {
        const approveItem = approveListStr[index]
        const approveId = approveItem.split('-')[0]
        const approveName = approveItem.split('-')[1]
        if (approveId && approveId !== 'null') {
          result.push({
            id: approveId,
            name: approveName,
            type: 'user',
          })
        }
      }
    }
    return result
  }

  //获取发送信息的人员列表
  const getApproveList = () => {
    const nodeList = instanceDymic.nodeDynamicList
    const allApproveList = [] as any
    const idList = [] as any
    for (let i = 0; i < nodeList.length; i++) {
      const approveList = getNodeApproveInfo(nodeList[i])
      if (approveList && approveList.length > 0) {
        for (const index in approveList) {
          //防重
          if (idList.indexOf(approveList[index].id) === -1) {
            allApproveList.push(approveList[index])
          }
          idList.push(approveList[index].id)
        }
      }
    }
    discussData.approveList = allApproveList
  }

  const saveDiscussData = (discussData: any) => {
    bpmApi.nodeDynamic
      .saveDiscussData(discussData)
      .then((result) => {
        getNodeInfoList()
        ElMessage({ message: result.msg, type: 'success' })
      })
      .catch((result) => {
        ElMessage({
          message: `${abT(
            'page.common.saveFailedMsg',
            '保存失败请联系管理员'
          )}！${result}`,
          type: 'error',
        })
      })
  }

  //新增评论或者附言
  const addDiscuss = () => {
    abTools.formValidate(formRef.value)?.then((data) => {
      dialogInfo.dialogVisible = false
      saveDiscussData(discussData)
    })
  }
  //点赞
  const addLaud = (nodeDynamic: NodeDynamic) => {
    buildDiscussData(nodeDynamic, 3)
    saveDiscussData(discussData)
  }

  const windowWith = ref(0)
  const getWindowWidth = () => {
    windowWith.value = window.innerWidth
  }

  onMounted(() => {
    getNodeInfoList()
    getWindowWidth()
    window.addEventListener('resize', getWindowWidth)
  })
</script>

<style lang="scss" scoped>
  .cardStyle {
    float: right;
    width: 80%;
    .pTitle {
      margin: 0;
      margin: 0;
      font-size: 13px;
      font-weight: 530;
      letter-spacing: 0.5px;
    }
    .pTime {
      margin: 8px 0 0 0;
      font-size: 10px;
      color: rgb(143, 139, 139);
      letter-spacing: 0.5px;
    }
    :deep() {
      .el-card__body {
        padding: 8px;
      }
    }
  }
  .timestampClass {
    padding: 2px;
    margin-bottom: 12px;
    overflow: hidden;
    .timestampSpan {
      float: left;
    }
    .timestampDiv {
      float: right;
      margin-top: 8px;
      margin-right: 15px;
    }
  }
</style>
