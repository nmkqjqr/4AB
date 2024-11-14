import {
  Position,
  Check,
  DocumentAdd,
  Promotion, // 传阅
  Back,
  Reading,
  ChatLineSquare, // 历史
  CircleClose, // 终止
  PictureFilled, // 流程图
  Close, // 关闭
  Bell, // 催办
  Connection, // 自定义任务
  Printer, //打印
  QuestionFilled, // 说明文档
  AlarmClock, //催办
  Switch, //转办
  Refresh, //超管跳转
  DataLine,
  Mug,
  Comment,
  MagicStick,
  Delete,
  DocumentCopy,
  WarnTriangleFilled,
} from '@element-plus/icons-vue'

import BpmOpinionDialog from './bpm-opinion-dialog/bpm-opinion-dialog.vue'

import BpmRestartDialog from './bpm-restart-dialog.vue'

import bpmApproveHistoryDialog from './bpm-approve-history-dialog.vue'

import bpmTurnDialog from './bpm-turn-dialog.vue'

import bpmFreeJumpDialog from './bpm-free-jump-dialog.vue'

import bpmPrintDialog from './bpm-print-dialog.vue'

import bpmRejectDialog from './bpm-reject-dialog.vue'

import bpmReminderDialog from './bpm-reminder-dialog.vue'

import bpmExternalReminderDialog from './bpm-external-reminder-dialog.vue'

import bpmImageDialog from './bpm-flow-image/bpm-image-dialog.vue'

import bpmCarbonCopyDialog from './bpm-carbon-copy-dialog.vue'

import bpmCarbonCopyReviewDialog from './bpm-carbon-copy-review-dialog.vue'

import BpmSignAgreeDialog from './bpm-sign/bpm-sign-agree-dialog.vue'

import BpmSignManageDialog from './bpm-sign/bpm-sign-manage-dialog.vue'

import BpmSignStartDialog from './bpm-sign/bpm-sign-start-dialog.vue'

import bpmRecallDialog from './bpm-recall-dialog.vue'

import bpmExplainDialog from './bpm-explain-dialog.vue'

import bpmJustOpinionDialog from './bpm-just-opinion-dialog.vue'

import bpmRelevantDataDialog from './bpm-relevant-data-dialog.vue'

import bpmWordDialog from './bpm-word-dialog.vue'

/**
 *  按钮配置
 *  大多都用 意见对话框,如果为null，找不到 则不弹窗
 */
export const actionDialogConfig = {
  doActionNotBack2ListActions: ['signManage', 'carbonCopy', 'reminder'],
  start: {
    component: markRaw(BpmOpinionDialog),
    css: 'success',
    icon: Position,
  },
  instanceRestart: {
    component: markRaw(BpmRestartDialog),
    css: 'success',
    icon: Position,
  },
  agree: {
    component: markRaw(BpmOpinionDialog),
    css: 'success',
    icon: Check,
  },

  skip: {
    component: markRaw(BpmOpinionDialog),
    css: 'primary',
    icon: Refresh,
  },
  save: {
    component: null,
    css: 'success',
    icon: DocumentAdd,
  },
  //审批历史
  taskOpinion: {
    component: markRaw(bpmApproveHistoryDialog),
    css: 'primary',
    icon: ChatLineSquare,
  },
  //流程图
  flowImage: {
    component: markRaw(bpmImageDialog),
    css: 'primary',
    icon: PictureFilled,
  },
  oppose: {
    component: markRaw(BpmOpinionDialog),
    css: 'warning',
    icon: WarnTriangleFilled,
  },
  signStart: {
    component: markRaw(BpmSignStartDialog),
    css: 'success',
    icon: MagicStick,
  },
  signOppose: {
    component: markRaw(BpmSignAgreeDialog),
    css: 'warning',
    icon: Mug,
  },
  signAgree: {
    component: markRaw(BpmSignAgreeDialog),
    css: 'success',
    icon: DataLine,
  },
  signWaive: {
    component: markRaw(BpmSignAgreeDialog),
    css: 'warning',
    icon: Delete,
  },
  signManage: {
    component: markRaw(BpmSignManageDialog),
    css: 'success',
    icon: Comment,
  },
  //驳回
  reject: {
    component: markRaw(bpmRejectDialog),
    css: 'warning',
    icon: Back,
  },
  //驳回到发起人
  reject2Start: {
    component: markRaw(BpmOpinionDialog),
    css: 'warning',
    icon: Back,
  },
  //人工终止
  manualEnd: {
    component: markRaw(bpmJustOpinionDialog),
    css: 'danger',
    icon: CircleClose,
  },
  //撤回
  recall: {
    component: markRaw(bpmRecallDialog),
    css: 'warning',
    icon: Back,
  },
  //撤销
  revoke: {
    component: markRaw(bpmJustOpinionDialog),
    css: 'danger',
    icon: CircleClose,
  },
  dynamicTaskAgree: {
    component: markRaw(BpmOpinionDialog),
    css: 'success',
    icon: 'ios-send',
  },
  dynamicTaskOppose: {
    component: markRaw(BpmOpinionDialog),
    css: 'warning',
    icon: 'ios-send',
  },
  addDoAgree: {
    component: 'TODO 对话框',
    css: 'success',
    icon: 'ios-send',
  },
  //超管终止
  instanceEnd: {
    component: markRaw(bpmJustOpinionDialog),
    css: 'danger',
    icon: CircleClose,
  },
  cloase: {
    component: null,
    css: 'danger',
    icon: Close,
  },
  //转办
  turn: {
    component: markRaw(bpmTurnDialog),
    css: 'success',
    icon: Position,
  },
  //超管跳转
  taskFreeJump: {
    component: markRaw(bpmFreeJumpDialog),
    css: 'success',
    icon: Position,
  },
  //打印
  printed: {
    component: markRaw(bpmPrintDialog),
    css: 'primary',
    icon: Printer,
  },
  //催办
  reminder: {
    component: markRaw(bpmReminderDialog),
    css: 'primary',
    icon: Bell,
  },

  //外部事项催办
  externalEventReminder: {
    component: markRaw(bpmExternalReminderDialog),
    css: 'primary',
    icon: Bell,
  },
  //传阅
  carbonCopy: {
    component: markRaw(bpmCarbonCopyDialog),
    css: 'primary',
    icon: Promotion,
  },
  //审阅
  carbonCopyReview: {
    component: markRaw(bpmCarbonCopyReviewDialog),
    css: 'primary',
    icon: Reading,
  },
  //流程指引
  nodeExplain: {
    component: markRaw(bpmExplainDialog),
    css: 'primary',
    icon: Promotion,
  },
  //相关数据
  relevantData: {
    component: markRaw(bpmRelevantDataDialog),
    css: 'primary',
    icon: DocumentCopy,
  },
  //相关数据
  wordTemplate: {
    component: markRaw(bpmWordDialog),
    css: 'primary',
    icon: Printer,
  },
}
