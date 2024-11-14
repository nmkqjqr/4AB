import { Check, DocumentAdd } from '@element-plus/icons-vue'

import BpmAgreeDialog from './agreeDialog.vue'

/**
 *  按钮配置
 *  大多都用 意见对话框,如果为null，找不到 则不弹窗
 */
export const actionDialogConfig = {
  jumpActions: ['externalEventSave'],

  externalEventStart: {
    component: markRaw(BpmAgreeDialog),
    css: 'success',
    icon: Check,
  },
  externalEventSubmit: {
    component: markRaw(BpmAgreeDialog),
    css: 'success',
    icon: Check,
  },
  externalEventSave: {
    component: null,
    css: 'primary',
    icon: DocumentAdd,
  },
}
