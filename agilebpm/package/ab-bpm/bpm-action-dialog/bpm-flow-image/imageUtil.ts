import {
  Check, //完成
  Loading,
  Promotion, // 传阅，抄送
  CircleClose, // 终止
  Close, // 关闭
  Back,
  RefreshLeft,
  ArrowRight, // 跳过
  Bell, // 催办
  SwitchButton, // 终止
  Flag,
} from '@element-plus/icons-vue'
import { abT } from '@/i18n'

export const opinionConfig = computed(() => {
  return {
    processing: {
      name: abT('constant.OpinionStatus.PROCESSING.value', '审批中'),
      color: '#ed4014',
      icon: markRaw(Loading),
    },
    agree: {
      name: abT('constant.OpinionStatus.AGREE.value', '同意'),
      color: '#19be6b',
      icon: markRaw(Check),
    },
    carbonCopy: {
      name: abT('bpm.office.cc', '抄送'),
      icon: markRaw(Promotion),
      color: '#3c763d',
    },
    turn: {
      name: abT('constant.OpinionStatus.TURN.value', '转办'),
      icon: markRaw(Promotion),
      color: '#3c763d',
    },
    postscript: {
      name: abT('constant.OpinionStatus.POSTSCRIPT.value', '附言'),
      icon: markRaw(Promotion),
      color: '#3c763d',
    },

    oppose: {
      name: abT('constant.OpinionStatus.OPPOSE.value', '反对'),
      color: '#ff9900',
      icon: markRaw(CircleClose),
    },
    reject: {
      name: abT('constant.OpinionStatus.REJECT.value', '驳回'),
      color: '#ff9900',
      icon: markRaw(Back),
    },
    rejectToStart: {
      name: abT('bpm.office.rejectInitiator', '驳回发起人'),
      icon: markRaw(Back),
      color: '#ff9900',
    },
    revoke: {
      name: abT('constant.OpinionStatus.REVOKER.value', '撤销'),
      color: '#ed4014',
      icon: markRaw(RefreshLeft),
    },
    recall: {
      name: abT('constant.OpinionStatus.RECALL.value', '撤回'),
      color: '#ff9900',
      icon: markRaw(RefreshLeft),
    },
    recall_to_start: {
      name: abT('bpm.office.revokeInitiator', '撤回发起人'),
      icon: markRaw(RefreshLeft),
      color: '#ff9900',
    },
    signPass: {
      name: abT('constant.OpinionStatus.SIGN_AGREE.value', '会签同意'),
      icon: markRaw(Check),
      color: '#3c763d',
    },
    signNotPass: {
      name: abT('constant.OpinionStatus.SIGN_OPPOSE.value', '会签反对'),
      icon: markRaw(CircleClose),
      color: '#ed4014',
    },
    signRecycle: {
      name: abT('bpm.office.countersignRecycling', '会签回收'),
      icon: markRaw(Close),
      color: '#3c763d',
    },
    skip: {
      name: abT('constant.OpinionStatus.SKIP.value', '跳过执行'),
      icon: markRaw(ArrowRight),
      color: '#3c763d',
    },
    manualEnd: {
      name: abT('constant.OpinionStatus.MANUAL_END.value', '人工终止'),
      icon: markRaw(SwitchButton),
      color: '#ed4014',
    },
    cancelled: {
      name: abT('constant.OpinionStatus.CANCELLED.value', '任务取消'),
      icon: markRaw(Close),
      color: '#808695',
    },
    recycle: {
      name: abT('constant.OpinionStatus.RECYCLE.value', '任务回收'),
      icon: markRaw(Close),
      color: '#808695',
    },
    pending: {
      name: abT('constant.OpinionStatus.PENDING.value', '待办理'),
      icon: markRaw(Flag),
      color: '#808695',
    },
    success: {
      name: abT('constant.OpinionStatus.SUCCESS.value', '执行成功'),
      icon: markRaw(Check),
      color: '#19be6b',
    },
    failed: {
      name: abT('constant.OpinionStatus.FAILED.value', '执行失败'),
      icon: markRaw(Close),
      color: '#ed4014',
    },
    externalEventSubmit: {
      name: abT(
        'constant.OpinionStatus.EXTERNAL_EVENT_SUBMIT.value',
        '外部提交'
      ),
      icon: markRaw(Check),
      color: '#19be6b',
    },
  }
})
